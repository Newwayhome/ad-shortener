const { nanoid } = require('nanoid');
const Url = require('../models/Url');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Create a new short URL
// @route   POST /api/urls
// @access  Private
exports.createShortUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias } = req.body;

    // Validate URL
    try {
      new URL(originalUrl);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL'
      });
    }

    // Generate short URL
    const shortUrl = customAlias || nanoid(10);

    // Check if custom alias is already taken
    if (customAlias) {
      const existingUrl = await Url.findOne({ shortUrl: customAlias });
      if (existingUrl) {
        return res.status(400).json({
          success: false,
          error: 'Custom alias is already taken'
        });
      }
    }

    // Create URL
    const url = await Url.create({
      user: req.user.id,
      originalUrl,
      shortUrl,
      customAlias: customAlias || null
    });

    res.status(201).json({
      success: true,
      data: url
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all URLs for current user
// @route   GET /api/urls
// @access  Private
exports.getUrls = async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user.id })
      .sort('-createdAt');

    res.json({
      success: true,
      count: urls.length,
      data: urls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get URL details
// @route   GET /api/urls/:id
// @access  Private
exports.getUrl = async (req, res) => {
  try {
    const url = await Url.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        error: 'URL not found'
      });
    }

    res.json({
      success: true,
      data: url
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Redirect to original URL
// @route   GET /api/urls/redirect/:shortUrl
// @access  Public
exports.redirectToUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ shortUrl: req.params.shortUrl });

    if (!url) {
      return res.status(404).json({
        success: false,
        error: 'URL not found'
      });
    }

    // Update click count
    url.totalClicks += 1;
    url.clicks.push({
      ip: req.ip,
      country: req.headers['cf-ipcountry'] || 'Unknown',
      browser: req.headers['user-agent'],
      device: req.headers['sec-ch-ua-platform'] || 'Unknown'
    });

    // Calculate earnings
    const earnings = url.calculateEarnings();
    url.earnings = earnings;

    await url.save();

    // Update user's wallet balance
    const user = await User.findById(url.user);
    user.walletBalance += earnings;
    user.totalEarnings += earnings;
    await user.save();

    // Create transaction record
    await Transaction.create({
      user: url.user,
      type: 'EARNING',
      amount: earnings,
      status: 'COMPLETED',
      description: `Earnings from URL: ${url.shortUrl}`,
      reference: url._id.toString()
    });

    // Redirect to interstitial page
    res.redirect(`/interstitial/${url.shortUrl}`);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get URL statistics
// @route   GET /api/urls/:id/stats
// @access  Private
exports.getUrlStats = async (req, res) => {
  try {
    const url = await Url.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        error: 'URL not found'
      });
    }

    // Calculate statistics
    const stats = {
      totalClicks: url.totalClicks,
      earnings: url.earnings,
      clicksByCountry: {},
      clicksByDevice: {},
      clicksByBrowser: {},
      clicksByDay: {}
    };

    // Process click data
    url.clicks.forEach(click => {
      // Country stats
      stats.clicksByCountry[click.country] = (stats.clicksByCountry[click.country] || 0) + 1;

      // Device stats
      stats.clicksByDevice[click.device] = (stats.clicksByDevice[click.device] || 0) + 1;

      // Browser stats
      stats.clicksByBrowser[click.browser] = (stats.clicksByBrowser[click.browser] || 0) + 1;

      // Daily stats
      const day = click.timestamp.toISOString().split('T')[0];
      stats.clicksByDay[day] = (stats.clicksByDay[day] || 0) + 1;
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}; 
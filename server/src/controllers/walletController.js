const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Get wallet balance and transactions
// @route   GET /api/wallet
// @access  Private
exports.getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const transactions = await Transaction.find({ user: req.user.id })
      .sort('-createdAt')
      .limit(10);

    res.json({
      success: true,
      data: {
        balance: user.walletBalance,
        totalEarnings: user.totalEarnings,
        totalWithdrawals: user.totalWithdrawals,
        transactions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Request withdrawal
// @route   POST /api/wallet/withdraw
// @access  Private
exports.requestWithdrawal = async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user.id);

    // Validate withdrawal amount
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid withdrawal amount'
      });
    }

    // Check minimum withdrawal amount
    const minWithdrawal = process.env.MIN_WITHDRAWAL_AMOUNT || 50;
    if (amount < minWithdrawal) {
      return res.status(400).json({
        success: false,
        error: `Minimum withdrawal amount is $${minWithdrawal}`
      });
    }

    // Check if user has sufficient balance
    if (amount > user.walletBalance) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient balance'
      });
    }

    // Create withdrawal transaction
    const transaction = await Transaction.create({
      user: req.user.id,
      type: 'WITHDRAWAL',
      amount,
      status: 'PENDING',
      description: 'Withdrawal request',
      reference: `WD-${Date.now()}`
    });

    // Update user's wallet balance
    user.walletBalance -= amount;
    user.totalWithdrawals += amount;
    await user.save();

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get transaction history
// @route   GET /api/wallet/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const transactions = await Transaction.find({ user: req.user.id })
      .sort('-createdAt')
      .skip(startIndex)
      .limit(limit);

    const total = await Transaction.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get transaction details
// @route   GET /api/wallet/transactions/:id
// @access  Private
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}; 
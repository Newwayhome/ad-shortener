const express = require('express');
const {
  createShortUrl,
  getUrls,
  getUrl,
  redirectToUrl,
  getUrlStats
} = require('../controllers/urlController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Protect all routes

router.route('/')
  .post(createShortUrl)
  .get(getUrls);

router.route('/:id')
  .get(getUrl);

router.route('/:id/stats')
  .get(getUrlStats);

router.get('/redirect/:shortUrl', redirectToUrl);

module.exports = router; 
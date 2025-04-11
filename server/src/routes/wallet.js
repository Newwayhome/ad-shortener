const express = require('express');
const {
  getWallet,
  requestWithdrawal,
  getTransactions,
  getTransaction
} = require('../controllers/walletController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Protect all routes

router.route('/')
  .get(getWallet);

router.route('/withdraw')
  .post(requestWithdrawal);

router.route('/transactions')
  .get(getTransactions);

router.route('/transactions/:id')
  .get(getTransaction);

module.exports = router; 
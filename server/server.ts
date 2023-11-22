const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json()); // This is needed to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // This is needed to parse URL-encoded bodies
app.use(cors());
let accounts = require('./accounts.json').data;

function initiateSEPAPayment() {
  return new Promise((resolve, reject) => {
    // Generate a random number between 0 and 1
    const randomNumber = Math.random();

    // If the random number is less than 0.5, resolve the promise with a success message
    if (randomNumber < 0.5) {
      resolve({
        status: 'success',
        paymentId: '123456',
        message: 'Payment initiated successfully'
      });
    }
    // Otherwise, reject the promise with an error message
    else {
      reject({
        status: 'error',
        errorCode: '1001',
        errorMessage: 'Insufficient funds'
      });
    }
  });
}

app.get('/accounts', (req, res) => {
  let { balance_gt, balance_lt, page, limit } = req.query;

  balance_gt = balance_gt ? parseFloat(balance_gt) : -Infinity;
  balance_lt = balance_lt ? parseFloat(balance_lt) : Infinity;
  page = page ? parseInt(page) : 1;
  limit = limit ? parseInt(limit) : 10;

  let filteredAccounts = accounts.filter((account) => {
    let balance = account.balances.available.value;
    return balance > balance_gt && balance < balance_lt;
  });

  let paginatedAccounts = filteredAccounts.slice((page - 1) * limit, page * limit);

  res.json(paginatedAccounts);
});

app.post('/transfer', (req, res) => {
  let { sourceAccount, amount, recipientName, targetIBAN, targetBIC, reference } = req.body;

  // Validate the payment details
  if (!sourceAccount || !amount || !recipientName || !targetIBAN || !targetBIC || !reference) {
    console.log('Invalid payment details - Transaction aborted');
    console.log(`Reference: ${reference}`);
    console.log(`Status: error`);
    return res.status(400).json({ status: 'error', errorMessage: 'Invalid payment details' });
  }

  // log the transfer details
  console.log(`Transferring ${amount} from ${sourceAccount} to ${targetIBAN} (${targetBIC})`);

  // Initiate the SEPA payment
  initiateSEPAPayment(sourceAccount, amount, recipientName, targetIBAN, targetBIC, reference)
    .then((response) => {
      // If the payment was successful, send a response
      console.log(`Reference: ${reference}`);
      console.log(`Status: ${response.status}`);
      res.json(response);
    })
    .catch((error) => {
      // If there was an error, send an error response
      console.log(`Reference: ${reference}`);
      console.log(`Status: error`);
      res
        .status(500)
        .json({ status: 'error', errorMessage: 'An error occurred while processing the payment' });
    });
});

app.listen(3000, () => console.log('Server is running on port 3000'));
app.on('error', (error) => {
  console.error('Server error:', error);
});

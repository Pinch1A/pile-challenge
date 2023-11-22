const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json()); // This is needed to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // This is needed to parse URL-encoded bodies
app.use(cors());
let accounts = require('./accounts.json').data;

function initiateSEPAPayment(params) {
  return new Promise((resolve, reject) => {
    let { onlyKnownIbans, sourceAccount, amount, recipientName, targetIBAN, targetBIC, reference } =
      params;
    console.log('-----------------------------------');
    console.log('Initiating SEPA payment');
    console.log('+ Only known IBANs:', onlyKnownIbans);
    if (!amount && !recipientName && !targetIBAN && !targetBIC && !reference) {
      console.log('Invalid payment details - Transaction aborted');
      return resolve({
        status: 'error',
        errorMessage: 'Invalid payment details',
        isFieldError: false
      });
    }

    let sourceAccountDetails = accounts.find((account) => account.id === sourceAccount);
    console.log(`+ Transferring €${amount} from ${sourceAccountDetails.name} to ${recipientName}`);

    console.log(
      '+ Checking availability: ',
      sourceAccountDetails.balances.available.value - amount
    );
    if (sourceAccountDetails && sourceAccountDetails.balances.available.value < amount) {
      console.log('Insufficient funds in the source account - Transaction aborted');
      return resolve({
        status: 'error',
        errorMessage: 'Insufficient funds in the source account',
        field: 'amount',
        isFieldError: true
      });
    }

    // Check if the targetIBAN matches one of the account's list
    if (onlyKnownIbans) {
      let targetAccountDetails = accounts.find((account) => account.IBAN === targetIBAN);
      if (!targetAccountDetails) {
        console.log('Invalid target IBAN - Transaction aborted');
        return resolve({
          status: 'error',
          errorMessage: 'Invalid target IBAN',
          field: 'targetIBAN',
          isFieldError: true
        });
      }
    }

    console.log(`> Target IBAN: ${targetIBAN}`);
    console.log(`> Target BIC: ${targetBIC}`);
    console.log(`> Reference: ${reference}`);
    console.log('-----------------------------------');
    return resolve({
      status: 'success',
      paymentId: '123456',
      message: 'Payment successfully created'
    });
  });
}

app.get('/totalBalance', (req, res) => {
  let totalBalance = accounts.reduce((total, account) => {
    return total + account.balances.available.value;
  }, 0);

  res.json({ totalBalance });
});

app.get('/accounts', (req, res) => {
  let { balance_gt, balance_lt, page, limit } = req.query;

  balance_gt = balance_gt ? parseFloat(balance_gt) : -Infinity;
  balance_lt = balance_lt ? parseFloat(balance_lt) : Infinity;
  page = page ? parseInt(page) : 1;
  limit = limit ? parseInt(limit) : 10;

  // Filter accounts by balance
  let filteredAccounts = accounts.filter((account) => {
    let balance = account.balances.available.value;
    return balance > balance_gt && balance < balance_lt;
  });

  let paginatedAccounts = filteredAccounts.slice((page - 1) * limit, page * limit);

  res.json(paginatedAccounts);
});

app.post('/transfer', (req, res) => {
  let { sourceAccount, amount, recipientName, targetIBAN, targetBIC, reference, onlyKnownIbans } =
    req.body;

  initiateSEPAPayment({
    sourceAccount,
    amount,
    recipientName,
    targetIBAN,
    targetBIC,
    reference,
    onlyKnownIbans
  })
    .then((response) => {
      console.log(`Status: ${response.status}`);
      console.log('-----------------------------------');
      res.json(response);
    })
    .catch((error) => {
      console.log(`Status: error`);
      console.log(`Message: ${error.errorMessage}`);
      console.log('-----------------------------------');
      res.status(500).json({
        status: 'error',
        errorMessage: 'An error occurred while processing the payment',
        isFieldError: false
      });
    });
});

app.listen(3000, () => console.log('Server is running on port 3000'));
app.on('error', (error) => {
  console.error('Server error:', error);
});

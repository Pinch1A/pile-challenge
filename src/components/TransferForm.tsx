'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InputField from './InputField';
import cx from 'classnames';

interface Account {
  id: string;
  name: string;
  balance: {
    available: {
      value: number;
      currency: string;
    };
  };
  IBAN: string;
  country: string;
  createdAt: string;
}
interface Data {
  accounts: Account[];
}

interface TransferResponse {
  data: {
    status: string;
    message: string;
    errorMessage: string;
  };
}

const TransferForm = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [targetIBAN, setTargetIBAN] = useState('');
  const [targetBIC, setTargetBIC] = useState('');
  const [reference, setReference] = useState('');

  const [response, setResponse] = useState({
    status: '',
    message: '',
    errorMessage: ''
  });

  useEffect(() => {
    axios.get('http://localhost:3000/accounts').then((response) => {
      setAccounts(response.data);
    });
  }, []);

  useEffect(() => {
    if (accounts.length > 0) {
      setSelectedAccount(accounts[0].id);
    }
  }, [accounts]);

  const clearForm = () => {
    setSelectedAccount('');
    setAmount('');
    setRecipientName('');
    setTargetIBAN('');
    setTargetBIC('');
    setReference('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const transferDetails = {
      sourceAccount: selectedAccount,
      amount: amount,
      recipientName: recipientName,
      targetIBAN: targetIBAN,
      targetBIC: targetBIC,
      reference: reference
    };

    axios
      .post('http://localhost:3000/transfer', transferDetails)
      .then((response: TransferResponse) => {
        console.log('++++', response);
        setResponse(response.data);
        // Update the frontend state
        clearForm();
      })
      .catch((error) => {
        setResponse(error.response.data);
        console.error(error);
      });
  };

  if (!response && accounts.length === 0) {
    return <div>Loading...</div>;
  }

  if (response.status !== '') {
    return <ResponseMessage response={response} handleClick={() => setResponse({ status: '' })} />;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {response.status === '' && (
        <form className="flex flex-col w-full space-y-2" onSubmit={handleSubmit}>
          <div className="flex w-full flex-col">
            <label className="mr-2">Select account</label>
            <select
              className="border flex w-full rounded-md h-10 border-gray-400 px-2 py-1 placeholder-slate-400 text-gray-800"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-full ">
            <InputField
              type="number"
              label="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="flex w-full ">
            <InputField
              type="text"
              label="Recipient Name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
          </div>
          <div className="flex w-full ">
            <InputField
              type="text"
              label="Target IBAN"
              value={targetIBAN}
              onChange={(e) => setTargetIBAN(e.target.value)}
            />
          </div>
          <div className="flex w-full ">
            <InputField
              type="text"
              label="Target BIC"
              value={targetBIC}
              onChange={(e) => setTargetBIC(e.target.value)}
            />
          </div>
          <div className="flex w-full ">
            <InputField
              type="text"
              label="Reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
          <div className="flex w-full mt-2">
            <button
              className="border border-blue-700 rounded-xl px-3 py-1 bg-blue-200"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const getMessageFromStatus = (status: string) => {
  console.log(status);
  switch (status) {
    case 'success':
      return 'bg-green-200 bg-opacity-50 border-green-400 border-2';
    case 'error':
      return 'bg-red-200 bg-opacity-50 border-red-400 border-2';
    default:
      return '';
  }
};

const ResponseMessage = ({ response, handleClick }) => {
  return (
    <div
      className={cx(
        'flex flex-col w-full mt-4 rounded-xl px-6 py-4',
        getMessageFromStatus(response.status)
      )}
    >
      <div className="flex space-x-4 text-3xl">
        <div className="flex font-bold">Status</div>
        <div className="flex capitalize">{response.status}</div>
      </div>
      {response.status === 'error' && (
        <div className="flex space-x-4">
          <div className="flex ">{response.errorMessage}</div>
        </div>
      )}
      <div className="flex space-x-4 mt-5 self-end">
        <button
          className="border border-orange-300 rounded-xl px-3 py-1 bg-orange-200"
          onClick={handleClick}
        >
          ok
        </button>
      </div>
    </div>
  );
};
export default TransferForm;

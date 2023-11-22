'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InputField from './InputField';
import ResponseMessage from './ResponseMessage';
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

interface Response {
  status: string;
  message: string;
  errorMessage: string;
}

interface Data {
  accounts: Account[];
}

const TransferForm = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [amount, setAmount] = useState('');
  const [targetIBAN, setTargetIBAN] = useState('');
  const [knownReceiverIBAN, setKnownReceiver] = useState(false);
  const [onlyKnownIbans, setOnlyKnownIbans] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [targetBIC, setTargetBIC] = useState('');
  const [reference, setReference] = useState('');

  const emptyResponse = {
    status: '',
    message: '',
    errorMessage: ''
  };

  const [response, setResponse] = useState<Response>(emptyResponse);

  useEffect(() => {
    axios.get('http://localhost:3000/accounts').then((response) => {
      setAccounts(response.data);
    });
  }, []);

  useEffect(() => {
    const account = accounts.find((account) => account.IBAN === targetIBAN);
    if (account) {
      setRecipientName(account.name);
      setKnownReceiver(true);
    } else {
      setRecipientName('');
      setKnownReceiver(false);
    }
  }, [targetIBAN]);

  const goBackFromResponse = () => {
    clearForm();
    setResponse(emptyResponse);
  };

  const clearForm = () => {
    setSelectedAccount('');
    setAmount('');
    setTargetIBAN('');
    setRecipientName('');
    setTargetBIC('');
    setReference('');
    setKnownReceiver(false);
    setOnlyKnownIbans(false);
  };

  const updateSelectedAccount = (id) => {
    setSelectedAccount(id);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const transferDetails = {
      sourceAccount: selectedAccount,
      amount: amount,
      targetIBAN: targetIBAN,
      recipientName: recipientName,
      targetBIC: targetBIC,
      reference: reference,
      onlyKnownIbans: onlyKnownIbans
    };

    axios
      .post('http://localhost:3000/transfer', transferDetails)
      .then((response) => {
        setResponse(response.data);
      })
      .catch((error) => {
        setResponse(error.response.data);
      });
  };

  if (!response && accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-400 text-3xl">
        Loading...
      </div>
    );
  }
  const hasFieldError = response.status === 'error' && response.isFieldError === true;

  if (response.status === 'success' || (response.status === 'error' && !response.isFieldError)) {
    return <ResponseMessage response={response} handleClick={goBackFromResponse} />;
  }

  return (
    <div className="flex flex-col items-center justify-center sm:w-1/2 md:w-2/3 h-full">
      {(response.status === '' || hasFieldError) && (
        <>
          <div className="flex items-center justify-start w-full rounded-md px-4 py-2 border-2 border-red-200">
            <label htmlFor="only-known-ibans" className="hover:cursor-pointer hover:text-red-300">
              Only known IBANs
            </label>
            <input
              id="only-known-ibans"
              className="ml-2 w-6 h-6 border-2 border-gray-400 rounded-md"
              type="checkbox"
              checked={onlyKnownIbans}
              onChange={() => setOnlyKnownIbans(!onlyKnownIbans)}
            />
          </div>
          <form className="flex flex-col w-full space-y-4 rounded-lg mt-3" onSubmit={handleSubmit}>
            <div className="flex w-full flex-col">
              <label className="text-3xl text-orange-200 mb-1">Sender</label>
              <select
                className="border flex w-full rounded-md h-10 border-gray-400 px-2 py-1 placeholder-slate-400 text-gray-800"
                value={selectedAccount || ''}
                placeholder="Select sender account"
                onChange={(e) => updateSelectedAccount(e.target.value)}
              >
                <option value="" disabled>
                  Select sender account
                </option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col w-full min-h-[484px]">
              {selectedAccount && (
                <div className=" border border-emerald-300 p-3 rounded-md space-y-2">
                  <p className="text-3xl text-emerald-500">Receiver</p>
                  <div className="flex w-full ">
                    <InputField
                      type="number"
                      label="amount (€)"
                      errorMessage={response.field === 'amount' ? response.errorMessage : ''}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="flex w-full ">
                    <InputField
                      type="text"
                      label="Target IBAN"
                      value={targetIBAN}
                      errorMessage={response.field === 'targetIBAN' ? response.errorMessage : ''}
                      onChange={(e) => setTargetIBAN(e.target.value)}
                    />
                  </div>
                  <div className="flex w-full ">
                    <InputField
                      type="text"
                      label="Recipient Name"
                      value={recipientName}
                      disabled={knownReceiverIBAN}
                      onChange={(e) => setRecipientName(e.target.value)}
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
                  <div className="flex w-full justify-end">
                    <button
                      className="border text-xl border-green-700 rounded-md px-4 py-1 bg-green-600"
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default TransferForm;

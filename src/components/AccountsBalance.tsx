'use client';
import AccountInfo from './AccountInfo';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function AccountsBalance() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/accounts').then((response) => {
      setAccounts(response.data);
    });
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4 justify-center w-full overflow-y-scroll p-4">
      {accounts.map((account) => (
        <AccountInfo key={account.id} account={account} />
      ))}
    </div>
  );
}

import React from 'react';
import AccountsBalance from '../../components/AccountsBalance';
import Link from 'next/link';

export default function AccountsBalancePage() {
  return (
    <main className="flex h-auto flex-col items-center justify-between p-12">
      <p className="px-4 text-5xl text-blue-200 ">Accounts</p>
      <div className="flex flex-col w-full self-center">
        <AccountsBalance />
      </div>
      <div className="flex flex-row justify-center items-center w-full">
        <Link className="text-gray-500 underline" href="/">
          Back Home
        </Link>
      </div>
    </main>
  );
}

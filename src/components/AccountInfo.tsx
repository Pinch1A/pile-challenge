'use client';
import React from 'react';
import Account from '../types/Account';
import { formatter } from '../utils/currencyFormatter';
import ReactCountryFlag from 'react-country-flag';

interface Props {
  account: Account;
}
export default function AccountInfo(props: Props) {
  const { account } = props;
  const accountCountry = account.country.toLowerCase().slice(0, 2);

  return (
    <div className="flex w-full flex-col border rounded-md px-2 py-1">
      <div className="flex flex-row justify-between w-full items-center">
        <div className="flex items-center text-lg space-x-2">
          <span className="text-gray-200 font-semibold">{account.name}</span>
          <ReactCountryFlag countryCode={accountCountry} svg />
        </div>
        <p className="text-lg font-semibold">
          Available: {formatter.format(account.balances.available.value)}
        </p>
      </div>
      <div className="flex flex-row justify-between w-full">
        <p className="text-sm text-gray-500">{account.IBAN}</p>
      </div>
    </div>
  );
}

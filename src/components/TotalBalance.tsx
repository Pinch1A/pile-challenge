'use client';
import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { formatter } from '../utils/currencyFormatter';

export default function TotalBalance() {
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:3000/totalBalance').then((response) => {
      setTotalBalance(formatter.format(response.data.totalBalance));
    });
  }, []);

  return (
    <div className="text-sm mt-4 border-emerald-400 border p-3 rounded-md">
      <h1>Total Balance: {totalBalance}</h1>
    </div>
  );
}

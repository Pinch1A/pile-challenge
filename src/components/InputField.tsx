'use client';
import React, { useState, useEffect } from 'react';

interface Props {
  label?: string;
  value: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function InputField({ label, value, type, onChange }: Props) {
  return (
    <div className="flex flex-col w-full ">
      {label && <label className="capitalize mr-2">{label}</label>}
      <input
        className="border border-gray-400 px-2 py-1 placeholder-slate-400 text-gray-800 rounded-md h-10"
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

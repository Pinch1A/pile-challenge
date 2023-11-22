'use client';
import React, { useState, useEffect } from 'react';
import cx from 'classnames';

interface Props {
  label?: string;
  value: string;
  type: string;
  errorMessage?: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function InputField({
  label,
  value,
  type,
  errorMessage,
  disabled,
  onChange
}: Props) {
  const statusClass = errorMessage ? 'border-red-500' : 'border-gray-400 ';
  return (
    <div className="flex flex-col w-full ">
      {label && <label className="capitalize mr-2 mb-1">{label}</label>}
      <input
        className={cx(
          statusClass,
          'border px-2 py-1 placeholder-slate-400 disabled:placeholder-slate-200 disabled:bg-gray-100 text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed rounded-md h-10'
        )}
        disabled={disabled}
        type={type}
        value={value}
        onChange={onChange}
      />
      {errorMessage && <p className="text-red-500 text-sm font-semibold">{errorMessage}</p>}
    </div>
  );
}

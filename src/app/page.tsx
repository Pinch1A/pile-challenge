import Link from 'next/link';
import TotalBalance from '../components/TotalBalance';

export default function Home() {
  return (
    <div className="flex flex-col justify-center h-screen mx-auto">
      <div className="flex self-center">
        <p className="text-5xl text-blue-200 ">Pile Tech Challenge</p>
      </div>
      <div className="flex self-center">
        <TotalBalance />
      </div>
      <div className="flex justify-center items-center space-x-4 my-4">
        <Link
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          href="/transfer"
        >
          Transfer
        </Link>
        <Link
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          href="/account-balances"
        >
          Account Balances
        </Link>
      </div>
    </div>
  );
}

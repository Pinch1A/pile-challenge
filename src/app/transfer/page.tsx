import TransferForm from '../../components/TransferForm';
import Link from 'next/link';

export default function Transfer() {
  return (
    <main className="flex flex-col items-center justify-between p-20 space-y-4">
      <TransferForm />
      <Link className="text-gray-500 underline" href="/">Back Home</Link>
    </main>
  );
}

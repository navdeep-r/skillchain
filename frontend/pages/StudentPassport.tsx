
import React, { useState } from 'react';
import { fetchStudentCredentials, connectStudentWallet } from '../services/web3Service';
import { Credential } from '../types';
import CredentialCard from '../components/CredentialCard';
import { Wallet, Loader2 } from 'lucide-react';
import { formatAddress } from '../lib/utils';

const StudentPassport: React.FC = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const addr = await connectStudentWallet();
      setAddress(addr);
      const data = await fetchStudentCredentials(addr);
      setCredentials(data);
    } catch (error) {
      console.error("Failed to connect", error);
    } finally {
      setLoading(false);
    }
  };

  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
        <div className="bg-slate-800/50 p-4 rounded-full mb-6 animate-pulse">
            <Wallet className="w-12 h-12 text-indigo-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Connect your Wallet</h2>
        <p className="text-slate-400 max-w-md mb-8">
          Access your secure Decentralized Skills Passport to view and manage your verified academic credentials.
        </p>
        <button
          onClick={handleConnect}
          disabled={loading}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wallet className="w-5 h-5" />}
          {loading ? 'Connecting...' : 'Connect MetaMask'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white">My Credentials</h1>
          <p className="text-slate-400 text-sm font-mono mt-1 flex items-center gap-2">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             {formatAddress(address)}
          </p>
        </div>
        <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-sm text-slate-300">
           Total Credentials: <span className="font-bold text-white ml-1">{credentials.length}</span>
        </div>
      </div>

      {loading ? (
         <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
         </div>
      ) : credentials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {credentials.map((cred) => (
            <CredentialCard key={cred.id} credential={cred} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
            <p className="text-slate-400">No credentials found for this wallet.</p>
        </div>
      )}
    </div>
  );
};

export default StudentPassport;

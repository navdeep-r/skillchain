
import React, { useState } from 'react';
import { fetchStudentCredentials, connectStudentWallet } from '../services/web3Service';
import { Credential } from '../types';
import CredentialCard from '../components/CredentialCard';
import { Wallet, Loader2, AlertCircle, Download } from 'lucide-react';
import { formatAddress } from '../lib/utils';

const StudentPassport: React.FC = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const addr = await connectStudentWallet();
      setAddress(addr);
      const data = await fetchStudentCredentials(addr);
      setCredentials(data);
    } catch (err: any) {
      console.error("Failed to connect", err);
      
      // Handle Specific Web3 Errors
      if (err.code === 4001) {
        setError("Connection request rejected. Please approve the request in your wallet.");
      } else if (err.message && err.message.includes("No Crypto Wallet")) {
        setError("MetaMask not detected. Please install a crypto wallet to continue.");
      } else {
        setError("Failed to connect wallet. Please try again or check your network.");
      }
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
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center gap-3 max-w-md text-left animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleConnect}
            disabled={loading}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wallet className="w-5 h-5" />}
            {loading ? 'Connecting...' : 'Connect MetaMask'}
          </button>
          
          {error && error.includes("MetaMask") && (
             <a 
               href="https://metamask.io/download/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center justify-center gap-1 mt-2"
             >
               <Download className="w-3 h-3" /> Install MetaMask
             </a>
          )}
        </div>
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

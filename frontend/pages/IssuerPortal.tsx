
import React, { useState } from 'react';
import { connectIssuerWallet, mintCredential } from '../services/web3Service';
import { Issuer } from '../types';
import { FileSignature, Calendar, User, BookOpen, Loader2, CheckCircle, AlertCircle, Wallet, Lock } from 'lucide-react';
import { formatAddress } from '../lib/utils';

const IssuerPortal: React.FC = () => {
  // Auth State
  const [issuer, setIssuer] = useState<Issuer | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Form State
  const [studentAddress, setStudentAddress] = useState('');
  const [courseName, setCourseName] = useState('');
  const [issueDateInput, setIssueDateInput] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDateInput, setExpiryDateInput] = useState(''); // String YYYY-MM-DD
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const issuerProfile = await connectIssuerWallet();
      setIssuer(issuerProfile);
    } catch (error) {
      console.error("Failed to connect as issuer", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentAddress || !courseName || !issueDateInput) return;

    setIsLoading(true);
    setStatus('idle');

    try {
      // Convert date strings to Unix timestamps
      const issueTimestamp = Math.floor(new Date(issueDateInput).getTime() / 1000);
      
      const expirationTimestamp = expiryDateInput 
        ? Math.floor(new Date(expiryDateInput).getTime() / 1000) 
        : 0;

      await mintCredential(studentAddress, courseName, issueTimestamp, expirationTimestamp);
      
      setStatus('success');
      // Reset form fields but keep issuer logged in
      setStudentAddress('');
      setCourseName('');
      setExpiryDateInput('');
      setIssueDateInput(new Date().toISOString().split('T')[0]);
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  // State 1: Not Authenticated
  if (!issuer) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="bg-indigo-600/20 p-6 rounded-full mb-8 border border-indigo-500/30">
            <FileSignature className="w-16 h-16 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Issuer Portal Access</h1>
        <p className="text-slate-400 mb-8 max-w-md">
          Restricted access for authorized universities and educational institutions only. 
          Connect your wallet to verify your Issuer status.
        </p>
        
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-900/20"
        >
          {isConnecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wallet className="w-5 h-5" />}
          {isConnecting ? 'Verifying Authorization...' : 'Connect as Issuer'}
        </button>

        <div className="mt-8 flex items-center gap-2 text-xs text-slate-500 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
           <Lock className="w-3 h-3" />
           <span>Requires Issuer Role in Smart Contract</span>
        </div>
      </div>
    );
  }

  // State 2: Authenticated Issuer
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600/20 rounded-xl border border-indigo-500/30">
            <FileSignature className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Mint Credential</h1>
            <p className="text-slate-400 flex items-center gap-2">
              Issuer: <span className="text-indigo-400 font-mono">{issuer.name}</span>
            </p>
          </div>
        </div>
        <div className="text-right hidden md:block">
           <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Wallet Connected</p>
           <p className="text-sm font-mono text-slate-300 bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">{formatAddress(issuer.address)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: The Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700 p-8 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Credential Details
            </h2>
            
            <form onSubmit={handleMint} className="space-y-6">
              
              {/* Student Address Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Student Wallet Address
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={studentAddress}
                  onChange={(e) => setStudentAddress(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-mono placeholder-slate-600 transition-all"
                  required
                />
              </div>

              {/* Course Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Course / Degree Name</label>
                <input
                  type="text"
                  placeholder="e.g. Master of Computer Science"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder-slate-600 transition-all"
                  required
                />
              </div>

              {/* Dates Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={issueDateInput}
                    onChange={(e) => setIssueDateInput(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder-slate-600 transition-all [color-scheme:dark]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Expiration Date (Optional)</label>
                  <input
                    type="date"
                    value={expiryDateInput}
                    onChange={(e) => setExpiryDateInput(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder-slate-600 transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-900/20 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Minting to Blockchain...
                    </>
                  ) : (
                    <>
                      <FileSignature className="w-5 h-5" />
                      Issue Credential
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* Right Column: Status & Info */}
        <div className="space-y-6">
          
          {/* Status Cards */}
          {status === 'success' && (
            <div className="p-6 bg-green-900/20 border border-green-500/30 rounded-xl animate-in fade-in slide-in-from-right-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-500 rounded-full shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Credential Minted!</h3>
                  <p className="text-green-200/80 text-sm mt-1">
                    The transaction has been confirmed. The student can now view this credential in their passport.
                  </p>
                </div>
              </div>
            </div>
          )}

          {status === 'error' && (
             <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-xl animate-in fade-in slide-in-from-right-4">
               <div className="flex items-start gap-4">
                 <div className="p-2 bg-red-500 rounded-full shrink-0">
                   <AlertCircle className="w-6 h-6 text-white" />
                 </div>
                 <div>
                   <h3 className="font-bold text-white text-lg">Transaction Failed</h3>
                   <p className="text-red-200/80 text-sm mt-1">
                     There was an error interacting with the Smart Contract.
                   </p>
                 </div>
               </div>
             </div>
          )}

          {/* Info Card */}
          <div className="p-6 bg-slate-800/20 border border-slate-700/50 rounded-xl">
             <h3 className="text-slate-200 font-semibold mb-3">Issuer Guidelines</h3>
             <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                   <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                   Ensure the Student Address is a valid Ethereum address.
                </li>
                <li className="flex items-start gap-2">
                   <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                   Credentials are permanently recorded on-chain.
                </li>
                <li className="flex items-start gap-2">
                   <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                   You can revoke credentials later via the Revocation Manager (not in MVP).
                </li>
             </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default IssuerPortal;

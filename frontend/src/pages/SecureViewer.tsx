import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Credential } from '../types';
import { Loader2, ShieldCheck, XCircle, User, Calendar, School, AlertTriangle, Lock } from 'lucide-react';
import { formatAddress } from '../lib/utils';

const SecureViewer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('data');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [credential, setCredential] = useState<Credential | null>(null);
  const [meta, setMeta] = useState<{ viewsLeft: number, ownerAddress: string } | null>(null);

  useEffect(() => {
    if (!token) {
      setError("No access token provided.");
      setLoading(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch('/api/auth/access-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to verify token');
        }

        setCredential(data.credential);
        setMeta({ viewsLeft: data.viewsLeft, ownerAddress: data.ownerAddress });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-white">Verifying Secure Access...</h2>
        <p className="text-slate-400 mt-2">Validating cryptographic signature and access limits.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-red-300 mb-6">{error}</p>
        <div className="bg-slate-900 p-4 rounded-lg text-sm text-slate-500 max-w-md border border-slate-800">
           This link may have expired, reached its maximum view limit, or been tampered with.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-900/30 border border-indigo-500/30 rounded-full text-indigo-300 text-sm font-medium mb-4">
          <Lock className="w-4 h-4" />
          Secure One-Time View Mode
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Verified Credential Access</h1>
        <p className="text-slate-400">
          You are viewing a shared credential from <span className="font-mono text-white">{formatAddress(meta?.ownerAddress || '')}</span>
        </p>
      </div>

      {/* Certificate Container */}
      <div className="relative bg-white text-slate-900 p-10 md:p-16 rounded-xl shadow-2xl overflow-hidden">
        
        {/* Watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center select-none overflow-hidden">
           <div className="opacity-[0.07] text-9xl font-black text-slate-900 rotate-[-30deg] whitespace-nowrap transform scale-150">
              ONE-TIME VIEW
           </div>
        </div>
        
        {/* Warning Banner */}
        <div className="absolute top-0 left-0 w-full bg-orange-100 text-orange-800 text-xs font-bold text-center py-1 z-20">
           DO NOT SHARE THIS SCREEN • {meta?.viewsLeft} VIEW(S) REMAINING
        </div>

        {/* Content */}
        <div className="relative z-10 border-4 border-double border-slate-200 p-8 h-full">
           
           {/* Header */}
           <div className="flex justify-between items-start border-b-2 border-slate-100 pb-6 mb-8">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center">
                   <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <div>
                   <h2 className="text-xs uppercase tracking-widest text-slate-500 font-bold">Issuer Authority</h2>
                   <p className="text-xl font-serif font-bold">{credential?.issuerName}</p>
                </div>
             </div>
             <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Credential ID</p>
                <p className="font-mono text-sm text-slate-400">#{credential?.id.substring(0,8)}</p>
             </div>
           </div>

           {/* Main Body */}
           <div className="text-center py-10">
              <p className="text-slate-500 italic mb-4">This certifies that the address</p>
              <p className="font-mono bg-slate-100 inline-block px-4 py-1 rounded mb-6 text-sm">{meta?.ownerAddress}</p>
              <p className="text-slate-500 italic mb-6">has successfully completed the course</p>
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">{credential?.courseName}</h3>
           </div>

           {/* Footer Details */}
           <div className="grid grid-cols-2 gap-8 border-t-2 border-slate-100 pt-8 mt-8">
              <div>
                 <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">
                    <Calendar className="w-4 h-4" /> Issued Date
                 </p>
                 <p className="text-lg font-serif">
                   {new Date((credential?.issueDate || 0) * 1000).toLocaleDateString()}
                 </p>
              </div>
              <div className="text-right">
                 <p className="flex items-center justify-end gap-2 text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">
                    <AlertTriangle className="w-4 h-4" /> Expiration
                 </p>
                 <p className="text-lg font-serif">
                   {credential?.expirationDate === 0 ? 'Lifetime Validity' : new Date((credential?.expirationDate || 0) * 1000).toLocaleDateString()}
                 </p>
              </div>
           </div>
           
        </div>
      </div>
    </div>
  );
};

export default SecureViewer;
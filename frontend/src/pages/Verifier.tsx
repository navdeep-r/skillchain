import React, { useState } from 'react';
import { verifyStudentSkill } from '../services/web3Service';
import { Search, CheckCircle2, XCircle, Shield, Lock, Loader2 } from 'lucide-react';

const Verifier: React.FC = () => {
  const [studentAddr, setStudentAddr] = useState('');
  const [skillName, setSkillName] = useState('');
  const [verificationResult, setResult] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentAddr || !skillName) return;

    setIsVerifying(true);
    setResult(null);
    setHasChecked(false);

    try {
      const isValid = await verifyStudentSkill(studentAddr, skillName);
      setResult(isValid);
      setHasChecked(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-4">Blind Verification</h1>
        <p className="text-slate-400">
          Verify a candidate's skill using Zero-Knowledge principles. 
          <br className="hidden md:block" />
          We check the blockchain validity without exposing the full transcript or grades.
        </p>
      </div>

      <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700 p-8 rounded-2xl shadow-2xl">
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">Student Address</label>
              <input
                type="text"
                placeholder="0x..."
                value={studentAddr}
                onChange={(e) => setStudentAddr(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-mono placeholder-slate-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">Skill or Course</label>
              <input
                type="text"
                placeholder="e.g., Python"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder-slate-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isVerifying || !studentAddr || !skillName}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-4 rounded-lg font-bold text-lg transition-all transform active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isVerifying ? (
                <>
                    <Loader2 className="animate-spin" />
                    <span>Consulting Blockchain...</span>
                </>
            ) : (
                <>
                    <Search className="w-5 h-5" />
                    <span>Verify Credential</span>
                </>
            )}
          </button>
        </form>

        {hasChecked && verificationResult !== null && (
          <div className={`mt-8 p-6 rounded-xl border ${verificationResult ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
             <div className="flex flex-col items-center text-center">
                {verificationResult ? (
                    <>
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/20">
                            <CheckCircle2 className="w-12 h-12 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Verified Authentic</h3>
                        <p className="text-green-300">
                            The address holds a valid, active credential for <span className="font-bold">"{skillName}"</span>.
                        </p>
                    </>
                ) : (
                    <>
                        <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-red-500/20">
                            <XCircle className="w-12 h-12 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Verification Failed</h3>
                        <p className="text-red-300">
                            No valid or active credential found for <span className="font-bold">"{skillName}"</span> on this address.
                        </p>
                    </>
                )}
                
                <div className="flex items-center gap-2 mt-6 text-xs text-slate-500 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                    <Lock className="w-3 h-3" />
                    <span>Privacy Preserved: No personal data was revealed.</span>
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
        <div className="p-4">
            <Shield className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold">Tamper-Proof</h4>
            <p className="text-sm text-slate-400 mt-1">Records are immutable on Ethereum.</p>
        </div>
        <div className="p-4">
            <Lock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold">Private</h4>
            <p className="text-sm text-slate-400 mt-1">Only verify what is necessary.</p>
        </div>
        <div className="p-4">
            <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold">Instant</h4>
            <p className="text-sm text-slate-400 mt-1">No calling universities for transcripts.</p>
        </div>
      </div>
    </div>
  );
};

export default Verifier;
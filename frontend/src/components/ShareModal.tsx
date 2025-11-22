import React, { useState } from 'react';
import { X, QrCode, Copy, Share2, Loader2, Lock, CheckCircle } from 'lucide-react';
import QRCode from 'react-qr-code';
import { ethers } from 'ethers';
import { Credential } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  credential: Credential;
}

const ShareModal: React.FC<Props> = ({ isOpen, onClose, credential }) => {
  const [step, setStep] = useState<'config' | 'generated'>('config');
  const [maxViews, setMaxViews] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      // 1. Create Payload
      const payload = {
        action: 'share_access',
        credentialId: credential.id,
        nonce: crypto.randomUUID(),
        maxViews: Number(maxViews),
        timestamp: Date.now()
      };

      // 2. Sign Payload
      const message = JSON.stringify(payload);
      const signature = await signer.signMessage(message);

      // 3. Encode Token
      const tokenData = JSON.stringify({ payload, signature });
      const base64Token = btoa(tokenData);
      
      // 4. Construct URL
      // Using hash router format: domain/#/verify/access?data=...
      const baseUrl = window.location.origin + window.location.pathname;
      const url = `${baseUrl}#/verify/access?data=${base64Token}`;
      
      setShareUrl(url);
      setStep('generated');
    } catch (error) {
      console.error("Signing failed:", error);
      alert("Failed to sign the share request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-400" />
            Secure Share
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 'config' ? (
            <div className="space-y-6">
              <div className="bg-indigo-900/20 border border-indigo-500/20 p-4 rounded-lg flex items-start gap-3">
                <Lock className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-sm text-indigo-200/80">
                  You are about to create a cryptographically signed link. 
                  This link grants temporary read-access to this specific credential only.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-300">Maximum Views Allowed</label>
                <div className="flex gap-4">
                  {[1, 3, 5, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => setMaxViews(num)}
                      className={`flex-1 py-2 rounded-lg border text-sm font-semibold transition-all ${
                        maxViews === num
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500">
                  The link will become invalid automatically after {maxViews} view{maxViews > 1 ? 's' : ''}.
                </p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-white text-slate-900 hover:bg-slate-200 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing with Wallet...
                  </>
                ) : (
                  <>
                    <QrCode className="w-5 h-5" />
                    Generate Secure QR
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6">
              <div className="bg-white p-4 rounded-xl shadow-lg">
                <QRCode value={shareUrl} size={200} />
              </div>
              
              <div className="w-full space-y-2">
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Secure Link</label>
                <div className="flex gap-2">
                  <input 
                    readOnly 
                    value={shareUrl} 
                    className="flex-1 bg-slate-950 border border-slate-800 text-slate-400 text-sm rounded-lg px-3 py-2 outline-none truncate font-mono"
                  />
                  <button 
                    onClick={copyToClipboard}
                    className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg border border-slate-700 transition-colors"
                  >
                    {copied ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="bg-green-900/20 border border-green-500/20 text-green-400 text-xs p-3 rounded-lg w-full text-center">
                Link generated successfully! It is valid for {maxViews} view{maxViews > 1 ? 's' : ''}.
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ShareModal;
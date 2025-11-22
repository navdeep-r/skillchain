import React, { useState } from 'react';
import { Credential } from '../types';
import { ShieldCheck, ShieldAlert, Calendar, Award, School, Clock, Share2, FileText } from 'lucide-react';
import { getCredentialStatus } from '../lib/utils';
import ShareModal from './ShareModal';

interface Props {
  credential: Credential;
}

const CredentialCard: React.FC<Props> = ({ credential }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const isRevoked = credential.revoked;
  const expiryStatus = getCredentialStatus(credential.expirationDate);

  // Determine Card State
  let statusColor = "border-green-500/50 bg-green-900/10";
  let icon = <ShieldCheck className="w-6 h-6 text-green-400" />;
  let statusText = "Valid";
  let textColor = "text-green-400";

  if (isRevoked) {
    statusColor = "border-red-500/50 bg-red-900/10";
    icon = <ShieldAlert className="w-6 h-6 text-red-400" />;
    statusText = "Revoked";
    textColor = "text-red-400";
  } else if (expiryStatus === 'Expired') {
    statusColor = "border-slate-500/50 bg-slate-900/30 grayscale opacity-70";
    icon = <Calendar className="w-6 h-6 text-slate-400" />;
    statusText = "Expired";
    textColor = "text-slate-400";
  } else if (expiryStatus === 'Expiring Soon') {
    statusColor = "border-orange-500/50 bg-orange-900/10";
    icon = <Clock className="w-6 h-6 text-orange-400" />;
    statusText = "Expiring Soon";
    textColor = "text-orange-400";
  }

  return (
    <>
      <div className={`relative p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${statusColor} border-opacity-40 shadow-lg flex flex-col h-full`}>
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
            <Award className="w-8 h-8 text-indigo-400" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/50 border border-slate-800 text-xs font-mono uppercase tracking-wider">
            {icon}
            <span className={textColor}>
              {statusText}
            </span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-100 mb-1">{credential.courseName}</h3>
        <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
          <School className="w-4 h-4" />
          <span>{credential.issuerName}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs text-slate-500 border-t border-slate-700/50 pt-4 mb-4">
          <div>
            <p className="mb-1">Issued</p>
            <p className="text-slate-300 font-mono">
              {new Date(credential.issueDate * 1000).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="mb-1">Expires</p>
            <p className="text-slate-300 font-mono">
              {credential.expirationDate === 0
                ? "Lifetime"
                : new Date(credential.expirationDate * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto pt-4">
          <button
            onClick={() => setIsShareModalOpen(true)}
            disabled={isRevoked}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700 hover:border-indigo-500"
          >
            <Share2 className="w-4 h-4" />
            Share Securely
          </button>

          {credential.fileUrl && (
            <a
              href={credential.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2 mt-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors text-sm font-medium"
            >
              <FileText className="w-4 h-4" />
              View Certificate
            </a>
          )}
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        credential={credential}
      />
    </>
  );
};

export default CredentialCard;
import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import StudentPassport from './pages/StudentPassport';
import Verifier from './pages/Verifier';
import IssuerPortal from './pages/IssuerPortal';
import SecureViewer from './pages/SecureViewer';
import { GraduationCap, ShieldCheck, LayoutDashboard, FileSignature } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  // Hide Navbar on Secure View page for cleaner presentation and to focus on the document
  if (location.pathname.includes('/verify/access')) return null;

  const isActive = (path: string) => location.pathname === path 
    ? 'text-indigo-400 bg-slate-800 border-indigo-500/50' 
    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-transparent';

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Skill<span className="text-indigo-400">Chain</span></span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <Link to="/" className={`px-4 py-2 rounded-md border transition-all text-sm font-medium flex items-center gap-2 ${isActive('/')}`}>
            <LayoutDashboard className="w-4 h-4" />
            Student Passport
          </Link>
          <Link to="/issuer" className={`px-4 py-2 rounded-md border transition-all text-sm font-medium flex items-center gap-2 ${isActive('/issuer')}`}>
            <FileSignature className="w-4 h-4" />
            Issuer Portal
          </Link>
          <Link to="/verify" className={`px-4 py-2 rounded-md border transition-all text-sm font-medium flex items-center gap-2 ${isActive('/verify')}`}>
            <ShieldCheck className="w-4 h-4" />
            Verifier Portal
          </Link>
        </nav>

        {/* Mobile menu placeholder or secondary action */}
        <div className="w-6"></div> 
      </div>
    </header>
  );
};

const Footer: React.FC = () => {
  const location = useLocation();
  // Optionally hide footer on secure view as well
  if (location.pathname.includes('/verify/access')) return null;

  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-8 mt-auto">
      <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
        <p>© 2024 SkillChain Decentralized Registry. Built on Ethereum.</p>
      </div>
    </footer>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 flex flex-col">
        <Navbar />
        <main className="container mx-auto px-4 md:px-6 py-8 flex-grow">
          <Routes>
            <Route path="/" element={<StudentPassport />} />
            <Route path="/issuer" element={<IssuerPortal />} />
            <Route path="/verify" element={<Verifier />} />
            <Route path="/verify/access" element={<SecureViewer />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
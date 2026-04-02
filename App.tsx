
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Verify } from './pages/Verify';
import { Leaderboard } from './pages/Leaderboard';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';
import { VersionGallery } from './pages/VersionGallery';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <HashRouter>
          <div className="min-h-screen bg-black text-slate-100 selection:bg-primary-900 selection:text-white">
            <Header />
            <main className="relative z-10 pb-20 pt-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/evolution" element={<VersionGallery />} />
              </Routes>
            </main>
            
            <footer className="border-t border-slate-800 py-8 mt-12 bg-black">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
                    <p className="font-bold text-slate-300">FactPulse</p>
                    <p className="mt-2 text-xs">Empowering the community to verify the truth.</p>
                </div>
            </footer>
          </div>
        </HashRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

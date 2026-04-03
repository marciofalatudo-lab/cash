import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, auth, db, handleFirestoreError, OperationType, signInWithPopup, googleProvider, FirebaseUser } from './firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { UserProfile, Plan } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Home, PlusSquare, Wallet, Users, LayoutGrid, LogIn, Crown, TrendingUp, Zap, CheckCircle2, AlertCircle, X, LogOut } from 'lucide-react';

// Screens
import HomeScreen from './screens/HomeScreen';
import CreateScreen from './screens/CreateScreen';
import WalletScreen from './screens/WalletScreen';
import ReferralScreen from './screens/ReferralScreen';
import PlansScreen from './screens/PlansScreen';
import LoginScreen from './screens/LoginScreen';

import SuccessScreen from './screens/SuccessScreen';
import JoinScreen from './screens/JoinScreen';

function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            // Check for referral code in URL
            const urlParams = new URLSearchParams(window.location.search);
            const refCode = urlParams.get('ref');

            // Create new profile
            const newProfile: any = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'Usuário',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || '',
              plan: 'FREE',
              balance: 0,
              referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
              streak: 1,
              lastActive: new Date().toISOString(),
              videosCountToday: 0,
              totalEarnings: 0
            };

            if (refCode) {
              newProfile.referredBy = refCode;
            }

            await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
            setProfile(newProfile as UserProfile);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Real-time profile listener
  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
        if (snapshot.exists()) {
          setProfile(snapshot.data() as UserProfile);
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
      });
      return () => unsubscribe();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 border-4 border-neon-green border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen pb-20 bg-dark-bg text-white">
        {user && profile ? (
          <>
            <Header profile={profile} />
            <main className="px-4 pt-4 max-w-lg mx-auto">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<HomeScreen profile={profile} />} />
                  <Route path="/create" element={<CreateScreen profile={profile} />} />
                  <Route path="/wallet" element={<WalletScreen profile={profile} />} />
                  <Route path="/referral" element={<ReferralScreen profile={profile} />} />
                  <Route path="/plans" element={<PlansScreen profile={profile} />} />
                  <Route path="/success" element={<SuccessScreen />} />
                  <Route path="/join" element={<JoinScreen />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </AnimatePresence>
            </main>
            <Navbar />
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/success" element={<SuccessScreen />} />
            <Route path="/join" element={<JoinScreen />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

function Header({ profile }: { profile: UserProfile }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-dark-bg/80 backdrop-blur-xl border-b border-white/5 px-4 py-4">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-green to-neon-blue p-[1px] neon-shadow-green">
            <div className="w-full h-full rounded-[11px] bg-dark-bg flex items-center justify-center">
              <Zap className="w-6 h-6 text-neon-green fill-neon-green" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter leading-none">CASH VÍDEOS</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-bold text-neon-green uppercase tracking-widest">AI Platform</span>
              {profile.plan !== 'FREE' && (
                <span className="text-[8px] bg-neon-pink text-white px-1 rounded-sm font-black uppercase tracking-tighter">
                  {profile.plan}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Saldo</span>
            <span className="text-sm font-black text-neon-green">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(profile.balance)}
            </span>
          </div>
          <button 
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/5"
          >
            <LogOut className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-dark-bg/90 backdrop-blur-xl border-t border-white/5 px-6 py-3 flex items-center justify-between max-w-lg mx-auto rounded-t-3xl">
      <NavLink to="/" icon={<Home />} active={isActive('/')} label="Home" />
      <NavLink to="/create" icon={<PlusSquare />} active={isActive('/create')} label="Criar" />
      <NavLink to="/wallet" icon={<Wallet />} active={isActive('/wallet')} label="Carteira" />
      <NavLink to="/referral" icon={<Users />} active={isActive('/referral')} label="Convite" />
      <NavLink to="/plans" icon={<LayoutGrid />} active={isActive('/plans')} label="Planos" />
    </nav>
  );
}

function NavLink({ to, icon, active, label }: { to: string, icon: React.ReactNode, active: boolean, label: string }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-1">
      <div className={`p-2 rounded-xl transition-all ${active ? 'bg-neon-green/20 text-neon-green scale-110' : 'text-gray-500'}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-medium ${active ? 'text-neon-green' : 'text-gray-500'}`}>{label}</span>
    </Link>
  );
}

export default App;

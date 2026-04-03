import React, { useState } from 'react';
import { signInWithPopup, googleProvider, auth, db, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { LogIn, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-dark-bg relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-neon-green/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-neon-pink/20 blur-[100px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm text-center z-10"
      >
        <div className="mb-8 flex justify-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 bg-gradient-to-br from-neon-green to-neon-blue rounded-3xl flex items-center justify-center neon-shadow-green"
          >
            <Zap className="w-10 h-10 text-white fill-white" />
          </motion.div>
        </div>

        <h1 className="text-4xl font-black mb-2 tracking-tight">
          CASH <span className="text-neon-green">VÍDEOS</span> AI
        </h1>
        <p className="text-gray-400 mb-12 text-lg">
          Crie vídeos virais em segundos e monetize sua criatividade.
        </p>

        <div className="space-y-4 mb-12">
          <FeatureItem icon={<Sparkles className="text-neon-pink" />} text="IA de Geração Automática" />
          <FeatureItem icon={<Zap className="text-neon-yellow" />} text="Vídeos em 1 Clique" />
          <FeatureItem icon={<ShieldCheck className="text-neon-blue" />} text="Seguro e Escalável" />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Entrar com Google
            </>
          )}
        </button>

        <p className="mt-8 text-xs text-gray-500 px-8">
          Ao entrar, você concorda com nossos Termos de Uso e Política de Privacidade.
        </p>
      </motion.div>
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
      {icon}
      <span className="text-sm font-medium text-gray-300">{text}</span>
    </div>
  );
}

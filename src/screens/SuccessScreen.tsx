import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, PartyPopper, ArrowRight, Zap, Crown, Star } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function SuccessScreen() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId && auth.currentUser) {
      // In a real app, the webhook would handle this, but for the demo:
      const updatePlan = async () => {
        try {
          await updateDoc(doc(db, 'users', auth.currentUser!.uid), {
            plan: 'PRO' // Mocking plan update for demo
          });
          setLoading(false);
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `users/${auth.currentUser!.uid}`);
        }
      };
      updatePlan();
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-dark-bg text-center space-y-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 12 }}
        className="w-24 h-24 bg-neon-green/20 rounded-full flex items-center justify-center neon-shadow-green"
      >
        <CheckCircle2 className="w-12 h-12 text-neon-green" />
      </motion.div>

      <div className="space-y-2">
        <h1 className="text-4xl font-black">PAGAMENTO <br /> <span className="text-neon-green">CONFIRMADO!</span></h1>
        <p className="text-gray-400">Parabéns! Seu acesso PRO foi liberado com sucesso.</p>
      </div>

      <div className="glass-card p-6 w-full max-w-xs space-y-4">
        <div className="flex items-center gap-3 text-left">
          <Zap className="w-5 h-5 text-neon-yellow fill-neon-yellow" />
          <p className="text-sm font-bold">Vídeos ilimitados liberados</p>
        </div>
        <div className="flex items-center gap-3 text-left">
          <Crown className="w-5 h-5 text-neon-pink fill-neon-pink" />
          <p className="text-sm font-bold">Trend Engine ativado</p>
        </div>
        <div className="flex items-center gap-3 text-left">
          <Star className="w-5 h-5 text-neon-blue fill-neon-blue" />
          <p className="text-sm font-bold">Personagens PRO liberados</p>
        </div>
      </div>

      <button
        onClick={() => navigate('/')}
        className="w-full max-w-xs py-5 bg-neon-green text-black font-black rounded-2xl flex items-center justify-center gap-3 neon-shadow-green transition-all active:scale-95"
      >
        COMEÇAR A CRIAR <ArrowRight className="w-6 h-6" />
      </button>
    </div>
  );
}

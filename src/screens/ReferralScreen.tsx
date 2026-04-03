import { useState, useEffect } from 'react';
import { UserProfile, Referral } from '../types';
import { motion } from 'motion/react';
import { Users, Gift, Copy, Share2, CheckCircle2, AlertCircle, ArrowRight, Trophy, Zap, Flame, Star, DollarSign } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';

export default function ReferralScreen({ profile }: { profile: UserProfile }) {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}/join?ref=${profile.referralCode}`;

  useEffect(() => {
    const q = query(
      collection(db, 'referrals'),
      where('referrerId', '==', profile.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const refs = snapshot.docs.map(doc => doc.data() as Referral);
      setReferrals(refs);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'referrals');
    });

    return () => unsubscribe();
  }, [profile.uid]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cash Vídeos AI',
          text: 'Crie vídeos virais com IA e ganhe dinheiro! Use meu código de convite.',
          url: referralLink,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  const completedReferrals = referrals.filter(r => r.status === 'COMPLETED').length;
  const progress = (completedReferrals % 20) / 20 * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8 pb-12"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-20 h-20 bg-neon-pink/10 rounded-[32px] flex items-center justify-center neon-shadow-pink relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Gift className="w-10 h-10 text-neon-pink fill-neon-pink relative z-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-black tracking-tighter">Indique e Ganhe</h2>
          <p className="text-gray-400 max-w-xs mx-auto text-sm font-medium">
            Compartilhe o Cash Vídeos AI e ganhe bônus por cada novo criador.
          </p>
        </div>
      </div>

      {/* Hero Reward Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-neon-pink/20 via-dark-card to-neon-blue/20 p-8 border border-white/10 neon-shadow-pink"
      >
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <DollarSign className="w-32 h-32 text-white" />
        </div>
        
        <div className="relative z-10 text-center space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-black text-neon-pink uppercase tracking-widest">Bônus por Indicação</p>
            <h3 className="text-5xl font-black tracking-tighter">
              R$ 5,00
            </h3>
            <p className="text-sm text-gray-400 font-medium">por cada amigo que se cadastrar!</p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Total</p>
              <p className="text-lg font-black text-white">{referrals.length}</p>
            </div>
            <div className="text-center border-x border-white/10">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Ativos</p>
              <p className="text-lg font-black text-neon-pink">{completedReferrals}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Ganhos</p>
              <p className="text-lg font-black text-neon-blue">R$ {(completedReferrals * 5).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Referral Code Card */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-black tracking-tight">Seu Link Exclusivo</h3>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse" />
            <span className="text-[10px] text-neon-green font-black uppercase tracking-widest">Ativo</span>
          </div>
        </div>
        
        <div className="glass-card p-4 flex items-center gap-3 bg-white/5 border-white/10 group">
          <div className="flex-1 overflow-hidden px-2">
            <p className="text-xs text-gray-400 truncate font-mono">{referralLink}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className={`p-3 rounded-2xl transition-all active:scale-90 ${copied ? 'bg-neon-green text-black neon-shadow-green' : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'}`}
            >
              {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
            <button
              onClick={shareLink}
              className="p-3 bg-neon-blue text-white rounded-2xl hover:brightness-110 transition-all active:scale-90 border border-white/5 neon-shadow-blue"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Bonus Progress */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-neon-yellow" /> Meta de Bônus
          </h3>
          <span className="text-xs font-bold text-neon-yellow">R$ 100,00 EXTRA</span>
        </div>
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-400 font-medium">Progresso de Convites</p>
            <p className="font-black">{completedReferrals % 20}/20</p>
          </div>
          <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-neon-yellow to-neon-pink"
            />
          </div>
          <p className="text-xs text-gray-500 text-center italic">
            A cada 20 convites válidos, você ganha um bônus extra de R$ 100,00!
          </p>
        </div>
      </section>

      {/* Rewards List */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold">Histórico de Convites</h3>
        <div className="space-y-3">
          {referrals.length > 0 ? referrals.map((ref, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Novo Amigo Convidado</h4>
                  <p className="text-[10px] text-gray-500">{new Date(ref.createdAt?.toDate()).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black ${ref.status === 'COMPLETED' ? 'text-neon-green' : 'text-neon-yellow'}`}>
                  {ref.status === 'COMPLETED' ? '+ R$ 5,00' : 'Pendente'}
                </p>
                <div className="flex items-center gap-1 justify-end">
                  {ref.status === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3 text-neon-green" /> : <AlertCircle className="w-3 h-3 text-neon-yellow" />}
                  <span className="text-[10px] text-gray-500 uppercase font-bold">{ref.status}</span>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="glass-card p-8 text-center text-gray-500 space-y-2">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium">Nenhum convite ainda.</p>
              <p className="text-xs">Compartilhe seu link e comece a ganhar!</p>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}

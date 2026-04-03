import { useState, useEffect } from 'react';
import { UserProfile, Transaction } from '../types';
import { motion } from 'motion/react';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Clock, DollarSign, PieChart, BarChart3, ChevronRight, Zap, Trophy, Flame, Users } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function WalletScreen({ profile }: { profile: UserProfile }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const chartData = [
    { name: 'Seg', value: 12.50 },
    { name: 'Ter', value: 18.20 },
    { name: 'Qua', value: 15.40 },
    { name: 'Qui', value: 22.10 },
    { name: 'Sex', value: 28.50 },
    { name: 'Sab', value: 35.20 },
    { name: 'Dom', value: 42.10 },
  ];

  useEffect(() => {
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', profile.uid),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
      setTransactions(txs);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'transactions');
    });

    return () => unsubscribe();
  }, [profile.uid]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8 pb-12"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">Minha Carteira</h2>
        <div className="p-2 bg-white/5 rounded-xl border border-white/5">
          <PieChart className="w-6 h-6 text-neon-blue" />
        </div>
      </div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 bg-gradient-to-br from-neon-green/20 via-dark-card to-neon-blue/20 border-white/10 relative overflow-hidden neon-shadow-green rounded-[32px]"
      >
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <DollarSign className="w-32 h-32 text-neon-green" />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Saldo Disponível</p>
            <h3 className="text-5xl font-black tracking-tighter">
              <span className="text-2xl text-neon-green mr-1 font-bold">R$</span>
              {profile.balance.toFixed(2)}
            </h3>
          </div>
          
          <div className="flex items-center gap-4 pt-4 border-t border-white/5">
            <button className="flex-1 py-4 bg-neon-green text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95 neon-shadow-green text-sm">
              SACAR AGORA <ArrowUpRight className="w-4 h-4" />
            </button>
            <button className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all">
              <Clock className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-5 space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp className="w-12 h-12 text-neon-green" />
          </div>
          <div className="w-8 h-8 bg-neon-green/10 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-neon-green" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">Ganhos Totais</p>
            <p className="text-xl font-black text-white">R$ {profile.totalEarnings.toFixed(2)}</p>
            <div className="flex items-center gap-1 text-[10px] text-neon-green font-bold mt-1">
              <div className="w-1 h-1 bg-neon-green rounded-full animate-pulse" />
              +12% este mês
            </div>
          </div>
        </div>
        
        <div className="glass-card p-5 space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users className="w-12 h-12 text-neon-blue" />
          </div>
          <div className="w-8 h-8 bg-neon-blue/10 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-neon-blue" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">Bônus Convite</p>
            <p className="text-xl font-black text-white">R$ {(profile.totalEarnings * 0.3).toFixed(2)}</p>
            <div className="flex items-center gap-1 text-[10px] text-neon-blue font-bold mt-1">
              <div className="w-1 h-1 bg-neon-blue rounded-full animate-pulse" />
              12 convites ativos
            </div>
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-neon-yellow" /> Crescimento
          </h3>
          <select className="bg-white/5 border-none text-xs font-bold rounded-lg focus:ring-0">
            <option>Últimos 7 dias</option>
            <option>Últimos 30 dias</option>
          </select>
        </div>
        <div className="glass-card p-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#39FF14" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#39FF14" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 10}} />
              <Tooltip 
                contentStyle={{backgroundColor: '#141414', border: '1px solid #ffffff10', borderRadius: '12px'}}
                itemStyle={{color: '#39FF14', fontWeight: 'bold'}}
              />
              <Area type="monotone" dataKey="value" stroke="#39FF14" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Atividade Recente</h3>
          <button className="text-xs text-neon-blue font-bold">Ver Tudo</button>
        </div>
        <div className="space-y-3">
          {transactions.length > 0 ? transactions.map((tx, idx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'REFERRAL' ? 'bg-neon-blue/10 text-neon-blue' : 'bg-neon-green/10 text-neon-green'}`}>
                  {tx.type === 'REFERRAL' ? <Users className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{tx.description}</h4>
                  <p className="text-[10px] text-gray-500">{new Date(tx.createdAt?.toDate()).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-neon-green">+ R$ {tx.amount.toFixed(2)}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Confirmado</p>
              </div>
            </motion.div>
          )) : (
            <div className="glass-card p-8 text-center text-gray-500 space-y-2">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium">Nenhuma transação encontrada.</p>
              <p className="text-xs">Comece a criar vídeos para ganhar bônus!</p>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}

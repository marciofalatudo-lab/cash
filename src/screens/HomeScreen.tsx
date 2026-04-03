import { useState, useEffect } from 'react';
import { UserProfile, Trend } from '../types';
import { motion } from 'motion/react';
import { TrendingUp, Sparkles, Zap, Play, Share2, ArrowRight, Flame, Trophy, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomeScreen({ profile }: { profile: UserProfile }) {
  const [trends, setTrends] = useState<Trend[]>([
    { id: '1', title: 'Curiosidades sobre o Espaço', format: 'Viral Shorts', platform: 'TikTok' },
    { id: '2', title: 'Review de Gadgets Tech', format: 'Review Rápido', platform: 'YouTube Shorts' },
    { id: '3', title: 'Dicas de Produtividade', format: 'Lista Top 5', platform: 'Kwai' },
    { id: '4', title: 'Receitas de 30 Segundos', format: 'Tutorial Rápido', platform: 'TikTok' },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 pb-12"
    >
      {/* Streak & Progress */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 flex items-center gap-3 border-l-4 border-l-neon-yellow">
          <div className="p-2 bg-neon-yellow/10 rounded-xl">
            <Flame className="w-6 h-6 text-neon-yellow" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold">Streak</p>
            <p className="text-xl font-black">{profile.streak} Dias</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3 border-l-4 border-l-neon-blue">
          <div className="p-2 bg-neon-blue/10 rounded-xl">
            <Trophy className="w-6 h-6 text-neon-blue" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold">Vídeos</p>
            <p className="text-xl font-black">{profile.videosCountToday}/2</p>
          </div>
        </div>
      </div>

      {/* Quick Create CTA */}
      <Link to="/create">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-neon-green/20 to-neon-blue/20 border border-white/10 neon-shadow-green group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
            <Zap className="w-32 h-32 text-neon-green" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-neon-green" />
              <span className="text-xs font-bold text-neon-green uppercase tracking-widest">IA Engine v2.5</span>
            </div>
            <h2 className="text-3xl font-black mb-4 leading-tight">
              Crie seu próximo <br /> <span className="text-neon-green">Vídeo Viral</span>
            </h2>
            <div className="flex items-center gap-2 text-sm font-bold bg-white text-black w-fit px-4 py-2 rounded-full">
              Começar Agora <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Trend Engine */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neon-pink/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-neon-pink" />
            </div>
            <h3 className="text-xl font-black tracking-tight">Trend Engine</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-neon-pink rounded-full animate-pulse" />
            <span className="text-[10px] text-neon-pink font-black uppercase tracking-widest">Live</span>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
          {trends.map((trend, idx) => (
            <motion.div
              key={trend.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="min-w-[280px] glass-card p-5 flex flex-col justify-between aspect-video relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <Play className="w-20 h-20 text-white fill-white" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2 py-0.5 bg-white/10 rounded-md text-gray-400 uppercase tracking-tighter">
                    {trend.platform}
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 bg-neon-blue/20 rounded-md text-neon-blue uppercase tracking-tighter">
                    {trend.format}
                  </span>
                </div>
                <h4 className="text-lg font-black leading-tight group-hover:text-neon-green transition-colors">
                  {trend.title}
                </h4>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-dark-card bg-gray-800 overflow-hidden">
                      <img src={`https://picsum.photos/seed/user${i+idx}/50/50`} alt="User" />
                    </div>
                  ))}
                  <div className="w-6 h-6 rounded-full border-2 border-dark-card bg-white/10 flex items-center justify-center text-[8px] font-bold">
                    +12
                  </div>
                </div>
                <div className="p-2 rounded-full bg-white/5 group-hover:bg-neon-green group-hover:text-black transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pro Max Banner */}
      {profile.plan !== 'PRO_MAX' && (
        <Link to="/plans">
          <div className="glass-card p-6 bg-gradient-to-r from-neon-pink/10 to-neon-blue/10 border-neon-pink/30 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-20">
              <Star className="w-24 h-24 text-neon-pink fill-neon-pink" />
            </div>
            <div className="relative z-10">
              <h4 className="text-xl font-black mb-1">Desbloqueie o PRO MAX</h4>
              <p className="text-sm text-gray-400 mb-4">Acesso a 20+ personagens e vídeos ilimitados.</p>
              <button className="bg-neon-pink text-white px-6 py-2 rounded-xl font-bold text-sm neon-shadow-pink">
                Ver Planos
              </button>
            </div>
          </div>
        </Link>
      )}
    </motion.div>
  );
}

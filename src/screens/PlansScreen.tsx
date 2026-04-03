import { useState } from 'react';
import { UserProfile, Plan } from '../types';
import { motion } from 'motion/react';
import { Crown, CheckCircle2, Zap, Star, ShieldCheck, Sparkles, TrendingUp, Users, LayoutGrid, ArrowRight, X, Loader2 } from 'lucide-react';

export default function PlansScreen({ profile }: { profile: UserProfile }) {
  const [loading, setLoading] = useState<string | null>(null);

  const plans = [
    {
      id: 'FREE',
      name: 'GRATUITO',
      price: 'R$ 0,00',
      description: 'Ideal para começar',
      features: [
        '2 vídeos por dia',
        'Modelos básicos',
        'Geração de roteiros',
        'Suporte via e-mail'
      ],
      color: 'gray',
      icon: <Zap className="w-6 h-6" />
    },
    {
      id: 'PRO',
      name: 'PRO',
      price: 'R$ 39,90',
      period: '/mês',
      description: 'Para criadores sérios',
      features: [
        'Vídeos ilimitados',
        'Acesso ao Trend Engine',
        'Personagens exclusivos',
        'Sem marca d\'água',
        'Suporte prioritário'
      ],
      color: 'neon-green',
      icon: <Crown className="w-6 h-6" />,
      popular: true
    },
    {
      id: 'PRO_MAX',
      name: 'PRO MAX',
      price: 'R$ 59,90',
      period: '/mês',
      description: 'A experiência definitiva',
      features: [
        'Tudo do plano PRO',
        'Afiliado PRO Liberado',
        '20+ Personagens Premium',
        'Geração de vídeos de vendas',
        'Acesso antecipado a novas IAs'
      ],
      color: 'neon-pink',
      icon: <Star className="w-6 h-6" />
    }
  ];

  const handleSubscribe = async (planId: string) => {
    if (planId === 'FREE' || profile.plan === planId) return;
    
    setLoading(planId);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: planId === 'PRO' ? process.env.STRIPE_PRICE_ID_PRO : process.env.STRIPE_PRICE_ID_PRO_MAX,
          userId: profile.uid 
        }),
      });
      const session = await response.json();
      if (session.id) {
        // Redirect to Stripe Checkout (mocked for now)
        window.location.href = `https://checkout.stripe.com/pay/${session.id}`;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8 pb-12"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-20 h-20 bg-neon-yellow/10 rounded-[32px] flex items-center justify-center neon-shadow-yellow relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-yellow/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Crown className="w-10 h-10 text-neon-yellow fill-neon-yellow relative z-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-black tracking-tighter">Escolha seu Plano</h2>
          <p className="text-gray-400 max-w-xs mx-auto text-sm font-medium">
            Desbloqueie o poder total da IA e comece a viralizar hoje mesmo.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative glass-card p-8 border-2 transition-all overflow-hidden group ${profile.plan === plan.id ? 'border-neon-green bg-neon-green/5 neon-shadow-green scale-[1.02]' : plan.popular ? 'border-neon-pink/30 bg-neon-pink/5' : 'border-white/5 hover:border-white/10'}`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-neon-pink text-white text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                MAIS POPULAR
              </div>
            )}
            {profile.plan === plan.id && (
              <div className="absolute top-0 right-0 bg-neon-green text-black text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                PLANO ATUAL
              </div>
            )}
            
            <div className="flex items-start justify-between mb-6">
              <div className="space-y-1">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${plan.color === 'neon-green' ? 'bg-neon-green/10 text-neon-green' : plan.color === 'neon-pink' ? 'bg-neon-pink/10 text-neon-pink' : 'bg-white/5 text-gray-500'}`}>
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-black tracking-tight">{plan.name}</h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter">{plan.description}</p>
              </div>
              <div className="text-right">
                <div className="flex items-baseline justify-end gap-1">
                  <span className="text-3xl font-black tracking-tighter">{plan.price}</span>
                  {plan.period && <span className="text-xs text-gray-500 font-bold">{plan.period}</span>}
                </div>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, fIdx) => (
                <li key={fIdx} className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                  <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plan.color === 'neon-green' ? 'bg-neon-green/20 text-neon-green' : plan.color === 'neon-pink' ? 'bg-neon-pink/20 text-neon-pink' : 'bg-white/10 text-gray-400'}`}>
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={profile.plan === plan.id || loading !== null || plan.id === 'FREE'}
              className={`w-full py-5 rounded-[20px] font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${profile.plan === plan.id ? 'bg-white/5 text-gray-500 cursor-default' : plan.id === 'FREE' ? 'bg-white/5 text-gray-500' : plan.color === 'neon-green' ? 'bg-neon-green text-black neon-shadow-green' : plan.color === 'neon-pink' ? 'bg-neon-pink text-white neon-shadow-pink' : 'bg-white text-black'}`}
            >
              {loading === plan.id ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : profile.plan === plan.id ? (
                'PLANO ATUAL'
              ) : (
                <>ASSINAR AGORA <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-6 text-center space-y-4">
        <ShieldCheck className="w-10 h-10 text-neon-blue mx-auto" />
        <h4 className="font-bold">Pagamento Seguro</h4>
        <p className="text-xs text-gray-500">
          Suas informações estão protegidas. Usamos Stripe para processar todos os pagamentos com segurança de nível bancário.
        </p>
      </div>
    </motion.div>
  );
}

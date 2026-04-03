import { useState, useEffect } from 'react';
import { UserProfile, Video } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Zap, Video as VideoIcon, Type, Hash, Send, CheckCircle2, AlertCircle, Loader2, Play, Download, Share2, User, ShoppingBag, Wand2, TrendingUp } from 'lucide-react';
import { GoogleGenAI, Type as GenAIType } from '@google/genai';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default function CreateScreen({ profile }: { profile: UserProfile }) {
  const [step, setStep] = useState<'input' | 'generating' | 'result'>('input');
  const [type, setType] = useState<'VIRAL' | 'SALES'>('VIRAL');
  const [prompt, setPrompt] = useState('');
  const [productName, setProductName] = useState('');
  const [productBenefit, setProductBenefit] = useState('');
  const [character, setCharacter] = useState('Especialista');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<Partial<Video> | null>(null);

  const handleGenerate = async () => {
    if (!prompt && type === 'VIRAL') return;
    if ((!productName || !productBenefit) && type === 'SALES') return;

    // Check limits
    if (profile.plan === 'FREE' && profile.videosCountToday >= 2) {
      setError('Limite diário atingido. Faça o upgrade para o PRO para vídeos ilimitados.');
      return;
    }

    setLoading(true);
    setStep('generating');
    setError(null);

    try {
      const model = ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: type === 'VIRAL' 
          ? `Gere um roteiro para um vídeo viral curto (TikTok/Reels) sobre: ${prompt}. 
             Estrutura: 1. Gancho forte (0-2s), 2. Curiosidade, 3. Ritmo acelerado, 4. Retenção constante, 5. Final aberto.
             Retorne em JSON com os campos: title, script, description, hashtags (array).`
          : `Gere um roteiro de venda para o produto: ${productName}. Benefício: ${productBenefit}. 
             Estilo do personagem: ${character}.
             Retorne em JSON com os campos: title, script, description, hashtags (array).`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: GenAIType.OBJECT,
            properties: {
              title: { type: GenAIType.STRING },
              script: { type: GenAIType.STRING },
              description: { type: GenAIType.STRING },
              hashtags: { type: GenAIType.ARRAY, items: { type: GenAIType.STRING } }
            },
            required: ['title', 'script', 'description', 'hashtags']
          }
        }
      });

      const response = await model;
      const data = JSON.parse(response.text || '{}');

      // Simulate video generation delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      const videoData: Partial<Video> = {
        userId: profile.uid,
        title: data.title || 'Sem título',
        description: data.description || '',
        hashtags: data.hashtags || [],
        type: type,
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', // Mock URL
        thumbnailUrl: `https://picsum.photos/seed/${data.title || 'video'}/400/700`,
        status: 'COMPLETED',
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'videos'), videoData);
      
      // Update user stats
      await updateDoc(doc(db, 'users', profile.uid), {
        videosCountToday: increment(1),
        totalEarnings: increment(0.50) // Bonus for creating video
      });

      setGeneratedVideo({ ...videoData, id: docRef.id });
      setStep('result');
    } catch (err) {
      console.error(err);
      setError('Erro ao gerar vídeo. Tente novamente.');
      setStep('input');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 pb-12"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">Criar Vídeo</h2>
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
          <Zap className="w-4 h-4 text-neon-yellow fill-neon-yellow" />
          <span className="text-xs font-bold text-gray-300">{profile.videosCountToday}/2 Grátis</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Type Selector */}
            <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
              <button
                onClick={() => setType('VIRAL')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${type === 'VIRAL' ? 'bg-neon-green text-black neon-shadow-green' : 'text-gray-500'}`}
              >
                <TrendingUp className="w-4 h-4" /> Viral
              </button>
              <button
                onClick={() => setType('SALES')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${type === 'SALES' ? 'bg-neon-pink text-white neon-shadow-pink' : 'text-gray-500'}`}
              >
                <ShoppingBag className="w-4 h-4" /> Vendas
              </button>
            </div>

            {type === 'VIRAL' ? (
              <div className="space-y-4">
                <div className="glass-card p-4 space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Ideia do Vídeo</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex: 5 curiosidades sobre o Egito Antigo que ninguém te contou..."
                    className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium h-32 resize-none placeholder:text-gray-700"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="glass-card p-4 space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Nome do Produto</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Ex: Curso de Marketing Digital"
                    className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium placeholder:text-gray-700"
                  />
                </div>
                <div className="glass-card p-4 space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Principal Benefício</label>
                  <input
                    type="text"
                    value={productBenefit}
                    onChange={(e) => setProductBenefit(e.target.value)}
                    placeholder="Ex: Ganhe dinheiro trabalhando de casa"
                    className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium placeholder:text-gray-700"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Personagem (Avatar)</label>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                      { name: 'Especialista', icon: '👨‍🔬' },
                      { name: 'Entusiasta', icon: '🤩' },
                      { name: 'Cético', icon: '🤨' },
                      { name: 'Empresário', icon: '💼' },
                      { name: 'Amigo', icon: '🤝' }
                    ].map(char => (
                      <button
                        key={char.name}
                        onClick={() => setCharacter(char.name)}
                        className={`px-4 py-3 rounded-2xl whitespace-nowrap text-sm font-bold border transition-all flex items-center gap-2 ${character === char.name ? 'bg-neon-pink border-neon-pink text-white neon-shadow-pink' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`}
                      >
                        <span>{char.icon}</span>
                        {char.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || (!prompt && type === 'VIRAL') || ((!productName || !productBenefit) && type === 'SALES')}
              className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 ${type === 'VIRAL' ? 'bg-neon-green text-black neon-shadow-green' : 'bg-neon-pink text-white neon-shadow-pink'}`}
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Wand2 className="w-6 h-6" /> GERAR VÍDEO AGORA</>}
            </button>
          </motion.div>
        )}

        {step === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-8"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 border-4 border-dashed border-neon-green/30 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sparkles className="w-12 h-12 text-neon-green" />
              </motion.div>
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2">Criando sua obra-prima...</h3>
              <p className="text-gray-400 max-w-xs mx-auto">
                Nossa IA está analisando tendências e gerando o roteiro perfeito para você.
              </p>
            </div>
            <div className="w-full max-w-xs bg-white/5 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 5 }}
                className="h-full bg-neon-green"
              />
            </div>
          </motion.div>
        )}

        {step === 'result' && generatedVideo && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="relative aspect-[9/16] w-full max-w-[300px] mx-auto rounded-3xl overflow-hidden border-2 border-neon-green neon-shadow-green">
              <img src={generatedVideo.thumbnailUrl} className="w-full h-full object-cover" alt="Preview" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <p className="text-sm font-bold line-clamp-2">{generatedVideo.title}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass-card p-4 space-y-2">
                <div className="flex items-center gap-2 text-neon-green mb-1">
                  <Type className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase">Legenda Sugerida</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{generatedVideo.description}</p>
              </div>

              <div className="glass-card p-4 space-y-2">
                <div className="flex items-center gap-2 text-neon-blue mb-1">
                  <Hash className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase">Hashtags Virais</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {generatedVideo.hashtags?.map(tag => (
                    <span key={tag} className="text-xs font-bold text-neon-blue">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="py-4 bg-white/5 border border-white/10 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10">
                <Download className="w-5 h-5" /> Baixar
              </button>
              <button className="py-4 bg-neon-green text-black rounded-2xl font-bold flex items-center justify-center gap-2 neon-shadow-green">
                <Share2 className="w-5 h-5" /> Publicar
              </button>
            </div>

            <button
              onClick={() => setStep('input')}
              className="w-full py-4 text-gray-500 font-bold text-sm"
            >
              Criar outro vídeo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

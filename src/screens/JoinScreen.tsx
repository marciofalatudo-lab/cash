import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Loader2, Zap } from 'lucide-react';

export default function JoinScreen() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ref = searchParams.get('ref');

  useEffect(() => {
    // Small delay for effect
    const timer = setTimeout(() => {
      navigate(`/login${ref ? `?ref=${ref}` : ''}`);
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigate, ref]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg text-center px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="space-y-6"
      >
        <div className="w-20 h-20 bg-neon-green/20 rounded-3xl flex items-center justify-center mx-auto neon-shadow-green">
          <Zap className="w-10 h-10 text-neon-green fill-neon-green" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black">CASH VÍDEOS AI</h1>
          <p className="text-gray-400">Preparando seu convite especial...</p>
        </div>
        <Loader2 className="w-8 h-8 text-neon-green animate-spin mx-auto" />
      </motion.div>
    </div>
  );
}

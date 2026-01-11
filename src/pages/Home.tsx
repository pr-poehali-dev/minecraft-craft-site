import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-green-300 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-7xl md:text-8xl font-bold text-stone-800 mb-4 pixel-shadow">
            ⛏️ Добро пожаловать! 🎮
          </h1>
          <p className="text-2xl md:text-3xl text-stone-700 font-semibold">
            в энциклопедию крафтов Minecraft
          </p>
        </div>
        
        <div className="mt-12 animate-scale-in">
          <Button
            onClick={() => navigate('/crafts')}
            className="text-2xl px-8 py-6 h-auto pixel-shadow pixel-shadow-hover border-4 border-gray-700 bg-amber-500 hover:bg-amber-600 text-white font-bold"
          >
            🚀 Перейти к крафтам
          </Button>
        </div>

        <div className="mt-8 text-stone-600 text-lg">
          <p>Найди все рецепты • Сохрани избранное • Изучай мир Minecraft</p>
        </div>
      </div>
    </div>
  );
}

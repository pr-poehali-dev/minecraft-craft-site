import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

type CraftItem = {
  id: string;
  name: string;
  category: 'tools' | 'weapons' | 'blocks' | 'food';
  ingredients: string[];
  grid: (string | null)[][];
  description: string;
};

const crafts: CraftItem[] = [
  {
    id: '1',
    name: 'Деревянная кирка',
    category: 'tools',
    ingredients: ['Доски', 'Палки'],
    grid: [
      ['Доски', 'Доски', 'Доски'],
      [null, 'Палки', null],
      [null, 'Палки', null],
    ],
    description: 'Базовый инструмент для добычи камня',
  },
  {
    id: '2',
    name: 'Алмазный меч',
    category: 'weapons',
    ingredients: ['Алмазы', 'Палки'],
    grid: [
      [null, 'Алмазы', null],
      [null, 'Алмазы', null],
      [null, 'Палки', null],
    ],
    description: 'Мощное оружие с высоким уроном',
  },
  {
    id: '3',
    name: 'Верстак',
    category: 'blocks',
    ingredients: ['Доски'],
    grid: [
      ['Доски', 'Доски', null],
      ['Доски', 'Доски', null],
      [null, null, null],
    ],
    description: 'Необходим для крафта сложных предметов',
  },
  {
    id: '4',
    name: 'Хлеб',
    category: 'food',
    ingredients: ['Пшеница'],
    grid: [
      ['Пшеница', 'Пшеница', 'Пшеница'],
      [null, null, null],
      [null, null, null],
    ],
    description: 'Восстанавливает 5 единиц голода',
  },
  {
    id: '5',
    name: 'Железная броня',
    category: 'tools',
    ingredients: ['Железные слитки'],
    grid: [
      ['Железо', null, 'Железо'],
      ['Железо', 'Железо', 'Железо'],
      ['Железо', 'Железо', 'Железо'],
    ],
    description: 'Защита от урона',
  },
  {
    id: '6',
    name: 'Лук',
    category: 'weapons',
    ingredients: ['Палки', 'Нить'],
    grid: [
      [null, 'Палки', 'Нить'],
      ['Палки', null, 'Нить'],
      [null, 'Палки', 'Нить'],
    ],
    description: 'Дальнобойное оружие',
  },
  {
    id: '7',
    name: 'Факел',
    category: 'blocks',
    ingredients: ['Уголь', 'Палки'],
    grid: [
      [null, 'Уголь', null],
      [null, 'Палки', null],
      [null, null, null],
    ],
    description: 'Источник света',
  },
  {
    id: '8',
    name: 'Золотое яблоко',
    category: 'food',
    ingredients: ['Яблоко', 'Золотые слитки'],
    grid: [
      ['Золото', 'Золото', 'Золото'],
      ['Золото', 'Яблоко', 'Золото'],
      ['Золото', 'Золото', 'Золото'],
    ],
    description: 'Дает регенерацию и поглощение',
  },
];

const categoryIcons = {
  tools: 'Pickaxe',
  weapons: 'Sword',
  blocks: 'Box',
  food: 'Apple',
};

const categoryNames = {
  tools: 'Инструменты',
  weapons: 'Оружие',
  blocks: 'Блоки',
  food: 'Еда',
};

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('minecraft-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedCraft, setSelectedCraft] = useState<CraftItem | null>(null);

  const filteredCrafts = useMemo(() => {
    return crafts.filter((craft) => {
      const matchesSearch = craft.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || craft.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const favoriteCrafts = useMemo(() => {
    return crafts.filter((craft) => favorites.includes(craft.id));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((fav) => fav !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem('minecraft-favorites', JSON.stringify(newFavorites));
  };

  const CraftCard = ({ craft }: { craft: CraftItem }) => (
    <Card
      className="cursor-pointer transition-all pixel-shadow pixel-shadow-hover border-4 border-gray-600 bg-stone-100 hover:bg-stone-200"
      onClick={() => setSelectedCraft(craft)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon name={categoryIcons[craft.category]} size={20} />
              {craft.name}
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              {craft.description}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:scale-110 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(craft.id);
            }}
          >
            <Icon
              name={favorites.includes(craft.id) ? 'Star' : 'Star'}
              size={20}
              className={favorites.includes(craft.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Badge className="pixel-border bg-stone-600 text-white">
          {categoryNames[craft.category]}
        </Badge>
      </CardContent>
    </Card>
  );

  const CraftDetailModal = ({ craft }: { craft: CraftItem }) => (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={() => setSelectedCraft(null)}
    >
      <Card
        className="max-w-2xl w-full pixel-shadow border-4 border-gray-700 bg-stone-50"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Icon name={categoryIcons[craft.category]} size={32} />
              <div>
                <CardTitle className="text-2xl">{craft.name}</CardTitle>
                <CardDescription className="text-base mt-1">
                  {craft.description}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedCraft(null)}
            >
              <Icon name="X" size={24} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3">Сетка крафта 3×3</h3>
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {craft.grid.flat().map((cell, index) => (
                <div
                  key={index}
                  className={`aspect-square border-4 border-gray-600 flex items-center justify-center text-xs font-semibold pixel-shadow ${
                    cell ? 'bg-amber-100' : 'bg-gray-300'
                  }`}
                >
                  {cell}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Ингредиенты</h3>
            <div className="flex flex-wrap gap-2">
              {craft.ingredients.map((ingredient, idx) => (
                <Badge
                  key={idx}
                  className="pixel-border bg-green-600 text-white text-sm"
                >
                  {ingredient}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-green-200 to-green-300">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-bold text-stone-800 mb-3 pixel-shadow inline-block">
            ⛏️ Minecraft Крафты
          </h1>
          <p className="text-xl text-stone-700">
            Энциклопедия рецептов крафта
          </p>
        </header>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedCategory}>
            <TabsList className="w-full mb-6 pixel-shadow border-4 border-gray-600 bg-stone-200 h-auto flex-wrap gap-2 p-2">
              <TabsTrigger
                value="all"
                className="pixel-border data-[state=active]:bg-amber-500 data-[state=active]:text-white"
              >
                <Icon name="Grid3x3" size={18} className="mr-2" />
                Все крафты
              </TabsTrigger>
              <TabsTrigger
                value="tools"
                className="pixel-border data-[state=active]:bg-amber-500 data-[state=active]:text-white"
              >
                <Icon name="Pickaxe" size={18} className="mr-2" />
                Инструменты
              </TabsTrigger>
              <TabsTrigger
                value="weapons"
                className="pixel-border data-[state=active]:bg-amber-500 data-[state=active]:text-white"
              >
                <Icon name="Sword" size={18} className="mr-2" />
                Оружие
              </TabsTrigger>
              <TabsTrigger
                value="blocks"
                className="pixel-border data-[state=active]:bg-amber-500 data-[state=active]:text-white"
              >
                <Icon name="Box" size={18} className="mr-2" />
                Блоки
              </TabsTrigger>
              <TabsTrigger
                value="food"
                className="pixel-border data-[state=active]:bg-amber-500 data-[state=active]:text-white"
              >
                <Icon name="Apple" size={18} className="mr-2" />
                Еда
              </TabsTrigger>
              <TabsTrigger
                value="favorites"
                className="pixel-border data-[state=active]:bg-amber-500 data-[state=active]:text-white"
              >
                <Icon name="Star" size={18} className="mr-2" />
                Избранное ({favorites.length})
              </TabsTrigger>
            </TabsList>

            <div className="mb-6">
              <div className="relative">
                <Icon
                  name="Search"
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <Input
                  type="text"
                  placeholder="Поиск крафта..."
                  className="pl-12 h-14 text-lg pixel-shadow border-4 border-gray-600 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCrafts.map((craft) => (
                  <CraftCard key={craft.id} craft={craft} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tools" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCrafts.map((craft) => (
                  <CraftCard key={craft.id} craft={craft} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="weapons" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCrafts.map((craft) => (
                  <CraftCard key={craft.id} craft={craft} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="blocks" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCrafts.map((craft) => (
                  <CraftCard key={craft.id} craft={craft} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="food" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCrafts.map((craft) => (
                  <CraftCard key={craft.id} craft={craft} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="mt-0">
              {favoriteCrafts.length === 0 ? (
                <Card className="p-12 text-center pixel-shadow border-4 border-gray-600 bg-stone-100">
                  <Icon name="Star" size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-xl text-gray-600">
                    У вас пока нет избранных крафтов
                  </p>
                  <p className="text-gray-500 mt-2">
                    Нажмите на звёздочку, чтобы добавить крафт в избранное
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteCrafts.map((craft) => (
                    <CraftCard key={craft.id} craft={craft} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {selectedCraft && <CraftDetailModal craft={selectedCraft} />}
    </div>
  );
}

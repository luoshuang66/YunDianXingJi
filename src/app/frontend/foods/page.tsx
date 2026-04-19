// src/app/frontend/foods/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { MapPin } from 'lucide-react';

// 美食类型，和数据库表字段对应
type Food = {
  id: string;
  name: string;
  city: string;
  description: string;
  image_url: string;
};

export default function FoodsPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getFoods() {
      setLoading(true);
      const { data, error } = await supabase
        .from('foods') // 数据库美食表名
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('取数据失败：', error);
      } else {
        setFoods(data || []);
      }
      setLoading(false);
    }
    getFoods();
  }, []);

  if (loading) {
    return <div className="container mx-auto py-20 text-center text-emerald-700">加载中...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-16 bg-emerald-50 min-h-screen">
      {/* 页面标题 - 中国风设计 */}
      <div className="text-center mb-16">
        <div className="inline-block p-6 relative">
          <div className="absolute inset-0 border-4 border-double border-emerald-300 rounded-2xl"></div>
          <div className="relative">
            <h1 className="text-4xl font-bold text-emerald-800 mb-4">云南特色美食</h1>
            <p className="text-emerald-600 text-lg">品味地道滇味，感受云南的人间烟火</p>
            <div className="w-40 h-1 bg-emerald-300 mx-auto mt-6"></div>
          </div>
        </div>
      </div>

      {foods.length === 0 ? (
        <div className="text-center py-20 text-emerald-600">
          暂无美食数据，请先在Supabase数据库的foods表里添加内容
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {foods.map((food) => (
            <Link
              href={`/frontend/foods/${food.id}`} // 详情页路径
              key={food.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-emerald-100"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={food.image_url || `https://picsum.photos/seed/${food.id}/800/600`}
                  alt={food.name}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-emerald-800 mb-2">{food.name}</h3>
                <div className="flex items-center text-emerald-600 text-sm mb-3">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{food.city}</span>
                </div>
                <p className="text-emerald-700 line-clamp-2">{food.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
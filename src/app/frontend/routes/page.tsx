// src/app/frontend/routes/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Route = {
  id: string;
  name: string;
  days: number;
  description: string;
  image_url: string;
};

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getRoutes() {
      setLoading(true);
      const { data, error } = await supabase
        .from('routes') // 你的数据库路线表名
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('取数据失败：', error);
      } else {
        setRoutes(data || []);
      }
      setLoading(false);
    }
    getRoutes();
  }, []);

  if (loading) {
    return <div className="container py-20 text-center font-serif text-xl">加载中...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-16 bg-paper min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif font-bold mb-4">云南精品路线</h1>
        <p className="text-gray-2 text-lg">省心规划，一站式玩转云南</p>
        <div className="chinese-line max-w-xl mx-auto mt-8"></div>
      </div>

      {routes.length === 0 ? (
        <div className="text-center py-20 text-gray-2 font-serif text-xl">
          暂无路线数据，请先在Supabase数据库的routes表里添加内容
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {routes.map((route) => (
            <Link
              href={`/frontend/routes/${route.id}`} // 详情页路径和你的目录匹配
              key={route.id}
              className="chinese-card overflow-hidden flex flex-col md:flex-row hover:-translate-x-1"
            >
              <div className="md:w-1/3">
                <img
                  src={route.image_url || `https://picsum.photos/seed/${route.id}/600/800`}
                  alt={route.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:w-2/3">
                <div className="inline-block bg-secondary-bg text-secondary px-3 py-1 rounded-full text-sm mb-3">
                  {route.days}天行程
                </div>
                <h3 className="text-xl font-serif font-bold mb-3">{route.name}</h3>
                <p className="text-gray-1 line-clamp-3 mb-4">{route.description}</p>
                <span className="text-primary font-serif">查看详情 →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// src/app/frontend/routes/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Route = {
  id: string;
  name: string;
  days: number;
  description: string;
  image_url: string;
  route_plan: string;
};

export default function RouteDetail() {
  const { id } = useParams();
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);

      const { data: routeData, error } = await supabase
        .from('routes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('获取路线失败：', error);
      } else {
        setRoute(routeData as Route);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) return <div className="container py-20 text-center font-serif text-xl">加载中...</div>;
  if (!route) return <div className="container py-20 text-center font-serif text-xl">路线不存在</div>;

  return (
    <div className="container mx-auto px-6 py-12 bg-paper min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif font-bold mb-2">{route.name}</h1>
        <p className="text-gray-2">{route.days}天行程</p>
        <div className="chinese-line max-w-xl mx-auto mt-6"></div>
      </div>

      <div className="max-w-4xl mx-auto mb-12">
        <div className="painting-frame">
          <img
            src={route.image_url || `https://picsum.photos/seed/${route.id}/1200/800`}
            alt={route.name}
            className="w-full h-auto object-cover rounded"
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto mb-16 chinese-card p-8">
        <h2 className="text-2xl font-serif mb-4 text-center">路线介绍</h2>
        <div className="chinese-line w-1/2 mx-auto mb-6"></div>
        <p className="text-gray-1 leading-8 text-lg mb-8">{route.description}</p>

        <h3 className="text-xl font-serif mb-4 text-center">行程规划</h3>
        <div className="chinese-line w-1/3 mx-auto mb-6"></div>
        <p className="text-gray-1 leading-8">{route.route_plan || '暂无详细行程'}</p>
      </div>
    </div>
  );
}
// src/app/admin/spots/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Spot = {
  id: number;
  name: string;
  area: string;
  description?: string;
  image_url?: string;
};

export default function AdminSpots() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSpot, setEditingSpot] = useState<Spot | null>(null);
  const [formData, setFormData] = useState<Spot>({
    id: 0,
    name: '',
    area: '',
    description: '',
    image_url: ''
  });

  useEffect(() => {
    getSpots();
  }, []);

  async function getSpots() {
    const { data } = await supabase.from('spots').select('*');
    setSpots(data as Spot[]);
  }

  async function handleAddSpot() {
    const { error } = await supabase
      .from('spots')
      .insert({
        name: formData.name,
        area: formData.area,
        description: formData.description,
        image_url: formData.image_url
      });
    if (!error) {
      getSpots();
      setShowAddModal(false);
      resetForm();
    }
  }

  async function handleUpdateSpot() {
    if (!editingSpot) return;
    const { error } = await supabase
      .from('spots')
      .update({
        name: formData.name,
        area: formData.area,
        description: formData.description,
        image_url: formData.image_url
      })
      .eq('id', editingSpot.id);
    if (!error) {
      getSpots();
      setEditingSpot(null);
      resetForm();
    }
  }

  async function handleDeleteSpot(id: number) {
    if (confirm('确定要删除这个景点吗？')) {
      const { error } = await supabase.from('spots').delete().eq('id', id);
      if (!error) {
        getSpots();
      }
    }
  }

  function resetForm() {
    setFormData({
      id: 0,
      name: '',
      area: '',
      description: '',
      image_url: ''
    });
  }

  function handleEdit(spot: Spot) {
    setEditingSpot(spot);
    setFormData(spot);
  }

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">景点管理</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
        >
          添加景点
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spots.map(s => (
          <div key={s.id} className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg text-emerald-800">{s.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(s)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  编辑
                </button>
                <button
                  onClick={() => handleDeleteSpot(s.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  删除
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-2">{s.area}</p>
            {s.description && (
              <p className="text-gray-500 text-sm mb-4">{s.description.substring(0, 100)}...</p>
            )}
            {s.image_url && (
              <div className="h-40 bg-gray-200 rounded overflow-hidden">
                <img src={s.image_url} alt={s.name} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 添加景点模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">添加景点</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">景点名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">地区</label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">描述</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">图片 URL</label>
                <input
                  type="text"
                  value={formData.image_url || ''}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddSpot}
                  className="flex-1 bg-emerald-700 text-white rounded-lg px-4 py-2 hover:bg-emerald-800"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 编辑景点模态框 */}
      {editingSpot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">编辑景点</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">景点名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">地区</label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">描述</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">图片 URL</label>
                <input
                  type="text"
                  value={formData.image_url || ''}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateSpot}
                  className="flex-1 bg-emerald-700 text-white rounded-lg px-4 py-2 hover:bg-emerald-800"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setEditingSpot(null);
                    resetForm();
                  }}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
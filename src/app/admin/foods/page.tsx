// src/app/admin/foods/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Food = {
  id: number;
  name: string;
  area: string;
  description?: string;
  image_url?: string;
};

export default function AdminFoods() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [formData, setFormData] = useState<Food>({
    id: 0,
    name: '',
    area: '',
    description: '',
    image_url: ''
  });

  useEffect(() => {
    getFoods();
  }, []);

  async function getFoods() {
    const { data } = await supabase.from('foods').select('*');
    setFoods(data as Food[]);
  }

  async function handleAddFood() {
    const { error } = await supabase
      .from('foods')
      .insert({
        name: formData.name,
        area: formData.area,
        description: formData.description,
        image_url: formData.image_url
      });
    if (!error) {
      getFoods();
      setShowAddModal(false);
      resetForm();
    }
  }

  async function handleUpdateFood() {
    if (!editingFood) return;
    const { error } = await supabase
      .from('foods')
      .update({
        name: formData.name,
        area: formData.area,
        description: formData.description,
        image_url: formData.image_url
      })
      .eq('id', editingFood.id);
    if (!error) {
      getFoods();
      setEditingFood(null);
      resetForm();
    }
  }

  async function handleDeleteFood(id: number) {
    if (confirm('确定要删除这个美食吗？')) {
      const { error } = await supabase.from('foods').delete().eq('id', id);
      if (!error) {
        getFoods();
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

  function handleEdit(food: Food) {
    setEditingFood(food);
    setFormData(food);
  }

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">美食管理</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
        >
          添加美食
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {foods.map(f => (
          <div key={f.id} className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg text-emerald-800">{f.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(f)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  编辑
                </button>
                <button
                  onClick={() => handleDeleteFood(f.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  删除
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-2">{f.area}</p>
            {f.description && (
              <p className="text-gray-500 text-sm mb-4">{f.description.substring(0, 100)}...</p>
            )}
            {f.image_url && (
              <div className="h-40 bg-gray-200 rounded overflow-hidden">
                <img src={f.image_url} alt={f.name} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 添加美食模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">添加美食</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">美食名称</label>
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
                  onClick={handleAddFood}
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

      {/* 编辑美食模态框 */}
      {editingFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">编辑美食</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">美食名称</label>
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
                  onClick={handleUpdateFood}
                  className="flex-1 bg-emerald-700 text-white rounded-lg px-4 py-2 hover:bg-emerald-800"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setEditingFood(null);
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
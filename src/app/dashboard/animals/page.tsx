'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { contentApi, Animal } from '@/lib/api'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

export default function AnimalsPage() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Animal | null>(null)
  const [formData, setFormData] = useState({
    name: '', nameEnglish: '', description: '', funFact: '', emoji: '', difficulty: 'easy',
  })

  const { data: animals, isLoading } = useQuery({
    queryKey: ['animals'],
    queryFn: () => contentApi.getAnimals(),
  })

  const createMutation = useMutation({
    mutationFn: () => contentApi.createAnimal(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] })
      toast.success('Hewan berhasil ditambahkan')
      closeModal()
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Gagal'),
  })

  const updateMutation = useMutation({
    mutationFn: () => contentApi.updateAnimal(editingItem!.id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] })
      toast.success('Hewan berhasil diupdate')
      closeModal()
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Gagal'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => contentApi.deleteAnimal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] })
      toast.success('Hewan berhasil dihapus')
    },
  })

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData({ name: '', nameEnglish: '', description: '', funFact: '', emoji: '', difficulty: 'easy' })
    setShowModal(true)
  }

  const openEditModal = (item: Animal) => {
    setEditingItem(item)
    setFormData({
      name: item.name, nameEnglish: item.nameEnglish, description: item.description,
      funFact: item.funFact, emoji: item.emoji, difficulty: item.difficulty,
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingItem(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    editingItem ? updateMutation.mutate() : createMutation.mutate()
  }

  const difficultyColors: Record<string, string> = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Animals (Hewan)</h1>
          <p className="text-gray-500">Kelola konten hewan</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          <Plus size={20} />
          Tambah Hewan
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-8 text-gray-500">Loading...</div>
        ) : (
          animals?.data?.data?.map((animal) => (
            <div key={animal.id} className="bg-white rounded-xl shadow-sm p-5 group hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl">{animal.emoji}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${difficultyColors[animal.difficulty]}`}>
                  {animal.difficulty}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800">{animal.name}</h3>
              <p className="text-sm text-gray-400">{animal.nameEnglish}</p>
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{animal.description}</p>
              <div className="flex justify-end gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditModal(animal)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => confirm(`Hapus ${animal.name}?`) && deleteMutation.mutate(animal.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h3 className="text-lg font-semibold">{editingItem ? 'Edit Hewan' : 'Tambah Hewan'}</h3>
              <button onClick={closeModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama (ID)</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama (EN)</label>
                  <input
                    type="text"
                    value={formData.nameEnglish}
                    onChange={(e) => setFormData({ ...formData, nameEnglish: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:border-green-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emoji</label>
                  <input
                    type="text"
                    value={formData.emoji}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:border-green-500"
                    placeholder="🐱"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:border-green-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:border-green-500"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fakta Menarik</label>
                <textarea
                  value={formData.funFact}
                  onChange={(e) => setFormData({ ...formData, funFact: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:border-green-500"
                  rows={2}
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border rounded-lg">Batal</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

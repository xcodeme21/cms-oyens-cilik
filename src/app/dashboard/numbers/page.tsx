'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { contentApi, NumberContent } from '@/lib/api'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

export default function NumbersPage() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<NumberContent | null>(null)
  const [formData, setFormData] = useState({ value: 0, word: '', pronunciation: '' })

  const { data: numbers, isLoading } = useQuery({
    queryKey: ['numbers'],
    queryFn: () => contentApi.getNumbers(),
  })

  const createMutation = useMutation({
    mutationFn: () => contentApi.createNumber(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['numbers'] })
      toast.success('Angka berhasil ditambahkan')
      closeModal()
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Gagal'),
  })

  const updateMutation = useMutation({
    mutationFn: () => contentApi.updateNumber(editingItem!.id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['numbers'] })
      toast.success('Angka berhasil diupdate')
      closeModal()
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Gagal'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => contentApi.deleteNumber(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['numbers'] })
      toast.success('Angka berhasil dihapus')
    },
  })

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData({ value: 0, word: '', pronunciation: '' })
    setShowModal(true)
  }

  const openEditModal = (item: NumberContent) => {
    setEditingItem(item)
    setFormData({ value: item.value, word: item.word, pronunciation: item.pronunciation })
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Numbers (Angka)</h1>
          <p className="text-gray-500">Kelola konten angka 0-20</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          <Plus size={20} />
          Tambah Angka
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-8 text-gray-500">Loading...</div>
        ) : (
          numbers?.data?.data?.map((num) => (
            <div
              key={num.id}
              className="bg-white rounded-xl shadow-sm p-4 text-center group hover:shadow-md transition-shadow"
            >
              <div className="text-3xl font-bold text-orange-500 mb-1">{num.value}</div>
              <div className="text-sm text-gray-600 truncate">{num.word}</div>
              <div className="flex justify-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditModal(num)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => confirm(`Hapus angka ${num.value}?`) && deleteMutation.mutate(num.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">{editingItem ? 'Edit Angka' : 'Tambah Angka'}</h3>
              <button onClick={closeModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nilai Angka</label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:border-orange-500 outline-none"
                  min={0}
                  max={100}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kata (Indonesian)</label>
                <input
                  type="text"
                  value={formData.word}
                  onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:border-orange-500 outline-none"
                  placeholder="Contoh: Satu"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pengucapan</label>
                <input
                  type="text"
                  value={formData.pronunciation}
                  onChange={(e) => setFormData({ ...formData, pronunciation: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:border-orange-500 outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border rounded-lg">Batal</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

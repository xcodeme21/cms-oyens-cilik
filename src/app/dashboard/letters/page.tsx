'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { contentApi, Letter } from '@/lib/api'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

export default function LettersPage() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Letter | null>(null)
  const [formData, setFormData] = useState({
    letter: '',
    letterLower: '',
    exampleWord: '',
    pronunciation: '',
  })

  const { data: letters, isLoading } = useQuery({
    queryKey: ['letters'],
    queryFn: () => contentApi.getLetters(),
  })

  const createMutation = useMutation({
    mutationFn: () => contentApi.createLetter(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letters'] })
      toast.success('Huruf berhasil ditambahkan')
      closeModal()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal menambahkan huruf')
    },
  })

  const updateMutation = useMutation({
    mutationFn: () => contentApi.updateLetter(editingItem!.id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letters'] })
      toast.success('Huruf berhasil diupdate')
      closeModal()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal mengupdate huruf')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => contentApi.deleteLetter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letters'] })
      toast.success('Huruf berhasil dihapus')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal menghapus huruf')
    },
  })

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData({ letter: '', letterLower: '', exampleWord: '', pronunciation: '' })
    setShowModal(true)
  }

  const openEditModal = (item: Letter) => {
    setEditingItem(item)
    setFormData({
      letter: item.letter,
      letterLower: item.letterLower,
      exampleWord: item.exampleWord,
      pronunciation: item.pronunciation,
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingItem(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingItem) {
      updateMutation.mutate()
    } else {
      createMutation.mutate()
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Letters (Huruf)</h1>
          <p className="text-gray-500">Kelola konten huruf A-Z</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus size={20} />
          Tambah Huruf
        </button>
      </div>

      {/* Letters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-8 text-gray-500">Loading...</div>
        ) : (
          letters?.data?.data?.map((letter) => (
            <div
              key={letter.id}
              className="bg-white rounded-xl shadow-sm p-4 text-center group hover:shadow-md transition-shadow"
            >
              <div className="text-4xl font-bold text-purple-600 mb-1">{letter.letter}</div>
              <div className="text-lg text-gray-400 mb-2">{letter.letterLower}</div>
              <div className="text-sm text-gray-600 truncate">{letter.exampleWord}</div>
              <div className="flex justify-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(letter)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Hapus huruf "${letter.letter}"?`)) {
                      deleteMutation.mutate(letter.id)
                    }
                  }}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">
                {editingItem ? 'Edit Huruf' : 'Tambah Huruf'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Huruf Besar</label>
                  <input
                    type="text"
                    value={formData.letter}
                    onChange={(e) => setFormData({ ...formData, letter: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border rounded-lg focus:border-purple-500 outline-none"
                    maxLength={1}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Huruf Kecil</label>
                  <input
                    type="text"
                    value={formData.letterLower}
                    onChange={(e) => setFormData({ ...formData, letterLower: e.target.value.toLowerCase() })}
                    className="w-full px-4 py-2 border rounded-lg focus:border-purple-500 outline-none"
                    maxLength={1}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contoh Kata</label>
                <input
                  type="text"
                  value={formData.exampleWord}
                  onChange={(e) => setFormData({ ...formData, exampleWord: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:border-purple-500 outline-none"
                  placeholder="Contoh: Apel"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pengucapan</label>
                <input
                  type="text"
                  value={formData.pronunciation}
                  onChange={(e) => setFormData({ ...formData, pronunciation: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:border-purple-500 outline-none"
                  placeholder="Contoh: ah"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border text-gray-600 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

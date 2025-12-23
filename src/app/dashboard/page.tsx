'use client'

import { useQuery } from '@tanstack/react-query'
import { contentApi, adminUsersApi } from '@/lib/api'
import { Type, Hash, Cat, Users } from 'lucide-react'

export default function DashboardPage() {
  const { data: letters } = useQuery({
    queryKey: ['letters'],
    queryFn: () => contentApi.getLetters(),
  })

  const { data: numbers } = useQuery({
    queryKey: ['numbers'],
    queryFn: () => contentApi.getNumbers(),
  })

  const { data: animals } = useQuery({
    queryKey: ['animals'],
    queryFn: () => contentApi.getAnimals(),
  })

  const { data: admins } = useQuery({
    queryKey: ['admins'],
    queryFn: () => adminUsersApi.getAll(),
  })

  const stats = [
    {
      label: 'Letters',
      value: letters?.data?.data?.length || 0,
      icon: Type,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Numbers',
      value: numbers?.data?.data?.length || 0,
      icon: Hash,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Animals',
      value: animals?.data?.data?.length || 0,
      icon: Cat,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Admin Users',
      value: admins?.data?.data?.length || 0,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Overview of Oyens Cilik content</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4"
          >
            <div className={`${stat.bgColor} p-3 rounded-lg`}>
              <stat.icon className={`w-6 h-6 text-${stat.color.replace('bg-', '')}`} />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Info */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">📚 Content Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Huruf (A-Z)</span>
              <span className="font-medium">{letters?.data?.data?.length || 0} items</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Angka (0-20)</span>
              <span className="font-medium">{numbers?.data?.data?.length || 0} items</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Hewan</span>
              <span className="font-medium">{animals?.data?.data?.length || 0} items</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-orange-400 rounded-xl shadow-sm p-6 text-white">
          <h3 className="font-semibold mb-2">🐱 Oyens Cilik CMS</h3>
          <p className="text-white/80 text-sm mb-4">
            Kelola semua konten pembelajaran untuk aplikasi Oyens Cilik dari sini.
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{letters?.data?.data?.length || 0}</div>
              <div className="text-xs text-white/70">Huruf</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{numbers?.data?.data?.length || 0}</div>
              <div className="text-xs text-white/70">Angka</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{animals?.data?.data?.length || 0}</div>
              <div className="text-xs text-white/70">Hewan</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

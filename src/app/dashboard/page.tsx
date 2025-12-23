'use client'

import { useQuery } from '@tanstack/react-query'
import { contentApi, adminUsersApi, statsApi, DashboardStats, RecentActivity, TopLearner } from '@/lib/api'
import { Type, Hash, Cat, Users, Star, TrendingUp, Calendar, Activity, Award, BookOpen, RefreshCw } from 'lucide-react'

export default function DashboardPage() {
  // Fetch content counts
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

  // Fetch dashboard stats from API
  const { data: dashboardStats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => statsApi.getDashboard(),
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ['recentActivity'],
    queryFn: () => statsApi.getRecentActivity(),
    refetchInterval: 10000, // Refresh every 10 seconds
  })

  const { data: topLearners, isLoading: learnersLoading } = useQuery({
    queryKey: ['topLearners'],
    queryFn: () => statsApi.getTopLearners(),
    refetchInterval: 60000, // Refresh every minute
  })

  // Use API data or fallback to defaults
  const stats: DashboardStats = dashboardStats?.data?.data || {
    userStats: {
      totalUsers: 0,
      totalChildren: 0,
      activeToday: 0,
      totalStarsEarned: 0,
      totalLessonsCompleted: 0,
      averageStreak: '0',
    },
    contentStats: {
      letters: letters?.data?.data?.length || 0,
      numbers: numbers?.data?.data?.length || 0,
      animals: animals?.data?.data?.length || 0,
      totalProgress: 0,
      todayProgress: 0,
    },
  }

  const activities: RecentActivity[] = recentActivity?.data?.data || []
  const learners: TopLearner[] = topLearners?.data?.data || []

  const contentStats = [
    {
      label: 'Huruf',
      value: letters?.data?.data?.length || stats.contentStats.letters,
      icon: Type,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500',
    },
    {
      label: 'Angka',
      value: numbers?.data?.data?.length || stats.contentStats.numbers,
      icon: Hash,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-500',
    },
    {
      label: 'Hewan',
      value: animals?.data?.data?.length || stats.contentStats.animals,
      icon: Cat,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
    },
    {
      label: 'Admin',
      value: admins?.data?.data?.length || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
  ]

  const getContentTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      letter: 'Huruf',
      number: 'Angka',
      animal: 'Hewan',
    }
    return labels[type] || type
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Selamat datang di Oyens Cilik Admin Panel</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => refetchStats()}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-500 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${statsLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* User Stats - Highlight Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.userStats.totalUsers}</p>
              <p className="text-white/80 text-sm">Total Users</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.userStats.totalStarsEarned.toLocaleString()}</p>
              <p className="text-white/80 text-sm">Total Bintang</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.userStats.totalLessonsCompleted.toLocaleString()}</p>
              <p className="text-white/80 text-sm">Pelajaran Selesai</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.userStats.activeToday}</p>
              <p className="text-white/80 text-sm">Aktif Hari Ini</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {contentStats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`${stat.bgColor} p-3 rounded-xl`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Aktivitas Terbaru
            </h3>
            <span className={`text-xs ${activityLoading ? 'text-purple-500' : 'text-gray-400'}`}>
              {activityLoading ? 'Updating...' : 'Real-time'}
            </span>
          </div>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity, idx) => (
                <div key={idx} className="flex items-center gap-4 py-3 border-b last:border-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-orange-400 rounded-full flex items-center justify-center text-white font-bold">
                    {activity.childName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{activity.childName}</p>
                    <p className="text-sm text-gray-500">
                      {activity.completed ? 'Menyelesaikan' : 'Belajar'} {getContentTypeLabel(activity.contentType)} {activity.contentId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-500 font-semibold">+{activity.starsEarned} ⭐</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Belum ada aktivitas</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Learners */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-yellow-500" />
            Top Learners
          </h3>
          <div className="space-y-4">
            {learners.length > 0 ? (
              learners.map((learner, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-600' : 'bg-gray-300'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{learner.name}</p>
                    <p className="text-xs text-gray-500">
                      {learner.levelTitle} • 🔥 {learner.streak} hari
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-500">{learner.stars}</p>
                    <p className="text-xs text-gray-400">⭐</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Belum ada data</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Oyens Mascot Card */}
      <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="text-6xl">🐱</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Oyens Cilik CMS</h3>
            <p className="text-white/80 text-sm mb-4">
              Kelola semua konten pembelajaran untuk aplikasi Oyens Cilik. 
              Tambah, edit, dan hapus materi huruf, angka, dan hewan dengan mudah.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-3xl font-bold">{letters?.data?.data?.length || 0}</div>
              <div className="text-sm text-white/70">Huruf</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-3xl font-bold">{numbers?.data?.data?.length || 0}</div>
              <div className="text-sm text-white/70">Angka</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-3xl font-bold">{animals?.data?.data?.length || 0}</div>
              <div className="text-sm text-white/70">Hewan</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

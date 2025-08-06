"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Zap, Target, Crown, Medal, Award, Flame } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: "learning" | "consistency" | "social" | "special"
  earnedAt?: string
  progress?: number
  maxProgress?: number
  isUnlocked: boolean
  rarity: "common" | "rare" | "epic" | "legendary"
}

interface UserStats {
  totalPoints: number
  currentStreak: number
  longestStreak: number
  level: number
  experiencePoints: number
  experienceToNextLevel: number
  rank: number
  totalUsers: number
}

interface GamificationSystemProps {
  userStats: UserStats
  achievements: Achievement[]
}

export function GamificationSystem({ userStats, achievements }: GamificationSystemProps) {
  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'learning': return <Star className="w-4 h-4" />
      case 'consistency': return <Flame className="w-4 h-4" />
      case 'social': return <Trophy className="w-4 h-4" />
      case 'special': return <Crown className="w-4 h-4" />
      default: return <Award className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Player Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-600">{userStats.totalPoints.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Toplam Puan</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-600">{userStats.currentStreak}</p>
                <p className="text-sm text-gray-600">Günlük Seri</p>
              </div>
              <Flame className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600">{userStats.level}</p>
                <p className="text-sm text-gray-600">Seviye</p>
              </div>
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">#{userStats.rank}</p>
                <p className="text-sm text-gray-600">Sıralama</p>
              </div>
              <Crown className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Seviye İlerleme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Seviye {userStats.level}</span>
              <span className="text-sm text-gray-600">
                {userStats.experiencePoints} / {userStats.experienceToNextLevel} XP
              </span>
            </div>
            <Progress 
              value={(userStats.experiencePoints / userStats.experienceToNextLevel) * 100} 
              className="h-3"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Mevcut seviye</span>
              <span>Seviye {userStats.level + 1}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Başarılar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className={`relative ${achievement.isUnlocked ? 'border-2' : 'opacity-50'} ${getRarityColor(achievement.rarity)}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${achievement.isUnlocked ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-medium text-sm ${achievement.isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                          {achievement.title}
                        </h4>
                        {getCategoryIcon(achievement.category)}
                      </div>
                      <p className={`text-xs ${achievement.isUnlocked ? 'text-gray-600' : 'text-gray-400'} mb-2`}>
                        {achievement.description}
                      </p>
                      
                      {achievement.progress !== undefined && achievement.maxProgress && (
                        <div className="space-y-1">
                          <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-1" />
                          <div className="text-xs text-gray-500">
                            {achievement.progress} / {achievement.maxProgress}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs px-2 py-1 ${getRarityColor(achievement.rarity)}`}
                        >
                          {achievement.rarity}
                        </Badge>
                        {achievement.earnedAt && (
                          <span className="text-xs text-green-600">
                            ✓ {new Date(achievement.earnedAt).toLocaleDateString('tr-TR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Liderlik Tablosu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }, (_, i) => {
              const rank = i + 1
              const isCurrentUser = rank === userStats.rank
              return (
                <div 
                  key={rank}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isCurrentUser ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      rank === 1 ? 'bg-yellow-500 text-white' :
                      rank === 2 ? 'bg-gray-400 text-white' :
                      rank === 3 ? 'bg-amber-600 text-white' :
                      'bg-gray-200 text-gray-700'
                    }`}>
                      {rank <= 3 ? (
                        <Crown className="w-4 h-4" />
                      ) : (
                        rank
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                        {isCurrentUser ? 'Sen' : `Öğrenci ${rank}`}
                      </p>
                      <p className="text-sm text-gray-600">Seviye {15 - rank + userStats.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                      {(userStats.totalPoints - (rank - userStats.rank) * 150).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">puan</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GamificationSystem
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Clock, Star, Users, FileText, Video, Play } from "lucide-react"

interface Course {
  id: number
  title: string
  instructor: string
  level: string
  progress: number
  duration: string
  students: number
  rating: number
  description: string
  image: string
  modules: Module[]
}

interface Module {
  id: number
  title: string
  duration: string
  completed: boolean
  type: 'video' | 'reading' | 'quiz' | 'assignment'
}

export default function CoursesPage() {
  const [courses] = useState<Course[]>([
    {
      id: 1,
      title: "İngilizce B1 Seviyesi",
      instructor: "Ahmet Yılmaz",
      level: "B1",
      progress: 75,
      duration: "12 hafta",
      students: 45,
      rating: 4.8,
      description: "Orta seviye İngilizce kursu. Grammer, vocabulary ve speaking becerilerini geliştirin.",
      image: "/courses/english-b1.jpg",
      modules: [
        { id: 1, title: "Present Perfect Tense", duration: "45 dk", completed: true, type: 'video' },
        { id: 2, title: "Past Continuous", duration: "30 dk", completed: true, type: 'video' },
        { id: 3, title: "Modal Verbs", duration: "60 dk", completed: false, type: 'video' },
        { id: 4, title: "Reading Comprehension", duration: "45 dk", completed: false, type: 'reading' },
        { id: 5, title: "Weekly Quiz", duration: "30 dk", completed: false, type: 'quiz' }
      ]
    },
    {
      id: 2,
      title: "Matematik: Cebir",
      instructor: "Ayşe Demir",
      level: "Orta",
      progress: 60,
      duration: "10 hafta",
      students: 38,
      rating: 4.6,
      description: "Cebirsel ifadeler, denklemler ve eşitsizlikler üzerine kapsamlı kurs.",
      image: "/courses/math-algebra.jpg",
      modules: [
        { id: 1, title: "Cebirsel İfadeler", duration: "50 dk", completed: true, type: 'video' },
        { id: 2, title: "Lineer Denklemler", duration: "45 dk", completed: true, type: 'video' },
        { id: 3, title: "Kuadratik Denklemler", duration: "60 dk", completed: false, type: 'video' },
        { id: 4, title: "Problem Çözme", duration: "40 dk", completed: false, type: 'assignment' }
      ]
    },
    {
      id: 3,
      title: "Fen Bilgisi: Fizik",
      instructor: "Mehmet Kaya",
      level: "İleri",
      progress: 45,
      duration: "14 hafta",
      students: 32,
      rating: 4.9,
      description: "Mekanik, elektrik ve manyetizma konularını içeren fizik kursu.",
      image: "/courses/physics.jpg",
      modules: [
        { id: 1, title: "Kuvvet ve Hareket", duration: "55 dk", completed: true, type: 'video' },
        { id: 2, title: "Enerji ve İş", duration: "50 dk", completed: false, type: 'video' },
        { id: 3, title: "Elektrik Devreleri", duration: "65 dk", completed: false, type: 'video' },
        { id: 4, title: "Manyetizma", duration: "45 dk", completed: false, type: 'reading' }
      ]
    }
  ])

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />
      case 'reading':
        return <FileText className="w-4 h-4" />
      case 'quiz':
        return <Star className="w-4 h-4" />
      case 'assignment':
        return <BookOpen className="w-4 h-4" />
      default:
        return <Play className="w-4 h-4" />
    }
  }

  const getModuleTypeLabel = (type: string) => {
    switch (type) {
      case 'video':
        return 'Video Ders'
      case 'reading':
        return 'Okuma Materyali'
      case 'quiz':
        return 'Quiz'
      case 'assignment':
        return 'Ödev'
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Derslerim</h1>
        <p className="text-gray-600">Kayıtlı olduğunuz dersleri ve ilerlemenizi görüntüleyin</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Aktif Dersler</TabsTrigger>
          <TabsTrigger value="completed">Tamamlanan</TabsTrigger>
          <TabsTrigger value="available">Mevcut Dersler</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription>{course.instructor}</CardDescription>
                    </div>
                    <Badge>{course.level}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{course.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>İlerleme</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.students} öğrenci</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Ders İçeriği</h4>
                    <div className="space-y-1">
                      {course.modules.slice(0, 3).map((module) => (
                        <div key={module.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            {getModuleIcon(module.type)}
                            <span className="text-sm">{module.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {getModuleTypeLabel(module.type)}
                            </Badge>
                            <span className="text-xs text-gray-500">{module.duration}</span>
                            {module.completed && (
                              <Badge className="bg-green-100 text-green-800 text-xs">Tamamlandı</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                      {course.modules.length > 3 && (
                        <div className="text-center">
                          <Button variant="ghost" size="sm" className="text-xs">
                            +{course.modules.length - 3} daha fazla
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1">Devam Et</Button>
                    <Button variant="outline">Detaylar</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <Card>
            <CardContent className="py-8 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">Henüz tamamlanan ders yok</h3>
              <p className="text-gray-600">Aktif derslerinizi tamamlayınca burada görünecek</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="available" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Kimya: Organik Kimya</CardTitle>
                <CardDescription>Dr. Zeynep Aksoy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">Organik bileşikler ve reaksiyonlar üzerine derinlemesine kurs.</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>16 hafta</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>28 öğrenci</span>
                  </div>
                </div>
                <Button className="w-full">Kaydol</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Tarih: Osmanlı Devleti</CardTitle>
                <CardDescription>Prof. Ali Veli</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">Osmanlı Devleti'nin kuruluşundan yıkılışına kadar tarih.</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>14 hafta</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>35 öğrenci</span>
                  </div>
                </div>
                <Button className="w-full">Kaydol</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Bilgisayar: Python</CardTitle>
                <CardDescription>Can Yılmaz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">Programlama öğrenmeye başlamak için temel Python kursu.</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>12 hafta</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>52 öğrenci</span>
                  </div>
                </div>
                <Button className="w-full">Kaydol</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
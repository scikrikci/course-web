"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookOpen, TrendingUp, Award, Calendar, Star, Target } from "lucide-react"

interface Grade {
  id: number
  assignment: string
  course: string
  type: 'assignment' | 'quiz' | 'exam' | 'project'
  grade: number
  maxGrade: number
  date: string
  weight: number
  feedback?: string
}

interface CourseGrade {
  course: string
  instructor: string
  currentGrade: number
  assignments: Grade[]
  gradeBreakdown: {
    assignments: number
    quizzes: number
    exams: number
    participation: number
  }
}

export default function GradesPage() {
  const [courseGrades] = useState<CourseGrade[]>([
    {
      course: "İngilizce B1",
      instructor: "Ahmet Yılmaz",
      currentGrade: 85,
      assignments: [
        {
          id: 1,
          assignment: "Environmental Essay",
          course: "İngilizce B1",
          type: "assignment",
          grade: 88,
          maxGrade: 100,
          date: "2024-12-10",
          weight: 20,
          feedback: "Good structure and vocabulary. Minor grammar errors."
        },
        {
          id: 2,
          assignment: "Vocabulary Quiz Unit 5",
          course: "İngilizce B1",
          type: "quiz",
          grade: 85,
          maxGrade: 100,
          date: "2024-12-08",
          weight: 10
        },
        {
          id: 3,
          assignment: "Midterm Exam",
          course: "İngilizce B1",
          type: "exam",
          grade: 82,
          maxGrade: 100,
          date: "2024-11-20",
          weight: 30
        }
      ],
      gradeBreakdown: {
        assignments: 88,
        quizzes: 85,
        exams: 82,
        participation: 90
      }
    },
    {
      course: "Matematik: Cebir",
      instructor: "Ayşe Demir",
      currentGrade: 92,
      assignments: [
        {
          id: 4,
          assignment: "Algebra Problems Set 3",
          course: "Matematik: Cebir",
          type: "assignment",
          grade: 95,
          maxGrade: 100,
          date: "2024-12-12",
          weight: 15
        },
        {
          id: 5,
          assignment: "First Assessment",
          course: "Matematik: Cebir",
          type: "exam",
          grade: 92,
          maxGrade: 100,
          date: "2024-12-05",
          weight: 25
        },
        {
          id: 6,
          assignment: "Quiz: Linear Equations",
          course: "Matematik: Cebir",
          type: "quiz",
          grade: 90,
          maxGrade: 100,
          date: "2024-11-28",
          weight: 10
        }
      ],
      gradeBreakdown: {
        assignments: 95,
        quizzes: 90,
        exams: 92,
        participation: 85
      }
    },
    {
      course: "Fen Bilgisi: Fizik",
      instructor: "Mehmet Kaya",
      currentGrade: 78,
      assignments: [
        {
          id: 7,
          assignment: "Mechanics Project",
          course: "Fen Bilgisi: Fizik",
          type: "project",
          grade: 75,
          maxGrade: 100,
          date: "2024-12-15",
          weight: 20,
          feedback: "Good effort but needs more detail in calculations."
        },
        {
          id: 8,
          assignment: "Forces and Motion Quiz",
          course: "Fen Bilgisi: Fizik",
          type: "quiz",
          grade: 80,
          maxGrade: 100,
          date: "2024-12-01",
          weight: 15
        }
      ],
      gradeBreakdown: {
        assignments: 75,
        quizzes: 80,
        exams: 0,
        participation: 85
      }
    }
  ])

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600'
    if (grade >= 80) return 'text-blue-600'
    if (grade >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getGradeBadgeColor = (grade: number) => {
    if (grade >= 90) return 'bg-green-100 text-green-800'
    if (grade >= 80) return 'bg-blue-100 text-blue-800'
    if (grade >= 70) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <BookOpen className="w-4 h-4" />
      case 'quiz':
        return <Star className="w-4 h-4" />
      case 'exam':
        return <Target className="w-4 h-4" />
      case 'project':
        return <Award className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'assignment':
        return 'Ödev'
      case 'quiz':
        return 'Quiz'
      case 'exam':
        return 'Sınav'
      case 'project':
        return 'Proje'
      default:
        return type
    }
  }

  const calculateOverallGPA = () => {
    const totalGrades = courseGrades.reduce((sum, course) => sum + course.currentGrade, 0)
    return (totalGrades / courseGrades.length).toFixed(1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notlarım</h1>
        <p className="text-gray-600">Ders notlarınızı ve akademik performansınızı görüntüleyin</p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{calculateOverallGPA()}</p>
                <p className="text-sm text-gray-600">Genel Ortalama</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{courseGrades.length}</p>
                <p className="text-sm text-gray-600">Toplam Ders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {courseGrades.filter(c => c.currentGrade >= 90).length}
                </p>
                <p className="text-sm text-gray-600">Yüksek Not</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {courseGrades.reduce((sum, course) => sum + course.assignments.length, 0)}
                </p>
                <p className="text-sm text-gray-600">Tamamlanan Ödev</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="courses">Ders Bazında</TabsTrigger>
          <TabsTrigger value="trends">Trendler</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {courseGrades.map((courseGrade) => (
              <Card key={courseGrade.course}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{courseGrade.course}</CardTitle>
                      <CardDescription>{courseGrade.instructor}</CardDescription>
                    </div>
                    <Badge className={getGradeBadgeColor(courseGrade.currentGrade)}>
                      {courseGrade.currentGrade}/100
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sonuç</span>
                      <span className={getGradeColor(courseGrade.currentGrade)}>
                        {courseGrade.currentGrade}/100
                      </span>
                    </div>
                    <Progress value={courseGrade.currentGrade} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Ödevler</p>
                      <p className={`font-medium ${getGradeColor(courseGrade.gradeBreakdown.assignments)}`}>
                        {courseGrade.gradeBreakdown.assignments}/100
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Quizler</p>
                      <p className={`font-medium ${getGradeColor(courseGrade.gradeBreakdown.quizzes)}`}>
                        {courseGrade.gradeBreakdown.quizzes}/100
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Sınavlar</p>
                      <p className={`font-medium ${getGradeColor(courseGrade.gradeBreakdown.exams)}`}>
                        {courseGrade.gradeBreakdown.exams > 0 ? courseGrade.gradeBreakdown.exams + '/100' : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Katılım</p>
                      <p className={`font-medium ${getGradeColor(courseGrade.gradeBreakdown.participation)}`}>
                        {courseGrade.gradeBreakdown.participation}/100
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Son Notlar</h4>
                    <div className="space-y-1">
                      {courseGrade.assignments.slice(0, 2).map((assignment) => (
                        <div key={assignment.id} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(assignment.type)}
                            <span>{assignment.assignment}</span>
                          </div>
                          <Badge variant="outline" className={getGradeColor(assignment.grade)}>
                            {assignment.grade}/{assignment.maxGrade}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          {courseGrades.map((courseGrade) => (
            <Card key={courseGrade.course}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{courseGrade.course}</CardTitle>
                    <CardDescription>{courseGrade.instructor}</CardDescription>
                  </div>
                  <Badge className={getGradeBadgeColor(courseGrade.currentGrade)}>
                    {courseGrade.currentGrade}/100
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Tüm Notlar</h4>
                    <div className="space-y-2">
                      {courseGrade.assignments.map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getTypeIcon(assignment.type)}
                            <div>
                              <p className="font-medium">{assignment.assignment}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-3 h-3" />
                                <span>{assignment.date}</span>
                                <Badge variant="outline" className="text-xs">
                                  {getTypeLabel(assignment.type)}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  %{assignment.weight}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getGradeColor(assignment.grade)}>
                              {assignment.grade}/{assignment.maxGrade}
                            </Badge>
                            {assignment.feedback && (
                              <p className="text-xs text-gray-600 mt-1 max-w-48">
                                {assignment.feedback}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performans Trendleri</CardTitle>
              <CardDescription>Zamana göre notlarınızın değişimi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Grafikler Yakında</h3>
                  <p className="text-gray-600">Not trendlerinizi gösteren grafikler bu bölümde yer alacak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">+5.2%</div>
                <p className="text-sm text-gray-600">Son 30 günde iyileşme</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
                <p className="text-sm text-gray-600">Ödev tamamlama oranı</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">12</div>
                <p className="text-sm text-gray-600">Tamamlanan ödev sayısı</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
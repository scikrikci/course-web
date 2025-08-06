"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Award, MessageSquare, Bell, Settings } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="relative w-10 h-10">
                <img
                  src="/education.svg"
                  alt="Eğitim Platformu"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Eğitim Platformu</h1>
            </div>
            <Link href="/login">
              <Button variant="outline">
                Giriş Yap
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Modern Eğitim Platformu
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Öğrenciler, öğretmenler ve yöneticiler için tümleşik eğitim yönetim sistemi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Hemen Başla
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Özellikleri Keşfet
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Platform Özellikleri</h3>
          
          {/* Role-based Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Student Features */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  Öğrenci Paneli
                </CardTitle>
                <CardDescription>
                  Öğrenciler için özel geliştirilmiş öğrenme ortamı
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Sınıf Panosu</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Ders Takvimi</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Ödev Teslim</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Quiz ve Notlar</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Kişisel Notlar</Badge>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Teacher Features */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-green-600" />
                  Öğretmen Paneli
                </CardTitle>
                <CardDescription>
                  Öğretmenler için ders yönetim ve takip araçları
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Ders Materyali</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Ödev Kontrolü</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Sınıf Duyuruları</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Quiz Oluşturma</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Öğrenci Takibi</Badge>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Admin Features */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-purple-600" />
                  Yönetici Paneli
                </CardTitle>
                <CardDescription>
                  Yöneticiler için sistem yönetimi ve raporlama
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Kullanıcı Yönetimi</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Sınıf Yönetimi</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Performans Raporları</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Genel Duyurular</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">Sistem Ayarları</Badge>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* AI Features */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
            <h4 className="text-2xl font-bold text-center mb-6">AI Destekli Özellikler</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <h5 className="font-semibold">Yazım Asistanı</h5>
                  <p className="text-sm text-gray-600">Akıllı yazım yardım ve düzeltme</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <h5 className="font-semibold">Quiz Üretici</h5>
                  <p className="text-sm text-gray-600">Otomatik quiz oluşturma</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Award className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <h5 className="font-semibold">Kişisel Rehber</h5>
                  <p className="text-sm text-gray-600">Öğrenme önerileri</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <h5 className="font-semibold">Bildirimler</h5>
                  <p className="text-sm text-gray-600">Akıllı bildirim sistemi</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Hemen Başlayın</h3>
          <p className="text-xl mb-8 text-gray-300">
            Platformumuzu deneyimleyin ve modern eğitim teknolojilerinin farkını keşfedin
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              Giriş Yap
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p>&copy; 2024 Eğitim Platformu. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
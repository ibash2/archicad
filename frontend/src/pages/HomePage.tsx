import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Map, Globe, Download, Zap, ArrowRight, Layers, BarChart3, Sparkles, Route, AlertTriangle, CheckSquare, Waves, Mountain, Calculator, Eye, Box } from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'
import { ThemeToggle } from '@/components/theme-toggle'

export function HomePage() {
  const [headerScrolled, setHeaderScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroBadge = useInView({ threshold: 0.5, triggerOnce: true })
  const heroTitle = useInView({ threshold: 0.3, triggerOnce: true })
  const heroDescription = useInView({ threshold: 0.3, triggerOnce: true })
  const heroButtons = useInView({ threshold: 0.3, triggerOnce: true })
  const statsSection = useInView({ threshold: 0.2, triggerOnce: true })
  const featuresSection = useInView({ threshold: 0.1, triggerOnce: true })
  const howItWorksSection = useInView({ threshold: 0.2, triggerOnce: true })
  const ctaSection = useInView({ threshold: 0.3, triggerOnce: true })
  return (
    <div className="min-h-screen bg-background">
      {/* Навигация */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        headerScrolled 
          ? 'bg-background/95 backdrop-blur-xl border-b border-border/40 shadow-sm' 
          : 'bg-background/80 backdrop-blur-xl border-b border-border/40'
      }`}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Globe className="h-8 w-8 text-primary transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent transition-all duration-300 group-hover:from-primary/80 group-hover:to-primary/40">
              Archicad
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link to="/dashboard">
              <Button variant="ghost" className="hidden sm:flex transition-all duration-300 hover:scale-105">
                Демо
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" className="group transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Начать работу
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero секция */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Градиентный фон с анимацией */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5 animate-fade-in" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse-glow" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div 
              ref={heroBadge.ref}
              className={`inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 transition-all duration-500 ${
                heroBadge.isInView 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-4 scale-95'
              }`}
            >
              <Sparkles className="h-4 w-4 text-primary mr-4 animate-float" />
              <span className="text-sm font-medium text-primary">Профессиональные данные топографии</span>
            </div>
            
            <h1 
              ref={heroTitle.ref}
              className={`text-6xl md:text-7xl font-bold mb-6 leading-tight transition-all duration-700 ${
                heroTitle.isInView 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                От карты к
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                трёхмерной модели
              </span>
            </h1>
            
            <p 
              ref={heroDescription.ref}
              className={`text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
                heroDescription.isInView 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              Мгновенный доступ к данным топографии и рельефа в форматах GeoTIFF и GLB. 
              Профессиональный инструмент для инженеров, геодезистов и специалистов по ГИС.
            </p>
            
            <div 
              ref={heroButtons.ref}
              className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-300 ${
                heroButtons.isInView 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <Link to="/dashboard">
                <Button size="lg" className="group text-lg px-8 py-6 h-auto transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  Начать работу
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Узнать больше
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Статистика */}
      <section ref={statsSection.ref} className="py-16 border-y border-border/40 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '100%', label: 'Глобальное покрытие', delay: '0' },
              { value: '<1мин', label: 'Время обработки', delay: '100' },
              { value: '2+', label: 'Формата экспорта', delay: '200' },
              { value: '24/7', label: 'Доступность', delay: '300' },
            ].map((stat, index) => (
              <div 
                key={index}
                className={`text-center transition-all duration-500 ${
                  statsSection.isInView 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-8 scale-95'
                }`}
                style={{ transitionDelay: `${stat.delay}ms` }}
              >
                <div className="text-4xl font-bold text-primary mb-2 transition-all duration-300 hover:scale-110">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Возможности */}
      <section ref={featuresSection.ref} className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-all duration-700 ${
              featuresSection.isInView 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              Всё что нужно для работы с топографией
            </h2>
            <p className={`text-xl text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              featuresSection.isInView 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              Мощные инструменты для профессионалов, которые ценят точность и скорость
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Map, color: 'primary', title: 'Интерактивные карты', description: 'Выберите любую область на карте и получите точные данные топографии с высоким разрешением' },
              { icon: Download, color: 'green', title: 'Множество форматов', description: 'Экспортируйте данные в GeoTIFF для ГИС-приложений и GLB для 3D-визуализации' },
              { icon: Zap, color: 'yellow', title: 'Быстрая обработка', description: 'Мгновенное получение данных топографии без ожидания и задержек' },
              { icon: Globe, color: 'indigo', title: 'Глобальное покрытие', description: 'Доступ к данным топографии по всему миру с единообразным качеством' },
              { icon: Layers, color: 'purple', title: 'Высокая точность', description: 'Данные с точностью до метра для профессиональных проектов' },
              { icon: BarChart3, color: 'blue', title: 'Аналитика и визуализация', description: 'Встроенные инструменты для анализа и 3D-визуализации рельефа' },
            ].map((feature, index) => {
              const Icon = feature.icon
              const colorClasses = {
                primary: 'bg-primary/10 text-primary group-hover:bg-primary/20',
                green: 'bg-green-500/10 text-green-600 group-hover:bg-green-500/20',
                yellow: 'bg-yellow-500/10 text-yellow-600 group-hover:bg-yellow-500/20',
                indigo: 'bg-indigo-500/10 text-indigo-600 group-hover:bg-indigo-500/20',
                purple: 'bg-purple-500/10 text-purple-600 group-hover:bg-purple-500/20',
                blue: 'bg-blue-500/10 text-blue-600 group-hover:bg-blue-500/20',
              }
              
              return (
                <Card 
                  key={index}
                  className={`group hover:shadow-xl transition-all duration-500 border-2 hover:border-primary/50 hover:-translate-y-2 ${
                    featuresSection.isInView 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-8 scale-95'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className={`h-12 w-12 rounded-lg ${colorClasses[feature.color as keyof typeof colorClasses]} flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl transition-colors duration-300 group-hover:text-primary">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Как это работает */}
      <section ref={howItWorksSection.ref} className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-all duration-700 ${
              howItWorksSection.isInView 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              Как это работает
            </h2>
            <p className={`text-xl text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              howItWorksSection.isInView 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              Три простых шага к получению данных топографии
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: '1', title: 'Выберите область', description: 'Используйте интерактивную карту для выбора нужной области на карте' },
              { step: '2', title: 'Обработка данных', description: 'Наша система автоматически обрабатывает запрос и генерирует данные топографии' },
              { step: '3', title: 'Скачайте результат', description: 'Получите данные в нужном формате и используйте в своих проектах' },
            ].map((item, index) => (
              <div 
                key={index}
                className={`text-center transition-all duration-500 hover:-translate-y-2 ${
                  howItWorksSection.isInView 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-8 scale-95'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 transition-all duration-300 hover:scale-110 hover:bg-primary/20 hover:shadow-lg">
                  <span className="text-2xl font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 transition-colors duration-300 hover:text-primary">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm font-medium text-primary">Roadmap</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Что мы разрабатываем
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Мы постоянно улучшаем платформу и добавляем новые инструменты для анализа рельефа
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { 
                icon: Route, 
                title: 'Прокладка дорожных коридоров', 
                description: 'Автоматическое определение оптимальных маршрутов с учетом рельефа',
                status: 'В разработке'
              },
              { 
                icon: AlertTriangle, 
                title: 'Определение опасных зон', 
                description: 'Выявление зон оползней, затоплений и других рисков',
                status: 'В разработке'
              },
              { 
                icon: CheckSquare, 
                title: 'Анализ пригодности участков', 
                description: 'Многофакторный анализ для выбора оптимальных площадок',
                status: 'В разработке'
              },
              { 
                icon: Waves, 
                title: 'Гидрологический анализ', 
                description: 'Анализ водных потоков и направлений стока',
                status: 'В разработке'
              },
              { 
                icon: Mountain, 
                title: 'Детальный анализ рельефа', 
                description: 'Профили высот, изолинии, уклон и экспозиция',
                status: 'В разработке'
              },
              { 
                icon: Calculator, 
                title: 'Расчет объемов работ', 
                description: 'Точный расчет выемки и насыпи для проектирования',
                status: 'В разработке'
              },
              { 
                icon: Eye, 
                title: 'Анализ видимости', 
                description: 'Определение зон видимости и освещенности',
                status: 'В разработке'
              },
              { 
                icon: Box, 
                title: 'Расширенный 3D редактор', 
                description: 'Интерактивный редактор с инструментами измерения',
                status: 'В разработке'
              },
              { 
                icon: BarChart3, 
                title: 'Дополнительные форматы', 
                description: 'Экспорт в OBJ, STL, Shapefile и другие форматы',
                status: 'В разработке'
              },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <Card 
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50"
                >
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {item.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-base">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Призыв к действию */}
      <section ref={ctaSection.ref} className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 animate-pulse-glow" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 transition-all duration-700 ${
              ctaSection.isInView 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-8 scale-95'
            }`}>
              Готовы начать работу?
            </h2>
            <p className={`text-xl text-muted-foreground mb-10 transition-all duration-700 delay-200 ${
              ctaSection.isInView 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              Присоединяйтесь к профессионалам, которые уже используют Archicad для своих проектов
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${
              ctaSection.isInView 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              <Link to="/dashboard">
                <Button size="lg" className="group text-lg px-8 py-6 h-auto transition-all duration-300 hover:scale-110 hover:shadow-2xl">
                  Начать бесплатно
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto transition-all duration-300 hover:scale-110 hover:shadow-xl">
                Связаться с нами
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Подвал */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-100 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Globe className="h-6 w-6 text-slate-100" />
                <span className="text-xl font-bold text-slate-100">Archicad</span>
              </div>
              <p className="text-slate-400 text-sm">
                Профессиональная платформа для работы с данными топографии и рельефа
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-slate-100">Продукт</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-slate-100 transition-colors">Возможности</a></li>
                <li><a href="#" className="hover:text-slate-100 transition-colors">Цены</a></li>
                <li><a href="#" className="hover:text-slate-100 transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-slate-100">Ресурсы</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-slate-100 transition-colors">Документация</a></li>
                <li><a href="#" className="hover:text-slate-100 transition-colors">Блог</a></li>
                <li><a href="#" className="hover:text-slate-100 transition-colors">Примеры</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-slate-100">Поддержка</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-slate-100 transition-colors">Помощь</a></li>
                <li><a href="#" className="hover:text-slate-100 transition-colors">Контакты</a></li>
                <li><a href="#" className="hover:text-slate-100 transition-colors">Статус</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400">
              &copy; 2024 Archicad. Все права защищены.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-slate-400 hover:text-slate-100 transition-colors">Политика конфиденциальности</a>
              <a href="#" className="text-sm text-slate-400 hover:text-slate-100 transition-colors">Условия использования</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

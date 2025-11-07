import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Map, 
  Download, 
  Globe,
  ArrowRight,
  Zap,
  Layers,
  BarChart3,
  Sparkles,
  Route,
  AlertTriangle,
  CheckSquare,
  Waves,
  Mountain,
  Calculator,
  Eye,
  Box
} from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'

export function DashboardPage() {
  const headerRef = useInView({ threshold: 0.5, triggerOnce: true })
  const cardsRef = useInView({ threshold: 0.1, triggerOnce: true })
  const infoRef = useInView({ threshold: 0.2, triggerOnce: true })

  const quickActions = [
    {
      icon: Map,
      title: 'Данные топографии',
      description: 'Запрос данных топографии',
      href: '/elevation',
      color: 'primary',
      delay: '0ms'
    },
    {
      icon: Download,
      title: 'Загрузка данных',
      description: 'Скачайте полученные файлы',
      href: '/elevation',
      color: 'green',
      delay: '100ms'
    }
  ]

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Заголовок */}
      <div 
        ref={headerRef.ref}
        className={`transition-all duration-700 ${
          headerRef.isInView 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Главная панель
            </h1>
            <p className="text-muted-foreground text-lg">
              Управление запросами данных топографии и рельефа
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Активный сервис
          </Badge>
        </div>
      </div>

      {/* Быстрые действия */}
      <div 
        ref={cardsRef.ref}
        className={`grid md:grid-cols-2 gap-6 transition-all duration-700 ${
          cardsRef.isInView 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}
      >
        {quickActions.map((action, index) => {
          const Icon = action.icon
          const colorClasses = {
            primary: 'bg-primary/10 text-primary',
            green: 'bg-green-500/10 text-green-600',
          }
          
          return (
            <Card 
              key={index}
              className={`group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 hover:-translate-y-1 ${
                cardsRef.isInView 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: action.delay }}
            >
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${colorClasses[action.color as keyof typeof colorClasses]} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{action.title}</CardTitle>
                    <CardDescription className="text-base">{action.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link to={action.href}>
                  <Button variant="outline" className="w-full group/btn transition-all duration-300 hover:scale-105">
                    Начать работу
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Информация */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card 
          ref={infoRef.ref}
          className={`transition-all duration-700 ${
            infoRef.isInView 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl">
              <Globe className="h-6 w-6 text-primary" />
              <span>О сервисе</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Что это?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Профессиональный сервис для получения данных топографии в форматах GeoTIFF и GLB. 
                Выберите область на карте и получите точные данные о рельефе местности с высоким разрешением.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Как использовать?
              </h3>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Перейдите на страницу "Данные топографии"</li>
                <li>Выберите область на интерактивной карте</li>
                <li>Выберите формат экспорта (GeoTIFF или GLB)</li>
                <li>Нажмите "Запросить данные"</li>
                <li>Скачайте полученный файл или просмотрите в 3D</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`transition-all duration-700 delay-200 ${
            infoRef.isInView 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span>Возможности</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">Высокая точность</h4>
                  <p className="text-sm text-muted-foreground">
                    Данные с точностью до метра для профессиональных проектов
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">Быстрая обработка</h4>
                  <p className="text-sm text-muted-foreground">
                    Мгновенное получение данных без ожидания
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">3D визуализация</h4>
                  <p className="text-sm text-muted-foreground">
                    Просмотр GLB моделей прямо в браузере
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">Глобальное покрытие</h4>
                  <p className="text-sm text-muted-foreground">
                    Доступ к данным топографии по всему миру
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Инструменты в разработке */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Инструменты в разработке
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Route, title: 'Прокладка дорог', href: '/road-corridor' },
            { icon: AlertTriangle, title: 'Опасные зоны', href: '/hazard-zones' },
            { icon: CheckSquare, title: 'Пригодность', href: '/suitability' },
            { icon: Waves, title: 'Гидрология', href: '/hydrological' },
            { icon: Mountain, title: 'Анализ рельефа', href: '/terrain-analysis' },
            { icon: Calculator, title: 'Объемы работ', href: '/volumetrics' },
            { icon: Eye, title: 'Видимость', href: '/viewshed' },
            { icon: Box, title: '3D Редактор', href: '/3d-viewer' },
          ].map((tool, index) => {
            const Icon = tool.icon
            return (
              <Link key={index} to={tool.href}>
                <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-foreground">{tool.title}</h3>
                      <Badge variant="outline" className="text-xs mt-1">
                        Скоро
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

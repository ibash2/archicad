import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Globe,
  Home,
  Settings,
  Menu,
  X,
  Map,
  Route,
  AlertTriangle,
  CheckSquare,
  Waves,
  Mountain,
  Calculator,
  Eye,
  Box
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Badge } from '@/components/ui/badge'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Главная', href: '/dashboard', icon: Home, available: true },
    { name: 'Данные топографии', href: '/elevation', icon: Map, available: true },
    { name: '3D Редактор', href: '/3d-viewer', icon: Box, available: false },
  ]

  const analysisTools = [
    { name: 'Прокладка дорог', href: '/road-corridor', icon: Route, available: false },
    { name: 'Опасные зоны', href: '/hazard-zones', icon: AlertTriangle, available: false },
    { name: 'Пригодность участков', href: '/suitability', icon: CheckSquare, available: false },
    { name: 'Гидрологический анализ', href: '/hydrological', icon: Waves, available: false },
    { name: 'Анализ рельефа', href: '/terrain-analysis', icon: Mountain, available: false },
    { name: 'Объемы работ', href: '/volumetrics', icon: Calculator, available: false },
    { name: 'Анализ видимости', href: '/viewshed', icon: Eye, available: false },
  ]

  const isCurrentPath = (path: string) => location.pathname === path

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-56 bg-card border-r border-border shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-14 px-3 border-b border-border">
          <Link to="/" className="flex items-center space-x-2">
            <Globe className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">SmartArch</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-foreground">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar navigation */}
        <nav className="mt-4 px-2 overflow-y-auto h-[calc(100vh-3.5rem)]">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isCurrentPath(item.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center">
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </div>
                  {item.available && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      ✓
                    </Badge>
                  )}
                </Link>
              )
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <div className="px-2 mb-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Инструменты анализа
              </h3>
            </div>
            <div className="space-y-1">
              {analysisTools.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isCurrentPath(item.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="flex items-center">
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </div>
                    {!item.available && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        Скоро
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <div className="space-y-1">
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-sm text-muted-foreground">Тема</span>
                <ThemeToggle />
              </div>
              <button className="flex items-center w-full px-2 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                <Settings className="mr-3 h-5 w-5" />
                Настройки
              </button>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between h-14 px-3 border-b border-border bg-card lg:hidden">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="text-foreground">
              <Menu className="h-6 w-6" />
            </button>
            <span className="ml-3 text-lg font-semibold text-foreground">Меню</span>
          </div>
          <ThemeToggle />
        </div>

        {/* Page content */}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Проверяем localStorage при инициализации, по умолчанию светлая
    if (typeof window === 'undefined') return 'light'
    const stored = localStorage.getItem('theme') as Theme | null
    return stored || 'light'
  })

  useEffect(() => {
    const root = window.document.documentElement
    
    // Удаляем предыдущие классы
    root.classList.remove('light', 'dark')
    
    // Добавляем текущую тему
    root.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return {
    theme,
    toggleTheme,
  }
}


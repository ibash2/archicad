import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'

// Инициализация темы перед рендером (по умолчанию светлая)
const initTheme = () => {
  const stored = localStorage.getItem('theme')
  const root = document.documentElement
  
  // Удаляем класс dark если он есть
  root.classList.remove('dark')
  
  // Добавляем dark только если явно выбрана темная тема
  if (stored === 'dark') {
    root.classList.add('dark')
  }
  // По умолчанию светлая тема (ничего не делаем)
}

// Инициализируем тему сразу
initTheme()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)


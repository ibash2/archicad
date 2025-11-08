/**
 * API клиент для сервиса топографии
 */

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api'

interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  filename?: string
}

interface HealthStatus {
  status: string
}

type TopoType = 'geotiff' | 'glb'

class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        // Пытаемся получить JSON ошибку, но если не получается - просто текст
        const contentType = response.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          const errorData = await response.json().catch(() => ({ error: 'Ошибка запроса' }))
          return { error: errorData.error || errorData.detail || 'Ошибка запроса' }
        } else {
          const errorText = await response.text().catch(() => 'Ошибка запроса')
          return { error: errorText || 'Ошибка запроса' }
        }
      }

      // Проверяем, является ли ответ бинарным
      const contentType = response.headers.get('content-type') || ''
      const contentDisposition = response.headers.get('content-disposition') || ''
      
      // Определяем бинарные данные по content-type или content-disposition
      const isBinary = 
        contentType.includes('application/octet-stream') ||
        contentType.includes('model/gltf-binary') ||
        contentType.includes('application/gltf-binary') ||
        contentType.includes('model/glb') ||
        contentType.includes('image/tiff') ||
        contentType.includes('image/geotiff') ||
        contentType.includes('application/geotiff') ||
        contentDisposition.includes('attachment') ||
        contentDisposition.includes('filename')

      if (isBinary) {
        const blob = await response.blob()
        
        // Извлекаем имя файла из Content-Disposition
        let filename: string | undefined
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, '')
          }
        }
        
        return { data: blob as any, filename }
      }

      // Для JSON ответов
      if (contentType.includes('application/json')) {
        const data = await response.json()
        return { data }
      }

      // По умолчанию пытаемся как текст
      const text = await response.text()
      try {
        const data = JSON.parse(text)
        return { data }
      } catch {
        return { data: text as any }
      }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Ошибка сети' }
    }
  }

  // Проверка состояния сервиса
  async getHealthStatus(): Promise<ApiResponse<HealthStatus>> {
    return this.request<HealthStatus>('/healthcheck')
  }

  // Получение данных топографии
  async getTopography(params: {
    south: number
    north: number
    west: number
    east: number
    type: TopoType
  }): Promise<ApiResponse<Blob>> {
    const queryParams = new URLSearchParams({
      south: params.south.toString(),
      north: params.north.toString(),
      west: params.west.toString(),
      east: params.east.toString(),
      type: params.type,
    })

    return this.request<Blob>(`/topo/?${queryParams.toString()}`, {
      headers: {
        'Accept': 'application/octet-stream',
      },
    })
  }
}

export const apiClient = new ApiClient()
export default apiClient

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Map, 
  Download, 
  Settings, 
  Play,
  CheckCircle,
  AlertCircle,
  Image,
  FileText,
  Eye
} from 'lucide-react'
import { InteractiveMap } from '@/components/map/InteractiveMap'
import { apiClient } from '@/lib/api'
import { GLBViewer } from '@/components/viewer/GLBViewer'

type TopoType = 'geotiff' | 'glb'

interface TopographyRequest {
  bbox: [number, number, number, number] | null // [west, south, east, north]
  type: TopoType
}

interface TopographyResult {
  id: string
  bbox: [number, number, number, number]
  type: TopoType
  status: 'pending' | 'loading' | 'completed' | 'failed'
  blob?: Blob
  filename?: string
  errorMessage?: string
  createdAt: string
}

export function ElevationRequestPage() {
  const [request, setRequest] = useState<TopographyRequest>({
    bbox: null,
    type: 'geotiff'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<TopographyResult[]>([])
  const [viewingModel, setViewingModel] = useState<{ blob: Blob; id: string } | null>(null)

  const formats = [
    { value: 'geotiff' as TopoType, label: 'GeoTIFF', description: 'Геопривязанный формат TIFF', icon: Image },
    { value: 'glb' as TopoType, label: 'GLB', description: 'Формат 3D модели', icon: FileText },
  ]

  const handleBboxSelect = (bbox: [number, number, number, number]) => {
    setRequest(prev => ({ ...prev, bbox }))
  }

  const handleParameterChange = (key: keyof TopographyRequest, value: any) => {
    setRequest(prev => ({ ...prev, [key]: value }))
  }

  const handleRequestTopography = async () => {
    if (!request.bbox) return

    setIsLoading(true)
    
    const newResult: TopographyResult = {
      id: Date.now().toString(),
      bbox: request.bbox,
      type: request.type,
      status: 'loading',
      createdAt: new Date().toISOString()
    }
    
    setResults(prev => [newResult, ...prev])
    
    try {
      const [west, south, east, north] = request.bbox
      const response = await apiClient.getTopography({
        west,
        south,
        east,
        north,
        type: request.type
      })

      if (response.error) {
        setResults(prev => prev.map(r => 
          r.id === newResult.id 
            ? { ...r, status: 'failed', errorMessage: response.error }
            : r
        ))
        return
      }

      if (response.data) {
        setResults(prev => prev.map(r => 
          r.id === newResult.id 
            ? { 
                ...r, 
                status: 'completed', 
                blob: response.data as Blob,
                filename: response.filename
              }
            : r
        ))
      }
    } catch (error) {
      setResults(prev => prev.map(r => 
        r.id === newResult.id 
          ? { ...r, status: 'failed', errorMessage: error instanceof Error ? error.message : 'Неизвестная ошибка' }
          : r
      ))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = (result: TopographyResult) => {
    if (!result.blob) return

    // Используем имя файла из ответа API или генерируем по умолчанию
    const filename = result.filename || `topography_${result.id}.${result.type === 'geotiff' ? 'tif' : 'glb'}`
    
    const url = URL.createObjectURL(result.blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getStatusIcon = (status: TopographyResult['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'loading':
        return <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      default:
        return <div className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
    }
  }

  const getStatusBadge = (status: TopographyResult['status']) => {
    const variants = {
      completed: 'default' as const,
      failed: 'destructive' as const,
      loading: 'secondary' as const,
      pending: 'outline' as const
    }
    
    const labels = {
      completed: 'Завершено',
      failed: 'Ошибка',
      loading: 'Загрузка',
      pending: 'Ожидание'
    }
    
    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Данные топографии
          </h1>
          <p className="text-muted-foreground text-lg">
            Запрос и загрузка данных топографии и рельефа
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Карта и выбор области */}
        <div className="lg:col-span-2">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Map className="h-5 w-5 text-primary" />
                </div>
                <span>Выбор области</span>
              </CardTitle>
              <CardDescription className="text-base">
                Выберите область на карте для получения данных топографии
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border border-border">
                <InteractiveMap
                  onBboxSelect={handleBboxSelect}
                  className="h-[500px] w-full"
                  initialCenter={[37.6173, 55.7558]}
                  initialZoom={9}
                />
              </div>
              
              {request.bbox && (
                <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Выбранная область
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between items-center p-2 bg-background rounded">
                      <span className="text-muted-foreground">Запад:</span>
                      <span className="font-mono font-medium text-foreground">{request.bbox[0].toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-background rounded">
                      <span className="text-muted-foreground">Восток:</span>
                      <span className="font-mono font-medium text-foreground">{request.bbox[2].toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-background rounded">
                      <span className="text-muted-foreground">Юг:</span>
                      <span className="font-mono font-medium text-foreground">{request.bbox[1].toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-background rounded">
                      <span className="text-muted-foreground">Север:</span>
                      <span className="font-mono font-medium text-foreground">{request.bbox[3].toFixed(6)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Панель конфигурации */}
        <div className="lg:col-span-1">
          <Card className="border-2 sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <span>Конфигурация</span>
              </CardTitle>
              <CardDescription className="text-base">
                Настройте параметры данных топографии
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Формат */}
              <div className="space-y-3">
                <Label htmlFor="format" className="text-base font-semibold">Формат вывода</Label>
                <Select value={request.type} onValueChange={(value) => handleParameterChange('type', value as TopoType)}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formats.map((format) => {
                      const FormatIcon = format.icon
                      return (
                        <SelectItem key={format.value} value={format.value}>
                          <div className="flex items-center space-x-3 py-1">
                            <FormatIcon className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">{format.label}</div>
                              <div className="text-xs text-muted-foreground">{format.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Кнопка действия */}
              <Button 
                onClick={handleRequestTopography}
                disabled={!request.bbox || isLoading}
                size="lg"
                className="w-full flex items-center justify-center space-x-2 h-12 text-base transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    <span>Загрузка...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    <span>Запросить данные</span>
                  </>
                )}
              </Button>

              {!request.bbox && (
                <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  Выберите область на карте
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Результаты */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <span>Запросы данных топографии</span>
            {results.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {results.length}
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="text-base">
            Просмотр и загрузка ваших данных топографии
          </CardDescription>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex p-4 bg-muted rounded-full mb-4">
                <Map className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Запросов данных топографии пока нет
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Выберите область на карте и запросите данные, чтобы увидеть результаты здесь
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <Card key={result.id} className="border-2 hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-muted rounded-lg">
                          {getStatusIcon(result.status)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">Запрос данных топографии</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(result.createdAt).toLocaleString('ru-RU')}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(result.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Запад</div>
                        <div className="font-mono font-medium text-foreground">{result.bbox[0].toFixed(6)}</div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Восток</div>
                        <div className="font-mono font-medium text-foreground">{result.bbox[2].toFixed(6)}</div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Юг</div>
                        <div className="font-mono font-medium text-foreground">{result.bbox[1].toFixed(6)}</div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Север</div>
                        <div className="font-mono font-medium text-foreground">{result.bbox[3].toFixed(6)}</div>
                      </div>
                    </div>

                    {result.status === 'completed' && result.blob && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button 
                          size="lg"
                          className="flex items-center space-x-2 transition-all duration-300 hover:scale-105"
                          onClick={() => handleDownload(result)}
                        >
                          <Download className="h-4 w-4" />
                          <span>Скачать</span>
                        </Button>
                        {result.type === 'glb' && (
                          <Button 
                            size="lg"
                            variant="outline"
                            className="flex items-center space-x-2 transition-all duration-300 hover:scale-105"
                            onClick={() => setViewingModel({ blob: result.blob!, id: result.id })}
                          >
                            <Eye className="h-4 w-4" />
                            <span>Просмотр в 3D</span>
                          </Button>
                        )}
                      </div>
                    )}

                    {result.status === 'failed' && result.errorMessage && (
                      <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-destructive font-medium">{result.errorMessage}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3D Просмотр GLB модели */}
      {viewingModel && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-7xl h-full">
            <GLBViewer 
              blob={viewingModel.blob}
              onClose={() => setViewingModel(null)}
              className="h-full w-full"
            />
          </div>
        </div>
      )}
    </div>
  )
}

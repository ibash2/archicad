import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

interface InteractiveMapProps {
  initialCenter?: [number, number]
  initialZoom?: number
  className?: string
  onBboxSelect?: (bbox: [number, number, number, number]) => void // [west, south, east, north]
}

// Стиль карты с рельефом OpenTopoMap
const MAP_STYLE = {
  version: 8,
  sources: {
    'opentopomap': {
      type: 'raster',
      tiles: [
        'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
        'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
        'https://c.tile.opentopomap.org/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: '© OpenTopoMap (CC-BY-SA)'
    }
  },
  layers: [
    {
      id: 'opentopomap-layer',
      type: 'raster',
      source: 'opentopomap',
      minzoom: 0,
      maxzoom: 17
    }
  ]
}

export function InteractiveMap({
  initialCenter = [37.6173, 55.7558], // Москва
  initialZoom = 9,
  className = "h-96 w-full",
  onBboxSelect
}: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const startPointRef = useRef<[number, number] | null>(null)
  const rectangleSourceId = 'rectangle-source'
  const rectangleLayerId = 'rectangle-layer'
  const rectangleOutlineId = 'rectangle-outline'
  const [isDrawing, setIsDrawing] = useState(false)
  const updateTimeoutRef = useRef<number | null>(null)
  const onBboxSelectRef = useRef(onBboxSelect)
  const isDrawingRef = useRef(false)
  const isMapReadyRef = useRef(false)

  // Обновляем ref при изменении callback
  useEffect(() => {
    onBboxSelectRef.current = onBboxSelect
  }, [onBboxSelect])

  // Обновляем ref при изменении состояния рисования
  useEffect(() => {
    isDrawingRef.current = isDrawing
  }, [isDrawing])

  // Инициализация карты - только один раз
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Создаём карту с улучшенным стилем
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLE as any,
      center: initialCenter,
      zoom: initialZoom,
      antialias: true,
      pitch: 0,
      bearing: 0
    })

    // Добавляем контролы
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')
    map.current.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left')

    // Функция обновления прямоугольника
    const updateRectangle = (endPoint: [number, number]) => {
      if (!map.current || !startPointRef.current || !isMapReadyRef.current) return

      const [lng1, lat1] = startPointRef.current
      const [lng2, lat2] = endPoint

      const west = Math.min(lng1, lng2)
      const east = Math.max(lng1, lng2)
      const south = Math.min(lat1, lat2)
      const north = Math.max(lat1, lat2)

      // Создаём данные для прямоугольника
      const bounds = [
        [west, south],
        [east, south],
        [east, north],
        [west, north],
        [west, south]
      ] as [number, number][]

      const geojsonData = {
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature' as const,
            geometry: {
              type: 'Polygon' as const,
              coordinates: [bounds]
            },
            properties: {}
          }
        ]
      }

      // Обновляем данные источника
      const source = map.current.getSource(rectangleSourceId) as maplibregl.GeoJSONSource
      if (source) {
        source.setData(geojsonData as any)
      }

      // Вызываем callback с bounding box [west, south, east, north]
      if (onBboxSelectRef.current) {
        onBboxSelectRef.current([west, south, east, north])
      }
    }

    // Обработчики событий
    const handleClick = (e: maplibregl.MapMouseEvent) => {
      // Проверяем, что клик не на контролах карты
      const target = e.originalEvent?.target as HTMLElement
      if (target && (
        target.closest('.maplibregl-ctrl') ||
        target.closest('.maplibregl-popup') ||
        target.closest('button')
      )) {
        return
      }

      if (!isDrawingRef.current) {
        // Начинаем рисование
        startPointRef.current = [e.lngLat.lng, e.lngLat.lat]
        setIsDrawing(true)
      } else {
        // Завершаем рисование
        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current)
        }
        updateRectangle([e.lngLat.lng, e.lngLat.lat])
        setIsDrawing(false)
        startPointRef.current = null
      }
    }

    const handleMouseMove = (e: maplibregl.MapMouseEvent) => {
      if (isDrawingRef.current && startPointRef.current) {
        // Throttle обновления для лучшей производительности
        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current)
        }
        updateTimeoutRef.current = window.setTimeout(() => {
          updateRectangle([e.lngLat.lng, e.lngLat.lat])
        }, 50) // Обновляем каждые 50мс вместо 16мс для меньшей нагрузки
      }
    }

    const handleContextMenu = (e: maplibregl.MapMouseEvent) => {
      // Отменяем выбор при правом клике
      if (isDrawingRef.current) {
        e.preventDefault()
        setIsDrawing(false)
        startPointRef.current = null
        
        // Очищаем данные прямоугольника
        if (map.current && isMapReadyRef.current) {
          const source = map.current.getSource(rectangleSourceId) as maplibregl.GeoJSONSource
          if (source) {
            source.setData({
              type: 'FeatureCollection',
              features: []
            } as any)
          }
        }
      }
    }

    // Создаём источник и слои один раз при загрузке карты
    map.current.on('load', () => {
      isMapReadyRef.current = true

      // Создаём пустой источник
      map.current!.addSource(rectangleSourceId, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      })

      // Создаём слой заливки
      map.current!.addLayer({
        id: rectangleLayerId,
        type: 'fill',
        source: rectangleSourceId,
        paint: {
          'fill-color': '#3b82f6',
          'fill-opacity': 0.25
        }
      })

      // Создаём слой контура
      map.current!.addLayer({
        id: rectangleOutlineId,
        type: 'line',
        source: rectangleSourceId,
        paint: {
          'line-color': '#2563eb',
          'line-width': 3,
          'line-dasharray': [2, 2]
        }
      })

      // Обработчики событий
      map.current!.on('click', handleClick)
      map.current!.on('mousemove', handleMouseMove)
      map.current!.on('contextmenu', handleContextMenu)
    })

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
      if (map.current) {
        map.current.remove()
        map.current = null
      }
      isMapReadyRef.current = false
    }
  }, []) // Пустой массив зависимостей - карта создаётся только один раз

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="h-full w-full rounded-lg" />
      {isDrawing && (
        <div className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded text-sm z-10 shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>Выберите второй угол области</span>
          </div>
          <div className="text-xs mt-1 opacity-90">
            Правый клик для отмены
          </div>
        </div>
      )}
      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-gray-600 shadow-sm z-10">
        OpenTopoMap © OpenStreetMap
      </div>
    </div>
  )
}

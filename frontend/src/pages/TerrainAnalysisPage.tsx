import { ComingSoon } from '@/components/coming-soon'

export function TerrainAnalysisPage() {
  return (
    <ComingSoon
      title="Анализ рельефа"
      description="Инструменты для детального анализа рельефа: профили высот, изолинии, уклон и экспозиция"
      features={[
        "Профили высот по произвольной линии",
        "Генерация изолиний (contours)",
        "Карты уклона и экспозиции",
        "Анализ кривизны поверхности",
        "Статистика по выбранной области",
        "Экспорт профилей в CSV и GeoJSON"
      ]}
    />
  )
}


import { ComingSoon } from '@/components/coming-soon'

export function HydrologicalAnalysisPage() {
  return (
    <ComingSoon
      title="Гидрологический анализ"
      description="Анализ водных потоков, направлений стока и накопления воды для гидрологических исследований"
      features={[
        "Расчет направления стока (flow direction)",
        "Анализ накопления воды (flow accumulation)",
        "Определение водосборных бассейнов",
        "Визуализация гидрологической сети",
        "Анализ зон затопления",
        "Экспорт результатов анализа"
      ]}
    />
  )
}


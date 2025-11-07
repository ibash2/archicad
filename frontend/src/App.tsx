import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ElevationRequestPage } from '@/pages/ElevationRequestPage'
import { RoadCorridorPage } from '@/pages/RoadCorridorPage'
import { HazardZonesPage } from '@/pages/HazardZonesPage'
import { SuitabilityPage } from '@/pages/SuitabilityPage'
import { HydrologicalAnalysisPage } from '@/pages/HydrologicalAnalysisPage'
import { TerrainAnalysisPage } from '@/pages/TerrainAnalysisPage'
import { VolumetricsPage } from '@/pages/VolumetricsPage'
import { ViewshedPage } from '@/pages/ViewshedPage'
import { ThreeDViewerPage } from '@/pages/ThreeDViewerPage'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
        <Route path="/elevation" element={<Layout><ElevationRequestPage /></Layout>} />
        <Route path="/road-corridor" element={<Layout><RoadCorridorPage /></Layout>} />
        <Route path="/hazard-zones" element={<Layout><HazardZonesPage /></Layout>} />
        <Route path="/suitability" element={<Layout><SuitabilityPage /></Layout>} />
        <Route path="/hydrological" element={<Layout><HydrologicalAnalysisPage /></Layout>} />
        <Route path="/terrain-analysis" element={<Layout><TerrainAnalysisPage /></Layout>} />
        <Route path="/volumetrics" element={<Layout><VolumetricsPage /></Layout>} />
        <Route path="/viewshed" element={<Layout><ViewshedPage /></Layout>} />
        <Route path="/3d-viewer" element={<Layout><ThreeDViewerPage /></Layout>} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App


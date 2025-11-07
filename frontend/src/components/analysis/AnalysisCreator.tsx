import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { InteractiveMap } from '@/components/map/InteractiveMap'
import { 
  Route, 
  AlertTriangle, 
  Home, 
  MapPin, 
  Settings,
  Play
} from 'lucide-react'

interface AnalysisCreatorProps {
  onStartAnalysis: (type: string, params: any) => void
  isLoading?: boolean
}

export function AnalysisCreator({ onStartAnalysis, isLoading = false }: AnalysisCreatorProps) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [selectedArea, setSelectedArea] = useState<number[] | null>(null)
  const [parameters, setParameters] = useState<any>({})

  const analysisTools = [
    {
      id: 'road_corridor',
      name: 'Road Corridor Analysis',
      description: 'Find optimal routes for road construction',
      icon: Route,
      color: 'blue',
      requiresPoints: true
    },
    {
      id: 'hazard_zones',
      name: 'Hazard Zone Detection',
      description: 'Identify areas prone to landslides and flooding',
      icon: AlertTriangle,
      color: 'red',
      requiresArea: true
    },
    {
      id: 'suitability',
      name: 'Site Suitability Analysis',
      description: 'Evaluate areas for construction suitability',
      icon: Home,
      color: 'green',
      requiresArea: true
    }
  ]

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId)
    setParameters({})
  }

  const handleAreaSelect = (bbox: number[]) => {
    setSelectedArea(bbox)
  }

  const handleParameterChange = (key: string, value: any) => {
    setParameters({ ...parameters, [key]: value })
  }

  const handleStartAnalysis = () => {
    if (!selectedTool) return

    const tool = analysisTools.find(t => t.id === selectedTool)
    if (!tool) return

    let analysisParams: any = { ...parameters }

    if (tool.requiresArea && selectedArea) {
      analysisParams.bbox = selectedArea
    }

    onStartAnalysis(selectedTool, analysisParams)
  }

  const canStartAnalysis = () => {
    if (!selectedTool) return false

    const tool = analysisTools.find(t => t.id === selectedTool)
    if (!tool) return false

    if (tool.requiresArea && !selectedArea) return false

    return true
  }

  const getToolIcon = (tool: any) => {
    const Icon = tool.icon
    const colorClasses = {
      blue: 'text-blue-600 bg-blue-100',
      red: 'text-red-600 bg-red-100',
      green: 'text-green-600 bg-green-100'
    }
    
    return (
      <div className={`p-3 rounded-lg ${colorClasses[tool.color as keyof typeof colorClasses]}`}>
        <Icon className="h-6 w-6" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tool Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Analysis Tool</CardTitle>
          <CardDescription>
            Choose a terrain analysis tool to configure and run
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {analysisTools.map((tool) => (
              <div
                key={tool.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedTool === tool.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleToolSelect(tool.id)}
              >
                <div className="flex items-start space-x-3">
                  {getToolIcon(tool)}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{tool.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      {selectedTool && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Map */}
          <Card>
            <CardHeader>
              <CardTitle>Select Analysis Area</CardTitle>
              <CardDescription>
                {analysisTools.find(t => t.id === selectedTool)?.requiresPoints
                  ? 'Select start and end points for road corridor analysis'
                  : 'Select area for terrain analysis'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InteractiveMap
                onBboxSelect={handleAreaSelect}
                className="h-64"
              />
              
              {/* Selection Status */}
              <div className="mt-4 space-y-2">
                {selectedArea && (
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <MapPin className="h-4 w-4" />
                    <span>Area selected: {selectedArea.map(v => v.toFixed(4)).join(', ')}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Parameters */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Parameters</CardTitle>
              <CardDescription>
                Configure parameters for your analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedTool === 'road_corridor' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Maximum Slope (degrees)
                    </label>
                    <input
                      type="number"
                      value={parameters.max_slope || 10}
                      onChange={(e) => handleParameterChange('max_slope', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="avoid_water"
                      checked={parameters.avoid_water || false}
                      onChange={(e) => handleParameterChange('avoid_water', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="avoid_water" className="text-sm text-gray-700">
                      Avoid water bodies
                    </label>
                  </div>
                </>
              )}

              {selectedTool === 'hazard_zones' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Slope Threshold (degrees)
                    </label>
                    <input
                      type="number"
                      value={parameters.slope_threshold || 30}
                      onChange={(e) => handleParameterChange('slope_threshold', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Curvature Threshold
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={parameters.curvature_threshold || 0.1}
                      onChange={(e) => handleParameterChange('curvature_threshold', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.1"
                    />
                  </div>
                </>
              )}

              {selectedTool === 'suitability' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Maximum Slope (degrees)
                    </label>
                    <input
                      type="number"
                      value={parameters.max_slope || 15}
                      onChange={(e) => handleParameterChange('max_slope', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="15"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Elevation Range (meters)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min elevation"
                        value={parameters.min_elevation || ''}
                        onChange={(e) => handleParameterChange('min_elevation', parseFloat(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="Max elevation"
                        value={parameters.max_elevation || ''}
                        onChange={(e) => handleParameterChange('max_elevation', parseFloat(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                <Button 
                  onClick={handleStartAnalysis}
                  disabled={!canStartAnalysis() || isLoading}
                  className="flex items-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>{isLoading ? 'Starting...' : 'Start Analysis'}</span>
                </Button>
                
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}


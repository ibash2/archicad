import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Download, 
  Eye, 
  BarChart3, 
  Map, 
  AlertTriangle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react'

interface AnalysisResult {
  id: string
  analysis_type: 'road_corridor' | 'hazard_zones' | 'suitability'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  result_files?: string[]
  result_metadata?: any
  created_at: string
  error_message?: string
}

interface ResultsViewerProps {
  results: AnalysisResult[]
  onViewResult?: (result: AnalysisResult) => void
  onDownloadResult?: (result: AnalysisResult) => void
  onDeleteResult?: (resultId: string) => void
}

export function ResultsViewer({
  results,
  onViewResult,
  onDownloadResult,
  onDeleteResult
}: ResultsViewerProps) {
  // const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null) // Unused
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'chart'>('list')

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500" />
      case 'failed':
        return <X className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'processing':
        return 'text-blue-600 bg-blue-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getAnalysisIcon = (type: string) => {
    switch (type) {
      case 'road_corridor':
        return <Map className="h-5 w-5 text-blue-600" />
      case 'hazard_zones':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'suitability':
        return <BarChart3 className="h-5 w-5 text-green-600" />
      default:
        return <BarChart3 className="h-5 w-5 text-gray-600" />
    }
  }

  const getAnalysisName = (type: string) => {
    switch (type) {
      case 'road_corridor':
        return 'Road Corridor Analysis'
      case 'hazard_zones':
        return 'Hazard Zones Detection'
      case 'suitability':
        return 'Site Suitability Analysis'
      default:
        return 'Analysis'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderMetrics = (metadata: any, type: string) => {
    if (!metadata) return null

    switch (type) {
      case 'road_corridor':
        return (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Total Length:</span>
              <span className="ml-2">{metadata.metrics?.total_length?.toFixed(2)}m</span>
            </div>
            <div>
              <span className="font-medium">Max Slope:</span>
              <span className="ml-2">{metadata.metrics?.max_slope?.toFixed(1)}°</span>
            </div>
            <div>
              <span className="font-medium">Avg Slope:</span>
              <span className="ml-2">{metadata.metrics?.avg_slope?.toFixed(1)}°</span>
            </div>
            <div>
              <span className="font-medium">Earthwork:</span>
              <span className="ml-2">{metadata.metrics?.earthwork_estimate?.toFixed(0)}m³</span>
            </div>
          </div>
        )
      
      case 'hazard_zones':
        return (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Hazard Area:</span>
              <span className="ml-2">{metadata.risk_metrics?.total_hazard_area?.toFixed(0)} pixels</span>
            </div>
            <div>
              <span className="font-medium">Risk Percentage:</span>
              <span className="ml-2">{metadata.risk_metrics?.hazard_percentage?.toFixed(1)}%</span>
            </div>
            <div>
              <span className="font-medium">High Risk Zones:</span>
              <span className="ml-2">{metadata.risk_metrics?.risk_levels?.high || 0}</span>
            </div>
            <div>
              <span className="font-medium">Total Risk Zones:</span>
              <span className="ml-2">{metadata.risk_metrics?.total_risk_zones || 0}</span>
            </div>
          </div>
        )
      
      case 'suitability':
        return (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Avg Suitability:</span>
              <span className="ml-2">{(metadata.suitability_metrics?.average_suitability * 100)?.toFixed(1)}%</span>
            </div>
            <div>
              <span className="font-medium">High Suitability:</span>
              <span className="ml-2">{metadata.suitability_metrics?.suitability_distribution?.high?.toFixed(1)}%</span>
            </div>
            <div>
              <span className="font-medium">Medium Suitability:</span>
              <span className="ml-2">{metadata.suitability_metrics?.suitability_distribution?.medium?.toFixed(1)}%</span>
            </div>
            <div>
              <span className="font-medium">Low Suitability:</span>
              <span className="ml-2">{metadata.suitability_metrics?.suitability_distribution?.low?.toFixed(1)}%</span>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
          <p className="text-gray-600">View and manage your terrain analysis results</p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            Map
          </Button>
          <Button
            variant={viewMode === 'chart' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('chart')}
          >
            Chart
          </Button>
        </div>
      </div>

      {/* Results List */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {results.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Results</h3>
                <p className="text-gray-600">Run your first analysis to see results here</p>
              </CardContent>
            </Card>
          ) : (
            results.map((result) => (
              <Card key={result.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getAnalysisIcon(result.analysis_type)}
                      <div>
                        <CardTitle className="text-lg">
                          {getAnalysisName(result.analysis_type)}
                        </CardTitle>
                        <CardDescription>
                          Created {formatDate(result.created_at)}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(result.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(result.status)}`}>
                        {result.status}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {result.status === 'processing' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Processing...</span>
                        <span>{result.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${result.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {result.status === 'failed' && result.error_message && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">
                        <strong>Error:</strong> {result.error_message}
                      </p>
                    </div>
                  )}
                  
                  {result.status === 'completed' && result.result_metadata && (
                    <div className="mb-4">
                      {renderMetrics(result.result_metadata, result.analysis_type)}
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    {result.status === 'completed' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewResult?.(result)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDownloadResult?.(result)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDeleteResult?.(result.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Map View */}
      {viewMode === 'map' && (
        <Card>
          <CardContent className="p-12 text-center">
            <Map className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Map View</h3>
            <p className="text-gray-600">Interactive map view coming soon</p>
          </CardContent>
        </Card>
      )}

      {/* Chart View */}
      {viewMode === 'chart' && (
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chart View</h3>
            <p className="text-gray-600">Analytics charts coming soon</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Text, Box } from '@react-three/drei'
import { BufferGeometry, Float32BufferAttribute } from 'three'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { 
  RotateCcw, 
  ZoomIn, 
  Move3D, 
  Download,
  Eye,
  EyeOff,
  Layers,
  BarChart3
} from 'lucide-react'

interface TerrainMeshProps {
  elevationData?: number[]
  width?: number
  height?: number
  scale?: number
  wireframe?: boolean
  colorMap?: 'elevation' | 'slope' | 'aspect'
}

function TerrainMesh({ 
  elevationData, 
  width = 100, 
  height = 100, 
  scale = 1,
  wireframe = false,
  colorMap = 'elevation'
}: TerrainMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null)

  useEffect(() => {
    if (!elevationData || elevationData.length === 0) return

    // Create geometry from elevation data
    const newGeometry = new BufferGeometry()
    
    const vertices: number[] = []
    const colors: number[] = []
    const indices: number[] = []

    const gridWidth = Math.sqrt(elevationData.length)
    const gridHeight = gridWidth

    // Generate vertices
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const index = y * gridWidth + x
        const elevation = elevationData[index] || 0
        
        vertices.push(
          (x - gridWidth / 2) * scale,
          elevation * scale * 0.1, // Scale elevation for visibility
          (y - gridHeight / 2) * scale
        )

        // Color based on elevation
        const normalizedElevation = (elevation - Math.min(...elevationData)) / 
          (Math.max(...elevationData) - Math.min(...elevationData))
        
        if (colorMap === 'elevation') {
          // Color gradient from blue (low) to red (high)
          colors.push(
            normalizedElevation, // R
            0.5, // G
            1 - normalizedElevation // B
          )
        } else {
          // Default green color
          colors.push(0.2, 0.8, 0.2)
        }
      }
    }

    // Generate indices for triangles
    for (let y = 0; y < gridHeight - 1; y++) {
      for (let x = 0; x < gridWidth - 1; x++) {
        const a = y * gridWidth + x
        const b = y * gridWidth + (x + 1)
        const c = (y + 1) * gridWidth + x
        const d = (y + 1) * gridWidth + (x + 1)

        // First triangle
        indices.push(a, b, c)
        // Second triangle
        indices.push(b, d, c)
      }
    }

    newGeometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
    newGeometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
    newGeometry.setIndex(indices)
    newGeometry.computeVertexNormals()

    setGeometry(newGeometry)
  }, [elevationData, width, height, scale, colorMap])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  if (!geometry) {
    return (
      <Box args={[10, 2, 10]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#4ade80" />
      </Box>
    )
  }

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial 
        vertexColors 
        wireframe={wireframe}
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  )
}

function SceneControls() {
  return (
    <>
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
      />
      <Environment preset="sunset" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading 3D scene...</p>
      </div>
    </div>
  )
}

interface ThreeDViewerProps {
  elevationData?: number[]
  metadata?: {
    minElevation: number
    maxElevation: number
    meanElevation: number
    bounds: {
      west: number
      south: number
      east: number
      north: number
    }
    crs: string
    shape: number[]
  }
  className?: string
}

export function ThreeDViewer({ 
  elevationData, 
  metadata, 
  className = "h-96 w-full" 
}: ThreeDViewerProps) {
  const [wireframe, setWireframe] = useState(false)
  const [scale, setScale] = useState([1])
  const [colorMap, setColorMap] = useState<'elevation' | 'slope' | 'aspect'>('elevation')
  const [showStats, setShowStats] = useState(true)

  // Generate sample elevation data if none provided
  const sampleData = elevationData || Array.from({ length: 10000 }, (_, i) => {
    const x = (i % 100) / 100
    const y = Math.floor(i / 100) / 100
    return Math.sin(x * Math.PI * 4) * Math.cos(y * Math.PI * 4) * 100 + 500
  })

  const sampleMetadata = metadata || {
    minElevation: Math.min(...sampleData),
    maxElevation: Math.max(...sampleData),
    meanElevation: sampleData.reduce((a, b) => a + b, 0) / sampleData.length,
    bounds: { west: -122.5, south: 37.7, east: -122.3, north: 37.9 },
    crs: 'EPSG:4326',
    shape: [100, 100]
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Move3D className="h-5 w-5" />
            <span>3D Terrain Viewer</span>
          </CardTitle>
          <CardDescription>
            Interactive 3D visualization of elevation data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant={wireframe ? "default" : "outline"}
              size="sm"
              onClick={() => setWireframe(!wireframe)}
              className="flex items-center space-x-2"
            >
              <Layers className="h-4 w-4" />
              <span>{wireframe ? 'Solid' : 'Wireframe'}</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScale([scale[0] === 1 ? 2 : 1])}
              className="flex items-center space-x-2"
            >
              <ZoomIn className="h-4 w-4" />
              <span>Scale {scale[0] === 1 ? 'Up' : 'Down'}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setColorMap(colorMap === 'elevation' ? 'slope' : 'elevation')}
              className="flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>{colorMap === 'elevation' ? 'Slope' : 'Elevation'}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStats(!showStats)}
              className="flex items-center space-x-2"
            >
              {showStats ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{showStats ? 'Hide' : 'Show'} Stats</span>
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <label className="text-sm font-medium">Vertical Scale</label>
            <Slider
              value={scale}
              onValueChange={setScale}
              min={0.1}
              max={5}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>0.1x</span>
              <span className="font-medium">{scale[0]}x</span>
              <span>5x</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3D Scene */}
      <Card>
        <CardContent className="p-0">
          <div className={`relative ${className}`}>
            <Suspense fallback={<LoadingFallback />}>
              <Canvas camera={{ position: [50, 50, 50], fov: 60 }}>
                <SceneControls />
                <TerrainMesh
                  elevationData={sampleData}
                  scale={scale[0]}
                  wireframe={wireframe}
                  colorMap={colorMap}
                />
                
                {/* Grid */}
                <gridHelper args={[200, 20, '#666666', '#333333']} />
                
                {/* Coordinate labels */}
                <Text
                  position={[0, 20, 0]}
                  fontSize={5}
                  color="#ffffff"
                  anchorX="center"
                  anchorY="middle"
                >
                  N
                </Text>
                <Text
                  position={[20, 0, 0]}
                  fontSize={5}
                  color="#ffffff"
                  anchorX="center"
                  anchorY="middle"
                >
                  E
                </Text>
              </Canvas>
            </Suspense>

            {/* Overlay Stats */}
            {showStats && (
              <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-semibold mb-2">Terrain Statistics</h4>
                <div className="space-y-1 text-sm">
                  <div>Min Elevation: {sampleMetadata.minElevation.toFixed(1)}m</div>
                  <div>Max Elevation: {sampleMetadata.maxElevation.toFixed(1)}m</div>
                  <div>Mean Elevation: {sampleMetadata.meanElevation.toFixed(1)}m</div>
                  <div>Resolution: {sampleMetadata.shape[0]}×{sampleMetadata.shape[1]}</div>
                </div>
              </div>
            )}

            {/* Controls Overlay */}
            <div className="absolute top-4 right-4 bg-black/80 text-white p-3 rounded-lg backdrop-blur-sm">
              <div className="text-sm space-y-1">
                <div className="flex items-center space-x-2">
                  <RotateCcw className="h-3 w-3" />
                  <span>Right-click + drag to rotate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ZoomIn className="h-3 w-3" />
                  <span>Scroll to zoom</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Move3D className="h-3 w-3" />
                  <span>Left-click + drag to pan</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export Options</span>
          </CardTitle>
          <CardDescription>
            Download 3D model in various formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>glTF</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>OBJ</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>STL</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>PLY</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
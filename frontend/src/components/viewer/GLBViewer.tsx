import { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, PerspectiveCamera } from '@react-three/drei'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import * as THREE from 'three'
import { 
  RotateCcw, 
  ZoomIn, 
  Move3D,
  X,
  Maximize2,
  Minimize2
} from 'lucide-react'

interface GLBViewerProps {
  blob: Blob
  onClose?: () => void
  className?: string
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

function SceneControls({ 
  cameraRef, 
  controlsRef 
}: { 
  cameraRef?: React.RefObject<THREE.PerspectiveCamera>
  controlsRef?: React.RefObject<any>
}) {
  return (
    <>
      <PerspectiveCamera 
        ref={cameraRef as any}
        makeDefault 
        position={[5, 5, 5]} 
        fov={60}
      />
      <OrbitControls 
        ref={controlsRef as any}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1}
        maxDistance={1000}
      />
      <Environment preset="sunset" />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Загрузка 3D модели...</p>
      </div>
    </div>
  )
}

export function GLBViewer({ blob, onClose, className = "h-[600px] w-full" }: GLBViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const controlsRef = useRef<any>(null)

  // Создаём URL для blob
  useEffect(() => {
    const url = URL.createObjectURL(blob)
    setModelUrl(url)
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [blob])

  const handleResetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(5, 5, 5)
      cameraRef.current.lookAt(0, 0, 0)
    }
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }

  if (!modelUrl) {
    return (
      <div className={className}>
        <LoadingFallback />
      </div>
    )
  }

  return (
    <div className={`relative ${className} ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <Card className={isFullscreen ? 'h-full w-full m-0 rounded-none' : ''}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Move3D className="h-5 w-5" />
              <span>3D Просмотр модели</span>
            </CardTitle>
            <CardDescription>
              Интерактивная 3D визуализация GLB модели
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center space-x-2"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            {onClose && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className={isFullscreen ? 'h-[calc(100%-120px)] p-0' : 'p-0'}>
          <div className="relative h-full w-full">
            <Suspense fallback={<LoadingFallback />}>
              <Canvas>
                <SceneControls cameraRef={cameraRef} controlsRef={controlsRef} />
                <Model url={modelUrl} />
                <gridHelper args={[20, 20, '#666666', '#333333']} />
              </Canvas>
            </Suspense>

            {/* Controls Overlay */}
            <div className="absolute top-4 right-4 bg-black/80 text-white p-3 rounded-lg backdrop-blur-sm z-10">
              <div className="text-sm space-y-1">
                <div className="flex items-center space-x-2">
                  <RotateCcw className="h-3 w-3" />
                  <span>ПКМ + перетаскивание для вращения</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ZoomIn className="h-3 w-3" />
                  <span>Колесико мыши для масштабирования</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Move3D className="h-3 w-3" />
                  <span>ЛКМ + перетаскивание для перемещения</span>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="absolute bottom-4 left-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetView}
                className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Сбросить вид</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


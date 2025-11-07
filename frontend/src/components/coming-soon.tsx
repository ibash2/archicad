import { Wrench, Sparkles, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { useInView } from '@/hooks/use-in-view'

interface ComingSoonProps {
  title?: string
  description?: string
  features?: string[]
}

export function ComingSoon({ 
  title = 'В разработке',
  description = 'Эта функция находится в разработке и скоро будет доступна',
  features = []
}: ComingSoonProps) {
  const iconRef = useInView({ threshold: 0.5, triggerOnce: true })
  const contentRef = useInView({ threshold: 0.3, triggerOnce: true })

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div 
            ref={iconRef.ref}
            className={`flex justify-center mb-4 transition-all duration-700 ${
              iconRef.isInView 
                ? 'opacity-100 scale-100 rotate-0' 
                : 'opacity-0 scale-50 rotate-12'
            }`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <div className="relative p-6 bg-primary/10 rounded-full">
                <Wrench className="h-16 w-16 text-primary animate-spin-slow" />
              </div>
            </div>
          </div>
          
          <CardTitle 
            ref={contentRef.ref}
            className={`text-3xl md:text-4xl mb-4 transition-all duration-700 delay-200 ${
              contentRef.isInView 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            {title}
          </CardTitle>
          
          <CardDescription 
            className={`text-lg transition-all duration-700 delay-300 ${
              contentRef.isInView 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {features.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Планируемые возможности:
              </h3>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li 
                    key={index}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/dashboard">
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться на главную
              </Button>
            </Link>
            <Link to="/elevation">
              <Button className="w-full sm:w-auto">
                Работать с данными топографии
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


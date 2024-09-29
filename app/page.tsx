'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle } from 'lucide-react'
import { cn } from "@/lib/utils"
import { BorderBeam } from "@/components/ui/border-beam"
import { DotPattern } from "@/components/ui/dot-pattern"
import { Dock, DockIcon } from "@/components/ui/dock"; // Import DockDemo component
import { Icons } from "@/components/ui/icons"
import GradualSpacing from '@/components/ui/gradual-spacing'

// Mock function to simulate headline generation
const generateHeadline = async (bio: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
  return `Innovative ${bio.split(' ')[0]} Professional | Driving Growth and Excellence in ${bio.split(' ').slice(-2).join(' ')}`
}

export default function HeadlineGenerator() {
  const [bio, setBio] = useState('')
  const [headline, setHeadline] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!bio.trim()) {
      setError('Please enter your bio')
      return
    }

    setError('')
    setIsLoading(true)
    try {
      const generatedHeadline = await generateHeadline(bio)
      setHeadline(generatedHeadline)
    } catch (err) {
      setError('Failed to generate headline. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center">
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(900px_circle_at_center,black,transparent)]",
        )}
      />

      {/* Main Card content */}
      <Card className="w-full max-w-2xl mx-auto relative">
        <BorderBeam size={500} duration={12} delay={12} />
        <CardHeader>
          {/* <CardTitle>LinkedIn Headline Generator</CardTitle> */}
          <GradualSpacing className="font-display text-center text-4xl font-bold -tracking-widest  text-black dark:text-white md:text-7xl md:leading-[5rem]"text="LinkDescrip AI" />  
          <CardDescription className="font-display text-center text-lg text-gray-500 dark:text-gray-400">Enter your bio to generate an optimized LinkedIn headline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your professional bio here..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={5}
            className="resize-none"
          />
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {headline && (
            <Alert>
              <AlertTitle>Generated Headline</AlertTitle>
              <AlertDescription>{headline}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Headline'
            )}
          </Button>
        </CardFooter>
      </Card>
      <Dock direction="bottom">
        <DockIcon>
        <a href="https://remiel.fyi" target='_blank' rel="noopener" title="Google"><Icons.logo className="size-6" /></a>
        </DockIcon>
        <DockIcon>
          <a href="https://remiel.fyi" target='_blank' rel="noopener" title="Google"><Icons.google className="size-6" /></a>
        </DockIcon>
        <DockIcon>
          <a href="https://remiel.fyi" target='_blank' rel="noopener" title="Google"><Icons.google className="size-6" /></a>
        </DockIcon>
        <DockIcon>
        <a href="https://remiel.fyi" target='_blank' rel="noopener" title="Google"><Icons.spinner className="size-6" /></a>
        </DockIcon>
      </Dock>
    </div>
  )
}

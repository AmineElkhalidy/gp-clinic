"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <div className="size-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="size-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Une erreur est survenue
        </h1>
        <p className="text-slate-500 mb-6">
          Nous sommes désolés, quelque chose s&apos;est mal passé. Veuillez réessayer.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => reset()}>
            <RefreshCw className="size-4 mr-2" />
            Réessayer
          </Button>
          <Button asChild>
            <Link href="/dashboard">
              <Home className="size-4 mr-2" />
              Accueil
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}


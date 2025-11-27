import { Button } from "@/components/ui/button"
import { FileQuestion, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="size-8 text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Page non trouvée
        </h1>
        <p className="text-slate-500 mb-6">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link href="javascript:history.back()">
              <ArrowLeft className="size-4 mr-2" />
              Retour
            </Link>
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


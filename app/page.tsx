import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogIn, Plus, PlayCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary">Online Quiz Platform</h1>
          <p className="text-xl text-muted-foreground">
            Create, practice, and master quizzes with our intuitive platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="gap-2">
                <LogIn className="h-5 w-5" />
                Login to Start
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Create Quizzes</h3>
              <p className="mt-2 text-muted-foreground">
                Build custom quizzes with multiple-choice questions, set time limits, and add detailed solutions.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <PlayCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Practice & Improve</h3>
              <p className="mt-2 text-muted-foreground">
                Take quizzes in practice mode, track your progress, and analyze your results to improve.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


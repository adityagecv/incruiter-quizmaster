"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Brain, PlusCircle, PlayCircle, BarChart3 } from "lucide-react"

export default function Dashboard() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const { quizzes, quizResults } = useSelector((state: RootState) => state.quiz)
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  const totalQuizzesTaken = quizResults.length
  const averageScore = totalQuizzesTaken
    ? quizResults.reduce((acc, result) => acc + (result.score / result.totalQuestions) * 100, 0) / totalQuizzesTaken
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.username}!</h1>
        <p className="text-muted-foreground">Manage your quizzes, track your progress, and continue learning.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizzes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quizzes Taken</CardTitle>
            <PlayCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuizzesTaken}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Quizzes</h2>
            <Link href="/create-quiz">
              <Button variant="outline" size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Create Quiz
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <Card key={quiz.id}>
                  <CardHeader>
                    <CardTitle>{quiz.title}</CardTitle>
                    <CardDescription>{quiz.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{quiz.questions.length} questions</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                      <Link href={`/practice?id=${quiz.id}`}>Practice</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-6">
                  <p className="text-center text-muted-foreground">No quizzes created yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Results</h2>
          </div>
          <div className="space-y-4">
            {quizResults.length > 0 ? (
              quizResults.map((result, index) => {
                const quiz = quizzes.find((q) => q.id === result.quizId)
                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{quiz?.title || "Unknown Quiz"}</CardTitle>
                      <CardDescription>
                        Score: {((result.score / result.totalQuestions) * 100).toFixed(1)}%
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {result.score} / {result.totalQuestions} correct answers
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Time taken: {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
                      </p>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <Card>
                <CardContent className="py-6">
                  <p className="text-center text-muted-foreground">No quiz results yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


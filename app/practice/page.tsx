"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import {
  setCurrentQuiz,
  nextQuestion,
  previousQuestion,
  answerQuestion,
  completeQuiz,
  resetQuiz,
  type UserAnswer,
} from "@/lib/features/quiz/quizSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, ArrowRight, Clock, CheckCircle, XCircle, InfoIcon as InfoCircle } from "lucide-react"

export default function PracticePage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const { currentQuiz, currentQuestion, userAnswers, quizzes } = useSelector((state: RootState) => state.quiz)
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
  const { toast } = useToast()

  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [timeTaken, setTimeTaken] = useState<number>(0)
  const [timerStarted, setTimerStarted] = useState<boolean>(false)
  const [quizComplete, setQuizComplete] = useState<boolean>(false)
  const [showSolution, setShowSolution] = useState<boolean>(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Load the quiz from the URL query parameter
  useEffect(() => {
    const quizId = searchParams.get("id")
    if (quizId) {
      dispatch(setCurrentQuiz(quizId))
    } else if (!currentQuiz) {
      router.push("/dashboard")
    }
  }, [searchParams, dispatch, router, currentQuiz])

  // Initialize the timer when the question changes
  useEffect(() => {
    if (currentQuiz && currentQuiz.questions[currentQuestion]) {
      const timeLimit = currentQuiz.questions[currentQuestion].timeLimit
      setTimeLeft(timeLimit)
      setTimerStarted(true)

      // Find the user's answer for this question
      const existingAnswer = userAnswers.find(
        (answer) => answer.questionId === currentQuiz.questions[currentQuestion].id,
      )

      if (existingAnswer) {
        setSelectedOption(existingAnswer.selectedOption)
      } else {
        setSelectedOption(null)
      }

      setShowSolution(false)
    }
  }, [currentQuiz, currentQuestion, userAnswers])

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (timerStarted && timeLeft > 0 && !quizComplete) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
        setTimeTaken((prevTime) => prevTime + 1)
      }, 1000)
    } else if (timeLeft === 0 && timerStarted && !quizComplete) {
      handleTimeUp()
    }

    return () => clearInterval(interval)
  }, [timeLeft, timerStarted, quizComplete])

  // Handle time up
  const handleTimeUp = () => {
    toast({
      title: "Time's up!",
      description: "Moving to the next question...",
    })

    if (currentQuiz) {
      // Save the current answer (or null if not selected)
      const question = currentQuiz.questions[currentQuestion]
      const answer: UserAnswer = {
        questionId: question.id,
        selectedOption: selectedOption,
        isCorrect: selectedOption === question.correctAnswer,
        timeSpent: question.timeLimit,
      }

      dispatch(answerQuestion(answer))

      // If this is the last question, complete the quiz
      if (currentQuestion === currentQuiz.questions.length - 1) {
        finishQuiz()
      } else {
        // Otherwise, move to the next question
        dispatch(nextQuestion())
      }
    }
  }

  // Handle option selection
  const handleOptionSelect = (value: string | number) => {
    setSelectedOption(typeof value === "string" ? Number.parseInt(value) : value)
  }

  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuiz) {
      // Save the current answer
      const question = currentQuiz.questions[currentQuestion]

      if (selectedOption === null) {
        toast({
          title: "No answer selected",
          description: "Please select an option before proceeding",
          variant: "destructive",
        })
        return
      }

      const answer: UserAnswer = {
        questionId: question.id,
        selectedOption: selectedOption,
        isCorrect: selectedOption === question.correctAnswer,
        timeSpent: question.timeLimit - timeLeft,
      }

      dispatch(answerQuestion(answer))

      // If this is the last question, complete the quiz
      if (currentQuestion === currentQuiz.questions.length - 1) {
        finishQuiz()
      } else {
        // Otherwise, move to the next question
        dispatch(nextQuestion())
      }
    }
  }

  // Handle previous question
  const handlePreviousQuestion = () => {
    dispatch(previousQuestion())
  }

  // Handle finishing the quiz
  const finishQuiz = () => {
    if (currentQuiz) {
      setQuizComplete(true)
      setTimerStarted(false)

      // Calculate the score
      const score = userAnswers.filter((answer) => answer.isCorrect).length

      // Dispatch the complete quiz action
      dispatch(
        completeQuiz({
          quizId: currentQuiz.id,
          answers: userAnswers,
          score: score,
          totalQuestions: currentQuiz.questions.length,
          timeTaken: timeTaken,
        }),
      )
    }
  }

  // Get back to the dashboard
  const handleBackToDashboard = () => {
    dispatch(resetQuiz())
    router.push("/dashboard")
  }

  // Handle showing the solution
  const toggleSolution = () => {
    setShowSolution(!showSolution)
  }

  if (!isAuthenticated || !currentQuiz) {
    return null // Will redirect in useEffect
  }

  // If the quiz is complete, show the results
  if (quizComplete) {
    const score = userAnswers.filter((answer) => answer.isCorrect).length
    const percentage = (score / currentQuiz.questions.length) * 100

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Quiz Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold">{currentQuiz.title}</h2>
              <p className="text-muted-foreground mt-1">{currentQuiz.description}</p>
            </div>

            <div className="text-center my-8">
              <div className="text-5xl font-bold mb-2">
                {score} / {currentQuiz.questions.length}
              </div>
              <div className="text-2xl font-medium">{percentage.toFixed(1)}%</div>
              <Progress value={percentage} className="w-full h-3 mt-4" />
            </div>

            <div className="space-y-8">
              <h3 className="text-xl font-semibold">Question Breakdown</h3>

              {currentQuiz.questions.map((question, index) => {
                const userAnswer = userAnswers.find((answer) => answer.questionId === question.id)

                const isCorrect = userAnswer?.isCorrect

                return (
                  <Card key={question.id} className={isCorrect ? "border-green-200" : "border-red-200"}>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                      <div>
                        <CardTitle className="text-base font-medium">Question {index + 1}</CardTitle>
                        <div className="flex items-center gap-1 mt-1">
                          {isCorrect ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className={isCorrect ? "text-green-500" : "text-red-500"}>
                            {isCorrect ? "Correct" : "Incorrect"}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">Time: {userAnswer?.timeSpent || 0}s</div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="font-medium">{question.text}</div>

                      <div className="grid gap-2 pt-1">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`flex items-center rounded-md border p-3 ${
                              optionIndex === question.correctAnswer
                                ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900"
                                : optionIndex === userAnswer?.selectedOption
                                  ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900"
                                  : ""
                            }`}
                          >
                            <div className="flex-1">{option}</div>
                            {optionIndex === question.correctAnswer && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            {optionIndex === userAnswer?.selectedOption && optionIndex !== question.correctAnswer && (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-3 bg-muted rounded-md">
                        <div className="font-medium flex items-center gap-1">
                          <InfoCircle className="h-4 w-4 text-primary" />
                          Solution:
                        </div>
                        <div className="mt-1 text-sm">{question.solution}</div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handleBackToDashboard}>Back to Dashboard</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const currentQuestionObj = currentQuiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / currentQuiz.questions.length) * 100

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{currentQuiz.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {timeLeft} seconds left
            </div>
          </div>
          <div className="mt-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>
                Question {currentQuestion + 1} of {currentQuiz.questions.length}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg font-medium">{currentQuestionObj.text}</div>

          <div className="grid gap-3">
            {currentQuestionObj.options.map((option, index) => (
              <Label
                key={index}
                htmlFor={`option-${index}`}
                className={`flex items-center rounded-md border p-4 cursor-pointer hover:bg-muted transition-colors ${
                  selectedOption === index ? "bg-muted" : ""
                }`}
              >
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="quiz-option"
                  className="mr-3 h-4 w-4 rounded-full border border-primary text-primary"
                  checked={selectedOption === index}
                  onChange={() => handleOptionSelect(index.toString())}
                />
                {option}
              </Label>
            ))}
          </div>

          {showSolution && (
            <div className="p-4 mt-4 bg-muted rounded-md">
              <div className="font-medium">Solution:</div>
              <div className="mt-1">{currentQuestionObj.solution}</div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={toggleSolution}>
              {showSolution ? "Hide Solution" : "Show Solution"}
            </Button>
            <Button onClick={handleNextQuestion} className="gap-1">
              {currentQuestion === currentQuiz.questions.length - 1 ? (
                "Finish Quiz"
              ) : (
                <>
                  Next <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}


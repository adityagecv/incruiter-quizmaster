"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { v4 as uuidv4 } from "uuid"
import { addQuiz } from "@/lib/features/quiz/quizSlice"
import type { RootState } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Trash2, MoveUp, MoveDown, Clock, HelpCircle } from "lucide-react"
import type { Question } from "@/lib/features/quiz/quizSlice"
import { useToast } from "@/components/ui/use-toast"

export default function CreateQuiz() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const router = useRouter()
  const dispatch = useDispatch()
  const { toast } = useToast()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: uuidv4(),
      text: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      timeLimit: 30,
      solution: "",
    },
  ])

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: uuidv4(),
        text: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        timeLimit: 30,
        solution: "",
      },
    ])
  }

  const removeQuestion = (index: number) => {
    if (questions.length === 1) {
      toast({
        title: "Error",
        description: "Quiz must have at least one question",
        variant: "destructive",
      })
      return
    }

    const newQuestions = [...questions]
    newQuestions.splice(index, 1)
    setQuestions(newQuestions)
  }

  const moveQuestionUp = (index: number) => {
    if (index === 0) return
    const newQuestions = [...questions]
    const temp = newQuestions[index]
    newQuestions[index] = newQuestions[index - 1]
    newQuestions[index - 1] = temp
    setQuestions(newQuestions)
  }

  const moveQuestionDown = (index: number) => {
    if (index === questions.length - 1) return
    const newQuestions = [...questions]
    const temp = newQuestions[index]
    newQuestions[index] = newQuestions[index + 1]
    newQuestions[index + 1] = temp
    setQuestions(newQuestions)
  }

  const updateQuestion = (index: number, field: keyof Question, value: string | number) => {
    const newQuestions = [...questions]
    newQuestions[index] = {
      ...newQuestions[index],
      [field]: value,
    }
    setQuestions(newQuestions)
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options[optionIndex] = value
    setQuestions(newQuestions)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your quiz",
        variant: "destructive",
      })
      return
    }

    // Check if all questions have text
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text.trim()) {
        toast({
          title: "Error",
          description: `Question ${i + 1} is missing text`,
          variant: "destructive",
        })
        return
      }

      // Check if all options have text
      for (let j = 0; j < questions[i].options.length; j++) {
        if (!questions[i].options[j].trim()) {
          toast({
            title: "Error",
            description: `Option ${j + 1} in question ${i + 1} is missing text`,
            variant: "destructive",
          })
          return
        }
      }

      // Check if solution is provided
      if (!questions[i].solution.trim()) {
        toast({
          title: "Error",
          description: `Solution for question ${i + 1} is missing`,
          variant: "destructive",
        })
        return
      }
    }

    const newQuiz = {
      id: uuidv4(),
      title,
      description,
      questions,
      createdBy: user?.id || "unknown",
      createdAt: new Date().toISOString(),
    }

    dispatch(addQuiz(newQuiz))

    toast({
      title: "Success",
      description: "Quiz created successfully!",
    })

    router.push("/dashboard")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create a New Quiz</h1>

      <form onSubmit={handleSubmit}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter quiz title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter quiz description"
              />
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-4">Questions</h2>

        {questions.map((question, questionIndex) => (
          <Card key={question.id} className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Question {questionIndex + 1}</CardTitle>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => moveQuestionUp(questionIndex)}
                  disabled={questionIndex === 0}
                >
                  <MoveUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => moveQuestionDown(questionIndex)}
                  disabled={questionIndex === questions.length - 1}
                >
                  <MoveDown className="h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" size="icon" onClick={() => removeQuestion(questionIndex)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`question-${questionIndex}`}>Question Text</Label>
                <Textarea
                  id={`question-${questionIndex}`}
                  value={question.text}
                  onChange={(e) => updateQuestion(questionIndex, "text", e.target.value)}
                  placeholder="Enter question text"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time Limit (seconds)
                  </div>
                </Label>
                <Input
                  type="number"
                  min="10"
                  max="300"
                  value={question.timeLimit}
                  onChange={(e) => updateQuestion(questionIndex, "timeLimit", Number.parseInt(e.target.value) || 30)}
                />
              </div>

              <div className="space-y-2">
                <Label>Options</Label>
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-2">
                    <div className="flex-shrink-0">
                      <input
                        type="radio"
                        name={`correct-${question.id}`}
                        id={`option-${questionIndex}-${optionIndex}`}
                        checked={question.correctAnswer === optionIndex}
                        onChange={() => updateQuestion(questionIndex, "correctAnswer", optionIndex)}
                        className="h-4 w-4"
                      />
                    </div>
                    <Label htmlFor={`option-${questionIndex}-${optionIndex}`} className="w-full cursor-pointer">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                    </Label>
                  </div>
                ))}
                <div className="text-sm text-muted-foreground">Select the radio button for the correct answer</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`solution-${questionIndex}`}>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Solution / Explanation
                  </div>
                </Label>
                <Textarea
                  id={`solution-${questionIndex}`}
                  value={question.solution}
                  onChange={(e) => updateQuestion(questionIndex, "solution", e.target.value)}
                  placeholder="Explain the correct answer"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="mb-8">
          <Button type="button" variant="outline" onClick={addQuestion} className="w-full gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Another Question
          </Button>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
            Cancel
          </Button>
          <Button type="submit">Save Quiz</Button>
        </div>
      </form>
    </div>
  )
}


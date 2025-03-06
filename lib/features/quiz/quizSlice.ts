import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  timeLimit: number
  solution: string
}

export interface Quiz {
  id: string
  title: string
  description: string
  questions: Question[]
  createdBy: string
  createdAt: string
}

export interface UserAnswer {
  questionId: string
  selectedOption: number | null
  isCorrect: boolean
  timeSpent: number
}

export interface QuizResult {
  quizId: string
  answers: UserAnswer[]
  score: number
  totalQuestions: number
  timeTaken: number
}

interface QuizState {
  quizzes: Quiz[]
  currentQuiz: Quiz | null
  currentQuestion: number
  userAnswers: UserAnswer[]
  quizResults: QuizResult[]
  isLoading: boolean
  error: string | null
}

// Sample initial data
const initialQuizzes: Quiz[] = [
  {
    id: "1",
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics",
    questions: [
      {
        id: "1-1",
        text: "What is JavaScript?",
        options: ["A programming language", "A markup language", "A styling language", "A database"],
        correctAnswer: 0,
        timeLimit: 30,
        solution: "JavaScript is a programming language used to create interactive effects within web browsers.",
      },
      {
        id: "1-2",
        text: "Which of these is not a JavaScript data type?",
        options: ["Number", "String", "Boolean", "Character"],
        correctAnswer: 3,
        timeLimit: 30,
        solution:
          "Character is not a data type in JavaScript. JavaScript has primitive data types like Number, String, Boolean, undefined, null, Symbol, and BigInt.",
      },
      {
        id: "1-3",
        text: "What does the === operator do?",
        options: [
          "Checks for equality only",
          "Assigns a value",
          "Checks for equality and type",
          "Checks if greater than",
        ],
        correctAnswer: 2,
        timeLimit: 30,
        solution: "The === operator (strict equality) checks for both value equality and type equality.",
      },
    ],
    createdBy: "1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "React Basics",
    description: "Test your understanding of React fundamentals",
    questions: [
      {
        id: "2-1",
        text: "What is React?",
        options: [
          "A JavaScript library for building user interfaces",
          "A programming language",
          "A database system",
          "A styling framework",
        ],
        correctAnswer: 0,
        timeLimit: 30,
        solution: "React is a JavaScript library for building user interfaces, particularly single-page applications.",
      },
      {
        id: "2-2",
        text: "What is JSX in React?",
        options: [
          "JavaScript XML - a syntax extension for JavaScript",
          "JavaScript Extra - a new JavaScript version",
          "JavaScript Extension - a plugin system",
          "Java Syntax Extension - a way to write Java in React",
        ],
        correctAnswer: 0,
        timeLimit: 30,
        solution:
          "JSX is a syntax extension for JavaScript that looks similar to XML or HTML and allows you to write HTML-like code in your JavaScript.",
      },
    ],
    createdBy: "1",
    createdAt: new Date().toISOString(),
  },
]

const initialState: QuizState = {
  quizzes: initialQuizzes,
  currentQuiz: null,
  currentQuestion: 0,
  userAnswers: [],
  quizResults: [],
  isLoading: false,
  error: null,
}

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setQuizzes: (state, action: PayloadAction<Quiz[]>) => {
      state.quizzes = action.payload
    },
    addQuiz: (state, action: PayloadAction<Quiz>) => {
      state.quizzes.push(action.payload)
    },
    setCurrentQuiz: (state, action: PayloadAction<string>) => {
      const quiz = state.quizzes.find((q) => q.id === action.payload)
      if (quiz) {
        state.currentQuiz = quiz
        state.currentQuestion = 0
        state.userAnswers = []
      }
    },
    nextQuestion: (state) => {
      if (state.currentQuiz && state.currentQuestion < state.currentQuiz.questions.length - 1) {
        state.currentQuestion += 1
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestion > 0) {
        state.currentQuestion -= 1
      }
    },
    answerQuestion: (state, action: PayloadAction<UserAnswer>) => {
      const existingAnswerIndex = state.userAnswers.findIndex(
        (answer) => answer.questionId === action.payload.questionId,
      )

      if (existingAnswerIndex !== -1) {
        state.userAnswers[existingAnswerIndex] = action.payload
      } else {
        state.userAnswers.push(action.payload)
      }
    },
    completeQuiz: (state, action: PayloadAction<QuizResult>) => {
      state.quizResults.push(action.payload)
      state.currentQuiz = null
      state.currentQuestion = 0
      state.userAnswers = []
    },
    resetQuiz: (state) => {
      state.currentQuiz = null
      state.currentQuestion = 0
      state.userAnswers = []
    },
  },
})

export const {
  setQuizzes,
  addQuiz,
  setCurrentQuiz,
  nextQuestion,
  previousQuestion,
  answerQuestion,
  completeQuiz,
  resetQuiz,
} = quizSlice.actions

export default quizSlice.reducer


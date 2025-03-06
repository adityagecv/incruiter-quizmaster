import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface User {
  id: string
  username: string
  email: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

// In a real app, these would be stored in a database
const initialUsers = [
  { id: "1", username: "admin", password: "password", email: "admin@example.com" },
  { id: "2", username: "user", password: "password", email: "user@example.com" },
]

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
      state.error = null
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions

// Thunk for login
export const login = (username: string, password: string) => (dispatch: any) => {
  dispatch(loginStart())

  try {
    // In a real app, this would be an API call
    const user = initialUsers.find((u) => u.username === username && u.password === password)

    if (user) {
      const { password: _, ...userData } = user
      setTimeout(() => {
        dispatch(loginSuccess(userData as User))
      }, 1000) // Simulate API delay
    } else {
      setTimeout(() => {
        dispatch(loginFailure("Invalid username or password"))
      }, 1000) // Simulate API delay
    }
  } catch (error) {
    dispatch(loginFailure("An error occurred during login"))
  }
}

export default authSlice.reducer


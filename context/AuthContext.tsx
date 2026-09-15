import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../services/firebaseConfig'

type AuthContextType = {
  user: User | null
  initializing: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  initializing: true
})

export function AuthProvider ({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser)
      setInitializing(false)
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, initializing }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth () {
  return useContext(AuthContext)
}

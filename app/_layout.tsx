import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { AuthProvider } from '../context/AuthContext'
import { AlertProvider } from '@/context/AlertContext'

export default function RootLayout () {
  return (
    <AlertProvider>
      <AuthProvider>
        <Slot />
        <StatusBar style='auto' />
      </AuthProvider>
    </AlertProvider>
  )
}

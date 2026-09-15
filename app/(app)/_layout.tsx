import { Redirect, Stack } from 'expo-router'
import { useAuth } from '../../context/AuthContext'

export default function AppLayout () {
  const { user, initializing } = useAuth()

  if (!initializing && !user) {
    return <Redirect href='/(auth)/login' />
  }

  return <Stack screenOptions={{ headerShown: false }} />
}

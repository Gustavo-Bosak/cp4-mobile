import { Redirect, Stack } from 'expo-router'
import { useAuth } from '../../context/AuthContext'

export default function AppLayout () {
  const { user, initializing } = useAuth()

  if (!initializing && !user) {
    return <Redirect href='/(auth)/login' />
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4f46e5'
        },
        headerTintColor: '#fff'
      }}
    >
      <Stack.Screen name='home' options={{ title: 'Início' }} />
      <Stack.Screen name='perfil' options={{ title: 'Minha conta' }} />
      <Stack.Screen name='gasto/novo' options={{ title: 'Novo gasto' }} />
      <Stack.Screen name='gasto/[id]' options={{ title: 'Editar gasto' }} />
    </Stack>
  )
}

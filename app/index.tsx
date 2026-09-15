import { Redirect } from 'expo-router'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { useAuth } from '../context/AuthContext'

export default function Index () {
  const { user, initializing } = useAuth()

  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color='#4f46e5' />
      </View>
    )
  }

  return <Redirect href={user ? '/(app)/home' : '/(auth)/login'} />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  }
})

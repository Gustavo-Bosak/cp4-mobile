import { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native'
import { signOut, deleteUser, AuthError } from 'firebase/auth'
import { auth } from '../../services/firebaseConfig'
import { useAuth } from '../../context/AuthContext'

export default function HomeScreen () {
  const { user } = useAuth()
  const [carregando, setCarregando] = useState(false)

  if (!user) {
    return null
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch {
      Alert.alert('Erro', 'Não foi possível sair da conta.')
    }
  }

  const excluirConta = async () => {
    setCarregando(true)
    try {
      await deleteUser(user)
    } catch (e) {
      const authError = e as AuthError
      if (authError.code === 'auth/requires-recent-login') {
        Alert.alert(
          'Sessão expirada',
          'Por segurança, faça login novamente antes de excluir a conta.'
        )
        await signOut(auth)
      } else {
        Alert.alert('Erro', 'Não foi possível excluir a conta.')
      }
    } finally {
      setCarregando(false)
    }
  }

  const handleExcluirConta = () => {
    Alert.alert(
      'Excluir conta',
      'Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: excluirConta }
      ]
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Minha conta</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.valor}>{user.displayName || 'Não informado'}</Text>

        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.valor}>{user.email}</Text>
      </View>

      <TouchableOpacity style={styles.botaoSecundario} onPress={handleLogout}>
        <Text style={styles.textoBotaoSecundario}>Sair (Logout)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoPerigo}
        onPress={handleExcluirConta}
        disabled={carregando}
      >
        {carregando ? (
          <ActivityIndicator color='#fff' />
        ) : (
          <Text style={styles.textoBotaoPerigo}>Excluir conta</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#111827',
    textAlign: 'center'
  },
  card: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32
  },
  label: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 8
  },
  valor: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500'
  },
  botaoSecundario: {
    borderWidth: 1,
    borderColor: '#4f46e5',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48
  },
  textoBotaoSecundario: {
    color: '#4f46e5',
    fontSize: 16,
    fontWeight: '600'
  },
  botaoPerigo: {
    backgroundColor: '#dc2626',
    borderRadius: 8,
    padding: 14,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48
  },
  textoBotaoPerigo: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
})

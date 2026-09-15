import { useState } from 'react'
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native'
import { Link } from 'expo-router'
import { signInWithEmailAndPassword, AuthError } from 'firebase/auth'
import { auth } from '../../services/firebaseConfig'

function traduzirErro (code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'E-mail inválido.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha inválidos.'
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.'
    default:
      return 'Não foi possível entrar. Tente novamente.'
  }
}

export default function LoginScreen () {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleLogin = async () => {
    setErro('')

    if (!email || !senha) {
      setErro('Preencha e-mail e senha.')
      return
    }

    setCarregando(true)
    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha)
    } catch (e) {
      setErro(traduzirErro((e as AuthError).code))
    } finally {
      setCarregando(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps='handled'
      >
        <Text style={styles.titulo}>Entrar</Text>

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder='seuemail@exemplo.com'
          autoCapitalize='none'
          keyboardType='email-address'
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder='Sua senha'
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <TouchableOpacity
          style={styles.botao}
          onPress={handleLogin}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color='#fff' />
          ) : (
            <Text style={styles.textoBotao}>Entrar</Text>
          )}
        </TouchableOpacity>

        <Link href='/(auth)/forgot-password' style={styles.link}>
          Esqueci minha senha
        </Link>

        <Link href='/(auth)/signup' style={[styles.link, styles.linkContainer]}>
          Não tem conta? Cadastre-se
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#ffffff'
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#111827',
    textAlign: 'center'
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
    marginTop: 12
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16
  },
  erro: {
    color: '#dc2626',
    marginTop: 12,
    textAlign: 'center'
  },
  botao: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    padding: 14,
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  link: {
    color: '#4f46e5',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16
  },
  linkContainer: {
    marginTop: 8
  }
})

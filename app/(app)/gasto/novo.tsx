import { useState } from 'react'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import GastoForm from '../../../components/GastoForm'
import { useAuth } from '../../../context/AuthContext'
import { criarGasto, GastoDados } from '../../../services/gastos'

export default function NovoGastoScreen () {
  const { user } = useAuth()
  const router = useRouter()
  const [salvando, setSalvando] = useState(false)

  const handleSalvar = async (dados: GastoDados) => {
    if (!user) return

    setSalvando(true)
    try {
      await criarGasto(user.uid, dados)
      router.back()
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o gasto. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <GastoForm
      textoBotao='Cadastrar'
      carregando={salvando}
      onSalvar={handleSalvar}
    />
  )
}

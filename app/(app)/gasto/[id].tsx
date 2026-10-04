import { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import GastoForm from '../../../components/GastoForm'
import { useAuth } from '../../../context/AuthContext'
import {
  buscarGasto,
  atualizarGasto,
  Gasto,
  GastoDados
} from '../../../services/gastos'
import { useAlert } from '@/context/AlertContext'

export default function EditarGastoScreen () {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { user } = useAuth()
  const { exibirAlerta } = useAlert()
  const router = useRouter()

  const [gasto, setGasto] = useState<Gasto | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    async function carregar () {
      if (!user || !id) return
      try {
        const encontrado = await buscarGasto(user.uid, id)
        setGasto(encontrado)
      } catch {
        setErro(true)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [user, id])

  const handleSalvar = async (dados: GastoDados) => {
    if (!user || !id) return

    setSalvando(true)
    try {
      await atualizarGasto(user.uid, id, dados)
      router.back()
    } catch {
      exibirAlerta(
        'Erro',
        'Não foi possível atualizar o gasto. Tente novamente.'
      )
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size='large' color='#4f46e5' />
      </View>
    )
  }

  if (erro || !gasto) {
    return (
      <View style={styles.centro}>
        <Text style={styles.mensagem}>
          Não foi possível carregar este registro.
        </Text>
      </View>
    )
  }

  return (
    <GastoForm
      valoresIniciais={{
        descricao: gasto.descricao,
        valor: String(gasto.valor),
        categoria: gasto.categoria,
        data: gasto.data
      }}
      textoBotao='Salvar alterações'
      carregando={salvando}
      onSalvar={handleSalvar}
    />
  )
}

const styles = StyleSheet.create({
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff'
  },
  mensagem: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center'
  }
})

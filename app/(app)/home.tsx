import { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import { escutarGastos, excluirGasto, Gasto } from '../../services/gastos'

function formatarValor (valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function HomeScreen () {
  const { user } = useAuth()
  const router = useRouter()
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!user) return

    const unsubscribe = escutarGastos(
      user.uid,
      lista => {
        setGastos(lista)
        setCarregando(false)
      },
      () => {
        setCarregando(false)
        Alert.alert('Erro', 'Não foi possível carregar os gastos.')
      }
    )

    return unsubscribe
  }, [user])

  const handleExcluir = (item: Gasto) => {
    Alert.alert(
      'Excluir registro',
      'Tem certeza que deseja excluir este registro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            if (!user) return
            try {
              await excluirGasto(user.uid, item.id)
              Alert.alert('Sucesso', 'Registro excluído.')
            } catch {
              Alert.alert('Erro', 'Não foi possível excluir o registro.')
            }
          }
        }
      ]
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Meus gastos</Text>
        <Link href='/(app)/perfil' style={styles.linkPerfil}>
          Perfil
        </Link>
      </View>

      <View style={styles.conteudo}>
        {carregando ? (
          <View style={styles.estadoCentralizado}>
            <ActivityIndicator size='large' color='#4f46e5' />
          </View>
        ) : gastos.length === 0 ? (
          <View style={styles.estadoCentralizado}>
            <Text style={styles.vazio}>Nenhum registro encontrado.</Text>
          </View>
        ) : (
          <FlatList
            data={gastos}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.lista}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardDescricao}>{item.descricao}</Text>
                  <Text style={styles.cardDetalhe}>
                    {item.categoria} • {item.data}
                  </Text>
                  <Text style={styles.cardValor}>
                    {formatarValor(item.valor)}
                  </Text>
                </View>

                <View style={styles.cardAcoes}>
                  <TouchableOpacity
                    onPress={() => router.push(`/(app)/gasto/${item.id}`)}
                  >
                    <Text style={styles.acaoEditar}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleExcluir(item)}>
                    <Text style={styles.acaoExcluir}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.botaoNovo}
        onPress={() => router.push('/(app)/gasto/novo')}
      >
        <Text style={styles.textoBotaoNovo}>+ Novo gasto</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#ffffff'
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827'
  },
  linkPerfil: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: '#4f46e5',
    padding: 4,
    paddingHorizontal: 24,
    borderRadius: 100
  },
  conteudo: {
    flex: 1
  },
  estadoCentralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  vazio: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 15
  },
  flatList: {
    flex: 1
  },
  lista: {
    paddingBottom: 16
  },
  card: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardInfo: {
    flex: 1,
    paddingRight: 12
  },
  cardDescricao: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827'
  },
  cardDetalhe: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2
  },
  cardValor: {
    fontSize: 15,
    fontWeight: '600',
    color: '#dc2626',
    marginTop: 6
  },
  cardAcoes: {
    alignItems: 'flex-end',
    gap: 8
  },
  acaoEditar: {
    color: '#4f46e5',
    fontWeight: '600'
  },
  acaoExcluir: {
    color: '#dc2626',
    fontWeight: '600'
  },
  botaoNovo: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    padding: 14,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48
  },
  textoBotaoNovo: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
})

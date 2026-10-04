import { createContext, useContext, useMemo, useState, ReactNode } from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export type BotaoAlerta = {
  text: string
  style?: 'padrao' | 'cancel' | 'destructive'
  onPress?: () => void
}

type AlertContextType = {
  exibirAlerta: (
    titulo: string,
    mensagem?: string,
    botoes?: BotaoAlerta[]
  ) => void
}

const AlertContext = createContext<AlertContextType>({
  exibirAlerta: () => {}
})

type EstadoAlerta = {
  visivel: boolean
  titulo: string
  mensagem?: string
  botoes: BotaoAlerta[]
}

const ESTADO_INICIAL: EstadoAlerta = {
  visivel: false,
  titulo: '',
  mensagem: undefined,
  botoes: []
}

export function AlertProvider ({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoAlerta>(ESTADO_INICIAL)

  const exibirAlerta = (
    titulo: string,
    mensagem?: string,
    botoes: BotaoAlerta[] = [{ text: 'OK' }]
  ) => {
    setEstado({ visivel: true, titulo, mensagem, botoes })
  }

  const fechar = () => {
    setEstado(atual => ({ ...atual, visivel: false }))
  }

  const handlePress = (botao: BotaoAlerta) => {
    fechar()
    botao.onPress?.()
  }

  const value = useMemo(() => ({ exibirAlerta }), [])

  return (
    <AlertContext.Provider value={value}>
      {children}

      <Modal
        visible={estado.visivel}
        transparent
        animationType='fade'
        onRequestClose={fechar}
      >
        <View style={styles.fundo}>
          <View style={styles.caixa}>
            <Text style={styles.titulo}>{estado.titulo}</Text>
            {estado.mensagem ? (
              <Text style={styles.mensagem}>{estado.mensagem}</Text>
            ) : null}

            <View style={styles.botoesContainer}>
              {estado.botoes.map((botao, indice) => (
                <TouchableOpacity
                  key={indice}
                  style={[
                    styles.botao,
                    botao.style === 'cancel' && styles.botaoCancelar,
                    botao.style === 'destructive' && styles.botaoDestrutivo
                  ]}
                  onPress={() => handlePress(botao)}
                >
                  <Text
                    style={[
                      styles.textoBotao,
                      botao.style === 'cancel' && styles.textoBotaoCancelar
                    ]}
                  >
                    {botao.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </AlertContext.Provider>
  )
}

export function useAlert () {
  return useContext(AlertContext)
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  caixa: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center'
  },
  mensagem: {
    fontSize: 15,
    color: '#374151',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20
  },
  botoesContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10
  },
  botao: {
    flex: 1,
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  botaoCancelar: {
    backgroundColor: '#f3f4f6'
  },
  botaoDestrutivo: {
    backgroundColor: '#dc2626'
  },
  textoBotao: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600'
  },
  textoBotaoCancelar: {
    color: '#374151'
  }
})

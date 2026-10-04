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
import DateTimePicker, {
  DateTimePickerChangeEvent
} from '@react-native-community/datetimepicker'
import type { GastoDados } from '../services/gastos'

type ValoresFormulario = {
  descricao: string
  valor: string
  categoria: string
  data: string
}

function formatarData (data: Date): string {
  return data.toLocaleDateString('pt-BR')
}

function parseData (texto: string): Date {
  const partes = texto.split('/')
  if (partes.length === 3) {
    const [dia, mes, ano] = partes.map(Number)
    const data = new Date(ano, mes - 1, dia)
    if (!Number.isNaN(data.getTime())) {
      return data
    }
  }
  return new Date()
}

type Props = {
  valoresIniciais?: ValoresFormulario
  textoBotao: string
  carregando: boolean
  onSalvar: (dados: GastoDados) => void
}

const VALORES_VAZIOS: ValoresFormulario = {
  descricao: '',
  valor: '',
  categoria: '',
  data: ''
}

export default function GastoForm ({
  valoresIniciais = VALORES_VAZIOS,
  textoBotao,
  carregando,
  onSalvar
}: Props) {
  const [descricao, setDescricao] = useState(valoresIniciais.descricao)
  const [valor, setValor] = useState(valoresIniciais.valor)
  const [categoria, setCategoria] = useState(valoresIniciais.categoria)
  const [data, setData] = useState<Date>(
    valoresIniciais.data ? parseData(valoresIniciais.data) : new Date()
  )
  const [mostrarCalendario, setMostrarCalendario] = useState(false)
  const [erro, setErro] = useState('')

  const handleAlterarData = (
    _evento: DateTimePickerChangeEvent,
    dataEscolhida: Date
  ) => {
    if (Platform.OS === 'android') {
      setMostrarCalendario(false)
    }
    setData(dataEscolhida)
  }

  const handleFecharCalendario = () => {
    setMostrarCalendario(false)
  }

  const handleSalvar = () => {
    setErro('')

    if (
      !descricao.trim() ||
      !categoria.trim() ||
      !data ||
      !valor.trim()
    ) {
      setErro('Preencha todos os campos.')
      return
    }

    const valorNumerico = Number(valor.replace(',', '.'))
    if (Number.isNaN(valorNumerico)) {
      setErro('Informe um valor numérico válido.')
      return
    }
    if (valorNumerico <= 0) {
      setErro('O valor deve ser maior que zero.')
      return
    }

    onSalvar({
      descricao: descricao.trim(),
      valor: valorNumerico,
      categoria: categoria.trim(),
      data: formatarData(data)
    })
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
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.input}
          placeholder='Ex: Supermercado'
          value={descricao}
          onChangeText={setDescricao}
        />

        <Text style={styles.label}>Valor (R$)</Text>
        <TextInput
          style={styles.input}
          placeholder='Ex: 150.90'
          keyboardType='decimal-pad'
          value={valor}
          onChangeText={setValor}
        />

        <Text style={styles.label}>Categoria</Text>
        <TextInput
          style={styles.input}
          placeholder='Ex: Alimentação'
          value={categoria}
          onChangeText={setCategoria}
        />

        <Text style={styles.label}>Data</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setMostrarCalendario(true)}
        >
          <Text style={styles.textoData}>{formatarData(data)}</Text>
        </TouchableOpacity>

        {mostrarCalendario && (
          <>
            <DateTimePicker
              value={data}
              mode='date'
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onValueChange={handleAlterarData}
              onDismiss={handleFecharCalendario}
            />
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={styles.botaoConcluirData}
                onPress={handleFecharCalendario}
              >
                <Text style={styles.textoBotaoConcluirData}>Concluir</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <TouchableOpacity
          style={styles.botao}
          onPress={handleSalvar}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color='#fff' />
          ) : (
            <Text style={styles.textoBotao}>{textoBotao}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#ffffff'
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
  textoData: {
    fontSize: 16,
    color: '#111827'
  },
  botaoConcluirData: {
    alignSelf: 'flex-end',
    marginTop: 8
  },
  textoBotaoConcluirData: {
    color: '#4f46e5',
    fontSize: 15,
    fontWeight: '600'
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
  }
})

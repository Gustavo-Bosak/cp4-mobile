import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleRecuperarSenha = async () => {
    setErro("");
    setMensagem("");

    if (!email) {
      setErro("Informe seu e-mail.");
      return;
    }

    setCarregando(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch {
    } finally {
      setCarregando(false);
      setMensagem(
        "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Esqueci minha senha</Text>

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="seuemail@exemplo.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}
        {mensagem ? <Text style={styles.sucesso}>{mensagem}</Text> : null}

        <TouchableOpacity
          style={styles.botao}
          onPress={handleRecuperarSenha}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.textoBotao}>Enviar instruções</Text>
          )}
        </TouchableOpacity>

        <Link href="/(auth)/login" style={styles.link}>
          Voltar para o login
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#ffffff",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#111827",
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  erro: {
    color: "#dc2626",
    marginTop: 12,
    textAlign: "center",
  },
  sucesso: {
    color: "#16a34a",
    marginTop: 12,
    textAlign: "center",
  },
  botao: {
    backgroundColor: "#4f46e5",
    borderRadius: 8,
    padding: 14,
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    color: "#4f46e5",
    fontSize: 14,
    textAlign: "center",
    marginTop: 16,
  },
});

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
import {
  createUserWithEmailAndPassword,
  updateProfile,
  AuthError,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";

function emailValido(valor: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

function traduzirErro(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "Este e-mail já está cadastrado.";
    case "auth/invalid-email":
      return "E-mail inválido.";
    case "auth/weak-password":
      return "A senha deve ter no mínimo 6 caracteres.";
    default:
      return "Não foi possível criar a conta. Tente novamente.";
  }
}

export default function SignUpScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleCadastro = async () => {
    setErro("");
    setSucesso("");

    if (!nome || !email || !senha || !confirmarSenha) {
      setErro("Preencha todos os campos.");
      return;
    }
    if (!emailValido(email)) {
      setErro("Informe um e-mail válido.");
      return;
    }
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);
    try {
      const credenciais = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        senha
      );
      await updateProfile(credenciais.user, { displayName: nome.trim() });
      setSucesso("Conta criada com sucesso!");
      // O AuthContext detecta o novo usuário automaticamente e o
      // app/index.tsx redireciona para a área autenticada.
    } catch (e) {
      setErro(traduzirErro((e as AuthError).code));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Criar conta</Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu nome"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="seuemail@exemplo.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Mínimo 6 caracteres"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <Text style={styles.label}>Confirmar senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Repita a senha"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}
        {sucesso ? <Text style={styles.sucesso}>{sucesso}</Text> : null}

        <TouchableOpacity
          style={styles.botao}
          onPress={handleCadastro}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.textoBotao}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <Link href="/(auth)/login" style={styles.link}>
          Já tem conta? Fazer login
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
    fontSize: 28,
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

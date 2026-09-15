# CP4 Mobile - Sistema de Autenticação (Firebase Auth)

**Curso:** Tecnologia em Desenvolvimento de Sistemas - 2TDSPF
**Componente Curricular:** Mobile Application Development
**Professor:** Fernando Pinéo

## Integrantes

| Nome   | RM |
| -------- | ------- |
| Gustavo Bosak | RM566315 |

## Descrição do projeto

Aplicativo mobile desenvolvido em **React Native + TypeScript**, com navegação por **Expo Router** (roteamento baseado em arquivos) e integração ao **Firebase Authentication**. Permite que o usuário realize cadastro, login, logout, recuperação de senha e exclusão de conta, mantendo a sessão persistida localmente via AsyncStorage mesmo após fechar e reabrir o app.

Funcionalidades implementadas:

- Cadastro de usuário com validações básicas
- Login com e-mail e senha, com mensagens de erro amigáveis
- Persistência da sessão usando AsyncStorage
- Logout, com limpeza da sessão
- Recuperação de senha via e-mail do Firebase Authentication
- Exclusão de conta, com tela de confirmação
- Bloqueio de acesso às telas autenticadas por usuários não logados (rotas protegidas via layouts do Expo Router)

> [!IMPORTANT]
> Este projeto é um trabalho acadêmico simples e amador, sem preocupações avançadas de segurança, arquitetura ou testes automatizados — o foco é demonstrar corretamente os fluxos de autenticação exigidos.

## Tecnologias utilizadas

- [React Native](https://reactnative.dev/) (Expo SDK 57 / React Native 0.86 / React 19.2)
- [Expo](https://expo.dev/) 57
- [TypeScript](https://www.typescriptlang.org/)
- [Expo Router](https://docs.expo.dev/router/introduction/) 57 (navegação por arquivos)
- [Firebase Authentication](https://firebase.google.com/docs/auth) (Firebase JS SDK 12)
- [AsyncStorage](https://github.com/react-native-async-storage/async-storage) (persistência local da sessão)

Não foi utilizado Firestore nem bibliotecas de UI adicionais — o app usa apenas os componentes nativos do React Native.

## Estrutura do projeto (Expo Router)

```
CP4-Mobile-RouterTS/
├── app/
│   ├── _layout.tsx            # Layout raiz: provê o AuthContext para todo o app
│   ├── index.tsx              # Rota inicial: redireciona conforme o estado de login
│   ├── (auth)/                # Grupo de rotas da área NÃO autenticada
│   │   ├── _layout.tsx        # Redireciona para /(app)/home se já estiver logado
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── forgot-password.tsx
│   └── (app)/                 # Grupo de rotas da área autenticada
│       ├── _layout.tsx        # Redireciona para /(auth)/login se não estiver logado
│       └── home.tsx           # Tela de perfil/conta
├── context/
│   └── AuthContext.tsx        # Contexto com o usuário atual e estado de carregamento
├── services/
│   └── firebaseConfig.ts      # Configuração e inicialização do Firebase
├── app.json
├── tsconfig.json
├── LICENSE
└── package.json
```

A navegação usa **grupos de rotas** `(auth)` e `(app)`: cada grupo tem seu próprio layout, responsável por redirecionar o usuário automaticamente (via `<Redirect />`) caso ele tente acessar uma tela que não corresponde ao seu estado de autenticação.


## Instalação e execução

Pré-requisitos: Node.js 22+ e o app **Expo Go** instalado no celular (ou um emulador Android/iOS configurado).

```bash
# 1. Instalar as dependências
npm install

# 2. Rodar o projeto
npm start

# ou, para abrir diretamente em uma plataforma:
npm run android
npm run ios
```

Após o `npm start`, escaneie o QR Code com o app **Expo Go** (Android) ou pela câmera (iOS) para abrir o aplicativo no celular.

## Vídeo demonstração

<video src="./docs/demonstracao.mp4" controls="controls" width="50%">
</video>


## Link do repositório

[CP4 Mobile](https://github.com/Gustavo-Bosak/cp4-mobile)
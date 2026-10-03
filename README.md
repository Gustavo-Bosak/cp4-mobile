# CP5 Mobile - Controle de Gastos (Firebase Auth + Cloud Firestore)

**Curso:** Tecnologia em Desenvolvimento de Sistemas - 2TDS
**Componente Curricular:** Mobile Application Development
**Professor:** Fernando Pinéo

## Integrantes

| Nome   | RM |
| -------- | ------- |
| Gustavo Bosak | RM566315 |
| Felipe Ferrete | RM562999 |

## Tema do aplicativo

**Controle de gastos pessoais.** Após logar, o usuário cadastra, consulta, edita e exclui seus próprios registros de gastos, cada um com descrição, valor, categoria e data.

## Descrição do projeto

Aplicativo mobile desenvolvido em **React Native + TypeScript**, com navegação por **Expo Router** (roteamento baseado em arquivos), **Firebase Authentication** para login/cadastro e **Cloud Firestore** como banco de dados dos registros de gastos.

Este CP5 é uma evolução direta do app entregue no CheckPoint 4: toda a autenticação (cadastro, login, logout, recuperação de senha, exclusão de conta, persistência da sessão) continua funcionando exatamente como antes. A novidade é a camada de dados com o Firestore.

Funcionalidades implementadas:

**Autenticação (herdadas do CP4, sem alterações de comportamento)**
- Cadastro, login e logout com Firebase Authentication
- Persistência da sessão via AsyncStorage
- Recuperação de senha por e-mail
- Exclusão de conta, com confirmação
- Bloqueio de acesso às telas autenticadas por usuários não logados

**Cloud Firestore (novo no CP5)**
- Cadastro de um novo gasto (Create)
- Listagem dos gastos do usuário autenticado, em tempo real (Read)
- Edição de um gasto existente (Update)
- Exclusão de um gasto, com confirmação (Delete)
- Mensagem "Nenhum registro encontrado." quando a lista está vazia
- Cada usuário só enxerga e só consegue alterar os próprios registros

> [!IMPORTANT]
> Este projeto é um trabalho acadêmico simples e amador, sem preocupações avançadas de segurança, arquitetura ou testes automatizados — o foco é demonstrar corretamente os fluxos de autenticação e as operações CRUD no Firestore.

## Tecnologias utilizadas

- [React Native](https://reactnative.dev/) (Expo SDK 57 / React Native 0.86 / React 19.2)
- [Expo](https://expo.dev/) 57
- [TypeScript](https://www.typescriptlang.org/)
- [Expo Router](https://docs.expo.dev/router/introduction/) 57 (navegação por arquivos)
- [Firebase Authentication](https://firebase.google.com/docs/auth) (Firebase JS SDK 12)
- [Cloud Firestore](https://firebase.google.com/docs/firestore) (Firebase JS SDK 12)
- [AsyncStorage](https://github.com/react-native-async-storage/async-storage) (persistência local da sessão)

## Estrutura básica do Firestore

```
usuarios (coleção)
└── {uid}                      → um documento por usuário autenticado (id = uid do Firebase Auth)
    └── registros (subcoleção)
        ├── {registroId}       → { descricao, valor, categoria, data }
        ├── {registroId}
        └── ...
```

Cada gasto é salvo em `usuarios/{uid}/registros/{registroId}`, onde `{uid}` é o id do usuário autenticado no Firebase Authentication. Isso garante o relacionamento entre o usuário e seus dados: todas as consultas, edições e exclusões acontecem sempre dentro da subcoleção do próprio usuário logado.

As regras de segurança do Firestore (arquivo [`firestore.rules`](./firestore.rules) neste repositório) reforçam essa separação no servidor:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{userId}/registros/{registroId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

> Essas regras precisam ser coladas manualmente no **Firebase Console → Firestore Database → Regras** do seu projeto (ver seção de configuração abaixo).

## Estrutura do projeto (Expo Router)

```
CP5-Mobile/
├── app/
│   ├── _layout.tsx                # Layout raiz: provê o AuthContext para todo o app
│   ├── index.tsx                  # Rota inicial: redireciona conforme o estado de login
│   ├── (auth)/                    # Grupo de rotas da área NÃO autenticada
│   │   ├── _layout.tsx            # Redireciona para /(app)/home se já estiver logado
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── forgot-password.tsx
│   └── (app)/                     # Grupo de rotas da área autenticada
│       ├── _layout.tsx            # Redireciona para /(auth)/login se não estiver logado
│       ├── home.tsx               # Home + listagem dos gastos do usuário
│       ├── perfil.tsx             # Dados do usuário, logout e exclusão de conta
│       └── gasto/
│           ├── novo.tsx           # Cadastro de um novo gasto
│           └── [id].tsx           # Edição de um gasto existente
├── components/
│   └── GastoForm.tsx              # Formulário reutilizado entre "novo" e "editar"
├── context/
│   └── AuthContext.tsx            # Contexto com o usuário atual e estado de carregamento
├── services/
│   ├── firebaseConfig.ts          # Configuração e inicialização do Firebase (Auth + Firestore)
│   └── gastos.ts                  # Funções de CRUD do Firestore (create/read/update/delete)
├── app.json
├── tsconfig.json
├── LICENSE
└── package.json
```

A navegação usa **grupos de rotas** `(auth)` e `(app)`: cada grupo tem seu próprio layout, responsável por redirecionar o usuário automaticamente (via `<Redirect />`) caso ele tente acessar uma tela que não corresponde ao seu estado de autenticação.

As telas obrigatórias de "Home" e "Listagem dos registros" foram unificadas em uma só (`home.tsx`), já que o PDF do checkpoint permite reorganizar as telas livremente, a listagem de gastos É a tela inicial da área autenticada.

## Configuração do Firebase e do Firestore (obrigatório antes de rodar)

O projeto já está com as credenciais do projeto Firebase usado no CheckPoint 4/5 em `services/firebaseConfig.ts`. Se for rodar com seu próprio projeto Firebase:

1. No [Console do Firebase](https://console.firebase.google.com/), em **Build → Authentication → Sign-in method**, ative o provedor **E-mail/senha** (se ainda não estiver ativo).
2. Em **Build → Firestore Database**, clique em **Criar banco de dados** (modo produção).
3. Em **Firestore Database → Regras**, cole o conteúdo do arquivo [`firestore.rules`](./firestore.rules) e publique.
4. Em **Configurações do projeto → Geral → seus apps**, copie as credenciais do app Web e cole em `services/firebaseConfig.ts`.

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

## Fluxos para testar

1. Criar uma conta e fazer login
2. Cadastrar pelo menos 2 gastos
3. Conferir a listagem carregando os dados do Firestore
4. Editar um gasto e ver a lista atualizada
5. Excluir um gasto (com confirmação) e ver que ele some da lista
6. Fazer login com outro usuário e confirmar que os gastos do primeiro usuário não aparecem
7. Fechar e abrir o app novamente, confirmando que a sessão persiste
8. Fazer logout
9. Excluir a conta

## Vídeo demonstração

Pelo github, arquivo se encontra na pasta docs/

Por repositório local, visualize o player abaixo:

<video src="./docs/demonstracao.mp4" controls="controls" width="50%">
</video>

## Link do repositório

[CP5 Mobile](https://github.com/Gustavo-Bosak/cp4-mobile)

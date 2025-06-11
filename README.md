## Documentação: Sistema de Acompanhamento de Tarefas

O sistema de acompanhamento de tarefas foi desenvolvido para permitir que funcionários, supervisores e gerentes interajam com um sistema centralizado de gerenciamento de tarefas, cada um com suas permissões e funcionalidades específicas.

---

### 1. Equipe de Desenvolvimento

* **Carlos Cesar Passos** – 12724115774
* **Felipe Costa** – 12724120050
* **Jeferson Santos** – 12724124361
* **Lucas Santana** – 12724125417
* **Edgard** – 12724118869
* **Guilherme Alves** – 12724129198

---

### 2. Requisitos de Software

#### Ambiente de Execução

* **Node.js**: Versão 18.x ou superior
* **Gerenciador de Pacotes**: npm (versão 9.x ou superior) ou yarn

#### Linguagens de Programação

* **TypeScript**: Utilizado em todo o frontend para garantir tipagem estática e maior robustez do código
* **JavaScript**: Linguagem base para execução da aplicação no navegador e no Node.js

#### Tecnologias de Frontend

* **React (v18.2.0)**: Biblioteca para construção da interface de usuário baseada em componentes
* **Vite**: Ferramenta de build moderna e servidor de desenvolvimento
* **Tailwind CSS**: Framework CSS utility-first para estilização rápida e consistente
* **react-router-dom**: Gerenciamento de rotas entre páginas da aplicação

#### Backend e Banco de Dados

* **Supabase** (Backend as a Service - BaaS):

  * **Banco de Dados**: PostgreSQL, relacional e persistente
  * **Autenticação**: Cadastro, login e gerenciamento de sessões
  * **APIs**: Geradas automaticamente para acesso seguro ao banco

#### Navegador Web

* Qualquer navegador moderno com suporte a JavaScript (Chrome, Firefox, Safari, Edge)

---

### 3. Instruções para Instalação e Execução

#### Passo 1: Instalar o Node.js

* Acesse: [https://nodejs.org/](https://nodejs.org/)
* Baixe a versão LTS e instale com as opções padrão

#### Passo 2: Abrir o Terminal

* **Windows**: Pressione `Windows + R`, digite `cmd` e pressione Enter
* **macOS**: Acesse Aplicativos > Utilitários > Terminal, ou use `Command + Barra de espaço` e procure por "Terminal"
* **Linux**: Pressione `Ctrl + Alt + T` ou procure por "Terminal"

#### Passo 3: Navegar até a Pasta do Projeto

* No terminal, digite `cd ` e arraste a pasta do projeto para o terminal
* Pressione Enter
* Exemplo: `cd C:\Users\SeuUsuario\Downloads\projeto-loja-de-roupas-17`

#### Passo 4: Executar os Comandos

* Instalar dependências: `npm install`
* Iniciar o site: `npm run dev`

#### Passo 5: Acessar o Site

* Após iniciar com `npm run dev`, copie o endereço exibido (ex: `http://localhost:8080/`)
* Cole no navegador e pressione Enter
* O terminal deve permanecer aberto (use `Ctrl + C` para interromper o servidor)

#### Configuração Inicial do Banco de Dados (Supabase)

Usuários já cadastrados no sistema:

* **[gerente@loja.com](mailto:gerente@loja.com)** / Senha: 123456
* **[supervisor@loja.com](mailto:supervisor@loja.com)** / Senha: 123456
* **[funcionario1@loja.com](mailto:funcionario1@loja.com)** / Senha: 123456
* **[funcionario2@loja.com](mailto:funcionario2@loja.com)** / Senha: 123456
* **[funcionario3@loja.com](mailto:funcionario3@loja.com)** / Senha: 123456

---

### 4. Justificativa para a Abordagem de Comunicação Escolhida

A comunicação entre o frontend (React) e o backend (Supabase) utiliza a biblioteca `@supabase/supabase-js`, que age como cliente para a API gerada automaticamente.

#### Motivos da Escolha:

* **Produtividade e Abstração**:
  Permite focar na lógica de negócio utilizando métodos simples como `.from('tabela').select()` ou `.insert()`, abstraindo requisições HTTP manuais ou gerenciamento de conexões.

* **Segurança Integrada (Row Level Security)**:
  Regras de acesso definidas diretamente no PostgreSQL (ex: um funcionário só vê suas tarefas) são respeitadas automaticamente, evitando exposição indevida de dados.

* **Escalabilidade e Manutenção**:
  A API RESTful gerada pelo Supabase é reutilizável por outros clientes (ex: apps móveis), facilitando manutenção e expansão futura.

* **Funcionalidades em Tempo Real**:
  Suporte a *realtime subscriptions*, permitindo que o frontend escute atualizações no banco e reflita mudanças instantaneamente, sem a necessidade de infraestrutura adicional de WebSockets.


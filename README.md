# ParaBank - Automação de Testes

Projeto de automação de testes end-to-end para a aplicação ParaBank utilizando Playwright, TypeScript e Page Object Model (POM).

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Como Executar](#como-executar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Decisões Técnicas](#decisões-técnicas)
- [Suposições](#suposições)

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** versão 18 ou superior
- **npm** versão 9 ou superior
- **Git** para controle de versão

Para verificar as versões instaladas:

```bash
node --version
npm --version
git --version
```

## 📦 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/fm4nds/parabank-testes
cd parabank-testes
```

2. Instale as dependências:

```bash
npm install
```

3. Instale os navegadores do Playwright:

```bash
npx playwright install
```

## 🚀 Como Executar

### Executar todos os testes

```bash
npm test
```

ou

```bash
npx playwright test
```

### Executar testes em modo UI (Interface Gráfica)

Para executar os testes com interface gráfica interativa:

```bash
npx playwright test --ui
```

### Executar testes específicos

```bash
npx playwright test tests/cadastro.spec.ts
npx playwright test tests/login.spec.ts
npx playwright test tests/contas.spec.ts
npx playwright test tests/transferencias.spec.ts
```

### Visualizar relatório HTML

Após executar os testes, visualize o relatório:

```bash
npx playwright show-report
```

## 📁 Estrutura do Projeto

```
parabank-testes/
├── .github/
│   └── workflows/
│       └── playwright.yml          # GitHub Actions workflow
├── .husky/
│   └── pre-commit                  # Hook para formatação automática
├── pages/
│   ├── BasePage.ts                # Classe base com métodos comuns
│   ├── PaginaCadastro.ts          # Page Object - Cadastro
│   ├── PaginaLogin.ts             # Page Object - Login
│   ├── PaginaContas.ts            # Page Object - Contas
│   └── PaginaTransferencias.ts   # Page Object - Transferências
├── tests/
│   ├── cadastro.spec.ts           # Testes de cadastro (CT-01 a CT-05)
│   ├── login.spec.ts              # Testes de login (CT-01 a CT-04)
│   ├── contas.spec.ts             # Testes de contas (CT-01 a CT-03)
│   └── transferencias.spec.ts     # Testes de transferências (CT-01 a CT-03)
├── utils/
│   └── geradorDadosTeste.ts       # Geradores de dados com Faker
├── .prettierrc                    # Configuração do Prettier
├── .prettierignore                # Arquivos ignorados pelo Prettier
├── playwright.config.ts           # Configuração do Playwright
├── package.json                   # Dependências e scripts
└── README.md                      # Este arquivo
```

### Linguagem: TypeScript

**Decisão:** Uso de TypeScript em vez de JavaScript.

**Justificativa:**

- Type safety reduz erros em tempo de desenvolvimento
- Melhor autocomplete e IntelliSense
- Refatoração mais segura
- Código mais legível e manutenível

### Geração de Dados: Faker.js

**Decisão:** Utilização do Faker.js para geração de dados aleatórios.

**Justificativa:**

- Dados realistas e variados
- Evita hard code de valores fixos
- Facilita execução de múltiplos testes sem conflitos
- Dados sempre diferentes a cada execução

### Configuração de Retry

**Decisão:** Configuração de 3 tentativas antes de falhar (`retries: 3`).

**Justificativa:**

- Reduz falsos negativos por instabilidades de rede
- Melhora confiabilidade dos testes
- Aumenta taxa de sucesso em ambientes instáveis

### Base URL Centralizada

**Decisão:** Configuração de `baseURL` no `playwright.config.ts`.

**Justificativa:**

- Facilita mudança de ambiente (dev, staging, prod)
- Reduz duplicação de URLs nos testes
- Navegação mais simples usando caminhos relativos

### Estrutura de Locators

**Decisão:** Uso de objetos `Record<string, Locator>` para inputs e erros.

**Justificativa:**

- Criação dinâmica de locators reduz duplicação
- Facilita manutenção quando novos campos são adicionados
- Código mais limpo e escalável

### Classe Base (BasePage)

**Decisão:** Criação de uma classe base `BasePage` para métodos comuns a todas as páginas.

**Justificativa:**

- Elimina duplicação de código (ex: método `obterMensagem()`)
- Facilita manutenção e evolução do código
- Permite adicionar funcionalidades comuns em um único local
- Herança simples e clara entre classes de página

### Separação de Responsabilidades (Page Object Model)

**Decisão:** Pages contêm toda a lógica (ações, navegação, preenchimento, submissão e validações) e os testes contêm apenas asserções.

**Justificativa:**

- Separação clara: Pages com toda a lógica, testes apenas com expectativas
- Pages reutilizáveis e encapsuladas
- Testes extremamente simples e focados em asserções
- Facilita manutenção: toda a lógica centralizada nas páginas
- Código mais limpo e organizado seguindo Page Object Model puro

## 💡 Suposições

### Comportamento do Sistema

1. **Campo Phone Number:**
   - **Suposição:** O campo `phoneNumber` não exibe mensagem de erro quando vazio
   - **Ação:** Removido da validação de campos obrigatórios no CT-02
   - **Observação:** Possível bug do sistema documentado no código

2. **Campo Zip Code:**
   - **Suposição:** O sistema aceita qualquer valor no campo `zipCode`, sem validação de formato
   - **Ação:** CT-05 valida que o sistema aceita qualquer valor (válido ou inválido) sem exibir erro
   - **Observação:** Sistema não possui validação de formato de zip code, aceitando qualquer entrada

3. **Mensagens de Erro de Login:**
   - **Suposição:** Tanto senha incorreta quanto usuário inexistente retornam a mesma mensagem de erro
   - **Ação:** Validação unificada nos testes para ambos os casos

4. **Criação de Contas:**
   - **Suposição:** Usuário precisa estar logado para abrir novas contas. Não é necessário selecionar conta origem manualmente
   - **Ação:** Testes de contas incluem setup de cadastro no `beforeEach`. Apenas seleciona o tipo de conta (CHECKING ou SAVINGS)

5. **Transferências:**
   - **Suposição:** Usuário precisa estar logado para realizar transferências. O sistema seleciona automaticamente as contas disponíveis
   - **Ação:** Testes de transferências incluem setup de cadastro no `beforeEach`. Apenas preenche o valor e submete

### Dados de Teste

1. **Geração Aleatória:**
   - Todos os dados são gerados aleatoriamente usando Faker.js
   - Não há dados fixos ou hard coded nos testes
   - Cada execução utiliza dados diferentes

2. **Senhas:**
   - Senhas geradas com 10 caracteres
   - Senha e confirmação sempre iguais por padrão
   - Senhas diferentes geradas quando necessário para testes específicos

3. **Valores de Transferência:**
   - Valores gerados aleatoriamente entre $1.00 e $100.00
   - Formato decimal com 2 casas

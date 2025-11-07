# Desafio Varos

## ✨ Funcionalidades

### Gerenciamento de Usuários

- ✅ Listagem de usuários com tabela interativa
- ✅ Criação de novos usuários
- ✅ Edição de usuários existentes
- ✅ Filtro por consultor

### Tipos de Usuário

- **Consultores**: Podem ter múltiplos clientes associados
- **Clientes**: Podem estar vinculados a um consultor

### Validações e Formatações

- 📱 **Telefone**: Formato brasileiro `(00) 00000-0000`
- 📄 **CPF**: Formato `000.000.000-00` com validação
- 📍 **CEP**: Formato `00000-000` com autocomplete via ViaCEP
- 📧 **Email**: Validação de formato e unicidade
- 🎂 **Idade**: Validação de valores numéricos

## 🔧 Instalação

1. **Clone o repositório**

```bash
git clone git@github.com:Wedz0ff/desafio-varos.git
cd desafio-varos
```

2. **Instale as dependências**

```bash
pnpm i
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/desafio_varos?schema=public"
```

4. **Execute as migrations do banco de dados**

```bash
pnpm prisma migrate dev
```

5. **Popule o banco com dados de exemplo (opcional)**

```bash
pnpm prisma db seed
```

## 🚀 Executando o Projeto

### Modo Desenvolvimento

```bash
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### Build de Produção

```bash
pnpm build
pnpm start
```

## 🔑 Funcionalidades Técnicas

### Server Actions

Todas as operações de banco de dados utilizam Next.js Server Actions:

- `getUsers()` - Lista usuários com filtros opcionais
- `getUserById(id)` - Busca usuário específico
- `createUser(data)` - Cria novo usuário
- `updateUser(data)` - Atualiza usuário existente
- `deleteUser(id)` - Remove usuário
- `getConsultants()` - Lista apenas consultores
- `getClientsByConsultant(id)` - Lista clientes de um consultor

### Validações

- CPF e Email únicos no banco de dados
- Validação de consultor ao associar cliente
- Impedimento de deleção de consultor com clientes ativos
- Formatação em tempo real nos inputs

### Estado e Cache

- `revalidatePath("/")` após mutações
- State management com React hooks
- Otimização de re-renders com useMemo

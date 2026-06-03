# 📋 Documentação de Contexto do Projeto - Sistema de Pizzaria

## 📖 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Tecnologias e Versões](#tecnologias-e-versões)
4. [Estrutura de Pastas](#estrutura-de-pastas)
5. [Modelagem do Banco de Dados](#modelagem-do-banco-de-dados)
6. [Middlewares](#middlewares)
7. [Upload de Arquivos](#upload-de-arquivos)
8. [Validação com Schemas](#validação-com-schemas)
9. [Endpoints](#endpoints)
10. [Fluxo de Requisição](#fluxo-de-requisição)
11. [Configurações do Projeto](#configurações-do-projeto)

---

## 🎯 Visão Geral

Sistema backend de gerenciamento de pizzaria desenvolvido em Node.js com TypeScript, utilizando Express como framework web, Prisma ORM para comunicação com banco de dados PostgreSQL, e Zod para validação de dados.

---

## 🏗️ Arquitetura

O projeto segue o padrão **MVC + Service Layer**, com a seguinte estrutura:

```
Requisição HTTP → Rotas → Middlewares → Controller → Service → Banco de Dados → Service → Controller → Resposta HTTP
```

### Camadas da Arquitetura:

1. **Rotas (`routes.ts`)**: Define os endpoints e aplica os middlewares
2. **Middlewares**: Validação de schema, autenticação e autorização
3. **Controllers**: Recebem a requisição, extraem dados e delegam para o Service
4. **Services**: Contêm toda a lógica de negócio e comunicação com o banco de dados
5. **Prisma Client**: ORM que gerencia a comunicação com PostgreSQL

### Princípios Seguidos:

- **Separação de Responsabilidades**: Cada camada tem uma responsabilidade específica
- **Single Responsibility Principle**: Um controller/service para cada operação
- **Reutilização**: Middlewares compartilhados entre rotas
- **Validação Centralizada**: Schemas Zod validam dados antes de chegarem ao controller

---

## 🚀 Tecnologias e Versões

### Dependências de Produção

| Tecnologia         | Versão  | Finalidade                                          |
| ------------------ | ------- | --------------------------------------------------- |
| **express**        | ^5.1.0  | Framework web para criação de APIs REST             |
| **@prisma/client** | ^6.19.0 | ORM para comunicação com banco de dados             |
| **typescript**     | ^5.9.3  | Superset JavaScript com tipagem estática            |
| **zod**            | ^4.1.12 | Biblioteca de validação de schemas e tipagem        |
| **bcryptjs**       | ^3.0.3  | Criptografia de senhas                              |
| **jsonwebtoken**   | ^9.0.2  | Geração e validação de tokens JWT                   |
| **cors**           | ^2.8.5  | Middleware para habilitar CORS                      |
| **dotenv**         | ^17.2.3 | Carregamento de variáveis de ambiente               |
| **tsx**            | ^4.20.6 | Executor TypeScript para desenvolvimento            |
| **multer**         | ^2.0.2  | Middleware para upload de arquivos                  |
| **cloudinary**     | ^2.8.0  | Serviço de armazenamento e gerenciamento de imagens |

### Dependências de Desenvolvimento

| Tecnologia              | Versão   | Finalidade                    |
| ----------------------- | -------- | ----------------------------- |
| **@types/express**      | ^5.0.5   | Tipos TypeScript para Express |
| **@types/cors**         | ^2.8.19  | Tipos TypeScript para CORS    |
| **@types/jsonwebtoken** | ^9.0.10  | Tipos TypeScript para JWT     |
| **@types/multer**       | ^1.4.12  | Tipos TypeScript para Multer  |
| **@types/node**         | ^24.10.0 | Tipos TypeScript para Node.js |
| **prisma**              | ^6.19.0  | CLI do Prisma ORM             |

### Banco de Dados

- **PostgreSQL** (gerenciado via Prisma ORM)

---

## 📁 Estrutura de Pastas

```
backend/
├── prisma/
│   ├── migrations/           # Histórico de migrações do banco
│   │   └── 20251110200355_create_tables/
│   │       └── migration.sql
│   ├── migration_lock.toml   # Lock de migrações
│   └── schema.prisma         # Schema do banco de dados
├── src/
│   ├── @types/               # Definições de tipos TypeScript customizados
│   │   └── express/
│   │       └── index.d.ts    # Extensão de tipos do Express
│   ├── config/               # Configurações da aplicação
│   │   ├── cloudinary.ts     # Configuração do Cloudinary
│   │   └── multer.ts         # Configuração do Multer (upload)
│   ├── controllers/          # Controllers (recebem requisições)
│   │   ├── category/
│   │   │   ├── CreateCategoryController.ts
│   │   │   └── ListCategoryController.ts
│   │   ├── order/
│   │   │   ├── AddItemController.ts
│   │   │   ├── CreateOrderController.ts
│   │   │   ├── DeleteOrderController.ts
│   │   │   ├── DetailOrderController.ts
│   │   │   ├── FinishOrderController.ts
│   │   │   ├── ListOrdersController.ts
│   │   │   ├── RemoveItemController.ts
│   │   │   └── SendOrderController.ts
│   │   ├── product/
│   │   │   ├── CreateProductController.ts
│   │   │   ├── DeleteProductController.ts
│   │   │   ├── ListProductByCategoryController.ts
│   │   │   └── ListProductController.ts
│   │   └── user/
│   │       ├── AuthUserController.ts
│   │       ├── CreateUserController.ts
│   │       └── DetailUserController.ts
│   ├── generated/            # Código gerado pelo Prisma
│   │   └── prisma/
│   │       └── client.ts
│   ├── middlewares/          # Middlewares customizados
│   │   ├── isAdmin.ts        # Verifica se usuário é admin
│   │   ├── isAuthenticated.ts # Valida JWT token
│   │   └── validateSchema.ts  # Valida requisições com Zod
│   ├── prisma/               # Configuração do Prisma Client
│   │   └── index.ts
│   ├── schemas/              # Schemas de validação Zod
│   │   ├── categorySchema.ts
│   │   ├── orderSchema.ts
│   │   ├── productSchema.ts
│   │   └── userSchema.ts
│   ├── services/             # Services (lógica de negócio)
│   │   ├── category/
│   │   │   ├── CreateCategoryService.ts
│   │   │   └── ListCategoryService.ts
│   │   ├── order/
│   │   │   ├── AddItemOrderService.ts
│   │   │   ├── CreateOrderService.ts
│   │   │   ├── DeleteOrderService.ts
│   │   │   ├── DetailOrderService.ts
│   │   │   ├── FinishOrderService.ts
│   │   │   ├── ListOrderService.ts
│   │   │   ├── RemoveItemOrderService.ts
│   │   │   └── SendOrderService.ts
│   │   ├── product/
│   │   │   ├── CreateProductService.ts
│   │   │   ├── DeleteProductService.ts
│   │   │   ├── ListProductByCategoryService.ts
│   │   │   └── ListProductService.ts
│   │   └── user/
│   │       ├── AuthUserService.ts
│   │       ├── CreateUserService.ts
│   │       └── DetailUserService.ts
│   ├── routes.ts             # Definição de todas as rotas
│   └── server.ts             # Configuração e inicialização do servidor
├── .env                      # Variáveis de ambiente
├── CONTEXTO_PROJETO.md       # Documentação completa do contexto do projeto
├── endpoints.md              # Documentação detalhada de todos os endpoints
├── package.json              # Dependências e scripts
├── prisma.config.ts          # Configurações adicionais do Prisma
└── tsconfig.json             # Configurações do TypeScript

```

### Convenções de Nomenclatura:

- **Controllers**: `<Action><Entity>Controller.ts` (ex: `CreateUserController.ts`)
- **Services**: `<Action><Entity>Service.ts` (ex: `CreateUserService.ts`)
- **Schemas**: `<entity>Schema.ts` (ex: `userSchema.ts`)
- **Middlewares**: `<description>.ts` (ex: `isAuthenticated.ts`)

---

## 🗄️ Modelagem do Banco de Dados

### Diagrama de Relacionamentos

```
User (1)
  └─ role: STAFF | ADMIN

Category (1) ─────< (N) Product
                         │
                         └─< (N) Item >─┐
                                        │
Order (1) ─────────────────────────────┘
  └─ items: Item[]
```

### Entidades e Atributos

#### **User** (Usuários do Sistema)

```typescript
{
  id: string(UUID); // Identificador único
  name: string; // Nome completo
  email: string(unique); // Email (único)
  password: string; // Senha criptografada (bcrypt)
  role: Role; // STAFF ou ADMIN
  createdAt: DateTime; // Data de criação
  updatedAt: DateTime; // Data de atualização
}
```

**Enum Role:**

- `STAFF` - Funcionário padrão
- `ADMIN` - Administrador (acesso total)

#### **Category** (Categorias de Produtos)

```typescript
{
  id: string (UUID)          // Identificador único
  name: string               // Nome da categoria
  createdAt: DateTime        // Data de criação
  updatedAt: DateTime        // Data de atualização
  products: Product[]        // Produtos desta categoria
}
```

#### **Product** (Produtos/Pizzas)

```typescript
{
  id: string (UUID)          // Identificador único
  name: string               // Nome do produto
  price: number (int)        // Preço em centavos
  description: string        // Descrição do produto
  banner: string             // URL da imagem
  disabled: boolean          // Produto ativo/inativo
  category_id: string        // FK para Category
  category: Category         // Relação com categoria
  items: Item[]              // Itens de pedidos deste produto
  createdAt: DateTime        // Data de criação
  updatedAt: DateTime        // Data de atualização
}
```

**Observação sobre preço**: O preço é armazenado em **centavos** (inteiro) para evitar problemas com aritmética de ponto flutuante.

#### **Order** (Pedidos)

```typescript
{
  id: string (UUID)          // Identificador único
  table: number (int)        // Número da mesa
  status: boolean            // false = aberto, true = fechado
  draft: boolean             // true = rascunho, false = confirmado
  name: string?              // Nome opcional para o pedido
  items: Item[]              // Itens do pedido
  createdAt: DateTime        // Data de criação
  updatedAt: DateTime        // Data de atualização
}
```

#### **Item** (Itens dos Pedidos)

```typescript
{
  id: string(UUID); // Identificador único
  amount: number(int); // Quantidade
  order_id: string; // FK para Order
  order: Order; // Relação com pedido
  product_id: string; // FK para Product
  product: Product; // Relação com produto
  createdAt: DateTime; // Data de criação
  updatedAt: DateTime; // Data de atualização
}
```

### Regras de Deleção (Cascade)

- **Product** deletado → Deleta todos os **Items** relacionados
- **Order** deletado → Deleta todos os **Items** relacionados
- **Category** deletada → Deleta todos os **Products** relacionados

---

## 🛡️ Middlewares

### 1. **isAuthenticated** (`middlewares/isAuthenticated.ts`)

**Função**: Valida se o usuário está autenticado verificando o token JWT.

**Fluxo**:

1. Extrai o token do header `Authorization: Bearer <token>`
2. Verifica a validade do token usando `jsonwebtoken`
3. Extrai o `user_id` do payload do token
4. Adiciona `user_id` ao objeto `req` para uso nos próximos middlewares/controllers
5. Chama `next()` se válido, ou retorna erro 401 se inválido

**Uso**:

```typescript
router.get("/me", isAuthenticated, new DetailUserController().handle);
```

**Respostas de Erro**:

- `401`: Token não fornecido ou inválido

---

### 2. **isAdmin** (`middlewares/isAdmin.ts`)

**Função**: Verifica se o usuário autenticado tem permissão de ADMIN.

**Pré-requisito**: Deve ser usado **após** o middleware `isAuthenticated`.

**Fluxo**:

1. Obtém `user_id` do `req` (adicionado pelo `isAuthenticated`)
2. Busca o usuário no banco de dados
3. Verifica se o campo `role` é igual a `"ADMIN"`
4. Chama `next()` se for admin, ou retorna erro 401 se não for

**Uso**:

```typescript
router.post(
  "/category",
  isAuthenticated,
  isAdmin,
  new CreateCategoryController().handle
);
```

**Respostas de Erro**:

- `401`: Usuário sem permissão

---

### 3. **validateSchema** (`middlewares/validateSchema.ts`)

**Função**: Valida dados da requisição (body, query, params) usando schemas Zod.

**Fluxo**:

1. Recebe um schema Zod como parâmetro
2. Valida `req.body`, `req.query` e `req.params` contra o schema
3. Chama `next()` se válido
4. Retorna erro 400 com detalhes da validação se inválido

**Uso**:

```typescript
router.post(
  "/users",
  validateSchema(createUserSchema),
  new CreateUserController().handle
);
```

**Respostas de Erro**:

- `400`: Erro de validação com detalhes dos campos inválidos
- `500`: Erro interno do servidor

**Exemplo de resposta de erro**:

```json
{
  "error": "Erro validação",
  "details": [
    { "message": "O nome precisa ter no minimo 3 letras" },
    { "message": "Precisa ser um email valido" }
  ]
}
```

---

## 📤 Upload de Arquivos

### Configuração do Multer (`config/multer.ts`)

**Função**: Middleware para processar upload de arquivos (imagens de produtos).

**Configurações**:

- **Storage**: `memoryStorage()` - Mantém o arquivo em memória (buffer) ao invés de salvar no disco
- **Limite de tamanho**: 4MB por arquivo
- **Formatos aceitos**: JPEG, JPG, PNG

**Validação de Tipo**:

```typescript
const allowedMimes = ["image/jpeg", "image/jpg", "image/png"];
```

**Fluxo**:

1. Recebe o arquivo via `multipart/form-data`
2. Valida o tipo MIME do arquivo
3. Verifica o tamanho (máx 4MB)
4. Armazena o arquivo em memória como Buffer
5. Disponibiliza via `req.file.buffer`

**Uso nas Rotas**:

```typescript
router.post("/product", upload.single("file"), ...);
```

**Erros**:

- Formato inválido: "Formato de arquivo invalido, use apenas JPG, JPEG, PNG."
- Tamanho excedido: Retorna erro automaticamente se > 4MB

---

### Configuração do Cloudinary (`config/cloudinary.ts`)

**Função**: Serviço de armazenamento e CDN para imagens de produtos.

**Integração**:

- Recebe o buffer do arquivo do Multer
- Faz upload usando streaming (sem salvar no disco)
- Retorna URL pública da imagem hospedada

**Configuração de Upload**:

- **Pasta**: `products/` - Organiza imagens na pasta products do Cloudinary
- **Resource Type**: `image`
- **Public ID**: `{timestamp}-{nome-original}` - Nome único para evitar conflitos

**Fluxo no CreateProductService**:

1. Cria stream do buffer recebido
2. Faz pipe para o Cloudinary uploader
3. Aguarda resposta com `secure_url`
4. Salva a URL no campo `banner` do produto

**Observações**:

- Imagens ficam hospedadas permanentemente no Cloudinary
- URLs são otimizadas e servidas via CDN
- Suporta transformações de imagem (redimensionamento, corte, etc.)

---

## ✅ Validação com Schemas

Utilizamos **Zod** para validação de dados de entrada. Os schemas ficam organizados na pasta `src/schemas/`.

### User Schemas (`schemas/userSchema.ts`)

#### **createUserSchema**

Valida criação de novos usuários:

```typescript
{
  body: {
    name: string (min: 3 caracteres),
    email: email válido,
    password: string (min: 6 caracteres)
  }
}
```

**Mensagens de erro customizadas**:

- Nome inválido: "O nome precisa ter no minimo 3 letras"
- Email inválido: "Precisa ser um email valido"
- Senha inválida: "A senha deve ter no minimo 6 caracteres"

#### **authUserSchema**

Valida autenticação de usuários:

```typescript
{
  body: {
    email: email válido,
    password: string (obrigatório)
  }
}
```

### Category Schemas (`schemas/categorySchema.ts`)

#### **createCategorySchema**

Valida criação de categorias:

```typescript
{
  body: {
    name: string (min: 2 caracteres)
  }
}
```

**Mensagens de erro**:

- Nome inválido: "Nome da categoria precisa ter 2 caracteres"

---

### Product Schemas (`schemas/productSchema.ts`)

#### **createProductSchema**

Valida criação de produtos:

```typescript
{
  body: {
    name: string (min: 1 caractere),
    price: string (obrigatório, valor em centavos),
    description: string (min: 1 caractere),
    category_id: string (UUID da categoria)
  }
}
```

**Mensagens de erro**:

- Nome inválido: "O nome do produto é obrigatório"
- Preço inválido: "O valor do produto é obrigatório"
- Descrição inválida: "A descrição do produto é obrigatória"
- Categoria inválida: "A Categoria do produto é obrigatória"

**Observações**:

- O campo `price` é enviado como string e convertido para inteiro no controller
- Além dos campos do schema, a rota exige um arquivo de imagem via `multipart/form-data`

---

#### **listProductSchema**

Valida listagem de produtos com filtro:

```typescript
{
  query: {
    disabled: string(opcional);
  }
}
```

**Observações**:

- O query param `disabled` é opcional
- Aceita qualquer string, a conversão é feita no service

---

#### **listProductByCategorySchema**

Valida listagem de produtos por categoria:

```typescript
{
  query: {
    category_id: string(obrigatório);
  }
}
```

**Mensagens de erro**:

- ID inválido: "O ID da categoria é obrigatório"

**Observações**:

- Retorna apenas produtos ativos (`disabled: false`) da categoria especificada

---

### Order Schemas (`schemas/orderSchema.ts`)

#### **createOrderSchema**

Valida criação de pedidos:

```typescript
{
  body: {
    table: number (inteiro positivo),
    name: string (opcional)
  }
}
```

**Mensagens de erro**:

- Mesa inválida: "O número da mesa é obrigatório"
- Tipo inválido: "O número da mesa deve ser um número inteiro"
- Número inválido: "O número da mesa deve ser um número positivo"

---

#### **addItemSchema**

Valida adição de item ao pedido:

```typescript
{
  body: {
    order_id: string (min: 1 caractere),
    product_id: string (min: 1 caractere),
    amount: number (inteiro positivo)
  }
}
```

**Mensagens de erro**:

- Order inválida: "A order_id deve ser obrigatória"
- Produto inválido: "O id do produto deve ser obrigatório"
- Quantidade inválida: "Quantidade deve ser um numero positivo"

---

#### **removeItemSchema**

Valida remoção de item:

```typescript
{
  query: {
    item_id: string (min: 1 caractere)
  }
}
```

**Mensagens de erro**:

- Item inválido: "O item_id é obrigatório"

---

#### **detailOrderSchema**

Valida busca de detalhes do pedido:

```typescript
{
  query: {
    order_id: string (min: 1 caractere)
  }
}
```

**Mensagens de erro**:

- Order inválida: "O order_id é obrigatório"

---

#### **sendOrderSchema**

Valida envio/confirmação de pedido:

```typescript
{
  body: {
    order_id: string,
    name: string
  }
}
```

**Mensagens de erro**:

- ID inválido: "ID do pedido precisa ser uma string"
- Nome inválido: "O nome precisa ser um texto"

---

#### **finishOrderSchema**

Valida finalização de pedido:

```typescript
{
  body: {
    order_id: string;
  }
}
```

**Mensagens de erro**:

- ID inválido: "ID do pedido precisa ser uma string"

---

#### **deleteOrderSchema**

Valida deleção de pedido:

```typescript
{
  query: {
    order_id: string;
  }
}
```

**Mensagens de erro**:

- ID inválido: "ID do pedido precisa ser uma string"

---

## 🌐 Endpoints

> **📚 Documentação Detalhada**: Para informações completas sobre cada endpoint, incluindo exemplos de requisição/resposta, validações e códigos de erro, consulte o arquivo [`endpoints.md`](./endpoints.md).

### 📋 Resumo de Rotas

#### **Usuários**

| Método | Rota     | Autenticação | Permissão   | Descrição                     |
| ------ | -------- | ------------ | ----------- | ----------------------------- |
| POST   | /users   | ❌           | Pública     | Criar novo usuário            |
| POST   | /session | ❌           | Pública     | Autenticar usuário (login)    |
| GET    | /me      | ✅           | STAFF/ADMIN | Obter dados do usuário logado |

#### **Categorias**

| Método | Rota      | Autenticação | Permissão   | Descrição                  |
| ------ | --------- | ------------ | ----------- | -------------------------- |
| POST   | /category | ✅           | ADMIN       | Criar nova categoria       |
| GET    | /category | ✅           | STAFF/ADMIN | Listar todas as categorias |

#### **Produtos**

| Método | Rota              | Autenticação | Permissão   | Descrição                           |
| ------ | ----------------- | ------------ | ----------- | ----------------------------------- |
| POST   | /product          | ✅           | ADMIN       | Criar novo produto (com imagem)     |
| GET    | /products         | ✅           | STAFF/ADMIN | Listar produtos (filtro por status) |
| DELETE | /product          | ✅           | ADMIN       | Desativar produto (soft delete)     |
| GET    | /category/product | ✅           | STAFF/ADMIN | Listar produtos de uma categoria    |

#### **Pedidos (Orders)**

| Método | Rota          | Autenticação | Permissão   | Descrição                         |
| ------ | ------------- | ------------ | ----------- | --------------------------------- |
| POST   | /order        | ✅           | STAFF/ADMIN | Criar novo pedido                 |
| POST   | /order/add    | ✅           | STAFF/ADMIN | Adicionar item ao pedido          |
| DELETE | /order/remove | ✅           | STAFF/ADMIN | Remover item do pedido            |
| PUT    | /order/send   | ✅           | STAFF/ADMIN | Enviar pedido (confirmar)         |
| PUT    | /order/finish | ✅           | STAFF/ADMIN | Finalizar pedido                  |
| GET    | /orders       | ✅           | STAFF/ADMIN | Listar pedidos (filtro por draft) |
| GET    | /order/detail | ✅           | STAFF/ADMIN | Detalhes de um pedido específico  |
| DELETE | /order        | ✅           | STAFF/ADMIN | Deletar pedido                    |

---

### **Usuários**

#### **POST /users**

Cria um novo usuário no sistema.

**Middlewares**: `validateSchema(createUserSchema)`

**Body**:

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta de Sucesso (200)**:

```json
{
  "id": "uuid-gerado",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "createdAt": "2025-11-11T10:30:00.000Z"
}
```

**Observações**:

- Senha é criptografada com bcrypt (salt: 8)
- Role padrão é STAFF
- Senha não é retornada na resposta

---

#### **POST /session**

Autentica um usuário e retorna token JWT.

**Middlewares**: `validateSchema(authUserSchema)`

**Body**:

```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta de Sucesso (200)**:

```json
{
  "id": "uuid-do-usuario",
  "name": "João Silva",
  "email": "joao@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Observações**:

- Token JWT com expiração configurada em variável de ambiente
- Token contém o `user_id` no campo `sub`

---

#### **GET /me**

Retorna informações do usuário autenticado.

**Middlewares**: `isAuthenticated`

**Headers**:

```
Authorization: Bearer <token>
```

**Resposta de Sucesso (200)**:

```json
{
  "id": "uuid-do-usuario",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF"
}
```

---

### **Categorias**

#### **POST /category**

Cria uma nova categoria de produtos.

**Middlewares**: `isAuthenticated`, `isAdmin`, `validateSchema(createCategorySchema)`

**Permissão**: Apenas usuários com role ADMIN

**Headers**:

```
Authorization: Bearer <token>
```

**Body**:

```json
{
  "name": "Pizzas Doces"
}
```

**Resposta de Sucesso (201)**:

```json
{
  "id": "uuid-gerado",
  "name": "Pizzas Doces",
  "createdAt": "2025-11-11T10:30:00.000Z"
}
```

---

#### **GET /category**

Lista todas as categorias cadastradas.

**Middlewares**: `isAuthenticated`

**Permissão**: Usuários autenticados (STAFF ou ADMIN)

**Headers**:

```
Authorization: Bearer <token>
```

**Resposta de Sucesso (200)**:

```json
[
  {
    "id": "uuid-categoria-1",
    "name": "Pizzas Salgadas",
    "createdAt": "2025-11-11T10:30:00.000Z"
  },
  {
    "id": "uuid-categoria-2",
    "name": "Pizzas Doces",
    "createdAt": "2025-11-11T10:35:00.000Z"
  }
]
```

**Observações**:

- As categorias são retornadas ordenadas por data de criação (mais recentes primeiro)
- Retorna apenas os campos: `id`, `name` e `createdAt`

---

### **Produtos**

#### **POST /product**

Cria um novo produto com upload de imagem.

**Controller**: `CreateProductController`  
**Service**: `CreateProductService`  
**Middlewares**: `isAuthenticated`, `isAdmin`, `upload.single("file")`, `validateSchema(createProductSchema)`  
**Permissão**: Apenas ADMIN

**Body (FormData)**:

```
name: "Pizza Margherita"
price: "3500"  (valor em centavos - R$ 35,00)
description: "Molho de tomate, mussarela e manjericão"
category_id: "uuid-da-categoria"
file: [arquivo de imagem]
```

**Resposta de Sucesso (200)**:

```json
{
  "id": "uuid-gerado",
  "name": "Pizza Margherita",
  "price": 3500,
  "description": "Molho de tomate, mussarela e manjericão",
  "category_id": "uuid-da-categoria",
  "banner": "https://res.cloudinary.com/.../products/123456-image.jpg",
  "disabled": false,
  "createdAt": "2025-11-12T10:30:00.000Z"
}
```

**Observações**:

- Formatos de imagem aceitos: JPEG, JPG, PNG (máx 4MB)
- Imagem é enviada para o Cloudinary
- Valida se a categoria existe
- Produto é criado como ativo (`disabled: false`)

---

#### **GET /products**

Lista produtos com filtro de status.

**Controller**: `ListProductController`  
**Service**: `ListProductService`  
**Middlewares**: `isAuthenticated`, `validateSchema(listProductSchema)`  
**Permissão**: STAFF ou ADMIN

**Query Parameters**:

```
disabled: "true" | "false" (opcional, padrão: "false")
```

**Resposta de Sucesso (200)**:

```json
[
  {
    "id": "uuid-produto-1",
    "name": "Pizza Margherita",
    "price": 3500,
    "description": "Molho de tomate, mussarela e manjericão",
    "banner": "https://res.cloudinary.com/.../products/123-image.jpg",
    "disabled": false,
    "category_id": "uuid-da-categoria",
    "createdAt": "2025-11-12T10:30:00.000Z",
    "category": {
      "id": "uuid-da-categoria",
      "name": "Pizzas Salgadas"
    }
  }
]
```

**Observações**:

- Produtos ordenados por data de criação (mais recentes primeiro)
- Inclui dados da categoria relacionada

---

#### **DELETE /product**

Desativa um produto (soft delete).

**Controller**: `DeleteProductController`  
**Service**: `DeleteProductService`  
**Middlewares**: `isAuthenticated`, `isAdmin`  
**Permissão**: Apenas ADMIN

**Query Parameters**:

```
product_id: "uuid-do-produto"
```

**Resposta de Sucesso (200)**:

```json
{
  "message": "Produto deletado/arquivado com sucesso!"
}
```

**Observações**:

- Produto não é deletado, apenas `disabled` é alterado para `true`
- Mantém integridade referencial e histórico

---

#### **GET /category/product**

Lista produtos de uma categoria específica (apenas ativos).

**Controller**: `ListProductByCategoryController`  
**Service**: `ListProductByCategoryService`  
**Middlewares**: `isAuthenticated`, `validateSchema(listProductByCategorySchema)`  
**Permissão**: STAFF ou ADMIN

**Query Parameters**:

```
category_id: "uuid-da-categoria"
```

**Resposta de Sucesso (200)**:

```json
[
  {
    "id": "uuid-produto-1",
    "name": "Pizza Margherita",
    "price": 3500,
    "description": "Molho de tomate, mussarela e manjericão",
    "banner": "https://res.cloudinary.com/.../products/margherita.jpg",
    "disabled": false,
    "category_id": "uuid-da-categoria",
    "createdAt": "2025-11-12T10:30:00.000Z",
    "category": {
      "id": "uuid-da-categoria",
      "name": "Pizzas Salgadas"
    }
  }
]
```

**Observações**:

- Retorna apenas produtos ativos (`disabled: false`)
- Valida se a categoria existe

---

### **Pedidos (Orders)**

#### **POST /order**

Cria um novo pedido (inicialmente como rascunho).

**Controller**: `CreateOrderController`  
**Service**: `CreateOrderService`  
**Middlewares**: `isAuthenticated`, `validateSchema(createOrderSchema)`  
**Permissão**: STAFF ou ADMIN

**Body**:

```json
{
  "table": 5,
  "name": "Mesa do João"
}
```

**Resposta de Sucesso (201)**:

```json
{
  "id": "uuid-gerado",
  "table": 5,
  "status": false,
  "draft": true,
  "name": "Mesa do João",
  "createdAt": "2025-11-12T10:30:00.000Z"
}
```

**Observações**:

- Pedido criado como rascunho (`draft: true`)
- Status inicial `false` (não finalizado)
- Campo `name` é opcional

---

#### **POST /order/add**

Adiciona um produto a um pedido existente.

**Controller**: `AddItemController`  
**Service**: `AddItemOrderService`  
**Middlewares**: `isAuthenticated`, `validateSchema(addItemSchema)`  
**Permissão**: STAFF ou ADMIN

**Body**:

```json
{
  "order_id": "uuid-do-pedido",
  "product_id": "uuid-do-produto",
  "amount": 2
}
```

**Resposta de Sucesso (201)**:

```json
{
  "id": "uuid-item-gerado",
  "amount": 2,
  "order_id": "uuid-do-pedido",
  "product_id": "uuid-do-produto",
  "createdAt": "2025-11-12T10:35:00.000Z",
  "product": {
    "id": "uuid-do-produto",
    "name": "Pizza Margherita",
    "price": 3500,
    "description": "Molho de tomate, mussarela e manjericão",
    "banner": "https://res.cloudinary.com/.../products/margherita.jpg"
  }
}
```

**Observações**:

- Valida se o pedido existe
- Valida se o produto existe e está ativo
- Retorna dados do item com informações do produto

---

#### **DELETE /order/remove**

Remove um item específico de um pedido.

**Controller**: `RemoveItemController`  
**Service**: `RemoveItemOrderService`  
**Middlewares**: `isAuthenticated`, `validateSchema(removeItemSchema)`  
**Permissão**: STAFF ou ADMIN

**Query Parameters**:

```
item_id: "uuid-do-item"
```

**Resposta de Sucesso (200)**:

```json
{
  "message": "Item removido com sucesso"
}
```

**Observações**:

- Deleta permanentemente o item do banco
- Não afeta o pedido principal

---

#### **PUT /order/send**

Envia o pedido para a cozinha (sai do modo rascunho).

**Controller**: `SendOrderController`  
**Service**: `SendOrderService`  
**Middlewares**: `isAuthenticated`, `validateSchema(sendOrderSchema)`  
**Permissão**: STAFF ou ADMIN

**Body**:

```json
{
  "order_id": "uuid-do-pedido",
  "name": "Mesa 5 - João"
}
```

**Resposta de Sucesso (200)**:

```json
{
  "id": "uuid-do-pedido",
  "table": 5,
  "name": "Mesa 5 - João",
  "draft": false,
  "status": false,
  "createdAt": "2025-11-12T10:30:00.000Z"
}
```

**Observações**:

- Altera `draft` de `true` para `false`
- Atualiza o campo `name` do pedido
- Pedido passa a ser visível na cozinha

---

#### **PUT /order/finish**

Marca um pedido como finalizado.

**Controller**: `FinishOrderController`  
**Service**: `FinishOrderService`  
**Middlewares**: `isAuthenticated`, `validateSchema(finishOrderSchema)`  
**Permissão**: STAFF ou ADMIN

**Body**:

```json
{
  "order_id": "uuid-do-pedido"
}
```

**Resposta de Sucesso (200)**:

```json
{
  "id": "uuid-do-pedido",
  "table": 5,
  "name": "Mesa 5 - João",
  "draft": false,
  "status": true,
  "createdAt": "2025-11-12T10:30:00.000Z"
}
```

**Observações**:

- Altera `status` de `false` para `true`
- Indica que o pedido foi entregue/finalizado

---

#### **GET /orders**

Lista pedidos com filtro de rascunho.

**Controller**: `ListOrdersController`  
**Service**: `ListOrderService`  
**Middlewares**: `isAuthenticated`  
**Permissão**: STAFF ou ADMIN

**Query Parameters**:

```
draft: "true" | "false" (opcional, padrão: "false")
```

**Resposta de Sucesso (200)**:

```json
[
  {
    "id": "uuid-pedido-1",
    "table": 5,
    "name": "Mesa 5 - João",
    "draft": false,
    "status": false,
    "createdAt": "2025-11-12T10:30:00.000Z",
    "items": [
      {
        "id": "uuid-item-1",
        "amount": 2,
        "product": {
          "id": "uuid-produto-1",
          "name": "Pizza Margherita",
          "price": 3500,
          "description": "Molho de tomate, mussarela e manjericão",
          "banner": "https://res.cloudinary.com/.../products/margherita.jpg"
        }
      }
    ]
  }
]
```

**Observações**:

- Inclui todos os itens de cada pedido com detalhes dos produtos
- Útil para visualizar pedidos na cozinha ou rascunhos

---

#### **GET /order/detail**

Busca informações completas de um pedido específico.

**Controller**: `DetailOrderController`  
**Service**: `DetailOrderService`  
**Middlewares**: `isAuthenticated`, `validateSchema(detailOrderSchema)`  
**Permissão**: STAFF ou ADMIN

**Query Parameters**:

```
order_id: "uuid-do-pedido"
```

**Resposta de Sucesso (200)**:

```json
{
  "id": "uuid-do-pedido",
  "table": 5,
  "name": "Mesa 5 - João",
  "draft": false,
  "status": false,
  "createdAt": "2025-11-12T10:30:00.000Z",
  "updatedAt": "2025-11-12T10:35:00.000Z",
  "items": [
    {
      "id": "uuid-item-1",
      "amount": 2,
      "createdAt": "2025-11-12T10:35:00.000Z",
      "product": {
        "id": "uuid-produto-1",
        "name": "Pizza Margherita",
        "price": 3500,
        "description": "Molho de tomate, mussarela e manjericão",
        "banner": "https://res.cloudinary.com/.../products/margherita.jpg"
      }
    }
  ]
}
```

**Observações**:

- Retorna informações completas incluindo timestamps
- Inclui todos os itens com detalhes dos produtos

---

#### **DELETE /order**

Deleta permanentemente um pedido e todos seus itens.

**Controller**: `DeleteOrderController`  
**Service**: `DeleteOrderService`  
**Middlewares**: `isAuthenticated`, `validateSchema(deleteOrderSchema)`  
**Permissão**: STAFF ou ADMIN

**Query Parameters**:

```
order_id: "uuid-do-pedido"
```

**Resposta de Sucesso (200)**:

```json
{
  "message": "Pedido deletado com sucesso!"
}
```

**Observações**:

- Deleta permanentemente o pedido
- Todos os itens são deletados automaticamente (cascade)
- Operação não pode ser revertida

---

## 🔄 Fluxo de Requisição

### Exemplo Completo: Criação de Usuário

```
1. POST /users
   ↓
2. Middleware: validateSchema(createUserSchema)
   - Valida name, email, password
   - Se inválido → 400 com erros
   ↓
3. CreateUserController.handle()
   - Extrai dados do req.body
   - Instancia CreateUserService
   - Chama service.execute()
   ↓
4. CreateUserService.execute()
   - Verifica se email já existe
   - Se existe → throw Error("Usuário já existente!")
   - Criptografa senha com bcrypt
   - Cria usuário no banco via Prisma
   - Retorna dados do usuário (sem senha)
   ↓
5. CreateUserController.handle()
   - Recebe dados do service
   - Retorna res.json(user)
   ↓
6. Resposta HTTP 200 com dados do usuário
```

### Fluxo com Autenticação e Autorização

```
1. POST /category
   ↓
2. Middleware: isAuthenticated
   - Valida token JWT
   - Adiciona user_id ao req
   - Se inválido → 401
   ↓
3. Middleware: isAdmin
   - Busca usuário no banco
   - Verifica role === "ADMIN"
   - Se não for admin → 401
   ↓
4. Middleware: validateSchema(createCategorySchema)
   - Valida dados
   - Se inválido → 400
   ↓
5. CreateCategoryController → CreateCategoryService
   - Lógica de negócio
   - Criação no banco
   ↓
6. Resposta HTTP 201
```

---

### Fluxo com Upload de Arquivo (Produto)

```
1. POST /product (multipart/form-data)
   ↓
2. Middleware: isAuthenticated
   - Valida token JWT
   - Se inválido → 401
   ↓
3. Middleware: isAdmin
   - Verifica role === "ADMIN"
   - Se não for admin → 401
   ↓
4. Middleware: upload.single("file")
   - Processa upload do arquivo
   - Valida formato (JPEG, JPG, PNG)
   - Valida tamanho (máx 4MB)
   - Armazena em memória (buffer)
   - Adiciona arquivo em req.file
   - Se inválido → 400
   ↓
5. Middleware: validateSchema(createProductSchema)
   - Valida name, price, description, category_id
   - Se inválido → 400
   ↓
6. CreateProductController.handle()
   - Extrai dados do req.body
   - Verifica se req.file existe
   - Se não existe → throw Error("A imagem do produto é obrigatória")
   - Instancia CreateProductService
   ↓
7. CreateProductService.execute()
   - Verifica se categoria existe
   - Se não existe → throw Error("Categoria não encontrada!")
   - Cria stream do buffer da imagem
   - Faz upload para Cloudinary
   - Recebe URL da imagem
   - Cria produto no banco com URL da imagem
   - Retorna dados do produto
   ↓
8. CreateProductController.handle()
   - Retorna res.json(product)
   ↓
9. Resposta HTTP 200 com dados do produto
```

---

### Fluxo de Listagem com Query Params (Produtos)

```
1. GET /products?disabled=false
   ↓
2. Middleware: isAuthenticated
   - Valida token JWT
   - Se inválido → 401
   ↓
3. Middleware: validateSchema(listProductSchema)
   - Valida query param 'disabled'
   - Se não enviado → usa padrão "false"
   - Se inválido (valor diferente de "true"/"false") → 400
   - Converte string para boolean
   - Adiciona ao req.query
   ↓
4. ListProductController.handle()
   - Extrai 'disabled' do req.query
   - Se undefined → usa false como padrão
   - Instancia ListProductService
   ↓
5. ListProductService.execute()
   - Busca produtos no banco com where: { disabled }
   - Ordena por createdAt desc (mais recentes primeiro)
   - Inclui dados da categoria relacionada
   - Retorna array de produtos
   ↓
6. ListProductController.handle()
   - Retorna res.status(200).json(products)
   ↓
7. Resposta HTTP 200 com array de produtos
```

---

## ⚙️ Configurações do Projeto

### TypeScript (`tsconfig.json`)

**Configurações Principais**:

- **Target**: ES2020
- **Module**: CommonJS (compatível com Node.js)
- **Strict Mode**: Ativado (todas verificações rigorosas)
- **Output**: `./dist`
- **Root**: `./src`
- **Source Maps**: Habilitado

**Verificações Estritas Ativas**:

- `noImplicitAny`: Proíbe tipos `any` implícitos
- `strictNullChecks`: Tratamento rigoroso de null/undefined
- `noUnusedLocals`: Erro para variáveis não usadas
- `noUnusedParameters`: Erro para parâmetros não usados
- `noImplicitReturns`: Todos os caminhos devem retornar valor

---

### Prisma (`prisma/schema.prisma`)

**Generator**:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
```

Cliente Prisma é gerado em `src/generated/prisma/`.

**Datasource**:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Convenções**:

- Nomes de models em PascalCase (ex: `User`)
- Nomes de tabelas em snake_case (ex: `users`)
- IDs: UUID gerado automaticamente
- Timestamps automáticos: `createdAt`, `updatedAt`

---

### Express Server (`server.ts`)

**Middlewares Globais**:

1. `express.json()` - Parse de requisições JSON
2. `cors()` - Habilita CORS para todas as origens
3. `router` - Rotas da aplicação

**Error Handler Global**:

```typescript
app.use((error: Error, _, res: Response, next: NextFunction) => {
  if (error instanceof Error) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(500).json({ error: "Internal server error!" });
});
```

**Porta**:

- Padrão: `3333`
- Configurável via variável de ambiente `PORT`

---

### Variáveis de Ambiente (`.env`)

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pizzaria?schema=public"

# JWT
JWT_SECRET="sua-chave-secreta-aqui"

# Server
PORT=3333

# Cloudinary (Upload de Imagens)
CLOUDINARY_CLOUD_NAME="seu-cloud-name"
CLOUDINARY_API_KEY="sua-api-key"
CLOUDINARY_API_SECRET="seu-api-secret"
```

**Variáveis Obrigatórias**:

- `DATABASE_URL`: String de conexão PostgreSQL
- `JWT_SECRET`: Chave secreta para assinar tokens JWT
- `CLOUDINARY_CLOUD_NAME`: Nome da sua conta no Cloudinary
- `CLOUDINARY_API_KEY`: Chave de API do Cloudinary
- `CLOUDINARY_API_SECRET`: Chave secreta de API do Cloudinary

**Como obter credenciais do Cloudinary**:

1. Criar conta em [cloudinary.com](https://cloudinary.com)
2. Acessar Dashboard
3. Copiar credenciais: Cloud Name, API Key e API Secret
4. Adicionar no arquivo `.env`

---

### Scripts NPM (`package.json`)

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts"
  }
}
```

**Comando de Desenvolvimento**:

```bash
npm run dev
```

- Executa servidor com hot-reload
- Usa `tsx` para executar TypeScript diretamente

**Comandos Prisma**:

```bash
# Criar migração
npx prisma migrate dev --name nome_da_migracao

# Aplicar migrações
npx prisma migrate deploy

# Abrir Prisma Studio
npx prisma studio

# Gerar Prisma Client
npx prisma generate
```

---

## 🔐 Segurança

### Autenticação

- **JWT (JSON Web Tokens)** para autenticação stateless
- Tokens devem ser enviados no header: `Authorization: Bearer <token>`
- Token contém `user_id` no campo `sub`

### Autorização

- Sistema de roles: `STAFF` e `ADMIN`
- Rotas protegidas por middlewares `isAuthenticated` e `isAdmin`

### Criptografia

- **bcryptjs** com salt de 8 rounds para senhas
- Senhas nunca são retornadas nas respostas da API

### Validação

- **Zod** valida todos os inputs antes de chegarem à lógica de negócio
- Mensagens de erro customizadas e amigáveis

---

## 📝 Observações Importantes

1. **Preços em Centavos**: Todos os preços são armazenados como inteiros em centavos para evitar problemas com ponto flutuante.

2. **UUIDs**: Todos os IDs são UUIDs v4 gerados automaticamente pelo Prisma.

3. **Timestamps Automáticos**: `createdAt` e `updatedAt` são gerenciados automaticamente pelo Prisma.

4. **Cascade Delete**: Deleções em cascata estão configuradas para manter integridade referencial.

5. **Error Handling**: Todos os erros são capturados pelo error handler global do Express.

6. **Type Safety**: TypeScript configurado no modo strict garante segurança de tipos em todo o código.

7. **Prisma Client Customizado**: Cliente gerado em `src/generated/prisma` para melhor organização.

8. **Upload de Imagens**: Sistema utiliza Multer para processar uploads e Cloudinary para armazenamento permanente. Imagens não são salvas no servidor local.

9. **Memory Storage**: Multer configurado com `memoryStorage()` para processar arquivos em memória, otimizando o upload direto para Cloudinary.

10. **Validação de Tipos de Arquivo**: Sistema aceita apenas imagens JPEG, JPG e PNG com tamanho máximo de 4MB.

---

## 🚀 Como Iniciar o Projeto

1. **Instalar dependências**:

```bash
npm install
```

2. **Configurar variáveis de ambiente**:

```bash
cp .env.example .env
# Editar .env com suas configurações
```

**Variáveis obrigatórias no `.env`**:

- `DATABASE_URL` - Conexão com PostgreSQL
- `JWT_SECRET` - Chave secreta JWT
- `CLOUDINARY_CLOUD_NAME` - Nome da conta Cloudinary
- `CLOUDINARY_API_KEY` - API Key do Cloudinary
- `CLOUDINARY_API_SECRET` - API Secret do Cloudinary

3. **Configurar Cloudinary**:

- Criar conta gratuita em [cloudinary.com](https://cloudinary.com)
- Copiar credenciais do Dashboard
- Adicionar credenciais no arquivo `.env`

4. **Executar migrações**:

```bash
npx prisma migrate dev
```

5. **Iniciar servidor**:

```bash
npm run dev
```

6. **Servidor rodando em**: `http://localhost:3333`

---

## 📊 Resumo de Controllers e Services

### **Controllers Implementados**

#### User

- `CreateUserController` - Cria novo usuário
- `AuthUserController` - Autentica usuário (login)
- `DetailUserController` - Retorna dados do usuário logado

#### Category

- `CreateCategoryController` - Cria nova categoria
- `ListCategoryController` - Lista todas as categorias

#### Product

- `CreateProductController` - Cria produto com upload de imagem
- `ListProductController` - Lista produtos com filtro de status
- `DeleteProductController` - Desativa produto (soft delete)
- `ListProductByCategoryController` - Lista produtos de uma categoria

#### Order

- `CreateOrderController` - Cria novo pedido
- `AddItemController` - Adiciona item ao pedido
- `RemoveItemController` - Remove item do pedido
- `SendOrderController` - Envia pedido para cozinha
- `FinishOrderController` - Finaliza pedido
- `ListOrdersController` - Lista pedidos com filtro
- `DetailOrderController` - Detalhes de um pedido
- `DeleteOrderController` - Deleta pedido permanentemente

### **Services Implementados**

#### User

- `CreateUserService` - Lógica de criação de usuário
- `AuthUserService` - Lógica de autenticação
- `DetailUserService` - Lógica de detalhes do usuário

#### Category

- `CreateCategoryService` - Lógica de criação de categoria
- `ListCategoryService` - Lógica de listagem de categorias

#### Product

- `CreateProductService` - Lógica de criação com upload Cloudinary
- `ListProductService` - Lógica de listagem com filtro
- `DeleteProductService` - Lógica de soft delete
- `ListProductByCategoryService` - Lógica de listagem por categoria

#### Order

- `CreateOrderService` - Lógica de criação de pedido
- `AddItemOrderService` - Lógica de adição de item
- `RemoveItemOrderService` - Lógica de remoção de item
- `SendOrderService` - Lógica de envio do pedido
- `FinishOrderService` - Lógica de finalização
- `ListOrderService` - Lógica de listagem com filtro
- `DetailOrderService` - Lógica de detalhes do pedido
- `DeleteOrderService` - Lógica de deleção permanente

---

## 📚 Documentação Adicional

Para informações detalhadas sobre cada endpoint, incluindo:

- Exemplos completos de requisição e resposta
- Todos os códigos de erro possíveis
- Validações específicas de cada campo
- Casos de uso e observações importantes

Consulte o arquivo **[`endpoints.md`](./endpoints.md)**.

---

**Documento atualizado em**: 12/11/2025  
**Versão do Projeto**: 2.0.0  
**Última atualização**: Sistema completo com todas as funcionalidades de gerenciamento de pedidos (Orders) implementadas

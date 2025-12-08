# Configuração do Banco de Dados - PI Cardápio QRCode

## Pré-requisitos
- MySQL instalado (versão 5.7 ou superior)
- Node.js instalado
- Dependências do projeto instaladas (`npm install`)

## Passos para Configuração

### 1. Criar o Banco de Dados

Abra o MySQL Workbench ou linha de comando do MySQL e execute:

```bash
mysql -u root -p
```

Digite a senha: `senac` (conforme configurado no projeto)

### 2. Executar o Script SQL Principal

Execute o arquivo `pi_cardapio.sql` que está na raiz do projeto:

```sql
source c:/Users/Joao55412596/Documents/GitHub/PI-Cardapio-QRCode/pi_cardapio.sql
```

Ou copie e cole o conteúdo do arquivo diretamente no MySQL.

### 3. Inserir Produtos de Exemplo

Execute o arquivo `insert_produtos.sql` para adicionar produtos ao cardápio:

```sql
source insert_produtos.sql
```

Isso adicionará:
- 5 hambúrgueres
- 6 bebidas
- 5 acompanhamentos
- 4 sobremesas
- 4 combos

### 4. Verificar a Conexão

O arquivo `config/db.js` está configurado com:
- **Host**: localhost
- **Porta**: 3307
- **Usuário**: root
- **Senha**: senac
- **Banco de dados**: pi_cardapio

Se suas configurações forem diferentes, edite o arquivo `config/db.js`.

### 5. Iniciar o Servidor

No terminal, execute:

```bash
node server.js
```

Você deve ver a mensagem:
```
MySQL conectado com sucesso!
Servidor rodando em http://localhost:3000
```

### 6. Testar as Rotas da API

#### Listar todos os produtos do cardápio:
```
GET http://localhost:3000/produtos
```

#### Buscar um produto específico:
```
GET http://localhost:3000/produtos/:id
```

#### Adicionar novo produto:
```
POST http://localhost:3000/produtos
Content-Type: application/json

{
  "nome": "X-Salada Premium",
  "categoria": "burgers",
  "preco": 24.90,
  "descricao": "Hambúrguer com alface, tomate e queijo premium",
  "imagem": "",
  "disponivel": true,
  "destaque": false,
  "quantidade": 30
}
```

#### Atualizar produto:
```
PUT http://localhost:3000/produtos/:id
Content-Type: application/json

{
  "nome": "X-Salada Premium Atualizado",
  "categoria": "burgers",
  "preco": 26.90,
  "descricao": "Hambúrguer gourmet com alface, tomate e queijo premium",
  "imagem": "",
  "disponivel": true,
  "destaque": true,
  "quantidade": 25
}
```

#### Alterar disponibilidade:
```
PATCH http://localhost:3000/produtos/:id/disponibilidade
Content-Type: application/json

{
  "disponivel": false
}
```

#### Excluir produto:
```
DELETE http://localhost:3000/produtos/:id
```

### 7. Usar a Interface Web

1. Inicie o servidor: `node server.js`
2. Abra o arquivo `gerenciarCardapio.html` no navegador
3. A interface se conectará automaticamente à API

## Estrutura das Tabelas

### Produtos
- `ID` - INT (PK, AUTO_INCREMENT)
- `Nome` - VARCHAR(100)
- `Descricao` - TEXT
- `Quantidade` - INT (estoque)
- `Preco_Unitario` - DECIMAL(10, 2)
- `Categoria` - ENUM('burgers', 'bebida', 'acompanhamento', 'sobremesa', 'Combo')
- `imagem` - VARCHAR(500)
- `disponivel` - BOOLEAN
- `destaque` - BOOLEAN

### Clientes
- `ID` - INT (PK, AUTO_INCREMENT)
- `Nome` - VARCHAR(100)
- `CPF` - VARCHAR(14) (UNIQUE)
- `Telefone` - VARCHAR(20)
- `Email` - VARCHAR(100) (UNIQUE)
- `Senha` - VARCHAR(255)

### Funcionarios
- `ID` - INT (PK, AUTO_INCREMENT)
- `Nome` - VARCHAR(100)
- `CPF` - VARCHAR(14) (UNIQUE)
- `Telefone` - VARCHAR(20)
- `Email` - VARCHAR(100) (UNIQUE)
- `Cargo` - VARCHAR(50)
- `Senha` - VARCHAR(255)

### Pedidos
- `ID` - INT (PK, AUTO_INCREMENT)
- `ID_Cliente` - INT (FK)
- `ID_Funcionario` - INT (FK)
- `Forma_Pagamento` - VARCHAR(50)
- `Status` - ENUM('novo', 'preparo', 'enviado', 'entregue', 'cancelado')
- `Valor` - DECIMAL(10, 2)
- `Horario_Pedido` - DATETIME

### Itens_Pedidos
- `ID_Pedido` - INT (FK, PK)
- `ID_Produto` - INT (FK, PK)
- `Quantidade` - INT
- `Preco_Venda` - DECIMAL(10, 2)

### Financeiro
- `ID` - INT (PK, AUTO_INCREMENT)
- `ID_Pedido` - INT (FK)
- `Forma_Pagamento` - VARCHAR(50)
- `Valor` - DECIMAL(10, 2)
- `Data` - DATE

## Solução de Problemas

### Erro de conexão com o banco
- Verifique se o MySQL está rodando
- Confirme as credenciais em `config/db.js`
- Verifique se a porta 3307 está correta

### Erro CORS
- O servidor já está configurado com CORS habilitado
- Certifique-se de que o servidor está rodando na porta 3000

### Tabela não existe
- Execute o script `pi_cardapio.sql` novamente
- Verifique se está usando o banco correto: `USE pi_cardapio;`

### Produtos não aparecem
- Execute o script `insert_produtos.sql` para adicionar produtos de exemplo
- Verifique se a API está retornando dados: acesse http://localhost:3000/produtos

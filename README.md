# BurguerPI - Cardápio Digital & Gestão QR Code 🍔🚀

![BurguerPI Banner](https://img.shields.io/badge/BurguerPI-Premium-orange?style=for-the-badge&logo=fastapi)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)

O **BurguerPI** é uma solução completa de cardápio digital e sistema de gestão para hamburguerias e restaurantes. Projetado para otimizar o atendimento via QR Code, o sistema permite que clientes façam pedidos de forma autônoma, enquanto oferece aos gestores um controle total sobre a operação, desde a cozinha até o financeiro.

---

## 🌟 Funcionalidades Principais

### 🔹 Para Clientes
- 📱 **Acesso via QR Code**: Cardápio acessível diretamente pelo smartphone.
- 🛍️ **Carrinho Inteligente**: Adição de itens, visualização de subtotal e personalização.
- 🚚 **Opções de Entrega/Retirada**: Flexibilidade no fechamento do pedido.

### 🔹 Para a Operação (Dashboard)
- 📋 **Gestão de Pedidos**: Painel em tempo real para controle de status (Novo, Preparo, Rota, Concluído).
- 🖨️ **Impressão de Comandas**: Geração de PDF automatizada para a cozinha.
- 🔄 **Filtros Avançados**: Busca por cliente, status ou data.

### 🔹 Para Gestores (Admin)
- 🍔 **Gerenciar Cardápio**: Cadastro de produtos, categorias, fotos e destaques.
- 💰 **Módulo Financeiro**: Controle de caixa, entradas de pedidos e despesas manuais.
- 👥 **Gestão de Equipe**: Controle de acesso de funcionários e administradores.

---

## 🛠️ Tecnologias Utilizadas

- **Servidor:** [Node.js](https://nodejs.org/) com [Express.js](https://expressjs.com/)
- **Banco de Dados:** [MySQL](https://www.mysql.com/)
- **Autenticação:** [JWT (JSON Web Tokens)](https://jwt.io/) & [Bcrypt](https://github.com/kelektiv/node-bcrypt.js)
- **Interface:** HTML5, CSS3 Moderna, [Bootstrap 5](https://getbootstrap.com/) & JavaScript Puro.
- **Utilitários:** [jsPDF](https://github.com/parallax/jsPDF) para comandas, [FontAwesome](https://fontawesome.com/) para ícones.

---

## 📂 Estrutura do Projeto

```text
/
├── pi_cardapio.sql           # Schema do banco de dados
├── PopularOBanco.sql        # Dados iniciais/testes
└── pi Modelo Hamburgueria/  # Diretório principal do APP
    ├── server.js            # Servidor e rotas da API
    ├── package.json         # Dependências do projeto
    ├── /public              # Arquivos estáticos (HTML, CSS, JS público)
    ├── /views               # Páginas protegidas e administrativas
    └── /middlewares         # Lógica de autenticação e permissões
```

---

## 🚀 Como Executar o Projeto

### 1. Pré-requisitos
Certifique-se de ter instalado:
- Node.js (versão 16 ou superior)
- MySQL Server

### 2. Configuração do Banco de Dados
1. Crie um banco de dados chamado `pi_cardapio`.
2. Importe o arquivo `pi_cardapio.sql` para criar as tabelas.
3. Importe o arquivo `insert_produtos.sql` para adicionar os produtos ao banco de dados.
4. (Opcional) Importe `PopularOBanco.sql` para ter dados de teste.

### 3. Instalação
Navegue até a pasta do projeto e instale as dependências:
```bash
cd "pi Modelo Hamburgueria"
npm install
```

### 4. Variáveis de Ambiente
Crie um arquivo `.env` na pasta raíz do app (`pi Modelo Hamburgueria`) com as seguintes chaves:
```env
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=pi_cardapio
JWT_SECRET=sua_chave_secreta_aqui
```

### 5. Iniciar o Servidor
```bash
node server.js
```
O servidor estará rodando em: `http://localhost:3000`

---

## 🎨 Design & Responsividade
O sistema foi construído com foco em **Mobile First**, garantindo que as tabelas de gestão e o cardápio funcionem perfeitamente tanto em celulares de baixa resolução quanto em monitores Full HD.

---

## 📝 Licença
Este projeto foi desenvolvido como parte de um Projeto Integrador (PI).

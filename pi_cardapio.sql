CREATE DATABASE pi_cardapio;

USE pi_cardapio;

CREATE TABLE Funcionarios (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(100) NOT NULL,
    CPF VARCHAR(14) UNIQUE NOT NULL, 
    Telefone VARCHAR(20),
    Email VARCHAR(100) UNIQUE,
    Cargo VARCHAR(50)
);

CREATE TABLE Clientes (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(100) NOT NULL,
    CPF VARCHAR(14) UNIQUE NOT NULL,
    Telefone VARCHAR(20),
    Email VARCHAR(100) UNIQUE,
    Senha VARCHAR(255) NOT NULL 
);

CREATE TABLE Categorias (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Produtos (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(100) NOT NULL,
    Descricao TEXT,
    Quantidade INT NOT NULL DEFAULT 0,
    Preco_Unitario DECIMAL(10, 2) NOT NULL,
    Categoria_ID INT,
    
    FOREIGN KEY (Categoria_ID) REFERENCES Categorias(ID)
);

CREATE TABLE Pedidos (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    ID_Cliente INT NOT NULL,
    ID_Funcionario INT,
    Forma_Pagamento VARCHAR(50),
    Status VARCHAR(50),
    Valor DECIMAL(10, 2) NOT NULL,
    Horario_Pedido DATETIME NOT NULL,
    
    FOREIGN KEY (ID_Cliente) REFERENCES Clientes(ID),
    FOREIGN KEY (ID_Funcionario) REFERENCES Funcionarios(ID)
);

CREATE TABLE Itens_Pedidos (
    ID_Pedido INT NOT NULL,
    ID_Produto INT NOT NULL,
    Quantidade INT NOT NULL,
    Preco_Venda DECIMAL(10, 2) NOT NULL, -- Preço do produto no momento da venda
    
    PRIMARY KEY (ID_Pedido, ID_Produto),
    FOREIGN KEY (ID_Pedido) REFERENCES Pedidos(ID),
    FOREIGN KEY (ID_Produto) REFERENCES Produtos(ID)
);

CREATE TABLE Financeiro (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    ID_Pedido INT,
    Forma_Pagamento VARCHAR(50),
    Valor DECIMAL(10, 2) NOT NULL,
    Data DATE NOT NULL,
    
    FOREIGN KEY (ID_Pedido) REFERENCES Pedidos(ID)
);
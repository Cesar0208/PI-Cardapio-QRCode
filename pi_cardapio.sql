CREATE DATABASE pi_cardapio;

USE pi_cardapio;

CREATE TABLE Funcionarios (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(100) NOT NULL,
    CPF VARCHAR(14) UNIQUE NOT NULL, 
    Telefone VARCHAR(20),
    Email VARCHAR(100) UNIQUE,
    Cargo VARCHAR(50),
    Senha VARCHAR(255) NOT NULL 
);

CREATE TABLE Clientes (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(100) NOT NULL,
    CPF VARCHAR(14) UNIQUE NOT NULL,
    Telefone VARCHAR(20),
    Email VARCHAR(100) UNIQUE,
    Senha VARCHAR(255) NOT NULL 
);

CREATE TABLE Produtos (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(100) NOT NULL,
    Descricao TEXT,
    Quantidade INT NOT NULL DEFAULT 0,
    Preco_Unitario DECIMAL(10, 2) NOT NULL,
    Categoria ENUM('burgers', 'bebida', 'acompanhamento', 'sobremesa', 'combo') NOT NULL,
    imagem VARCHAR(500),
    disponivel BOOLEAN DEFAULT TRUE,
    destaque BOOLEAN DEFAULT FALSE
);

CREATE TABLE Pedidos (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    ID_Cliente INT NOT NULL,
    ID_Funcionario INT,
    Forma_Pagamento VARCHAR(50),
    Status ENUM('novo', 'preparo', 'enviado', 'entregue', 'cancelado') DEFAULT 'novo',
    Valor DECIMAL(10, 2) NOT NULL,
    Horario_Pedido DATETIME NOT NULL,
    Tipo_Pedido ENUM('delivery', 'pickup') NOT NULL DEFAULT 'delivery',
    Endereco VARCHAR(255),
    Numero VARCHAR(20),
    Bairro VARCHAR(100),
    Cidade VARCHAR(100),
    CEP VARCHAR(20),
    Complemento VARCHAR(255),
    
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
    Categoria VARCHAR(255) NULL,
    
    FOREIGN KEY (ID_Pedido) REFERENCES Pedidos(ID)
);
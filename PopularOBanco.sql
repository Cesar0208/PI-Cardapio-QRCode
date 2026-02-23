-- Inserindo Funcionários (Atendentes e Gerentes)
INSERT INTO Funcionarios (Nome, CPF, Telefone, Email, Cargo, Senha) VALUES 
-- hash_senha_123
('Lucas Oliveira', '111.222.333-44', '(11) 98888-7777', 'lucas@funcionario.com', 'Atendente', '$2b$10$l22R0Mgu8W9R0QvW4Grl2OM1lnS2E7Vlf27qOzzPcGp236ttLj8Sq'), 
-- hash_senha_456
('Juliana Costa', '555.666.777-88', '(11) 97777-6666', 'juliana@gerente.com', 'Gerente', '$2b$10$6X7OH82knOrGTumdZ1unweUbqiBR5BNbgRpUq1AYQnOxiVYa8vOeu');

-- Inserindo Clientes
INSERT INTO Clientes (Nome, CPF, Telefone, Email, Senha) VALUES 
-- cliente123
('Ricardo Souza', '123.456.789-00', '(11) 91234-5678', 'ricardo@email.com', '$2b$10$WurmNlPvK4GdV7MYqGuwVeyw3VhMiyAU6aOtr9KBBYJ0FpXX6Sdky'),
-- cliente456
('Beatriz Lima', '987.654.321-11', '(11) 92345-6789', 'beatriz@email.com', '$2b$10$CCqNDUmD2wbsgAMQZIeM/ub/24f.oosFyJagffnYLWJXlP.l7eiSW'),
-- cliente789
('Tiago Mendes', '456.789.123-22', '(11) 93456-7890', 'tiago@email.com', '$2b$10$.QYN42d0EIF3gX3PJio3XuDM06jPRA2hsAgpMD777LwNzONX6gnce');

-- PEDIDO 1: Ricardo comprou o Combo 1 (ID 21)
INSERT INTO Pedidos (ID_Cliente, ID_Funcionario, Forma_Pagamento, Status, Valor, Horario_Pedido) 
VALUES (1, 1, 'Cartão de Crédito', 'entregue', 38.90, NOW());
INSERT INTO Itens_Pedidos (ID_Pedido, ID_Produto, Quantidade, Preco_Venda) VALUES (1, 21, 1, 38.90);
INSERT INTO Financeiro (ID_Pedido, Forma_Pagamento, Valor, Data) VALUES (1, 'Cartão de Crédito', 38.90, CURDATE());

-- PEDIDO 2: Beatriz comprou X-Bacon e Coca-Cola 350ml (ID 2 + ID 6 = 28.90 + 6.00 = 34.90)
INSERT INTO Pedidos (ID_Cliente, ID_Funcionario, Forma_Pagamento, Status, Valor, Horario_Pedido) 
VALUES (2, 1, 'Pix', 'entregue', 34.90, NOW());
INSERT INTO Itens_Pedidos (ID_Pedido, ID_Produto, Quantidade, Preco_Venda) VALUES (2, 2, 1, 28.90), (2, 6, 1, 6.00);
INSERT INTO Financeiro (ID_Pedido, Forma_Pagamento, Valor, Data) VALUES (2, 'Pix', 34.90, CURDATE());

-- PEDIDO 3: Tiago comprou 2 Smash Burgers (ID 5 = 29.90 * 2 = 59.80)
INSERT INTO Pedidos (ID_Cliente, ID_Funcionario, Forma_Pagamento, Status, Valor, Horario_Pedido) 
VALUES (3, 1, 'Dinheiro', 'preparo', 59.80, NOW());
INSERT INTO Itens_Pedidos (ID_Pedido, ID_Produto, Quantidade, Preco_Venda) VALUES (3, 5, 2, 29.90);
INSERT INTO Financeiro (ID_Pedido, Forma_Pagamento, Valor, Data) VALUES (3, 'Dinheiro', 59.80, CURDATE());

-- PEDIDO 4: Ricardo comprou 1 Combo Família (ID 24 = 95.00)
INSERT INTO Pedidos (ID_Cliente, ID_Funcionario, Forma_Pagamento, Status, Valor, Horario_Pedido) 
VALUES (1, 2, 'Cartão de Débito', 'novo', 95.00, NOW());
INSERT INTO Itens_Pedidos (ID_Pedido, ID_Produto, Quantidade, Preco_Venda) VALUES (4, 24, 1, 95.00);
INSERT INTO Financeiro (ID_Pedido, Forma_Pagamento, Valor, Data) VALUES (4, 'Cartão de Débito', 95.00, CURDATE());

-- PEDIDO 5: Beatriz comprou Petit Gateau e Suco Natural (ID 19 + ID 9 = 16.00 + 8.00 = 24.00)
INSERT INTO Pedidos (ID_Cliente, ID_Funcionario, Forma_Pagamento, Status, Valor, Horario_Pedido) 
VALUES (2, 1, 'Pix', 'enviado', 24.00, NOW());
INSERT INTO Itens_Pedidos (ID_Pedido, ID_Produto, Quantidade, Preco_Venda) VALUES (5, 19, 1, 16.00), (5, 9, 1, 8.00);
INSERT INTO Financeiro (ID_Pedido, Forma_Pagamento, Valor, Data) VALUES (5, 'Pix', 24.00, CURDATE());

-- PEDIDO 6: Tiago comprou X-Tudo, Batata Grande e Milkshake (ID 3 + ID 12 + ID 11 = 32.90 + 15.00 + 15.00 = 62.90)
INSERT INTO Pedidos (ID_Cliente, ID_Funcionario, Forma_Pagamento, Status, Valor, Horario_Pedido) 
VALUES (3, 1, 'Cartão de Crédito', 'novo', 62.90, NOW());
INSERT INTO Itens_Pedidos (ID_Pedido, ID_Produto, Quantidade, Preco_Venda) VALUES (6, 3, 1, 32.90), (6, 12, 1, 15.00), (6, 11, 1, 15.00);
INSERT INTO Financeiro (ID_Pedido, Forma_Pagamento, Valor, Data) VALUES (6, 'Cartão de Crédito', 62.90, CURDATE());
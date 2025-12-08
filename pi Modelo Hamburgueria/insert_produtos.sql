-- Inserir produtos de exemplo no cardápio
INSERT INTO Produtos (Nome, Descricao, Quantidade, Preco_Unitario, Categoria, imagem, disponivel, destaque) VALUES
('Classic Burger', 'Hambúrguer 180g, queijo, alface, tomate e molho especial', 50, 25.90, 'burgers', '', TRUE, TRUE),
('X-Bacon', 'Hambúrguer 180g, queijo, bacon crocante, alface e tomate', 40, 28.90, 'burgers', '', TRUE, FALSE),
('X-Tudo', 'Hambúrguer 180g, queijo, bacon, ovo, presunto, alface, tomate', 30, 32.90, 'burgers', '', TRUE, TRUE),
('X-Salada', 'Hambúrguer 180g, queijo, alface, tomate, cebola e molho especial', 45, 24.90, 'burgers', '', TRUE, FALSE),
('Smash Burger', 'Dois hambúrgueres smash 100g cada, queijo cheddar e molho especial', 35, 29.90, 'burgers', '', TRUE, TRUE),

('Coca-Cola 350ml', 'Refrigerante Coca-Cola lata 350ml gelada', 100, 6.00, 'bebida', '', TRUE, FALSE),
('Coca-Cola 2L', 'Refrigerante Coca-Cola garrafa 2 litros', 50, 12.00, 'bebida', '', TRUE, FALSE),
('Guaraná Antarctica 350ml', 'Refrigerante Guaraná lata 350ml gelada', 80, 5.50, 'bebida', '', TRUE, FALSE),
('Suco Natural', 'Suco natural de frutas 300ml (laranja, limão ou maracujá)', 40, 8.00, 'bebida', '', TRUE, FALSE),
('Água Mineral 500ml', 'Água mineral sem gás garrafa 500ml', 120, 3.50, 'bebida', '', TRUE, FALSE),
('Milkshake', 'Milkshake cremoso 400ml (chocolate, morango ou baunilha)', 30, 15.00, 'bebida', '', TRUE, FALSE),

('Batata Frita Grande', 'Batata frita crocante 400g', 60, 15.00, 'acompanhamento', '', TRUE, FALSE),
('Batata Frita Pequena', 'Batata frita crocante 200g', 80, 8.00, 'acompanhamento', '', TRUE, FALSE),
('Onion Rings', 'Anéis de cebola empanados crocantes 300g', 40, 14.00, 'acompanhamento', '', TRUE, FALSE),
('Nuggets de Frango', '10 unidades de nuggets de frango empanados', 50, 16.00, 'acompanhamento', '', TRUE, FALSE),
('Batata Rústica', 'Batata rústica temperada 350g', 45, 13.00, 'acompanhamento', '', TRUE, FALSE),

('Brownie com Sorvete', 'Brownie de chocolate quente com sorvete de baunilha', 25, 12.00, 'sobremesa', '', TRUE, FALSE),
('Sorvete 2 Bolas', 'Duas bolas de sorvete (sabores variados)', 40, 9.00, 'sobremesa', '', TRUE, FALSE),
('Petit Gateau', 'Petit gateau de chocolate com sorvete', 20, 16.00, 'sobremesa', '', TRUE, TRUE),
('Torta de Limão', 'Fatia de torta de limão cremosa', 15, 10.00, 'sobremesa', '', TRUE, FALSE),

('Combo 1 - Classic', 'Classic Burger + Batata Grande + Refrigerante 350ml', 30, 38.90, 'Combo', '', TRUE, TRUE),
('Combo 2 - X-Bacon', 'X-Bacon + Batata Grande + Refrigerante 350ml', 25, 42.90, 'Combo', '', TRUE, TRUE),
('Combo 3 - X-Tudo', 'X-Tudo + Batata Grande + Refrigerante 350ml + Sobremesa', 20, 52.90, 'Combo', '', TRUE, TRUE),
('Combo Família', '3 Hambúrgueres + 2 Batatas Grandes + 3 Refrigerantes', 15, 95.00, 'Combo', '', TRUE, TRUE);

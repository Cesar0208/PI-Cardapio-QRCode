-- Inserir produtos de exemplo no cardápio
INSERT INTO Produtos (Nome, Descricao, Quantidade, Preco_Unitario, Categoria, imagem, disponivel, destaque) VALUES
('Classic Burger', 'Hambúrguer 180g, queijo, alface, tomate e molho especial', 50, 25.90, 'burgers', 'https://thespiceway.com/cdn/shop/files/Signature_Savory_Classic_Burger.jpg?v=1712161801', TRUE, TRUE),
('X-Bacon', 'Hambúrguer 180g, queijo, bacon crocante, alface e tomate', 40, 28.90, 'burgers', 'https://alloydeliveryimages.s3.sa-east-1.amazonaws.com/item_images/7290/64ceb8f870980813qe.webp', TRUE, FALSE),
('X-Tudo', 'Hambúrguer 180g, queijo, bacon, ovo, presunto, alface, tomate', 30, 32.90, 'burgers', 'https://conteudo.imguol.com.br/c/entretenimento/17/2023/05/24/x-tudo-brasileiro-tem-variedade-de-ingredientes-de-acordo-com-preferencias-regionais-aqui-versao-com-carne-bovina-tomato-salsicha-presunto-bacon-e-queijo-no-pao-1684938396547_v2_900x506.jpg', TRUE, TRUE),
('X-Salada', 'Hambúrguer 180g, queijo, alface, tomate, cebola e molho especial', 45, 24.90, 'burgers', 'https://alloydeliveryimages.s3.sa-east-1.amazonaws.com/item_images/7290/64ceb8f870980813qe.webp', TRUE, FALSE),
('Smash Burger', 'Dois hambúrgueres smash 100g cada, queijo cheddar e molho especial', 35, 29.90, 'burgers', 'https://ogimg.infoglobo.com.br/rioshow/25033674-ea4-3ac/FT1086A/smash-burger.jpg', TRUE, TRUE),

('Coca-Cola 350ml', 'Refrigerante Coca-Cola lata 350ml gelada', 100, 6.00, 'bebida', 'https://thumbs.dreamstime.com/b/coca-cola-em-alum%C3%ADnio-pode-fundo-preto-devon-reino-unido-de-outubro-162763145.jpg?w=576', TRUE, FALSE),
('Coca-Cola 2L', 'Refrigerante Coca-Cola garrafa 2 litros', 50, 12.00, 'bebida', 'https://imgs.extra.com.br/1559787763/1xg.jpg', TRUE, FALSE),
('Guaraná Antarctica 350ml', 'Refrigerante Guaraná lata 350ml gelada', 80, 5.50, 'bebida', 'https://carrefourbrfood.vtexassets.com/arquivos/ids/8969235/refrigerante-guarana-antarctica-350ml-1.jpg?v=637364778200030000', TRUE, FALSE),
('Suco Natural', 'Suco natural de frutas 300ml (laranja, limão ou maracujá)', 40, 8.00, 'bebida', 'https://americanas.vtexassets.com/arquivos/ids/13119421/7475240756_1_xlarge.jpg?v=638754369076630000', TRUE, FALSE),
('Água Mineral 500ml', 'Água mineral sem gás garrafa 500ml', 120, 3.50, 'bebida', 'https://ibassets.com.br/ib.item.image.large/l-fd83a662da92460c81fae7b06f0f8bb2.jpeg', TRUE, FALSE),
('Milkshake', 'Milkshake cremoso 400ml (chocolate, morango ou baunilha)', 30, 15.00, 'bebida', 'https://static.expressodelivery.com.br/imagens/produtos/519762/180/Expresso-Delivery_f714a337aeab002f3a5275c594a02ee1.png', TRUE, FALSE),

('Batata Frita Grande', 'Batata frita crocante 400g', 60, 15.00, 'acompanhamento', 'https://tse3.mm.bing.net/th/id/OIP.pWHeEGGezD5rOgy4ywLeaAHaE7?pid=ImgDet&w=203&h=135&c=7&o=7&rm=3', TRUE, FALSE),
('Batata Frita Pequena', 'Batata frita crocante 200g', 80, 8.00, 'acompanhamento', 'https://tse3.mm.bing.net/th/id/OIP.05ULDRzofCzwgtqJByP1dAAAAA?pid=ImgDet&w=158&h=283&c=7&o=7&rm=3', TRUE, FALSE),
('Onion Rings', 'Anéis de cebola empanados crocantes 300g', 40, 14.00, 'acompanhamento', 'https://img.freepik.com/fotos-premium/aneis-de-cebola-fritos-em-um-fundo-preto-com-reflexao-comida-de-dedo_207126-7982.jpg', TRUE, FALSE),
('Nuggets de Frango', '10 unidades de nuggets de frango empanados', 50, 16.00, 'acompanhamento', 'https://img.freepik.com/premium-photo/top-view-tomato-sauced-chicken-nuggets-black-backdrop_908985-100993.jpg', TRUE, FALSE),
('Batata Rústica', 'Batata rústica temperada 350g', 45, 13.00, 'acompanhamento', 'https://tse1.mm.bing.net/th/id/OIP.c_9yV4xwB9BX1Bxow5HNMwHaHa?w=626&h=626&rs=1&pid=ImgDetMain&o=7&rm=3', TRUE, FALSE),

('Brownie com Sorvete', 'Brownie de chocolate quente com sorvete de baunilha', 25, 12.00, 'sobremesa', 'https://img.freepik.com/premium-photo/chocolate-brownie-cake-with-scoop-ice-cream_1015293-21202.jpg', TRUE, FALSE),
('Sorvete 2 Bolas', 'Duas bolas de sorvete (sabores variados)', 40, 9.00, 'sobremesa', 'https://img.freepik.com/premium-photo/top-view-tasty-ice-cream-cones-with-topping_198067-534904.jpg', TRUE, FALSE),
('Petit Gateau', 'Petit gateau de chocolate com sorvete', 20, 16.00, 'sobremesa', 'https://t4.ftcdn.net/jpg/03/17/14/67/360_F_317146786_2cZHIDKp4tXAVTdSTJsJlaW8355Gv0ao.jpg', TRUE, TRUE),
('Torta de Limão', 'Fatia de torta de limão cremosa', 15, 10.00, 'sobremesa', 'https://www.comidaereceitas.com.br/wp-content/uploads/2008/11/torta-de-limao-refrescante-com-guarnicao-de-limao-picante-780x520.jpg', TRUE, FALSE),

('Combo 1 - Classic', 'Classic Burger + Batata Grande + Refrigerante 350ml', 30, 38.90, 'combo', 'https://th.bing.com/th/id/OIP.9jMyDzZSbw6YizJoh_K-bwHaE7?w=279&h=186&c=7&r=0&o=7&pid=1.7&rm=3', TRUE, TRUE),
('Combo 2 - X-Bacon', 'X-Bacon + Batata Grande + Refrigerante 350ml', 25, 42.90, 'combo', 'https://tse2.mm.bing.net/th/id/OIP.Zb9GtbUHDs0869Qag8dbnAAAAA?rs=1&pid=ImgDetMain&o=7&rm=3', TRUE, TRUE),
('Combo 3 - X-Tudo', 'X-Tudo + Batata Grande + Refrigerante 350ml + Sobremesa', 20, 52.90, 'combo', 'https://tse3.mm.bing.net/th/id/OIP.7RPNbMGmJOyG-3LfHP3HeAAAAA?pid=ImgDet&w=206&h=137&c=7&o=7&rm=3', TRUE, TRUE),
('Combo Família', '2 Hambúrgueres + 2 Batatas Grandes + 1 Refrigerantes', 15, 95.00, 'combo', 'https://alloydeliveryimages.s3.sa-east-1.amazonaws.com/item_images/15763/6803e9b87900e7kpzd.webp', TRUE, TRUE);
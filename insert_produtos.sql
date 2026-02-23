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

('Batata Frita Grande', 'Batata frita crocante 400g', 60, 15.00, 'acompanhamento', 'https://anamariareceitas.com.br/wp-content/uploads/2024/06/4899-2-768x512.jpg', TRUE, FALSE),
('Batata Frita Pequena', 'Batata frita crocante 200g', 80, 8.00, 'acompanhamento', 'https://s2-receitas.glbimg.com/6TYFXwek9ZpNXFeOzas09KizMKk=/0x0:1280x853/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2020/T/K/Hh8h2GR96v392DAkAqyA/912c9713-321e-4dfd-bca9-888c05c5ce50.jpeg', TRUE, FALSE),
('Onion Rings', 'Anéis de cebola empanados crocantes 300g', 40, 14.00, 'acompanhamento', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgpLW4NpByd55QSY_ZuXdYROCf0m5tBLukYCxWM2DInpkdbc3m0IaVR1UKtRmKd3G47lEiSx-bBbmvyCu6w2hb7veWevQLchFUs0lQZHg-2PquQL4ghLG3MG5mZOkTh1FSxQjFN7u6l0FyPeWPqj8X7YZI1JR9lxjJnpmuTscl2LnicMnQGhxamBJpZ/s2000/onion-rings.jpg', TRUE, FALSE),
('Nuggets de Frango', '10 unidades de nuggets de frango empanados', 50, 16.00, 'acompanhamento', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi8wyIV5RSpFLLMz08dB0rKLxBpkA8PkRdKA&s', TRUE, FALSE),
('Batata Rústica', 'Batata rústica temperada 350g', 45, 13.00, 'acompanhamento', 'https://novo.revistavidaesaude.com.br/wp-content/uploads/2022/02/AdobeStock_473004844.jpeg', TRUE, FALSE),

('Brownie com Sorvete', 'Brownie de chocolate quente com sorvete de baunilha', 25, 12.00, 'sobremesa', 'https://img.freepik.com/fotos-premium/brownie-de-chocolate-com-gelado-de-baunilha_70216-7782.jpg', TRUE, FALSE),
('Sorvete 2 Bolas', 'Duas bolas de sorvete (sabores variados)', 40, 9.00, 'sobremesa', 'https://vejasp.abril.com.br/wp-content/uploads/2019/08/frida-mina-sorvete-de-sabores-variados.jpg?quality=70&strip=info&w=650', TRUE, FALSE),
('Petit Gateau', 'Petit gateau de chocolate com sorvete', 20, 16.00, 'sobremesa', 'https://media-cdn.tripadvisor.com/media/photo-s/13/5b/33/6a/petit-gateau-com-sorvete.jpg', TRUE, TRUE),
('Torta de Limão', 'Fatia de torta de limão cremosa', 15, 10.00, 'sobremesa', 'https://images.aws.nestle.recipes/original/efde94328c90a3df9c569a57186862e0_19_torta_limao.png', TRUE, FALSE),

('Combo 1 - Classic', 'Classic Burger + Batata Grande + Refrigerante 350ml', 30, 38.90, 'combo', 'https://instadelivery-public.nyc3.cdn.digitaloceanspaces.com/groups/175219440968705d69bdeb0.jpeg', TRUE, TRUE),
('Combo 2 - X-Bacon', 'X-Bacon + Batata Grande + Refrigerante 350ml', 25, 42.90, 'combo', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5wT5wmn2_qtoExIG0SMaAPumXjUQXgh66cQ&s', TRUE, TRUE),
('Combo 3 - X-Tudo', 'X-Tudo + Batata Grande + Refrigerante 350ml + Sobremesa', 20, 52.90, 'combo', 'https://imagens.jotaja.com/produtos/496ecdc0-4019-489f-8744-01c8417784c0.jpg', TRUE, TRUE),
('Combo Família', '2 Hambúrgueres + 2 Batatas Grandes + 1 Refrigerantes', 15, 95.00, 'combo', 'https://alloydeliveryimages.s3.sa-east-1.amazonaws.com/item_images/15763/6803e9b87900e7kpzd.webp', TRUE, TRUE);

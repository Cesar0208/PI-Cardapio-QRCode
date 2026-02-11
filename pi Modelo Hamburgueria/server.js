const express = require("express");
const db = require("./config/db");
const cors = require("cors");
const { hashSenha, compararSenha } = require("./services/hashSenha")

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API está em funcionamento!. Aqui será a rota principal");
});






// Área para cadastro de clientes
app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: "Email e senha são obrigatórios." });
    }

    try {
        // CORREÇÃO: usar db.execute + await
        const [users] = await db.execute("SELECT * FROM Clientes WHERE email = ?", [email]);

        if (users.length === 0) {
            return res.status(401).json({ mensagem: "Credenciais inválidas." });
        }

        const user = users[0];

        const isMatch = await compararSenha(senha, user.Senha) // compare sua senha

        if (!isMatch) {
            return res.status(401).json({ mensagem: "Senha inválida."});
        }

        delete user.Senha;  // remove a senha do retorno

        return res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            usuario: user
        });

    } catch (error) {
        console.error("Erro no processo de login:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor ao tentar fazer login." });
    }
});   

app.post("/cadastro", async (req, res) => {
    const {nome, email, cpf, telefone, senha, confirmaSenha} = req.body;

    if(!nome || !email || !cpf || !telefone || !senha || !confirmaSenha) {
        return res.status(500).json({mensagem: "Todos os dados são necessários!"})
    };

    if(senha !== confirmaSenha) {
        return res.status(406).json({mensagem: "As senhas não estão condizentes"})
    };

    const senhaComHash = await hashSenha(senha)

    db.query("INSERT INTO Clientes(Nome, CPF, Telefone, Email, Senha) VALUES (?, ?, ?, ?, ?)", [nome, cpf, telefone, email, senhaComHash], (err, resultado) => {
        if (err) return res.status(500).json({erro: err});
    })

    res.status(200).json({mensagem: "Usuario adicionado!"});
});

app.get("/produtos", async (req, res) => {
    try {
        const [produtos] = await db.execute("SELECT * FROM Produtos ORDER BY Categoria, Nome");
        res.status(200).json(produtos);
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        res.status(500).json({ mensagem: "Erro ao buscar produtos do cardápio" });
    }
});

app.get("/produtos/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [produtos] = await db.execute("SELECT * FROM Produtos WHERE ID = ?", [id]);
        if (produtos.length === 0) {
            return res.status(404).json({ mensagem: "Produto não encontrado" });
        }
        res.status(200).json(produtos[0]);
    } catch (error) {
        console.error("Erro ao buscar produto:", error);
        res.status(500).json({ mensagem: "Erro ao buscar produto" });
    }
});

app.post("/produtos", async (req, res) => {
    const { nome, categoria, preco, descricao, imagem, disponivel, destaque, quantidade } = req.body;

    if (!nome || !categoria || !preco) {
        return res.status(400).json({ mensagem: "Nome, categoria e preço são obrigatórios" });
    }

    try {
        const [resultado] = await db.execute(
            "INSERT INTO Produtos (Nome, Categoria, Preco_Unitario, Descricao, imagem, disponivel, destaque, Quantidade) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [nome, categoria, preco, descricao || null, imagem || null, disponivel !== false, destaque || false, quantidade || 0]
        );
        res.status(201).json({ 
            mensagem: "Produto adicionado com sucesso!", 
            id: resultado.insertId 
        });
    } catch (error) {
        console.error("Erro ao adicionar produto:", error);
        res.status(500).json({ mensagem: "Erro ao adicionar produto ao cardápio" });
    }
});

app.put("/produtos/:id", async (req, res) => {
    const { id } = req.params;
    const { nome, categoria, preco, descricao, imagem, disponivel, destaque, quantidade } = req.body;

    if (!nome || !categoria || !preco) {
        return res.status(400).json({ mensagem: "Nome, categoria e preço são obrigatórios" });
    }

    try {
        const [resultado] = await db.execute(
            "UPDATE Produtos SET Nome = ?, Categoria = ?, Preco_Unitario = ?, Descricao = ?, imagem = ?, disponivel = ?, destaque = ?, Quantidade = ? WHERE ID = ?",
            [nome, categoria, preco, descricao || null, imagem || null, disponivel !== false, destaque || false, quantidade || 0, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Produto não encontrado" });
        }

        res.status(200).json({ mensagem: "Produto atualizado com sucesso!" });
    } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        res.status(500).json({ mensagem: "Erro ao atualizar produto" });
    }
});

app.delete("/produtos/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [resultado] = await db.execute("DELETE FROM Produtos WHERE ID = ?", [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Produto não encontrado" });
        }

        res.status(200).json({ mensagem: "Produto excluído com sucesso!" });
    } catch (error) {
        console.error("Erro ao excluir produto:", error);
        res.status(500).json({ mensagem: "Erro ao excluir produto" });
    }
});

app.patch("/produtos/:id/disponibilidade", async (req, res) => {
    const { id } = req.params;
    const { disponivel } = req.body;

    try {
        const [resultado] = await db.execute(
            "UPDATE Produtos SET disponivel = ? WHERE ID = ?",
            [disponivel !== false, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Produto não encontrado" });
        }

        res.status(200).json({ mensagem: "Disponibilidade atualizada com sucesso!" });
    } catch (error) {
        console.error("Erro ao atualizar disponibilidade:", error);
        res.status(500).json({ mensagem: "Erro ao atualizar disponibilidade" });
    }
});

app.get("/pedidos/listar", async (req, res) => {

    const sqlQuery = `
        SELECT 
            p.ID,
            p.Horario_Pedido,
            p.Valor,
            p.Forma_Pagamento,
            p.Status,
            c.Nome AS ClienteNome,
            c.CPF AS ClienteCPF,
            -- A correção está nesta seção:
            GROUP_CONCAT(
                CONCAT(ip.Quantidade, 'x ', pr.Nome) 
                ORDER BY pr.Nome ASC 
                SEPARATOR '; ' 
            ) AS ItensResumo 
        FROM Pedidos p
        JOIN Clientes c ON p.ID_Cliente = c.ID
        JOIN Itens_Pedidos ip ON p.ID = ip.ID_Pedido
        JOIN Produtos pr ON ip.ID_Produto = pr.ID
        WHERE p.Status IN ('novo', 'preparo', 'enviado', 'entregue')
        GROUP BY p.ID, p.Horario_Pedido, p.Valor, p.Forma_Pagamento, p.Status, c.Nome, c.CPF
        ORDER BY p.Horario_Pedido ASC;
    `;

    try {
        const [pedidos] = await db.execute(sqlQuery); 
        
        res.status(200).json({
            status: 'success',
            data: pedidos
        });

    } catch (err) {
        console.error("Erro ao listar pedidos:", err);
        res.status(500).json({
            status: 'error',
            message: 'Erro interno do servidor ao buscar a lista de pedidos.'
        });
    }
});

app.get("/pedidos/:id", async (req, res) => {
    const id = req.params.id;

    const sqlQuery = `
        SELECT 
            p.ID,
            p.Valor,
            p.Status,
            p.Forma_Pagamento,
            -- COLUNAS PLACEHOLDER: AJUSTE PARA ONDE ESTÁ SEU ENDEREÇO/OBS
            'Rua Exemplo, 123 - Bairro Teste' AS EnderecoEntrega, 
            'Sem picles e maionese no acompanhamento' AS Observacoes,
            -- FIM COLUNAS PLACEHOLDER

            c.Nome AS ClienteNome,
            c.CPF AS ClienteCPF,
            f.Nome AS FuncionarioNome,
            
            -- Busca todos os itens detalhados para o modal
            GROUP_CONCAT(
                CONCAT(ip.Quantidade, 'x ', pr.Nome) 
                ORDER BY pr.Nome ASC 
                SEPARATOR '||' 
            ) AS ItensDetalhes 
        FROM Pedidos p
        JOIN Clientes c ON p.ID_Cliente = c.ID
        LEFT JOIN Funcionarios f ON p.ID_Funcionario = f.ID -- LEFT JOIN, pois ID_Funcionario pode ser NULL
        JOIN Itens_Pedidos ip ON p.ID = ip.ID_Pedido
        JOIN Produtos pr ON ip.ID_Produto = pr.ID
        WHERE p.ID = ?
        GROUP BY 
            p.ID, p.Valor, p.Status, p.Forma_Pagamento, c.Nome, c.CPF, f.Nome;
    `;

    try {
        const [rows] = await db.execute(sqlQuery, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Pedido não encontrado.' });
        }

        res.status(200).json({
            status: 'success',
            data: rows[0]
        });

    } catch (err) {
        console.error(`Erro ao buscar detalhes do pedido ${id}:`, err);
        res.status(500).json({ status: 'error', message: 'Erro interno do servidor.' });
    }
});

// Pegar valores sobre os pedidos (Em preparo, Rota de entrega e Entregues)
app.get('/api/pedidos/contagem', async (req, res) => {
    const status = req.query.status;

    if (!status) {
        return res.status(400).json({ status: 'error', message: 'O parâmetro "status" é obrigatório.' });
    }

    const sqlQuery = `
        SELECT COUNT(*) AS total_contagem
        FROM Pedidos
        WHERE Status = ?
        ${status === 'entregue' ? 'AND DATE(Horario_Pedido) = CURDATE()' : ''};
    `;
    
    const values = [status];

    try {
        const [rows] = await db.execute(sqlQuery, values);
        
        const total = rows[0].total_contagem;
        
        res.status(200).json({
            status: 'success',
            contagem: total
        });

    } catch (err) {
        console.error(`Erro ao buscar contagem para o status "${status}":`, err);
        res.status(500).json({
            status: 'error',
            message: 'Erro interno do servidor.'
        });
    }
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
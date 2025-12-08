const express = require("express");
const db = require("./config/db");
const cors = require("cors");

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

        const isMatch = senha === user.Senha; // compare sua senha

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

app.post("/cadastro", (req, res) => {
    const {nome, email, cpf, telefone, senha, confirmaSenha} = req.body;

    if(!nome || !email || !cpf || !telefone || !senha || !confirmaSenha) {
        return res.status(500).json({mensagem: "Todos os dados são necessários!"})
    };

    if(senha !== confirmaSenha) {
        return res.status(406).json({mensagem: "As senhas não estão condizentes"})
    };

    db.query("INSERT INTO Clientes(Nome, CPF, Telefone, Email, Senha) VALUES (?, ?, ?, ?, ?)", [nome, cpf, telefone, email, senha], (err, resultado) => {
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

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
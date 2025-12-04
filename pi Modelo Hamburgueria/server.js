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

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
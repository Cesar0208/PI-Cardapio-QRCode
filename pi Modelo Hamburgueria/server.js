const express = require("express");
const db = require("./config/db")

const app = express();
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
        const [users] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);

        if (users.length === 0) {
            return res.status(401).json({ mensagem: "Credenciais inválidas." });
        }

        const user = users[0];

        const isMatch = (senha === user.senha_banco);

        if (!isMatch) {
            return res.status(401).json({ mensagem: "Credenciais inválidas." });
        }
        delete user.senha_banco; 
        
        return res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            usuario: user // Retorna os dados do usuário logado
        });

    } catch (error) {
        console.error("Erro no processo de login:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor ao tentar fazer login." });
    }
});    

app.post("/usuarios", (req, res) => {
    const {nome, email, cpf, telefone, senha, confirmaSenha} = req.body;

    if(!nome || !email || !cpf || !telefone || !senha || !confirmaSenha) {
        return res.status(500).json({mensagem: "Todos os dados são necessários!"})
    };

    if(aa);
    {
        db.query("INSERT INTO ")
    }
});

app.listen(3000, () => {
console.log("Servidor rodando em http://localhost:3000");
});
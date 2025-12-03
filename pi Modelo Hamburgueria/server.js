const express = require("express");
const db = require("./config/db")

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API está em funcionamento!. Aqui será a rota principal");
});






// Área para cadastro de clientes
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
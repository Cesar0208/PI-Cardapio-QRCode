const mysql = require("mysql2/promise");

const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "senac",
    database: "pi_cardapio",
    port: 3306
});

connection.getConnection()
    .then(() => console.log("MySQL conectado com sucesso!"))
    .catch(err => console.error("Erro ao conectar ao MySQL:", err));


module.exports = connection;
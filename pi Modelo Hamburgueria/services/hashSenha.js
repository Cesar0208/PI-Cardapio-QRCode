const bcrypt = require('bcrypt');

// Gera criptografia para a senha
exports.hashSenha = async (senha) => {
    const quantidadeHash = 10;
    return await bcrypt.hash(senha, quantidadeHash);
};

// Compara criptografia
exports.compararSenha = async (senha, hash) => {
    return await bcrypt.compare(senha, hash);
};
const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar se o usuário possui um JWT válido
 * Extrai o token do cookie HttpOnly e valida sua assinatura
 * Se válido, adiciona os dados do usuário em req.usuario
 * Se inválido, retorna erro 401
 */
const verificarJWT = (req, res, next) => {
    try {
        // Extrair o token do cookie
        const token = req.cookies.authToken;

        // Se não houver token, retornar erro
        if (!token) {
            return res.status(401).json({ 
                status: 'error', 
                mensagem: 'Token não fornecido. Faça login para continuar.' 
            });
        }

        // Verificar e decodificar o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Adicionar os dados do usuário no objeto request
        req.usuario = decoded;

        // Continuar para a próxima função/rota
        next();

    } catch (error) {
        // Se o token expirou
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                status: 'error', 
                mensagem: 'Sessão expirada. Faça login novamente.' 
            });
        }

        // Se o token é inválido
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                status: 'error', 
                mensagem: 'Token inválido.' 
            });
        }

        // Qualquer outro erro
        console.error('Erro ao verificar JWT:', error);
        return res.status(500).json({ 
            status: 'error', 
            mensagem: 'Erro ao verificar autenticação.' 
        });
    }
};

module.exports = verificarJWT;

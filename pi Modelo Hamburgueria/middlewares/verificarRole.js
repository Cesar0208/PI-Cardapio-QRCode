/**
 * Middleware factory para verificar se o usuário tem um role específico
 * Uso: verificarRole('cliente')(req, res, next)
 * Ou: app.get('/rota', verificarJWT, verificarRole('gerente'), controller)
 * 
 * @param {string | string[]} rolesPermitidos - Role ou array de roles permitidas
 * @returns {Function} Middleware que valida a role do usuário
 */
const verificarRole = (rolesPermitidos) => {
    return (req, res, next) => {
        try {
            // Garantir que rolesPermitidos é um array
            const roles = Array.isArray(rolesPermitidos) 
                ? rolesPermitidos 
                : [rolesPermitidos];

            // Verificar se o usuário está autenticado (deve estar por causa do verificarJWT)
            if (!req.usuario) {
                return res.status(401).json({ 
                    status: 'error', 
                    mensagem: 'Usuário não autenticado.' 
                });
            }

            // Verificar se o tipo do usuário está na lista de roles permitidas
            if (!roles.includes(req.usuario.tipo)) {
                return res.status(403).json({ 
                    status: 'error', 
                    mensagem: `Acesso negado. Apenas usuários do tipo ${roles.join(' ou ')} podem acessar este recurso.` 
                });
            }

            // Continuar para a próxima função/rota
            next();

        } catch (error) {
            console.error('Erro ao verificar role:', error);
            return res.status(500).json({ 
                status: 'error', 
                mensagem: 'Erro ao verificar permissões.' 
            });
        }
    };
};

module.exports = verificarRole;

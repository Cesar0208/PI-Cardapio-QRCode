// ============================================
// CONFIGURAÇÃO INICIAL E IMPORTAÇÕES
// ============================================

require('dotenv').config(); // Carregar variáveis de ambiente do .env

const express = require("express");
const db = require("./config/db");
const cors = require("cors");
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// Importar middlewares de verificação
const verificarJWT = require('./middlewares/verificarJWT');
const verificarRole = require('./middlewares/verificarRole');

// Importar serviços
const { hashSenha, compararSenha } = require("./services/hashSenha");
console.log('✓ Funções de hash carregadas:', typeof hashSenha, typeof compararSenha);

// Inicializar Express
const app = express();

// ============================================
// MIDDLEWARES GLOBAIS
// ============================================

// CORS para comunicação entre frontend e backend
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true // Permitir cookies com autenticação
}));

// Parser para JSON
app.use(express.json());

// Parser para cookies (necessário para extrair o JWT dos cookies)
app.use(cookieParser());

// Servir arquivos estáticos (CSS, JS, imagens, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// ROTAS PÚBLICAS
// ============================================

// Rota principal de teste
app.get("/", (req, res) => {
    res.send("API está em funcionamento! Acesse /login para autenticar.");
});

// Servir page de login
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Servir cardápio público (sem login)
app.get("/cardapio-semlogin", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cardapioSemLogin.html'));
});

// ============================================
// ROTAS DE AUTENTICAÇÃO
// ============================================

/**
 * POST /login
 * Faz login do usuário (cliente, funcionario ou gerente)
 * Valida credenciais no banco de dados
 * Gera JWT e envia em cookie HttpOnly
 */
app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    // Validar campos obrigatórios
    if (!email || !senha) {
        return res.status(400).json({
            status: 'error',
            mensagem: "Email e senha são obrigatórios."
        });
    }

    try {
        let usuario = null;
        let tipo = null;

        // ========= FUNCIONÁRIO =========
        if (email.includes("@funcionario")) {
            const [rows] = await db.execute(
                "SELECT * FROM Funcionarios WHERE email = ?",
                [email]
            );

            if (rows.length === 0) {
                return res.status(401).json({
                    status: 'error',
                    mensagem: "Credenciais inválidas."
                });
            }

            const funcionario = rows[0];

            // Comparar senha com hash usando bcrypt
            const isMatch = await compararSenha(senha, funcionario.Senha);
            if (!isMatch) {
                return res.status(401).json({
                    status: 'error',
                    mensagem: "Credenciais inválidas."
                });
            }

            usuario = {
                id: funcionario.ID || funcionario.id,
                nome: funcionario.Nome
            };
            tipo = "funcionario";
        }

        // ========= GERENTE =========
        else if (email.includes("@gerente")) {
            const [rows] = await db.execute(
                "SELECT * FROM Funcionarios WHERE email = ?",
                [email]
            );

            if (rows.length === 0) {
                return res.status(401).json({
                    status: 'error',
                    mensagem: "Credenciais inválidas."
                });
            }

            const gerente = rows[0];

            // Comparar senha com hash usando bcrypt
            const isMatch = await compararSenha(senha, gerente.Senha);
            if (!isMatch) {
                return res.status(401).json({
                    status: 'error',
                    mensagem: "Credenciais inválidas."
                });
            }

            usuario = {
                id: gerente.ID || gerente.id,
                nome: gerente.Nome
            };
            tipo = "gerente";
        }

        // ========= CLIENTE =========
        else {
            const [rows] = await db.execute(
                "SELECT * FROM Clientes WHERE email = ?",
                [email]
            );

            if (rows.length === 0) {
                return res.status(401).json({
                    status: 'error',
                    mensagem: "Credenciais inválidas."
                });
            }

            const cliente = rows[0];

            // Usar bcrypt para comparar senha (já está implementado)
            const isMatch = await compararSenha(senha, cliente.Senha);
            if (!isMatch) {
                return res.status(401).json({
                    status: 'error',
                    mensagem: "Credenciais inválidas."
                });
            }

            usuario = {
                id: cliente.ID || cliente.id,
                nome: cliente.Nome
            };
            tipo = "cliente";
        }

        // ========= GERAR JWT =========
        // Criar payload do token com apenas os dados necessários
        const payload = {
            id: usuario.id,
            nome: usuario.nome,
            tipo: tipo
        };

        // Gerar JWT com expiração de 1 hora
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        // Enviar token em cookie HttpOnly (seguro, não acessível via JS do frontend)
        res.cookie('authToken', token, {
            httpOnly: true,      // Não permite acesso via JavaScript
            secure: process.env.NODE_ENV === 'production', // HTTPS apenas em produção
            sameSite: 'Strict',   // Proteção contra CSRF
            maxAge: 3600000       // 1 hora em milissegundos
        });

        // Retornar sucesso e tipo do usuário para o frontend redirecionar
        return res.status(200).json({
            status: 'success',
            mensagem: "Login realizado com sucesso!",
            tipo: tipo,
            usuario: usuario
        });

    } catch (error) {
        console.error("Erro ao fazer login:", error);
        return res.status(500).json({
            status: 'error',
            mensagem: "Erro interno no servidor."
        });
    }
});

/**
 * POST /logout
 * Remove o cookie JWT, encerrando a sessão
 */
app.post("/logout", (req, res) => {
    // Limpar o cookie de autenticação
    res.clearCookie('authToken');

    return res.status(200).json({
        status: 'success',
        mensagem: "Logout realizado com sucesso!"
    });
});

/**
 * POST /cadastro
 * Cria novo cliente no sistema
 * Valida dados e faz hash da senha usando bcrypt
 */
app.post("/cadastro", async (req, res) => {
    const { nome, email, cpf, telefone, senha, confirmaSenha } = req.body;

    // Validar campos obrigatórios
    if (!nome || !email || !cpf || !telefone || !senha || !confirmaSenha) {
        return res.status(400).json({
            status: 'error',
            mensagem: "Todos os dados (nome, email, CPF, telefone, senha) são necessários!"
        });
    }

    // Validar se as senhas coincidem
    if (senha !== confirmaSenha) {
        return res.status(406).json({
            status: 'error',
            mensagem: "As senhas não estão condizentes"
        });
    }

    try {
        // Fazer hash da senha usando bcrypt
        const senhaComHash = await hashSenha(senha);

        // Inserir novo cliente no banco de dados
        const [resultado] = await db.execute(
            "INSERT INTO Clientes(Nome, CPF, Telefone, Email, Senha) VALUES (?, ?, ?, ?, ?)",
            [nome, cpf, telefone, email, senhaComHash]
        );

        return res.status(201).json({
            status: 'success',
            mensagem: "Cadastro realizado com sucesso!",
            usuarioId: resultado.insertId
        });

    } catch (error) {
        console.error("Erro ao cadastrar cliente:", error);

        // Verificar se é erro de email duplicado
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                status: 'error',
                mensagem: "Este email já está registrado."
            });
        }

        return res.status(500).json({
            status: 'error',
            mensagem: "Erro ao cadastrar. Tente novamente."
        });
    }
});

// ============================================
// ROTAS DE PÁGINAS PRIVADAS (PROTEGIDAS)
// ============================================

/**
 * GET /dashboard
 * Rota protegida para funcionarios e gerentes
 * Retorna a página dashboardPedidos.html
 */
app.get("/dashboard", verificarJWT, verificarRole(['funcionario', 'gerente']), (req, res) => {
    res.sendFile(path.join(__dirname, "views", "dashboardPedidos.html"));
});

/**
 * GET /menugerente
 * Rota protegida apenas para gerentes
 * Retorna a página menuGerente.html
 */
app.get("/menugerente", verificarJWT, verificarRole('gerente'), (req, res) => {
    res.sendFile(path.join(__dirname, "views", "menuGerente.html"));
});

/**
 * GET /gerenciar
 * Rota protegida apenas para gerentes
 * Retorna a página gerenciarCardapio.html
 */
app.get("/gerenciar", verificarJWT, verificarRole('gerente'), (req, res) => {
    res.sendFile(path.join(__dirname, "views", "gerenciarCardapio.html"));
});

/**
 * GET /gerenciar-funcionarios
 * Rota protegida apenas para gerentes
 * Retorna a página gerenciarFuncionarios.html
 */
app.get("/gerenciar-funcionarios", verificarJWT, verificarRole('gerente'), (req, res) => {
    res.sendFile(path.join(__dirname, "views", "gerenciarFuncionarios.html"));
});

/**
 * GET /cardapio
 * Rota protegida apenas para clientes
 * Retorna a página cardapioLogado.html
 */
app.get("/cardapio", verificarJWT, verificarRole('cliente'), (req, res) => {
    res.sendFile(path.join(__dirname, "views", "cardapioLogado.html"));
});

// ============================================
// ROTAS DE API PARA FUNCIONÁRIOS
// ============================================

/**
 * GET /api/funcionarios
 * Lista todos os funcionários (apenas gerentes)
 * Requer autenticação JWT e role 'gerente'
 */
app.get('/api/funcionarios', verificarJWT, verificarRole('gerente'), async (req, res) => {
    try {
        const [funcionarios] = await db.execute('SELECT id, Nome, CPF, email, Telefone, Cargo FROM Funcionarios ORDER BY Nome');
        res.status(200).json({
            status: 'success',
            data: funcionarios
        });
    } catch (error) {
        console.error('Erro ao listar funcionários:', error);
        res.status(500).json({
            status: 'error',
            mensagem: 'Erro ao buscar funcionários'
        });
    }
});

/**
 * GET /api/funcionarios/:id
 * Retorna um funcionário específico (apenas gerentes)
 * Requer autenticação JWT e role 'gerente'
 */
app.get('/api/funcionarios/:id', verificarJWT, verificarRole('gerente'), async (req, res) => {
    const { id } = req.params;
    try {
        const [funcionarios] = await db.execute('SELECT id, Nome, CPF, email, Telefone, Cargo FROM Funcionarios WHERE id = ?', [id]);
        if (funcionarios.length === 0) {
            return res.status(404).json({
                status: 'error',
                mensagem: 'Funcionário não encontrado'
            });
        }
        res.status(200).json({
            status: 'success',
            data: funcionarios[0]
        });
    } catch (error) {
        console.error('Erro ao buscar funcionário:', error);
        res.status(500).json({
            status: 'error',
            mensagem: 'Erro ao buscar funcionário'
        });
    }
});

/**
 * POST /api/funcionarios
 * Cria novo funcionário (apenas gerentes)
 * Requer autenticação JWT e role 'gerente'
 */
app.post('/api/funcionarios', verificarJWT, verificarRole('gerente'), async (req, res) => {
    console.log('=== POST /api/funcionarios recebido ===');
    const { Nome, CPF, email, Telefone, Cargo, Senha } = req.body;
    console.log('Dados recebidos:', { Nome, CPF, email, Cargo, Senha: Senha ? '***' : 'vazio' });

    if (!Nome || !CPF || !email || !Cargo || !Senha) {
        return res.status(400).json({
            status: 'error',
            mensagem: 'Nome, CPF, email, cargo e senha são obrigatórios'
        });
    }

    try {
        // Fazer hash da senha usando bcrypt
        console.log('Iniciando hash da senha para funcionário:', Nome);
        const senhaComHash = await hashSenha(Senha);
        console.log('Hash criado com sucesso. Hash length:', senhaComHash.length);

        const [resultado] = await db.execute(
            'INSERT INTO Funcionarios (Nome, CPF, email, Telefone, Cargo, Senha) VALUES (?, ?, ?, ?, ?, ?)',
            [Nome, CPF, email, Telefone || null, Cargo, senhaComHash]
        );
        console.log('Funcionário inserido com ID:', resultado.insertId);
        res.status(201).json({
            status: 'success',
            mensagem: 'Funcionário adicionado com sucesso!',
            id: resultado.insertId
        });
    } catch (error) {
        console.error('=== ERRO AO CRIAR FUNCIONÁRIO ===');
        console.error('Erro:', error.message);
        console.error('Stack:', error.stack);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                status: 'error',
                mensagem: 'Este email ou CPF já está registrado'
            });
        }
        res.status(500).json({
            status: 'error',
            mensagem: 'Erro ao criar funcionário'
        });
    }
});

/**
 * PUT /api/funcionarios/:id
 * Atualiza um funcionário (apenas gerentes)
 * Requer autenticação JWT e role 'gerente'
 */
app.put('/api/funcionarios/:id', verificarJWT, verificarRole('gerente'), async (req, res) => {
    const { id } = req.params;
    const { Nome, CPF, email, Telefone, Cargo, Senha } = req.body;

    if (!Nome || !CPF || !email || !Cargo) {
        return res.status(400).json({
            status: 'error',
            mensagem: 'Nome, CPF, email e cargo são obrigatórios'
        });
    }

    try {
        let query = 'UPDATE Funcionarios SET Nome = ?, CPF = ?, email = ?, Telefone = ?, Cargo = ?';
        let params = [Nome, CPF, email, Telefone || null, Cargo];

        if (Senha) {
            // Fazer hash da senha usando bcrypt
            const senhaComHash = await hashSenha(Senha);
            query += ', Senha = ?';
            params.push(senhaComHash);
        }

        query += ' WHERE id = ?';
        params.push(id);

        const [resultado] = await db.execute(query, params);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                mensagem: 'Funcionário não encontrado'
            });
        }

        res.status(200).json({
            status: 'success',
            mensagem: 'Funcionário atualizado com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao atualizar funcionário:', error);
        res.status(500).json({
            status: 'error',
            mensagem: 'Erro ao atualizar funcionário'
        });
    }
});

/**
 * DELETE /api/funcionarios/:id
 * Deleta um funcionário (apenas gerentes)
 * Requer autenticação JWT e role 'gerente'
 */
app.delete('/api/funcionarios/:id', verificarJWT, verificarRole('gerente'), async (req, res) => {
    const { id } = req.params;

    try {
        const [resultado] = await db.execute('DELETE FROM Funcionarios WHERE id = ?', [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                mensagem: 'Funcionário não encontrado'
            });
        }

        res.status(200).json({
            status: 'success',
            mensagem: 'Funcionário deletado com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao deletar funcionário:', error);
        res.status(500).json({
            status: 'error',
            mensagem: 'Erro ao deletar funcionário'
        });
    }
});

// ============================================
// ROTAS DE API PARA PRODUTOS
// Para rotas de API, adicionar middleware de JWT para maior segurança
// ============================================

/**
 * GET /api/produtos
 * Retorna lista de todos os produtos
 * Requer autenticação JWT
 */
app.get("/api/produtos", verificarJWT, async (req, res) => {
    try {
        const [produtos] = await db.execute("SELECT * FROM Produtos ORDER BY Categoria, Nome");
        res.status(200).json({
            status: 'success',
            data: produtos
        });
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        res.status(500).json({
            status: 'error',
            mensagem: "Erro ao buscar produtos do cardápio"
        });
    }
});

/**
 * GET /public/produtos
 * Retorna lista de todos os produtos sem exigir autenticação (para cardápio público)
 */
app.get("/public/produtos", async (req, res) => {
    try {
        const [produtos] = await db.execute("SELECT * FROM Produtos ORDER BY Categoria, Nome");
        return res.status(200).json({
            status: 'success',
            data: produtos
        });
    } catch (error) {
        console.error("Erro ao buscar produtos (público):", error);
        return res.status(500).json({
            status: 'error',
            mensagem: 'Erro ao buscar produtos do cardápio (público)'
        });
    }
});

/**
 * GET /api/produtos/:id
 * Retorna informações de um produto específico
 * Requer autenticação JWT
 */
app.get("/api/produtos/:id", verificarJWT, async (req, res) => {
    const { id } = req.params;
    try {
        const [produtos] = await db.execute("SELECT * FROM Produtos WHERE ID = ?", [id]);
        if (produtos.length === 0) {
            return res.status(404).json({
                status: 'error',
                mensagem: "Produto não encontrado"
            });
        }
        res.status(200).json({
            status: 'success',
            data: produtos[0]
        });
    } catch (error) {
        console.error("Erro ao buscar produto:", error);
        res.status(500).json({
            status: 'error',
            mensagem: "Erro ao buscar produto"
        });
    }
});

/**
 * POST /api/produtos
 * Cria novo produto (apenas gerentes)
 * Requer autenticação JWT e role 'gerente'
 */
app.post("/api/produtos", verificarJWT, verificarRole('gerente'), async (req, res) => {
    const { nome, categoria, preco, descricao, imagem, disponivel, destaque, quantidade } = req.body;

    if (!nome || !categoria || !preco) {
        return res.status(400).json({
            status: 'error',
            mensagem: "Nome, categoria e preço são obrigatórios"
        });
    }

    try {
        const [resultado] = await db.execute(
            "INSERT INTO Produtos (Nome, Categoria, Preco_Unitario, Descricao, imagem, disponivel, destaque, Quantidade) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [nome, categoria, preco, descricao || null, imagem || null, disponivel !== false, destaque || false, quantidade || 0]
        );
        res.status(201).json({
            status: 'success',
            mensagem: "Produto adicionado com sucesso!",
            id: resultado.insertId
        });
    } catch (error) {
        console.error("Erro ao adicionar produto:", error);
        res.status(500).json({
            status: 'error',
            mensagem: "Erro ao adicionar produto ao cardápio"
        });
    }
});

/**
 * PUT /api/produtos/:id
 * Atualiza um produto (apenas gerentes)
 * Requer autenticação JWT e role 'gerente'
 */
app.put("/api/produtos/:id", verificarJWT, verificarRole('gerente'), async (req, res) => {
    const { id } = req.params;
    const { nome, categoria, preco, descricao, imagem, disponivel, destaque, quantidade } = req.body;

    if (!nome || !categoria || !preco) {
        return res.status(400).json({
            status: 'error',
            mensagem: "Nome, categoria e preço são obrigatórios"
        });
    }

    try {
        const [resultado] = await db.execute(
            "UPDATE Produtos SET Nome = ?, Categoria = ?, Preco_Unitario = ?, Descricao = ?, imagem = ?, disponivel = ?, destaque = ?, Quantidade = ? WHERE ID = ?",
            [nome, categoria, preco, descricao || null, imagem || null, disponivel !== false, destaque || false, quantidade || 0, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                mensagem: "Produto não encontrado"
            });
        }

        res.status(200).json({
            status: 'success',
            mensagem: "Produto atualizado com sucesso!"
        });
    } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        res.status(500).json({
            status: 'error',
            mensagem: "Erro ao atualizar produto"
        });
    }
});

/**
 * DELETE /api/produtos/:id
 * Deleta um produto (apenas gerentes)
 * Requer autenticação JWT e role 'gerente'
 */
app.delete("/api/produtos/:id", verificarJWT, verificarRole('gerente'), async (req, res) => {
    const { id } = req.params;

    try {
        const [resultado] = await db.execute("DELETE FROM Produtos WHERE ID = ?", [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                mensagem: "Produto não encontrado"
            });
        }

        res.status(200).json({
            status: 'success',
            mensagem: "Produto excluído com sucesso!"
        });
    } catch (error) {
        console.error("Erro ao excluir produto:", error);
        res.status(500).json({
            status: 'error',
            mensagem: "Erro ao excluir produto"
        });
    }
});

/**
 * PATCH /api/produtos/:id/disponibilidade
 * Atualiza disponibilidade de um produto (apenas gerentes)
 * Requer autenticação JWT e role 'gerente'
 */
app.patch("/api/produtos/:id/disponibilidade", verificarJWT, verificarRole('gerente'), async (req, res) => {
    const { id } = req.params;
    const { disponivel } = req.body;

    try {
        const [resultado] = await db.execute(
            "UPDATE Produtos SET disponivel = ? WHERE ID = ?",
            [disponivel !== false, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                mensagem: "Produto não encontrado"
            });
        }

        res.status(200).json({
            status: 'success',
            mensagem: "Disponibilidade atualizada com sucesso!"
        });
    } catch (error) {
        console.error("Erro ao atualizar disponibilidade:", error);
        res.status(500).json({
            status: 'error',
            mensagem: "Erro ao atualizar disponibilidade"
        });
    }
});

// ============================================
// ROTAS DE PEDIDOS
// ============================================

/**
 * GET /api/pedidos/listar
 * Lista todos os pedidos (apenas funcionários e gerentes)
 * Requer autenticação JWT
 */
app.get("/api/pedidos/listar", verificarJWT, verificarRole(['funcionario', 'gerente']), async (req, res) => {

    const sqlQuery = `
        SELECT 
            p.ID,
            p.Horario_Pedido,
            p.Valor,
            p.Forma_Pagamento,
            p.Status,
            p.Tipo_Pedido,
            c.Nome AS ClienteNome,
            c.CPF AS ClienteCPF,
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
        GROUP BY p.ID, p.Horario_Pedido, p.Valor, p.Forma_Pagamento, p.Status, p.Tipo_Pedido, c.Nome, c.CPF
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

/**
 * POST /api/pedidos
 * Cria um novo pedido no banco de dados
 * Requer autenticação JWT (tipo 'cliente')
 */
app.post("/api/pedidos", verificarJWT, verificarRole('cliente'), async (req, res) => {
    const {
        itens,
        total,
        formaPagamento,
        tipoPedido,
        enderecoInfo
    } = req.body;

    const idCliente = req.usuario.id || req.usuario.ID;

    if (!idCliente) {
        return res.status(401).json({
            status: 'error',
            mensagem: 'Sessão inválida ou expirada. Por favor, saia e faça login novamente.'
        });
    }

    if (!itens || !itens.length || !total || !formaPagamento || !tipoPedido) {
        return res.status(400).json({
            status: 'error',
            mensagem: 'Dados do pedido incompletos.'
        });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Inserir na tabela Pedidos
        const [resultPedido] = await connection.execute(
            `INSERT INTO Pedidos (
                ID_Cliente, Forma_Pagamento, Status, Valor, Horario_Pedido, 
                Tipo_Pedido, Endereco, Numero, Bairro, Cidade, CEP, Complemento
            ) VALUES (?, ?, 'novo', ?, NOW(), ?, ?, ?, ?, ?, ?, ?)`,
            [
                idCliente || null,
                formaPagamento || null,
                total || 0,
                tipoPedido || 'delivery',
                (tipoPedido === 'delivery' && enderecoInfo ? enderecoInfo.endereco : null) || null,
                (tipoPedido === 'delivery' && enderecoInfo ? enderecoInfo.numero : null) || null,
                (tipoPedido === 'delivery' && enderecoInfo ? enderecoInfo.bairro : null) || null,
                (tipoPedido === 'delivery' && enderecoInfo ? enderecoInfo.cidade : null) || null,
                (tipoPedido === 'delivery' && enderecoInfo ? enderecoInfo.cep : null) || null,
                (tipoPedido === 'delivery' && enderecoInfo ? enderecoInfo.complemento : null) || null
            ]
        );

        const idPedido = resultPedido.insertId;

        // 2. Inserir itens na tabela Itens_Pedidos
        for (const item of itens) {
            await connection.execute(
                `INSERT INTO Itens_Pedidos (ID_Pedido, ID_Produto, Quantidade, Preco_Venda)
                 VALUES (?, ?, ?, ?)`,
                [idPedido, item.id, item.quantity, item.price]
            );
        }

        await connection.commit();

        res.status(201).json({
            status: 'success',
            mensagem: 'Pedido realizado com sucesso!',
            idPedido: idPedido
        });

    } catch (error) {
        await connection.rollback();
        console.error("Erro ao salvar pedido:", error);
        res.status(500).json({
            status: 'error',
            mensagem: 'Erro ao processar o pedido. Tente novamente.'
        });
    } finally {
        connection.release();
    }
});

/**
 * GET /api/pedidos/:id
 * Retorna detalhes de um pedido específico
 * Requer autenticação JWT
 */
/**
 * GET /api/pedidos/contagem?status=novo
 * Conta os pedidos por status
 * Requer autenticação JWT e role de funcionario ou gerente
 */
app.get('/api/pedidos/contagem', verificarJWT, verificarRole(['funcionario', 'gerente']), async (req, res) => {
    const status = req.query.status;

    if (!status) {
        return res.status(400).json({
            status: 'error',
            message: 'O parâmetro "status" é obrigatório.'
        });
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

app.get("/api/pedidos/:id", verificarJWT, async (req, res) => {
    const id = req.params.id;

    const sqlQuery = `
        SELECT 
            p.ID,
            p.Valor,
            p.Status,
            p.Forma_Pagamento,
            p.Tipo_Pedido,
            CASE 
                WHEN p.Tipo_Pedido = 'pickup' THEN 'Retirada na Loja'
                ELSE CONCAT(p.Endereco, ', ', p.Numero, ' - ', p.Bairro, ', ', p.Cidade, ' - CEP: ', p.CEP, IF(p.Complemento IS NOT NULL AND p.Complemento != '', CONCAT(' (', p.Complemento, ')'), ''))
            END AS EnderecoEntrega,
            'Sem picles e maionese no acompanhamento' AS Observacoes, 
            c.Nome AS ClienteNome,
            c.CPF AS ClienteCPF,
            f.Nome AS FuncionarioNome,
            GROUP_CONCAT(
                CONCAT(ip.Quantidade, 'x ', pr.Nome) 
                ORDER BY pr.Nome ASC 
                SEPARATOR '||' 
            ) AS ItensDetalhes 
        FROM Pedidos p
        JOIN Clientes c ON p.ID_Cliente = c.ID
        LEFT JOIN Funcionarios f ON p.ID_Funcionario = f.ID
        JOIN Itens_Pedidos ip ON p.ID = ip.ID_Pedido
        JOIN Produtos pr ON ip.ID_Produto = pr.ID
        WHERE p.ID = ?
        GROUP BY 
            p.ID, p.Valor, p.Status, p.Forma_Pagamento, p.Tipo_Pedido, p.Endereco, p.Numero, p.Bairro, p.Cidade, p.CEP, p.Complemento, c.Nome, c.CPF, f.Nome;
    `;

    try {
        const [rows] = await db.execute(sqlQuery, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Pedido não encontrado.'
            });
        }

        res.status(200).json({
            status: 'success',
            data: rows[0]
        });

    } catch (err) {
        console.error(`Erro ao buscar detalhes do pedido ${id}:`, err);
        res.status(500).json({
            status: 'error',
            message: 'Erro interno do servidor.'
        });
    }
});

// ============================================
// INICIALIZAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║   Servidor rodando em funcionamento!   ║
    ║   http://localhost:${PORT}                     ║
    ║   Modo: ${process.env.NODE_ENV || 'development'}                ║
    ╚════════════════════════════════════════╝
    `);
});

// ============================================
// TRATAMENTO DE ERROS GLOBAL
// ============================================

// Rota não encontrada (404)
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        mensagem: 'Rota não encontrada.'
    });
});

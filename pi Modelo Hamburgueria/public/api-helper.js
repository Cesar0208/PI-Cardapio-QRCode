/**
 * 🔐 EXEMPLO DE USO DO JWT NAS PÁGINAS PRIVADAS
 * 
 * Inclua este arquivo nas páginas de /views para protegê-las
 * e ter acesso aos dados do usuário autenticado
 */

// URL base da API (dinâmica)
const API_BASE = window.location.origin || 'http://localhost:3000';

// ============================================
// 1️⃣ VALIDAR AUTENTICAÇÃO NA CARGA DA PÁGINA
// ============================================

// Este código executa quando a página carrega
document.addEventListener('DOMContentLoaded', async () => {
    // Validar se o usuário está autenticado
    const usuarioValido = await validarAutenticacao();
    
    if (!usuarioValido) {
        // Se não estiver autenticado, redirecionar para login
        window.location.href = '/login';
    }
});

/**
 * Valida se o usuário possui um token JWT válido
 * Faz uma requisição ao servidor para verificar
 * @returns {Promise<boolean>} true se autenticado, false caso contrário
 */
async function validarAutenticacao() {
    try {
        const res = await fetch(`${API_BASE}/api/produtos`, {
            method: 'GET',
            credentials: 'include' // Enviar cookie com JWT
        });

        // 401 = Token não fornecido ou expirado
        if (res.status === 401) {
            console.warn('Sessão expirada. Faça login novamente.');
            return false;
        }

        // Se conseguir acessar a rota protegida, está autenticado
        return res.ok;

    } catch (error) {
        console.error('Erro ao validar autenticação:', error);
        return false;
    }
}

// ============================================
// 2️⃣ FAZER REQUISIÇÕES PROTEGIDAS À API
// ============================================

/**
 * Buscar produtos da API com autenticação
 */
async function buscarProdutos() {
    try {
        const res = await fetch(`${API_BASE}/api/produtos`, {
            method: 'GET',
            credentials: 'include' // ← Importante!
        });

        if (res.status === 401) {
            alert('Sua sessão expirou. Faça login novamente.');
            window.location.href = '/login';
            return null;
        }

        if (!res.ok) {
            throw new Error(`Erro ${res.status}: ${res.statusText}`);
        }

        const { status, data } = await res.json();
        return data;

    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        return null;
    }
}

/**
 * Listar pedidos (apenas para funcionários e gerentes)
 */
async function listarPedidos() {
    try {
        const res = await fetch(`${API_BASE}/api/pedidos/listar`, {
            method: 'GET',
            credentials: 'include'
        });

        if (res.status === 403) {
            alert('Você não tem permissão para visualizar pedidos.');
            return null;
        }

        if (res.status === 401) {
            window.location.href = '/login';
            return null;
        }

        if (!res.ok) {
            throw new Error(`Erro ${res.status}`);
        }

        const { data } = await res.json();
        return data;

    } catch (error) {
        console.error('Erro ao listar pedidos:', error);
        return null;
    }
}

/**
 * Criar novo produto (apenas gerentes)
 */
async function criarProduto(produto) {
    try {
        const res = await fetch(`${API_BASE}/api/produtos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(produto)
        });

        if (res.status === 403) {
            alert('Apenas gerentes podem criar produtos.');
            return null;
        }

        if (res.status === 401) {
            window.location.href = '/login';
            return null;
        }

        if (!res.ok) {
            const { mensagem } = await res.json();
            throw new Error(mensagem);
        }

        const { mensagem, id } = await res.json();
        alert(mensagem);
        return id;

    } catch (error) {
        console.error('Erro ao criar produto:', error);
        alert('Erro: ' + error.message);
        return null;
    }
}

/**
 * Atualizar produto (apenas gerentes)
 */
async function atualizarProduto(id, produto) {
    try {
        const res = await fetch(`${API_BASE}/api/produtos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(produto)
        });

        if (res.status === 403) {
            alert('Apenas gerentes podem editar produtos.');
            return false;
        }

        if (res.status === 401) {
            window.location.href = '/login';
            return false;
        }

        if (!res.ok) {
            const { mensagem } = await res.json();
            throw new Error(mensagem);
        }

        const { mensagem } = await res.json();
        alert(mensagem);
        return true;

    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        alert('Erro: ' + error.message);
        return false;
    }
}

/**
 * Deletar produto (apenas gerentes)
 */
async function deletarProduto(id) {
    try {
        const confirmacao = confirm('Tem certeza que deseja deletar este produto?');
        if (!confirmacao) return false;

        const res = await fetch(`${API_BASE}/api/produtos/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (res.status === 403) {
            alert('Apenas gerentes podem deletar produtos.');
            return false;
        }

        if (res.status === 401) {
            window.location.href = '/login';
            return false;
        }

        if (!res.ok) {
            const { mensagem } = await res.json();
            throw new Error(mensagem);
        }

        const { mensagem } = await res.json();
        alert(mensagem);
        return true;

    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        alert('Erro: ' + error.message);
        return false;
    }
}

// ============================================
// 3️⃣ FAZER LOGOUT
// ============================================

/**
 * Fazer logout e retornar à página de login
 */
async function fazerLogout() {
    try {
        const res = await fetch(`${API_BASE}/logout`, {
            method: 'POST',
            credentials: 'include'
        });

        if (res.ok) {
            // Cookie JWT foi removido pelo servidor
            // Redirecionar para login
            window.location.href = '/login';
        }

    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        // Mesmo com erro, tente redirecionar
        window.location.href = '/login';
    }
}

// ============================================
// 4️⃣ MANIPULADOR DE ERROS GLOBAL
// ============================================

/**
 * Trata erros de autenticação em toda a página
 * Pode ser usado como wrapper em todas as requisições
 */
async function requisicaoSegura(url, opcoes = {}) {
    try {
        // Garantir que credentials está ativado
        opcoes.credentials = 'include';

        // Se a URL não começa com http, adicionar base
        const urlCompleta = url.startsWith('http') ? url : `${API_BASE}${url}`;
        const res = await fetch(urlCompleta, opcoes);

        // Tratamento automático de erros de autenticação
        if (res.status === 401) {
            alert('Sua sessão expirou. Faça login novamente.');
            window.location.href = '/login';
            return null;
        }

        if (res.status === 403) {
            alert('Você não tem permissão para acessar este recurso.');
            return null;
        }

        if (!res.ok) {
            const dados = await res.json();
            throw new Error(dados.mensagem || `Erro ${res.status}`);
        }

        return await res.json();

    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
}

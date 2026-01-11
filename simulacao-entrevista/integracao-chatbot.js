// ==========================================
// INTEGRAÇÃO COM CHATBOT EMPREGALAB
// ==========================================

// Este arquivo mostra como integrar a simulação de entrevista
// com o chatbot existente do EmpregaLAB

// ==========================================
// OPÇÃO 1: INTEGRAÇÃO DIRETA NO CHAT
// ==========================================

/**
 * Adicione esta função no seu chatbot principal
 */
function detectarIntentoEntrevista(mensagemUsuario) {
    const keywordsEntrevista = [
        'entrevista',
        'simulação',
        'simular',
        'praticar entrevista',
        'treinar entrevista',
        'preparar entrevista',
        'mock interview'
    ];
    
    const mensagemLower = mensagemUsuario.toLowerCase();
    return keywordsEntrevista.some(keyword => mensagemLower.includes(keyword));
}

/**
 * Fluxo conversacional para redirecionar à simulação
 */
function responderSobreEntrevista(mensagemUsuario) {
    if (detectarIntentoEntrevista(mensagemUsuario)) {
        return `
            <div class="chatbot-message">
                <p>🎭 Ótimo! Temos uma simulação completa de entrevista para você!</p>
                
                <div class="simulacao-card">
                    <h3>Simulação de Entrevista Inteligente</h3>
                    <ul>
                        <li>✅ 7 perguntas profissionais</li>
                        <li>🤖 Feedback com IA em tempo real</li>
                        <li>📊 Análise detalhada do seu desempenho</li>
                        <li>💡 Dicas e recomendações personalizadas</li>
                    </ul>
                    
                    <button onclick="abrirSimulacaoEntrevista()" class="btn-primary">
                        Iniciar Simulação
                    </button>
                </div>
                
                <p><small>Ou você prefere que eu te dê algumas dicas sobre entrevistas primeiro?</small></p>
            </div>
        `;
    }
}

/**
 * Função para abrir a simulação
 */
function abrirSimulacaoEntrevista() {
    // Opção A: Abrir em nova aba
    window.open('simulacao-entrevista/simulacao-entrevista.html', '_blank');
    
    // OU Opção B: Redirecionar na mesma página
    // window.location.href = 'simulacao-entrevista/simulacao-entrevista.html';
    
    // OU Opção C: Abrir em modal/iframe
    // abrirModalSimulacao();
}

// ==========================================
// OPÇÃO 2: MENU DE AÇÕES NO CHATBOT
// ==========================================

/**
 * Adicione um menu de quick actions no chatbot
 */
const quickActions = [
    {
        icon: '🎭',
        label: 'Simular Entrevista',
        action: () => abrirSimulacaoEntrevista()
    },
    {
        icon: '📝',
        label: 'Dicas de Currículo',
        action: () => enviarMensagem('Me dê dicas de currículo')
    },
    {
        icon: '💼',
        label: 'Soft Skills',
        action: () => enviarMensagem('Quero desenvolver soft skills')
    }
];

/**
 * Renderizar quick actions
 */
function renderizarQuickActions() {
    const container = document.getElementById('quick-actions-container');
    
    quickActions.forEach(action => {
        const button = document.createElement('button');
        button.className = 'quick-action-btn';
        button.innerHTML = `
            <span class="icon">${action.icon}</span>
            <span class="label">${action.label}</span>
        `;
        button.onclick = action.action;
        container.appendChild(button);
    });
}

// ==========================================
// OPÇÃO 3: FLUXO CONVERSACIONAL COMPLETO
// ==========================================

/**
 * Sistema de intenção para entrevistas
 */
class EntrevistaIntentHandler {
    constructor() {
        this.state = {
            usuarioQuerSimulacao: false,
            tipoAjuda: null // 'dicas' | 'simulacao' | 'perguntas'
        };
    }
    
    processar(mensagem) {
        const mensagemLower = mensagem.toLowerCase();
        
        // Detectar intenção inicial
        if (this.detectarIntencaoEntrevista(mensagemLower)) {
            this.state.usuarioQuerSimulacao = true;
            return this.oferecerOpcoes();
        }
        
        // Usuário escolheu simulação
        if (this.state.usuarioQuerSimulacao) {
            if (mensagemLower.includes('simul') || mensagemLower.includes('pratic')) {
                return this.iniciarSimulacao();
            }
            
            if (mensagemLower.includes('dica') || mensagemLower.includes('conselho')) {
                this.state.tipoAjuda = 'dicas';
                return this.darDicasEntrevista();
            }
            
            if (mensagemLower.includes('pergunta') || mensagemLower.includes('questão')) {
                this.state.tipoAjuda = 'perguntas';
                return this.listarPerguntasComuns();
            }
        }
        
        return null;
    }
    
    detectarIntencaoEntrevista(mensagem) {
        const keywords = ['entrevista', 'seleção', 'vaga', 'emprego', 'recrutamento'];
        return keywords.some(k => mensagem.includes(k));
    }
    
    oferecerOpcoes() {
        return `
            <div class="chatbot-response">
                <p>Posso te ajudar com entrevistas de várias formas:</p>
                
                <div class="opcoes-entrevista">
                    <button onclick="chatbot.processarMensagem('quero fazer a simulação')">
                        🎭 Fazer Simulação Completa
                    </button>
                    <button onclick="chatbot.processarMensagem('me dê dicas de entrevista')">
                        💡 Receber Dicas e Conselhos
                    </button>
                    <button onclick="chatbot.processarMensagem('mostrar perguntas comuns')">
                        ❓ Ver Perguntas Comuns
                    </button>
                </div>
                
                <p>O que você prefere?</p>
            </div>
        `;
    }
    
    iniciarSimulacao() {
        return `
            <div class="chatbot-response">
                <h3>🎭 Simulação de Entrevista</h3>
                <p>Vou te direcionar para nossa simulação completa!</p>
                
                <div class="info-simulacao">
                    <h4>O que você vai encontrar:</h4>
                    <ul>
                        <li>✅ 7 perguntas selecionadas aleatoriamente</li>
                        <li>🤖 Análise com Inteligência Artificial</li>
                        <li>⏱️ Timer para simular pressão real</li>
                        <li>📊 Relatório completo de desempenho</li>
                        <li>💡 Recomendações personalizadas</li>
                    </ul>
                </div>
                
                <button onclick="abrirSimulacaoEntrevista()" class="btn-iniciar-simulacao">
                    Começar Agora →
                </button>
            </div>
        `;
    }
    
    darDicasEntrevista() {
        return `
            <div class="chatbot-response">
                <h3>💡 Dicas para Entrevistas</h3>
                
                <div class="dica-card">
                    <h4>1. Prepare-se com Antecedência</h4>
                    <p>Pesquise sobre a empresa, vaga e cultura organizacional.</p>
                </div>
                
                <div class="dica-card">
                    <h4>2. Use o Método STAR</h4>
                    <p><strong>S</strong>ituação, <strong>T</strong>arefa, <strong>A</strong>ção, <strong>R</strong>esultado</p>
                </div>
                
                <div class="dica-card">
                    <h4>3. Pratique Suas Respostas</h4>
                    <p>Simule entrevistas em voz alta ou com amigos.</p>
                </div>
                
                <p>Quer praticar agora com nossa <button onclick="abrirSimulacaoEntrevista()">simulação interativa</button>?</p>
            </div>
        `;
    }
    
    listarPerguntasComuns() {
        return `
            <div class="chatbot-response">
                <h3>❓ Perguntas Mais Comuns em Entrevistas</h3>
                
                <div class="pergunta-comum">
                    <strong>1. Fale um pouco sobre você</strong>
                    <p><small>Dica: Foque em sua trajetória profissional, não pessoal</small></p>
                </div>
                
                <div class="pergunta-comum">
                    <strong>2. Quais são seus pontos fortes?</strong>
                    <p><small>Dica: Cite 2-3 pontos com exemplos concretos</small></p>
                </div>
                
                <div class="pergunta-comum">
                    <strong>3. Por que você quer trabalhar aqui?</strong>
                    <p><small>Dica: Mostre conhecimento sobre a empresa</small></p>
                </div>
                
                <p>Temos 20 perguntas na nossa <button onclick="abrirSimulacaoEntrevista()">simulação completa</button>!</p>
            </div>
        `;
    }
}

// ==========================================
// OPÇÃO 4: INTEGRAÇÃO COM ESTADO DO CHATBOT
// ==========================================

/**
 * Se seu chatbot usa um sistema de estado/contexto
 */
class ChatbotState {
    constructor() {
        this.contexto = null;
        this.historico = [];
    }
    
    setContexto(contexto) {
        this.contexto = contexto;
    }
    
    processarMensagem(mensagem) {
        // Se usuário está no contexto de entrevista
        if (this.contexto === 'entrevista') {
            return this.processarContextoEntrevista(mensagem);
        }
        
        // Detectar nova intenção de entrevista
        if (this.detectarIntencaoEntrevista(mensagem)) {
            this.setContexto('entrevista');
            return this.iniciarFluxoEntrevista();
        }
        
        // Processar outras mensagens...
        return this.processarMensagemGeral(mensagem);
    }
    
    processarContextoEntrevista(mensagem) {
        const entrevistaHandler = new EntrevistaIntentHandler();
        return entrevistaHandler.processar(mensagem);
    }
    
    detectarIntencaoEntrevista(mensagem) {
        // Lógica de detecção...
        return mensagem.toLowerCase().includes('entrevista');
    }
    
    iniciarFluxoEntrevista() {
        return `
            Vejo que você quer praticar para entrevistas! 
            Posso te ajudar de várias formas. O que prefere?
            
            1️⃣ Fazer uma simulação completa
            2️⃣ Receber dicas gerais
            3️⃣ Ver perguntas comuns
        `;
    }
}

// ==========================================
// OPÇÃO 5: WIDGET/CARD NO CHAT
// ==========================================

/**
 * Criar um card visual no chat
 */
function criarCardSimulacao() {
    return `
        <div class="simulacao-widget">
            <div class="widget-header">
                <span class="widget-icon">🎭</span>
                <h4>Simulação de Entrevista</h4>
            </div>
            
            <div class="widget-body">
                <p>Pratique suas habilidades com feedback de IA!</p>
                
                <div class="widget-stats">
                    <div class="stat">
                        <span class="stat-number">7</span>
                        <span class="stat-label">Perguntas</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">20</span>
                        <span class="stat-label">Min</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">100</span>
                        <span class="stat-label">Pontos</span>
                    </div>
                </div>
                
                <button onclick="abrirSimulacaoEntrevista()" class="widget-btn">
                    Começar Agora
                </button>
            </div>
        </div>
    `;
}

/**
 * Inserir card no fluxo do chat
 */
function adicionarMensagemComCard(texto, mostrarCard = false) {
    const mensagem = {
        tipo: 'bot',
        conteudo: texto,
        widget: mostrarCard ? criarCardSimulacao() : null,
        timestamp: new Date()
    };
    
    renderizarMensagem(mensagem);
}

// ==========================================
// ESTILOS CSS PARA INTEGRAÇÃO
// ==========================================

const estilosIntegracao = `
<style>
.simulacao-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 12px;
    margin: 15px 0;
}

.simulacao-card h3 {
    margin: 0 0 15px 0;
    font-size: 1.2rem;
}

.simulacao-card ul {
    list-style: none;
    padding: 0;
    margin: 15px 0;
}

.simulacao-card li {
    padding: 8px 0;
    font-size: 0.95rem;
}

.btn-iniciar-simulacao {
    background: white;
    color: #667eea;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    width: 100%;
    margin-top: 15px;
}

.btn-iniciar-simulacao:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.quick-action-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: #f0f0f0;
    border: none;
    border-radius: 20px;
    margin: 5px;
    cursor: pointer;
    transition: all 0.2s;
}

.quick-action-btn:hover {
    background: #667eea;
    color: white;
}

.simulacao-widget {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin: 15px 0;
}

.widget-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.widget-icon {
    font-size: 1.5rem;
}

.widget-body {
    padding: 20px;
}

.widget-stats {
    display: flex;
    justify-content: space-around;
    margin: 20px 0;
}

.stat {
    text-align: center;
}

.stat-number {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: #667eea;
}

.stat-label {
    display: block;
    font-size: 0.85rem;
    color: #666;
}

.opcoes-entrevista {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 15px 0;
}

.opcoes-entrevista button {
    padding: 12px;
    background: white;
    border: 2px solid #667eea;
    color: #667eea;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 600;
}

.opcoes-entrevista button:hover {
    background: #667eea;
    color: white;
}

.dica-card,
.pergunta-comum {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    margin: 10px 0;
    border-left: 4px solid #667eea;
}
</style>
`;

// ==========================================
// EXEMPLO DE USO COMPLETO
// ==========================================

/**
 * Exemplo de integração completa no chatbot
 */
class ChatbotEmpregaLAB {
    constructor() {
        this.entrevistaHandler = new EntrevistaIntentHandler();
        this.state = new ChatbotState();
    }
    
    processarMensagem(mensagem) {
        // Tentar processar como intenção de entrevista
        const respostaEntrevista = this.entrevistaHandler.processar(mensagem);
        
        if (respostaEntrevista) {
            return respostaEntrevista;
        }
        
        // Processar outras intenções...
        return this.processarOutrasIntencoes(mensagem);
    }
    
    processarOutrasIntencoes(mensagem) {
        // Lógica para outras funcionalidades do chatbot
        return "Como posso ajudar você?";
    }
}

// Inicializar
const chatbot = new ChatbotEmpregaLAB();

// Exportar para uso global
window.abrirSimulacaoEntrevista = abrirSimulacaoEntrevista;
window.chatbot = chatbot;
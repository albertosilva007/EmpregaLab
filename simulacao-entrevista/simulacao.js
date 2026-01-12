// === ESTADO DA SIMULAÇÃO ===
const simulacao = {
    perguntas: [],
    perguntaAtual: 0,
    respostas: [],
    tempoInicio: null,
    timerInterval: null,
    audioRecorder: null,
    audioEnabled: true,
    dicasEnabled: true,
    pontuacaoTotal: 0
};

let mediaRecorder = null;
let audioChunks = [];
let audioStream = null;
let isRecording = false;

// === INICIALIZAÇÃO ===
document.addEventListener('DOMContentLoaded', () => {
    console.log('Sistema de Simulação de Entrevista iniciado');
    const textarea = document.getElementById('resposta-texto');
    if (textarea) {
        textarea.addEventListener('input', atualizarContador);
    }
});

function iniciarSimulacao() {
    console.log('Iniciando simulação...');
    simulacao.audioEnabled = document.getElementById('audio-enable').checked;
    simulacao.dicasEnabled = document.getElementById('dicas-enable').checked;
    
    // Fallback caso a função selecionarPerguntas esteja em outro script
    if (typeof selecionarPerguntas === 'function') {
        simulacao.perguntas = selecionarPerguntas(7);
    } else {
        // Banco de perguntas reserva caso o script externo falhe
        simulacao.perguntas = [
            { pergunta: "Fale um pouco sobre você.", categoria: "Autoconhecimento" },
            { pergunta: "Quais são seus pontos fortes?", categoria: "Autoconhecimento" },
            { pergunta: "Por que você quer trabalhar aqui?", categoria: "Motivação" },
            { pergunta: "Conte sobre um desafio que você superou.", categoria: "Comportamental" },
            { pergunta: "Onde você se vê em 5 anos?", categoria: "Motivação" },
            { pergunta: "Como você lida com pressão?", categoria: "Comportamental" },
            { pergunta: "Quais são suas principais fraquezas?", categoria: "Autoconhecimento" }
        ];
    }

    simulacao.perguntaAtual = 0;
    simulacao.respostas = [];
    simulacao.pontuacaoTotal = 0;
    simulacao.tempoInicio = Date.now();
    
    iniciarTimer();
    trocarTela('tela-inicial', 'tela-entrevista');
    carregarPergunta();
    
    // Esconder feedback inicialmente
    const feedbackSection = document.getElementById('feedback-section');
    if (feedbackSection) feedbackSection.style.display = 'none';
}

function trocarTela(telaAtual, proximaTela) {
    const atual = document.getElementById(telaAtual);
    const proxima = document.getElementById(proximaTela);
    
    if (atual) atual.classList.remove('active');
    if (proxima) proxima.classList.add('active');
}

function iniciarTimer() {
    const timerElement = document.getElementById('timer');
    if (simulacao.timerInterval) clearInterval(simulacao.timerInterval);
    
    simulacao.timerInterval = setInterval(() => {
        const tempoDecorrido = Date.now() - simulacao.tempoInicio;
        const minutos = Math.floor(tempoDecorrido / 60000);
        const segundos = Math.floor((tempoDecorrido % 60000) / 1000);
        timerElement.textContent = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
    }, 1000);
}

function carregarPergunta() {
    const pergunta = simulacao.perguntas[simulacao.perguntaAtual];
    document.getElementById('pergunta-atual').textContent = `Pergunta ${simulacao.perguntaAtual + 1} de ${simulacao.perguntas.length}`;
    document.getElementById('pergunta-texto').textContent = pergunta.pergunta;
    document.getElementById('categoria-badge').textContent = pergunta.categoria;
    document.getElementById('resposta-texto').value = '';
    atualizarContador();
    
    // Resetar dicas
    const dicasContent = document.getElementById('dicas-content');
    if (dicasContent) dicasContent.style.display = 'none';
    
    const btnDicas = document.querySelector('.btn-dicas');
    if (btnDicas) btnDicas.textContent = '💡 Ver Dicas';
    
    // Esconder feedback
    const feedbackSection = document.getElementById('feedback-section');
    if (feedbackSection) feedbackSection.style.display = 'none';
    
    // Mostrar/esconder seção de dicas baseado na configuração
    const dicasSection = document.getElementById('dicas-section');
    if (dicasSection) {
        dicasSection.style.display = simulacao.dicasEnabled ? 'block' : 'none';
    }
    
    // Reabilitar botão enviar
    const btnEnviar = document.getElementById('btn-enviar');
    if (btnEnviar) {
        btnEnviar.disabled = false;
        btnEnviar.textContent = 'Enviar Resposta ';
        btnEnviar.innerHTML = `Enviar Resposta
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>`;
    }
}

function atualizarContador() {
    const textarea = document.getElementById('resposta-texto');
    if (textarea) {
        const count = textarea.value.length;
        document.getElementById('char-count').textContent = `${count} / 500 caracteres`;
    }
}

// === SISTEMA DE DICAS ===
function toggleDicas() {
    if (!simulacao.dicasEnabled) {
        alert('Dicas estão desabilitadas nas configurações.');
        return;
    }
    
    const dicasContent = document.getElementById('dicas-content');
    const btnDicas = document.querySelector('.btn-dicas');
    
    if (dicasContent.style.display === 'none' || dicasContent.style.display === '') {
        carregarDicas();
        dicasContent.style.display = 'block';
        if (btnDicas) btnDicas.textContent = '💡 Ocultar Dicas';
    } else {
        dicasContent.style.display = 'none';
        if (btnDicas) btnDicas.textContent = '💡 Ver Dicas';
    }
}

function carregarDicas() {
    const pergunta = simulacao.perguntas[simulacao.perguntaAtual];
    const dicasLista = document.getElementById('dicas-lista');
    
    // Dicas por categoria
    const dicasPorCategoria = {
        'Autoconhecimento': [
            'Seja autêntico e específico sobre suas experiências',
            'Use exemplos concretos da sua trajetória',
            'Conecte suas qualidades com os requisitos da vaga',
            'Mostre autoconhecimento equilibrado (forças e áreas de desenvolvimento)'
        ],
        'Motivação': [
            'Demonstre pesquisa prévia sobre a empresa',
            'Conecte seus valores pessoais com os da organização',
            'Seja específico sobre o que te atrai na vaga',
            'Evite respostas genéricas como "estabilidade" ou "salário"'
        ],
        'Comportamental': [
            'Use a técnica STAR (Situação, Tarefa, Ação, Resultado)',
            'Dê exemplos reais e mensuráveis',
            'Mostre aprendizados obtidos',
            'Seja honesto sobre desafios enfrentados'
        ],
        'Técnica': [
            'Demonstre conhecimento técnico relevante',
            'Cite projetos ou experiências práticas',
            'Mostre disposição para aprender',
            'Seja objetivo e claro na explicação'
        ],
        'Situacional': [
            'Pense na solução mais profissional e ética',
            'Considere diferentes perspectivas',
            'Mostre raciocínio estruturado',
            'Demonstre inteligência emocional'
        ]
    };
    
    const dicas = dicasPorCategoria[pergunta.categoria] || [
        'Seja claro e objetivo na resposta',
        'Use exemplos concretos',
        'Demonstre profissionalismo',
        'Seja honesto e autêntico'
    ];
    
    dicasLista.innerHTML = dicas.map(dica => `<li>${dica}</li>`).join('');
}

// === CONTROLE DE ÁUDIO ===
async function toggleAudio() {
    if (!simulacao.audioEnabled) {
        alert('Gravação de áudio está desabilitada nas configurações.');
        return;
    }
    
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

async function startRecording() {
    try {
        audioChunks = [];
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
                         ? 'audio/webm;codecs=opus' 
                         : 'audio/webm';

        mediaRecorder = new MediaRecorder(audioStream, { mimeType });

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
            await enviarAudioParaTranscricao(audioBlob);
        };

        mediaRecorder.start();
        isRecording = true;
        document.getElementById('btn-audio').classList.add('recording');
        document.getElementById('audio-status').textContent = 'Gravando...';
    } catch (err) {
        console.error("Erro ao acessar microfone:", err);
        alert("Microfone não disponível ou permissão negada.");
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        audioStream.getTracks().forEach(t => t.stop());
        isRecording = false;
        document.getElementById('btn-audio').classList.remove('recording');
        document.getElementById('audio-status').textContent = 'Processando...';
    }
}

async function enviarAudioParaTranscricao(audioBlob) {
    try {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'answer.webm');
        formData.append('perguntaTexto', document.getElementById('pergunta-texto').textContent);

        const response = await fetch('/api/entrevista/transcrever', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.detalhes || 'Erro no servidor');

        if (data.transcricao) {
            const textarea = document.getElementById('resposta-texto');
            textarea.value = data.transcricao;
            atualizarContador();
        }
        document.getElementById('audio-status').textContent = 'Gravar Áudio';
    } catch (error) {
        console.error("Erro na transcrição:", error);
        alert("Erro ao processar áudio: " + error.message);
        document.getElementById('audio-status').textContent = 'Gravar Áudio';
    }
}

// === ENVIO DE RESPOSTA ===
async function enviarResposta() {
    const respostaTexto = document.getElementById('resposta-texto').value.trim();
    
    // Validações
    if (respostaTexto.length < 27) {
        alert('Sua resposta está muito curta. Escreva pelo menos 27 caracteres para uma resposta adequada.');
        return;
    }
    
    if (respostaTexto.length > 500) {
        alert('Sua resposta excedeu o limite de 500 caracteres.');
        return;
    }
    
    // Desabilitar botão durante processamento
    const btnEnviar = document.getElementById('btn-enviar');
    if (btnEnviar) {
        btnEnviar.disabled = true;
        btnEnviar.textContent = 'Enviando...';
    }
    
    // Mostrar seção de feedback com loading
    const feedbackSection = document.getElementById('feedback-section');
    const feedbackContent = document.getElementById('feedback-content');
    
    if (feedbackSection) feedbackSection.style.display = 'block';
    if (feedbackContent) {
        feedbackContent.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Analisando sua resposta...</p>
            </div>
        `;
    }
    
    try {
        const pergunta = simulacao.perguntas[simulacao.perguntaAtual];
        const dadosResposta = {
            pergunta: pergunta.pergunta,
            categoria: pergunta.categoria,
            resposta: respostaTexto,
            numeroPergunta: simulacao.perguntaAtual + 1,
            tempoResposta: calcularTempoResposta()
        };
        
        console.log('Enviando dados:', dadosResposta);
        
        // Enviar para avaliação
        const response = await fetch('/api/entrevista/avaliar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosResposta)
        });
        
        console.log('Status da resposta:', response.status);
        
        // Primeiro pegar o texto bruto
        const textoResposta = await response.text();
        console.log('Resposta bruta do servidor:', textoResposta);
        
        // Tentar fazer parse do JSON
        let avaliacao;
        try {
            avaliacao = JSON.parse(textoResposta);
        } catch (jsonError) {
            throw new Error(`Servidor retornou resposta inválida: ${textoResposta.substring(0, 200)}`);
        }
        
        if (!response.ok) {
            throw new Error(avaliacao.detalhes || avaliacao.message || 'Erro ao avaliar resposta');
        }
        
        // Salvar resposta e avaliação
        simulacao.respostas.push({
            ...dadosResposta,
            avaliacao: avaliacao
        });
        
        // Acumular pontuação
        simulacao.pontuacaoTotal += avaliacao.pontuacao || 0;
        
        // Mostrar feedback
        mostrarFeedback(avaliacao);
        
    } catch (error) {
        console.error('Erro ao enviar resposta:', error);
        
        if (feedbackContent) {
            feedbackContent.innerHTML = `
                <div class="error-message">
                    <p>⚠️ Erro ao processar sua resposta.</p>
                    <p>${error.message}</p>
                    <button class="btn-secondary" onclick="tentarNovamente()">Tentar Novamente</button>
                </div>
            `;
        }
        
        // Reabilitar botão
        if (btnEnviar) {
            btnEnviar.disabled = false;
            btnEnviar.innerHTML = `Enviar Resposta
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>`;
        }
    }
}

function tentarNovamente() {
    const feedbackSection = document.getElementById('feedback-section');
    if (feedbackSection) feedbackSection.style.display = 'none';
    
    const btnEnviar = document.getElementById('btn-enviar');
    if (btnEnviar) {
        btnEnviar.disabled = false;
        btnEnviar.innerHTML = `Enviar Resposta
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>`;
    }
}

function calcularTempoResposta() {
    const tempoAtual = Date.now();
    const tempoDecorrido = Math.floor((tempoAtual - simulacao.tempoInicio) / 1000);
    return tempoDecorrido;
}

function mostrarFeedback(avaliacao) {
    const feedbackContent = document.getElementById('feedback-content');
    const pontuacaoPergunta = document.getElementById('pontuacao-pergunta');
    
    if (pontuacaoPergunta) {
        pontuacaoPergunta.textContent = `${avaliacao.pontuacao || 0}/100`;
    }
    
    if (feedbackContent) {
        feedbackContent.innerHTML = `
            <div class="feedback-card">
                <div class="feedback-score">
                    <div class="score-badge ${getScoreClass(avaliacao.pontuacao)}">
                        ${avaliacao.pontuacao || 0}<span>/100</span>
                    </div>
                </div>
                <div class="feedback-text">
                    <h4>Análise da Resposta</h4>
                    <p>${avaliacao.feedback || 'Resposta registrada com sucesso.'}</p>
                </div>
                ${avaliacao.sugestoes ? `
                    <div class="feedback-suggestions">
                        <h4>💡 Sugestões de Melhoria</h4>
                        <p>${avaliacao.sugestoes}</p>
                    </div>
                ` : ''}
                ${avaliacao.pontosFortes ? `
                    <div class="feedback-strengths">
                        <h4>✓ Pontos Fortes</h4>
                        <p>${avaliacao.pontosFortes}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

function getScoreClass(pontuacao) {
    if (pontuacao >= 80) return 'excellent';
    if (pontuacao >= 60) return 'good';
    if (pontuacao >= 40) return 'average';
    return 'needs-improvement';
}

// === NAVEGAÇÃO ===
function proximaPergunta() {
    simulacao.perguntaAtual++;
    
    if (simulacao.perguntaAtual < simulacao.perguntas.length) {
        carregarPergunta();
    } else {
        finalizarSimulacao();
    }
}

function pularPergunta() {
    if (confirm('Tem certeza que deseja pular esta pergunta? Você não receberá pontos por ela.')) {
        // Registrar resposta pulada
        const pergunta = simulacao.perguntas[simulacao.perguntaAtual];
        simulacao.respostas.push({
            pergunta: pergunta.pergunta,
            categoria: pergunta.categoria,
            resposta: '[PERGUNTA PULADA]',
            numeroPergunta: simulacao.perguntaAtual + 1,
            tempoResposta: calcularTempoResposta(),
            avaliacao: {
                pontuacao: 0,
                feedback: 'Pergunta pulada - sem avaliação'
            }
        });
        
        proximaPergunta();
    }
}

function finalizarSimulacao() {
    clearInterval(simulacao.timerInterval);
    
    const tempoTotal = Math.floor((Date.now() - simulacao.tempoInicio) / 60000);
    const pontuacaoMedia = Math.round(simulacao.pontuacaoTotal / simulacao.perguntas.length);
    
    // Preparar relatório
    const relatorio = {
        respostas: simulacao.respostas,
        tempoTotal: tempoTotal,
        pontuacaoMedia: pontuacaoMedia,
        pontuacaoTotal: simulacao.pontuacaoTotal,
        totalPerguntas: simulacao.perguntas.length
    };
    
    // Salvar relatório
    salvarRelatorio(relatorio);
    
    // Mostrar tela de resultados
    trocarTela('tela-entrevista', 'tela-resultado');
    exibirResultados(relatorio);
}

async function salvarRelatorio(relatorio) {
    try {
        await fetch('/api/entrevista/relatorio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(relatorio)
        });
    } catch (error) {
        console.error('Erro ao salvar relatório:', error);
    }
}

function exibirResultados(relatorio) {
    // Pontuação final
    const scoreNumber = document.getElementById('score-number');
    const scoreDescription = document.getElementById('score-description');
    const tempoTotalEl = document.getElementById('tempo-total');
    
    if (scoreNumber) scoreNumber.textContent = relatorio.pontuacaoMedia;
    if (tempoTotalEl) tempoTotalEl.textContent = `${relatorio.tempoTotal} min`;
    
    // Descrição baseada na pontuação
    let descricao = '';
    if (relatorio.pontuacaoMedia >= 80) {
        descricao = 'Excelente desempenho! Você demonstrou ótimas habilidades de comunicação.';
    } else if (relatorio.pontuacaoMedia >= 60) {
        descricao = 'Bom desempenho! Continue praticando para melhorar ainda mais.';
    } else if (relatorio.pontuacaoMedia >= 40) {
        descricao = 'Desempenho médio. Revise as sugestões e pratique mais.';
    } else {
        descricao = 'Continue praticando! Cada simulação é uma oportunidade de aprendizado.';
    }
    
    if (scoreDescription) scoreDescription.textContent = descricao;
    
    // Animar círculo de progresso
    const scoreProgress = document.getElementById('score-progress');
    if (scoreProgress) {
        const circumference = 408.4;
        const offset = circumference - (relatorio.pontuacaoMedia / 100) * circumference;
        scoreProgress.style.strokeDashoffset = offset;
    }
    
    // Análise por competência
    const skillsBreakdown = document.getElementById('skills-breakdown');
    if (skillsBreakdown) {
        const categorias = {};
        
        relatorio.respostas.forEach(resp => {
            if (!categorias[resp.categoria]) {
                categorias[resp.categoria] = {
                    total: 0,
                    count: 0
                };
            }
            categorias[resp.categoria].total += resp.avaliacao.pontuacao || 0;
            categorias[resp.categoria].count++;
        });
        
        skillsBreakdown.innerHTML = Object.entries(categorias).map(([cat, data]) => {
            const media = Math.round(data.total / data.count);
            return `
                <div class="skill-item">
                    <div class="skill-header">
                        <span class="skill-name">${cat}</span>
                        <span class="skill-score">${media}/100</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress" style="width: ${media}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Lista de respostas
    const answersList = document.getElementById('answers-list');
    if (answersList) {
        answersList.innerHTML = relatorio.respostas.map((resp, idx) => `
            <div class="answer-item">
                <div class="answer-header">
                    <h4>Pergunta ${idx + 1}: ${resp.pergunta}</h4>
                    <span class="answer-score ${getScoreClass(resp.avaliacao.pontuacao)}">
                        ${resp.avaliacao.pontuacao}/100
                    </span>
                </div>
                <div class="answer-body">
                    <p><strong>Sua resposta:</strong> ${resp.resposta}</p>
                    <p><strong>Feedback:</strong> ${resp.avaliacao.feedback}</p>
                </div>
            </div>
        `).join('');
    }
    
    // Recomendações
    const recommendationsList = document.getElementById('recommendations-list');
    if (recommendationsList) {
        const recomendacoes = gerarRecomendacoes(relatorio);
        recommendationsList.innerHTML = recomendacoes.map(rec => `
            <div class="recommendation-item">
                <span class="rec-icon">${rec.icone}</span>
                <div class="rec-content">
                    <h4>${rec.titulo}</h4>
                    <p>${rec.descricao}</p>
                </div>
            </div>
        `).join('');
    }
}

function gerarRecomendacoes(relatorio) {
    const recomendacoes = [];
    
    if (relatorio.pontuacaoMedia < 60) {
        recomendacoes.push({
            icone: '📚',
            titulo: 'Estude técnicas de entrevista',
            descricao: 'Aprenda sobre a técnica STAR para responder perguntas comportamentais de forma estruturada.'
        });
    }
    
    if (relatorio.tempoTotal < 10) {
        recomendacoes.push({
            icone: '⏱️',
            titulo: 'Reserve mais tempo para reflexão',
            descricao: 'Respostas bem pensadas geralmente levam um pouco mais de tempo. Não tenha pressa!'
        });
    }
    
    recomendacoes.push({
        icone: '🎯',
        titulo: 'Pratique regularmente',
        descricao: 'Quanto mais você pratica, mais natural e confiante ficará nas entrevistas reais.'
    });
    
    recomendacoes.push({
        icone: '💼',
        titulo: 'Pesquise sobre as empresas',
        descricao: 'Antes de uma entrevista real, sempre pesquise sobre a empresa, sua cultura e valores.'
    });
    
    return recomendacoes;
}

// === FUNÇÕES DE NAVEGAÇÃO ===
function voltarHome() {
    window.location.href = '/';
}

function novaSimulacao() {
    window.location.reload();
}

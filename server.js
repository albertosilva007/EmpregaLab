import express from 'express';
import multer from 'multer';
import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Log de requisições
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    next();
});

// Criar pasta temporária
const tempDir = path.join(__dirname, 'temp', 'audio');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Verificar Groq API Key
if (!process.env.GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY não encontrada!');
    process.exit(1);
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ===== CONFIGURAÇÃO DO MULTER =====
const storage = multer.diskStorage({
    destination: tempDir,
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || '.wav';
        cb(null, `audio-${Date.now()}${ext}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 25 * 1024 * 1024 } 
});

// ===== ENDPOINT: TRANSCRIÇÃO =====
app.post('/api/entrevista/transcrever', upload.single('audio'), async (req, res) => {
    let audioPath = null;

    try {
        const { perguntaTexto } = req.body;
        const audioFile = req.file;

        if (!audioFile) {
            return res.status(400).json({ erro: 'Nenhum arquivo de áudio recebido' });
        }

        audioPath = audioFile.path;
        console.log(`🎤 Processando: ${audioFile.size} bytes`);

        // 1. Transcrever áudio com Whisper
        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(audioPath),
            model: 'whisper-large-v3-turbo',
            language: 'pt',
            response_format: 'json',
            temperature: 0.0
        });

        const textoTranscrito = transcription.text;
        console.log('✅ Transcrito:', textoTranscrito);

        // 2. Analisar com Llama
        const analise = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'Você é um recrutador de Recife/PE. Dê feedback breve e encorajador.'
                },
                {
                    role: 'user',
                    content: `Pergunta: "${perguntaTexto}"\nResposta: "${textoTranscrito}"\n\nFeedback em 3 linhas:`
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 300
        });

        res.json({
            sucesso: true,
            transcricao: textoTranscrito,
            feedback: analise.choices[0].message.content
        });

    } catch (error) {
        console.error('❌ Erro no processamento:', error.message);
        res.status(500).json({ erro: 'Erro ao processar', detalhes: error.message });
    } finally {
        if (audioPath && fs.existsSync(audioPath)) {
            fs.unlinkSync(audioPath);
        }
    }
});

// ===== ENDPOINT: AVALIAR RESPOSTA =====
app.post('/api/entrevista/avaliar', async (req, res) => {
    try {
        const { pergunta, categoria, resposta, numeroPergunta } = req.body;

        console.log(`📝 Avaliando resposta ${numeroPergunta}`);
        console.log(`Pergunta: ${pergunta}`);
        console.log(`Resposta: ${resposta.substring(0, 100)}...`);

        // Validações
        if (!pergunta || !resposta || !categoria) {
            return res.status(400).json({ 
                erro: 'Dados incompletos',
                detalhes: 'Pergunta, resposta e categoria são obrigatórios'
            });
        }

        // Prompt para avaliação estruturada
        const promptAvaliacao = `Você é um especialista em recrutamento e seleção de Recife/PE, Brasil. Avalie a resposta do candidato seguindo estes critérios:

PERGUNTA (${categoria}): "${pergunta}"

RESPOSTA DO CANDIDATO: "${resposta}"

INSTRUÇÕES DE AVALIAÇÃO:
1. Analise a resposta considerando:
   - Clareza e objetividade
   - Estrutura e organização
   - Exemplos concretos (quando aplicável)
   - Adequação à pergunta
   - Profissionalismo

2. Atribua uma pontuação de 0 a 100 considerando:
   - 0-40: Resposta inadequada ou muito fraca
   - 41-60: Resposta básica, precisa melhorar
   - 61-80: Boa resposta, bem estruturada
   - 81-100: Excelente resposta, exemplar

3. IMPORTANTE: Seja encorajador e construtivo, especialmente com candidatos iniciantes. Reconheça esforços positivos.

FORMATO DA RESPOSTA (retorne APENAS um objeto JSON válido):
{
  "pontuacao": [número entre 0-100],
  "feedback": "[análise geral da resposta em 2-3 frases, sendo positivo e construtivo]",
  "pontosFortes": "[o que o candidato fez bem, 1-2 pontos específicos]",
  "sugestoes": "[sugestões práticas de melhoria, 1-2 pontos específicos]"
}`;

        // Chamar Groq para avaliar
        const avaliacao = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'Você é um recrutador experiente que avalia respostas de entrevistas. Retorne APENAS JSON válido, sem texto adicional.'
                },
                {
                    role: 'user',
                    content: promptAvaliacao
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.5,
            max_tokens: 500,
            response_format: { type: 'json_object' }
        });

        const conteudoResposta = avaliacao.choices[0].message.content;
        console.log('🤖 Resposta da IA:', conteudoResposta);

        // Parse do JSON
        let resultado;
        try {
            resultado = JSON.parse(conteudoResposta);
        } catch (parseError) {
            console.error('❌ Erro ao fazer parse do JSON da IA:', conteudoResposta);
            // Fallback com avaliação padrão
            resultado = {
                pontuacao: 70,
                feedback: 'Resposta registrada. Continue praticando para melhorar sua comunicação!',
                pontosFortes: 'Você respondeu à pergunta proposta.',
                sugestoes: 'Tente adicionar mais detalhes e exemplos específicos nas próximas respostas.'
            };
        }

        // Garantir que a pontuação está no intervalo correto
        resultado.pontuacao = Math.max(0, Math.min(100, resultado.pontuacao || 70));

        console.log(`✅ Avaliação completa: ${resultado.pontuacao} pontos`);

        res.json(resultado);

    } catch (error) {
        console.error('❌ Erro ao avaliar resposta:', error);
        res.status(500).json({ 
            erro: 'Erro ao processar avaliação',
            detalhes: error.message,
            // Retornar uma avaliação básica mesmo em caso de erro
            pontuacao: 60,
            feedback: 'Sua resposta foi registrada. Houve um problema temporário no sistema de avaliação.',
            sugestoes: 'Tente novamente ou continue com a próxima pergunta.'
        });
    }
});

// ===== ENDPOINT: SALVAR RELATÓRIO =====
app.post('/api/entrevista/relatorio', async (req, res) => {
    try {
        const { respostas, tempoTotal, pontuacaoMedia, pontuacaoTotal, totalPerguntas } = req.body;

        console.log(`📊 Relatório da simulação:`);
        console.log(`   - Total de perguntas: ${totalPerguntas}`);
        console.log(`   - Pontuação média: ${pontuacaoMedia}`);
        console.log(`   - Tempo total: ${tempoTotal} minutos`);

        // Aqui você pode salvar em banco de dados, arquivo, etc.
        // Por enquanto, vamos apenas logar e retornar sucesso

        // Criar pasta de relatórios se não existir
        const relatoriosDir = path.join(__dirname, 'relatorios');
        if (!fs.existsSync(relatoriosDir)) {
            fs.mkdirSync(relatoriosDir, { recursive: true });
        }

        // Salvar relatório em arquivo JSON
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const nomeArquivo = `relatorio-${timestamp}.json`;
        const caminhoArquivo = path.join(relatoriosDir, nomeArquivo);

        const relatorioCompleto = {
            dataHora: new Date().toISOString(),
            respostas,
            tempoTotal,
            pontuacaoMedia,
            pontuacaoTotal,
            totalPerguntas
        };

        fs.writeFileSync(caminhoArquivo, JSON.stringify(relatorioCompleto, null, 2));

        console.log(`✅ Relatório salvo: ${nomeArquivo}`);

        res.json({ 
            sucesso: true,
            mensagem: 'Relatório salvo com sucesso',
            arquivo: nomeArquivo
        });

    } catch (error) {
        console.error('❌ Erro ao salvar relatório:', error);
        res.status(500).json({ 
            erro: 'Erro ao salvar relatório',
            detalhes: error.message
        });
    }
});

// ===== ENDPOINT: LISTAR RELATÓRIOS =====
app.get('/api/entrevista/relatorios', (req, res) => {
    try {
        const relatoriosDir = path.join(__dirname, 'relatorios');
        
        if (!fs.existsSync(relatoriosDir)) {
            return res.json({ relatorios: [] });
        }

        const arquivos = fs.readdirSync(relatoriosDir)
            .filter(arquivo => arquivo.endsWith('.json'))
            .map(arquivo => {
                const caminhoCompleto = path.join(relatoriosDir, arquivo);
                const stats = fs.statSync(caminhoCompleto);
                return {
                    nome: arquivo,
                    data: stats.mtime,
                    tamanho: stats.size
                };
            })
            .sort((a, b) => b.data - a.data); // Mais recentes primeiro

        res.json({ relatorios: arquivos });

    } catch (error) {
        console.error('❌ Erro ao listar relatórios:', error);
        res.status(500).json({ 
            erro: 'Erro ao listar relatórios',
            detalhes: error.message
        });
    }
});

// ===== ENDPOINT: BUSCAR RELATÓRIO ESPECÍFICO =====
app.get('/api/entrevista/relatorios/:nome', (req, res) => {
    try {
        const { nome } = req.params;
        const relatoriosDir = path.join(__dirname, 'relatorios');
        const caminhoArquivo = path.join(relatoriosDir, nome);

        if (!fs.existsSync(caminhoArquivo)) {
            return res.status(404).json({ erro: 'Relatório não encontrado' });
        }

        const conteudo = fs.readFileSync(caminhoArquivo, 'utf-8');
        const relatorio = JSON.parse(conteudo);

        res.json(relatorio);

    } catch (error) {
        console.error('❌ Erro ao buscar relatório:', error);
        res.status(500).json({ 
            erro: 'Erro ao buscar relatório',
            detalhes: error.message
        });
    }
});

// Outras rotas
app.get('/api/test', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.get('/', (req, res) => res.redirect('/simulacao-entrevista/simulacao-entrevista.html'));

// Tratamento de erros global
app.use((err, req, res, next) => {
    console.error('❌ Erro não tratado:', err);
    res.status(500).json({ 
        erro: 'Erro interno do servidor',
        detalhes: process.env.NODE_ENV === 'development' ? err.message : 'Erro ao processar requisição'
    });
});

// 404 para rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ 
        erro: 'Rota não encontrada',
        rota: req.url,
        metodo: req.method
    });
});

app.listen(PORT, () => {
    console.log(`🚀 EMPREGALAB ATIVO em http://localhost:${PORT}`);
    console.log(`📁 Diretório: ${__dirname}`);
    console.log(`🔑 Groq API: Configurada`);
});
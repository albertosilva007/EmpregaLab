import Groq from 'groq-sdk';

const groq = new Groq({ 
    apiKey: process.env.GROQ_API_KEY 
});

export const handler = async (event) => {
    // CORS Headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ erro: 'Método não permitido' })
        };
    }

    try {
        const { pergunta, categoria, resposta, numeroPergunta } = JSON.parse(event.body);

        console.log(`📝 Avaliando resposta ${numeroPergunta}`);

        // Validações
        if (!pergunta || !resposta || !categoria) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    erro: 'Dados incompletos',
                    detalhes: 'Pergunta, resposta e categoria são obrigatórios'
                })
            };
        }

        // Prompt para avaliação
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
            console.error('❌ Erro ao fazer parse do JSON da IA');
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

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(resultado)
        };

    } catch (error) {
        console.error('❌ Erro ao avaliar resposta:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                erro: 'Erro ao processar avaliação',
                detalhes: error.message,
                pontuacao: 60,
                feedback: 'Sua resposta foi registrada. Houve um problema temporário no sistema de avaliação.',
                sugestoes: 'Tente novamente ou continue com a próxima pergunta.'
            })
        };
    }
};
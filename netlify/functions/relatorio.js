export const handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

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
        const { respostas, tempoTotal, pontuacaoMedia, pontuacaoTotal, totalPerguntas } = JSON.parse(event.body);

        console.log(`📊 Relatório da simulação:`);
        console.log(`   - Total de perguntas: ${totalPerguntas}`);
        console.log(`   - Pontuação média: ${pontuacaoMedia}`);
        console.log(`   - Tempo total: ${tempoTotal} minutos`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                sucesso: true,
                mensagem: 'Relatório recebido com sucesso'
            })
        };

    } catch (error) {
        console.error('❌ Erro ao processar relatório:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                erro: 'Erro ao processar relatório',
                detalhes: error.message
            })
        };
    }
};
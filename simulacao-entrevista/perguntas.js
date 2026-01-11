// Banco de perguntas de entrevista categorizadas por soft skills
const perguntasEntrevista = [
    {
        id: 1,
        pergunta: "Me fale um pouco sobre você.",
        categoria: "Autoconhecimento",
        dificuldade: "facil",
        dicas: [
            "Foque em sua trajetória profissional",
            "Destaque realizações relevantes",
            "Seja objetivo e profissional"
        ],
        criterios: {
            clareza: "Resposta estruturada e coerente",
            relevancia: "Informações pertinentes à vaga",
            confianca: "Tom seguro e profissional"
        }
    },
    {
        id: 2,
        pergunta: "Por que você quer trabalhar aqui?",
        categoria: "Motivação",
        dificuldade: "medio",
        dicas: [
            "Demonstre conhecimento sobre a empresa",
            "Conecte seus valores aos da empresa",
            "Seja genuíno"
        ],
        criterios: {
            pesquisa: "Conhecimento sobre a empresa",
            alinhamento: "Conexão com valores organizacionais",
            entusiasmo: "Interesse genuíno"
        }
    },
    {
        id: 3,
        pergunta: "Quais são seus pontos fortes?",
        categoria: "Autoconhecimento",
        dificuldade: "facil",
        dicas: [
            "Cite 2-3 pontos fortes relevantes",
            "Use exemplos concretos",
            "Relacione com a vaga"
        ],
        criterios: {
            autoconhecimento: "Conhece suas qualidades",
            exemplificacao: "Usa casos reais",
            relevancia: "Relaciona com a posição"
        }
    },
    {
        id: 4,
        pergunta: "Quais são seus pontos fracos?",
        categoria: "Autoconhecimento",
        dificuldade: "medio",
        dicas: [
            "Seja honesto, mas estratégico",
            "Mostre como está trabalhando nisso",
            "Evite clichês"
        ],
        criterios: {
            honestidade: "Transparência equilibrada",
            desenvolvimento: "Mostra evolução",
            maturidade: "Aceita limitações"
        }
    },
    {
        id: 5,
        pergunta: "Onde você se vê daqui a 5 anos?",
        categoria: "Planejamento",
        dificuldade: "medio",
        dicas: [
            "Demonstre ambição realista",
            "Alinhe com crescimento na empresa",
            "Mostre planejamento"
        ],
        criterios: {
            visao: "Tem objetivos claros",
            realismo: "Metas alcançáveis",
            comprometimento: "Quer crescer na empresa"
        }
    },
    {
        id: 6,
        pergunta: "Por que devemos contratá-lo?",
        categoria: "Comunicação",
        dificuldade: "dificil",
        dicas: [
            "Destaque seu diferencial",
            "Mostre valor agregado",
            "Seja confiante, não arrogante"
        ],
        criterios: {
            diferenciacao: "Destaca singularidade",
            valor: "Mostra benefícios claros",
            confianca: "Segurança sem arrogância"
        }
    },
    {
        id: 7,
        pergunta: "Conte sobre uma situação difícil que você enfrentou no trabalho.",
        categoria: "Resolução de Problemas",
        dificuldade: "medio",
        dicas: [
            "Use o método STAR (Situação, Tarefa, Ação, Resultado)",
            "Foque na solução, não no problema",
            "Mostre aprendizado"
        ],
        criterios: {
            estrutura: "Narrativa organizada",
            resolucao: "Foco em soluções",
            aprendizado: "Crescimento com experiência"
        }
    },
    {
        id: 8,
        pergunta: "Como você lida com pressão e prazos apertados?",
        categoria: "Adaptabilidade",
        dificuldade: "medio",
        dicas: [
            "Demonstre resiliência",
            "Cite estratégias práticas",
            "Use exemplo real"
        ],
        criterios: {
            resiliencia: "Mantém performance sob pressão",
            estrategias: "Tem métodos concretos",
            exemplificacao: "Usa casos reais"
        }
    },
    {
        id: 9,
        pergunta: "Descreva uma situação em que você trabalhou em equipe.",
        categoria: "Trabalho em Equipe",
        dificuldade: "facil",
        dicas: [
            "Destaque sua contribuição",
            "Mostre colaboração",
            "Cite resultados"
        ],
        criterios: {
            colaboracao: "Trabalha bem com outros",
            contribuicao: "Agrega valor ao grupo",
            resultado: "Foca em conquistas coletivas"
        }
    },
    {
        id: 10,
        pergunta: "Como você resolve conflitos no ambiente de trabalho?",
        categoria: "Inteligência Emocional",
        dificuldade: "dificil",
        dicas: [
            "Mostre maturidade emocional",
            "Demonstre empatia",
            "Foque em soluções construtivas"
        ],
        criterios: {
            inteligenciaEmocional: "Gerencia emoções",
            empatia: "Considera perspectivas",
            resolucao: "Busca soluções win-win"
        }
    },
    {
        id: 11,
        pergunta: "Qual foi seu maior erro profissional e o que aprendeu com ele?",
        categoria: "Aprendizagem Contínua",
        dificuldade: "dificil",
        dicas: [
            "Seja honesto e humilde",
            "Foque no aprendizado",
            "Mostre evolução"
        ],
        criterios: {
            humildade: "Reconhece erros",
            aprendizado: "Extrai lições",
            mudanca: "Mostra transformação"
        }
    },
    {
        id: 12,
        pergunta: "Como você se mantém atualizado na sua área?",
        categoria: "Aprendizagem Contínua",
        dificuldade: "facil",
        dicas: [
            "Cite fontes específicas",
            "Mostre proatividade",
            "Demonstre curiosidade"
        ],
        criterios: {
            proatividade: "Busca conhecimento ativamente",
            recursos: "Usa fontes variadas",
            aplicacao: "Aplica o aprendido"
        }
    },
    {
        id: 13,
        pergunta: "Descreva um projeto do qual você se orgulha.",
        categoria: "Realização",
        dificuldade: "medio",
        dicas: [
            "Escolha projeto relevante",
            "Explique seu papel",
            "Destaque resultados"
        ],
        criterios: {
            relevancia: "Projeto significativo",
            protagonismo: "Papel claro",
            impacto: "Resultados mensuráveis"
        }
    },
    {
        id: 14,
        pergunta: "Como você prioriza suas tarefas?",
        categoria: "Produtividade",
        dificuldade: "facil",
        dicas: [
            "Explique seu método",
            "Mostre organização",
            "Cite ferramentas se usar"
        ],
        criterios: {
            metodo: "Tem sistema claro",
            organizacao: "Demonstra estrutura",
            eficiencia: "Otimiza tempo"
        }
    },
    {
        id: 15,
        pergunta: "O que te motiva no trabalho?",
        categoria: "Motivação",
        dificuldade: "facil",
        dicas: [
            "Seja autêntico",
            "Vá além do salário",
            "Mostre paixão"
        ],
        criterios: {
            autenticidade: "Resposta genuína",
            profundidade: "Além de fatores materiais",
            paixao: "Demonstra entusiasmo"
        }
    },
    {
        id: 16,
        pergunta: "Como você recebe feedback crítico?",
        categoria: "Inteligência Emocional",
        dificuldade: "medio",
        dicas: [
            "Mostre abertura",
            "Demonstre maturidade",
            "Cite exemplo de melhoria"
        ],
        criterios: {
            abertura: "Receptivo a críticas",
            maturidade: "Não se defende",
            acao: "Usa feedback para melhorar"
        }
    },
    {
        id: 17,
        pergunta: "Descreva uma vez que você teve que aprender algo novo rapidamente.",
        categoria: "Adaptabilidade",
        dificuldade: "medio",
        dicas: [
            "Mostre capacidade de aprendizado",
            "Explique sua estratégia",
            "Cite resultado"
        ],
        criterios: {
            agilidade: "Aprende rápido",
            estrategia: "Método eficiente",
            aplicacao: "Usou o conhecimento"
        }
    },
    {
        id: 18,
        pergunta: "Como você contribui para um ambiente de trabalho positivo?",
        categoria: "Colaboração",
        dificuldade: "facil",
        dicas: [
            "Mostre valores positivos",
            "Cite comportamentos concretos",
            "Demonstre impacto"
        ],
        criterios: {
            valores: "Cultura positiva",
            comportamentos: "Ações concretas",
            impacto: "Influência no time"
        }
    },
    {
        id: 19,
        pergunta: "O que você faria se discordasse de uma decisão do seu gestor?",
        categoria: "Liderança",
        dificuldade: "dificil",
        dicas: [
            "Mostre respeito à hierarquia",
            "Demonstre comunicação assertiva",
            "Equilibre firmeza e flexibilidade"
        ],
        criterios: {
            respeito: "Considera hierarquia",
            assertividade: "Comunica posição",
            flexibilidade: "Aceita decisões finais"
        }
    },
    {
        id: 20,
        pergunta: "Tem alguma pergunta para nós?",
        categoria: "Engajamento",
        dificuldade: "medio",
        dicas: [
            "SEMPRE tenha perguntas preparadas",
            "Pergunte sobre cultura, desafios, expectativas",
            "Evite perguntar sobre salário agora"
        ],
        criterios: {
            preparacao: "Tem perguntas prontas",
            relevancia: "Perguntas inteligentes",
            interesse: "Demonstra engajamento"
        }
    }
];

// Função para selecionar perguntas aleatórias
function selecionarPerguntas(quantidade = 7) {
    const perguntas = [...perguntasEntrevista];
    const selecionadas = [];
    
    // Garantir diversidade de categorias
    const categorias = [...new Set(perguntas.map(p => p.categoria))];
    
    for (let i = 0; i < quantidade && perguntas.length > 0; i++) {
        const index = Math.floor(Math.random() * perguntas.length);
        selecionadas.push(perguntas[index]);
        perguntas.splice(index, 1);
    }
    
    return selecionadas;
}

// Exportar para uso
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { perguntasEntrevista, selecionarPerguntas };
}
# 🎭 Simulação de Entrevista Inteligente - EmpregaLAB

Sistema completo de simulação de entrevistas com análise de IA para desenvolvimento de soft skills.

## 📋 Funcionalidades

### ✅ Principais Features
- ✨ **20 Perguntas Profissionais** categorizadas por soft skills
- 🎯 **Seleção Aleatória** de 7 perguntas por simulação
- 🤖 **Análise com IA** (Claude API) para feedback personalizado
- ⏱️ **Timer em Tempo Real** para simular pressão de entrevista
- 🎤 **Gravação de Áudio** (opcional)
- 💡 **Dicas Contextuais** para cada pergunta
- 📊 **Sistema de Pontuação** detalhado
- 📈 **Relatório Final** com análise por competência
- 🎨 **Interface Responsiva** e profissional

### 🎓 Categorias de Soft Skills
1. Autoconhecimento
2. Motivação
3. Comunicação
4. Resolução de Problemas
5. Adaptabilidade
6. Trabalho em Equipe
7. Inteligência Emocional
8. Aprendizagem Contínua
9. Produtividade
10. Liderança
11. Planejamento
12. Realização
13. Colaboração
14. Engajamento

## 🚀 Instalação e Configuração

### Pré-requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- API Key da Anthropic (Claude)
- Servidor web (para development: Live Server, http-server, etc.)

### Passo 1: Configurar API Key

1. Obtenha sua API key em: https://console.anthropic.com/
2. Abra o arquivo `simulacao.js`
3. Substitua `SUA_API_KEY_AQUI` pela sua chave:

```javascript
const CLAUDE_API_KEY = 'sk-ant-api03-...'; // Sua chave aqui
```

### Passo 2: Estrutura de Arquivos

```
simulacao-entrevista/
├── simulacao-entrevista.html  # Interface principal
├── simulacao.css              # Estilos
├── simulacao.js               # Lógica + API
├── perguntas.js               # Banco de perguntas
└── README.md                  # Esta documentação
```

### Passo 3: Integração com EmpregaLAB

#### Opção A: Link Direto
No seu menu principal, adicione:

```html
<a href="simulacao-entrevista/simulacao-entrevista.html" class="menu-item">
    <svg><!-- ícone --></svg>
    <span>Simulação de Entrevista</span>
</a>
```

#### Opção B: Modal/Popup
```javascript
function abrirSimulacao() {
    window.open('simulacao-entrevista/simulacao-entrevista.html', '_blank');
}
```

#### Opção C: Integração no Chatbot
No seu chatbot, adicione uma opção:

```javascript
if (userMessage.includes('entrevista') || userMessage.includes('simulação')) {
    return `
        Quer praticar para entrevistas? Temos uma simulação completa!
        <a href="simulacao-entrevista/simulacao-entrevista.html">Iniciar Simulação</a>
    `;
}
```

## 🎮 Como Usar

### Para o Usuário:

1. **Tela Inicial**
   - Leia as informações sobre a simulação
   - Configure preferências (áudio, dicas)
   - Clique em "Iniciar Simulação"

2. **Durante a Entrevista**
   - Leia a pergunta com atenção
   - (Opcional) Veja as dicas clicando em "💡 Ver Dicas"
   - Digite ou grave sua resposta
   - Mínimo 20 caracteres, máximo 500
   - Clique em "Enviar Resposta"
   - Aguarde a análise da IA
   - Leia o feedback detalhado
   - Clique em "Próxima Pergunta"

3. **Resultado Final**
   - Visualize sua pontuação total
   - Analise desempenho por competência
   - Revise todas as respostas
   - Leia recomendações personalizadas
   - Inicie nova simulação ou volte ao início

## 🔧 Personalização

### Adicionar Novas Perguntas

Em `perguntas.js`, adicione ao array:

```javascript
{
    id: 21,
    pergunta: "Sua nova pergunta aqui?",
    categoria: "Categoria",
    dificuldade: "medio", // facil, medio, dificil
    dicas: [
        "Dica 1",
        "Dica 2",
        "Dica 3"
    ],
    criterios: {
        criterio1: "Descrição",
        criterio2: "Descrição",
        criterio3: "Descrição"
    }
}
```

### Alterar Quantidade de Perguntas

Em `simulacao.js`, função `iniciarSimulacao()`:

```javascript
simulacao.perguntas = selecionarPerguntas(10); // Altere de 7 para 10
```

### Customizar Cores

Em `simulacao.css`, altere as variáveis:

```css
:root {
    --primary-color: #2563eb; /* Sua cor principal */
    --success-color: #22c55e;  /* Cor de sucesso */
    /* ... */
}
```

### Modificar Critérios de Pontuação

Em `simulacao.js`, função `analisarRespostaComIA()`, ajuste o prompt para a IA.

## 📊 Sistema de Pontuação

### Escala de Pontos
- 🟢 **80-100**: Excelente
- 🟡 **60-79**: Bom
- 🟠 **40-59**: Adequado
- 🔴 **0-39**: Precisa melhorar

### Fatores Avaliados pela IA
1. Clareza e estrutura
2. Relevância para a pergunta
3. Exemplos concretos
4. Demonstração de soft skills
5. Adequação profissional
6. Linguagem e comunicação

## 🎤 Funcionalidade de Áudio

### Implementação de Transcrição

A gravação está funcional, mas a transcrição precisa ser implementada. Opções:

#### Opção 1: OpenAI Whisper
```javascript
async function transcreverAudio(audioBlob) {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-1');
    
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: formData
    });
    
    const data = await response.json();
    return data.text;
}
```

#### Opção 2: Google Speech-to-Text
```javascript
async function transcreverAudio(audioBlob) {
    // Implementar com Google Cloud Speech-to-Text API
    // https://cloud.google.com/speech-to-text/docs
}
```

#### Opção 3: Web Speech API (navegador)
```javascript
function iniciarReconhecimentoVoz() {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('resposta-texto').value = transcript;
    };
    
    recognition.start();
}
```

## 🔒 Segurança e Privacidade

### ⚠️ Importante
- **Nunca** exponha sua API key no frontend em produção
- Use variáveis de ambiente
- Implemente proxy backend para chamadas à API
- Adicione rate limiting
- Valide e sanitize inputs

### Exemplo de Backend Seguro (Node.js)

```javascript
// server.js
const express = require('express');
const app = express();

app.post('/api/analisar', async (req, res) => {
    const { pergunta, resposta } = req.body;
    
    // Validações
    if (!resposta || resposta.length < 20) {
        return res.status(400).json({ error: 'Resposta inválida' });
    }
    
    // Chamar Claude API com sua key do servidor
    const analise = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'x-api-key': process.env.CLAUDE_API_KEY,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [{ role: 'user', content: prompt }]
        })
    });
    
    const data = await analise.json();
    res.json(data);
});
```

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 💻 Desktop (1200px+)
- 📱 Tablet (768px - 1199px)
- 📱 Mobile (< 768px)

## 🐛 Troubleshooting

### Problema: API não responde
**Solução**: Verifique se a API key está correta e se tem créditos

### Problema: CORS Error
**Solução**: Use um backend proxy ou configure CORS no servidor

### Problema: Áudio não grava
**Solução**: Verifique permissões do navegador e use HTTPS

### Problema: Feedback genérico
**Solução**: Ajuste o prompt da IA para ser mais específico

## 🎯 Roadmap / Melhorias Futuras

- [ ] Salvar histórico de simulações (LocalStorage/Firebase)
- [ ] Gráficos de evolução ao longo do tempo
- [ ] Comparação com outros usuários (anonimizado)
- [ ] Simulações específicas por vaga/área
- [ ] Modo "entrevista difícil" com perguntas mais complexas
- [ ] Exportar relatório em PDF
- [ ] Compartilhar resultados
- [ ] Integração com LinkedIn
- [ ] Versão em inglês
- [ ] App mobile (React Native/Flutter)

## 📄 Licença

Este projeto faz parte do EmpregaLAB - FACEPE/UPE
Desenvolvido por: Jose Alberto

## 🤝 Suporte

Para dúvidas ou sugestões:
- Email: [seu-email]
- GitHub Issues: [seu-repo]

---

## 🎓 Exemplo de Uso Completo

```javascript
// 1. Usuário inicia simulação
iniciarSimulacao();

// 2. Sistema seleciona 7 perguntas aleatórias
const perguntas = selecionarPerguntas(7);

// 3. Para cada pergunta:
//    - Mostra pergunta + dicas
//    - Usuário responde
//    - IA analisa com Claude API
//    - Mostra feedback detalhado

// 4. Ao final:
//    - Calcula pontuação total
//    - Analisa por competência
//    - Gera recomendações personalizadas
//    - Mostra relatório completo

// 5. Usuário pode:
//    - Iniciar nova simulação
//    - Voltar ao início
//    - Revisar respostas
```

## 💡 Dicas para Desenvolvedores

1. **Performance**: Cache das perguntas para evitar recarregar
2. **UX**: Adicione animações suaves nas transições
3. **Acessibilidade**: Teste com screen readers
4. **Analytics**: Rastreie métricas de uso (Google Analytics)
5. **A/B Testing**: Teste diferentes prompts para a IA
6. **Feedback Loop**: Colete feedback dos usuários para melhorar

---

**Desenvolvido com ❤️ para o EmpregaLAB**
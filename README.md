# 🚀 Deploy do Chatbot no Netlify

## 📦 Arquivos Incluídos

- `index.html` - Chatbot completo (arquivo principal)
- `netlify.toml` - Configuração de build do Netlify
- `_redirects` - Regras de redirecionamento
- `README.md` - Este arquivo

## 🎯 Como Fazer Deploy no Netlify

### Método 1: Drag and Drop (Mais Fácil)

1. **Acesse:** https://app.netlify.com/drop
2. **Arraste** toda a pasta `netlify-deploy` para a área de drop
3. **Pronto!** Seu site estará online em segundos

### Método 2: Via Interface do Netlify

1. Faça login em https://netlify.com
2. Clique em **"Add new site"** → **"Deploy manually"**
3. Arraste a pasta `netlify-deploy` para a área de upload
4. Aguarde o deploy finalizar
5. Seu site estará disponível em uma URL como: `https://seu-site-xyz.netlify.app`

### Método 3: Via Git/GitHub

1. Crie um repositório no GitHub
2. Faça upload destes arquivos para o repositório
3. No Netlify, clique em **"Add new site"** → **"Import from Git"**
4. Conecte seu repositório do GitHub
5. Configure:
   - **Build command:** (deixe vazio)
   - **Publish directory:** `.` (ponto)
6. Clique em **"Deploy site"**

## ⚙️ Configurações Importantes

### netlify.toml
```toml
[build]
  publish = "."
```
- Define que todos os arquivos na raiz serão publicados

### _redirects
```
/*    /index.html   200
```
- Garante que todas as rotas retornem o index.html (SPA)

## ✅ Checklist Pré-Deploy

- [x] Arquivo `index.html` presente
- [x] Arquivo `netlify.toml` configurado
- [x] Arquivo `_redirects` criado
- [x] Todos os arquivos na mesma pasta

## 🔧 Solução de Problemas

### Erro 404 "Página não encontrada"
**Causa:** Arquivo principal não foi encontrado
**Solução:** Certifique-se de que o arquivo se chama `index.html` (não `chatbot-producao.html`)

### Site não carrega corretamente
**Solução:** 
1. Verifique o console do navegador (F12)
2. Limpe o cache do Netlify: Site Settings → Build & Deploy → Clear cache

### Problemas com React/Hooks
**Solução:** O arquivo HTML já inclui React via CDN, não precisa instalar nada

## 🌐 Após o Deploy

Seu chatbot estará disponível em uma URL como:
```
https://chatbot-trilhas-xyz.netlify.app
```

Você pode personalizar o nome do site em:
**Site Settings → Site Details → Change site name**

## 📱 Teste no Mobile

O chatbot é responsivo e funciona perfeitamente em dispositivos móveis!

## 🎉 Sucesso!

Se tudo correu bem, você deve ver:
- Tela de boas-vindas do chatbot
- Campo para digitar o nome
- 4 cards com as trilhas disponíveis

---

**Desenvolvido com ❤️ para facilitar seu aprendizado**

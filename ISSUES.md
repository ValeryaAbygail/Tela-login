Issue #1: Criar estrutura HTML/CSS base
- Descrição: Criar a página inicial com layout responsivo, formulário de login e estilos básicos.
- Critérios: HTML semântica, CSS separado, página responsiva em mobile/desktop.

Issue #2: Modelar classes POO (Restaurante/Prato/Artista/Musica)
- Descrição: Criar classes em `app.js` para representar o domínio; incluir comentários com perguntas para o Copilot.
- Critérios: Classes com constructor, métodos simples e comentários copiando explicações do Copilot.

Issue #3: Configurar MongoDB Atlas e Data API
- Descrição: Criar conta Atlas, cluster, usuário, liberar IP 0.0.0.0/0 (teste), criar Data API, salvar API_URL e API_KEY.
- Critérios: Ter anotações com API_URL e API_KEY no `.env` local (não subir no GitHub).

Issue #4: Criar .env e .gitignore
- Descrição: Adicionar `.env` com chaves locais e `.gitignore` contendo `.env` e `node_modules/`.
- Critérios: `.env` NÃO deve ser committed; cole a explicação do Copilot no relatório.

Issue #5: Configurar Vercel para staging e production
- Descrição: Importar repositório na Vercel, manter `main` como production branch, ativar preview para `staging`, adicionar Environment Variables.
- Critérios: URLs de deploy para staging e production anotadas.

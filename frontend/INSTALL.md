# Instalação do Frontend no macOS

## Requisitos

### 1. Node.js
Recomendamos usar o nvm (Node Version Manager) para gerenciar versões do Node.js:
```bash
# Instale o nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Instale o Node.js 14
nvm install 14
nvm use 14
```

### 2. Backend
O frontend depende do backend estar rodando. Certifique-se de que:
- O backend está instalado e configurado
- O servidor backend está rodando em http://localhost:3000
- As variáveis de ambiente do backend estão configuradas corretamente

## Instalação Automática

1. Torne o script executável:
```bash
chmod +x install-frontend.sh
```

2. Execute o script:
```bash
./install-frontend.sh
```

## Instalação Manual

### 1. Instalar Dependências
```bash
cd frontend
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Configurações da API
REACT_APP_API_URL=http://localhost:3000
REACT_APP_SOCKET_URL=http://localhost:3000

# Configurações do Ambiente
REACT_APP_ENV=development
REACT_APP_VERSION=1.0.0

# Configurações de Recaptcha (opcional)
REACT_APP_RECAPTCHA_SITE_KEY=sua_chave_recaptcha_aqui

# Configurações de Analytics (opcional)
REACT_APP_GA_TRACKING_ID=sua_chave_google_analytics_aqui

# Configurações de Tema
REACT_APP_PRIMARY_COLOR=#1890ff
REACT_APP_SECONDARY_COLOR=#52c41a
REACT_APP_ERROR_COLOR=#f5222d
REACT_APP_WARNING_COLOR=#faad14
REACT_APP_SUCCESS_COLOR=#52c41a
REACT_APP_INFO_COLOR=#1890ff

# Configurações de Localização
REACT_APP_DEFAULT_LANGUAGE=pt-BR
REACT_APP_DEFAULT_TIMEZONE=America/Sao_Paulo

# Configurações de Cache
REACT_APP_CACHE_ENABLED=true
REACT_APP_CACHE_DURATION=3600 # 1 hora em segundos
```

## Iniciando o Servidor

### Modo Desenvolvimento
```bash
npm start
```
O servidor de desenvolvimento será iniciado em http://localhost:3001

### Modo Produção
```bash
npm run build
```
Os arquivos de produção serão gerados na pasta `build`

## Troubleshooting

### Problemas com Node.js
- Verifique a versão: `node -v`
- Limpe o cache: `npm cache clean --force`
- Reinstale as dependências: `rm -rf node_modules && npm install`

### Problemas com o Backend
- Verifique se o backend está rodando: `curl http://localhost:3000`
- Confirme se as variáveis de ambiente estão corretas
- Verifique os logs do backend

### Problemas com o Build
- Limpe o cache: `npm cache clean --force`
- Remova a pasta node_modules: `rm -rf node_modules`
- Reinstale as dependências: `npm install`
- Execute o build novamente: `npm run build`

## Dicas

1. **Desenvolvimento**
   - Use o modo de desenvolvimento para desenvolvimento local
   - O hot-reload está habilitado por padrão
   - As alterações são refletidas automaticamente

2. **Produção**
   - Sempre teste o build de produção localmente
   - Verifique se todas as rotas estão funcionando
   - Teste em diferentes navegadores

3. **Performance**
   - Use o Chrome DevTools para analisar a performance
   - Verifique o tamanho do bundle
   - Otimize imagens e assets

## Suporte

Em caso de problemas, verifique:

1. Console do navegador
2. Logs do servidor de desenvolvimento
3. Logs do backend
4. Network tab no DevTools 
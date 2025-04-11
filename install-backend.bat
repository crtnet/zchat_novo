@echo off
setlocal enabledelayedexpansion

echo ============================================
echo Instalador do Backend - Sistema de Atendimento WhatsApp
echo ============================================
echo.

:: Verificar se está no diretório correto
if not exist "backend" (
    echo ERRO: O diretório backend não foi encontrado.
    echo Por favor, execute este script no diretório raiz do projeto.
    pause
    exit /b 1
)

:: Verificar Node.js
echo Verificando Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js não encontrado. Por favor, instale o Node.js versão 14 ou superior.
    echo Download: https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js encontrado.

:: Verificar Redis
echo Verificando Redis...
redis-cli ping >nul 2>&1
if %errorlevel% neq 0 (
    echo Redis não encontrado. Por favor, instale o Redis.
    echo Download: https://redis.io/download
    pause
    exit /b 1
)
echo Redis encontrado.

:: Verificar PostgreSQL
echo Verificando PostgreSQL...
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo PostgreSQL não encontrado. Por favor, instale o PostgreSQL.
    echo Download: https://www.postgresql.org/download/
    pause
    exit /b 1
)
echo PostgreSQL encontrado.

:: Criar banco de dados
echo Criando banco de dados...
psql -U postgres -c "CREATE DATABASE zchat;" 2>nul
if %errorlevel% neq 0 (
    echo ERRO: Não foi possível criar o banco de dados.
    echo Verifique se o PostgreSQL está rodando e se o usuário postgres existe.
    pause
    exit /b 1
)
echo Banco de dados criado com sucesso.

:: Instalar dependências
echo Instalando dependências do Node.js...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar as dependências.
    pause
    exit /b 1
)
echo Dependências instaladas com sucesso.

:: Configurar variáveis de ambiente
echo Configurando variáveis de ambiente...
if not exist ".env" (
    copy .env.example .env
    echo Arquivo .env criado. Por favor, configure as variáveis de ambiente.
)

:: Executar migrações
echo Executando migrações do banco de dados...
call npx sequelize-cli db:migrate
if %errorlevel% neq 0 (
    echo ERRO: Falha ao executar as migrações.
    pause
    exit /b 1
)
echo Migrações executadas com sucesso.

:: Criar diretório de uploads
echo Criando diretório de uploads...
if not exist "public\uploads" mkdir "public\uploads"

echo.
echo ============================================
echo Instalação concluída com sucesso!
echo.
echo Próximos passos:
echo 1. Configure o arquivo .env com suas credenciais
echo 2. Inicie o servidor com: npm run dev
echo ============================================
echo.

pause 
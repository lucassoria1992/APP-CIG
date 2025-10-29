@echo off
echo ================================================
echo 🚀 Instalando Sistema CIG - Gestion de Archivos
echo ================================================
echo.

REM Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js no esta instalado
    echo Por favor, instale Node.js ^>= 18 desde https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js detectado
node --version

REM Verificar MongoDB
where mongod >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  MongoDB no esta instalado o no esta en el PATH
    echo Por favor, instale MongoDB desde https://www.mongodb.com/try/download/community
    echo.
)

REM Crear directorios necesarios
echo.
echo 📁 Creando directorios...
if not exist "data\exports\cig" mkdir data\exports\cig
if not exist "logs" mkdir logs
if not exist "backend\logs" mkdir backend\logs
echo ✅ Directorios creados

REM Instalar dependencias del backend
echo.
echo 📦 Instalando dependencias del backend...
cd backend
if not exist ".env" (
    echo 📝 Creando archivo .env desde .env.example...
    copy .env.example .env
    echo ⚠️  Por favor, edite backend\.env con sus configuraciones
)
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error al instalar dependencias del backend
    pause
    exit /b 1
)
echo ✅ Dependencias del backend instaladas

REM Instalar dependencias del frontend
echo.
echo 📦 Instalando dependencias del frontend...
cd ..\frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error al instalar dependencias del frontend
    pause
    exit /b 1
)
echo ✅ Dependencias del frontend instaladas

REM Volver al directorio raíz
cd ..

echo.
echo ================================================
echo ✅ Instalacion completada!
echo.
echo 📝 Proximos pasos:
echo.
echo 1. Iniciar MongoDB:
echo    mongod
echo.
echo 2. Crear usuarios iniciales (en otra terminal):
echo    cd backend
echo    node src/seed.js
echo.
echo 3. Iniciar el backend (en otra terminal):
echo    cd backend
echo    npm run dev
echo.
echo 4. Iniciar el frontend (en otra terminal):
echo    cd frontend
echo    npm start
echo.
echo 5. Abrir navegador en:
echo    http://localhost:3000
echo.
echo 📧 Credenciales de prueba:
echo    Admin: admin / admin123
echo    Operador: operador01 / operador123
echo    Auditor: auditor01 / auditor123
echo.
echo ================================================
pause

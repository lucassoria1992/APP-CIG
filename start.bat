@echo off
title Sistema CIG - Inicializador

echo ================================================
echo 🚀 Sistema CIG - Inicialización Completa
echo ================================================
echo.

REM Verificar que MongoDB está corriendo
echo ⏳ Verificando MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ MongoDB está corriendo
) else (
    echo ⚠️  MongoDB no está corriendo
    echo.
    echo Iniciando MongoDB...
    start "MongoDB" mongod
    timeout /t 3 >nul
)

echo.
echo ================================================
echo 📝 Crear Usuarios Iniciales
echo ================================================
echo.
echo ¿Desea crear usuarios iniciales? (S/N)
set /p CREATE_USERS=
if /i "%CREATE_USERS%"=="S" (
    echo.
    echo Creando usuarios...
    cd backend
    node src/seed.js
    cd ..
    echo.
    pause
)

echo.
echo ================================================
echo 🚀 Iniciando Servicios
echo ================================================
echo.

REM Iniciar Backend
echo 📦 Iniciando Backend en puerto 4000...
start "CIG Backend" cmd /k "cd backend && npm run dev"
timeout /t 2 >nul

REM Iniciar Frontend
echo 🌐 Iniciando Frontend en puerto 3000...
start "CIG Frontend" cmd /k "cd frontend && npm start"

echo.
echo ================================================
echo ✅ Sistema CIG Iniciado
echo ================================================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 📡 Backend API: http://localhost:4000
echo 🗄️  MongoDB: mongodb://localhost:27017/SntCont
echo.
echo 📧 Credenciales:
echo    Admin: admin / admin123
echo    Operador: operador01 / operador123
echo    Auditor: auditor01 / auditor123
echo.
echo ⚠️  Presione cualquier tecla para cerrar esta ventana
echo    (Los servicios seguirán corriendo en ventanas separadas)
echo.
pause

@echo off
echo ================================================
echo 🔄 Actualizando Dependencias del Sistema CIG
echo ================================================
echo.

echo ⚠️  Este script eliminará node_modules y reinstalará
echo    todas las dependencias con versiones actualizadas.
echo.
pause

REM Backend
echo.
echo 🧹 Limpiando backend...
cd backend
if exist "node_modules" rd /s /q node_modules
if exist "package-lock.json" del package-lock.json
echo ✅ Backend limpio

echo.
echo 📦 Instalando dependencias actualizadas del backend...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error al instalar dependencias del backend
    pause
    exit /b 1
)
echo ✅ Backend actualizado

REM Frontend
echo.
echo 🧹 Limpiando frontend...
cd ..\frontend
if exist "node_modules" rd /s /q node_modules
if exist "package-lock.json" del package-lock.json
echo ✅ Frontend limpio

echo.
echo 📦 Instalando dependencias actualizadas del frontend...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error al instalar dependencias del frontend
    pause
    exit /b 1
)
echo ✅ Frontend actualizado

cd ..

echo.
echo ================================================
echo ✅ Actualización completada!
echo.
echo 📝 Cambios realizados:
echo    - ESLint: 8.x → 9.x (nuevo flat config)
echo    - Supertest: 6.x → 7.x
echo    - React: 18.2.0 → 18.3.1
echo    - React-Bootstrap: 2.9.1 → 2.10.5
echo    - Bootstrap: 5.3.2 → 5.3.3
echo    - Axios: 1.6.2 → 1.7.7
echo    - React-Router-DOM: 6.20.1 → 6.27.0
echo    - date-fns: 3.0.0 → 4.1.0
echo    - Nodemon: 3.0.2 → 3.1.7
echo.
echo 🚀 El sistema está listo para usarse.
echo ================================================
pause

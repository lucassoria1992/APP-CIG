#!/bin/bash

echo "🚀 Instalando Sistema CIG - Gestión de Archivos"
echo "================================================"
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "Por favor, instale Node.js >= 18 desde https://nodejs.org"
    exit 1
fi

echo "✅ Node.js $(node --version) detectado"

# Verificar MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB no está instalado o no está en el PATH"
    echo "Por favor, instale MongoDB desde https://www.mongodb.com/try/download/community"
    echo ""
fi

# Crear directorios necesarios
echo ""
echo "📁 Creando directorios..."
mkdir -p data/exports/cig
mkdir -p logs
mkdir -p backend/logs
echo "✅ Directorios creados"

# Instalar dependencias del backend
echo ""
echo "📦 Instalando dependencias del backend..."
cd backend
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env desde .env.example..."
    cp .env.example .env
    echo "⚠️  Por favor, edite backend/.env con sus configuraciones"
fi
npm install
echo "✅ Dependencias del backend instaladas"

# Instalar dependencias del frontend
echo ""
echo "📦 Instalando dependencias del frontend..."
cd ../frontend
npm install
echo "✅ Dependencias del frontend instaladas"

# Volver al directorio raíz
cd ..

echo ""
echo "================================================"
echo "✅ Instalación completada!"
echo ""
echo "📝 Próximos pasos:"
echo ""
echo "1. Iniciar MongoDB:"
echo "   mongod"
echo ""
echo "2. Crear usuarios iniciales (en otra terminal):"
echo "   cd backend"
echo "   node src/seed.js"
echo ""
echo "3. Iniciar el backend (en otra terminal):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "4. Iniciar el frontend (en otra terminal):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "5. Abrir navegador en:"
echo "   http://localhost:3000"
echo ""
echo "📧 Credenciales de prueba:"
echo "   Admin: admin / admin123"
echo "   Operador: operador01 / operador123"
echo "   Auditor: auditor01 / auditor123"
echo ""
echo "================================================"

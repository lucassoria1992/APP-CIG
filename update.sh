#!/bin/bash

echo "================================================"
echo "🔄 Actualizando Dependencias del Sistema CIG"
echo "================================================"
echo ""

echo "⚠️  Este script eliminará node_modules y reinstalará"
echo "    todas las dependencias con versiones actualizadas."
echo ""
read -p "Presione Enter para continuar o Ctrl+C para cancelar..."

# Backend
echo ""
echo "🧹 Limpiando backend..."
cd backend
rm -rf node_modules package-lock.json
echo "✅ Backend limpio"

echo ""
echo "📦 Instalando dependencias actualizadas del backend..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias del backend"
    exit 1
fi
echo "✅ Backend actualizado"

# Frontend
echo ""
echo "🧹 Limpiando frontend..."
cd ../frontend
rm -rf node_modules package-lock.json
echo "✅ Frontend limpio"

echo ""
echo "📦 Instalando dependencias actualizadas del frontend..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias del frontend"
    exit 1
fi
echo "✅ Frontend actualizado"

cd ..

echo ""
echo "================================================"
echo "✅ Actualización completada!"
echo ""
echo "📝 Cambios realizados:"
echo "   - ESLint: 8.x → 9.x (nuevo flat config)"
echo "   - Supertest: 6.x → 7.x"
echo "   - React: 18.2.0 → 18.3.1"
echo "   - React-Bootstrap: 2.9.1 → 2.10.5"
echo "   - Bootstrap: 5.3.2 → 5.3.3"
echo "   - Axios: 1.6.2 → 1.7.7"
echo "   - React-Router-DOM: 6.20.1 → 6.27.0"
echo "   - date-fns: 3.0.0 → 4.1.0"
echo "   - Nodemon: 3.0.2 → 3.1.7"
echo ""
echo "🚀 El sistema está listo para usarse."
echo "================================================"

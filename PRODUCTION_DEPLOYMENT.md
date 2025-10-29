# Guía de Despliegue en Producción - Sistema CIG

## 📋 Requisitos de Producción

### Hardware Mínimo Recomendado
- **CPU:** 2 cores
- **RAM:** 4 GB
- **Disco:** 20 GB SSD
- **Conexión:** Internet estable

### Software
- **Sistema Operativo:** Ubuntu 20.04+ / Windows Server 2019+ / CentOS 8+
- **Node.js:** 18.x LTS
- **MongoDB:** 5.0+
- **Nginx:** 1.18+ (opcional, recomendado)
- **PM2:** Latest
- **Certbot:** Para SSL/TLS (Let's Encrypt)

---

## 🚀 Opción 1: Despliegue con PM2 (Recomendado)

### 1. Preparar el Servidor

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt update
sudo apt install -y mongodb-org

# Iniciar MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Instalar Nginx
sudo apt install -y nginx

# Instalar PM2 globalmente
sudo npm install -g pm2
```

### 2. Clonar y Configurar Proyecto

```bash
# Crear directorio
sudo mkdir -p /var/www/cig
cd /var/www/cig

# Clonar repositorio (o copiar archivos)
# git clone <repository-url> .

# Copiar archivos manualmente si no usas Git
# scp -r "APP CIG/*" user@server:/var/www/cig/

# Configurar permisos
sudo chown -R $USER:$USER /var/www/cig
```

### 3. Configurar Backend

```bash
cd /var/www/cig/backend

# Instalar dependencias de producción
npm install --production

# Crear archivo .env para producción
cat > .env << EOF
PORT=4000
MONGO_URI=mongodb://localhost:27017/SntCont
JWT_SECRET=$(openssl rand -base64 32)
FILES_PATH=/var/www/cig/data/exports/cig/
LOG_LEVEL=info
TOKEN_EXPIRES=1h
NODE_ENV=production
EOF

# Crear directorios necesarios
mkdir -p /var/www/cig/data/exports/cig
mkdir -p /var/www/cig/logs

# Crear usuarios iniciales
node src/seed.js

# Iniciar con PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Configurar Frontend

```bash
cd /var/www/cig/frontend

# Crear archivo .env para producción
cat > .env << EOF
REACT_APP_API_URL=https://tu-dominio.com/api
EOF

# Instalar dependencias
npm install

# Build de producción
npm run build

# Copiar build a Nginx
sudo rm -rf /var/www/html/cig
sudo cp -r build /var/www/html/cig
```

### 5. Configurar Nginx

```bash
# Crear configuración de Nginx
sudo nano /etc/nginx/sites-available/cig
```

Contenido del archivo:

```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    # Frontend
    location / {
        root /var/www/html/cig;
        try_files $uri $uri/ /index.html;
        
        # Gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

```bash
# Activar sitio
sudo ln -s /etc/nginx/sites-available/cig /etc/nginx/sites-enabled/

# Probar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### 6. Configurar SSL con Let's Encrypt

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Renovación automática (ya configurada por defecto)
sudo certbot renew --dry-run
```

---

## 🐳 Opción 2: Despliegue con Docker

### 1. Instalar Docker y Docker Compose

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER
```

### 2. Configurar Variables de Entorno

```bash
# Crear archivo .env en la raíz del proyecto
cat > .env << EOF
MONGO_URI=mongodb://mongodb:27017/SntCont
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
EOF
```

### 3. Construir y Desplegar

```bash
# Construir imágenes
docker-compose build

# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver estado
docker-compose ps
```

### 4. Nginx Reverso Proxy (Opcional)

Si usas Docker, puedes agregar Nginx como proxy reverso:

```yaml
# Agregar a docker-compose.yml
nginx:
  image: nginx:alpine
  container_name: cig_nginx
  restart: always
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx/conf.d:/etc/nginx/conf.d
    - ./nginx/ssl:/etc/nginx/ssl
  depends_on:
    - frontend
    - backend
```

---

## 🔒 Configuración de Seguridad

### 1. Firewall (UFW)

```bash
# Habilitar UFW
sudo ufw enable

# Permitir SSH
sudo ufw allow OpenSSH

# Permitir HTTP y HTTPS
sudo ufw allow 'Nginx Full'

# Verificar estado
sudo ufw status
```

### 2. Fail2ban

```bash
# Instalar Fail2ban
sudo apt install -y fail2ban

# Configurar
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. MongoDB Seguridad

```bash
# Conectar a MongoDB
mongosh

# Crear usuario administrador
use admin
db.createUser({
  user: "admin",
  pwd: "contraseña_segura",
  roles: ["root"]
})

# Habilitar autenticación en MongoDB
sudo nano /etc/mongod.conf
```

Agregar:
```yaml
security:
  authorization: enabled
```

```bash
# Reiniciar MongoDB
sudo systemctl restart mongod

# Actualizar MONGO_URI en backend/.env
MONGO_URI=mongodb://admin:contraseña_segura@localhost:27017/SntCont?authSource=admin
```

---

## 📊 Monitoreo y Logs

### PM2 Monitoring

```bash
# Ver procesos
pm2 list

# Monitoreo en tiempo real
pm2 monit

# Ver logs
pm2 logs cig-backend

# Información detallada
pm2 info cig-backend

# Configurar PM2 Plus (opcional)
pm2 link <secret_key> <public_key>
```

### Logs de Nginx

```bash
# Ver logs de acceso
sudo tail -f /var/log/nginx/access.log

# Ver logs de error
sudo tail -f /var/log/nginx/error.log
```

### Logs de la Aplicación

```bash
# Logs del backend
tail -f /var/www/cig/logs/combined.log
tail -f /var/www/cig/logs/error.log
```

---

## 🔄 Backup y Restauración

### Backup de MongoDB

```bash
# Script de backup
cat > /var/www/cig/scripts/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/www/cig/backups"
mkdir -p $BACKUP_DIR

# Backup de MongoDB
mongodump --db SntCont --out "$BACKUP_DIR/mongo_$DATE"

# Comprimir
tar -czf "$BACKUP_DIR/mongo_$DATE.tar.gz" "$BACKUP_DIR/mongo_$DATE"
rm -rf "$BACKUP_DIR/mongo_$DATE"

# Mantener solo los últimos 7 días
find $BACKUP_DIR -name "mongo_*.tar.gz" -mtime +7 -delete

echo "Backup completado: mongo_$DATE.tar.gz"
EOF

chmod +x /var/www/cig/scripts/backup.sh

# Agregar a crontab (diario a las 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/cig/scripts/backup.sh") | crontab -
```

### Restaurar Backup

```bash
# Descomprimir
tar -xzf /var/www/cig/backups/mongo_20251027_020000.tar.gz

# Restaurar
mongorestore --db SntCont /var/www/cig/backups/mongo_20251027_020000/SntCont
```

---

## 🔧 Mantenimiento

### Actualizar Aplicación

```bash
# Detener PM2
pm2 stop all

# Hacer backup
/var/www/cig/scripts/backup.sh

# Actualizar código
cd /var/www/cig
git pull  # o copiar nuevos archivos

# Backend
cd backend
npm install --production

# Frontend
cd ../frontend
npm install
npm run build
sudo cp -r build /var/www/html/cig

# Reiniciar
pm2 restart all
```

### Rotar Logs

```bash
# Configurar logrotate
sudo nano /etc/logrotate.d/cig
```

Contenido:
```
/var/www/cig/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0644 www-data www-data
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

---

## 📈 Optimización de Rendimiento

### 1. Node.js

```bash
# En ecosystem.config.js usar modo cluster
instances: 'max'  # Usar todos los cores disponibles
exec_mode: 'cluster'
```

### 2. MongoDB

```bash
# Crear índices (ya implementado en modelos)
# Configurar en /etc/mongod.conf
storage:
  wiredTiger:
    engineConfig:
      cacheSizeGB: 2
```

### 3. Nginx

```nginx
# En /etc/nginx/nginx.conf
worker_processes auto;
worker_connections 1024;

# Agregar cache
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;
```

---

## ✅ Checklist de Despliegue

- [ ] Servidor preparado con software necesario
- [ ] MongoDB instalado y seguro
- [ ] Backend desplegado con PM2
- [ ] Frontend compilado y servido por Nginx
- [ ] SSL/TLS configurado (HTTPS)
- [ ] Firewall configurado
- [ ] Backups automáticos configurados
- [ ] Logs configurados y rotados
- [ ] Monitoreo activo
- [ ] Variables de entorno en producción
- [ ] JWT_SECRET único y seguro
- [ ] Usuarios iniciales creados
- [ ] Tests pasando
- [ ] Documentación actualizada

---

## 🆘 Troubleshooting Producción

### Backend no inicia
```bash
pm2 logs cig-backend --lines 100
```

### MongoDB no conecta
```bash
sudo systemctl status mongod
sudo tail -f /var/log/mongodb/mongod.log
```

### Nginx errores
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### Performance issues
```bash
# Ver uso de recursos
htop
pm2 monit
```

---

## 📞 Soporte Post-Despliegue

**Logs importantes:**
- PM2: `pm2 logs`
- Nginx: `/var/log/nginx/`
- MongoDB: `/var/log/mongodb/`
- Aplicación: `/var/www/cig/logs/`

**Comandos útiles:**
```bash
# Restart completo
pm2 restart all
sudo systemctl restart nginx
sudo systemctl restart mongod

# Ver estado
pm2 status
sudo systemctl status nginx
sudo systemctl status mongod

# Verificar conectividad
curl http://localhost:4000/api/health
```

---

## 🎯 Siguiente Nivel

Después de desplegar:
1. Configurar respaldos automáticos a S3 o similar
2. Implementar CI/CD con GitHub Actions
3. Configurar alertas con servicios como UptimeRobot
4. Implementar APM con New Relic o similar
5. Configurar CDN para archivos estáticos

---

**¡Despliegue exitoso! 🚀**

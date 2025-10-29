const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/SntCont', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  nombre: String,
  apellido: String,
  activo: Boolean,
  created_at: Date
});

const User = mongoose.model('User', UserSchema);

async function seed() {
  try {
    console.log('🌱 Iniciando seed de base de datos...');

    // Limpiar usuarios existentes
    await User.deleteMany({});
    console.log('✅ Colección de usuarios limpiada');

    // Crear usuarios de ejemplo
    const salt = await bcrypt.genSalt(10);

    const users = [
      {
        username: 'admin',
        email: 'admin@cig.com',
        password: await bcrypt.hash('admin123', salt),
        role: 'admin',
        nombre: 'Administrador',
        apellido: 'Sistema',
        activo: true,
        created_at: new Date()
      },
      {
        username: 'operador01',
        email: 'operador@cig.com',
        password: await bcrypt.hash('operador123', salt),
        role: 'operador',
        nombre: 'Juan',
        apellido: 'Pérez',
        activo: true,
        created_at: new Date()
      },
      {
        username: 'auditor01',
        email: 'auditor@cig.com',
        password: await bcrypt.hash('auditor123', salt),
        role: 'auditor',
        nombre: 'María',
        apellido: 'González',
        activo: true,
        created_at: new Date()
      }
    ];

    await User.insertMany(users);
    console.log('✅ Usuarios creados:');
    users.forEach(u => {
      console.log(`   - ${u.username} (${u.role}) - Password: ${u.username === 'admin' ? 'admin123' : u.username === 'operador01' ? 'operador123' : 'auditor123'}`);
    });

    console.log('\n🎉 Seed completado exitosamente!');
    console.log('\n📝 Credenciales de acceso:');
    console.log('   Admin: admin / admin123');
    console.log('   Operador: operador01 / operador123');
    console.log('   Auditor: auditor01 / auditor123');
    
  } catch (error) {
    console.error('❌ Error en seed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Conexión a MongoDB cerrada');
    process.exit(0);
  }
}

seed();

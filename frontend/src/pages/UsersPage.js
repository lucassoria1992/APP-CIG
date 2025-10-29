import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Alert } from 'react-bootstrap';
import Navigation from '../components/Navigation';
import api from '../services/api';
import { format } from 'date-fns';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    role: 'operador'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const response = await api.post('/auth/register', formData);

      if (response.data.error) {
        throw new Error(response.data.message);
      }

      setAlert({ type: 'success', message: 'Usuario creado exitosamente' });
      setShowModal(false);
      setFormData({
        username: '',
        email: '',
        password: '',
        nombre: '',
        apellido: '',
        role: 'operador'
      });
      loadUsers();
    } catch (error) {
      setAlert({ 
        type: 'danger', 
        message: error.response?.data?.message || 'Error al crear usuario' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    if (!window.confirm(`¿Está seguro de ${currentStatus ? 'desactivar' : 'activar'} este usuario?`)) {
      return;
    }

    try {
      await api.put(`/users/${userId}`, { activo: !currentStatus });
      setAlert({ 
        type: 'success', 
        message: `Usuario ${currentStatus ? 'desactivado' : 'activado'} exitosamente` 
      });
      loadUsers();
    } catch (error) {
      setAlert({ type: 'danger', message: 'Error al actualizar usuario' });
    }
  };

  const getRoleBadgeVariant = (role) => {
    const variants = {
      'admin': 'danger',
      'operador': 'primary',
      'auditor': 'info'
    };
    return variants[role] || 'secondary';
  };

  return (
    <>
      <Navigation />
      <Container fluid className="px-4">
        <Row className="mb-4">
          <Col>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>👥 Gestión de Usuarios</h1>
            <p className="text-muted">Administrar usuarios del sistema</p>
          </Col>
          <Col xs="auto">
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
              style={{ minHeight: '44px' }}
            >
              ➕ Nuevo Usuario
            </Button>
          </Col>
        </Row>

        {alert && (
          <Alert variant={alert.type} dismissible onClose={() => setAlert(null)}>
            {alert.message}
          </Alert>
        )}

        <Card>
          <Card.Body>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center text-muted py-5">
                <p style={{ fontSize: '1.1rem' }}>No hay usuarios registrados</p>
              </div>
            ) : (
              <Table hover responsive className="table-dark">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Nombre Completo</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Último Acceso</th>
                    <th>Creado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td><strong>{user.username}</strong></td>
                      <td>{user.nombre} {user.apellido}</td>
                      <td>{user.email}</td>
                      <td>
                        <Badge bg={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </td>
                      <td>
                        {user.activo ? (
                          <Badge bg="success">Activo</Badge>
                        ) : (
                          <Badge bg="secondary">Inactivo</Badge>
                        )}
                      </td>
                      <td>
                        {user.last_login 
                          ? format(new Date(user.last_login), 'dd/MM/yyyy HH:mm')
                          : 'Nunca'
                        }
                      </td>
                      <td>
                        {format(new Date(user.created_at), 'dd/MM/yyyy')}
                      </td>
                      <td>
                        <Button
                          variant={user.activo ? 'warning' : 'success'}
                          size="sm"
                          onClick={() => handleToggleActive(user._id, user.activo)}
                        >
                          {user.activo ? '🔒 Desactivar' : '🔓 Activar'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        <Modal 
          show={showModal} 
          onHide={() => setShowModal(false)}
          centered
          size="lg"
        >
          <Modal.Header closeButton style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
            <Modal.Title>Crear Nuevo Usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre *</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Apellido *</Form.Label>
                    <Form.Control
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Usuario *</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      minLength={3}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contraseña *</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                    <Form.Text className="text-muted">
                      Mínimo 6 caracteres
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Rol *</Form.Label>
                    <Form.Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="operador">Operador</option>
                      <option value="auditor">Auditor</option>
                      <option value="admin">Administrador</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading}
                  style={{ minHeight: '48px' }}
                >
                  {loading ? 'Creando...' : 'Crear Usuario'}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => setShowModal(false)}
                  style={{ minHeight: '48px' }}
                >
                  Cancelar
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default UsersPage;

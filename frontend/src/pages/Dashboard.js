import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();

  const DashboardCard = ({ title, description, icon, onClick, color = 'primary' }) => (
    <Card 
      className="h-100 shadow-sm" 
      style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
      onClick={onClick}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <Card.Body className="d-flex flex-column align-items-center text-center p-4">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
        <Card.Title style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          {title}
        </Card.Title>
        <Card.Text style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
          {description}
        </Card.Text>
      </Card.Body>
    </Card>
  );

  return (
    <>
      <Navigation />
      <Container fluid className="px-4">
        <Row className="mb-4">
          <Col>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              Bienvenido, {user?.nombre} {user?.apellido}
            </h1>
            <p className="text-muted" style={{ fontSize: '1.1rem' }}>
              Rol: <span className="badge bg-primary">{user?.role}</span>
            </p>
          </Col>
        </Row>

        <Row className="g-4">
          {hasRole(['admin', 'operador']) && (
            <Col xs={12} md={6} lg={4}>
              <DashboardCard
                title="Cargar Cheques"
                description="Agregar cheques al lote actual y generar archivos CIG"
                icon="📝"
                onClick={() => navigate('/cheques')}
                color="primary"
              />
            </Col>
          )}

          <Col xs={12} md={6} lg={4}>
            <DashboardCard
              title="Archivos Generados"
              description="Ver y descargar archivos CIG generados"
              icon="📄"
              onClick={() => navigate('/files')}
              color="success"
            />
          </Col>

          {hasRole(['admin', 'auditor']) && (
            <Col xs={12} md={6} lg={4}>
              <DashboardCard
                title="Auditoría"
                description="Consultar logs de actividad del sistema"
                icon="📊"
                onClick={() => navigate('/audit')}
                color="info"
              />
            </Col>
          )}

          {hasRole(['admin']) && (
            <Col xs={12} md={6} lg={4}>
              <DashboardCard
                title="Gestión de Usuarios"
                description="Administrar usuarios del sistema"
                icon="👥"
                onClick={() => navigate('/users')}
                color="warning"
              />
            </Col>
          )}
        </Row>

        <Row className="mt-5">
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>ℹ️ Información del Sistema</Card.Title>
                <Row className="mt-3">
                  <Col md={6}>
                    <p><strong>Sistema:</strong> Gestión de Archivos CIG</p>
                    <p><strong>Versión:</strong> 1.0.0</p>
                    <p><strong>Formato:</strong> Cobranza Integrada Galicia (.TXT)</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Estructura:</strong> 300 caracteres por línea</p>
                    <p><strong>Seguridad:</strong> JWT + Roles</p>
                    <p><strong>Accesibilidad:</strong> WCAG 2.1 AA</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;

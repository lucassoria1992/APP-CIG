import React, { useContext } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DarkModeContext } from '../App';

const Navigation = () => {
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container fluid>
        <Navbar.Brand 
          onClick={() => navigate('/dashboard')} 
          style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '1.25rem' }}
        >
          🏦 CIG - Sistema de Gestión
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate('/dashboard')}>
              Inicio
            </Nav.Link>
            {hasRole(['admin', 'operador']) && (
              <Nav.Link onClick={() => navigate('/cheques')}>
                Cargar Cheques
              </Nav.Link>
            )}
            <Nav.Link onClick={() => navigate('/files')}>
              Archivos Generados
            </Nav.Link>
            {hasRole(['admin', 'auditor']) && (
              <Nav.Link onClick={() => navigate('/audit')}>
                Auditoría
              </Nav.Link>
            )}
            {hasRole(['admin']) && (
              <Nav.Link onClick={() => navigate('/users')}>
                Usuarios
              </Nav.Link>
            )}
          </Nav>
          <Nav className="align-items-center">
            <Nav.Item className="me-3">
              <button
                className={`btn btn-sm ${darkMode ? 'btn-light' : 'btn-dark'}`}
                onClick={() => setDarkMode(!darkMode)}
                style={{ minWidth: 120 }}
              >
                {darkMode ? '☀️ Modo claro' : '🌙 Modo oscuro'}
              </button>
            </Nav.Item>
            <Dropdown align="end">
              <Dropdown.Toggle 
                variant="outline-light" 
                id="dropdown-user"
                style={{ 
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <span className="me-2">👤</span>
                {user?.nombre} {user?.apellido}
                <span className="ms-2 badge bg-primary">{user?.role}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ 
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)'
              }}>
                <Dropdown.ItemText>
                  <small className="text-muted">Usuario: {user?.username}</small>
                </Dropdown.ItemText>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} style={{ color: 'var(--danger)' }}>
                  Cerrar Sesión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;

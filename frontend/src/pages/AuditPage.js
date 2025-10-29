import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Badge, Pagination } from 'react-bootstrap';
import Navigation from '../components/Navigation';
import api from '../services/api';
import { format } from 'date-fns';

const AuditPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    user: '',
    action: '',
    startDate: '',
    endDate: '',
    status: ''
  });
  const [actions, setActions] = useState([]);

  useEffect(() => {
    loadLogs();
    loadActions();
  }, [page, filters]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 50,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
      });

      const response = await api.get(`/logs?${params}`);
      setLogs(response.data.logs || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error al cargar logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadActions = async () => {
    try {
      const response = await api.get('/logs/actions');
      setActions(response.data.actions || []);
    } catch (error) {
      console.error('Error al cargar acciones:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
    setPage(1);
  };

  const getActionBadgeVariant = (action) => {
    const variants = {
      'LOGIN': 'primary',
      'LOGOUT': 'secondary',
      'CREATE_LOTE': 'info',
      'ADD_RECORD': 'success',
      'EDIT_RECORD': 'warning',
      'DELETE_RECORD': 'danger',
      'GENERATE_FILE': 'success',
      'DOWNLOAD_FILE': 'info',
      'CREATE_CLIENT': 'info',
      'EDIT_CLIENT': 'warning',
      'DELETE_CLIENT': 'danger'
    };
    return variants[action] || 'secondary';
  };

  const getStatusBadgeVariant = (status) => {
    const variants = {
      'success': 'success',
      'error': 'danger',
      'warning': 'warning'
    };
    return variants[status] || 'secondary';
  };

  return (
    <>
      <Navigation />
      <Container fluid className="px-4">
        <Row className="mb-4">
          <Col>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>📊 Auditoría del Sistema</h1>
            <p className="text-muted">Registro de actividades de usuarios</p>
          </Col>
        </Row>

        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Filtros</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    name="user"
                    value={filters.user}
                    onChange={handleFilterChange}
                    placeholder="Nombre de usuario"
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Acción</Form.Label>
                  <Form.Select
                    name="action"
                    value={filters.action}
                    onChange={handleFilterChange}
                  >
                    <option value="">Todas</option>
                    {actions.map(action => (
                      <option key={action} value={action}>{action}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">Todos</option>
                    <option value="success">Éxito</option>
                    <option value="error">Error</option>
                    <option value="warning">Advertencia</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha Desde</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha Hasta</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center text-muted py-5">
                <p style={{ fontSize: '1.1rem' }}>No se encontraron registros</p>
              </div>
            ) : (
              <>
                <div style={{ overflowX: 'auto', maxHeight: '600px' }}>
                  <Table hover responsive className="table-dark" style={{ fontSize: '0.9rem' }}>
                    <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-secondary)', zIndex: 1 }}>
                      <tr>
                        <th style={{ minWidth: '160px' }}>Fecha y Hora</th>
                        <th>Usuario</th>
                        <th>Acción</th>
                        <th>Estado</th>
                        <th style={{ minWidth: '300px' }}>Detalles</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log._id}>
                          <td>
                            {format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm:ss')}
                          </td>
                          <td>
                            <strong>{log.user}</strong>
                          </td>
                          <td>
                            <Badge bg={getActionBadgeVariant(log.action)}>
                              {log.action}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={getStatusBadgeVariant(log.status)}>
                              {log.status}
                            </Badge>
                          </td>
                          <td>
                            <small>
                              <code style={{ 
                                whiteSpace: 'pre-wrap', 
                                wordBreak: 'break-word',
                                backgroundColor: 'var(--bg-tertiary)',
                                padding: '0.25rem',
                                borderRadius: '0.25rem'
                              }}>
                                {JSON.stringify(log.details, null, 2)}
                              </code>
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                      <Pagination.First onClick={() => setPage(1)} disabled={page === 1} />
                      <Pagination.Prev onClick={() => setPage(page - 1)} disabled={page === 1} />
                      
                      {[...Array(Math.min(totalPages, 10))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Pagination.Item
                            key={pageNum}
                            active={page === pageNum}
                            onClick={() => setPage(pageNum)}
                          >
                            {pageNum}
                          </Pagination.Item>
                        );
                      })}
                      
                      <Pagination.Next onClick={() => setPage(page + 1)} disabled={page === totalPages} />
                      <Pagination.Last onClick={() => setPage(totalPages)} disabled={page === totalPages} />
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default AuditPage;

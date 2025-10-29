import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Badge, Pagination } from 'react-bootstrap';
import Navigation from '../components/Navigation';
import api from '../services/api';
import { format } from 'date-fns';

const FilesPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    lote_id: '',
    user: ''
  });

  useEffect(() => {
    loadFiles();
  }, [page, filters]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 20,
        ...filters
      });

      const response = await api.get(`/files?${params}`);
      setFiles(response.data.files || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error al cargar archivos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id, filename) => {
    try {
      const response = await api.get(`/files/download/${id}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error al descargar archivo:', error);
      alert('Error al descargar el archivo');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
    setPage(1);
  };

  return (
    <>
      <Navigation />
      <Container fluid className="px-4">
        <Row className="mb-4">
          <Col>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>📄 Archivos Generados</h1>
            <p className="text-muted">Historial de archivos CIG generados</p>
          </Col>
        </Row>

        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Filtros</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Lote ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="lote_id"
                    value={filters.lote_id}
                    onChange={handleFilterChange}
                    placeholder="Ej: L20251027-001"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
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
            ) : files.length === 0 ? (
              <div className="text-center text-muted py-5">
                <p style={{ fontSize: '1.1rem' }}>No se encontraron archivos</p>
              </div>
            ) : (
              <>
                <Table hover responsive className="table-dark">
                  <thead>
                    <tr>
                      <th>Archivo</th>
                      <th>Lote</th>
                      <th>Registros</th>
                      <th>Importe Total</th>
                      <th>Usuario</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file) => (
                      <tr key={file._id}>
                        <td>
                          <code style={{ fontSize: '0.9rem' }}>{file.filename}</code>
                        </td>
                        <td>{file.lote_id}</td>
                        <td>{file.total_records}</td>
                        <td>
                          ${file.total_importe.toLocaleString('es-AR', { 
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2 
                          })}
                        </td>
                        <td>{file.user}</td>
                        <td>
                          {format(new Date(file.fecha_generacion), 'dd/MM/yyyy HH:mm')}
                        </td>
                        <td>
                          {file.validado ? (
                            <Badge bg="success">✓ Validado</Badge>
                          ) : (
                            <Badge bg="danger">✗ Con errores</Badge>
                          )}
                        </td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleDownload(file._id, file.filename)}
                          >
                            ⬇️ Descargar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                      <Pagination.First onClick={() => setPage(1)} disabled={page === 1} />
                      <Pagination.Prev onClick={() => setPage(page - 1)} disabled={page === 1} />
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <Pagination.Item
                          key={i + 1}
                          active={page === i + 1}
                          onClick={() => setPage(i + 1)}
                        >
                          {i + 1}
                        </Pagination.Item>
                      ))}
                      
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

export default FilesPage;

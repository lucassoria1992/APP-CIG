// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Form, Button, Table, Alert, Modal } from 'react-bootstrap';
// import { useAuth } from '../context/AuthContext';
// import Navigation from '../components/Navigation';
// import api from '../services/api';
// import { format } from 'date-fns';

// const ChequesPage = () => {
//     const { user } = useAuth();
//     const [lote, setLote] = useState(null);
//     const [records, setRecords] = useState([]);
//     const [clients, setClients] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [alert, setAlert] = useState(null);
//     const [showPreview, setShowPreview] = useState(false);
//     const [previewData, setPreviewData] = useState('');

//     const [formData, setFormData] = useState({
//         cliente: '',
//         tipoIdentificacion: 'CUIT',
//         identificacionCliente: '',
//         cuit: '',
//         tipoDocumento: 'PC',
//         idDocumento: '',
//         idInterna: '',
//         division: '',
//         codMoneda: '00',
//         fechaPago: '',
//         sucursalPago: '101',
//         formaPago: '2',
//         idPago: '',
//         pagoParcial: 'N',
//         importePago: '',
//         nroCheque: '',
//         fechaAcred: '',
//         importeCheque: '',
//         codBanco: '007',
//         marcaInformado: 'N',
//         marcaAnulado: 'N',
//         docPago: '',
//         tipoCanal: '07',
//         descCanal: 'T.AUTOSERV.C/R',
//         boletaCash: '000000000',
//         observaciones: ''
//     });

//     const [invalidFields, setInvalidFields] = useState([]);

//     // --- Helpers para normalización CIG ---
//     const padSpaces = (value = '', length) => {
//         const s = value === null || value === undefined ? '' : String(value);
//         if (s.length > length) return s.substring(0, length);
//         return s.padEnd(length, ' ');
//     };

//     const padZeros = (value = '', length) => {
//         const s = value === null || value === undefined ? '' : String(value);
//         if (s.length > length) return s.substring(s.length - length);
//         return s.padStart(length, '0');
//     };

//     const formatDateForCIG = (dateStr) => {
//         // dateStr expected 'YYYY-MM-DD' from input[type=date]
//         if (!dateStr) return ' '.repeat(8);
//         const normalized = dateStr.replace(/-/g, '');
//         if (normalized.length !== 8) return ' '.repeat(8);
//         return normalized;
//     };

//     const formatAmountForCIG = (amount) => {
//         // amount puede venir como number o string. Debe convertirse a enteros de centavos y formatearse a 15 caracteres (13 enteros + 2 decimales)
//         if (amount === '' || amount === null || amount === undefined) return ' '.repeat(15);
//         const n = Number(amount);
//         if (Number.isNaN(n)) return ' '.repeat(15);
//         const cents = Math.round(n * 100);
//         return padZeros(String(cents), 15);
//     };

//     // Construir línea CIG (preview) usando el mismo layout que el backend
//     const buildCIGLinePreview = (cf, data) => {
//         // cf: cigFields pre-padded; data: raw formData for fallback
//         const get = (k, fallback='') => cf[k] ?? data[k] ?? fallback;

//         // Compose following backend order (partial mapping):
//         let line = '';
//         line += 'D';
//         line += (get('tipoIdentificacion', 'CUIT')).toString().padEnd(4, ' ').substring(0,4);
//         line += (get('identificacionCliente','')).toString().padStart(15,'0').slice(-15);
//         line += (get('cuit','')).toString().padStart(18,'0').slice(-18);
//         line += (get('tipoDocumento','PC')).toString().padEnd(2,' ').substring(0,2);
//         line += (get('idDocumento','')).toString().padEnd(25,' ').substring(0,25);
//         line += (get('idInterna','')).toString().padEnd(30,' ').substring(0,30);
//         line += (get('division','')).toString().padEnd(6,' ').substring(0,6);
//         line += (get('codMoneda','00')).toString().padStart(2,'0').slice(-2);
//         // fechaVigencia ya en AAAAMMDD en cf
//         line += (get('fechaVigencia','')).toString().padStart(8,'0').slice(-8);
//         line += (get('sucursalPago','101')).toString().padStart(3,'0').slice(-3);
//         line += (get('formaPago','2')).toString().padStart(1,'0').slice(-1);
//         line += (get('idPago','')).toString().padEnd(9,' ').substring(0,9);
//         line += (get('pagoParcial','N')).toString().padEnd(1,' ').substring(0,1);
//         // importe: use cf.importe1 if present (already padded to 15), else compute from data
//         line += cf.importe1 ? cf.importe1 : formatAmountForCIG(data.importePago);
//         line += (get('nroCheque','')).toString().padStart(9,'0').slice(-9);
//         line += (get('fechaVenc1','')).toString().padStart(8,'0').slice(-8);
//         line += cf.importe2 ? cf.importe2 : padSpaces('',15);
//         line += (get('codBanco','007')).toString().padStart(3,'0').slice(-3);
//         line += (get('marcaInformado','N')).toString().padEnd(1,' ').substring(0,1);
//         line += (get('marcaAnulado','N')).toString().padEnd(1,' ').substring(0,1);
//         line += (get('docPago','')).toString().padEnd(25,' ').substring(0,25);
//         line += (get('tipoCanal','07')).toString().padStart(2,'0').slice(-2);
//         line += (get('descCanal','T.AUTOSERV.C/R')).toString().padEnd(14,' ').substring(0,14);
//         line += (get('boletaCash','000000000')).toString().padStart(9,'0').slice(-9);
//         // filler 73 spaces
//         line += ' '.repeat(73);

//         return line;
//     };

//     const [cigPreview, setCigPreview] = useState('');
//     const [showCigPreview, setShowCigPreview] = useState(false);


//     useEffect(() => {
//         loadActiveLote();
//         loadClients();
//     }, []);

//     useEffect(() => {
//         if (lote) {
//             loadRecords();
//         }
//     }, [lote]);

//     const loadActiveLote = async () => {
//         try {
//             const response = await api.get('/lotes/active');
//             setLote(response.data.lote);
//         } catch (error) {
//             console.error('Error al cargar lote:', error);
//         }
//     };

//     const loadRecords = async () => {
//         if (!lote) return;

//         try {
//             const response = await api.get(`/records/${lote.id}`);
//             setRecords(response.data.records || []);
//         } catch (error) {
//             console.error('Error al cargar registros:', error);
//         }
//     };

//     const loadClients = async (query = '') => {
//         try {
//             const response = await api.get(`/clients?q=${query}`);
//             setClients(response.data.clients || []);
//         } catch (error) {
//             console.error('Error al cargar clientes:', error);
//         }
//     };

//     const handleClientSelect = (client) => {
//         setFormData({
//             ...formData,
//             cliente: client.nombre,
//             cuit: client.cuit
//         });
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });

//         // Autocompletado de clientes
//         if (name === 'cuit' && value.length >= 3) {
//             loadClients(value);
//         }
//         if (name === 'cliente' && value.length >= 3) {
//             loadClients(value);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setAlert(null);
//         setInvalidFields([]);

//         // Validación básica de campos obligatorios
//         const requiredBase = ['cliente', 'importePago', 'fechaPago'];
//         let invalids = requiredBase.filter(f => formData[f] === undefined || formData[f] === null || (typeof formData[f] === 'string' && formData[f].trim() === ''));

//         // Aceptar CUIT o Identificación Cliente: al menos uno debe estar presente
//         const hasCuit = formData.cuit && formData.cuit.toString().trim() !== '';
//         const hasIdent = formData.identificacionCliente && formData.identificacionCliente.toString().trim() !== '';
//         if (!hasCuit && !hasIdent) {
//             // marcar ambos para que el usuario vea dónde completar
//             invalids.push('cuit');
//             invalids.push('identificacionCliente');
//         }

//         // TipoDocumento siempre debe existir (viene por defecto), pero validar formato si necesario
//         if (!formData.tipoDocumento || String(formData.tipoDocumento).trim() === '') {
//             invalids.push('tipoDocumento');
//         }

//         // Si tipoDocumento != PC entonces idDocumento es obligatorio (según spec)
//         if (String(formData.tipoDocumento).trim() !== 'PC') {
//             if (!formData.idDocumento || String(formData.idDocumento).trim() === '') {
//                 invalids.push('idDocumento');
//             }
//         }

//         // Reglas de importes: para FC, ND, RE, NC importePago obligatorio y > 0
//         const docTipo = String(formData.tipoDocumento).trim();
//         if (['FC', 'ND', 'RE', 'NC'].includes(docTipo)) {
//             const imp = Number(formData.importePago);
//             if (!formData.importePago || Number.isNaN(imp) || imp <= 0) {
//                 invalids.push('importePago');
//             }
//         }

//         // Si hay invalids hasta aquí, reportar antes de seguir con normalización
//         if (invalids.length > 0) {
//             // Depuración: mostrar qué campos se consideran inválidos y sus valores actuales
//             console.error('Campos inválidos detectados al enviar:', invalids);
//             const debugValues = {};
//             invalids.forEach(f => { debugValues[f] = formData[f]; });
//             console.error('Valores de campos inválidos:', debugValues);
//             setInvalidFields(invalids);
//             setLoading(false);
//             setAlert({ type: 'danger', message: `Por favor complete los campos obligatorios: ${invalids.join(', ')}` });
//             // Enfocar y desplazar al primer campo inválido para mejor UX
//             setTimeout(() => {
//                 const first = document.querySelector('.is-invalid');
//                 if (first) {
//                     first.scrollIntoView({ behavior: 'smooth', block: 'center' });
//                     try { first.focus(); } catch (e) { /* noop */ }
//                 }
//             }, 120);
//             return;
//         }

//         // --- Normalización de campos para CIG (se enviará en cigFields) ---
//         const cigFields = {
//             registro: 'D',
//             tipoIdentificacion: padSpaces(formData.tipoIdentificacion, 54), // longitud larga en spec; ajustar si es necesario
//             identificacionCliente: padSpaces(formData.identificacionCliente, 15),
//             cuit: padZeros(formData.cuit || '', 11),
//             tipoDocumento: padSpaces(formData.tipoDocumento, 2),
//             idDocumento: formData.tipoDocumento === 'PC' ? padSpaces('', 25) : padSpaces(formData.idDocumento || '', 25),
//             fechaVigencia: formatDateForCIG(formData.fechaPago),
//             importe1: ['FC', 'ND', 'RE', 'NC'].includes(docTipo) ? formatAmountForCIG(formData.importePago) : padSpaces('', 15),
//             fechaVenc1: ['FC', 'ND', 'RE', 'NC'].includes(docTipo) ? formatDateForCIG(formData.fechaAcred) : padSpaces('', 8),
//             importe2: padSpaces('', 15),
//             fechaVenc2: padSpaces('', 8),
//             importe3: padSpaces('', 15),
//             fechaVenc3: padSpaces('', 8),
//             nombreCliente: padSpaces(formData.cliente, 30),
//             idInterna: padSpaces('', 30),
//             division: padSpaces('', 6),
//             codMoneda: padSpaces(formData.codMoneda || '', 2),
//             leyenda1: padSpaces(formData.observaciones || '', 38),
//             leyenda2: padSpaces('', 38),
//             filler: padSpaces('', 14)
//         };

//         try {
//             if (!lote) {
//                 throw new Error('No hay lote activo');
//             }

//             const dataToSend = {
//                 ...formData,
//                 lote_id: lote.id,
//                 // Normalización de importes y fechas
//                 importePago: parseFloat(formData.importePago || formData.importe || 0),
//                 importeCheque: parseFloat(formData.importeCheque || formData.importe || 0),
//                 fechaPago: formData.fechaPago || formData.fecha_vto,
//                 fechaAcred: formData.fechaAcred || formData.fecha_vto,
//                 codMoneda: formData.codMoneda || formData.moneda,
//                 tipoDocumento: formData.tipoDocumento || formData.tipo_documento,
//                 nroCheque: formData.nroCheque || formData.numero_cheque,
//                 sucursalPago: formData.sucursalPago || formData.sucursal,
//                 idDocumento: formData.idDocumento || formData.identificacion_doc,
//                 cigFields: cigFields,
//                 // Otros campos ya mapeados
//             };

//             const response = await api.post('/records', dataToSend);

//             if (response.data.error) {
//                 throw new Error(response.data.message);
//             }

//             setAlert({ type: 'success', message: 'Cheque agregado exitosamente' });

//             // Limpiar formulario
//             setFormData({
//                 cliente: '',
//                 tipoIdentificacion: 'CUIT',
//                 identificacionCliente: '',
//                 cuit: '',
//                 tipoDocumento: 'PC',
//                 idDocumento: '',
//                 idInterna: '',
//                 division: '',
//                 codMoneda: '00',
//                 fechaPago: '',
//                 sucursalPago: '101',
//                 formaPago: '2',
//                 idPago: '',
//                 pagoParcial: 'N',
//                 importePago: '',
//                 nroCheque: '',
//                 fechaAcred: '',
//                 importeCheque: '',
//                 codBanco: '007',
//                 marcaInformado: 'N',
//                 marcaAnulado: 'N',
//                 docPago: '',
//                 tipoCanal: '07',
//                 descCanal: 'T.AUTOSERV.C/R',
//                 boletaCash: '000000000',
//                 observaciones: ''
//             });

//             loadRecords();
//         } catch (error) {
//             setAlert({
//                 type: 'danger',
//                 message: error.response?.data?.message || error.message || 'Error al agregar cheque'
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm('¿Está seguro de eliminar este registro?')) return;

//         try {
//             await api.delete(`/records/${id}`);
//             setAlert({ type: 'success', message: 'Registro eliminado' });
//             loadRecords();
//         } catch (error) {
//             setAlert({ type: 'danger', message: 'Error al eliminar registro' });
//         }
//     };

//     const handleGenerate = async () => {
//         if (records.length === 0) {
//             setAlert({ type: 'warning', message: 'No hay registros para generar el archivo' });
//             return;
//         }

//         if (!window.confirm(`¿Generar archivo CIG con ${records.length} registros?`)) return;

//         setLoading(true);
//         try {
//             const response = await api.post('/files/generate', {
//                 lote_id: lote.id,
//                 observaciones: ''
//             });

//             if (response.data.error) {
//                 throw new Error(response.data.message);
//             }

//             setAlert({
//                 type: 'success',
//                 message: `Archivo ${response.data.file.filename} generado exitosamente. Iniciando nuevo lote...`
//             });

//             // Recargar lote y limpiar registros
//             setTimeout(() => {
//                 loadActiveLote();
//                 setRecords([]);
//                 setAlert(null);
//             }, 2000);

//         } catch (error) {
//             setAlert({
//                 type: 'danger',
//                 message: error.response?.data?.message || 'Error al generar archivo'
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const totalImporte = records.reduce((sum, r) => sum + r.importe, 0);

//     return (
//         <>
//             <Navigation />
//             <Container fluid className="px-4">
//                 <Row className="mb-4">
//                     <Col>
//                         <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>📝 Cargar Cheques</h1>
//                         {lote && (
//                             <p className="text-muted">
//                                 Lote Actual: <strong>{lote.id}</strong> |
//                                 Creado: {format(new Date(lote.created_at), 'dd/MM/yyyy HH:mm')}
//                             </p>
//                         )}
//                     </Col>
//                 </Row>

//                 {alert && (
//                     <Alert variant={alert.type} dismissible onClose={() => setAlert(null)}>
//                         {alert.message}
//                     </Alert>
//                 )}

//                     <Row lg={7}>
//                         <Card className="mb-4">
//                             <Card.Header>
//                                 <h5 className="mb-0">Nuevo Cheque</h5>
//                             </Card.Header>
//                             <Card.Body>
//                                 <Form onSubmit={handleSubmit}>
//                                     <Row>
//                                         <Col md={6}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>Cliente *</Form.Label>
//                                                 <Form.Control
//                                                     type="text"
//                                                     name="cliente"
//                                                     value={formData.cliente}
//                                                     onChange={handleChange}
//                                                     required
//                                                     list="clientes-list"
//                                                     isInvalid={invalidFields.includes('cliente')}
//                                                 />
//                                                 <datalist id="clientes-list">
//                                                     {clients.map(c => (
//                                                         <option key={c._id} value={c.nombre}>{c.cuit}</option>
//                                                     ))}
//                                                 </datalist>
//                                                 <Form.Control.Feedback type="invalid">El cliente es obligatorio.</Form.Control.Feedback>
//                                             </Form.Group>
//                                         </Col>
//                                         <Col md={6}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>Tipo Identificación</Form.Label>
//                                                 <Form.Control
//                                                     type="text"
//                                                     name="tipoIdentificacion"
//                                                     value={formData.tipoIdentificacion}
//                                                     onChange={handleChange}
//                                                     required
//                                                     isInvalid={invalidFields.includes('tipoIdentificacion')}
//                                                 />
//                                                 <Form.Control.Feedback type="invalid">Tipo de identificación inválido.</Form.Control.Feedback>
//                                             </Form.Group>
//                                         </Col>
//                                         <Col md={6}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>Identificación Cliente</Form.Label>
//                                                 <Form.Control
//                                                     type="text"
//                                                     name="identificacionCliente"
//                                                     value={formData.identificacionCliente}
//                                                     onChange={handleChange}
//                                                     required
//                                                     isInvalid={invalidFields.includes('identificacionCliente')}
//                                                 />
//                                                 <Form.Control.Feedback type="invalid">Identificación del cliente requerida o inválida.</Form.Control.Feedback>
//                                             </Form.Group>
//                                         </Col>
//                                         <Col md={6}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>CUIT (11-18 dígitos) *</Form.Label>
//                                                 <Form.Control
//                                                     type="text"
//                                                     name="cuit"
//                                                     value={formData.cuit}
//                                                     onChange={handleChange}
//                                                     required
//                                                     maxLength={18}
//                                                     pattern="\d{11,18}"
//                                                     isInvalid={invalidFields.includes('cuit')}
//                                                 />
//                                                 <Form.Control.Feedback type="invalid">CUIT/CUIL inválido (11-18 dígitos).</Form.Control.Feedback>
//                                             </Form.Group>
//                                         </Col>
//                                         <Col md={6}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>Tipo Documento</Form.Label>
//                                                 <Form.Select
//                                                     name="tipoDocumento"
//                                                     value={formData.tipoDocumento}
//                                                     onChange={handleChange}
//                                                     isInvalid={invalidFields.includes('tipoDocumento')}
//                                                 >
//                                                     <option value="FC">Factura</option>
//                                                     <option value="PC">Pago a cuenta</option>
//                                                     <option value="CH">Cheque</option>
//                                                     <option value="ND">Nota Debito</option>
//                                                     <option value="RE">Cheque Rechazado</option>
//                                                     <option value="VS">Varios Debitos</option>
//                                                     <option value="NC">Nota Credito</option>
//                                                 </Form.Select>
//                                                 <Form.Control.Feedback type="invalid">Seleccione el tipo de documento.</Form.Control.Feedback>
//                                             </Form.Group>
//                                         </Col>
//                                         <Col md={6}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>Identificación Documento</Form.Label>
//                                                 <Form.Control
//                                                     type="text"
//                                                     name="idDocumento"
//                                                     value={formData.tipoDocumento === 'PC' ? ''.padEnd(25, ' ') : formData.idDocumento}
//                                                     onChange={handleChange}
//                                                     maxLength={25}
//                                                     readOnly={formData.tipoDocumento === 'PC'}
//                                                     placeholder={formData.tipoDocumento === 'PC' ? 'Completa con espacios' : ''}
//                                                     isInvalid={invalidFields.includes('idDocumento')}
//                                                 />
//                                                 <Form.Control.Feedback type="invalid">Identificación de documento requerida para este tipo.</Form.Control.Feedback>
//                                             </Form.Group>
//                                         </Col>
//                                         <Col md={6}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>Identificación Interna Documento</Form.Label>
//                                                 <Form.Control
//                                                     type="text"
//                                                     name="idInterna"
//                                                     value={''.padEnd(30, ' ')}
//                                                     readOnly
//                                                     maxLength={30}
//                                                     placeholder="Se completa con espacios"
//                                                 />
//                                                 <Form.Text className="text-muted">Este campo se completa automáticamente con espacios.</Form.Text>
//                                             </Form.Group>
//                                         </Col>
//                                         <Col md={6}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>División</Form.Label>
//                                                 <Form.Control
//                                                     type="text"
//                                                     name="division"
//                                                     value={''.padEnd(6, ' ')}
//                                                     readOnly
//                                                     maxLength={6}
//                                                     placeholder="Se completa con espacios"
//                                                 />
//                                                 <Form.Text className="text-muted">Este campo se completa automáticamente con espacios.</Form.Text>
//                                             </Form.Group>
//                                         </Col>
//                                         <Col md={3}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>Código Moneda</Form.Label>
//                                                 <Form.Select
//                                                     name="codMoneda"
//                                                     value={formData.codMoneda}
//                                                     onChange={handleChange}
//                                                 >
//                                                     <option value="00">Pesos</option>
//                                                     <option value="02">Dólares</option>
//                                                 </Form.Select>
//                                             </Form.Group>
//                                         </Col>
//                                         <Col md={3}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>Sucursal Pago</Form.Label>
//                                                 <Form.Control
//                                                     type="text"
//                                                     name="sucursalPago"
//                                                     value={formData.sucursalPago}
//                                                     onChange={handleChange}
//                                                     maxLength={3}
//                                                 />
//                                             </Form.Group>
//                                         </Col>
//                                         <Col md={3}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>Forma de Pago</Form.Label>
//                                                 <Form.Select
//                                                     name="formaPago"
//                                                     value={formData.formaPago}
//                                                     onChange={handleChange}
//                                                 >
//                                                     <option value="1">1 - Efectivo</option>
//                                                     <option value="2">2 - Cheque 48 / Valor al Cobro / Cheque Galicia</option>
//                                                     <option value="3">3 - Cheque de pago diferido</option>
//                                                     <option value="4">4 - Transferencia</option>
//                                                     <option value="5">5 - Cheque Galicia (según parámetros)</option>
//                                                     <option value="=" disabled={formData.tipoDocumento !== 'NC'}>= - Nota de crédito (solo si Tipo de documento es NC)</option>
//                                                 </Form.Select>
//                                             </Form.Group>
//                                         </Col>
//                                         <Col md={3}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>Pago Parcial</Form.Label>
//                                                 <Form.Select
//                                                     name="pagoParcial"
//                                                     value={formData.pagoParcial}
//                                                     onChange={handleChange}
//                                                 >
//                                                     <option value="N">No</option>
//                                                     <option value="S">Sí</option>
//                                                 </Form.Select>
//                                             </Form.Group>
//                                         </Col>
//                                         <Col md={6}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>Importe Pago *</Form.Label>
//                                                 <Form.Control
//                                                     type="number"
//                                                     name="importePago"
//                                                     value={formData.importePago}
//                                                     onChange={handleChange}
//                                                     required
//                                                     step="0.01"
//                                                     min="0"
//                                                     isInvalid={invalidFields.includes('importePago')}
//                                                 />
//                                                 <Form.Control.Feedback type="invalid">Importe inválido o requerido.</Form.Control.Feedback>
//                                             </Form.Group>
//                                         </Col>
//                                         <Col md={6}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>Importe Cheque</Form.Label>
//                                                 <Form.Control
//                                                     type="number"
//                                                     name="importeCheque"
//                                                     value={formData.importeCheque}
//                                                     onChange={handleChange}
//                                                     step="0.01"
//                                                     min="0"
//                                                 />
//                                             </Form.Group>
//                                         </Col>
//                                         <Col md={6}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>N° Cheque</Form.Label>
//                                                 <Form.Control
//                                                     type="text"
//                                                     name="nroCheque"
//                                                     value={formData.nroCheque}
//                                                     onChange={handleChange}
//                                                     maxLength={9}
//                                                 />
//                                             </Form.Group>
//                                         </Col>
//                                         <Col md={6}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>Código Banco</Form.Label>
//                                                 <Form.Control
//                                                     type="text"
//                                                     name="codBanco"
//                                                     value={formData.codBanco}
//                                                     onChange={handleChange}
//                                                     maxLength={3}
//                                                 />
//                                             </Form.Group>
//                                         </Col>
//                                         <Col md={6}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>Identificación Pago</Form.Label>
//                                                 <Form.Control
//                                                     type="text"
//                                                     name="idPago"
//                                                     value={formData.idPago || ''.padEnd(9, ' ')}
//                                                     onChange={handleChange}
//                                                     maxLength={9}
//                                                     placeholder="Código del ticket (opcional, si vacío se completa con espacios)"
//                                                 />
                                                
//                                             </Form.Group>
//                                         </Col>
//                                         <Col md={6}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>N° Documento Pago</Form.Label>
//                                                 <Form.Control
//                                                     type="text"
//                                                     name="docPago"
//                                                     value={formData.docPago}
//                                                     onChange={handleChange}
//                                                     maxLength={25}
//                                                 />
//                                             </Form.Group>
//                                         </Col>
//                                         <Col md={6}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>Tipo Canal</Form.Label>
//                                                 <Form.Select
//                                                     name="tipoCanal"
//                                                     value={formData.tipoCanal}
//                                                     onChange={handleChange}
//                                                 >
//                                                     <option value="01">01 - Caja</option>
//                                                     <option value="07">07 - Terminal de Autoservicio</option>
//                                                     <option value="02">02 - BtoB</option>
//                                                     <option value="12">12 - TRF Otros bancos</option>
//                                                 </Form.Select>
//                                             </Form.Group>
//                                         </Col>
//                                         <Col md={6}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>Descripción Canal</Form.Label>
//                                                 <Form.Control
//                                                     type="text"
//                                                     name="descCanal"
//                                                     value={
//                                                         formData.tipoCanal === '01' ? 'CAJA' :
//                                                         formData.tipoCanal === '07' ? 'T.AUTOSERV.C/R' :
//                                                         formData.tipoCanal === '02' ? 'BTOB' :
//                                                         formData.tipoCanal === '12' ? 'TRF OTROS BANCOS' :
//                                                         ''
//                                                     }
//                                                     readOnly
//                                                     maxLength={14}
//                                                 />
//                                             </Form.Group>
//                                         </Col>
//                                         <Col md={6}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>N° Boleta CASH</Form.Label>
//                                                 <Form.Control
//                                                     type="text"
//                                                     name="boletaCash"
//                                                     value={formData.boletaCash}
//                                                     onChange={handleChange}
//                                                     maxLength={9}
//                                                 />
//                                             </Form.Group>
//                                         </Col>
//                                         <Col md={6}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>Fecha Pago *</Form.Label>
//                                                 <Form.Control
//                                                     type="date"
//                                                     name="fechaPago"
//                                                     value={formData.fechaPago}
//                                                     onChange={handleChange}
//                                                     required
//                                                     isInvalid={invalidFields.includes('fechaPago')}
//                                                 />
//                                                 <Form.Control.Feedback type="invalid">Fecha de pago requerida.</Form.Control.Feedback>
//                                             </Form.Group>
//                                         </Col>
//                                         <Col md={6}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>Fecha Acreditación</Form.Label>
//                                                 <Form.Control
//                                                     type="date"
//                                                     name="fechaAcred"
//                                                     value={formData.fechaAcred}
//                                                     onChange={handleChange}
//                                                 />
//                                             </Form.Group>
//                                         </Col>
//                                         <Col md={3}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>Marca Informado</Form.Label>
//                                                 <Form.Select
//                                                     name="marcaInformado"
//                                                     value={formData.marcaInformado}
//                                                     onChange={handleChange}
//                                                 >
//                                                     <option value="N">No</option>
//                                                     <option value="S">Sí</option>
//                                                 </Form.Select>
//                                             </Form.Group>
//                                         </Col>
//                                         <Col md={3}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>Marca Anulado</Form.Label>
//                                                 <Form.Select
//                                                     name="marcaAnulado"
//                                                     value={formData.marcaAnulado}
//                                                     onChange={handleChange}
//                                                 >
//                                                     <option value="N">No</option>
//                                                     <option value="S">Sí</option>
//                                                 </Form.Select>
//                                             </Form.Group>
//                                         </Col>
//                                         <Col md={6}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label>Observaciones</Form.Label>
//                                                 <Form.Control
//                                                     as="textarea"
//                                                     rows={2}
//                                                     name="observaciones"
//                                                     value={formData.observaciones}
//                                                     onChange={handleChange}
//                                                 />
//                                             </Form.Group>
//                                         </Col>
//                                     </Row>

//                                     <div className="d-grid">
//                                         <Button
//                                             variant="primary"
//                                             type="submit"
//                                             disabled={loading}
//                                             style={{ minHeight: '48px', fontSize: '1.1rem', fontWeight: 'bold' }}
//                                         >
//                                             {loading ? 'Guardando...' : '➕ Agregar Cheque'}
//                                         </Button>
//                                     </div>

//                                     <div className="mt-3 d-flex gap-2">
//                                         <Button variant="secondary" onClick={() => {
//                                             // rebuild cigFields preview then toggle
//                                             const cf = {
//                                                 registro: 'D',
//                                                 tipoIdentificacion: padSpaces(formData.tipoIdentificacion, 4),
//                                                 identificacionCliente: padSpaces(formData.identificacionCliente, 15),
//                                                 cuit: padZeros(formData.cuit || '', 11),
//                                                 tipoDocumento: padSpaces(formData.tipoDocumento, 2),
//                                                 idDocumento: formData.tipoDocumento === 'PC' ? padSpaces('',25) : padSpaces(formData.idDocumento || '',25),
//                                                 idInterna: padSpaces('',30),
//                                                 division: padSpaces('',6),
//                                                 codMoneda: padSpaces(formData.codMoneda || '',2),
//                                                 fechaVigencia: formatDateForCIG(formData.fechaPago),
//                                                 sucursalPago: padZeros(formData.sucursalPago || '101',3),
//                                                 formaPago: padSpaces(formData.formaPago || '2',1),
//                                                 idPago: padSpaces(formData.idPago || '',9),
//                                                 pagoParcial: padSpaces(formData.pagoParcial || 'N',1),
//                                                 importe1: ['FC','ND','RE','NC'].includes(String(formData.tipoDocumento)) ? formatAmountForCIG(formData.importePago) : padSpaces('',15),
//                                                 fechaVenc1: formatDateForCIG(formData.fechaAcred),
//                                                 importe2: padSpaces('',15),
//                                                 fechaVenc2: padSpaces('',8),
//                                                 importe3: padSpaces('',15),
//                                                 fechaVenc3: padSpaces('',8),
//                                                 nombreCliente: padSpaces(formData.cliente,30),
//                                                 idInterna2: padSpaces('',30),
//                                                 division2: padSpaces('',6),
//                                                 codMoneda2: padSpaces(formData.codMoneda || '',2),
//                                                 leyenda1: padSpaces(formData.observaciones || '',38),
//                                                 leyenda2: padSpaces('',38),
//                                                 filler: padSpaces('',14)
//                                             };
//                                             const line = buildCIGLinePreview(cf, formData);
//                                             setCigPreview(line);
//                                             setShowCigPreview(s => !s);
//                                         }}>{showCigPreview ? 'Ocultar previsualización CIG' : 'Mostrar previsualización CIG'}</Button>
//                                         <div className="align-self-center text-muted" style={{fontSize:'0.9rem'}}>{cigPreview ? `Longitud: ${cigPreview.length}` : ''}</div>
//                                     </div>

//                                     {showCigPreview && (
//                                         <Card className="mt-3">
//                                             <Card.Body>
//                                                 <div className={`cig-preview ${cigPreview.length === 300 ? 'ok' : 'bad'}`}>
//                                                     {cigPreview}
//                                                 </div>
//                                                 <div className="mt-2">
//                                                     {cigPreview.length === 300 ? (
//                                                         <small className="text-success">La línea tiene 300 caracteres.</small>
//                                                     ) : (
//                                                         <small className="text-danger">La línea tiene {cigPreview.length} caracteres — debe ser 300.</small>
//                                                     )}
//                                                 </div>
//                                             </Card.Body>
//                                         </Card>
//                                     )}
//                                 </Form>
//                             </Card.Body>
//                         </Card>
//                     </Row>

//                     <Row lg={7}>
//                         <Card>
//                             <Card.Header className="d-flex justify-content-between align-items-center">
//                                 <h5 className="mb-0">Registros del Lote ({records.length})</h5>
//                                 <div>
//                                     <Button
//                                         variant="success"
//                                         onClick={handleGenerate}
//                                         disabled={records.length === 0 || loading}
//                                         style={{ minHeight: '44px' }}
//                                     >
//                                         📄 Generar Archivo TXT
//                                     </Button>
//                                 </div>
//                             </Card.Header>
//                             <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
//                                 {records.length === 0 ? (
//                                     <div className="text-center text-muted py-5">
//                                         <p style={{ fontSize: '1.1rem' }}>No hay registros en este lote</p>
//                                         <p>Agregue cheques usando el formulario</p>
//                                     </div>
//                                 ) : (
//                                     <>
//                                         <Table hover responsive className="table-dark">
//                                             <thead>
//                                                 <tr>
//                                                     <th>#</th>
//                                                     <th>Cliente</th>
//                                                     <th>CUIT</th>
//                                                     <th>Importe</th>
//                                                     <th>Vencimiento</th>
//                                                     <th>Acciones</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {records.map((record, index) => (
//                                                     <tr key={record._id}>
//                                                         <td>{index + 1}</td>
//                                                         <td>{record.cliente}</td>
//                                                         <td>{record.cuit}</td>
//                                                         <td>${record.importe.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
//                                                         <td>{format(new Date(record.fecha_vto), 'dd/MM/yyyy')}</td>
//                                                         <td>
//                                                             <Button
//                                                                 variant="danger"
//                                                                 size="sm"
//                                                                 onClick={() => handleDelete(record._id)}
//                                                                 disabled={record.estado === 'exportado'}
//                                                             >
//                                                                 🗑️
//                                                             </Button>
//                                                         </td>
//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                             <tfoot>
//                                                 <tr>
//                                                     <th colSpan="3" className="text-end">Total:</th>
//                                                     <th>${totalImporte.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</th>
//                                                     <th colSpan="2"></th>
//                                                 </tr>
//                                             </tfoot>
//                                         </Table>
//                                     </>
//                                 )}
//                             </Card.Body>
//                         </Card>
//                     </Row>
//             </Container>
//         </>
//     );
// };

// export default ChequesPage;


import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import api from '../services/api';
import { format } from 'date-fns';

const ChequesPage = () => {
    const { user } = useAuth();
    const [lote, setLote] = useState(null);
    const [records, setRecords] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const [formData, setFormData] = useState({
        // Campos principales (usuario debe completar)
        cliente: '',
        cuit: '',
        importePago: '',
        fechaPago: '',
        
        // Campos con valores por defecto inteligentes
        tipoIdentificacion: 'CUIT',
        identificacionCliente: '',
        tipoDocumento: 'PC',
        idDocumento: '',
        idInterna: '',
        division: '',
        codMoneda: '00',
        sucursalPago: '101',
        formaPago: '2', // 2 = Cheque 48 / Valor al Cobro / Cheque Galicia
        idPago: '',
        pagoParcial: 'N',
        nroCheque: '',
        fechaAcred: '',
        importeCheque: '',
        codBanco: '007',
        marcaInformado: 'N',
        marcaAnulado: 'N',
        docPago: '',
        tipoCanal: '07', // 07 = Terminal de Autoservicio
        descCanal: 'T.AUTOSERV.C/R',
        boletaCash: '000000000',
        observaciones: ''
    });

    const [invalidFields, setInvalidFields] = useState([]);

    useEffect(() => {
        loadActiveLote();
        loadClients();
    }, []);

    useEffect(() => {
        if (lote) {
            loadRecords();
        }
    }, [lote]);

    // Auto-completado inteligente basado en cambios de campos
    useEffect(() => {
        // Auto-actualizar descripción del canal según tipo de canal
        const canalDescriptions = {
            '01': 'CAJA',
            '07': 'T.AUTOSERV.C/R',
            '02': 'BTOB',
            '12': 'TRF OTROS BANCOS'
        };
        
        if (canalDescriptions[formData.tipoCanal]) {
            setFormData(prev => ({
                ...prev,
                descCanal: canalDescriptions[prev.tipoCanal]
            }));
        }
    }, [formData.tipoCanal]);

    useEffect(() => {
        // Si tipo documento es PC, limpiar ID Documento
        if (formData.tipoDocumento === 'PC') {
            setFormData(prev => ({
                ...prev,
                idDocumento: ''
            }));
        }
    }, [formData.tipoDocumento]);

    useEffect(() => {
        // Si forma de pago es 5 (Cheque Galicia), código banco = 007
        if (formData.formaPago === '5') {
            setFormData(prev => ({
                ...prev,
                codBanco: '007'
            }));
        }
    }, [formData.formaPago]);

    useEffect(() => {
        // Auto-completar importe cheque si no está ingresado y forma de pago es cheque
        if (['2', '3', '5'].includes(formData.formaPago) && !formData.importeCheque && formData.importePago) {
            setFormData(prev => ({
                ...prev,
                importeCheque: prev.importePago
            }));
        }
    }, [formData.formaPago, formData.importePago]);

    useEffect(() => {
        // Auto-completar fecha acreditación si no está y forma de pago es cheque
        if (['2', '3', '5'].includes(formData.formaPago) && !formData.fechaAcred && formData.fechaPago) {
            setFormData(prev => ({
                ...prev,
                fechaAcred: prev.fechaPago
            }));
        }
    }, [formData.formaPago, formData.fechaPago]);

    const loadActiveLote = async () => {
        try {
            const response = await api.get('/lotes/active');
            setLote(response.data.lote);
        } catch (error) {
            console.error('Error al cargar lote:', error);
        }
    };

    const loadRecords = async () => {
        if (!lote) return;

        try {
            const response = await api.get(`/records/${lote.id}`);
            setRecords(response.data.records || []);
        } catch (error) {
            console.error('Error al cargar registros:', error);
        }
    };

    const loadClients = async (query = '') => {
        try {
            const response = await api.get(`/clients?q=${query}`);
            setClients(response.data.clients || []);
        } catch (error) {
            console.error('Error al cargar clientes:', error);
        }
    };

    const handleClientSelect = (client) => {
        setFormData({
            ...formData,
            cliente: client.nombre,
            cuit: client.cuit,
            identificacionCliente: client.cuit
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Autocompletado de clientes
        if (name === 'cuit' && value.length >= 3) {
            loadClients(value);
        }
        if (name === 'cliente' && value.length >= 3) {
            loadClients(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        setInvalidFields([]);

        // Validación de campos obligatorios
        const requiredFields = ['cliente', 'cuit', 'importePago', 'fechaPago'];
        let invalids = requiredFields.filter(f => 
            !formData[f] || (typeof formData[f] === 'string' && formData[f].trim() === '')
        );

        // Validar CUIT (11-18 dígitos)
        if (formData.cuit && !/^\d{11,18}$/.test(formData.cuit)) {
            invalids.push('cuit');
        }

        // Si tipo documento != PC, idDocumento es obligatorio
        if (formData.tipoDocumento !== 'PC' && !formData.idDocumento) {
            invalids.push('idDocumento');
        }

        // Si forma de pago es cheque (2, 3, 5), validar campos de cheque
        if (['2', '3', '5'].includes(formData.formaPago)) {
            if (!formData.nroCheque) invalids.push('nroCheque');
            if (!formData.fechaAcred) invalids.push('fechaAcred');
            if (!formData.importeCheque) invalids.push('importeCheque');
        }

        if (invalids.length > 0) {
            setInvalidFields(invalids);
            setLoading(false);
            setAlert({ 
                type: 'danger', 
                message: `Por favor complete los campos obligatorios: ${invalids.join(', ')}` 
            });
            
            // Scroll al primer campo inválido
            setTimeout(() => {
                const first = document.querySelector('.is-invalid');
                if (first) {
                    first.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    try { first.focus(); } catch (e) {}
                }
            }, 120);
            return;
        }

        try {
            if (!lote) {
                throw new Error('No hay lote activo');
            }

            // Enviar al backend con normalización automática
            const dataToSend = {
                lote_id: lote.id,
                // Campos principales
                cliente: formData.cliente,
                cuit: formData.cuit,
                importePago: parseFloat(formData.importePago),
                fechaPago: formData.fechaPago,
                // Todos los demás campos
                tipoIdentificacion: formData.tipoIdentificacion,
                identificacionCliente: formData.identificacionCliente || formData.cuit,
                tipoDocumento: formData.tipoDocumento,
                idDocumento: formData.tipoDocumento === 'PC' ? '' : formData.idDocumento,
                idInterna: formData.idInterna || '',
                division: formData.division || '',
                codMoneda: formData.codMoneda,
                sucursalPago: formData.sucursalPago,
                formaPago: formData.formaPago,
                idPago: formData.idPago || '',
                pagoParcial: formData.pagoParcial,
                nroCheque: ['2', '3', '5'].includes(formData.formaPago) ? formData.nroCheque : '',
                fechaAcred: ['2', '3', '5'].includes(formData.formaPago) ? (formData.fechaAcred || formData.fechaPago) : '',
                importeCheque: ['2', '3', '5'].includes(formData.formaPago) ? parseFloat(formData.importeCheque || formData.importePago) : 0,
                codBanco: formData.formaPago === '5' ? '007' : (formData.codBanco || '000'),
                marcaInformado: formData.marcaInformado,
                marcaAnulado: formData.marcaAnulado,
                docPago: formData.docPago || '',
                tipoCanal: formData.tipoCanal,
                descCanal: formData.descCanal,
                boletaCash: formData.boletaCash || '000000000',
                observaciones: formData.observaciones || ''
            };

            const response = await api.post('/records', dataToSend);

            if (response.data.error) {
                throw new Error(response.data.message);
            }

            setAlert({ type: 'success', message: 'Pago agregado exitosamente' });

            // Limpiar formulario manteniendo valores por defecto
            setFormData({
                cliente: '',
                cuit: '',
                importePago: '',
                fechaPago: '',
                tipoIdentificacion: 'CUIT',
                identificacionCliente: '',
                tipoDocumento: 'PC',
                idDocumento: '',
                idInterna: '',
                division: '',
                codMoneda: '00',
                sucursalPago: '101',
                formaPago: '2',
                idPago: '',
                pagoParcial: 'N',
                nroCheque: '',
                fechaAcred: '',
                importeCheque: '',
                codBanco: '007',
                marcaInformado: 'N',
                marcaAnulado: 'N',
                docPago: '',
                tipoCanal: '07',
                descCanal: 'T.AUTOSERV.C/R',
                boletaCash: '000000000',
                observaciones: ''
            });

            loadRecords();
        } catch (error) {
            setAlert({
                type: 'danger',
                message: error.response?.data?.message || error.message || 'Error al agregar pago'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Está seguro de eliminar este registro?')) return;

        try {
            await api.delete(`/records/${id}`);
            setAlert({ type: 'success', message: 'Registro eliminado' });
            loadRecords();
        } catch (error) {
            setAlert({ type: 'danger', message: 'Error al eliminar registro' });
        }
    };

    const handleGenerate = async () => {
        if (records.length === 0) {
            setAlert({ type: 'warning', message: 'No hay registros para generar el archivo' });
            return;
        }

        if (!window.confirm(`¿Generar archivo de Rendición CIG con ${records.length} registros?`)) return;

        setLoading(true);
        try {
            const response = await api.post('/files/generate-rendicion', {
                lote_id: lote.id,
                numeroConvenio: '0000002489', // Ajustar según corresponda
                observaciones: ''
            });

            if (response.data.error) {
                throw new Error(response.data.message);
            }

            setAlert({
                type: 'success',
                message: `Archivo ${response.data.file.filename} generado exitosamente. Iniciando nuevo lote...`
            });

            // Recargar lote y limpiar registros
            setTimeout(() => {
                loadActiveLote();
                setRecords([]);
                setAlert(null);
            }, 2000);

        } catch (error) {
            setAlert({
                type: 'danger',
                message: error.response?.data?.message || 'Error al generar archivo'
            });
        } finally {
            setLoading(false);
        }
    };

    const totalImporte = records.reduce((sum, r) => sum + (r.importePago || r.importe || 0), 0);

    // Helper para mostrar info de forma de pago
    const getFormaPagoLabel = (codigo) => {
        const formasPago = {
            '1': 'Efectivo',
            '2': 'Cheque 48 / Valor al Cobro',
            '3': 'Cheque Diferido',
            '4': 'Transferencia',
            '5': 'Cheque Galicia'
        };
        return formasPago[codigo] || codigo;
    };

    return (
        <>
            <Navigation />
            <Container fluid className="px-4">
                <Row className="mb-4">
                    <Col>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                            💰 Rendición de Pagos CIG
                        </h1>
                        {lote && (
                            <p className="text-muted">
                                Lote Actual: <strong>{lote.id}</strong> |
                                Creado: {format(new Date(lote.created_at), 'dd/MM/yyyy HH:mm')}
                            </p>
                        )}
                    </Col>
                </Row>

                {alert && (
                    <Alert variant={alert.type} dismissible onClose={() => setAlert(null)}>
                        {alert.message}
                    </Alert>
                )}

                <Row>
                    <Col lg={7}>
                        <Card className="mb-4">
                            <Card.Header>
                                <h5 className="mb-0">
                                    📝 Nuevo Pago 
                                    <Badge bg="info" className="ms-2">Auto-completado inteligente</Badge>
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <Form onSubmit={handleSubmit}>
                                    <Alert variant="info" className="mb-3">
                                        <small>
                                            <strong>💡 Tip:</strong> Complete solo los campos con valores distintos de cero. 
                                            El sistema completará automáticamente con espacios o ceros según corresponda.
                                        </small>
                                    </Alert>

                                    <Row>
                                        {/* CAMPOS OBLIGATORIOS */}
                                        <Col md={12}>
                                            <h6 className="text-primary mt-2 mb-3">📋 Datos Obligatorios</h6>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Cliente *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="cliente"
                                                    value={formData.cliente}
                                                    onChange={handleChange}
                                                    required
                                                    list="clientes-list"
                                                    isInvalid={invalidFields.includes('cliente')}
                                                />
                                                <datalist id="clientes-list">
                                                    {clients.map(c => (
                                                        <option key={c._id} value={c.nombre}>{c.cuit}</option>
                                                    ))}
                                                </datalist>
                                                <Form.Control.Feedback type="invalid">
                                                    El cliente es obligatorio.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>CUIT/CUIL * (11-18 dígitos)</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="cuit"
                                                    value={formData.cuit}
                                                    onChange={handleChange}
                                                    required
                                                    maxLength={18}
                                                    pattern="\d{11,18}"
                                                    isInvalid={invalidFields.includes('cuit')}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    CUIT/CUIL inválido (11-18 dígitos).
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Importe Pago *</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="importePago"
                                                    value={formData.importePago}
                                                    onChange={handleChange}
                                                    required
                                                    step="0.01"
                                                    min="0"
                                                    isInvalid={invalidFields.includes('importePago')}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Importe inválido o requerido.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Fecha Pago *</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="fechaPago"
                                                    value={formData.fechaPago}
                                                    onChange={handleChange}
                                                    required
                                                    isInvalid={invalidFields.includes('fechaPago')}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Fecha de pago requerida.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>

                                        {/* CONFIGURACIÓN DEL PAGO */}
                                        <Col md={12}>
                                            <h6 className="text-primary mt-3 mb-3">⚙️ Configuración del Pago</h6>
                                        </Col>

                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Tipo Documento</Form.Label>
                                                <Form.Select
                                                    name="tipoDocumento"
                                                    value={formData.tipoDocumento}
                                                    onChange={handleChange}
                                                >
                                                    <option value="FC">FC - Factura</option>
                                                    <option value="PC">PC - Pago a cuenta</option>
                                                    <option value="ND">ND - Nota Débito</option>
                                                    <option value="RE">RE - Cheque Rechazado</option>
                                                    <option value="VS">VS - Varios Débito</option>
                                                    <option value="NC">NC - Nota Crédito</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Forma de Pago</Form.Label>
                                                <Form.Select
                                                    name="formaPago"
                                                    value={formData.formaPago}
                                                    onChange={handleChange}
                                                >
                                                    <option value="1">1 - Efectivo</option>
                                                    <option value="2">2 - Cheque 48 / Valor al Cobro</option>
                                                    <option value="3">3 - Cheque Diferido</option>
                                                    <option value="4">4 - Transferencia</option>
                                                    <option value="5">5 - Cheque Galicia</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Tipo de Canal</Form.Label>
                                                <Form.Select
                                                    name="tipoCanal"
                                                    value={formData.tipoCanal}
                                                    onChange={handleChange}
                                                >
                                                    <option value="01">01 - Caja</option>
                                                    <option value="07">07 - Terminal Autoservicio</option>
                                                    <option value="02">02 - BtoB</option>
                                                    <option value="12">12 - TRF Otros bancos</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        {/* CAMPOS CONDICIONALES PARA CHEQUES */}
                                        {['2', '3', '5'].includes(formData.formaPago) && (
                                            <>
                                                <Col md={12}>
                                                    <h6 className="text-warning mt-2 mb-3">
                                                        📄 Datos del Cheque (Obligatorios para esta forma de pago)
                                                    </h6>
                                                </Col>

                                                <Col md={4}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Nº Cheque *</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="nroCheque"
                                                            value={formData.nroCheque}
                                                            onChange={handleChange}
                                                            maxLength={9}
                                                            required
                                                            isInvalid={invalidFields.includes('nroCheque')}
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={4}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Fecha Acreditación *</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            name="fechaAcred"
                                                            value={formData.fechaAcred}
                                                            onChange={handleChange}
                                                            required
                                                            isInvalid={invalidFields.includes('fechaAcred')}
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={4}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Importe Cheque *</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            name="importeCheque"
                                                            value={formData.importeCheque}
                                                            onChange={handleChange}
                                                            step="0.01"
                                                            min="0"
                                                            required
                                                            isInvalid={invalidFields.includes('importeCheque')}
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={4}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Código Banco</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="codBanco"
                                                            value={formData.codBanco}
                                                            onChange={handleChange}
                                                            maxLength={3}
                                                            readOnly={formData.formaPago === '5'}
                                                        />
                                                        <Form.Text className="text-muted">
                                                            {formData.formaPago === '5' && 'Auto: 007 (Banco Galicia)'}
                                                        </Form.Text>
                                                    </Form.Group>
                                                </Col>
                                            </>
                                        )}

                                        {/* CAMPOS OPCIONALES */}
                                        <Col md={12}>
                                            <h6 className="text-secondary mt-3 mb-3">📝 Datos Opcionales</h6>
                                        </Col>

                                        {formData.tipoDocumento !== 'PC' && (
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>ID Documento</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="idDocumento"
                                                        value={formData.idDocumento}
                                                        onChange={handleChange}
                                                        maxLength={25}
                                                        isInvalid={invalidFields.includes('idDocumento')}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        )}

                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>ID Pago (Código Ticket)</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="idPago"
                                                    value={formData.idPago}
                                                    onChange={handleChange}
                                                    maxLength={9}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Sucursal Pago</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="sucursalPago"
                                                    value={formData.sucursalPago}
                                                    onChange={handleChange}
                                                    maxLength={3}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Observaciones</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={2}
                                                    name="observaciones"
                                                    value={formData.observaciones}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <div className="d-grid">
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={loading}
                                            style={{ minHeight: '48px', fontSize: '1.1rem', fontWeight: 'bold' }}
                                        >
                                            {loading ? 'Guardando...' : '➕ Agregar Pago'}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={5}>
                        <Card>
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Registros del Lote ({records.length})</h5>
                                <div>
                                    <Button
                                        variant="success"
                                        onClick={handleGenerate}
                                        disabled={records.length === 0 || loading}
                                        style={{ minHeight: '44px' }}
                                    >
                                        📄 Generar Archivo TXT
                                    </Button>
                                </div>
                            </Card.Header>
                            <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                {records.length === 0 ? (
                                    <div className="text-center text-muted py-5">
                                        <p style={{ fontSize: '1.1rem' }}>No hay registros en este lote</p>
                                        <p>Agregue pagos usando el formulario</p>
                                    </div>
                                ) : (
                                    <>
                                        <Table hover responsive size="sm">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Cliente</th>
                                                    <th>CUIT</th>
                                                    <th>Importe</th>
                                                    <th>Forma Pago</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {records.map((record, index) => (
                                                    <tr key={record._id}>
                                                        <td>{index + 1}</td>
                                                        <td>{record.cliente}</td>
                                                        <td><small>{record.cuit}</small></td>
                                                        <td>
                                                            ${(record.importePago || record.importe || 0).toLocaleString('es-AR', { 
                                                                minimumFractionDigits: 2 
                                                            })}
                                                        </td>
                                                        <td>
                                                            <Badge bg="secondary">
                                                                {getFormaPagoLabel(record.formaPago || '2')}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                onClick={() => handleDelete(record._id)}
                                                                disabled={record.estado === 'exportado'}
                                                            >
                                                                🗑️
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <th colSpan="3" className="text-end">Total:</th>
                                                    <th>${totalImporte.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</th>
                                                    <th colSpan="2"></th>
                                                </tr>
                                            </tfoot>
                                        </Table>
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ChequesPage;
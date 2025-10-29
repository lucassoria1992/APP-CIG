import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ChequesPage from './pages/ChequesPage';
import FilesPage from './pages/FilesPage';
import AuditPage from './pages/AuditPage';
import UsersPage from './pages/UsersPage';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

export const DarkModeContext = createContext({ darkMode: false, setDarkMode: () => {} });

function App() {
    const [darkMode, setDarkMode] = useState(false);
    React.useEffect(() => {
        document.body.className = darkMode ? 'dark-mode' : '';
    }, [darkMode]);
    return (
        <AuthProvider>
            <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
                <Router>
                    <div className="App">
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/dashboard" element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            } />
                            <Route path="/cheques" element={
                                <PrivateRoute roles={['admin', 'operador']}>
                                    <ChequesPage />
                                </PrivateRoute>
                            } />
                            <Route path="/files" element={
                                <PrivateRoute>
                                    <FilesPage />
                                </PrivateRoute>
                            } />
                            <Route path="/audit" element={
                                <PrivateRoute roles={['admin', 'auditor']}>
                                    <AuditPage />
                                </PrivateRoute>
                            } />
                            <Route path="/users" element={
                                <PrivateRoute roles={['admin']}>
                                    <UsersPage />
                                </PrivateRoute>
                            } />
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </div>
                </Router>
            </DarkModeContext.Provider>
        </AuthProvider>
    );
}

export default App;

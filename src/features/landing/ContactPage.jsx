import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../app/useAppStore.js';
import { useTranslation } from 'react-i18next';
import { Logo } from '../../shared/ui/Logo.jsx';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs.jsx';

export const ContactPage = () => {
  const { setActiveTab, addToast } = useAppStore();
  const { i18n } = useTranslation();
  const lang = i18n?.language || 'es';
  const isEn = lang.startsWith('en');

  const [formData, setFormData] = useState({ name: '', email: '', subject: 'soporte', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [messagesList, setMessagesList] = useState([]);
  const [showAdminTickets, setShowAdminTickets] = useState(false);

  const [totalTickets, setTotalTickets] = useState(0);

  const fetchMessages = async (page = 1) => {
    try {
      const res = await fetch(`/api/contact/messages?page=${page}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        setMessagesList(Array.isArray(data) ? data : (data.items || []));
        setTotalTickets(Array.isArray(data) ? data.length : (data.total || 0));
      }
    } catch (_) {}
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast(isEn ? 'Please fill in all required fields.' : 'Por favor complete todos los campos requeridos.', 'error');
      return;
    }

    if (formData.email.length > 255) {
      addToast(isEn ? 'Email address is too long (maximum 255 characters).' : 'El correo electrónico es demasiado largo (máximo 255 caracteres).', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      addToast(isEn ? 'Invalid email format (example: user@domain.com).' : 'Formato de correo electrónico no válido (ejemplo: usuario@dominio.com).', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTicketId(data.ticketId || ('TICK-' + Date.now()));
        setSubmitted(true);
        addToast(isEn ? 'Message sent successfully. Ticket registered.' : 'Mensaje registrado con éxito en el sistema de tickets.', 'success');
        fetchMessages();
      } else {
        const errorMsg = Array.isArray(data.error) 
          ? data.error.map(e => e.message || e).join('. ') 
          : (data.error || (isEn ? 'Error processing request.' : 'Error al procesar solicitud.'));
        addToast(errorMsg, 'error');
      }
    } catch (err) {
      addToast(isEn ? 'Connection error. Please try again later.' : 'Error de conexión con el servidor. Intente nuevamente.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: '100%',
      padding: '0px 20px 80px 20px',
      background: 'radial-gradient(circle at top, var(--bg-tertiary) 0%, var(--bg-primary) 70%)',
      color: 'var(--text-primary)',
      fontFamily: '"Outfit", sans-serif',
      overflowY: 'auto',
      boxSizing: 'border-box'
    }}>
      <div style={{ width: '100%', textAlign: 'left' }}>
        <Breadcrumbs items={[{ label: 'Contacto & Soporte', path: '/contact' }]} />
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid var(--border-light)', paddingBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Logo height="42px" alt="NMerge IA - Logo de Contacto" />
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                {isEn ? 'Contact & Technical Support' : 'Contacto & Soporte Técnico'}
              </h1>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                {isEn ? 'User support, corporate inquiries, and local ticket management' : 'Atención al usuario, gestión local de tickets y soporte'}
              </span>
            </div>
          </div>
          {messagesList.length > 0 && (
            <button 
              className="btn secondary-btn small-btn"
              onClick={() => setShowAdminTickets(!showAdminTickets)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
            >
              <span className="material-symbols-rounded">confirmation_number</span>
              {showAdminTickets ? 'Ocultar Tickets' : `Tickets Registrados (${messagesList.length})`}
            </button>
          )}
        </div>

        {showAdminTickets ? (
          /* Panel de Administración Local de Tickets Recibidos */
          <div className="section-card" style={{ padding: '25px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-rounded">inbox</span>
                {isEn ? 'Received Contact Messages (Local Tickets)' : 'Mensajes y Tickets Recibidos (Base Local)'}
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Total: {messagesList.length} tickets</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
              {messagesList.map((msg) => (
                <div key={msg.id} style={{ padding: '15px', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{msg.id} — {msg.name} ({msg.email})</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 'bold', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Asunto: {msg.subject}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '25px' }}>
          {/* Left Column: Direct Info */}
          <div className="section-card" style={{ padding: '30px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)', lineHeight: '1.6' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: 0 }}>
              {isEn ? 'Corporate Info & Ticketing' : 'Información & Arquitectura de Soporte Técnico'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.7', margin: '0 0 12px 0' }}>
              NMerge IA implementa un sistema unificado de atención al cliente y registro de incidencias técnicas gobernado por la API de tickets integrada en la plataforma.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.7', margin: '0 0 12px 0' }}>
              Cada consulta recibida genera un identificador único (Ticket ID) que se almacena localmente en la base de datos de administración y se despacha de forma asíncrona hacia nuestros centros de soporte técnico. Este mecanismo previene el traspaso de información confidencial de la empresa y permite un seguimiento transparente de las solicitudes de los usuarios.
            </p>

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="material-symbols-rounded" style={{ color: '#10b981' }}>confirmation_number</span>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>{isEn ? 'Ticket System API' : 'Sistema de Tickets Local'}</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Endpoint /api/contact (Backend Node.js & Express)</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="material-symbols-rounded" style={{ color: '#3b82f6' }}>support_agent</span>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>{isEn ? 'Technical SLA' : 'Compromiso de Respuesta (SLA)'}</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {isEn ? 'Under 24 to 48 business hours' : 'Atención prioritaria en menos de 24 a 48 horas hábiles'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="material-symbols-rounded" style={{ color: '#f59e0b' }}>domain</span>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>{isEn ? 'Developing Body' : 'Entidad Desarrolladora & Titular'}</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>StackUpIA Software Labs S.A.</span>
                </div>
              </div>
            </div>

            <h4 style={{ marginTop: '25px', marginBottom: '10px', color: 'var(--text-primary)' }}>
              {isEn ? 'SLA Commitments & Data Governance' : 'Gobernanza de Datos y Compromisos de Soporte'}
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
              Las consultas relacionadas con licencias corporativas, auditorías de seguridad en código o solicitudes de portabilidad de datos según normativas GDPR y CCPA son procesadas directamente por nuestro equipo de Oficiales de Protección de Datos.
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
              Puede remitir solicitudes formales al correo electrónico dpo@stackupia.com o utilizar la consola de tickets adjunta.
            </p>
            <button className="btn secondary-btn" onClick={() => setActiveTab('faq')} style={{ marginTop: '10px', fontSize: '0.85rem' }}>
              {isEn ? 'View FAQ Page' : 'Ver Preguntas Frecuentes (FAQ)'}
            </button>
          </div>

          {/* Right Column: Contact Form */}
          <div className="section-card" style={{ padding: '30px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: 0 }}>
              {isEn ? 'Direct Ticket Request Form' : 'Formulario de Registro de Ticket'}
            </h3>

            {submitted ? (
              <div style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '8px', textAlign: 'center' }}>
                <span className="material-symbols-rounded" style={{ fontSize: '3rem', color: '#10b981' }}>check_circle</span>
                <h4 style={{ margin: '10px 0 5px 0' }}>{isEn ? 'Ticket Registered!' : '¡Ticket Registrado con Éxito!'}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  {isEn ? `Ticket ID: ${ticketId}` : `Código de Ticket: ${ticketId}`}
                </p>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  {isEn ? 'Thank you for reaching out. Our technical team has received your ticket.' : 'Gracias por escribirnos. Su solicitud ha quedado registrada en la base de datos de la plataforma.'}
                </p>
                <button 
                  className="btn secondary-btn" 
                  onClick={() => { 
                    setSubmitted(false); 
                    setFormData({ name: '', email: '', subject: 'soporte', message: '' }); 
                  }} 
                  style={{ marginTop: '15px' }}
                >
                  {isEn ? 'Send another request' : 'Registrar otra consulta'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 'bold' }}>
                    {isEn ? 'Full Name *' : 'Nombre Completo *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={isEn ? 'e.g. Jane Doe' : 'Ej. María Rodríguez'}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 'bold' }}>
                    {isEn ? 'Email Address *' : 'Correo Electrónico de Contacto *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="usuario@dominio.com"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 'bold' }}>
                    {isEn ? 'Inquiry Subject' : 'Asunto de la Consulta'}
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                  >
                    <option value="soporte">{isEn ? 'Technical Support / Bug Report' : 'Soporte Técnico / Error de App'}</option>
                    <option value="licencia">{isEn ? 'Pro License & Payments' : 'Licencia Pro & Pagos'}</option>
                    <option value="privacidad">{isEn ? 'Privacy & Data Protection' : 'Consulta de Privacidad & Datos'}</option>
                    <option value="comercial">{isEn ? 'Commercial / Business Inquiries' : 'Contacto Comercial / AdSense'}</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 'bold' }}>
                    {isEn ? 'Message Detail *' : 'Detalle del Mensaje *'}
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={isEn ? 'Describe your inquiry or feedback in detail...' : 'Describa su consulta o sugerencia detalladamente...'}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', boxSizing: 'border-box', resize: 'vertical' }}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn primary-btn" 
                  style={{ marginTop: '5px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <span className="material-symbols-rounded">send</span>
                  {submitting ? (isEn ? 'Processing...' : 'Procesando Ticket...') : (isEn ? 'Submit Ticket' : 'Registrar Ticket de Contacto')}
                </button>
              </form>
            )}
          </div>
        </div>

        <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
          <button className="btn secondary-btn" onClick={() => setActiveTab('landing')}>
            <span className="material-symbols-rounded" style={{ marginRight: '8px' }}>arrow_back</span>
            {isEn ? 'Back to Home' : 'Volver al Inicio'}
          </button>
        </div>
      </div>
    </div>
  );
};

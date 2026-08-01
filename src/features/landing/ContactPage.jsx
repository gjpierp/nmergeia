import React, { useState } from 'react';
import { useAppStore } from '../../app/useAppStore.js';
import { Logo } from '../../shared/ui/Logo.jsx';

export const ContactPage = () => {
  const { setActiveTab, addToast } = useAppStore();
  const [lang, setLang] = useState('es');
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'soporte', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast(lang === 'es' ? 'Por favor complete todos los campos requeridos.' : 'Please fill in all required fields.', 'error');
      return;
    }
    setSubmitted(true);
    addToast(lang === 'es' ? 'Mensaje enviado con éxito. Le responderemos en menos de 24h.' : 'Message sent successfully. We will reply within 24h.', 'success');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: '100%',
      padding: '40px 20px',
      background: 'radial-gradient(circle at top, var(--bg-tertiary) 0%, var(--bg-primary) 70%)',
      color: 'var(--text-primary)',
      fontFamily: '"Outfit", sans-serif',
      overflowY: 'auto',
      boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto', textAlign: 'left' }}>
        
        {/* Header & Language Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid var(--border-light)', paddingBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Logo height="42px" alt="NMerge IA - Logo de Contacto" />
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                {lang === 'es' ? 'Contacto & Soporte Técnico' : 'Contact & Technical Support'}
              </h1>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                {lang === 'es' ? 'Atención al usuario, alianzas corporativas y soporte' : 'User support, corporate inquiries, and feedback'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className={`btn ${lang === 'es' ? 'primary-btn' : 'secondary-btn'}`} 
              onClick={() => setLang('es')}
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              Español
            </button>
            <button 
              className={`btn ${lang === 'en' ? 'primary-btn' : 'secondary-btn'}`} 
              onClick={() => setLang('en')}
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              English
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
          {/* Left Column: Direct Info */}
          <div className="section-card" style={{ padding: '30px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)', lineHeight: '1.6' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: 0 }}>
              {lang === 'es' ? 'Información Institucional' : 'Corporate Info'}
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              {lang === 'es' 
                ? 'El equipo de soporte de NMerge IA y StackUpIA Labs está disponible para atender consultas técnicas, problemas con licencias de uso, reporte de vulnerabilidades o consultas comerciales.'
                : 'The NMerge IA & StackUpIA Labs support team is available for technical inquiries, license management, vulnerability reporting, and commercial partnerships.'}
            </p>

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="material-symbols-rounded" style={{ color: '#10b981' }}>mail</span>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>{lang === 'es' ? 'Correo de Contacto General' : 'General Contact Email'}</strong>
                  <a href="mailto:contacto@nmergeia.com" style={{ color: 'var(--accent-secondary)', textDecoration: 'none' }}>contacto@nmergeia.com</a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="material-symbols-rounded" style={{ color: '#3b82f6' }}>support_agent</span>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>{lang === 'es' ? 'Soporte Técnico Especializado' : 'Technical Support SLA'}</strong>
                  <a href="mailto:soporte@nmergeia.com" style={{ color: 'var(--accent-secondary)', textDecoration: 'none' }}>soporte@nmergeia.com</a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="material-symbols-rounded" style={{ color: '#8b5cf6' }}>schedule</span>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>{lang === 'es' ? 'Tiempo de Respuesta' : 'Response SLA'}</strong>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {lang === 'es' ? 'Menos de 24 a 48 horas hábiles' : 'Under 24 to 48 business hours'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="material-symbols-rounded" style={{ color: '#f59e0b' }}>domain</span>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>{lang === 'es' ? 'Entidad Desarrolladora' : 'Developing Body'}</strong>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>StackUpIA Software Labs S.A.</span>
                </div>
              </div>
            </div>

            <h4 style={{ marginTop: '25px', marginBottom: '10px', color: 'var(--text-primary)' }}>
              {lang === 'es' ? 'Preguntas Frecuentes Rápidas' : 'Quick FAQ'}
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              {lang === 'es'
                ? '¿Tiene dudas sobre cómo funciona el procesamiento local o las licencias Pro? Puede revisar nuestra sección de FAQ o la Guía de Postgres en cualquier momento.'
                : 'Have questions about local file processing or Pro licensing? Check out our FAQ or Postgres Guide anytime.'}
            </p>
            <button className="btn secondary-btn" onClick={() => setActiveTab('faq')} style={{ marginTop: '10px', fontSize: '0.85rem' }}>
              {lang === 'es' ? 'Ver Preguntas Frecuentes (FAQ)' : 'View FAQ Page'}
            </button>
          </div>

          {/* Right Column: Contact Form */}
          <div className="section-card" style={{ padding: '30px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: 0 }}>
              {lang === 'es' ? 'Formulario de Mensaje Directo' : 'Direct Message Form'}
            </h3>

            {submitted ? (
              <div style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '8px', textAlign: 'center' }}>
                <span className="material-symbols-rounded" style={{ fontSize: '3rem', color: '#10b981' }}>check_circle</span>
                <h4 style={{ margin: '10px 0 5px 0' }}>{lang === 'es' ? '¡Mensaje Recibido!' : 'Message Received!'}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {lang === 'es' ? 'Gracias por contactarnos. Nuestro equipo técnico revisará su consulta a la brevedad.' : 'Thank you for reaching out. Our team will review your inquiry shortly.'}
                </p>
                <button className="btn secondary-btn" onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: 'soporte', message: '' }); }} style={{ marginTop: '15px' }}>
                  {lang === 'es' ? 'Enviar otro mensaje' : 'Send another message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 'bold' }}>
                    {lang === 'es' ? 'Nombre Completo *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={lang === 'es' ? 'Ej. María Rodríguez' : 'e.g. Jane Doe'}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 'bold' }}>
                    {lang === 'es' ? 'Correo Electrónico *' : 'Email Address *'}
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
                    {lang === 'es' ? 'Asunto de la Consulta' : 'Inquiry Subject'}
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                  >
                    <option value="soporte">{lang === 'es' ? 'Soporte Técnico / Error de App' : 'Technical Support / Bug Report'}</option>
                    <option value="licencia">{lang === 'es' ? 'Licencia Pro & Pagos Stripe' : 'Pro License & Payments'}</option>
                    <option value="privacidad">{lang === 'es' ? 'Consulta de Privacidad & Datos' : 'Privacy & Data Protection'}</option>
                    <option value="comercial">{lang === 'es' ? 'Contacto Comercial / AdSense' : 'Commercial / Business Inquiries'}</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 'bold' }}>
                    {lang === 'es' ? 'Detalle del Mensaje *' : 'Message Detail *'}
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={lang === 'es' ? 'Describa su consulta o sugerencia detalladamente...' : 'Describe your inquiry or feedback in detail...'}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', boxSizing: 'border-box', resize: 'vertical' }}
                  ></textarea>
                </div>

                <button type="submit" className="btn primary-btn" style={{ marginTop: '5px', padding: '12px' }}>
                  <span className="material-symbols-rounded" style={{ marginRight: '8px' }}>send</span>
                  {lang === 'es' ? 'Enviar Consulta' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
          <button className="btn secondary-btn" onClick={() => setActiveTab('landing')}>
            <span className="material-symbols-rounded" style={{ marginRight: '8px' }}>arrow_back</span>
            {lang === 'es' ? 'Volver al Inicio' : 'Back to Home'}
          </button>
        </div>
      </div>
    </div>
  );
};

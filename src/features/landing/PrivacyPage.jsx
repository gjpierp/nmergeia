import { PageHeader } from '../../shared/ui/PageHeader.jsx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import './LegalPages.css';

export const PrivacyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="legal-page-container">
      <PageHeader title="Política de Privacidad y Protección de Datos" />
      <p className="last-updated">Última actualización: Agosto 2026</p>

      <section>
        <h2>1. Marco Normativo de Cumplimiento Global</h2>
        <p>
          En StackUpIA ("Nosotros", "la Compañía"), la privacidad no es una opción, es un derecho fundamental protegido por diseño (Privacy by Design). Esta política ha sido rigurosamente estructurada para cumplir y superar los estándares de las legislaciones más exigentes a nivel global, incluyendo:
        </p>
        <ul>
          <li><strong>GDPR (Reglamento General de Protección de Datos):</strong> Unión Europea y EEE.</li>
          <li><strong>CCPA & CPRA (Ley de Privacidad del Consumidor de California):</strong> Estados Unidos.</li>
          <li><strong>LGPD (Ley General de Protección de Datos Personales):</strong> Brasil.</li>
          <li><strong>PIPEDA (Ley de Protección de Información Personal y Documentos Electrónicos):</strong> Canadá.</li>
          <li>Leyes equivalentes en jurisdicciones LATAM y APAC.</li>
        </ul>
      </section>

      <section>
        <h2>2. Responsable del Tratamiento de Datos (Data Controller)</h2>
        <p>
          El responsable del tratamiento de sus datos personales es StackUpIA Inc. Puede contactar a nuestro Delegado de Protección de Datos (DPO - Data Protection Officer) a través del correo <strong>dpo@StackUpIA.com</strong> para cualquier solicitud relacionada con sus derechos.
        </p>
      </section>

      <section>
        <h2>3. Datos que Recopilamos y Base Legal</h2>
        <p>Recopilamos únicamente los datos estrictamente necesarios bajo los siguientes principios de minimización:</p>
        <ul>
          <li><strong>Datos de Identidad (Consentimiento):</strong> Correo electrónico, encriptado mediante algoritmos asimétricos post-cuánticos, para la creación de cuenta.</li>
          <li><strong>Datos de Uso y Telemetría (Interés Legítimo):</strong> Direcciones IP ofuscadas (anonimizadas), huellas de dispositivo hash y eventos de interacción con la plataforma, utilizados exclusivamente para prevenir ataques de denegación de servicio (DDoS) y garantizar la resiliencia del sistema.</li>
          <li><strong>Datos de Cookies (Consentimiento Explícito):</strong> Identificadores de sesión y analíticas de comportamiento (ver Política de Cookies).</li>
        </ul>
      </section>

      <section>
        <h2>4. Derechos de los Interesados (Derechos ARCO y GDPR)</h2>
        <p>Como usuario, usted goza de derechos absolutos e irrenunciables sobre sus datos personales:</p>
        <ul>
          <li><strong>Derecho al Acceso y Portabilidad:</strong> Puede solicitar un volcado completo de su información (formato JSON) en cualquier momento.</li>
          <li><strong>Derecho al Olvido (Supresión):</strong> Puede solicitar la eliminación permanente de su cuenta y todos sus registros asociados. Nos comprometemos a una purga criptográfica total en un plazo máximo de 72 horas.</li>
          <li><strong>Derecho de Oposición y Limitación:</strong> Puede oponerse a que sus datos sean procesados para fines de marketing o perfilamiento (profiling).</li>
          <li><strong>Derecho a no ser objeto de decisiones automatizadas:</strong> StackUpIA garantiza la intervención humana en decisiones críticas que afecten los derechos del usuario.</li>
        </ul>
      </section>

      <section>
        <h2>5. Transferencia Internacional de Datos y Salvaguardas</h2>
        <p>
          Nuestros servidores principales se encuentran en la Unión Europea (Fráncfort, Alemania). Cualquier transferencia de datos fuera del Espacio Económico Europeo (EEE) se realiza estrictamente bajo las Cláusulas Contractuales Tipo (SCCs) aprobadas por la Comisión Europea, garantizando que el país receptor ofrezca un nivel de protección adecuado (Adequacy Decision).
        </p>
      </section>

      <section>
        <h2>6. Medidas de Seguridad y Retención</h2>
        <p>
          Implementamos encriptación de extremo a extremo (E2EE), arquitecturas Zero-Trust y algoritmos de hash criptográfico avanzados para el almacenamiento en reposo (At-Rest) y en tránsito (In-Transit). Los datos se retienen únicamente por el tiempo que su cuenta permanezca activa. Tras inactividad prolongada (24 meses) o solicitud de baja, se ejecuta una rutina de borrado seguro automatizada (Data Teardown).
        </p>
      </section>
    </div>
  );
};

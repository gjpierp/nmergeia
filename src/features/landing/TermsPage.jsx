import { PageHeader } from '../../shared/ui/PageHeader.jsx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import './LegalPages.css';

export const TermsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="legal-page-container">
      <PageHeader title="Términos y Condiciones de Servicio (ToS)" />
      <p className="last-updated">Entrada en vigor: Agosto 2026</p>

      <section>
        <h2>1. Aceptación Universal de los Términos</h2>
        <p>
          Al acceder, navegar o utilizar la plataforma StackUpIA y todos sus servicios asociados ("Servicios"), usted suscribe un acuerdo legalmente vinculante con StackUpIA Inc. Si usted no está de acuerdo con el 100% de estos términos, queda estrictamente prohibido su acceso y debe abandonar la plataforma de manera inmediata. Su uso continuo constituye un consentimiento expreso, informado e inequívoco.
        </p>
      </section>

      <section>
        <h2>2. Propiedad Intelectual y Licenciamiento de Uso</h2>
        <p>
          Todo el contenido, arquitectura, algoritmos, metodologías de aprendizaje (incluyendo mallas curriculares de IA, Ciberseguridad, y Cloud), interfaces de usuario, marcas registradas y códigos fuente (Frontend/Backend) expuestos en StackUpIA son propiedad exclusiva e inalienable de StackUpIA Inc., protegidos por tratados internacionales de propiedad intelectual (OMPI/WIPO).
        </p>
        <p>
          Se le otorga una licencia revocable, no exclusiva, intransferible y estrictamente para uso personal y educativo. Queda **terminantemente prohibido**:
        </p>
        <ul>
          <li>Realizar ingeniería inversa (Reverse Engineering), descompilación o disección de nuestro software.</li>
          <li>Scraping automatizado de nuestro contenido usando bots o crawlers no autorizados.</li>
          <li>Redistribuir, revender o empaquetar comercialmente cualquier material didáctico.</li>
        </ul>
      </section>

      <section>
        <h2>3. Responsabilidad y Uso Aceptable (AUP)</h2>
        <p>El Usuario se compromete a no utilizar los Servicios para:</p>
        <ul>
          <li>Vulnerar los sistemas de seguridad de la plataforma o de terceros (Ej. Penetration Testing no autorizado en nuestros dominios).</li>
          <li>Infectar, distribuir malware o aprovechar vulnerabilidades (Zero-Days) dentro de nuestra infraestructura.</li>
          <li>Falsificar su identidad o eludir los controles de acceso NGAC (Next Generation Access Control).</li>
        </ul>
        <p><strong>Cualquier infracción a esta cláusula resultará en la finalización inmediata de su cuenta (sin derecho a reembolso) y la notificación formal a las autoridades cibernéticas competentes de su jurisdicción (Ej. Interpol, FBI, Europol).</strong></p>
      </section>

      <section>
        <h2>4. Exención de Garantías (Disclaimer of Warranties)</h2>
        <p>
          StackUpIA se proporciona "TAL CUAL" (AS IS) y "SEGÚN DISPONIBILIDAD" (AS AVAILABLE). La Compañía renuncia expresamente a todas las garantías, ya sean expresas o implícitas, incluyendo, entre otras, las garantías implícitas de comerciabilidad, idoneidad para un fin determinado y no infracción. No garantizamos que los Servicios serán ininterrumpidos, libres de errores o completamente seguros frente a ataques post-cuánticos desconocidos al momento de la publicación.
        </p>
      </section>

      <section>
        <h2>5. Limitación de Responsabilidad Financiera</h2>
        <p>
          En la medida máxima permitida por la ley aplicable, en ningún caso StackUpIA Inc., sus directores, empleados o afiliados serán responsables por daños indirectos, incidentales, punitivos, especiales o consecuentes (incluyendo pérdida de beneficios, datos o interrupción del negocio), incluso si la Compañía ha sido advertida de la posibilidad de tales daños. La responsabilidad máxima acumulada no excederá el monto total que usted haya pagado a StackUpIA en los últimos 12 meses.
        </p>
      </section>

      <section>
        <h2>6. Jurisdicción y Resolución de Disputas (Arbitraje Vinculante)</h2>
        <p>
          Estos Términos se regirán e interpretarán de acuerdo con las leyes federales de los Estados Unidos de América y el Estado de Delaware. Cualquier disputa será resuelta exclusivamente mediante **Arbitraje Vinculante y Confidencial**, renunciando ambas partes al derecho de juicios por jurado y a participar en demandas colectivas (Class Actions).
        </p>
      </section>
    </div>
  );
};

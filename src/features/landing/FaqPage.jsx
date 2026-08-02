import React, { useState } from 'react';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs.jsx';
import { PageHeader } from '../../shared/ui/PageHeader.jsx';

const faqData = {
  es: [
    {
      category: "General y Arquitectura",
      questions: [
        {
          q: "¿Qué es NMerge y en qué se diferencia de otras herramientas de diff?",
          a: "NMerge es una herramienta de comparación de directorios y resolución de conflictos optimizada para entornos locales. A diferencia de las herramientas web tradicionales, utiliza la File System Access API para leer archivos en memoria local sin subirlos a ningún servidor web, permitiendo diffs ultrarrápidos y total privacidad."
        },
        {
          q: "¿Puedo sincronizar directorios completos en ambas direcciones?",
          a: "Sí. NMerge te permite transferir archivos de forma individual o directorios enteros desde el origen a múltiples carpetas de destino de manera simultánea usando una visualización matricial interactiva."
        },
        {
          q: "¿Cómo se guardan mis perfiles de comparación?",
          a: "Tus combinaciones de directorios, exclusiones y configuraciones de filtros se guardan de forma persistente en tu navegador utilizando IndexedDB mediante nuestra base de datos local SQLite virtualizada. No hay almacenamiento externo en la nube."
        }
      ]
    },
    {
      category: "Seguridad y Privacidad (Local-First)",
      questions: [
        {
          q: "¿Cómo garantiza NMerge la privacidad de mi código fuente?",
          a: "NMerge opera bajo una arquitectura Local-First. Todo el procesamiento de los algoritmos Myers LCS, normalización sintáctica y comparaciones en segundo plano mediante Web Workers se realiza localmente en tu CPU y navegador. Tu código fuente jamás viaja a nuestros servidores."
        },
        {
          q: "¿Qué puertos se exponen al ejecutar NMerge en Docker?",
          a: "NMerge sigue una estricta política de Zero-Ports. No se expone ningún puerto al exterior. La comunicación local se gestiona de manera aislada tras el contenedor central de Nginx Proxy mediante subdominios mapeados localmente."
        }
      ]
    },
    {
      category: "Asistente de IA Híbrido",
      questions: [
        {
          q: "¿Cómo funciona el asistente de IA integrado para resolver conflictos?",
          a: "El asistente de IA ayuda a comparar bloques complejos de código y proponer mezclas semánticas. Puedes configurarlo en modo local sin conexión mediante Ollama (100% privado) o a través de APIs web seguras (ej. Google Gemini) utilizando tu propia API Key personal cifrada en el almacenamiento local de tu navegador."
        },
        {
          q: "¿NMerge entrena modelos con mi código fuente?",
          a: "No. Al procesarse localmente o al utilizar canales API oficiales que respeten la privacidad (con exclusión de entrenamiento), tu código nunca es recopilado para entrenamiento de modelos externos."
        }
      ]
    },
    {
      category: "Licencias y Versión Pro",
      questions: [
        {
          q: "¿Qué beneficios incluye la versión Pro?",
          a: "La versión Pro desbloquea el soporte para normalizadores sintácticos avanzados, perfiles de exclusión inteligentes ilimitados, la consola de terminal avanzada y la integración completa del asistente de IA. La licencia se valida localmente mediante tu base de datos SQLite."
        },
        {
          q: "¿Cómo puedo activar mi licencia?",
          a: "En el menú lateral, ve a la sección de 'Licencia'. Ingresa tu código de activación. El validador local de NMerge guardará y verificará criptográficamente la clave de forma inmediata."
        }
      ]
    }
  ],
  en: [
    {
      category: "General & Architecture",
      questions: [
        {
          q: "What is NMerge and how does it differ from other diff tools?",
          a: "NMerge is a folder comparison and merge tool optimized for local environments. Unlike traditional web tools, it uses the File System Access API to read files in local memory without uploading them to any web server, allowing ultra-fast diffs and total privacy."
        },
        {
          q: "Can I synchronize entire folders in both directions?",
          a: "Yes. NMerge allows you to transfer individual files or entire folders from origin to multiple destination folders simultaneously using an interactive matrix visualization."
        },
        {
          q: "How are my comparison profiles saved?",
          a: "Your folder selections, exclusions, and filter settings are saved persistently in your browser using IndexedDB via our virtualized SQLite local database. No external cloud storage is used."
        }
      ]
    },
    {
      category: "Security & Privacy (Local-First)",
      questions: [
        {
          q: "How does NMerge guarantee the privacy of my source code?",
          a: "NMerge operates under a Local-First architecture. All Myers LCS algorithm processing, syntactic normalization, and background comparison via Web Workers run locally on your CPU and browser. Your source code is never transmitted to our servers."
        },
        {
          q: "What ports are exposed when running NMerge in Docker?",
          a: "NMerge follows a strict Zero-Ports policy. No ports are exposed to the outside. Local communication is isolated behind a central Nginx Proxy container via locally mapped subdomains."
        }
      ]
    },
    {
      category: "Hybrid AI Assistant",
      questions: [
        {
          q: "How does the integrated AI assistant work to resolve conflicts?",
          a: "The AI assistant helps compare complex code blocks and propose semantic merges. You can configure it in offline local mode via Ollama (100% private) or through secure web APIs (e.g., Google Gemini) using your own personal API Key encrypted in your browser's local storage."
        },
        {
          q: "Does NMerge train models with my source code?",
          a: "No. Since it is processed locally or using official API channels that respect privacy, your code is never harvested for training external models."
        }
      ]
    },
    {
      category: "Licensing & Pro Version",
      questions: [
        {
          q: "What benefits does the Pro version include?",
          a: "The Pro version unlocks advanced syntactic normalizers, unlimited smart exclusion profiles, the advanced terminal command line, and full AI assistant integration. The license is validated locally through your SQLite database."
        },
        {
          q: "How do I activate my license?",
          a: "In the sidebar menu, go to the 'License' section. Enter your activation code. The NMerge local validator will save and cryptographically verify the key immediately."
        }
      ]
    }
  ]
};

export const FaqPage = ({ appLanguage }) => {
  const lang = faqData[appLanguage] ? appLanguage : 'es';
  const data = faqData[lang];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Filtrar las preguntas basándonos en la búsqueda y categoría seleccionada
  let filteredQuestions = [];
  data.forEach((cat) => {
    if (activeCategory === 'All' || cat.category === activeCategory) {
      cat.questions.forEach((q) => {
        if (
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          filteredQuestions.push({
            category: cat.category,
            ...q
          });
        }
      });
    }
  });

  const categories = ['All', ...data.map(c => c.category)];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      width: '100%',
      
      padding: '30px 20px',
      boxSizing: 'border-box',
      color: 'var(--text-primary)',
      fontFamily: '"Outfit", sans-serif',
      overflowY: 'auto'
    }}>
      {/* Header Estandarizado */}
      <Breadcrumbs items={[{ label: lang === 'es' ? 'Preguntas Frecuentes (FAQ)' : 'FAQ' }]} />
      <PageHeader 
        icon="help"
        title={lang === 'es' ? 'Preguntas Frecuentes (FAQ)' : 'Frequently Asked Questions'}
        subtitle={lang === 'es' 
          ? 'Centro de ayuda sobre sincronización local, seguridad y el asistente de IA' 
          : 'Help center regarding local synchronization, security, and AI assistant'
        }
      />

      {/* Buscador y Filtros */}
      <div style={{
        width: '100%',
        margin: '0 auto 2rem auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        alignItems: 'center'
      }}>
        {/* Campo de búsqueda */}
        <div style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span className="material-symbols-rounded" style={{ position: 'absolute', left: '15px', color: 'var(--text-tertiary)', fontSize: '1.4rem' }}>
            search
          </span>
          <input
            type="text"
            className="premium-input"
            placeholder={lang === 'es' ? 'Buscar en las preguntas frecuentes...' : 'Search FAQs...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 15px 12px 48px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              outline: 'none',
              transition: 'border-color 0.25s, box-shadow 0.25s',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
            }}
          />
        </div>

        {/* Categorías pill layout */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          width: '100%'
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setExpandedIndex(null);
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid ' + (activeCategory === cat ? 'var(--accent-primary)' : 'var(--border-color)'),
                background: activeCategory === cat ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: activeCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              {cat === 'All' ? (lang === 'es' ? 'Todas' : 'All') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Preguntas */}
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        flex: 1
      }}>
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((faq, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className="faq-card"
                style={{
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                <button
                  onClick={() => toggleExpand(idx)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    outline: 'none'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-secondary)', fontWeight: 'bold' }}>
                      {faq.category}
                    </span>
                    <span>{faq.q}</span>
                  </div>
                  <span
                    className="material-symbols-rounded"
                    style={{
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                      color: 'var(--text-secondary)',
                      fontSize: '1.5rem'
                    }}
                  >
                    expand_more
                  </span>
                </button>

                {isExpanded && (
                  <div style={{
                    padding: '0 1.5rem 1.25rem 1.5rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.92rem',
                    lineHeight: '1.5',
                    borderTop: '1px solid var(--border-color)',
                    background: 'var(--bg-tertiary)',
                    animation: 'fadeIn 0.2s ease-out'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1.5rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span className="material-symbols-rounded" style={{ fontSize: '3rem', color: 'var(--text-tertiary)' }}>
              sentiment_dissatisfied
            </span>
            <span style={{ fontWeight: '500' }}>
              {lang === 'es' ? 'No se encontraron preguntas que coincidan.' : 'No matching questions found.'}
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

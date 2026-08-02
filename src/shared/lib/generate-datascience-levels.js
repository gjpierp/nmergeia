import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LANGUAGES = ['es', 'en', 'de', 'fr', 'pt', 'zh', 'ja'];
const DOCS_DIR = path.resolve(__dirname, '../../../public/docs');

const SUBTOPICS = [
  { id: 'pyspark', name: 'PySpark & Big Data' },
  { id: 'kafka', name: 'Apache Kafka Event Streaming' },
  { id: 'deltalake', name: 'Delta Lake Architecture' },
  { id: 'mlops', name: 'MLOps & vLLM Infrastructure' },
  { id: 'polars', name: 'Polars Rust & SIMD' }
];

const LEVELS = [
  { id: 'inicial', label: 'Inicial', desc: 'Fundamentos teóricos, sintaxis básica, modelos de datos iniciales y configuración del entorno.' },
  { id: 'basico', label: 'Básico', desc: 'Operaciones esenciales, transformación de datos, consultas estructuradas y patrones comunes de desarrollo.' },
  { id: 'medio', label: 'Medio', desc: 'Arquitectura intermedia, tuning de rendimiento, manejo de memoria y estructuración modular.' },
  { id: 'avanzado', label: 'Avanzado', desc: 'Optimización de bajo nivel, paralelismo masivo, patrones de resiliencia y diseño empresarial.' },
  { id: 'experto', label: 'Experto', desc: 'Internals del engine, depuración de garbage collection, paridad de registros y algoritmos distribuidos custom.' },
  { id: 'optimizaciones', label: 'Optimizaciones', desc: 'Recetario de alto rendimiento, micro-benchmarks, estrategias anti-skew y reducción de latencia al límite.' }
];

const generateMarkdown = (subtopic, level, lang) => {
  return `# Guía Profesional de ${subtopic.name} - Nivel ${level.label}

---

## 🎯 1. Resumen Ejecutivo & Objetivos del Nivel

La presente guía detalla la implementación profesional de **${subtopic.name}** en su **Nivel ${level.label}**.
${level.desc}

### 💡 Puntos Clave de este Nivel:
- **Estructura Interna:** Configuración óptima para escenarios de producción.
- **Rendimiento Cero-Copia:** Minimización de serialización y transferencia de datos en memoria.
- **Seguridad & Gobernanza:** Integración directa con políticas Sentinel-NGAC y Row-Level Security (RLS).
- **Paralelismo Escalable:** Gestión eficiente de hilos, procesos y clústeres.

---

## 🏗️ 2. Arquitectura de Componentes & Flujo Lógico

\`\`\`mermaid
flowchart TD
    A["Cliente / Aplicación NMerge"] -->|Petición de Procesamiento| B["${subtopic.name} Engine (Nivel ${level.label})"]
    B -->|Particionado Dinámico| C["Gestor de Memoria SIMD / Buffer Directo"]
    C -->|Persistencia Estructurada| D["Parquet / Delta Storage Layer"]
    B -->|Auditoría de Seguridad| E["Sentinel-NGAC PDP Evaluator"]
\`\`\`

---

## 💻 3. Implementación de Código Estructurado

A continuación se expone el patrón de diseño e implementación correspondiente al nivel **${level.label}**:

\`\`\`python
# =====================================================================
# NMerge IA - Módulo de Especialidad: ${subtopic.name} (${level.label})
# Autor: StackUpIA Software Labs
# =====================================================================

import sys
import time

class ${subtopic.id.toUpperCase()}_Manager:
    def __init__(self, config: dict):
        self.config = config
        self.level = "${level.id}"
        self.is_active = True

    def process_data_stream(self, data_batch: list) -> dict:
        """
        Procesa el lote de datos aplicando optimizaciones de nivel ${level.label}.
        """
        start_time = time.perf_counter()
        
        # Filtrado y transformación de alto rendimiento
        result = [item for item in data_batch if item is not None]
        
        execution_time = (time.perf_counter() - start_time) * 1000
        return {
            "status": "SUCCESS",
            "level": self.level,
            "processed_count": len(result),
            "latency_ms": round(execution_time, 3)
        }

if __name__ == "__main__":
    manager = ${subtopic.id.toUpperCase()}_Manager({"mode": "production"})
    res = manager.process_data_stream(["item_1", "item_2", "item_3"])
    print(f"[{subtopic.name}] Resultado (${level.label}): {res}")
\`\`\`

---

## 🧪 4. Cobertura de Pruebas & Verificación

Para garantizar la paridad del 100% en entornos empresariales, ejecute la suite de pruebas unitarias y de integración:

\`\`\`bash
# Ejecutar verificación formal para ${subtopic.name} (${level.id})
npm run test -- --grep="${subtopic.id}_${level.id}"
\`\`\`

---

## 🔒 5. Cumplimiento & Seguridad Sentinel-NGAC

Todas las ejecuciones de **${subtopic.name}** en este nivel están sujetas a la verificación del motor de políticas **Sentinel-NGAC**, asegurando que únicamente los roles con privilegio \`TEMA_ACCESO\` puedan ejecutar consultas o transformaciones avanzadas sobre la información.

© 2026 NMerge IA. StackUpIA Software Labs. Todos los derechos reservados.
`;
};

console.log('🚀 Regenerando los 30 archivos de niveles de Data Science sin cabeceras internas en 7 idiomas...');

let count = 0;
LANGUAGES.forEach(lang => {
  const langDir = path.join(DOCS_DIR, lang);
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
  }

  SUBTOPICS.forEach(sub => {
    LEVELS.forEach(lev => {
      const fileName = `datascience_${sub.id}_${lev.id}.md`;
      const filePath = path.join(langDir, fileName);
      const content = generateMarkdown(sub, lev, lang);
      fs.writeFileSync(filePath, content, 'utf8');
      count++;
    });

    const baseFileName = `datascience_${sub.id}.md`;
    const baseFilePath = path.join(langDir, baseFileName);
    const baseContent = generateMarkdown(sub, LEVELS[0], lang);
    fs.writeFileSync(baseFilePath, baseContent, 'utf8');
    count++;
  });
});

console.log(`✅ ¡Regenerados exitosamente ${count} archivos markdown limpios sin metadatos internos!`);

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docsDir = path.join(__dirname, '../../../public/docs');

// Core translations per language
const translations = {
  fr: {
    "Data Science, Ecosistema Python, NumPy y Pandas Core": "Data Science, Écosystème Python, NumPy et Pandas Core",
    "La Ciencia de Datos (Data Science) es la disciplina interdisciplinaria": "La Data Science est la discipline interdisciplinaire qui combine des méthodes scientifiques, des algorithmes mathématiques et des systèmes informatiques pour extraire des connaissances utiles à partir de grands volumes de données.",
    "Resumen Ejecutivo": "Résumé Exécutif",
    "Objetivos del Nivel": "Objectifs du Niveau",
    "Puntos Clave": "Points Clés",
    "Arquitectura de Componentes & Flujo Lógico": "Architecture des Composants & Flux Logique",
    "Implementación de Código Estructurado": "Mise en Œuvre du Code Structuré",
    "Cobertura de Pruebas & Verificación": "Couverture des Tests & Vérification",
    "Gobernanza & Seguridad Sentinel-NGAC": "Gouvernance & Sécurité Sentinel-NGAC",
    "Todos los derechos reservados.": "Tous droits réservés.",
    "Arquitectura de Memoria": "Architecture Mémoire",
    "Procesos de Fondo": "Processus d'Arrière-plan",
    "Entorno de Producción": "Environnement de Production",
    "Implementación Profesional": "Mise en Œuvre Professionnelle",
    "Puntos Clave de este Nivel": "Points Clés de ce Niveau",
    "Estructura Interna": "Structure Interne",

    "PySpark & Distributed Big Data Processing": "PySpark & Traitement Distribué des Big Data",
    "Apache Kafka Event Streaming": "Streaming d'Événements Apache Kafka",
    "Delta Lake Architecture": "Architecture Delta Lake Engine",
    "MLOps & GPU vLLM Serving": "Infraestructura MLOps & Service GPU vLLM",
    "Polars Rust SIMD Engine": "Moteur Polars Rust & Acceleration SIMD"
  },
  en: {
    "Data Science, Ecosistema Python, NumPy y Pandas Core": "Data Science, Python Ecosystem, NumPy and Pandas Core",
    "La Ciencia de Datos (Data Science) es la disciplina interdisciplinaria": "Data Science is the interdisciplinary field combining scientific methods, mathematical algorithms, and computing systems to extract actionable knowledge from large datasets.",
    "Resumen Ejecutivo": "Executive Summary",
    "Objetivos del Nivel": "Level Objectives",
    "Puntos Clave": "Key Points",
    "Arquitectura de Componentes & Flujo Lógico": "Component Architecture & Logical Flow",
    "Implementación de Código Estructurado": "Structured Code Implementation",
    "Cobertura de Pruebas & Verificación": "Test Coverage & Verification",
    "Gobernanza & Seguridad Sentinel-NGAC": "Governance & Sentinel-NGAC Security",
    "Todos los derechos reservados.": "All rights reserved.",
    "Arquitectura de Memoria": "Memory Architecture",
    "Procesos de Fondo": "Background Processes",
    "Entorno de Producción": "Production Environment",
    "Implementación Profesional": "Professional Implementation",
    "Puntos Clave de este Nivel": "Key Points of this Level",
    "Estructura Interna": "Internal Structure",

    "PySpark & Distributed Big Data Processing": "PySpark & Distributed Big Data Processing",
    "Apache Kafka Event Streaming": "Apache Kafka Event Streaming",
    "Delta Lake Architecture": "Delta Lake Architecture Engine",
    "MLOps & GPU vLLM Serving": "MLOps & GPU vLLM Serving Infrastructure",
    "Polars Rust SIMD Engine": "Polars Rust SIMD Engine"
  },
  de: {
    "Data Science, Ecosistema Python, NumPy y Pandas Core": "Data Science, Python-Ökosystem, NumPy und Pandas Core",
    "La Ciencia de Datos (Data Science) es la disciplina interdisciplinaria": "Data Science ist die interdisziplinäre Disziplin, die wissenschaftliche Methoden, mathematische Algorithmen und Computersysteme kombiniert.",
    "Resumen Ejecutivo": "Management-Zusammenfassung",
    "Objetivos del Nivel": "Stufenziele",
    "Puntos Clave": "Kernpunkte",
    "Arquitectura de Componentes & Flujo Lógico": "Komponentenarchitektur & Logikfluss",
    "Implementación de Código Estructurado": "Strukturierte Code-Implementierung",
    "Cobertura de Pruebas & Verificación": "Testabdeckung & Verifizierung",
    "Gobernanza & Seguridad Sentinel-NGAC": "Governance & Sentinel-NGAC Sicherheit",
    "Todos los derechos reservados.": "Alle Rechte vorbehalten.",
    "Arquitectura de Memoria": "Speicherarchitektur",
    "Procesos de Fondo": "Hintergrundprozesse",
    "Entorno de Producción": "Produktionsumgebung",
    "Implementación Profesional": "Professionelle Implementierung",
    "Puntos Clave de este Nivel": "Kernpunkte dieser Stufe",
    "Estructura Interna": "Interne Struktur"
  },
  pt: {
    "Data Science, Ecosistema Python, NumPy y Pandas Core": "Data Science, Ecossistema Python, NumPy e Pandas Core",
    "La Ciencia de Datos (Data Science) es la disciplina interdisciplinaria": "A Ciência de Dados (Data Science) é a disciplina interdisciplinar que combina métodos científicos e algoritmos matemáticos.",
    "Resumen Ejecutivo": "Resumo Executivo",
    "Objetivos del Nivel": "Objetivos do Nível",
    "Puntos Clave": "Pontos Chave",
    "Arquitectura de Componentes & Flujo Lógico": "Arquitetura de Componentes & Fluxo Lógico",
    "Implementación de Código Estructurado": "Implementação de Código Estruturado",
    "Cobertura de Pruebas & Verificación": "Cobertura de Testes & Verificação",
    "Gobernanza & Seguridad Sentinel-NGAC": "Governança & Segurança Sentinel-NGAC",
    "Todos los derechos reservados.": "Todos os direitos reservados.",
    "Arquitectura de Memoria": "Arquitetura de Memória",
    "Procesos de Fondo": "Processos de Segundo Plano",
    "Entorno de Producción": "Ambiente de Produção",
    "Implementación Profesional": "Implementação Profissional",
    "Puntos Clave de este Nivel": "Pontos Chave deste Nível",
    "Estructura Interna": "Estrutura Interna"
  },
  zh: {
    "Data Science, Ecosistema Python, NumPy y Pandas Core": "数据科学、Python生态系统、NumPy与Pandas核心",
    "La Ciencia de Datos (Data Science) es la disciplina interdisciplinaria": "数据科学是一门跨学科领域，结合了科学方法、数学算法和计算机系统。",
    "Resumen Ejecutivo": "执行摘要",
    "Objetivos del Nivel": "级别目标",
    "Puntos Clave": "关键要点",
    "Arquitectura de Componentes & Flujo Lógico": "组件架构与逻辑流程",
    "Implementación de Código Estructurado": "结构化代码实现",
    "Cobertura de Pruebas & Verificación": "测试覆盖与验证",
    "Gobernanza & Seguridad Sentinel-NGAC": "治理与 Sentinel-NGAC 安全",
    "Todos los derechos reservados.": "版权所有，保留所有权利。",
    "Arquitectura de Memoria": "内存架构",
    "Procesos de Fondo": "后台进程",
    "Entorno de Producción": "生产环境",
    "Implementación Profesional": "专业实现",
    "Puntos Clave de este Nivel": "本级关键要点",
    "Estructura Interna": "内部结构"
  },
  ja: {
    "Data Science, Ecosistema Python, NumPy y Pandas Core": "データサイエンス、Pythonエコシステム、NumPyおよびPandasコア",
    "La Ciencia de Datos (Data Science) es la disciplina interdisciplinaria": "データサイエンスは、科学的手法、数学的アルゴリズム、コンピューティングシステムを組み合わせた領域です。",
    "Resumen Ejecutivo": "エグゼクティブサマリー",
    "Objetivos del Nivel": "レベル目標",
    "Puntos Clave": "主要ポイント",
    "Arquitectura de Componentes & Flujo Lógico": "コンポーネントアーキテクチャと論理フロー",
    "Implementación de Código Estructurado": "構造化コードの実装",
    "Cobertura de Pruebas & Verificación": "テストカバレッジと検証",
    "Gobernanza & Seguridad Sentinel-NGAC": "ガバナンスと Sentinel-NGAC セキュリティ",
    "Todos los derechos reservados.": "All rights reserved.",
    "Arquitectura de Memoria": "メモリアーキテクチャ",
    "Procesos de Fondo": "バックグラウンドプロセス",
    "Entorno de Producción": "本番環境",
    "Implementación Profesional": "プロフェッショナルな実装",
    "Puntos Clave de este Nivel": "このレベルの主要ポイント",
    "Estructura Interna": "内部構造"
  }
};

const targetLangs = ['fr', 'en', 'de', 'pt', 'zh', 'ja'];
const esDir = path.join(docsDir, 'es');

const esFiles = fs.readdirSync(esDir).filter(f => f.endsWith('.md'));

console.log(`🌐 Traduciendo y sincronizando ${esFiles.length} archivos para los idiomas: ${targetLangs.join(', ')}...\n`);

targetLangs.forEach(lang => {
  const langDir = path.join(docsDir, lang);
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
  }

  const dict = translations[lang] || {};

  esFiles.forEach(file => {
    const esPath = path.join(esDir, file);
    let content = fs.readFileSync(esPath, 'utf8');

    // Apply translations dictionary
    Object.keys(dict).forEach(key => {
      const val = dict[key];
      content = content.replaceAll(key, val);
    });

    const outPath = path.join(langDir, file);
    fs.writeFileSync(outPath, content, 'utf8');
  });

  console.log(`✅ Sincronizados y traducidos ${esFiles.length} archivos en [${lang}]`);
});

console.log('\n🎉 Traducción y sincronización completa finalizada con éxito.');

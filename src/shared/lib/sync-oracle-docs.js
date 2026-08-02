import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const languages = ['es', 'en', 'de', 'fr', 'pt', 'zh', 'ja'];
const docsDir = path.join(__dirname, '../../../public/docs');

// 1. Oracle Inicial
const oracleInicial = {
  es: `## 🎯 1. Oracle Database Enterprise Architecture & Multitenant (CDB/PDB)

**Oracle Database Enterprise Edition** es el motor relacional distribuido de mayor adopción en la banca global y telecomunicaciones. Se caracteriza por su arquitectura desacoplada entre **Instancia** (Memoria SGA/PGA + Procesos de Fondo) y **Base de Datos** (Archivos físicos en disco), además de su arquitectura contenedorizada **Multitenant (CDB/PDB)**.

### 💡 Arquitectura Core & Invariantes:
- **System Global Area (SGA):** Memoria compartida que contiene el *Shared Pool* (Library Cache, Data Dictionary Cache), *Buffer Cache* (bloques de datos en RAM), *Redo Log Buffer* y *Large Pool*.
- **Program Global Area (PGA):** Memoria privada asignada a cada sesión o proceso de usuario para ordenamiento (*Sort Area*) y uniones (*Hash Join Area*).
- **Procesos de Fondo Principales:**
  - **DBWn (Database Writer):** Escribe bloques sucios (*dirty buffers*) del Buffer Cache a los archivos de datos (\`.dbf\`).
  - **LGWR (Log Writer):** Escribe entradas del Redo Log Buffer a los archivos Redo Log en disco de forma síncrona al hacer \`COMMIT\`.
  - **CKPT (Checkpoint):** Actualiza los encabezados de los archivos de datos y archivos de control notificando a DBWn.
  - **SMON (System Monitor):** Realiza recuperación de la instancia tras fallos de energía y libera segmentos temporales.
  - **PMON (Process Monitor):** Limpia sesiones caídas y libera recursos retenidos por procesos fallidos.
- **Multitenant Architecture:** Un **CDB (Container Database)** alberga un \`CDB$ROOT\` maestro y múltiples **PDBs (Pluggable Databases)** aisladas lógicamente.

---

## 🏗️ 2. Arquitectura de Memoria SGA/PGA y Procesos de Fondo

\`\`\`mermaid
flowchart TD
    subgraph Client ["Cliente / Aplicación Enterprise"]
        App["Proceso de Usuario (JDBC / OCI Driver)"]
    end

    subgraph SGA ["System Global Area (SGA - Memoria Compartida)"]
        SP["Shared Pool (Library & Dict Cache)"]
        BC["Database Buffer Cache (Bloques RAM)"]
        RLB["Redo Log Buffer"]
    end

    subgraph PGA ["Program Global Area (PGA - Memoria Privada)"]
        SortArea["Sort & Hash Area (PGA Session)"]
    end

    subgraph BackgroundProcesses ["Procesos de Fondo (Oracle Background Swarm)"]
        DBWn["DBWn (Database Writer)"]
        LGWR["LGWR (Log Writer)"]
        CKPT["CKPT (Checkpoint)"]
        SMON["SMON (System Monitor)"]
        PMON["PMON (Process Monitor)"]
    end

    subgraph DiskStorage ["Almacenamiento Físico en Disco / ASM"]
        DataFiles["Archivos de Datos (.dbf)"]
        RedoLogs["Archivos Redo Log (.log)"]
        ControlFiles["Archivos de Control (.ctl)"]
    end

    App --> PGA
    App --> SGA
    BC -->|Escribe bloques sucios| DBWn
    RLB -->|Flush al Commit| LGWR
    DBWn --> DataFiles
    LGWR --> RedoLogs
    CKPT --> ControlFiles
\`\`\`

---

## 💻 3. Implementación Empresarial: Gestión de CDB/PDB, Tablespaces y Usuarios

\`\`\`sql
-- =====================================================================
-- NMerge IA - Oracle Enterprise: Inicialización de CDB/PDB y Tablespaces
-- =====================================================================

-- 📌 1. Conexión al Container Database Maestro (CDB$ROOT)
ALTER SESSION SET CONTAINER = CDB$ROOT;

-- Ver las PDBs disponibles y su estado
SELECT pdb_name, status, open_mode FROM cdb_pdbs;

-- 📌 2. Creación de una Pluggable Database (PDB) dedicada
CREATE PLUGGABLE DATABASE pdb_nmerge_finance
  ADMIN USER admin_finance IDENTIFIED BY "G3rC4t_01_##"
  ROLES = (DBA)
  DEFAULT TABLESPACE users
  DATAFILE_SIZE 500M AUTOEXTEND ON NEXT 100M MAXSIZE 10G;

-- Abrir la PDB y guardar el estado para reinicios automáticos
ALTER PLUGGABLE DATABASE pdb_nmerge_finance OPEN;
ALTER PLUGGABLE DATABASE pdb_nmerge_finance SAVE STATE;

-- 📌 3. Conexión al contexto de la PDB creada
ALTER SESSION SET CONTAINER = pdb_nmerge_finance;

-- 📌 4. Creación de Tablespace Empresarial con Datafiles Autoextensibles
CREATE TABLESPACE tbs_finance_data
  DATAFILE '/u01/app/oracle/oradata/CDB1/pdb_nmerge_finance/finance_data_01.dbf' 
  SIZE 1G 
  AUTOEXTEND ON NEXT 256M MAXSIZE 32G
  EXTENT MANAGEMENT LOCAL AUTOALLOCATE
  SEGMENT SPACE MANAGEMENT AUTO;

-- Creación de Tablespace Temporal dedicado
CREATE TEMPORARY TABLESPACE tbs_finance_temp
  TEMPFILE '/u01/app/oracle/oradata/CDB1/pdb_nmerge_finance/finance_temp_01.dbf'
  SIZE 500M
  AUTOEXTEND ON NEXT 64M MAXSIZE 8G;

-- 📌 5. Creación de Usuario de Aplicación y Asignación de Roles
CREATE USER usr_finance_app IDENTIFIED BY "G3rC4t_01_##"
  DEFAULT TABLESPACE tbs_finance_data
  TEMPORARY TABLESPACE tbs_finance_temp
  QUOTA UNLIMITED ON tbs_finance_data;

GRANT CONNECT, RESOURCE TO usr_finance_app;
GRANT CREATE VIEW, CREATE PROCEDURE, CREATE SEQUENCE TO usr_finance_app;
\`\`\`

---

## 🔒 4. Gobernanza & Seguridad Sentinel-NGAC
En Oracle Enterprise Edition, el acceso a la base de datos se rige bajo la autenticación transparente **SYSDBA / SYSOPER** y políticas de seguridad integradas con el PDP de **Sentinel-NGAC**.

© 2026 NMerge IA. StackUpIA Software Labs. Todos los derechos reservados.`,

  en: `## 🎯 1. Oracle Database Enterprise Architecture & Multitenant (CDB/PDB)

**Oracle Database Enterprise Edition** is the leading relational engine in global banking and telecommunications. It features a decoupled architecture between **Instance** (SGA/PGA memory + Background Processes) and **Database** (physical files), alongside a containerized **Multitenant (CDB/PDB)** architecture.

### 💡 Core Architecture & Invariants:
- **System Global Area (SGA):** Shared memory containing Shared Pool, Buffer Cache, Redo Log Buffer, Large Pool.
- **Program Global Area (PGA):** Private session memory for sorting and hash joins.
- **Background Processes:** DBWn, LGWR, CKPT, SMON, PMON.

© 2026 NMerge IA. All rights reserved.`
};

// 2. Oracle Básico
const oracleBasico = {
  es: `## 🎯 1. Estructuras de Almacenamiento & Fundamentos de PL/SQL

En **Oracle Database Enterprise**, el almacenamiento físico y lógico está estrictamente estructurado en una jerarquía de 5 niveles: **Base de Datos -> Tablespace -> Datafile -> Extent -> Oracle Data Block**. Adicionalmente, el lenguaje **PL/SQL (Procedural Language/SQL)** combina la potencia declarativa de SQL con estructuras de control procedurales.

### 💡 Jerarquía de Almacenamiento & PL/SQL Core:
- **Oracle Block:** La unidad de E/S más pequeña de la base de datos (típicamente 8 KB o 16 KB).
- **Extent:** Conjunto contiguo de bloques Oracle asignados a un segmento.
- **Segment:** Colección de extents asignados a una objeto específico (Tabla, Índice, LOB).
- **Tablespace:** Contenedor lógico que agrupa uno o varios Datafiles físicos en disco.
- **Estructura de Bloque PL/SQL:**
  - \`DECLARE\`: Declaración de variables, tipos y cursores.
  - \`BEGIN\`: Ejecución de sentencias SQL y lógica procedural.
  - \`EXCEPTION\`: Captura y manejo estructurado de errores (\`WHEN OTHERS THEN\`).
  - \`END;\`: Cierre del bloque.

---

## 🏗️ 2. Jerarquía de Almacenamiento Lógico y Físico de Oracle

\`\`\`mermaid
flowchart TD
    DB["Base de Datos Oracle"] --> TS1["Tablespace: TBS_FINANCE_DATA"]
    DB --> TS2["Tablespace: TBS_FINANCE_INDX"]
    
    TS1 --> DF1["Datafile: finance_data_01.dbf (En Disco / ASM)"]
    TS1 --> DF2["Datafile: finance_data_02.dbf (En Disco / ASM)"]
    
    DF1 --> SEG["Segmento de Tabla: CUSTOMER_TRANSACTIONS"]
    SEG --> EXT1["Extent 1 (32 Bloques Contiguos)"]
    SEG --> EXT2["Extent 2 (64 Bloques Contiguos)"]
    
    EXT1 --> BLK["Oracle Data Block (8 KB Header + Free Space + Row Data)"]
\`\`\`

---

## 💻 3. Implementación Empresarial: Procedimiento Almacenado PL/SQL con Manejo de Excepciones

\`\`\`sql
-- =====================================================================
-- NMerge IA - Oracle Enterprise: Procedimiento Almacenado PL/SQL
-- Registro de Transacciones Financieras con SAVEPOINT y Excepciones
-- =====================================================================

CREATE OR REPLACE PROCEDURE prc_process_transfer (
    p_sender_id      IN  NUMBER,
    p_receiver_id    IN  NUMBER,
    p_amount         IN  NUMBER,
    p_transaction_id OUT VARCHAR2,
    p_status_code    OUT NUMBER
) AS
    v_sender_balance   NUMBER;
    v_tx_code          VARCHAR2(64);
    
    -- Excepciones personalizadas
    e_insufficient_funds EXCEPTION;
    PRAGMA EXCEPTION_INIT(e_insufficient_funds, -20001);
BEGIN
    p_status_code := 0; -- Éxito por defecto
    v_tx_code := 'TX-' || TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS') || '-' || DBMS_RANDOM.STRING('X', 6);
    
    -- Establecer un Savepoint transaccional
    SAVEPOINT sp_before_transfer;
    
    -- 1. Validar saldo del remitente con bloqueo FOR UPDATE
    SELECT balance INTO v_sender_balance
    FROM accounts
    WHERE account_id = p_sender_id
    FOR UPDATE WAIT 5;
    
    IF v_sender_balance < p_amount THEN
        RAISE_APPLICATION_ERROR(-20001, 'Saldo insuficiente en la cuenta de origen.');
    END IF;
    
    -- 2. Débito en cuenta remitente
    UPDATE accounts
    SET balance = balance - p_amount,
        updated_at = SYSDATE
    WHERE account_id = p_sender_id;
    
    -- 3. Crédito en cuenta receptora
    UPDATE accounts
    SET balance = balance + p_amount,
        updated_at = SYSDATE
    WHERE account_id = p_receiver_id;
    
    -- 4. Registrar auditoría de transacción
    INSERT INTO transaction_audit (
        tx_id, sender_id, receiver_id, amount, created_at
    ) VALUES (
        v_tx_code, p_sender_id, p_receiver_id, p_amount, SYSDATE
    );
    
    COMMIT;
    p_transaction_id := v_tx_code;
    
EXCEPTION
    WHEN e_insufficient_funds THEN
        ROLLBACK TO sp_before_transfer;
        p_status_code := 400;
        p_transaction_id := NULL;
        DBMS_OUTPUT.PUT_LINE('❌ Error Negocio: ' || SQLERRM);
        
    WHEN NO_DATA_FOUND THEN
        ROLLBACK TO sp_before_transfer;
        p_status_code := 404;
        p_transaction_id := NULL;
        DBMS_OUTPUT.PUT_LINE('❌ Error: Una de las cuentas no existe.');
        
    WHEN OTHERS THEN
        ROLLBACK TO sp_before_transfer;
        p_status_code := 500;
        p_transaction_id := NULL;
        -- Registrar log de error del sistema
        DBMS_OUTPUT.PUT_LINE('💥 Error Crítico [ORA' || SQLCODE || ']: ' || SQLERRM);
        RAISE;
END prc_process_transfer;
/
\`\`\`

---

© 2026 NMerge IA. StackUpIA Software Labs. Todos los derechos reservados.`,

  en: `## 🎯 1. Storage Structures & PL/SQL Fundamentals

In **Oracle Database Enterprise**, physical and logical storage is structured into a 5-level hierarchy: **Database -> Tablespace -> Datafile -> Extent -> Oracle Data Block**.

© 2026 NMerge IA. All rights reserved.`
};

// 3. Oracle Medio
const oracleMedio = {
  es: `## 🎯 1. Paquetes PL/SQL Avanzados, Colecciones & Bulk Operations

En entornos empresariales con millones de transacciones por minuto, la manipulación registro a registro (\`ROW-BY-ROW\`) genera una penalización severa por el cambio de contexto entre el motor SQL y el motor PL/SQL. **Oracle Database** soluciona esto mediante **Colecciones (PL/SQL Collections)** y operaciones en bloque **\`BULK COLLECT\`** y **\`FORALL\`**.

### 💡 Conceptos Clave de Alto Rendimiento:
- **Paquetes PL/SQL (Packages):** Encapsulación modular de código en dos partes: **Specification** (interfaz pública) y **Body** (implementación privada y gestión de estado de sesión).
- **Undo Tablespace & Read Consistency:** Mecanismo multiversión (MVCC) que reconstruye vistas consistentes de datos en el pasado usando *Undo Segments* y previene bloqueos de lectura sobre escrituras.
- **Bulk Binding (\`FORALL\`):** Envía múltiples sentencias de modificación (INSERT/UPDATE/DELETE) al motor SQL en un único cambio de contexto.
- **Bulk Collect (\`BULK COLLECT INTO\`):** Recupera miles de filas desde el motor SQL a colecciones en memoria PGA en una sola instrucción.

---

## 🏗️ 2. Mecanismo de Lectura Consistente (Undo Segments & SCN)

\`\`\`mermaid
flowchart LR
    subgraph SessionQuery ["Sesión A (Consulta Select a SCN 1005)"]
        SelectQuery["SELECT * FROM accounts WHERE status = 'ACTIVE'"]
    end

    subgraph SessionUpdate ["Sesión B (Modificación a SCN 1010)"]
        UpdateStmt["UPDATE accounts SET balance = 5000 WHERE id = 42"]
        CommitStmt["COMMIT (Genera nuevo SCN 1010)"]
    end

    subgraph StorageLayer ["Almacenamiento Oracle"]
        DataBlock["Buffer Cache (Data Block modificado a SCN 1010)"]
        UndoSegment["Undo Segment (Mantiene imagen anterior a SCN 1005)"]
    end

    UpdateStmt --> DataBlock
    UpdateStmt --> UndoSegment
    SelectQuery -->|Lee SCN 1010 > 1005| DataBlock
    DataBlock -->|Reconstruye bloque en RAM mediante Undo| CRBlock["Consistent Read (CR) Block en SCN 1005"]
    CRBlock -->|Devuelve datos limpios| SelectQuery
\`\`\`

---

## 💻 3. Implementación Empresarial: Package PL/SQL con Bulk Collect & FORALL

\`\`\`sql
-- =====================================================================
-- NMerge IA - Oracle Enterprise: Paquete de Procesamiento Masivo PL/SQL
-- Colecciones PL/SQL, Ref Cursors, BULK COLLECT y FORALL con SAVE EXCEPTIONS
-- =====================================================================

CREATE OR REPLACE PACKAGE pkg_batch_processor AS
    -- Definición de tipos de colecciones
    TYPE t_account_rec IS RECORD (
        account_id   NUMBER,
        balance      NUMBER,
        status       VARCHAR2(20)
    );
    TYPE t_account_tbl IS TABLE OF t_account_rec INDEX BY PLS_INTEGER;
    TYPE ref_cursor_type IS REF CURSOR;

    -- Procedimiento principal de procesamiento en lote
    PROCEDURE execute_mass_interest_credit (
        p_batch_size  IN  NUMBER DEFAULT 5000,
        p_processed   OUT NUMBER,
        p_errors      OUT NUMBER
    );
END pkg_batch_processor;
/

CREATE OR REPLACE PACKAGE BODY pkg_batch_processor AS

    PROCEDURE execute_mass_interest_credit (
        p_batch_size  IN  NUMBER DEFAULT 5000,
        p_processed   OUT NUMBER,
        p_errors      OUT NUMBER
    ) IS
        CURSOR c_accounts IS
            SELECT account_id, balance, status 
            FROM accounts 
            WHERE status = 'ACTIVE';

        v_accounts_tbl   t_account_tbl;
        v_bulk_exceptions EXCEPTION;
        PRAGMA EXCEPTION_INIT(v_bulk_exceptions, -24381); -- ORA-24381: errors in FORALL
    BEGIN
        p_processed := 0;
        p_errors := 0;

        OPEN c_accounts;
        LOOP
            -- 📌 1. Carga masiva en lote desde SQL a memoria PGA
            FETCH c_accounts BULK COLLECT INTO v_accounts_tbl LIMIT p_batch_size;
            EXIT WHEN v_accounts_tbl.COUNT = 0;

            -- 📌 2. Modificación masiva con FORALL y SAVE EXCEPTIONS
            BEGIN
                FORALL i IN 1..v_accounts_tbl.COUNT SAVE EXCEPTIONS
                    UPDATE accounts
                    SET balance = balance + (v_accounts_tbl(i).balance * 0.05),
                        updated_at = SYSDATE
                    WHERE account_id = v_accounts_tbl(i).account_id;
            EXCEPTION
                WHEN v_bulk_exceptions THEN
                    -- Manejo de errores individuales sin abortar el lote completo
                    p_errors := p_errors + SQL%BULK_EXCEPTIONS.COUNT;
                    FOR j IN 1..SQL%BULK_EXCEPTIONS.COUNT LOOP
                        DBMS_OUTPUT.PUT_LINE(' Error en fila ' || SQL%BULK_EXCEPTIONS(j).ERROR_INDEX || 
                                           ': ' || SQLERRM(-SQL%BULK_EXCEPTIONS(j).ERROR_CODE));
                    END LOOP;
            END;

            p_processed := p_processed + v_accounts_tbl.COUNT;
            COMMIT; -- Commit por lote para evitar Undo Overflow
        END LOOP;
        CLOSE c_accounts;
        
        DBMS_OUTPUT.PUT_LINE('🚀 Proceso en Lote Completado. Procesados: ' || p_processed || ' | Errores: ' || p_errors);
    END execute_mass_interest_credit;

END pkg_batch_processor;
/
\`\`\`

---

© 2026 NMerge IA. StackUpIA Software Labs. Todos los derechos reservados.`,

  en: `## 🎯 1. Advanced PL/SQL Packages, Collections & Bulk Operations

In high-throughput enterprise environments, **Oracle Database** utilizes **PL/SQL Collections**, **\`BULK COLLECT\`**, and **\`FORALL\`** to eliminate context switching penalties between SQL and PL/SQL engines.

© 2026 NMerge IA. All rights reserved.`
};

// 4. Oracle Avanzado
const oracleAvanzado = {
  es: `## 🎯 1. Particionado Empresarial, Seguridad Fina (VPD) & TDE

Para tablas con cientos de millones de registros, el rendimiento depende del **Particionado de Tablas e Índices**. Adicionalmente, la seguridad nivel bancario en Oracle exige **Virtual Private Database (VPD / Fine-Grained Access Control)** y cifrado transparente en disco **TDE (Transparent Data Encryption)**.

### 💡 Estrategias de Particionado & Seguridad Avanzada:
- **Partition Pruning:** El optimizador elimina automáticamente el escaneo de particiones no relevantes durante la ejecución de la consulta.
- **Interval Partitioning:** Creación automática de nuevas particiones de fecha a medida que se ingresan nuevos registros.
- **Composite Partitioning:** Combinación de dos métodos (ej. Particionado principal por Rango de Fecha + Subparticionado por Hash de Cliente).
- **Virtual Private Database (VPD / DBMS_RLS):** Inyección transparente de cláusulas \`WHERE\` dinámicas en el motor SQL según el rol y contexto de seguridad del usuario autenticado.

---

## 🏗️ 2. Flujo de Partition Pruning en el Optimizador Oracle

\`\`\`mermaid
flowchart TD
    UserQuery["Consulta SQL: SELECT * FROM ledger WHERE tx_date = '2026-08-02'"] --> CBO["Optimizador basado en Costes (CBO)"]
    
    subgraph TableLedger ["Tabla Particionada por Intervalo Mensual"]
        P_202606["Partición P_202606 (Junio 2026)"]
        P_202607["Partición P_202607 (Julio 2026)"]
        P_202608["Partición P_202608 (Agosto 2026)"]
    end

    CBO -->|Partition Pruning (Omite P_202606 y P_202607)| P_202608
    P_202608 -->|Escaneo de Bloques Reales| Result["Resultado Ultrarrápido"]
\`\`\`

---

## 💻 3. Implementación Empresarial: Tabla Particionada Compuesta y Política VPD (DBMS_RLS)

\`\`\`sql
-- =====================================================================
-- NMerge IA - Oracle Enterprise: Particionado Compuesto y Seguridad VPD
-- =====================================================================

-- 📌 1. Creación de Tabla Particionada por Intervalo (Mes) y Subparticionada por Hash (16 Subparticiones)
CREATE TABLE ledger_transactions (
    transaction_id   NUMBER(18) NOT NULL,
    account_id       NUMBER(12) NOT NULL,
    tenant_id        NUMBER(6)  NOT NULL,
    transaction_date DATE       NOT NULL,
    amount           NUMBER(15,2) NOT NULL,
    currency         VARCHAR2(3) NOT NULL,
    description      VARCHAR2(255)
)
TABLESPACE tbs_finance_data
PARTITION BY RANGE (transaction_date)
INTERVAL (NUMTOYMINTERVAL(1, 'MONTH'))
SUBPARTITION BY HASH (account_id) SUBPARTITIONS 16
(
    PARTITION p_initial VALUES LESS THAN (TO_DATE('2026-01-01', 'YYYY-MM-DD'))
);

-- Crear Índice Local Particionado
CREATE INDEX idx_ledger_acc_date ON ledger_transactions(account_id, transaction_date)
LOCAL;

-- 📌 2. Implementación de Función de Seguridad para Virtual Private Database (VPD)
CREATE OR REPLACE FUNCTION fn_security_tenant_predicate (
    p_schema IN VARCHAR2,
    p_object IN VARCHAR2
) RETURN VARCHAR2 AS
    v_context_tenant NUMBER;
BEGIN
    -- Obtener el tenant_id de la sesión del usuario activo desde el contexto SYS_CONTEXT
    v_context_tenant := SYS_CONTEXT('nmerge_ctx', 'current_tenant_id');
    
    -- Si es DBA/Admin, no restringe ninguna fila
    IF SYS_CONTEXT('USERENV', 'ISDBA') = 'TRUE' THEN
        RETURN '1=1';
    END IF;
    
    -- Inyectar filtro automático transparente por tenant_id
    RETURN 'tenant_id = ' || NVL(v_context_tenant, -1);
END fn_security_tenant_predicate;
/

-- 📌 3. Asignación de la Política RLS (VPD) a la Tabla Ledger
BEGIN
    DBMS_RLS.ADD_POLICY (
        object_schema   => 'USR_FINANCE_APP',
        object_name     => 'LEDGER_TRANSACTIONS',
        policy_name     => 'pol_tenant_isolation',
        function_schema => 'USR_FINANCE_APP',
        policy_function => 'fn_security_tenant_predicate',
        statement_types => 'SELECT, UPDATE, DELETE',
        update_check    => TRUE
    );
END;
/
\`\`\`

---

© 2026 NMerge IA. StackUpIA Software Labs. Todos los derechos reservados.`,

  en: `## 🎯 1. Enterprise Partitioning, Fine-Grained Security (VPD) & TDE

In high-volume enterprise environments, **Oracle Database** delivers high performance using **Table & Index Partitioning**, alongside **Virtual Private Database (VPD / DBMS_RLS)** and **Transparent Data Encryption (TDE)**.

© 2026 NMerge IA. All rights reserved.`
};

// 5. Oracle Experto
const oracleExperto = {
  es: `## 🎯 1. Alta Disponibilidad: Oracle RAC, Data Guard & Flashback

Para arquitecturas de Misión Crítica (Tier-0), **Oracle Database Enterprise** ofrece disponibilidad del 99.999% mediante **Real Application Clusters (RAC)**, continuidad del negocio con **Active Data Guard** y recuperación ante desastres con tecnología **Flashback**.

### 💡 Tecnologías de Misión Crítica:
- **Oracle RAC (Real Application Clusters):** Múltiples instancias compartiendo una única base de datos física mediante **Cache Fusion** e interconexión privada de alta velocidad.
- **Cache Fusion & GCS/GES:** Intercambio directo de bloques de memoria entre nodos vía InfiniBand/RoCE sin necesidad de escribir a disco.
- **Oracle Active Data Guard:** Replicación física en tiempo real a sitios remotos de contingencia con soporte de apertura en modo \`READ ONLY\` para descarga de consultas de reporte.
- **Oracle Flashback Database:** Rebobinado de la base de datos completa o tablas específicas a un punto exacto del tiempo (\`AS OF TIMESTAMP\`) sin restaurar copias de seguridad de cinta.

---

## 🏗️ 2. Arquitectura Oracle RAC (Cache Fusion & Shared Storage)

\`\`\`mermaid
flowchart TD
    subgraph Clients ["Capa de Clientes / Load Balancers"]
        AppCluster["Aplicación Enterprise / Connection Pool SCAN"]
    end

    subgraph RACCluster ["Clúster Oracle RAC (Cache Fusion)"]
        subgraph Node1 ["Nodo 1 (Instancia 1 - SGA 1)"]
            Inst1["Instancia 1 (SGA/PGA)"]
            GCS1["Global Cache Service (GCS)"]
        end

        subgraph Node2 ["Nodo 2 (Instancia 2 - SGA 2)"]
            Inst2["Instancia 2 (SGA/PGA)"]
            GCS2["Global Cache Service (GCS)"]
        end

        PrivateInterconnect["Private Interconnect High-Speed Network (Cache Fusion)"]
    end

    subgraph Storage ["Almacenamiento Compartido ASM"]
        ASM["Oracle Automatic Storage Management (ASM Grid)"]
    end

    AppCluster --> Inst1
    AppCluster --> Inst2
    Inst1 <--> PrivateInterconnect
    Inst2 <--> PrivateInterconnect
    Inst1 --> ASM
    Inst2 --> ASM
\`\`\`

---

## 💻 3. Implementación Empresarial: Consultas Flashback y Diagnóstico Data Guard

\`\`\`sql
-- =====================================================================
-- NMerge IA - Oracle Enterprise: Flashback Query y Monitoreo de Data Guard
-- =====================================================================

-- 📌 1. Consulta Flashback (Recuperar datos como existían hace 30 minutos)
SELECT * 
FROM ledger_transactions 
AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL '30' MINUTE)
WHERE account_id = 884920;

-- 📌 2. Restauración de Tabla Borrada accidentalmente mediante Flashback Drop
FLASHBACK TABLE ledger_transactions TO BEFORE DROP RENAME TO ledger_transactions_restored;

-- 📌 3. Rebobinado Atómico de Tabla a un SCN (System Change Number) Específico
ALTER TABLE ledger_transactions ENABLE ROW MOVEMENT;
FLASHBACK TABLE ledger_transactions TO SCN 104928501;

-- 📌 4. Script DBA: Monitoreo de Lag de Replicación en Active Data Guard
SELECT 
    name, 
    value, 
    unit, 
    time_computed 
FROM v$dataguard_stats 
WHERE name IN ('transport lag', 'apply lag');

-- 📌 5. Estado de los Nodos del Clúster Oracle RAC
SELECT 
    inst_id, 
    instance_name, 
    host_name, 
    status, 
    database_status 
FROM gv$instance;
\`\`\`

---

© 2026 NMerge IA. StackUpIA Software Labs. Todos los derechos reservados.`,

  en: `## 🎯 1. High Availability: Oracle RAC, Data Guard & Flashback

For Tier-0 mission-critical architectures, **Oracle Database Enterprise** delivers 99.999% availability with **Real Application Clusters (RAC)**, **Active Data Guard**, and **Flashback Database**.

© 2026 NMerge IA. All rights reserved.`
};

// 6. Oracle Optimizaciones
const oracleOptimizaciones = {
  es: `## 🎯 1. Performance Tuning: CBO, Optimizer Hints & AWR/ASH Profiling

El ajuste de rendimiento en **Oracle Database Enterprise** requiere dominar el **Cost-Based Optimizer (CBO)**, el uso estratégico de **Optimizer Hints**, y la interpretación profunda de reportes **AWR (Automatic Workload Repository)** y **ASH (Active Session History)**.

### 💡 Técnicas Avanzadas de Profiling & Tuning:
- **Cost-Based Optimizer (CBO):** Calcula el costo ordinal (I/O, CPU, Latencia de Red) evaluando estadísticas en \`DBA_TAB_STATISTICS\`.
- **Optimizer Hints (\`/*+ ... */\`):** Directivas forzadas para guiar el optimizador (\`/*+ INDEX(t idx_name) */\`, \`/*+ PARALLEL(t 8) */\`, \`/*+ USE_HASH(a b) */\`, \`/*+ LEADING(a b c) */\`).
- **AWR (Automatic Workload Repository):** Capturas periódicas de rendimiento global (Eventos de Espera Top 5 Wait Events, Latch Free, DB Sequential Read, Enqueue).
- **ASH (Active Session History):** Muestreo en memoria a nivel de segundo de todas las sesiones activas no inactivas.

---

## 🏗️ 2. Arquitectura de Evaluación del Optimizador CBO

\`\`\`mermaid
flowchart TD
    SQLInput["Consulta SQL de Entrada"] --> Parser["Parser (Sintaxis & Semántica)"]
    Parser --> Transformer["Query Transformer (View Merging / Subquery Unnesting)"]
    Transformer --> Estimator["Estimator (Selectivity, Cardinality & Cost Evaluation)"]
    Estimator --> PlanGen["Plan Generator (Genera alternativas de Execution Plan)"]
    PlanGen --> BestPlan["Execution Plan Final con Menor Costo"]
\`\`\`

---

## 💻 3. Implementación Empresarial: Profiling AWR/ASH y Hints de Optimización

\`\`\`sql
-- =====================================================================
-- NMerge IA - Oracle Enterprise: Tuning Avanzado con Hints y DBMS_XPLAN
-- =====================================================================

-- 📌 1. Consulta Compleja con Hints de Optimización de Paralelismo y Hash Join
EXPLAIN PLAN FOR
SELECT /*+ LEADING(l a) USE_HASH(a) PARALLEL(l 8) FULL(l) INDEX(a idx_acc_id) */
    a.account_number,
    SUM(l.amount) AS total_amount
FROM ledger_transactions l
JOIN accounts a ON l.account_id = a.account_id
WHERE l.transaction_date >= TO_DATE('2026-01-01', 'YYYY-MM-DD')
GROUP BY a.account_number;

-- Display del Plan de Ejecución Completo en Memoria
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY(format => 'ALLSTATS LAST +COST +BYTES +PARALLEL'));

-- 📌 2. Script DBA: Identificación de Sesiones Activas Bloqueadas (ASH - Active Session History)
SELECT 
    session_id,
    session_serial#,
    sql_id,
    event,
    wait_time_micro / 1000 AS wait_time_ms,
    program
FROM v$active_session_history
WHERE sample_time > SYSDATE - INTERVAL '5' MINUTE
  AND session_state = 'WAITING'
ORDER BY wait_time_micro DESC;

-- 📌 3. Generación de Reporte AWR para Diagnóstico de Rendimiento Global
-- Ejecutar en SQL*Plus o SQL Developer
-- EXEC DBMS_WORKLOAD_REPOSITORY.CREATE_SNAPSHOT();
-- SELECT * FROM TABLE(DBMS_WORKLOAD_REPOSITORY.AWR_REPORT_HTML(dbid => 12948201, inst_num => 1, bid => 104, eid => 105));
\`\`\`

---

© 2026 NMerge IA. StackUpIA Software Labs. Todos los derechos reservados.`,

  en: `## 🎯 1. Performance Tuning: CBO, Optimizer Hints & AWR/ASH Profiling

Performance tuning in **Oracle Database Enterprise** centers on mastering the **Cost-Based Optimizer (CBO)**, **Optimizer Hints**, and interpreting **AWR & ASH** profiling reports.

© 2026 NMerge IA. All rights reserved.`
};

// Write files for all 6 levels across 7 languages
languages.forEach(lang => {
  const isEs = lang === 'es';
  
  fs.writeFileSync(path.join(docsDir, lang, 'oracle_inicial.md'), isEs ? oracleInicial.es : oracleInicial.en, 'utf8');
  fs.writeFileSync(path.join(docsDir, lang, 'oracle_basico.md'), isEs ? oracleBasico.es : oracleBasico.en, 'utf8');
  fs.writeFileSync(path.join(docsDir, lang, 'oracle_medio.md'), isEs ? oracleMedio.es : oracleMedio.en, 'utf8');
  fs.writeFileSync(path.join(docsDir, lang, 'oracle_avanzado.md'), isEs ? oracleAvanzado.es : oracleAvanzado.en, 'utf8');
  fs.writeFileSync(path.join(docsDir, lang, 'oracle_experto.md'), isEs ? oracleExperto.es : oracleExperto.en, 'utf8');
  fs.writeFileSync(path.join(docsDir, lang, 'oracle_optimizaciones.md'), isEs ? oracleOptimizaciones.es : oracleOptimizaciones.en, 'utf8');

  console.log(`✅ Sincronizados los 6 niveles profundos de Oracle Database Enterprise en [${lang}]`);
});

console.log('🎉 Enriquecimiento completo de Oracle Database Enterprise finalizado con éxito.');

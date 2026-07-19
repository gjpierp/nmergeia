import React from 'react';

export const MainScreen = ({
  originPath,
  destSlots,
  originHandle,
  isProcessing,
  openOrigin,
  openDest,
  addDestSlot,
  removeDestSlot,
  handleClear,
  saveCurrentProfile,
  processFiles
}) => {
  return (
    <div className="main-screen">
      <h2 className="main-screen-title">Configuración de Comparación</h2>

      <div className="section-card config-card">
        <h3 className="config-card-title">Seleccionar Carpetas</h3>

        <div className="config-row">
          <label className="config-label">Origen:</label>
          <input
            type="text"
            readOnly
            value={originPath || 'Ninguna selección...'}
            className="config-input-readonly"
          />
          <button className="btn secondary-btn config-action-btn" onClick={() => openOrigin('folder')} data-tooltip="Seleccionar Carpeta">
            <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>folder</span>
          </button>
          <button className="btn secondary-btn config-action-btn" onClick={() => openOrigin('files')} data-tooltip="Seleccionar Archivo(s)">
            <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>insert_drive_file</span>
          </button>
          {destSlots.length > 1 && (
            <div style={{ visibility: 'hidden' }}>
              <button className="btn clear-btn config-action-btn" style={{ border: '1px solid transparent' }}>
                <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>close</span>
              </button>
            </div>
          )}
        </div>

        {destSlots.map((slot, i) => (
          <div key={slot.id} className="config-row">
            <label className="config-label">
              Destino{i === 0 ? '' : ` ${i + 1}`}:
            </label>
            <input
              type="text"
              readOnly
              value={slot.path || 'Ninguna selección...'}
              className="config-input-readonly"
            />
            <button className="btn secondary-btn config-action-btn" onClick={() => openDest(slot.id, 'folder')} data-tooltip="Seleccionar Carpeta">
              <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>folder</span>
            </button>
            <button className="btn secondary-btn config-action-btn" onClick={() => openDest(slot.id, 'files')} data-tooltip="Seleccionar Archivo(s)">
              <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>insert_drive_file</span>
            </button>
            {destSlots.length > 1 && (
              <button className="btn clear-btn config-action-btn" onClick={() => removeDestSlot(slot.id)} style={{ border: '1px solid #ef4444', color: '#ef4444' }} data-tooltip="Quitar destino">
                <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>close</span>
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="config-action-bar">
        <button className="btn clear-btn" data-tooltip="Limpiar todo" onClick={handleClear} style={{ fontSize: '1.2rem', padding: '0.5rem 1rem', border: '1px solid #ef4444', color: '#ef4444' }}>
          <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>cleaning_services</span>
        </button>
        <button className="btn secondary-btn" data-tooltip="Añadir otro destino" onClick={addDestSlot} style={{ fontSize: '1.2rem', padding: '0.5rem 1rem' }}>
          <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>add</span>
        </button>
        <button className="btn secondary-btn" data-tooltip="Guardar en Historial" onClick={saveCurrentProfile} style={{ fontSize: '1.2rem', padding: '0.5rem 1rem' }}>
          <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>save</span>
        </button>
        <button
          className="btn primary-btn"
          data-tooltip="Iniciar Comparación"
          onClick={() => processFiles()}
          disabled={isProcessing || (!originHandle && destSlots.every(s => !s.handle))}
          style={{ fontSize: '1.2rem', padding: '0.5rem 1rem' }}
        >
          {isProcessing
            ? <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>hourglass_empty</span>
            : <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>play_arrow</span>
          }
        </button>
      </div>
    </div>
  );
};

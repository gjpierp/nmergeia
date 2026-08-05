import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  processFiles,
  setOriginDirect,
  setDestDirect,
  swapFolders
}) => {
  const { t } = useTranslation();
  const [isDraggingOrigin, setIsDraggingOrigin] = useState(false);
  const [draggingDestSlot, setDraggingDestSlot] = useState(null);

  const handleDragOverOrigin = (e) => {
    e.preventDefault();
    setIsDraggingOrigin(true);
  };

  const handleDragLeaveOrigin = () => {
    setIsDraggingOrigin(false);
  };

  const handleDropOrigin = async (e) => {
    e.preventDefault();
    setIsDraggingOrigin(false);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const item = e.dataTransfer.items[0];
      if (typeof item.getAsFileSystemHandle === 'function') {
        try {
          const handle = await item.getAsFileSystemHandle();
          if (handle) {
            setOriginDirect(handle);
          }
        } catch (err) {
          console.error("Error al obtener handle de origen:", err);
        }
      } else {
        alert("La selección de carpetas no está soportada en este navegador (ej. Firefox o conexión HTTP insegura). Se requiere Chrome/Edge/Chromium sobre HTTPS o Localhost para usar el sistema de archivos local.");
      }
    }
  };

  const handleDragOverDest = (e, slotId) => {
    e.preventDefault();
    setDraggingDestSlot(slotId);
  };

  const handleDragLeaveDest = () => {
    setDraggingDestSlot(null);
  };

  const handleDropDest = async (e, slotId) => {
    e.preventDefault();
    setDraggingDestSlot(null);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const item = e.dataTransfer.items[0];
      if (typeof item.getAsFileSystemHandle === 'function') {
        try {
          const handle = await item.getAsFileSystemHandle();
          if (handle) {
            setDestDirect(slotId, handle);
          }
        } catch (err) {
          console.error("Error al obtener handle de destino:", err);
        }
      } else {
        alert("La selección de carpetas no está soportada en este navegador (ej. Firefox o conexión HTTP insegura). Se requiere Chrome/Edge/Chromium sobre HTTPS o Localhost para usar el sistema de archivos local.");
      }
    }
  };

  return (
    <div className="main-screen">
      <h2 className="main-screen-title">{t('compare_config_title')}</h2>

      <div className="section-card config-card">
        <h3 className="config-card-title">{t('select_folders_title')}</h3>

        <div 
          className={`config-row ${isDraggingOrigin ? 'drag-over' : ''}`}
          onDragOver={handleDragOverOrigin}
          onDragLeave={handleDragLeaveOrigin}
          onDrop={handleDropOrigin}
          style={{ cursor: 'pointer' }}
          title={t('drag_drop_title')}
        >
          <label className="config-label">{t('label_origin')}</label>
          <input
            type="text"
            readOnly
            value={originPath || t('drag_drop_placeholder')}
            className="config-input-readonly"
          />
          <button className="btn secondary-btn config-action-btn" onClick={() => openOrigin('folder')} data-tooltip={t('tooltip_select_folder')}>
            <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>folder</span>
          </button>
          <button className="btn secondary-btn config-action-btn" onClick={() => openOrigin('files')} data-tooltip={t('tooltip_select_files')}>
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
          <div 
            key={slot.id} 
            className={`config-row ${draggingDestSlot === slot.id ? 'drag-over' : ''}`}
            onDragOver={(e) => handleDragOverDest(e, slot.id)}
            onDragLeave={handleDragLeaveDest}
            onDrop={(e) => handleDropDest(e, slot.id)}
            style={{ cursor: 'pointer' }}
            title={t('drag_drop_title')}
          >
            <label className="config-label">
              {t('label_destination')}{i === 0 ? '' : ` ${i + 1}`}:
            </label>
            <input
              type="text"
              readOnly
              value={slot.path || t('drag_drop_placeholder')}
              className="config-input-readonly"
            />
            <button className="btn secondary-btn config-action-btn" onClick={() => openDest(slot.id, 'folder')} data-tooltip={t('tooltip_select_folder')}>
              <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>folder</span>
            </button>
            <button className="btn secondary-btn config-action-btn" onClick={() => openDest(slot.id, 'files')} data-tooltip={t('tooltip_select_files')}>
              <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>insert_drive_file</span>
            </button>
            <button className="btn secondary-btn config-action-btn" onClick={() => swapFolders && swapFolders(slot.id)} data-tooltip={t('tooltip_swap_folders') || "Invertir Origen y Destino"}>
              <span className="material-symbols-rounded" style={{ fontSize: '1.2rem', color: '#0284c7' }}>swap_vert</span>
            </button>
            {destSlots.length > 1 && (
              <button className="btn clear-btn config-action-btn" onClick={() => removeDestSlot(slot.id)} style={{ border: '1px solid #ef4444', color: '#ef4444' }} data-tooltip={t('tooltip_remove_destination')}>
                <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>close</span>
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="config-action-bar">
        <button className="btn clear-btn" data-tooltip={t('tooltip_clear_all')} onClick={handleClear} style={{ border: '1px solid #ef4444', color: '#ef4444' }}>
          <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>cleaning_services</span>
        </button>
        <button className="btn secondary-btn" data-tooltip={t('tooltip_add_destination')} onClick={addDestSlot}>
          <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>add</span>
        </button>
        <button className="btn secondary-btn" data-tooltip={t('tooltip_swap_folders') || "Invertir Origen y Destino"} onClick={() => swapFolders && swapFolders()} disabled={isProcessing || (!originHandle && destSlots.every(s => !s.handle))}>
          <span className="material-symbols-rounded" style={{ fontSize: '1.2rem', color: '#0284c7' }}>swap_vert</span>
        </button>
        <button className="btn secondary-btn" data-tooltip={t('tooltip_save_profile')} onClick={saveCurrentProfile}>
          <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>save</span>
        </button>
        <button
          className="btn primary-btn"
          data-tooltip={t('tooltip_start_compare')}
          onClick={() => processFiles()}
          disabled={isProcessing || (!originHandle && destSlots.every(s => !s.handle))}
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

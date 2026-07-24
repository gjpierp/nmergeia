import React, { useEffect, useState } from 'react';
import { NgacService } from '../../shared/lib/NgacService.js';
import { useAppStore } from '../../app/useAppStore.js';

export const NgacAdBanner = ({ position = 'Top' }) => {
  const [isVisible, setIsVisible] = useState(true); // Por defecto visible (desprotegido para invitados)

  let userSession = null;
  let userSessionStr = null;
  try {
    userSessionStr = typeof window !== 'undefined' ? localStorage.getItem('nmerge_user_session') : null;
    userSession = userSessionStr && userSessionStr !== 'undefined' ? JSON.parse(userSessionStr) : null;
  } catch (e) {
    console.warn('Failed to parse user session in NgacAdBanner:', e);
  }
  const userRoles = userSession ? userSession.roles || [] : ['ROLE_INVITADO'];

  useEffect(() => {
    // Consultamos de manera asíncrona a Sentinel-NGAC para la visibilidad de esta posición de banner
    const resourceName = `AdBanner${position}`;
    
    // Si Sentinel está levantado, chequear permiso del rol actual para omitir el banner
    // checkPermission devuelve true si el recurso está protegido/bloqueado para ese rol (por ende, debe mostrar el banner).
    // Si no está protegido (el rol administrador tiene permiso de omitirlo), devuelve false y ocultamos el banner.
    const isNgacLocked = typeof window !== 'undefined' ? localStorage.getItem('nmergeia_ngac_locked') === 'true' : true;
    
    if (isNgacLocked) {
      // Intentamos consultar dinámicamente si el rol tiene permiso para omitir/ocultar publicidad
      // En Sentinel, si el rol tiene asignado el permiso sobre el objeto, no mostramos anuncios.
      // Si no tiene el permiso (ej: ROLE_INVITADO), mostramos el banner.
      const hasPermissionToHide = !NgacService.checkPermission(resourceName, userRoles);
      setIsVisible(!hasPermissionToHide);
    } else {
      // Si el bloqueo global de anuncios/premium en Sentinel está apagado, ocultar todos los banners
      setIsVisible(false);
    }
  }, [userSessionStr, position]);

  if (!isVisible) return null;

  // Estilos visuales premium adaptados a la posición
  const stylesByPosition = {
    Top: {
      background: 'linear-gradient(90deg, #10b981, #059669)',
      color: 'white',
      padding: '0.6rem',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '11px',
      borderRadius: '4px',
      margin: '0.5rem 0.5rem 0 0.5rem',
      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
      fontFamily: '"Outfit", sans-serif'
    },
    Sidebar: {
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.08) 100%)',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      color: 'var(--text-secondary)',
      padding: '12px',
      textAlign: 'left',
      fontSize: '11px',
      borderRadius: '6px',
      margin: '10px 15px',
      fontFamily: '"Outfit", sans-serif',
      boxSizing: 'border-box'
    },
    Matrix: {
      background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)',
      borderTop: '1px solid var(--border-color)',
      color: '#10b981',
      padding: '10px 15px',
      textAlign: 'center',
      fontWeight: '500',
      fontSize: '11px',
      fontFamily: '"Outfit", sans-serif'
    }
  };

  const currentStyle = stylesByPosition[position] || stylesByPosition.Top;

  return (
    <div className={`ngac-ad-banner ad-banner-${position.toLowerCase()}`} style={currentStyle}>
      {position === 'Top' && "✨ Advanced Agentic Diff - Herramienta Local-First Optimizada por Sentinel-NGAC"}
      {position === 'Sidebar' && (
        <div>
          <strong style={{ color: '#10b981', display: 'block', marginBottom: '4px' }}>🔐 Sentinel-NGAC Guard</strong>
          Control de políticas y enrutamiento dinámico activo. Sesiones y roles validados localmente.
        </div>
      )}
      {position === 'Matrix' && "💡 Tip de Productividad: Usa los Filtros Semánticos en la pestaña de arriba para ignorar espacios y comentarios en el código."}
    </div>
  );
};

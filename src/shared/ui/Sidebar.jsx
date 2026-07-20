import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../app/useAppStore.js';
import { NgacService } from '../lib/NgacService.js';

export const Sidebar = () => {
  const { activeTab, setActiveTab } = useAppStore();
  const [allowedOptions, setAllowedOptions] = useState(['Comparar', 'Historial', 'Filtros']); // Default fallback

  const userSessionStr = typeof window !== 'undefined' ? localStorage.getItem('nmerge_user_session') : null;
  const userSession = userSessionStr ? JSON.parse(userSessionStr) : null;
  const userRoles = userSession ? userSession.roles || [] : ['ROLE_INVITADO'];

  useEffect(() => {
    NgacService.getDynamicMenu(userRoles, !!userSession)
      .then(options => {
        if (options && options.length > 0) {
          setAllowedOptions(options);
        }
      })
      .catch(e => console.error("Error cargando menú dinámico de Sentinel:", e));
  }, [userSessionStr]);

  const showVentas = allowedOptions.includes('Ventas');
  const showComparar = allowedOptions.includes('Comparar');
  const showLogin = allowedOptions.includes('Login');
  const showLicencia = allowedOptions.includes('Licencia');
  const showHistorial = allowedOptions.includes('Historial');
  const showFiltros = allowedOptions.includes('Filtros');

  return (
    <aside className="app-sidebar">
      {showVentas && (
        <button className={`sidebar-btn ${activeTab === 'landing' ? 'active' : ''}`} data-tooltip="Presentación y Ventas" onClick={() => setActiveTab('landing')}>
          <span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>campaign</span> Ventas
        </button>
      )}
      {showComparar && (
        <button className={`sidebar-btn ${activeTab === 'main' ? 'active' : ''}`} data-tooltip="Comparador de Carpetas" onClick={() => setActiveTab('main')}>
          <span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>compare</span> Comparar
        </button>
      )}
      {showLogin && (
        <button className={`sidebar-btn ${activeTab === 'login' ? 'active' : ''}`} data-tooltip="Iniciar Sesión / OAuth" onClick={() => setActiveTab('login')}>
          <span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>login</span> Ingresar
        </button>
      )}
      {showLicencia && (
        <button className={`sidebar-btn ${activeTab === 'register' ? 'active' : ''}`} data-tooltip="Registrar Licencia PRO" onClick={() => setActiveTab('register')}>
          <span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>card_membership</span> Licencia
        </button>
      )}
      {showHistorial && (
        <button className={`sidebar-btn ${activeTab === 'history' ? 'active' : ''}`} data-tooltip="Historial de Trabajos" onClick={() => setActiveTab('history')}>
          <span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>history</span> Historial
        </button>
      )}
      {showFiltros && (
        <button className={`sidebar-btn ${activeTab === 'filters' ? 'active' : ''}`} data-tooltip="Configuración / Filtros" onClick={() => setActiveTab('filters')}>
          <span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>filter_alt</span> Filtros
        </button>
      )}
    </aside>
  );
};

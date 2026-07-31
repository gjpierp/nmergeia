import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const Tema06NgacMenusPage = () => {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | NGAC Aplicado a Menús y Vistas Dinámicas</title>
      </Helmet>
      
      <MarkdownViewer 
        filename="tema_06_ngac_menus.md"
        title="NGAC Aplicado a Menús y Vistas Dinámicas"
        requiredRole="Tema06NgacMenus"
      />
    </div>
  );
};

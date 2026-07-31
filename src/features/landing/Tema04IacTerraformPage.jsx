import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const Tema04IacTerraformPage = () => {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Infraestructura como Código e Inmutabilidad</title>
      </Helmet>
      
      <MarkdownViewer 
        filename="tema_04_iac_terraform.md"
        title="Infraestructura como Código e Inmutabilidad"
        requiredRole="Tema04IacTerraform"
      />
    </div>
  );
};

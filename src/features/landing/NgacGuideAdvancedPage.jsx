import React, { useEffect, useState } from 'react';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export const NgacGuideAdvancedPage = () => {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const lang = i18n.language === 'en' ? 'en' : 'es';
        const response = await fetch(`/docs/${lang}/ngac_avanzado.md`);
        const text = await response.text();
        setContent(text);
      } catch (err) {
        console.error('Error fetching markdown', err);
      }
    };
    fetchContent();
  }, [i18n.language]);

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NGAC (Avanzado) - nMerge</title>
      </Helmet>
      <MarkdownViewer content={content} />
    </div>
  );
};

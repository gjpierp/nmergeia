import React, { useEffect, useState } from 'react';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export const NgacGuideBasicPage = () => {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const lang = i18n.language === 'en' ? 'en' : 'es';
        const response = await fetch(`/docs/${lang}/ngac_basico.md`);
        const text = await response.text();
        setContent(text);
      } catch (err) {
        console.error('Error fetching markdown', err);
      }
    };
    fetchContent();
  }, [i18n.language]);

  return (
    <div style={{ padding: '2rem', width: '100%',  height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NGAC (Básico) - nMerge</title>
      </Helmet>
      <MarkdownViewer content={content} />
    </div>
  );
};

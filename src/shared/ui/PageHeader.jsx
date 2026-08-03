import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo.jsx';
import { TopicLogo } from './TopicLogo.jsx';

/**
 * @file PageHeader.jsx
 * @description Cabecera reutilizable de página con comportamiento responsive inteligente.
 * En pantallas grandes (Desktop >= 1024px) se mantiene visible.
 * En pantallas pequeñas (Mobile/Tablet < 1024px) se oculta suavemente al hacer scroll hacia abajo
 * (dejando visibles solo las pestañas) y reaparece al hacer scroll hacia arriba.
 */
export const PageHeader = ({ icon, title, subtitle, badgeText, rightAction, topicId, sticky = true, logoSize, centered = false }) => {
  const headerRef = useRef(null);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let lastScrollY = 0;
    let ticking = false;

    const findScrollableParent = (node) => {
      let curr = node;
      while (curr && curr !== document.body && curr !== document.documentElement) {
        const overflowY = window.getComputedStyle(curr).overflowY;
        if (overflowY === 'auto' || overflowY === 'scroll') return curr;
        curr = curr.parentElement;
      }
      return window;
    };

    const target = findScrollableParent(headerRef.current) || window;

    const updateScroll = () => {
      const currentScrollY = target === window ? (window.scrollY || document.documentElement.scrollTop || 0) : target.scrollTop;
      if (Math.abs(currentScrollY - lastScrollY) > 8) {
        if (currentScrollY > lastScrollY && currentScrollY > 40) {
          setScrollDirection('down');
        } else if (currentScrollY < lastScrollY) {
          setScrollDirection('up');
        }
        lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    target.addEventListener('scroll', onScroll, { passive: true });
    return () => target.removeEventListener('scroll', onScroll);
  }, []);

  // En pantallas pequeñas (<1024px), ocultar título al bajar y mostrar al subir
  const isHiddenOnMobile = isMobile && scrollDirection === 'down';

  return (
    <div 
      ref={headerRef}
      className={`page-header-container ${sticky && isHiddenOnMobile ? 'header-hidden-mobile' : 'header-visible'}`}
      style={{
        display: 'flex',
        flexDirection: centered ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: centered ? 'center' : 'space-between',
        width: '100%',
        paddingBottom: '16px',
        marginBottom: '16px',
        borderBottom: '1px solid var(--border-light)',
        boxSizing: 'border-box',
        position: sticky ? 'sticky' : 'relative',
        top: sticky ? 0 : 'auto',
        zIndex: sticky ? 90 : 1,
        background: sticky ? 'var(--bg-primary)' : 'transparent',
        transition: sticky ? 'transform 0.3s ease, opacity 0.3s ease, max-height 0.3s ease, padding 0.3s ease, margin 0.3s ease' : 'none',
        transform: (sticky && isHiddenOnMobile) ? 'translateY(-100%)' : 'translateY(0)',
        opacity: (sticky && isHiddenOnMobile) ? 0 : 1,
        maxHeight: (sticky && isHiddenOnMobile) ? '0px' : 'none',
        overflow: (sticky && isHiddenOnMobile) ? 'hidden' : 'visible',
        pointerEvents: (sticky && isHiddenOnMobile) ? 'none' : 'auto'
      }}
    >
      <div style={{ 
        display: 'flex', 
        flexDirection: centered ? 'column' : 'row', 
        alignItems: 'center', 
        justifyContent: centered ? 'center' : 'flex-start',
        gap: centered ? '16px' : '16px', 
        textAlign: centered ? 'center' : 'left',
        width: '100%' 
      }}>
        {topicId ? (
          <TopicLogo topicId={topicId} size={logoSize || "40px"} alt={title} />
        ) : (
          <Logo height={logoSize || "38px"} alt="NMerge IA - StackUpIA Logo" />
        )}
        {centered && badgeText && (
          <span style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            padding: '4px 14px',
            borderRadius: '20px',
            background: 'var(--badge-bg)',
            color: 'var(--accent-secondary)',
            border: '1px solid var(--border-light)',
            marginTop: '-4px',
            marginBottom: '4px',
            display: 'inline-block'
          }}>
            {badgeText}
          </span>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: centered ? 'center' : 'flex-start', textAlign: centered ? 'center' : 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: centered ? 'center' : 'flex-start', gap: '10px', flexWrap: 'wrap' }}>
            <h1 style={{
              fontSize: centered ? '2.5rem' : '2.25rem',
              fontWeight: '800',
              lineHeight: '1.2',
              margin: 0,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-main, "Outfit", sans-serif)',
              textAlign: centered ? 'center' : 'left'
            }}>
              {title}
            </h1>
            {!centered && badgeText && (
              <span style={{
                fontSize: '0.72rem',
                fontWeight: '700',
                padding: '3px 10px',
                borderRadius: '20px',
                background: 'var(--badge-bg)',
                color: 'var(--accent-secondary)',
                border: '1px solid var(--border-light)'
              }}>
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && (
            <p style={{
              fontSize: '0.95rem',
              color: 'var(--text-secondary)',
              margin: '6px 0 0 0',
              fontWeight: '400',
              fontFamily: '"Outfit", sans-serif',
              textAlign: centered ? 'center' : 'left'
            }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {rightAction && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: centered ? '12px' : '0' }}>
          {rightAction}
        </div>
      )}
    </div>
  );
};

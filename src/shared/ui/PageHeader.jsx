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
export const PageHeader = ({ icon, title, subtitle, badgeText, rightAction, topicId, sticky = true }) => {
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
      className={`page-header-container ${isHiddenOnMobile ? 'header-hidden-mobile' : 'header-visible'}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingBottom: isHiddenOnMobile ? '0px' : '8px',
        marginBottom: isHiddenOnMobile ? '0px' : '10px',
        borderBottom: isHiddenOnMobile ? 'none' : '1px solid var(--border-light)',
        boxSizing: 'border-box',
        position: sticky ? 'sticky' : 'relative',
        top: 0,
        zIndex: 90,
        background: 'var(--bg-primary)',
        transition: 'transform 0.3s ease, opacity 0.3s ease, max-height 0.3s ease, padding 0.3s ease, margin 0.3s ease',
        transform: isHiddenOnMobile ? 'translateY(-100%)' : 'translateY(0)',
        opacity: isHiddenOnMobile ? 0 : 1,
        maxHeight: isHiddenOnMobile ? '0px' : '200px',
        overflow: isHiddenOnMobile ? 'hidden' : 'visible',
        pointerEvents: isHiddenOnMobile ? 'none' : 'auto'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
        {topicId ? (
          <TopicLogo topicId={topicId} size="40px" alt={title} />
        ) : (
          <Logo height="38px" alt="NMerge IA - StackUpIA Logo" />
        )}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: '800',
              lineHeight: '1.2',
              margin: 0,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-main, "Outfit", sans-serif)'
            }}>
              {title}
            </h1>
            {badgeText && (
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
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              margin: '4px 0 0 0',
              fontWeight: '400',
              fontFamily: '"Outfit", sans-serif'
            }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {rightAction && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {rightAction}
        </div>
      )}
    </div>
  );
};

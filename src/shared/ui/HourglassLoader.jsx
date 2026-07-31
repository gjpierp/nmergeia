import React from 'react';
import './HourglassLoader.css';

export const HourglassLoader = ({ message }) => {
  return (
    <div className="hourglass-overlay-backdrop">
      <div className="hourglass-modal-card">
        <div className="hourglass-svg-container">
          <div className="hourglass-spin-wrapper">
            <svg viewBox="0 0 100 120" className="hourglass-svg-base">
              <defs>
                <linearGradient id="sandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="glassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                  <stop offset="50%" stopColor="rgba(6, 182, 212, 0.4)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.7)" />
                </linearGradient>
                
                <clipPath id="topBulbClip">
                  <path d="M 20,20 L 80,20 C 80,40 55,55 50,60 C 45,55 20,40 20,20 Z" />
                </clipPath>
                <clipPath id="bottomBulbClip">
                  <path d="M 50,60 C 55,65 80,80 80,100 L 20,100 C 20,80 45,65 50,60 Z" />
                </clipPath>
              </defs>

              {/* Cristal exterior */}
              <path
                d="M 15,12 L 85,12 M 20,15 L 80,15 C 80,40 55,57 50,60 C 45,57 20,40 20,15 Z M 50,60 C 55,63 80,80 80,105 L 20,105 C 20,80 45,63 50,60 Z M 15,108 L 85,108"
                fill="none"
                stroke="url(#glassGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Arena vaciándose arriba */}
              <g clipPath="url(#topBulbClip)">
                <rect className="sand-top-deplete" x="15" y="15" width="70" height="45" fill="url(#sandGrad)" />
              </g>

              {/* Chorro de arena cayendo grano por grano */}
              <line className="sand-stream-line" x1="50" y1="56" x2="50" y2="100" stroke="url(#sandGrad)" strokeWidth="2.5" strokeDasharray="4,3" />

              {/* Arena llenándose abajo */}
              <g clipPath="url(#bottomBulbClip)">
                <rect className="sand-bottom-fill" x="15" y="60" width="70" height="45" fill="url(#sandGrad)" />
              </g>

              {/* Tapas doradas/cyan del reloj */}
              <rect x="12" y="8" width="76" height="6" rx="3" fill="#06b6d4" />
              <rect x="12" y="106" width="76" height="6" rx="3" fill="#10b981" />
            </svg>
          </div>
        </div>

        <div className="hourglass-loader-info">
          <h3>Comparando Directorios...</h3>
          <p>{message || 'Analizando diferencias grano por grano...'}</p>
        </div>

        <div className="hourglass-loader-bar-bg">
          <div className="hourglass-loader-bar-fill" />
        </div>
      </div>
    </div>
  );
};

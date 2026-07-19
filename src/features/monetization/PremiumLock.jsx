import React from 'react';
import { useMonetizationStore } from './MonetizationStore';

export const PremiumLock = ({ children }) => {
  const isPro = useMonetizationStore(s => s.isPro);
  const openPremiumModal = useMonetizationStore(s => s.openPremiumModal);

  if (isPro) {
    return <>{children}</>;
  }

  // Clona el elemento hijo y sobrescribe su onClick
  return React.cloneElement(React.Children.only(children), {
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      openPremiumModal();
    },
    // Añadimos un pequeño indicador visual de candado
    children: (
      <>
        🔒 {children.props.children}
      </>
    ),
    'data-tooltip': 'Función Pro. Haz clic para desbloquear.'
  });
};

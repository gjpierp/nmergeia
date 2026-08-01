import { Logo } from './Logo.jsx';
import { TopicLogo } from './TopicLogo.jsx';

export const PageHeader = ({ icon, title, subtitle, badgeText, rightAction, topicId }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      paddingBottom: '8px',
      marginBottom: '10px',
      borderBottom: '1px solid var(--border-light)',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
        {topicId ? (
          <TopicLogo topicId={topicId} size="40px" alt={title} />
        ) : (
          <Logo height="38px" alt="NMerge IA - StackUpIA Logo" />
        )}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{
              fontSize: '1.9rem',
              fontWeight: '800',
              lineHeight: '1.2',
              margin: 0,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              fontFamily: '"Outfit", sans-serif'
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

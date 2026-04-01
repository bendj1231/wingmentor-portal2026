import React, { useEffect, useState } from 'react';

interface PortalTransitionProps {
    isActive: boolean;
    onComplete?: () => void;
}

export const PortalTransition: React.FC<PortalTransitionProps> = ({ isActive, onComplete }) => {
    const [shouldRender, setShouldRender] = useState(isActive);

    useEffect(() => {
        if (isActive) {
            setShouldRender(true);

            const timer = setTimeout(() => {
                if (onComplete) onComplete();
            }, 1200); // Animation duration

            return () => clearTimeout(timer);
        } else {
            setShouldRender(false);
        }
    }, [isActive, onComplete]);

    if (!shouldRender) return null;

    return (
        <div className={`zoom-transition-overlay ${isActive ? 'active' : ''}`}>
            <div className="zoom-card-mockup">
                <div className="zoom-card-shimmer" />
                <div className="zoom-card-border" />
            </div>
        </div>
    );
};

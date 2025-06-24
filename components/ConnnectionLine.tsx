// components/ConnectionLine.tsx
import { Circle } from '@/types/diagrams';
import React from 'react';

interface ConnectionLineProps {
    from: number;
    to: number;
    circles: Circle[];
    strokeColor?: string;
    strokeWidth?: number;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({
    from,
    to,
    circles,
    strokeColor = "black",
    strokeWidth = 2
}) => {
    const fromCircle = circles.find((c: Circle) => c.id === from);
    const toCircle = circles.find((c: Circle) => c.id === to);

    if (!fromCircle || !toCircle) return null;

    const centerX1 = fromCircle.x + fromCircle.radius;
    const centerY1 = fromCircle.y + fromCircle.radius;
    const centerX2 = toCircle.x + toCircle.radius;
    const centerY2 = toCircle.y + toCircle.radius;

    const dx = centerX2 - centerX1;
    const dy = centerY2 - centerY1;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Calculate connection points on circle edges
    const x1 = centerX1 + (dx / distance) * fromCircle.radius;
    const y1 = centerY1 + (dy / distance) * fromCircle.radius;
    const x2 = centerX2 - (dx / distance) * toCircle.radius;
    const y2 = centerY2 - (dy / distance) * toCircle.radius;

    const cornerRadius = 10;

    // L-shaped path starting from edge of first circle to edge of second circle
    const path = `M${x1},${y1} 
                  L${x2 - Math.sign(x2 - x1) * cornerRadius},${y1} 
                  Q${x2},${y1} ${x2},${y1 + Math.sign(y2 - y1) * cornerRadius}
                  L${x2},${y2}`;
    const pathId = `connection-${from}-${to}`;
    return (
        <>
            <svg viewBox='0 0 1500 1500'
                className="absolute top-0 left-0 pointer-events-none"
                style={{ width: '100%', height: '100%', zIndex: 1 }}
            >
                <defs>
                    <marker
                        id={pathId}
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                    >
                        <polygon points="0 0, 10 3.5, 0 7" fill={strokeColor} />
                    </marker>
                </defs>
                <path
                    id={pathId}
                    d={path}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <circle
                    r="2"
                    fill="red"
                >
                    <animateMotion
                        dur="3s"
                        calcMode="linear"
                        repeatCount="indefinite"
                        vectorEffect={"non-scaling-stroke"}
                        rotate="auto"
                    >
                        <mpath xlinkHref={'#' + pathId} />
                    </animateMotion>
                </circle>
            </svg>
            {/* Moving circle */}



        </>

    );
};

export default ConnectionLine;
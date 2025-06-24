// components/Circle.tsx
import React from 'react';

interface CircleProps {
    id: number;
    x: number;
    y: number;
    radius: number;
    color?: string;
}

const Circle: React.FC<CircleProps> = ({
    id,
    x,
    y,
    radius,
    color = "blue"
}) => {
    return (
        <div>

            <svg viewBox='0 0 1500 1500'>

                <circle
                    id={`id${id}`}
                    cx={x + radius}
                    cy={y + radius}
                    r={radius}
                    fill={color}
                    stroke={`${color}20`}
                    strokeWidth="2"
                />
            </svg>

        </div >
    );
};

export default Circle;
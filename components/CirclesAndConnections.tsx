import React from "react";
import ConnectionLine from './ConnnectionLine';
import { Circle, Connection } from "@/types/diagrams";


interface ConnectionLineProps {
    connections: Connection[];
    circles: Circle[];
    strokeColor?: string;
    strokeWidth?: number;
}

export const CircleAndConnections: React.FC<ConnectionLineProps> = ({
    connections,
    circles,
    strokeColor,
    strokeWidth
}) => {
    const findCircle = (id: number) => {
        return circles.find(circle => circle.id === id) || { id, x: 0, y: 0, radius: 0, color: "#000" };
    };

    return (
        <>
            <svg viewBox="0 0 1000 1000" style={{ background: "#f9f9f9" }}>
                <g transform="translate(0, 0)">
                    {/* Draw lines */}
                    {connections.map((conn, idx) => {
                        const from = findCircle(conn.from);
                        const to = findCircle(conn.to);
                        const x1 = from.x;
                        const y1 = from.y;
                        const x2 = to.x;
                        const y2 = to.y;
                        const cornerRadius = 20; // Uncomment and adjust if you want to use cornerRadius in a path
                        const fromRadius = (from as Circle).radius ?? (from as any).radius ?? (from as any).r ?? 0;
                        const toRadius = (to as Circle).radius ?? (to as any).radius ?? (to as any).r ?? 0;
                        const y2Adjusted =
                            y2 < y1 ? y2 + toRadius : y2 - toRadius;
                        const x2Adjusted =
                            x2 > x1 ? x1 + fromRadius : x1 - fromRadius;
                        const path = `M${x2Adjusted},${y1} 
                            L${x2 - Math.sign(x2 - x1) * cornerRadius},${y1} 
                            Q${x2},${y1} ${x2},${y1 + Math.sign(y2 - y1) * cornerRadius}
                            L${x2},${y2Adjusted}`;
                        const pathId = `connection-${from.id}-${to.id}`;
                        return (
                            <g key={idx}>
                                <path
                                    key={idx}
                                    id={pathId}
                                    d={path}
                                    stroke={strokeColor}
                                    strokeWidth={strokeWidth}
                                    fill="none"
                                />
                                {pathId && (
                                    <circle r="5" vectorEffect="non-scaling-stroke" fill={to.color}>
                                        <animateMotion repeatCount="indefinite" calcMode="linear" dur={Math.random() * 5 + 2 + "s"} rotate="auto">
                                            <mpath xlinkHref={`#${pathId}`}></mpath>
                                        </animateMotion>
                                    </circle>
                                )}
                            </g>
                        );
                    })}
                    {/* Draw circles and animate along their outgoing connections */}
                    {circles.map((circle) => {
                        // Find the first connection where this circle is the 'from'
                        const outgoingConnection = connections.find(conn => conn.from === circle.id);
                        const pathId = outgoingConnection ? `connection-${circle.id}-${outgoingConnection.to}` : undefined;
                        return (
                            <g key={circle.id}>
                                <circle
                                    id={`circle-${circle.id}`}
                                    cx={circle.x}
                                    cy={circle.y}
                                    r={circle.radius}
                                    fill={circle.color}
                                    fillOpacity={0.2}
                                    stroke={circle.color}
                                    strokeWidth={2} />
                                <text
                                    x={circle.x}
                                    y={circle.y + 3}
                                    textAnchor="middle"
                                    fontSize="8"
                                    fill="#333"
                                >
                                    {"Circle " + circle.id}
                                </text >

                            </g>
                        );
                    })}
                </g>
            </svg >
        </>
    );
};

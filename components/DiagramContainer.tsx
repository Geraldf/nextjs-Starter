// components/DiagramContainer.tsx
import React from 'react';

import { useDiagramData } from '../hooks/useDiagramData';
import ConnectionLine from './ConnnectionLine';
import Circle from './circle';

interface DiagramContainerProps {
    apiEndpoint?: string;
    className?: string;
}

const DiagramContainer: React.FC<DiagramContainerProps> = ({
    apiEndpoint,
    className = "relative w-full h-screen bg-gray-50"
}) => {
    const { data, loading, error, refetch } = useDiagramData(apiEndpoint);

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-screen">
                <div className="text-lg text-red-500 mb-4">{error}</div>
                <button
                    onClick={refetch}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className={className}>
            {/* Render connections */}
            {data.connections.map((connection, index) => (
                <ConnectionLine
                    key={`connection-${connection.from}-${connection.to}-${index}`}
                    from={connection.from}
                    to={connection.to}
                    circles={data.circles}
                />
            ))}

            {/* Render circles */}
            {data.circles.map((circle) => (
                <Circle
                    key={`circle-${circle.id}`}
                    {...circle}
                />
            ))}
        </div>
    );
};

export default DiagramContainer;
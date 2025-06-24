// pages/dynamic-circles.tsx or app/dynamic-circles/page.tsx
'use client'; // If using App Router

import Circle from '@/components/circle';
import { CircleAndConnections } from '@/components/CirclesAndConnections';
import ConnectionLine from '@/components/ConnnectionLine';
import { DiagramData } from '@/types/diagrams';
import React, { useState, useEffect } from 'react';


const DynamicCircles: React.FC = () => {
    const [data, setData] = useState<DiagramData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            // This could come from an API, database, or props
            const componentData: DiagramData = {
                circles: [
                    { id: 1, x: 100, y: 100, radius: 30, color: '#3B82F6' },
                    { id: 2, x: 300, y: 200, radius: 30, color: '#EF4444' },
                    { id: 3, x: 200, y: 300, radius: 30, color: '#10B981' },
                    { id: 4, x: 400, y: 150, radius: 30, color: '#F59E0B' }
                ],
                connections: [
                    { from: 1, to: 4 },
                    { from: 3, to: 2 },
                    { from: 1, to: 3 },
                    { from: 4, to: 2 }
                ]
            };

            setData(componentData);
            setLoading(false);
        } catch (err) {
            setError('Failed to load diagram data');
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center w-full h-screen">
                <div className="text-lg text-red-500">{error}</div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="relative w-full h-screen bg-gray-50 overflow-hidden">
            {/* Render connections first (behind circles) */}
            <CircleAndConnections
                connections={data.connections}
                circles={data.circles}
                strokeColor="#888"
                strokeWidth={2}
            />
        </div>
    );
};

export default DynamicCircles;
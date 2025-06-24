// hooks/useDiagramData.ts
import { DiagramData } from '@/types/diagrams';
import { useState, useEffect } from 'react';


interface UseDiagramDataReturn {
    data: DiagramData | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useDiagramData = (apiEndpoint?: string): UseDiagramDataReturn => {
    const [data, setData] = useState<DiagramData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            let diagramData: DiagramData;

            if (apiEndpoint) {
                const response = await fetch(apiEndpoint);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                diagramData = await response.json();
            } else {
                // Mock data
                diagramData = {
                    circles: [
                        { id: 1, x: 100, y: 100, radius: 30 },
                        { id: 2, x: 300, y: 200, radius: 30 },
                        { id: 3, x: 200, y: 300, radius: 30 },
                        { id: 4, x: 400, y: 150, radius: 30 }
                    ],
                    connections: [
                        { from: 1, to: 4 },
                        { from: 3, to: 2 }
                    ]
                };
            }

            setData(diagramData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [apiEndpoint]);

    return { data, loading, error, refetch: fetchData };
};
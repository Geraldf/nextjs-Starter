'use client';
// components/XmlLoader.tsx


import { useState, useEffect } from 'react';

interface XmlLoaderProps {
    filePath: string;
    onContentLoad?: (content: string) => void;
    onError?: (error: string) => void;
}

export function XmlLoader({ filePath, onContentLoad, onError }: XmlLoaderProps) {
    const [xmlContent, setXmlContent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const loadXmlFile = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await fetch(`/api/xml-loader?file=${encodeURIComponent(filePath)}`);

                if (!response.ok) {
                    throw new Error(`Failed to load XML file: ${response.statusText}`);
                }

                const content = await response.text();
                setXmlContent(content);

                if (onContentLoad) {
                    onContentLoad(content);
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                setError(errorMessage);

                if (onError) {
                    onError(errorMessage);
                }
            } finally {
                setLoading(false);
            }
        };

        if (filePath) {
            loadXmlFile();
        }
    }, [filePath, onContentLoad, onError]);

    if (loading) {
        return <div className="p-4">Loading XML file...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">Error: {error}</div>;
    }

    return (
        <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">XML Content:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
                {xmlContent}
            </pre>
        </div>
    );
}




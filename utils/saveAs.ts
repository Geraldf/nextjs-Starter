// utils/saveAs.ts
export type MimeType =
    | 'text/plain'
    | 'text/csv'
    | 'application/json'
    | 'application/pdf'
    | 'application/octet-stream'
    | string;

export interface SaveAsOptions {
    filename: string;
    mimeType?: MimeType;
}

// Core save function
export function saveAs(data: string | Blob | ArrayBuffer, options: SaveAsOptions): void {
    const { filename, mimeType = 'text/plain' } = options;

    // Create blob based on data type
    let blob: Blob;
    if (data instanceof Blob) {
        blob = data;
    } else if (data instanceof ArrayBuffer) {
        blob = new Blob([data], { type: mimeType });
    } else {
        blob = new Blob([data], { type: mimeType });
    }

    // Create temporary URL for the blob
    const url = URL.createObjectURL(blob);

    // Create temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up URL object
    URL.revokeObjectURL(url);
}

// Specialized functions with type safety
export function saveAsJSON<T>(data: T, filename: string): void {
    const jsonString = JSON.stringify(data, null, 2);
    saveAs(jsonString, {
        filename: filename.endsWith('.json') ? filename : `${filename}.json`,
        mimeType: 'application/json'
    });
}

export function saveAsCSV(data: string, filename: string): void {
    saveAs(data, {
        filename: filename.endsWith('.csv') ? filename : `${filename}.csv`,
        mimeType: 'text/csv'
    });
}

export function saveAsText(data: string, filename: string): void {
    saveAs(data, {
        filename: filename.endsWith('.bpmn') ? filename : `${filename}.bpmn`,
        mimeType: 'text/plain'
    });
}

// Advanced function for saving from API responses
export async function saveFromResponse(
    response: Response,
    filename: string,
    mimeType?: MimeType
): Promise<void> {
    try {
        const blob = await response.blob();
        const detectedMimeType = mimeType || response.headers.get('content-type') || 'application/octet-stream';

        saveAs(blob, {
            filename,
            mimeType: detectedMimeType
        });
    } catch (error) {
        console.error('Error saving file from response:', error);
        throw new Error('Failed to save file from response');
    }
}


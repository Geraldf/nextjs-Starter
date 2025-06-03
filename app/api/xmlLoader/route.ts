// API Route: app/api/xml-loader/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const filePath = searchParams.get('file');

        if (!filePath) {
            return NextResponse.json({ error: 'File path is required' }, { status: 400 });
        }

        // Security: Only allow files from specific directories
        const allowedDirectories = ['public', 'data', 'assets'];
        const isAllowed = allowedDirectories.some(dir =>
            filePath.startsWith(dir) || filePath.startsWith(`/${dir}`)
        );

        if (!isAllowed) {
            return NextResponse.json({ error: 'Access denied to this directory' }, { status: 403 });
        }

        // Construct full path (relative to project root)
        const fullPath = path.join(process.cwd(), filePath);

        // Read the XML file
        const xmlContent = await readFile(fullPath, 'utf-8');

        return new NextResponse(xmlContent, {
            headers: {
                'Content-Type': 'application/xml',
            },
        });
    } catch (error) {
        console.error('Error reading XML file:', error);
        return NextResponse.json(
            { error: 'Failed to read XML file' },
            { status: 500 }
        );
    }
}

//         <pre className="bg-gray-100 p-4 rounded">{xmlContent}</pre>
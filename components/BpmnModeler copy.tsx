'use client';

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';


// Default BPMN diagram XML
const defaultDiagramXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                  targetNamespace="http://bpmn.io/schema/bpmn"
                  id="Definitions_1">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1"/>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds height="36.0" width="36.0" x="173.0" y="102.0"/>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

const BpmnModeler = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const propertiesPanelRef = useRef<HTMLDivElement | null>(null);
    // Import type only for typing, not runtime
    type BpmnModelerType = typeof import('bpmn-js/lib/Modeler')['default'];
    // Use 'any' as fallback if type import fails in runtime
    const modelerRef = useRef<any>(null);
    const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);
    const downloadSvgLinkRef = useRef<HTMLAnchorElement | null>(null);

    const [hasError, setHasError] = useState(false);
    const [hasDiagram, setHasDiagram] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isClient, setIsClient] = useState(false);

    // Debounce helper
    const debounce = (fn: { (): Promise<void>; apply?: any; }, timeout: number | undefined) => {
        let timer: string | number | NodeJS.Timeout | undefined;
        return (...args: any) => {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => fn.apply(this, args), timeout);
        };
    };

    // Set encoded download links
    const setEncoded = (link: { classList: { add: (arg0: string) => void; remove: (arg0: string) => void; }; setAttribute: (arg0: string, arg1: string) => void; } | null, name: string, data: string | number | boolean | null) => {
        if (!link) return;

        if (data !== null && data !== undefined) {
            const encodedData = encodeURIComponent(data);
            link.classList.add('active');
            link.setAttribute('href', `data:application/bpmn20-xml;charset=UTF-8,${encodedData}`);
            link.setAttribute('download', name);
        } else {
            link.classList.remove('active');
        }
    };

    // Export artifacts function
    const exportArtifacts = debounce(async () => {
        if (!modelerRef.current) return;

        try {
            const { svg } = await modelerRef.current.saveSVG();
            setEncoded(downloadSvgLinkRef.current, 'diagram.svg', svg);
        } catch (err) {
            console.error('Error happened saving svg: ', err);
            setEncoded(downloadSvgLinkRef.current, 'diagram.svg', null);
        }

        try {
            const { xml } = await modelerRef.current.saveXML({ format: true });
            setEncoded(downloadLinkRef.current, 'diagram.bpmn', xml);
        } catch (err) {
            console.error('Error happened saving XML: ', err);
            setEncoded(downloadLinkRef.current, 'diagram.bpmn', null);
        }
    }, 500);

    // Open diagram function
    const openDiagram = async (xml: string | ArrayBuffer | null) => {
        if (!modelerRef.current) return;

        try {
            await modelerRef.current.importXML(xml);
            setHasError(false);
            setHasDiagram(true);
            setErrorMessage('');
        } catch (err) {
            setHasError(true);
            setHasDiagram(false);
            setErrorMessage(
                err && typeof err === 'object' && 'message' in err
                    ? String((err as { message: unknown }).message)
                    : 'An unknown error occurred'
            );
            console.error(err);
        }
    };

    // Load diagram from disk function
    const loadDiagramFromDisk = () => {
        // Create a hidden file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.bpmn,.xml';

        // Handle file selection
        fileInput.onchange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (!target.files || target.files.length === 0) return;

            const file = target.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                const xml = e.target && 'result' in e.target ? (e.target as FileReader).result : null;
                openDiagram(xml);
            };

            reader.onerror = () => {
                setHasError(true);
                setErrorMessage('Failed to read the file');
            };

            reader.readAsText(file);
        };

        // Trigger file selection dialog
        fileInput.click();
    };

    // Create new diagram
    const createNewDiagram = () => {
        openDiagram(defaultDiagramXML);
    };

    // Handle file drop
    const handleFileDrop = (e: DragEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!e.dataTransfer) return;

        const files = e.dataTransfer.files;
        const file = files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const xml = e.target && 'result' in e.target ? (e.target as FileReader).result : null;
                openDiagram(xml);
            };
            reader.readAsText(file);
        }
    };

    // Handle drag over
    const handleDragOver = (e: React.DragEvent<HTMLDivElement> | DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'copy';
        }
    };

    // Initialize BPMN modeler
    useEffect(() => {
        setIsClient(true);

        const initializeModeler = async () => {
            // Dynamic import to avoid SSR issues
            const BpmnModelerLib = (await import('bpmn-js/lib/Modeler')).default;

            // Import properties panel modules

            if (canvasRef.current && propertiesPanelRef.current && !modelerRef.current) {
                modelerRef.current = new BpmnModelerLib({
                    container: canvasRef.current,
                    propertiesPanel: {
                        parent: propertiesPanelRef.current
                    },

                });

                // Set up event listener for export
                modelerRef.current.on('commandStack.changed', exportArtifacts);

                // Create initial diagram
                createNewDiagram();
            }
        };

        if (isClient) {
            initializeModeler();
        }

        return () => {
            if (modelerRef.current) {
                modelerRef.current.destroy();
            }
        };
    }, [isClient]);

    // Set up drag and drop
    useEffect(() => {
        if (!containerRef.current || !isClient) return;

        const container = containerRef.current;

        // Check file API availability
        if (!window.FileList || !window.FileReader) {
            alert(
                'Looks like you use an older browser that does not support drag and drop. ' +
                'Try using Chrome, Firefox or the Internet Explorer > 10.'
            );
            return;
        }

        container.addEventListener('dragover', handleDragOver, false);
        container.addEventListener('drop', handleFileDrop, false);

        return () => {
            container.removeEventListener('dragover', handleDragOver, false);
            container.removeEventListener('drop', handleFileDrop, false);
        };
    }, [isClient]);

    if (!isClient) {
        return <div>Loading BPMN Modeler...</div>;
    }

    function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
        throw new Error('Function not implemented.');
    }

    return (
        <>
            {/* CSS Styles */}
            <style jsx global>{`
        @import url('https://unpkg.com/bpmn-js@18.6.2/dist/assets/diagram-js.css');
        @import url('https://unpkg.com/bpmn-js@18.6.2/dist/assets/bpmn-js.css');
        @import url('https://unpkg.com/bpmn-js@18.6.2/dist/assets/bpmn-font/css/bpmn-embedded.css');
        @import url('https://unpkg.com/bpmn-js-properties-panel@5.0.0/dist/assets/properties-panel.css');
        
        .modeler-container {
          display: flex;
          height: 600px;
          width: 100%;
        }
        
        .drop-zone {
          position: relative;
          border: 2px dashed #ccc;
          border-radius: 10px;
          flex: 1;
          text-align: center;
          color: #999;
          padding: 20px;
        }
        
        .drop-zone.with-diagram {
          border: 2px solid #52b415;
        }
        
        .drop-zone.with-error {
          border: 2px solid #cc0000;
        }
        
        .canvas {
          width: 100%;
          height: 100%;
        }
        
        .properties-panel-container {
          width: 300px;
          min-width: 300px;
          border-left: 1px solid #ccc;
          background: #f8f8f8;
          overflow-y: auto;
        }
        
        .properties-panel {
          height: 100%;
          padding: 10px;
        }
        
        .buttons {
          margin: 20px 0;
        }
        
        .buttons a {
          margin-right: 10px;
          padding: 10px 15px;
          background: #f0f0f0;
          text-decoration: none;
          border-radius: 5px;
          color: #333;
        }
        
        .buttons a.active {
          background: #52b415;
          color: white;
        }
        
        .buttons a:not(.active) {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .error {
          color: #cc0000;
          background: #ffe6e6;
          padding: 10px;
          border-radius: 5px;
          margin: 10px 0;
        }
        
        .instructions {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        
        /* Properties panel specific styles */
        .bio-properties-panel-group {
          margin-bottom: 15px;
        }
        
        .bio-properties-panel-group-header {
          font-weight: bold;
          margin-bottom: 10px;
          padding: 5px 0;
          border-bottom: 1px solid #ddd;
        }
        
        .bio-properties-panel-entry {
          margin-bottom: 10px;
        }
        
        .bio-properties-panel-label {
          display: block;
          font-weight: 500;
          margin-bottom: 5px;
          color: #333;
        }
        
        .bio-properties-panel-textfield,
        .bio-properties-panel-textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .bio-properties-panel-textarea {
          min-height: 60px;
          resize: vertical;
        }
        
        .bio-properties-panel-checkbox {
          margin-right: 8px;
        }
        
        .bio-properties-panel-select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          background: white;
        }
      `}</style>

            <div>
                <div className="grid grid-cols-4 ">
                    <Button
                        onClick={createNewDiagram}
                        style={{
                            padding: '10px 15px',
                            marginRight: '10px',
                            background: '#52b415',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}>
                        Create New Diagram
                    </Button>

                    <Button asChild className='  bg-cyan-500 ' >
                        <Input
                            type="file"
                            accept=".bpmn"
                            id="fileInput"
                            onChange={handleFileChange}


                        />
                    </Button>

                    <a
                        ref={downloadLinkRef}
                        href="#"
                        onClick={(e) => {
                            const target = e.target as HTMLElement;
                            if (!target.classList.contains('active')) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                        }}
                    >
                        Download BPMN
                    </a>
                    <a
                        ref={downloadSvgLinkRef}
                        href="#"
                        onClick={(e) => {
                            const target = e.target as HTMLElement;
                            if (!target.classList.contains('active')) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                        }}
                    >
                        Download SVG
                    </a>
                </div>

                <div className="modeler-container">

                    <div
                        ref={containerRef}
                        className={`drop-zone ${hasDiagram ? 'with-diagram' : ''} ${hasError ? 'with-error' : ''}`}
                    >
                        <div ref={canvasRef} className="canvas" />

                        {!hasDiagram && !hasError && (
                            <div className="instructions">
                                <div>Drop BPMN file here or click "Create New Diagram"</div>
                            </div>
                        )}

                        {hasError && (
                            <div className="error">
                                <div>Failed to open diagram</div>
                                <pre>{errorMessage}</pre>
                            </div>
                        )}
                    </div>
                    <div className="properties-panel-container">
                        <div className="properties-panel" ref={propertiesPanelRef}>
                            {/* Properties panel will be rendered here by bpmn-js-properties-panel */}
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};

export default BpmnModeler;
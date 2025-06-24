"use client"

import React, { useRef, useEffect, useState, use } from 'react';
import BpmnModelerLib from 'bpmn-js/lib/Modeler';
import { useBpmnPropertyPanel } from '@/hooks/useBpmnPropertyPanel';
import { BpmnEventBus, BpmnModeling } from '@/types/bpmn';
import { PropertyPanel } from './property-panel/PropertyPanel';
import { Button } from './ui/button';
import { useBpmnModeler } from '@/hooks/useBpmnModeler';
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import { FilePlus2 } from 'lucide-react';
import TokenSimulationModule from 'bpmn-js-token-simulation';

interface BpmnModelerWithCustomPanelProps {
    onReady?: (modeler: BpmnModelerLib) => void;
}

export const BpmnModelerWithCustomPanel: React.FC<BpmnModelerWithCustomPanelProps> = ({
    onReady
}) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const modelerRef = useRef<BpmnModelerLib | null>(null);
    const [modeler, setModeler] = useState<BpmnModelerLib | null>(null);
    const [hasError, setHasError] = useState(false);
    const [hasDiagram, setHasDiagram] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isClient, setIsClient] = useState(false);
    const [isActive, setIsActive] = useState(false);


    // Custom property panel hook
    const { selectedElement, modeling, updateProperties } = useBpmnPropertyPanel(
        modeler?.get('eventBus') as BpmnEventBus,
        modeler?.get('modeling') as BpmnModeling
    );

    // modeling hooks
    const { createNewDiagram, setRef, saveDiagramToDisk, loadDiagramFromDisk } = useBpmnModeler();

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


    const openDiagram = async (xml: string | ArrayBuffer | null) => {
        if (!modelerRef.current) return;

        try {
            if (typeof xml === 'string') {
                await modelerRef.current.importXML(xml);
            } else {
                console.error('Invalid XML format. Expected a string.');
            }
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

    useEffect(() => {
        if (canvasRef.current && !modelerRef.current) {
            // Initialize modeler WITHOUT the default properties panel
            modelerRef.current = new BpmnModelerLib({
                container: canvasRef.current,
                // Remove propertiesPanel configuration
                additionalModules: [
                    // TokenSimulationModule, // Add token simulation module
                ],

            });
            openDiagram(defaultDiagramXML);
            setModeler(modelerRef.current);
            onReady?.(modelerRef.current);
            setRef(modelerRef.current);
        }

        return () => {
            if (modelerRef.current) {
                modelerRef.current.destroy();
                modelerRef.current = null;
            }
        };
    }, [onReady]);


    return (
        <>
            <div className="flex h-screen">

                {/* BPMN Canvas */}
                <div className="flex-1">
                    <div ref={canvasRef} className="h-[90%] w-full" />
                    <Button
                        className="m-2 bg-amber-300 hover:bg-amber-400 text-black"
                        onClick={() => {
                            if (modeler) {
                                createNewDiagram();
                            } else {
                                console.error('Modeler is not initialized');
                            }
                        }
                        }
                    >
                        <FilePlus2 />Create New Diagram
                    </Button>
                    <Button
                        className="m-2 bg-blue-300 hover:bg-blue-400 text-black"
                        onClick={() => {
                            if (modeler) {
                                saveDiagramToDisk();
                            } else {
                                console.error('Modeler is not initialized');
                            }
                        }
                        }
                    >
                        <FilePlus2 />Save Diagram
                    </Button>
                    <Button
                        className="m-2 bg-green-300 hover:bg-green-400 text-black"
                        onClick={() => {
                            if (modeler) {
                                loadDiagramFromDisk();
                            } else {
                                console.error('Modeler is not initialized');
                            }
                        }
                        }
                    >
                        <FilePlus2 />Load Diagram
                    </Button>
                </div>
                {/* Custom Property Panel */}
                <div className="w-80 border-l h-full">
                    {modeler && (
                        <PropertyPanel
                            element={selectedElement}
                            modeling={modeling}
                            onUpdateProperties={updateProperties}
                        />
                    )}
                </div>

            </div >
        </>
    );
};


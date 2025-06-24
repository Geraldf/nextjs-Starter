"use client";
import { useRef, useState } from "react";
import { useFilePicker } from 'use-file-picker';

// Add type declaration for showSaveFilePicker
declare global {
    interface Window {
        // Add type definition for SaveFilePickerOptions
        showSaveFilePicker?: (options?: {
            suggestedName?: string;
            types?: Array<{
                description?: string;
                accept?: Record<string, string[]>;
            }>;
            excludeAcceptAllOption?: boolean;
        }) => Promise<FileSystemFileHandle>;
    }
}
import BpmnModelerLib from 'bpmn-js/lib/Modeler';
import { saveAsText } from "@/utils/saveAs";

export const useBpmnModeler = () => {
    const [modeler, setModeler] = useState<BpmnModelerLib | null>(null);
    const [hasDiagram, setHasDiagram] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isClient, setIsClient] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const modelerRef = useRef<BpmnModelerLib | null>(null);
    const [cachedFileHandle, setCachedFileHandle] = useState<FileSystemFileHandle | undefined>();
    const [showSaveAlert, setShowSaveAlert] = useState<boolean>(false);


    const setRef = (ref: BpmnModelerLib | null) => {
        modelerRef.current = ref;
        setModeler(ref);
        if (ref) {
            setIsClient(true);
            setIsActive(true);
            // Optionally, you can call onReady callback if provided
            // onReady?.(ref);
        } else {
            setIsClient(false);
            setIsActive(false);
        }
    };

    // Open diagram function
    const openDiagram = async (xml: string | ArrayBuffer | null) => {
        if (!modelerRef.current) return;

        try {
            if (typeof xml === 'string') {
                await modelerRef.current.importXML(xml);
            } else {
                throw new Error('Invalid XML format: Expected a string.');
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
    // Save diagram XML to disk
    const saveDiagramToDisk = async () => {
        if (!modelerRef.current) {
            console.error("Modeler is not initialized.");
            return;
        }
        try {
            const { xml } = await modelerRef.current.saveXML({ format: true });
            if (xml) {
                await saveAsText(xml, 'sample.bpmn');
            } else {
                console.error("Failed to save: XML is undefined.");
            }

        } catch (err) {
            console.error("Error saving diagram:", err);
            setHasError(true);
            setErrorMessage(
                err && typeof err === 'object' && 'message' in err
                    ? String((err as { message: unknown }).message)
                    : 'An unknown error occurred while saving the diagram'
            );
        }
    };

    async function loadDiagramFromDisk() {
        if (!modelerRef.current) {
            console.error('Modeler is not initialized');
            return;
        }

        try {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.bpmn,.xml';
            fileInput.onchange = async (event) => {
                const file = (event.target as HTMLInputElement)?.files?.[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        const xml = e.target?.result;
                        if (typeof xml === 'string') {
                            await openDiagram(xml);
                        } else {
                            console.error('Invalid file content. Expected a string.');
                        }
                    };
                    reader.readAsText(file);
                }
            };
            fileInput.click();
        } catch (err) {
            console.error('Failed to load diagram from disk:', err);
        }
    }

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

    // Create new diagram
    const createNewDiagram = () => {
        openDiagram(defaultDiagramXML);
        setHasDiagram(true);
        setHasError(false);
        setErrorMessage('');
        setIsActive(false);
    };
    return {
        modeler,
        setModeler,
        modelerRef,
        hasDiagram,
        hasError,
        errorMessage,
        isClient,
        isActive,
        setIsClient,
        setIsActive,
        openDiagram,
        createNewDiagram,
        setRef,
        saveDiagramToDisk,
        loadDiagramFromDisk
    };
};
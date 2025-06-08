"useClient"
// hooks/useBpmnPropertyPanel.ts
import { useState, useEffect, useCallback } from 'react';
import { BpmnElement, BpmnModeling, BpmnEventBus } from '../types/bpmn';

export const useBpmnPropertyPanel = (
    eventBus: BpmnEventBus,
    modeling: BpmnModeling
) => {
    const [selectedElement, setSelectedElement] = useState<BpmnElement | null>(null);

    const handleSelectionChanged = useCallback((context: any) => {
        const { newSelection } = context;
        if (newSelection.length === 1) {
            setSelectedElement(newSelection[0]);
        } else {
            setSelectedElement(null);
        }
    }, []);

    const handleElementChanged = useCallback((context: any) => {
        const { element } = context;
        if (element === selectedElement) {
            // Trigger re-render by updating the selected element
            setSelectedElement({ ...element });
        }
    }, [selectedElement]);

    useEffect(() => {
        if (!eventBus) return;
        eventBus.on('selection.changed', handleSelectionChanged);
        eventBus.on('element.changed', handleElementChanged);

        return () => {
            eventBus.off('selection.changed', handleSelectionChanged);
            eventBus.off('element.changed', handleElementChanged);
        };
    }, [eventBus, handleSelectionChanged, handleElementChanged]);

    const updateProperties = useCallback((properties: Record<string, any>) => {
        console.log('Properties updated:', properties);
    }, []);

    return {
        selectedElement,
        modeling,
        updateProperties
    };
};
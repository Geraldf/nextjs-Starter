// types/bpmn.ts
export interface BpmnElement {
    id: string;
    type: string;
    businessObject: any;
    parent?: BpmnElement;
}

export interface BpmnModeling {
    updateProperties: (element: BpmnElement, properties: Record<string, any>) => void;
    updateLabel: (element: BpmnElement, newLabel: string) => void;
}

export interface BpmnEventBus {
    on: (event: string, callback: (context: any) => void) => void;
    off: (event: string, callback: (context: any) => void) => void;
}
'use client';
import BpmnModeler from '@/components/BpmnModeler';
import { BpmnModelerWithCustomPanel } from '@/components/BpmnModelerWithCustomPanel';
import React from 'react';




const BpmnEditorPage: React.FC = () => {
    return (
        <div className="bpmn-editor-container">
            <div className="editor-content">
                {/* BPMN editor content will go here */}
                <BpmnModelerWithCustomPanel />
            </div>
        </div>
    );
};

export default BpmnEditorPage;
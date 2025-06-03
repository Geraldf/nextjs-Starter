'use client';
import BpmnModeler from '@/components/BpmnModeler';
import React from 'react';




const BpmnEditorPage: React.FC = () => {
    return (
        <div className="bpmn-editor-container">

            <div className="editor-content">
                {/* BPMN editor content will go here */}
                <BpmnModeler />
            </div>
        </div>
    );
};

export default BpmnEditorPage;
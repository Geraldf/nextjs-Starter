"use client";
// components/property-panel/PropertyPanel.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BpmnElement, BpmnModeling } from '../../types/bpmn';
import { FormProperties } from './FormProperties';
import { ListenerProperties } from './ListenerProperties';
import { GeneralProperties } from './GeneralProperties';

interface PropertyPanelProps {
    element: BpmnElement | null;
    modeling: BpmnModeling;
    onUpdateProperties: (properties: Record<string, any>) => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
    element,
    modeling,
    onUpdateProperties
}) => {
    const [properties, setProperties] = useState<Record<string, any>>({});

    useEffect(() => {
        if (element?.businessObject) {
            setProperties({
                id: element.id,
                name: element.businessObject.name || '',
                documentation: element.businessObject.documentation?.[0]?.text || '',
                type: element.type,
                ...element.businessObject.$attrs
            });
        }
    }, [element]);

    const handlePropertyChange = (key: string, value: any) => {
        const updatedProperties = { ...properties, [key]: value };
        setProperties(updatedProperties);

        if (element) {
            const updateData: Record<string, any> = {};
            if (key === 'name') {
                modeling.updateLabel(element, value);
            } else {
                updateData[key] = value;
                modeling.updateProperties(element, updateData);
            }
            onUpdateProperties(updatedProperties);
        }
    };
    switch (element?.type) {
        case 'bpmn:ServiceTask':
            properties.implementation = properties.implementation || 'delegateExpression';
            properties.showForm = false; // Default to false for other tasks
            break;
        case 'bpmn:UserTask':

            properties.formKey = properties.formKey || '';
            properties.assignee = properties.assignee || '';
            properties.candidateUsers = properties.candidateUsers || [];
            properties.candidateGroups = properties.candidateGroups || [];
            properties.showForm = true; // Default to true for UserTask
            break;
        default:
            properties.showForm = false; // Default to false for other tasks

    }

    if (!element) {
        return (
            <Card className="w-80 h-full">
                <CardHeader>
                    <CardTitle>Properties</CardTitle>
                    <CardDescription>Select an element to view properties</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="w-80 h-full overflow-auto">
            <CardHeader>
                <CardTitle>Properties</CardTitle>
                <CardDescription>Element: {element.type}</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="general">General</TabsTrigger>
                        {properties.showForm && <TabsTrigger value="forms">Forms</TabsTrigger>}
                        <TabsTrigger value="listeners">Listeners</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-4">
                        <GeneralProperties
                            properties={properties}
                            onPropertyChange={handlePropertyChange}
                        />
                    </TabsContent>

                    <TabsContent value="forms" className="space-y-4">
                        <FormProperties
                            properties={properties}
                            onPropertyChange={handlePropertyChange}
                        />
                    </TabsContent>

                    <TabsContent value="listeners" className="space-y-4">
                        <ListenerProperties
                            properties={properties}
                            onPropertyChange={handlePropertyChange}
                        />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};
"use client";

import { useState } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { GeneralPropertiesProps } from "./GeneralProperties";

// components/property-panel/ListenerProperties.tsx
export const ListenerProperties: React.FC<GeneralPropertiesProps> = ({
    properties,
    onPropertyChange
}) => {
    const [listeners, setListeners] = useState<Array<{
        id: string;
        event: string;
        type: string;
        value: string;
    }>>([]);

    const addListener = () => {
        const newListener = {
            id: `listener_${Date.now()}`,
            event: 'start',
            type: 'class',
            value: ''
        };
        setListeners([...listeners, newListener]);
    };

    const updateListener = (index: number, listener: any) => {
        const updatedListeners = [...listeners];
        updatedListeners[index] = listener;
        setListeners(updatedListeners);
        onPropertyChange('executionListeners', updatedListeners);
    };

    const removeListener = (index: number) => {
        const updatedListeners = listeners.filter((_, i) => i !== index);
        setListeners(updatedListeners);
        onPropertyChange('executionListeners', updatedListeners);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label>Execution Listeners</Label>
                <Button onClick={addListener} size="sm">
                    Add Listener
                </Button>
            </div>

            {listeners.map((listener, index) => (
                <Card key={listener.id} className="p-4">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Listener {index + 1}</Label>
                            <Button
                                onClick={() => removeListener(index)}
                                variant="destructive"
                                size="sm"
                            >
                                Remove
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label htmlFor={`listener-event-${index}`}>Event</Label>
                                <Select
                                    value={listener.event}
                                    onValueChange={(value) => updateListener(index, { ...listener, event: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="start">Start</SelectItem>
                                        <SelectItem value="end">End</SelectItem>
                                        <SelectItem value="take">Take</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor={`listener-type-${index}`}>Type</Label>
                                <Select
                                    value={listener.type}
                                    onValueChange={(value) => updateListener(index, { ...listener, type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="class">Java Class</SelectItem>
                                        <SelectItem value="expression">Expression</SelectItem>
                                        <SelectItem value="delegateExpression">Delegate Expression</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor={`listener-value-${index}`}>Value</Label>
                            <Input
                                id={`listener-value-${index}`}
                                value={listener.value}
                                onChange={(e) => updateListener(index, { ...listener, value: e.target.value })}
                                placeholder="Enter class name, expression, or delegate expression"
                            />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};
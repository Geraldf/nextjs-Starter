"use client";

import { useState } from "react";
import { Label } from "../ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";

// components/property-panel/FormProperties.tsx
const FormProperties: React.FC<GeneralPropertiesProps> = ({
    properties,
    onPropertyChange
}) => {
    const [formFields, setFormFields] = useState<Array<{
        id: string;
        label: string;
        type: string;
        required: boolean;
    }>>([]);

    const addFormField = () => {
        const newField = {
            id: `field_${Date.now()}`,
            label: '',
            type: 'string',
            required: false
        };
        setFormFields([...formFields, newField]);
    };

    const updateFormField = (index: number, field: any) => {
        const updatedFields = [...formFields];
        updatedFields[index] = field;
        setFormFields(updatedFields);
        onPropertyChange('formFields', updatedFields);
    };

    const removeFormField = (index: number) => {
        const updatedFields = formFields.filter((_, i) => i !== index);
        setFormFields(updatedFields);
        onPropertyChange('formFields', updatedFields);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label>Form Fields</Label>
                <Button onClick={addFormField} size="sm">
                    Add Field
                </Button>
            </div>

            {formFields.map((field, index) => (
                <Card key={field.id} className="p-4">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Field {index + 1}</Label>
                            <Button
                                onClick={() => removeFormField(index)}
                                variant="destructive"
                                size="sm"
                            >
                                Remove
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label htmlFor={`field-id-${index}`}>ID</Label>
                                <Input
                                    id={`field-id-${index}`}
                                    value={field.id}
                                    onChange={(e) => updateFormField(index, { ...field, id: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor={`field-label-${index}`}>Label</Label>
                                <Input
                                    id={`field-label-${index}`}
                                    value={field.label}
                                    onChange={(e) => updateFormField(index, { ...field, label: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label htmlFor={`field-type-${index}`}>Type</Label>
                                <Select
                                    value={field.type}
                                    onValueChange={(value) => updateFormField(index, { ...field, type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="string">String</SelectItem>
                                        <SelectItem value="long">Long</SelectItem>
                                        <SelectItem value="boolean">Boolean</SelectItem>
                                        <SelectItem value="date">Date</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2 pt-6">
                                <Switch
                                    checked={field.required}
                                    onCheckedChange={(checked) => updateFormField(index, { ...field, required: checked })}
                                />
                                <Label>Required</Label>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

// components/property-panel/GeneralProperties.tsx
interface GeneralPropertiesProps {
    properties: Record<string, any>;
    onPropertyChange: (key: string, value: any) => void;
}

export const GeneralProperties: React.FC<GeneralPropertiesProps> = ({
    properties,
    onPropertyChange
}) => {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="element-id">ID</Label>
                <Input
                    id="element-id"
                    value={properties.id || ''}
                    onChange={(e) => onPropertyChange('id', e.target.value)}
                    placeholder="Element ID"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="element-name">Name</Label>
                <Input
                    id="element-name"
                    value={properties.name || ''}
                    onChange={(e) => onPropertyChange('name', e.target.value)}
                    placeholder="Element name"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="element-documentation">Documentation</Label>
                <Textarea
                    id="element-documentation"
                    value={properties.documentation || ''}
                    onChange={(e) => onPropertyChange('documentation', e.target.value)}
                    placeholder="Element documentation"
                    className="min-h-[100px]"
                />
            </div>

            {properties.type === 'bpmn:ServiceTask' && (
                <div className="space-y-2">
                    <Label htmlFor="implementation">Implementation</Label>
                    <Select
                        value={properties.implementation || 'delegateExpression'}
                        onValueChange={(value) => onPropertyChange('implementation', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select implementation" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="class">Java Class</SelectItem>
                            <SelectItem value="expression">Expression</SelectItem>
                            <SelectItem value="delegateExpression">Delegate Expression</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
    );
};
// components/ComponentFactory.tsx
import React from 'react';

import ConnectionLine from './ConnnectionLine';
import { Circle, Connection } from '@/types/diagrams';

type ComponentType = 'circle' | 'connection';

interface BaseComponent {
    id: string;
    type: ComponentType;
}

interface CircleComponent extends BaseComponent, Circle {
    type: 'circle';
}

interface ConnectionComponent extends BaseComponent, Connection {
    type: 'connection';
    circles: Circle[];
}

type DiagramComponent = CircleComponent | ConnectionComponent;

interface ComponentFactoryProps {
    components: DiagramComponent[];
}

const ComponentFactory: React.FC<ComponentFactoryProps> = ({ components }) => {
    const renderComponent = (component: DiagramComponent): React.ReactElement | null => {
        switch (component.type) {
            case 'circle':
                return (
                    <Circle
                        key={component.id}
                        id={component.id}
                        x={component.x}
                        y={component.y}
                        radius={component.radius}
                        color={component.color}
                    />
                );
            case 'connection':
                return (
                    <ConnectionLine
                        key={component.id}
                        from={component.from}
                        to={component.to}
                        circles={component.circles}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="relative w-full h-screen">
            {components.map(renderComponent)}
        </div>
    );
};

export default ComponentFactory;
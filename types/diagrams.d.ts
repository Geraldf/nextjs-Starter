// types/diagram.ts
export interface Circle {
    id: number;
    x: number;
    y: number;
    radius: number;
    color?: string;
}

export interface Connection {
    from: number;
    to: number;
}

export interface DiagramData {
    circles: Circle[];
    connections: Connection[];
}

export interface ComponentData {
    circles: Circle[];
    connections: Connection[];
}
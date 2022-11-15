export declare function getControlPosition(e: MouseEvent): Point;
export interface Point {
    x: number;
    y: number;
}
export declare function offsetXYFromParentOf(evt: MouseEvent): Point;
export interface DraggableCoreData {
    deltaX: number;
    deltaY: number;
    lastX: number;
    lastY: number;
    x: number;
    y: number;
}
export declare function createCoreData(lastX: number, lastY: number, x: number, y: number): DraggableCoreData;

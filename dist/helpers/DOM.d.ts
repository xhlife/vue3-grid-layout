export type Direction = "ltr" | "rtl" | "auto";
export declare function getDocumentDir(): Direction | string;
export declare function setDocumentDir(dir: Direction): boolean;
export declare function addWindowEventListener(event: string, callback: () => any): boolean;
export declare function removeWindowEventListener(event: string, callback: () => any): void;
export interface EventsData {
    eventType: string | symbol;
    i: string | number;
    x: number;
    y: number;
    h: number;
    w: number;
}

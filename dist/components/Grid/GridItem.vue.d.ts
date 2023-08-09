declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<{
    x: {
        type: import("vue").PropType<number>;
        required: true;
    };
    y: {
        type: import("vue").PropType<number>;
        required: true;
    };
    w: {
        type: import("vue").PropType<number>;
        required: true;
    };
    h: {
        type: import("vue").PropType<number>;
        required: true;
    };
    i: {
        type: import("vue").PropType<string | number>;
        required: true;
    };
    isDraggable: {
        type: import("vue").PropType<boolean | null>;
        default: null;
    };
    isResizable: {
        type: import("vue").PropType<boolean | null>;
        default: null;
    };
    isBounded: {
        type: import("vue").PropType<boolean | null>;
        default: null;
    };
    static: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    minH: {
        type: import("vue").PropType<number>;
        default: number;
    };
    minW: {
        type: import("vue").PropType<number>;
        default: number;
    };
    maxH: {
        type: import("vue").PropType<number>;
        default: number;
    };
    maxW: {
        type: import("vue").PropType<number>;
        default: number;
    };
    dragIgnoreFrom: {
        type: import("vue").PropType<string>;
        default: string;
    };
    dragAllowFrom: {
        type: import("vue").PropType<string | null>;
        default: null;
    };
    resizeIgnoreFrom: {
        type: import("vue").PropType<string>;
        default: string;
    };
    preserveAspectRatio: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    dragOption: {
        type: import("vue").PropType<{
            [key: string]: any;
        }>;
        default: () => {};
    };
    resizeOption: {
        type: import("vue").PropType<{
            [key: string]: any;
        }>;
        default: () => {};
    };
}, {
    x: number;
    y: number;
    w: number;
    h: number;
    i: string | number;
    isDraggable: boolean | null;
    isResizable: boolean | null;
    isBounded: boolean | null;
    static: boolean;
    minH: number;
    minW: number;
    maxH: number;
    maxW: number;
    dragIgnoreFrom: string;
    dragAllowFrom: string | null;
    resizeIgnoreFrom: string;
    preserveAspectRatio: boolean;
    dragOption: {
        [key: string]: any;
    };
    resizeOption: {
        [key: string]: any;
    };
    autoSize: () => void;
    calcXY: (top: number, left: number) => {
        x: number;
        y: number;
    };
    dragging: import("vue").Ref<{
        left?: number | undefined;
        right?: number | undefined;
        top: number;
        width: number;
        height: number;
    } | null>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "container-resized": (i: string | number, h: number, w: number, height: number, width: number) => void;
    resize: (i: string | number, h: number, w: number, height: number, width: number) => void;
    resized: (i: string | number, h: number, w: number, height: number, width: number) => void;
    move: (i: string | number, x: number, y: number) => void;
    moved: (i: string | number, x: number, y: number) => void;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    x: {
        type: import("vue").PropType<number>;
        required: true;
    };
    y: {
        type: import("vue").PropType<number>;
        required: true;
    };
    w: {
        type: import("vue").PropType<number>;
        required: true;
    };
    h: {
        type: import("vue").PropType<number>;
        required: true;
    };
    i: {
        type: import("vue").PropType<string | number>;
        required: true;
    };
    isDraggable: {
        type: import("vue").PropType<boolean | null>;
        default: null;
    };
    isResizable: {
        type: import("vue").PropType<boolean | null>;
        default: null;
    };
    isBounded: {
        type: import("vue").PropType<boolean | null>;
        default: null;
    };
    static: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    minH: {
        type: import("vue").PropType<number>;
        default: number;
    };
    minW: {
        type: import("vue").PropType<number>;
        default: number;
    };
    maxH: {
        type: import("vue").PropType<number>;
        default: number;
    };
    maxW: {
        type: import("vue").PropType<number>;
        default: number;
    };
    dragIgnoreFrom: {
        type: import("vue").PropType<string>;
        default: string;
    };
    dragAllowFrom: {
        type: import("vue").PropType<string | null>;
        default: null;
    };
    resizeIgnoreFrom: {
        type: import("vue").PropType<string>;
        default: string;
    };
    preserveAspectRatio: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    dragOption: {
        type: import("vue").PropType<{
            [key: string]: any;
        }>;
        default: () => {};
    };
    resizeOption: {
        type: import("vue").PropType<{
            [key: string]: any;
        }>;
        default: () => {};
    };
}>> & {
    onResize?: ((i: string | number, h: number, w: number, height: number, width: number) => any) | undefined;
    "onContainer-resized"?: ((i: string | number, h: number, w: number, height: number, width: number) => any) | undefined;
    onResized?: ((i: string | number, h: number, w: number, height: number, width: number) => any) | undefined;
    onMove?: ((i: string | number, x: number, y: number) => any) | undefined;
    onMoved?: ((i: string | number, x: number, y: number) => any) | undefined;
}, {
    isDraggable: boolean | null;
    isResizable: boolean | null;
    isBounded: boolean | null;
    static: boolean;
    minH: number;
    minW: number;
    maxH: number;
    maxW: number;
    dragIgnoreFrom: string;
    dragAllowFrom: string | null;
    resizeIgnoreFrom: string;
    preserveAspectRatio: boolean;
    dragOption: {
        [key: string]: any;
    };
    resizeOption: {
        [key: string]: any;
    };
}, {}>, {
    default?(_: {
        style: any;
    }): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};

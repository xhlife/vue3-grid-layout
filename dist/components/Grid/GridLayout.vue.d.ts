import { Emitter, EventType } from "mitt";
import elementResizeDetectorMaker from "element-resize-detector";
import { Layout, LayoutItem } from '../../helpers/utils';
import { EventsData } from '../../helpers/DOM';
export interface Placeholder {
    x: number;
    y: number;
    w: number;
    h: number;
    i: number | string;
}
export interface Props {
    autoSize?: boolean;
    colNum?: number;
    rowHeight?: number;
    maxRows?: number;
    margin?: Array<number>;
    isDraggable?: boolean;
    isResizable?: boolean;
    isMirrored?: boolean;
    isBounded?: boolean;
    useCssTransforms?: boolean;
    verticalCompact?: boolean;
    restoreOnDrag?: boolean;
    layout: Layout;
    responsive?: boolean;
    responsiveLayouts?: {
        [key: string]: any;
    };
    transformScale?: number;
    breakpoints?: {
        lg: number;
        md: number;
        sm: number;
        xs: number;
        xxs: number;
    };
    cols?: {
        lg: number;
        md: number;
        sm: number;
        xs: number;
        xxs: number;
    };
    preventCollision?: boolean;
    useStyleCursor?: boolean;
}
export interface LayoutData {
    width: number | null;
    mergeStyle: {
        [key: string]: string;
    };
    lastLayoutLength: number;
    isDragging: boolean;
    placeholder: Placeholder;
    layouts: {
        [key: string]: Layout | any;
    };
    lastBreakpoint: string | null;
    originalLayout: Layout | null;
    erd: elementResizeDetectorMaker.Erd | null;
    positionsBeforeDrag: {
        [key: string]: string;
    };
    this$refsLayout: HTMLElement;
}
declare const _sfc_main: import("vue").DefineComponent<{
    autoSize: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    colNum: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    rowHeight: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    maxRows: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    margin: {
        type: ArrayConstructor;
        required: false;
        default: () => number[];
    };
    isDraggable: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    isResizable: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    isMirrored: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    isBounded: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    useCssTransforms: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    verticalCompact: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    restoreOnDrag: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    layout: {
        type: null;
        required: true;
    };
    responsive: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    responsiveLayouts: {
        type: ObjectConstructor;
        required: false;
        default: () => {};
    };
    transformScale: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    breakpoints: {
        type: ObjectConstructor;
        required: false;
        default: () => {
            lg: number;
            md: number;
            sm: number;
            xs: number;
            xxs: number;
        };
    };
    cols: {
        type: ObjectConstructor;
        required: false;
        default: () => {
            lg: number;
            md: number;
            sm: number;
            xs: number;
            xxs: number;
        };
    };
    preventCollision: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    useStyleCursor: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}, {
    props: any;
    width: import("vue").Ref<number | null>;
    mergeStyle: import("vue").Ref<{
        [key: string]: string;
    }>;
    lastLayoutLength: import("vue").Ref<number>;
    isDragging: import("vue").Ref<boolean>;
    placeholder: import("vue").Ref<{
        x: number;
        y: number;
        w: number;
        h: number;
        i: number | string;
    }>;
    layouts: import("vue").Ref<{
        [key: string]: any;
    }>;
    lastBreakpoint: import("vue").Ref<string | null>;
    originalLayout: import("vue").Ref<{
        w: number;
        h: number;
        x: number;
        y: number;
        i: string;
        minW?: number | undefined;
        minH?: number | undefined;
        maxW?: number | undefined;
        maxH?: number | undefined;
        moved?: boolean | undefined;
        static?: boolean | undefined;
        isDraggable?: boolean | undefined;
        isResizable?: boolean | undefined;
    }[] | null>;
    erd: import("vue").Ref<{
        listenTo: (element: HTMLElement, callback: (elem: HTMLElement) => void) => void;
        removeListener: (element: HTMLElement, callback: (elem: HTMLElement) => void) => void;
        removeAllListeners: (element: HTMLElement) => void;
        uninstall: (element: HTMLElement) => void;
    } | null>;
    positionsBeforeDrag: import("vue").Ref<{
        [key: string]: string;
    } | undefined>;
    this$refsLayout: import("vue").Ref<HTMLElement>;
    eventBus: Emitter<{
        resizeEvent?: EventsData | undefined;
        dragEvent?: EventsData | undefined;
        updateWidth: number | null;
        setColNum: number;
        setRowHeight: number;
        setDraggable: boolean;
        setResizable: boolean;
        setBounded: boolean;
        setTransformScale: number;
        setMaxRows: number;
        compact: void;
    }>;
    emit: {
        (e: "layout-created", layout: Layout): void;
        (e: "layout-before-mount", layout: Layout): void;
        (e: "layout-mounted", layout: Layout): void;
        (e: "layout-updated", layout: Layout): void;
        (e: "layout-ready", layout: Layout): void;
        (e: "update:layout", layout: Layout): void;
        (e: "breakpoint-changed", newBreakpoint: string, layout: Layout): void;
    };
    resizeEventHandler: (data?: EventsData) => void;
    dragEventHandler: (data?: EventsData) => void;
    layoutUpdate: () => void;
    updateHeight: () => void;
    onWindowResize: () => void;
    containerHeight: () => string;
    dragEvent: (eventName?: EventType, id?: string | number, x?: number, y?: number, h?: number, w?: number) => void;
    resizeEvent: (eventName?: EventType, id?: string | number, x?: number, y?: number, h?: number, w?: number) => void;
    responsiveGridLayout: (id?: string | number) => void;
    initResponsiveFeatures: () => void;
    findDifference: (layout: Layout, originalLayout: Layout) => LayoutItem[];
    GridItem: import("vue").DefineComponent<unknown, object, {}, import("vue").ComputedOptions, import("vue").MethodOptions, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<unknown>, {}>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("layout-created" | "layout-before-mount" | "layout-mounted" | "layout-updated" | "layout-ready" | "update:layout" | "breakpoint-changed")[], "layout-created" | "layout-before-mount" | "layout-mounted" | "layout-updated" | "layout-ready" | "update:layout" | "breakpoint-changed", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    autoSize: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    colNum: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    rowHeight: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    maxRows: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    margin: {
        type: ArrayConstructor;
        required: false;
        default: () => number[];
    };
    isDraggable: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    isResizable: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    isMirrored: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    isBounded: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    useCssTransforms: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    verticalCompact: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    restoreOnDrag: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    layout: {
        type: null;
        required: true;
    };
    responsive: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    responsiveLayouts: {
        type: ObjectConstructor;
        required: false;
        default: () => {};
    };
    transformScale: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    breakpoints: {
        type: ObjectConstructor;
        required: false;
        default: () => {
            lg: number;
            md: number;
            sm: number;
            xs: number;
            xxs: number;
        };
    };
    cols: {
        type: ObjectConstructor;
        required: false;
        default: () => {
            lg: number;
            md: number;
            sm: number;
            xs: number;
            xxs: number;
        };
    };
    preventCollision: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    useStyleCursor: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}>> & {
    "onLayout-created"?: ((...args: any[]) => any) | undefined;
    "onLayout-before-mount"?: ((...args: any[]) => any) | undefined;
    "onLayout-mounted"?: ((...args: any[]) => any) | undefined;
    "onLayout-updated"?: ((...args: any[]) => any) | undefined;
    "onLayout-ready"?: ((...args: any[]) => any) | undefined;
    "onUpdate:layout"?: ((...args: any[]) => any) | undefined;
    "onBreakpoint-changed"?: ((...args: any[]) => any) | undefined;
}, {
    isDraggable: boolean;
    isResizable: boolean;
    isBounded: boolean;
    autoSize: boolean;
    colNum: number;
    rowHeight: number;
    maxRows: number;
    margin: unknown[];
    isMirrored: boolean;
    useCssTransforms: boolean;
    verticalCompact: boolean;
    restoreOnDrag: boolean;
    responsive: boolean;
    responsiveLayouts: Record<string, any>;
    transformScale: number;
    breakpoints: Record<string, any>;
    cols: Record<string, any>;
    preventCollision: boolean;
    useStyleCursor: boolean;
}>;
export default _sfc_main;

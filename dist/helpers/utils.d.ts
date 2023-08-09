export interface LayoutItemRequired {
    w: number;
    h: number;
    x: number;
    y: number;
    i: string;
}
export type LayoutItem = LayoutItemRequired & {
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    moved?: boolean;
    static?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
};
export type Layout = Array<LayoutItem>;
export type Size = {
    width: number;
    height: number;
};
/**
 * Return the bottom coordinate of the layout.
 *
 * @param  {Array} layout Layout array.
 * @return {Number}       Bottom coordinate.
 */
export declare function bottom(layout: Layout): number;
export declare function cloneLayout(layout: Layout): Layout;
export declare function cloneLayoutItem(layoutItem: LayoutItem): LayoutItem;
/**
 * Given two layoutitems, check if they collide.
 *
 * @return {Boolean}   True if colliding.
 */
export declare function collides(l1: LayoutItem, l2: LayoutItem): boolean;
/**
 * Given a layout, compact it. This involves going down each y coordinate and removing gaps
 * between items.
 *
 * @param  {Array} layout Layout.
 * @param  {Boolean} verticalCompact Whether or not to compact the layout
 *   vertically.
 * @param {Object} minPositions
 * @return {Array}       Compacted Layout.
 */
export declare function compact(layout: Layout, verticalCompact: boolean, minPositions?: any): Layout;
/**
 * Compact an item in the layout.
 */
export declare function compactItem(compareWith: Layout, l: LayoutItem, verticalCompact: boolean, minPositions?: any): LayoutItem;
/**
 * Given a layout, make sure all elements fit within its bounds.
 *
 * @param  {Array} layout Layout array.
 * @param  {Number} bounds Number of columns.
 */
export declare function correctBounds(layout: Layout, bounds: {
    cols: number;
}): Layout;
/**
 * Get a layout item by ID. Used so we can override later on if necessary.
 *
 * @param  {Array}  layout Layout array.
 * @param  {String} id     ID
 * @return {LayoutItem}    Item at ID.
 */
export declare function getLayoutItem(layout: Layout, id: string | number | undefined): LayoutItem | undefined;
/**
 * Returns the first item this layout collides with.
 * It doesn't appear to matter which order we approach this from, although
 * perhaps that is the wrong thing to do.
 *
 * @param  {Object} layoutItem Layout item.
 * @return {Object|undefined}  A colliding layout item, or undefined.
 */
export declare function getFirstCollision(layout: Layout, layoutItem: LayoutItem): LayoutItem | undefined;
export declare function getAllCollisions(layout: Layout, layoutItem: LayoutItem): Array<LayoutItem>;
/**
 * Get all static elements.
 * @param  {Array} layout Array of layout objects.
 * @return {Array}        Array of static layout items..
 */
export declare function getStatics(layout: Layout): Array<LayoutItem>;
/**
 * Move an element. Responsible for doing cascading movements of other elements.
 *
 * @param  {Array}      layout Full layout to modify.
 * @param  {LayoutItem} l      element to move.
 * @param  {Number}     [x]    X position in grid units.
 * @param  {Number}     [y]    Y position in grid units.
 * @param  {Boolean}    [isUserAction] If true, designates that the item we're moving is
 *                                     being dragged/resized by th euser.
 */
export declare function moveElement(layout: Layout, l: LayoutItem, x: number | undefined, y: number | undefined, isUserAction?: boolean, preventCollision?: boolean): Layout;
/**
 * This is where the magic needs to happen - given a collision, move an element away from the collision.
 * We attempt to move it up if there's room, otherwise it goes below.
 *
 * @param  {Array} layout            Full layout to modify.
 * @param  {LayoutItem} collidesWith Layout item we're colliding with.
 * @param  {LayoutItem} itemToMove   Layout item we're moving.
 * @param  {Boolean} [isUserAction]  If true, designates that the item we're moving is being dragged/resized
 *                                   by the user.
 */
export declare function moveElementAwayFromCollision(layout: Layout, collidesWith: LayoutItem, itemToMove: LayoutItem, isUserAction?: boolean): Layout;
/**
 * Helper to convert a number to a percentage string.
 *
 * @param  {Number} num Any number
 * @return {String}     That number as a percentage.
 */
export declare function perc(num: number): string;
export interface TransformStyle {
    transform: string;
    WebkitTransform: string;
    MozTransform: string;
    msTransform: string;
    OTransform: string;
    width: string;
    height: string;
    position: "absolute" | "relative";
}
export declare function setTransform(top: number, left: number, width: number, height: number): TransformStyle;
/**
 * Just like the setTransform method, but instead it will return a negative value of right.
 *
 * @param top
 * @param right
 * @param width
 * @param height
 * @returns {{transform: string, WebkitTransform: string, MozTransform: string, msTransform: string, OTransform: string, width: string, height: string, position: string}}
 */
export declare function setTransformRtl(top: number, right: number, width: number, height: number): TransformStyle;
export interface TopLeftStyle {
    top: string;
    left: string;
    width: string;
    height: string;
    position: "absolute";
}
export declare function setTopLeft(top: number, left: number, width: number, height: number): TopLeftStyle;
/**
 * Just like the setTopLeft method, but instead, it will return a right property instead of left.
 *
 * @param top
 * @param right
 * @param width
 * @param height
 * @returns {{top: string, right: string, width: string, height: string, position: string}}
 */
export interface TopRightStyle {
    top: string;
    right: string;
    width: string;
    height: string;
    position: string;
}
export declare function setTopRight(top: number, right: number, width: number, height: number): TopRightStyle;
/**
 * Get layout items sorted from top left to right and down.
 *
 * @return {Array} Array of layout objects.
 * @return {Array}        Layout, sorted static items first.
 */
export declare function sortLayoutItemsByRowCol(layout: Layout): Layout;
/**
 * Generate a layout using the initialLayout and children as a template.
 * Missing entries will be added, extraneous ones will be truncated.
 *
 * @param  {Array}  initialLayout Layout passed in through props.
 * @param  {String} breakpoint    Current responsive breakpoint.
 * @param  {Boolean} verticalCompact Whether or not to compact the layout vertically.
 * @return {Array}                Working layout.
 */
/**
 * Validate a layout. Throws errors.
 *
 * @param  {Array}  layout        Array of layout items.
 * @param  {String} [contextName] Context name for errors.
 * @throw  {Error}                Validation error.
 */
export declare function validateLayout(layout: Layout, contextName?: string): void;
export declare function autoBindHandlers(el: HTMLElement, fns: Array<string>): void;
/**
 * Convert a JS object to CSS string. Similar to React's output of CSS.
 * @param obj
 * @returns {string}
 */
interface JSStyle {
    [key: string]: string;
}
export declare function createMarkup(obj: JSStyle): string;
export declare const IS_UNITLESS: {
    animationIterationCount: boolean;
    boxFlex: boolean;
    boxFlexGroup: boolean;
    boxOrdinalGroup: boolean;
    columnCount: boolean;
    flex: boolean;
    flexGrow: boolean;
    flexPositive: boolean;
    flexShrink: boolean;
    flexNegative: boolean;
    flexOrder: boolean;
    gridRow: boolean;
    gridColumn: boolean;
    fontWeight: boolean;
    lineClamp: boolean;
    lineHeight: boolean;
    opacity: boolean;
    order: boolean;
    orphans: boolean;
    tabSize: boolean;
    widows: boolean;
    zIndex: boolean;
    zoom: boolean;
    fillOpacity: boolean;
    stopOpacity: boolean;
    strokeDashoffset: boolean;
    strokeOpacity: boolean;
    strokeWidth: boolean;
};
/**
 * Will add px to the end of style values which are Numbers.
 * @param name
 * @param value
 * @returns {*}
 */
export declare function addPx(name: string, value: number | string): string | number;
/**
 * Hyphenate a camelCase string.
 *
 * @param {String} str
 * @return {String}
 */
export declare const hyphenateRE: RegExp;
export declare function hyphenate(str: string): string;
export declare function findItemInArray(array: Array<any>, property: string, value: any): boolean;
export declare function findAndRemove(array: Array<any>, property: string, value: any): void;
export {};

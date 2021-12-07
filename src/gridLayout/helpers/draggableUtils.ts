// Get {x, y} positions from event.
// interface offsetXYFromParentOf {
//   (e: Event): { x: number; y: number };
// }
export interface coorD {
  x?: number | undefined;
  y?: number | undefined;
  deltaX?: number | undefined;
  deltaY?: number | undefined;
  lastX?: number | undefined;
  lastY?: number | undefined;
}
export function getControlPosition(e: MouseEvent): coorD {
  return offsetXYFromParentOf(e);
}

// Get from offsetParent
export function offsetXYFromParentOf(evt: MouseEvent): coorD {
  const offsetParent = (evt.target as HTMLElement).offsetParent || document.body;
  const offsetParentRect =
    (evt.target as HTMLElement).offsetParent === document.body
      ? { left: 0, top: 0 }
      : offsetParent.getBoundingClientRect();

  const x = evt.clientX + offsetParent.scrollLeft - offsetParentRect.left;
  const y = evt.clientY + offsetParent.scrollTop - offsetParentRect.top;

  /* const x = Math.round(evt.clientX + offsetParent.scrollLeft - offsetParentRect.left);
    const y = Math.round(evt.clientY + offsetParent.scrollTop - offsetParentRect.top); */

  return { x, y };
}

// Create an data object exposed by <DraggableCore>'s events
export function createCoreData(lastX: number, lastY: number, x: number, y: number): coorD {
  // State changes are often (but not always!) async. We want the latest value.
  const isStart = !isNum(lastX);

  if (isStart) {
    // If this is our first move, use the x and y as last coords.
    return {
      deltaX: 0,
      deltaY: 0,
      lastX: x,
      lastY: y,
      x: x,
      y: y
    };
  } else {
    // Otherwise calculate proper values.
    return {
      deltaX: x - lastX,
      deltaY: y - lastY,
      lastX: lastX,
      lastY: lastY,
      x: x,
      y: y
    };
  }
}

function isNum(num: number) {
  return typeof num === 'number' && !isNaN(num);
}

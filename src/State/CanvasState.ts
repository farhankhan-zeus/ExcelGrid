import type { EventManager } from "./EventManager.js";

export interface CanvasState {
  hitTest(x: number, y: number, context: EventManager): boolean;
  handleMouseDown(e: MouseEvent, context: EventManager): void;
  handleMouseMove(e: MouseEvent, context: EventManager): void;
  handleMouseUp(e: MouseEvent, context: EventManager): void;
  handleDoubleClick(e: MouseEvent, context: EventManager): void;
}
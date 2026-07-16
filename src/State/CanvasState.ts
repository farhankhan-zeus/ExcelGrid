// CanvasState.ts
import type { EventManager } from "./EventManager.ts";

export interface CanvasState {
  handleMouseDown(e: MouseEvent, context: EventManager): void;
  handleMouseMove(e: MouseEvent, context: EventManager): void;
  handleMouseUp(e: MouseEvent, context: EventManager): void;
  handleDoubleClick(e: MouseEvent, context: EventManager): void;
}
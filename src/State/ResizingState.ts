// ResizingState.ts
import type { CanvasState } from "./CanvasState.js";
import type { EventManager } from "./EventManager.js";
import { IdleState } from "./IdleState.js";

export class ResizingState implements CanvasState {
  public handleMouseDown(e: MouseEvent, context: EventManager): void {}

  public handleMouseMove(e: MouseEvent, context: EventManager): void {
    context.resizeManager.handleMouseMove(e.offsetX, e.offsetY);
  }

  public handleMouseUp(e: MouseEvent, context: EventManager): void {
    context.resizeManager.handleMouseUp();
    context.changeState(new IdleState());
  }

  public handleDoubleClick(e: MouseEvent, context: EventManager): void {}
}
import type { CanvasState } from "./CanvasState.js";
import type { EventManager } from "./EventManager.js";
import { IdleState } from "./IdleState.js";

export class ColResizingState implements CanvasState {
  public hitTest(x: number, y: number, context: EventManager): boolean {
    return context.resizeManager.getColumnBorderIndexAt(x, y) !== null;
  }

  public handleMouseDown(e: MouseEvent, context: EventManager): void {
    context.resizeManager.ColhandleMouseDown(e.offsetX, e.offsetY);
  }

  public handleMouseMove(e: MouseEvent, context: EventManager): void {
    context.resizeManager.ColhandleMouseMove(e.offsetX, e.offsetY);
  }

  public handleMouseUp(e: MouseEvent, context: EventManager): void {
    context.resizeManager.ColhandleMouseUp();
    context.changeState(new IdleState());
  }

  public handleDoubleClick(e: MouseEvent, context: EventManager): void {}
}
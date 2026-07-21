import type { CanvasState } from "./CanvasState.js";
import type { EventManager } from "./EventManager.js";
import { IdleState } from "./IdleState.js";

export class RowResizingState implements CanvasState {
  public hitTest(x: number, y: number, context: EventManager): boolean {
    return context.resizeManager.getRowBorderIndexAt(x, y) !== null;
  }

  public handleMouseDown(e: MouseEvent, context: EventManager): void {
    context.resizeManager.RowhandleMouseDown(e.offsetX, e.offsetY);
  }

  public handleMouseMove(e: MouseEvent, context: EventManager): void {
    context.resizeManager.RowhandleMouseMove(e.offsetX, e.offsetY);
  }

  public handleMouseUp(e: MouseEvent, context: EventManager): void {
    context.resizeManager.RowhandleMouseUp();
    context.changeState(new IdleState());
  }

  public handleDoubleClick(e: MouseEvent, context: EventManager): void {}
}
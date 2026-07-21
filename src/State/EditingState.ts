import type { CanvasState } from "./CanvasState.js";
import type { EventManager } from "./EventManager.js";
import { IdleState } from "./IdleState.js";

export class EditingState implements CanvasState {
  public hitTest(_x: number, _y: number, _context: EventManager): boolean {
    return false; // Entered via double-click or keyboard
  }

  public handleMouseDown(e: MouseEvent, context: EventManager): void {
    context.cellEditor.finishEditing();
    const idle = new IdleState();
    context.changeState(idle);
    // Delegate the new mouse down event immediately to IdleState
    idle.handleMouseDown(e, context);
  }

  public handleMouseMove(_e: MouseEvent, context: EventManager): void {
    context.canvas.style.cursor = "default";
  }

  public handleMouseUp(_e: MouseEvent, _context: EventManager): void {}

  public handleDoubleClick(_e: MouseEvent, _context: EventManager): void {}
}
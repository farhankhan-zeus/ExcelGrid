// EditingState.ts
import type { CanvasState } from "./CanvasState.js";
import type { EventManager } from "./EventManager.js";
import { IdleState } from "./IdleState.js";

export class EditingState implements CanvasState {
  public handleMouseDown(e: MouseEvent, context: EventManager): void {
    // Clicking elsewhere on the canvas will finalize current edits and delegate the selection click
    context.cellEditor.finishEditing();
    context.changeState(new IdleState());
    // Propagate standard click handlers immediately
    context.getCurrentState().handleMouseDown(e, context);
  }

  public handleMouseMove(e: MouseEvent, context: EventManager): void {
    context.canvas.style.cursor = "default";
  }

  public handleMouseUp(e: MouseEvent, context: EventManager): void {}

  public handleDoubleClick(e: MouseEvent, context: EventManager): void {}
}
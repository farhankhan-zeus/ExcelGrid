// DragSelectionState.ts
import type { CanvasState } from "./CanvasState.js";
import type { EventManager } from "./EventManager.js";
import { IdleState } from "./IdleState.ts";
import { HEADER_H, ROWHDR_W } from "../constants.js";
import { EditingState } from "./EditingState.ts";

export class DragSelectionState implements CanvasState {
  private isDragging:boolean=false;
  public handleMouseDown(e: MouseEvent, context: EventManager): void {}

  public handleMouseMove(e: MouseEvent, context: EventManager): void {
    this.isDragging=true;
    const x = e.offsetX;
    const y = e.offsetY;
    
    // Ignore headers during active cell range dragging
    if (x < ROWHDR_W || y < HEADER_H) return;
    
    const row = context.getRowAtY(y);
    const col = context.getColAtX(x);
    
    context.selection.extendTo(row, col);
    context.render();
  }
  
  public handleMouseUp(e: MouseEvent, context: EventManager): void {
    // Return to idle after a brief timeout (maintains consistency with original codebase)
    setTimeout(() => {
      context.changeState(new IdleState());
    }, 50);
  }
  
  public handleDoubleClick(e: MouseEvent, context: EventManager): void {
    if(this.isDragging){
      return;
    }
    const x = e.offsetX;
  const y = e.offsetY;
  
  // Boundary check
  if (x < ROWHDR_W || y < HEADER_H) return;

  const row = context.getRowAtY(y);
  const col = context.getColAtX(x);

  // Switch to editing state
  context.cellEditor.startEditing(row, col);
  context.render();
  context.changeState(new EditingState());
  }
}
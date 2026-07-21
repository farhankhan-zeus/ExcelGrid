import type { CanvasState } from "./CanvasState.js";
import type { EventManager } from "./EventManager.js";
import { ColResizingState } from "./ColResizingState.js";
import { RowResizingState } from "./RowResizingState.js";
import { ColumnHeaderState } from "./ColumnHeaderState.js";
import { RowHeaderState } from "./RowHeaderState.js";
import { SelectAllState } from "./SelectAllState.js";
import { DragSelectionState } from "./DragSelectionState.js";
import { EditingState } from "./EditingState.js";
import { HEADER_H, ROWHDR_W } from "../constants.js";

export class IdleState implements CanvasState {
  private candidateStates: CanvasState[];

  constructor(customCandidates?: CanvasState[]) {
    // Order of precedence for hit testing
    this.candidateStates = customCandidates ?? [
      new ColResizingState(),
      new RowResizingState(),
      new ColumnHeaderState(),
      new RowHeaderState(),
      new SelectAllState(),
      new DragSelectionState(),
    ];
  }

  public hitTest(_x: number, _y: number, _context: EventManager): boolean {
    return true;
  }

  public handleMouseDown(e: MouseEvent, context: EventManager): void {
    const x = e.offsetX;
    const y = e.offsetY;

    for (const state of this.candidateStates) {
      if (state.hitTest(x, y, context)) {
        // Transition context to the state that won the hit test
        context.changeState(state);
        // Execute the initial mouse down logic on that state
        state.handleMouseDown(e, context);
        break;
      }
    }
  }

  public handleMouseMove(e: MouseEvent, context: EventManager): void {
    const x = e.offsetX;
    const y = e.offsetY;

    // Hover cursor updates
    if (context.resizeManager.getColumnBorderIndexAt(x, y) !== null) {
      context.canvas.style.cursor = "col-resize";
    } else if (context.resizeManager.getRowBorderIndexAt(x, y) !== null) {
      context.canvas.style.cursor = "row-resize";
    } else {
      context.canvas.style.cursor = "default";
    }
  }

  public handleMouseUp(_e: MouseEvent, _context: EventManager): void {}

  public handleDoubleClick(e: MouseEvent, context: EventManager): void {
    if(context.selection.isCellRange()){
      return;
    }
    const x = e.offsetX;
    const y = e.offsetY;

    if (x < ROWHDR_W || y < HEADER_H) return;

    const row = context.getRowAtY(y);
    const col = context.getColAtX(x);

    context.cellEditor.startEditing(row, col);
    context.render();
    context.changeState(new EditingState());
  }
}
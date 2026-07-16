// IdleState.ts
import type { CanvasState } from "./CanvasState.ts";
import type { EventManager } from "./EventManager.ts";
import { DragSelectionState } from "./DragSelectionState.ts";
import { ResizingState } from "./ResizingState.ts";
import { EditingState } from "./EditingState.ts";
import { HEADER_H, ROWHDR_W } from "../constants.ts";
import type { HitRegion } from "../types.ts"; // Assuming you define the interface here or elsewhere

export class IdleState implements CanvasState {
  
private getHitRegions(context: EventManager): HitRegion[] {
  return [
    {
      name: "Resize Handle",
      // Since you don't have a direct "isOverBorder" helper, 
      // we can reuse the index checks you already use in handleMouseMove!
      contains: (x, y) => 
        context.resizeManager.getColumnBorderIndexAt(x, y) !== null ||
        context.resizeManager.getRowBorderIndexAt(x, y) !== null,
      onMouseDown: (x, y, ctx) => {
        // Execute the actual state change on a successful drag initiation
        if (ctx.resizeManager.handleMouseDown(x, y)) {
          ctx.changeState(new ResizingState());
        }
      }
    },
    {
      name: "Column Header",
      contains: (x, y) => y < HEADER_H && x > ROWHDR_W,
      onMouseDown: (x, y, ctx) => {
        const col = ctx.getColAtX(x);
        ctx.selection.selectColumn(col, ctx.rowManager.getCount());
        ctx.render();
      }
    },
    {
      name: "Row Header",
      contains: (x, y) => x < ROWHDR_W && y > HEADER_H,
      onMouseDown: (x, y, ctx) => {
        const row = ctx.getRowAtY(y);
        ctx.selection.selectRow(row, ctx.colManager.getCount());
        ctx.render();
      }
    },
    {
      name: "Grid Cell",
      contains: (x, y) => x > ROWHDR_W && y > HEADER_H,
      onMouseDown: (x, y, ctx) => {
        const row = ctx.getRowAtY(y);
        const col = ctx.getColAtX(x);
        ctx.selection.selectCell(row, col);
        ctx.render();
        ctx.changeState(new DragSelectionState());
      }
    }
  ];
}

  public handleMouseDown(e: MouseEvent, context: EventManager): void {
    const x = e.offsetX;
    const y = e.offsetY;
    const regions = this.getHitRegions(context);

    // Loop through the hit regions
    for (const region of regions) {
      if (region.contains(x, y)) {
        region.onMouseDown(x, y, context);
        break; // Stop evaluating further regions once we have a hit
      }
    }
  }

  public handleMouseMove(e: MouseEvent, context: EventManager): void {
    const x = e.offsetX;
    const y = e.offsetY;

    // We can also leverage hit testing here to change cursor styles!
    if (context.resizeManager.getColumnBorderIndexAt(x, y) !== null) {
      context.canvas.style.cursor = "col-resize";
    } else if (context.resizeManager.getRowBorderIndexAt(x, y) !== null) {
      context.canvas.style.cursor = "row-resize";
    } else {
      context.canvas.style.cursor = "default";
    }
  }

  public handleMouseUp(e: MouseEvent, context: EventManager): void {}

  public handleDoubleClick(e: MouseEvent, context: EventManager): void {
    const x = e.offsetX;
    const y = e.offsetY;
    
    // Quick boundary guard
    if (x < ROWHDR_W || y < HEADER_H) return;

    const row = context.getRowAtY(y);
    const col = context.getColAtX(x);

    context.cellEditor.startEditing(row, col);
    context.render();
    context.changeState(new EditingState());
  }
}
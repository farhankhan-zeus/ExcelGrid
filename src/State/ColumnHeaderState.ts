import type { CanvasState } from "./CanvasState.js";
import type { EventManager } from "./EventManager.js";
import { IdleState } from "./IdleState.js";
import { HEADER_H, ROWHDR_W } from "../constants.js";

export class ColumnHeaderState implements CanvasState {
  public hitTest(x: number, y: number, _context: EventManager): boolean {
    return y < HEADER_H && x > ROWHDR_W;
  }

  public handleMouseDown(e: MouseEvent, context: EventManager): void {
    const col = context.getColAtX(e.offsetX);
    context.selection.selectColumn(col, context.rowManager.getCount());
    context.render();
  }

  public handleMouseMove(_e: MouseEvent, _context: EventManager): void {}

  public handleMouseUp(_e: MouseEvent, context: EventManager): void {
    context.changeState(new IdleState());
  }

  public handleDoubleClick(_e: MouseEvent, _context: EventManager): void {}
}
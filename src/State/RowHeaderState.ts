import type { CanvasState } from "./CanvasState.js";
import type { EventManager } from "./EventManager.js";
import { IdleState } from "./IdleState.js";
import { HEADER_H, ROWHDR_W } from "../constants.js";

export class RowHeaderState implements CanvasState {
  public hitTest(x: number, y: number, _context: EventManager): boolean {
    return x < ROWHDR_W && y > HEADER_H;
  }

  public handleMouseDown(e: MouseEvent, context: EventManager): void {
    const row = context.getRowAtY(e.offsetY);
    context.selection.selectRow(row, context.colManager.getCount());
    context.render();
  }

  public handleMouseMove(_e: MouseEvent, _context: EventManager): void {}

  public handleMouseUp(_e: MouseEvent, context: EventManager): void {
    context.changeState(new IdleState());
  }

  public handleDoubleClick(_e: MouseEvent, _context: EventManager): void {}
}
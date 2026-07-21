import type { CanvasState } from "./CanvasState.js";
import type { EventManager } from "./EventManager.js";
import { IdleState } from "./IdleState.js";
import { HEADER_H, ROWHDR_W } from "../constants.js";

export class SelectAllState implements CanvasState {
  public hitTest(x: number, y: number, _context: EventManager): boolean {
    return x < ROWHDR_W && y < HEADER_H;
  }

  public handleMouseDown(_e: MouseEvent, context: EventManager): void {
    context.selection.selectAll(
      context.rowManager.getCount(),
      context.colManager.getCount()
    );
    context.render();
  }

  public handleMouseMove(_e: MouseEvent, _context: EventManager): void {}

  public handleMouseUp(_e: MouseEvent, context: EventManager): void {
    context.changeState(new IdleState());
  }

  public handleDoubleClick(_e: MouseEvent, _context: EventManager): void {}
}
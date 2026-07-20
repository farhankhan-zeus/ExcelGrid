import type { Command } from "./Command/Command.js";
import {
  DEFAULT_COL_WIDTH,
  DEFAULT_ROW_HEIGHT,
  HEADER_H,
  RESIZE_HANDLE_SIZE,
  ROWHDR_W,
} from "./constants.js";
import type { DimensionManager } from "./DimensionManager.ts";
import { ResizeCommand } from "./Command/ResizeCommand.ts";
import type { UndoRedoManager } from "./Command/UndoRedoManager.ts";

export class ResizeManager {
  private rowManager: DimensionManager;
  private colManager: DimensionManager;
  private undoRedoManager: UndoRedoManager;
  private getScrollX: () => number;
  private getScrollY: () => number;
  private setupSpacer: () => void;
  private render: () => void;

  // for resizing the grid,
  private resizingColInd: number | null; 
  private resizingRowInd: number | null; 
  private resizingStartX: number; 
  private resizingStartY: number; 
  private resizeStartSize: number; 
  constructor(
    rowManager: DimensionManager,
    colManager: DimensionManager,
    undoRedoManager: UndoRedoManager,
    getScrollX: () => number,
    getScrollY: () => number,
    setupSpacer: () => void,
    render: () => void,
  ) {
    this.rowManager = rowManager;
    this.colManager = colManager;
    this.undoRedoManager = undoRedoManager;
    this.getScrollX = getScrollX;
    this.getScrollY = getScrollY;
    this.setupSpacer = setupSpacer;
    this.render = render;

    // initial values for resizing
    this.resizingColInd = null;
    this.resizingRowInd = null;
    this.resizingStartX = 0;
    this.resizingStartY = 0;
    this.resizeStartSize = 0;
  }

  public isResizing(): boolean {
    return this.resizingColInd !== null || this.resizingRowInd !== null;
  }

  public getColumnBorderIndexAt(x: number, y: number): number | null {
    if (y > HEADER_H) return null; // not in column header area

    let offset = ROWHDR_W - this.getScrollX();
    for (let col = 0; col < this.colManager.getCount(); col++) {
      offset += this.colManager.getSize(col);

      if (Math.abs(x - offset) <= RESIZE_HANDLE_SIZE) {
        return col;
      }

      if (offset > x + RESIZE_HANDLE_SIZE) break;
    }

    return null;
  }


  public getRowBorderIndexAt(x: number, y: number): number | null {
    if (x > ROWHDR_W) return null;

    let offset = HEADER_H - this.getScrollY();
    for (let row = 0; row < this.rowManager.getCount(); row++) {
      offset += this.rowManager.getSize(row);

      if (Math.abs(y - offset) <= RESIZE_HANDLE_SIZE) {
        return row;
      }

      if (offset > y + RESIZE_HANDLE_SIZE) break;
    }

    return null;
  }

  public RowhandleMouseDown(x: number, y: number): boolean {
    // check if mouse is clicked on a header border area (for resizing)
    

    const rowBorderInd = this.getRowBorderIndexAt(x, y);
    if (rowBorderInd !== null) {
      this.resizingRowInd = rowBorderInd;
      this.resizingStartY = y;
      this.resizeStartSize = this.rowManager.getSize(rowBorderInd);
      this.render();
      return true;
    }

    this.render();
    return false;
  }

  public RowhandleMouseMove(x: number, y: number): boolean {
    // while resizing a row/column is in progress
    if (this.resizingRowInd !== null) {
      const newSize = Math.max(
        DEFAULT_ROW_HEIGHT,
        this.resizeStartSize + (y - this.resizingStartY),
      );
      this.rowManager.setSize(this.resizingRowInd, newSize);
      this.setupSpacer();
      this.render();
      return true;
    }

    this.render(); 
    return false;
  }

  public RowhandleMouseUp(): boolean {

    let handled = false;

     // stop resizing if any
   

    if (this.resizingRowInd !== null) {
      const resizingRowInd = this.resizingRowInd;
      const oldResizingSize = this.resizeStartSize;
      const newResizingSize = this.rowManager.getSize(resizingRowInd);

      // TODO : match input field size with cell size when resizing a column/row while editing a cell
      if (oldResizingSize !== newResizingSize) {
        const command: Command = new ResizeCommand(
          this.rowManager,
          resizingRowInd,
          oldResizingSize,
          newResizingSize,
          () => this.setupSpacer(),
          () => this.render(),
        );

        this.undoRedoManager.pushCommand(command);
      }

      this.resizingRowInd = null;
      handled = true;
    }

    this.render();
    return handled;
  }
  public ColhandleMouseDown(x: number, y: number): boolean {
    // check if mouse is clicked on a header border area (for resizing)
    const colBorderInd = this.getColumnBorderIndexAt(x, y);
    if (colBorderInd !== null) {
      this.resizingColInd = colBorderInd;
      this.resizingStartX = x;
      this.resizeStartSize = this.colManager.getSize(colBorderInd);
      this.render();
      return true;
    }

   

    this.render();
    return false;
  }

  public ColhandleMouseMove(x: number, y: number): boolean {
    // while resizing a row/column is in progress
    if (this.resizingColInd !== null) {
      const newSize = Math.max(
        DEFAULT_COL_WIDTH,
        this.resizeStartSize + (x - this.resizingStartX),
      );
      this.colManager.setSize(this.resizingColInd, newSize);
      this.setupSpacer();
      this.render();
      return true;
    }

    

    this.render(); 
    return false;
  }

  public ColhandleMouseUp(): boolean {

    let handled = false;

    if (this.resizingRowInd !== null) {
      const resizingRowInd = this.resizingRowInd;
      const oldResizingSize = this.resizeStartSize;
      const newResizingSize = this.rowManager.getSize(resizingRowInd);

      // TODO : match input field size with cell size when resizing a column/row while editing a cell
      if (oldResizingSize !== newResizingSize) {
        const command: Command = new ResizeCommand(
          this.rowManager,
          resizingRowInd,
          oldResizingSize,
          newResizingSize,
          () => this.setupSpacer(),
          () => this.render(),
        );

        this.undoRedoManager.pushCommand(command);
      }

      this.resizingRowInd = null;
      handled = true;
    }

    this.render();
    return handled;
  }
}

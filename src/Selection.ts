import type { BoundType } from "./types.js";

export class Selection {
  private startRow: number;
  private startCol: number;
  private endRow: number;
  private endCol: number;
  
  // NEW: Dedicated active focus cell coordinates independent of the box corners
  private activeRow: number;
  private activeCol: number;

  // private isCellRangeSelected: boolean;
  // private SelectedCellRange?: BoundType;

  constructor() {
    this.startRow = 0; this.startCol = 0;
    this.endRow = 0; this.endCol = 0;
    this.activeRow = 0; this.activeCol = 0; // Initialize focus
  //   this.isCellRangeSelected = false;
  //   this.SelectedCellRange = undefined;
  }

  // public Activatecellrange() {
  //   this.isCellRangeSelected = true;
  // }
  
  // public Deactivatecellrange() {
  //   this.isCellRangeSelected = false;
  // }

  // When clicking a single cell, the bounding box collapses to it and focus resets to it
  public selectCell(row: number, col: number): void {
    this.startRow = this.endRow = this.activeRow = row;
    this.startCol = this.endCol = this.activeCol = col;
  }

  public selectAll(totalRows: number, totalCols: number): void {
    this.startRow = 0;
    this.startCol = 0;
    this.endRow = totalRows - 1;
    this.endCol = totalCols - 1;
    this.activeRow = 0;
    this.activeCol = 0;
  }

  // Dragging to extend selection modifies boundaries, but keeps focus on original click start
  public extendTo(row: number, col: number): void {
    this.endRow = row;
    this.endCol = col;
  }

  public selectRow(row: number, totalCols: number): void {
    this.startRow = this.endRow = this.activeRow = row;
    this.startCol = 0; this.endCol = totalCols - 1;
    this.activeCol = 0;
  }

  public selectColumn(col: number, totalRows: number): void {
    this.startCol = this.endCol = this.activeCol = col;
    this.startRow = 0; this.endRow = totalRows - 1;
    this.activeRow = 0;
  }

  public getBounds(): BoundType {
    return {
      top: Math.min(this.startRow, this.endRow),
      bottom: Math.max(this.startRow, this.endRow),
      left: Math.min(this.startCol, this.endCol),
      right: Math.max(this.startCol, this.endCol)
    };
  }

  // public getCellRange(): BoundType {
  //   if (this.isCellRangeSelected && this.SelectedCellRange) {
  //     return this.SelectedCellRange;
  //   }

  //   this.SelectedCellRange = this.getBounds();
  //   return this.SelectedCellRange;
  // }

  public isCellRange(): boolean {
    return (this.startRow !== this.endRow || this.startCol !== this.endCol);
  }

  public isCellSelected(row: number, col: number): boolean {
    const bound: BoundType = this.getBounds();
    return (
      row >= bound.top &&
      row <= bound.bottom &&
      col >= bound.left &&
      col <= bound.right
    );
  }

  // Updated to read from the accurate active tracking properties
  public getActivecell() {
    return { row: this.activeRow, col: this.activeCol };
  }
  public getEndCell(){
    return {row:this.endRow,col:this.endCol};
  }
  // NEW: Safely relocates the active focus cell without shrinking your selection box bounding bounds
  public moveActiveCellWithinRange(row: number, col: number): void {
    this.activeRow = row;
    this.activeCol = col;
  }
}

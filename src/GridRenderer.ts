import { CELL_BORDER_COLOR, CELL_BORDER_SELECTED_COLOR, CELL_NORMAL_COLOR, CELL_SELECTED_COLOR, CELL_TEXT_COLOR, HEADER_BORDER_COLOR, HEADER_H, HEADER_NORMAL_COLOR, HEADER_SELECTED_COLOR, HEADER_TEXT_COLOR, ROWHDR_W } from "./constants.js";
import type { DataStore } from "./Datastore.js";
import { DimensionManager } from "./DimensionManager.js";
import type { FormulaEngine } from "./FormulaEngine.js";
import type { Grid } from "./Grid.js";
import type { Selection } from "./Selection.js";


export class GridRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private grid: Grid;

  constructor(canvas: HTMLCanvasElement, grid: Grid) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.grid = grid;
  }

  render() {
  const ctx = this.ctx;
  const rowManager: DimensionManager = this.grid.getRowManager();
  const colManager: DimensionManager = this.grid.getColManager();
  const scrollX: number = this.grid.getScrollX();
  const scrollY: number = this.grid.getScrollY();
  const selection: Selection = this.grid.getSelection();
  const dataStore: DataStore = this.grid.getDataStore();
  const formulaEngine: FormulaEngine = this.grid.getFormulaEngine();

  // Render inside this view
  const viewWidth = this.canvas.width;
  const viewHeight = this.canvas.height;

  ctx.clearRect(0, 0, viewWidth, viewHeight);
  ctx.font = '13px Arial';
  ctx.textBaseline = 'middle';

  // Which rows/cols are currently visible
  const firstRow = rowManager.getIndexAtOffset(scrollY);
  const lastRow = rowManager.getIndexAtOffset(scrollY + viewHeight);
  const firstCol = colManager.getIndexAtOffset(scrollX);
  const lastCol = colManager.getIndexAtOffset(scrollX + viewWidth);
  const { row: activerow, col: activecol } = selection.getActivecell();
  
  // 💡 OPTIMIZATION 1: Get selection bounds ONCE outside the loops
  const bounds = selection.getBounds();
  const isCellRange = selection.isCellRange();

  // Draw body cells
  for (let row: number = firstRow; row <= lastRow; row++) {
    const y = rowManager.getOffset(row) - scrollY + HEADER_H;
    const h = rowManager.getSize(row);
    
    for (let col: number = firstCol; col <= lastCol; col++) {
      const isActivecell = (row === activerow && col === activecol);
      const x = colManager.getOffset(col) - scrollX + ROWHDR_W;
      const w = colManager.getSize(col);

      // 💡 OPTIMIZATION 2: Inline selection check using the cached bounds object
      const isSelected = (
        row >= bounds.top &&
        row <= bounds.bottom &&
        col >= bounds.left &&
        col <= bounds.right
      );

      ctx.fillStyle = isSelected ? CELL_SELECTED_COLOR : CELL_NORMAL_COLOR;
      if (isActivecell && isCellRange) {
        ctx.fillStyle = CELL_NORMAL_COLOR;
      }
      ctx.fillRect(x, y, w, h);

      ctx.strokeStyle = isSelected ? CELL_BORDER_SELECTED_COLOR : CELL_BORDER_COLOR;
      ctx.strokeRect(x, y, w, h);

      // (Optional: Cleaned up duplicate text rendering if "hello" was a placeholder)
      const rawValue = dataStore.getValue(row, col);
      const evaluatedValue = formulaEngine.evaluate(rawValue);

      if (evaluatedValue !== null && evaluatedValue !== undefined) {
        ctx.fillStyle = CELL_TEXT_COLOR;
        ctx.fillText(evaluatedValue.toString(), x + 5, y + h / 2);
      } else {
        // Fallback or placeholder text safely placed
        ctx.fillStyle = CELL_TEXT_COLOR;
        ctx.fillText("hello", x + 5, y + h / 2);
      }
    }
  }

  // Column headers
  for (let col = firstCol; col <= lastCol; col++) {
    const tx = colManager.getOffset(col) - scrollX + ROWHDR_W;
    const w = colManager.getSize(col);

    const isSelected = (col >= bounds.left && col <= bounds.right);
    ctx.fillStyle = isSelected ? HEADER_SELECTED_COLOR : HEADER_NORMAL_COLOR;
    ctx.fillRect(tx, 0, w, HEADER_H);
    ctx.strokeStyle = HEADER_BORDER_COLOR;
    ctx.strokeRect(tx, 0, w, HEADER_H);
    ctx.fillStyle = HEADER_TEXT_COLOR;
    ctx.fillText(formulaEngine.columnIndexToLetter(col), tx + w / 2, HEADER_H / 2);
  }

  // Row headers
  for (let row = firstRow; row <= lastRow; row++) {
    const y = rowManager.getOffset(row) - scrollY + HEADER_H;
    const h = rowManager.getSize(row);

    const isSelected = (row >= bounds.top && row <= bounds.bottom);
    
    ctx.fillStyle = isSelected ? HEADER_SELECTED_COLOR : HEADER_NORMAL_COLOR;
    ctx.fillRect(0, y, ROWHDR_W, h);
    ctx.strokeStyle = HEADER_BORDER_COLOR;
    ctx.strokeRect(0, y, ROWHDR_W, h);
    ctx.fillStyle = HEADER_TEXT_COLOR;
    ctx.fillText(String(row + 1), 15, y + h / 2);
  }

  // Top-left empty corner box
  ctx.fillStyle = HEADER_NORMAL_COLOR;
  ctx.fillRect(0, 0, ROWHDR_W, HEADER_H);
  ctx.strokeStyle = HEADER_BORDER_COLOR;
  ctx.strokeRect(0, 0, ROWHDR_W, HEADER_H);
}


}

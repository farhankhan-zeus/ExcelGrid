// EventManager.ts
import { HEADER_H, ROWHDR_W } from "../constants.js";
import { IdleState } from "./IdleState.js";
import type { CanvasState } from "./CanvasState.js";
import type { CellEditor } from "../CellEditor.js";
import type { DimensionManager } from "../DimensionManager.js";
import type { ResizeManager } from "../ResizeManager.js";
import type { Selection } from "../Selection.js";
import type { UndoRedoManager } from "../Command/UndoRedoManager.js";
import { EditingState } from "./EditingState.js";

export class EventManager {
  private currentState: CanvasState;

  constructor(
    public canvas: HTMLCanvasElement,
    private scrollBox: HTMLDivElement,
    private editorInput: HTMLInputElement,
    private undoBtn: HTMLButtonElement,
    private redoBtn: HTMLButtonElement,
    public cellEditor: CellEditor,
    public resizeManager: ResizeManager,
    public selection: Selection,
    private undoRedoManager: UndoRedoManager,
    public rowManager: DimensionManager,
    public colManager: DimensionManager,
    private getScrollX: () => number,
    private getScrollY: () => number,
    private setScroll: (x: number, y: number) => void,
    private resizeCanvas: () => void,
    public render: () => void,
    public scrollToActiveCell:()=> void,
  ) {
    // Instantiate with default idle behavior
    this.currentState = new IdleState();
  }

  public changeState(state: CanvasState): void {
    this.currentState = state;
   
  }

  public getCurrentState(): CanvasState {
    return this.currentState;
  }

  // Row selection lookup utility
  public getRowAtY(y: number): number {
    return this.rowManager.getIndexAtOffset(
      Math.max(0, y - HEADER_H + this.getScrollY()),
    );
  }

  // Column selection lookup utility
  public getColAtX(x: number): number {
    return this.colManager.getIndexAtOffset(
      Math.max(0, x - ROWHDR_W + this.getScrollX()),
    );
  }

  public bindEvents(): void {
    // Scrolling
    this.scrollBox.addEventListener("scroll", () => {
      this.setScroll(this.scrollBox.scrollLeft, this.scrollBox.scrollTop);
      this.render();
    });

    // Window resizing
    window.addEventListener("resize", () => {
      this.resizeCanvas();
      this.render();
    });

  
    this.canvas.addEventListener("mousedown", (e) => this.currentState.handleMouseDown(e, this));
    this.canvas.addEventListener("mousemove", (e) => this.currentState.handleMouseMove(e, this));
    window.addEventListener("mouseup", (e) => this.currentState.handleMouseUp(e, this));
    this.canvas.addEventListener("dblclick", (e) => this.currentState.handleDoubleClick(e, this));

 
    this.editorInput.addEventListener("blur", () => {
      this.cellEditor.finishEditing();
      this.changeState(new IdleState());
    });


    window.addEventListener("keydown", (e) => this.keydownhandler(e));
    window.addEventListener("keydown", (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        this.undoRedoManager.undo();
      } else if (e.key.toLowerCase() === "y" && !e.shiftKey) {
        e.preventDefault();
        this.undoRedoManager.redo();
      }
    });

    this.undoBtn.addEventListener("click", () => this.undoRedoManager.undo());
    this.redoBtn.addEventListener("click", () => this.undoRedoManager.redo());
  }

  private keydownhandler(e: KeyboardEvent) {
    const { row, col } = this.selection.getActivecell();
    let newRow = row;
    let newCol = col;
    let moved=false;

    const bounds = this.selection.getBounds();
    const isRangeSelected = (bounds.top !== bounds.bottom) || (bounds.left !== bounds.right);

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        newRow = Math.max(0, row - 1);
         if (newRow<=bounds.top){moved=true}
        break;
      case 'ArrowDown':
        e.preventDefault();
        newRow = Math.min(this.rowManager.getCount() - 1, row + 1);
        if (newRow>=bounds.bottom){moved=true};
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newCol = Math.max(0, col - 1);
         if (newCol<=bounds.left){moved=true}
         break;
         case 'ArrowRight':
           e.preventDefault();
           newCol = Math.min(this.colManager.getCount() - 1, col + 1);
           if (newCol>=bounds.right){moved=true}
        break;
      case ' ':
        e.preventDefault();
        this.cellEditor.startEditing(row, col);
        this.changeState(new EditingState());
        return;

      case 'Tab':
        if (col === this.colManager.getCount()) return;
        e.preventDefault();

        if (isRangeSelected) {
          if (e.shiftKey) {
            if (col === bounds.left) {
              newCol = bounds.right;
              newRow = row === bounds.top ? bounds.bottom : row - 1;
              
            } else {
              newCol = col - 1;
            }
          
            
          } else {
            if (col === bounds.right) {
              newCol = bounds.left;
              newRow = row === bounds.bottom ? bounds.top : row + 1;
            } else {
              newCol = col + 1;
            }
            
          }
        } else {
          if (e.shiftKey) {
            newCol = Math.max(0, col - 1);
              if (newCol<=bounds.left){moved=true}
          } else {
            newCol = Math.min(this.colManager.getCount() - 1, col + 1);
            if (newCol>=bounds.right){moved=true}
          }
        }
        break;

      case 'Enter':
        if ( row === this.rowManager.getCount()) return;
        e.preventDefault();

        if (isRangeSelected) {
          if (e.shiftKey) {
            if (row === bounds.top) {
              newRow = bounds.bottom;
              newCol = col === bounds.left ? bounds.right : col - 1;
            } else {
              newRow = row - 1;
            }
            
          } else {
            if (row === bounds.bottom) {
              newRow = bounds.top;
              newCol = col === bounds.right ? bounds.left : col + 1;
            } else {
              newRow = row + 1;
            }
          
          }
        } else {
          if (e.shiftKey) {
            newRow = Math.max(0, row - 1);
             if (newRow<=bounds.top){moved=true}
          } else {
            newRow = Math.min(this.rowManager.getCount() - 1, row + 1);
              if (newRow>=bounds.bottom){moved=true};
          }
        }
        break;

      default:
        return;
    }

    if (isRangeSelected && (e.key === 'Tab' || e.key === 'Enter')) {
      this.selection.moveActiveCellWithinRange(newRow, newCol); 
    } else {
      this.selection.selectCell(newRow, newCol);
    }

    if (this.cellEditor.isEditing()) {
      this.cellEditor.finishEditing();
      this.changeState(new IdleState());
    }
    if(moved){
      this.scrollToActiveCell();
    }
    this.render();
  }
  
}
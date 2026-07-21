import type { CanvasState } from "./CanvasState.js";
import type { EventManager } from "./EventManager.js";

export class StateContext {
    private state!: CanvasState;
    constructor(_state:CanvasState){
        this.state=_state;
    }

    setState(_state:CanvasState){
        this.state=_state;
    }
    
  hitTest(x: number, y: number, context: EventManager): boolean{
    return this.state.hitTest(x,y,context);
  };
  handleMouseDown(e: MouseEvent, context: EventManager): void{
    this.state.handleMouseDown(e,context);
  };
  handleMouseMove(e: MouseEvent, context: EventManager): void{
    this.state.handleMouseMove(e,context);
  };
  handleMouseUp(e: MouseEvent, context: EventManager): void{
    this.state.handleMouseUp(e,context);
  };
  handleDoubleClick(e: MouseEvent, context: EventManager): void{
    this.state.handleDoubleClick(e,context);
  };
}
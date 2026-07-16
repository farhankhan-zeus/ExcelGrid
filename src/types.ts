import type { EventManager } from "./State/EventManager";



export type BoundType = {top : number, bottom : number, left : number, right : number};
export type EditingCellType =  { row : number, col : number };

export type EditingCellTypeOrNull = EditingCellType | null;



export type EmployeeType = {
    id : number, 
    firstName : string,
    lastName : string,
    age : number,
    salary : number
};

export type CellType = "row" | "col";

export interface HitRegion {
  name: string;
  // Determines if the click (x, y) falls inside this region
  contains: (x: number, y: number) => boolean;
  // What to do when this region is clicked
  onMouseDown: (x: number, y: number, context: EventManager) => void;
}
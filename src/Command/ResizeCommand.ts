import type { Command } from "./Command.ts";
import type { DimensionManager } from "../DimensionManager.ts";
// import type { Selection } from "./Selection.js";
// import type { CellType, EditingCellType, EditingCellTypeOrNull } from "./types.js";


export class ResizeCommand implements Command {

    private dimensionManager : DimensionManager;
    private index : number;
    private oldSize : number;
    private newSize : number;
    private setupSpacer : () => void;
    private render : () => void;

    constructor(
        dimensionManager : DimensionManager,
        index : number,
        oldSize : number,
        newSize : number,
        setupSpacer : () => void,
        render : () => void

    ) {
        // super();

        this.dimensionManager = dimensionManager;
        this.index = index;
        this.oldSize = oldSize;
        this.newSize = newSize;
        this.setupSpacer = setupSpacer;
        this.render = render;
    }


    public undo() : void {
        this.dimensionManager.setSize(this.index, this.oldSize);

        this.setupSpacer();
        this.render();
    }

    public redo() : void {
        this.dimensionManager.setSize(this.index, this.newSize);

        this.setupSpacer();
        this.render();
    }
}
/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import * as PIXI from "pixi.js";

class Grid {
    constructor(cardside) {
        this.cardside = cardside;
    }

    drawGrid() {
        const width = Math.ceil(this.cardside.data.card.width / this.cardside.data.grid.columns);
        const height = Math.ceil(this.cardside.data.card.height / this.cardside.data.grid.rows);
        if (width > 0 && height > 0)
        {
            this.cardside.graphics.grid = new PIXI.Container();

            for (var i = 0; i < this.cardside.data.grid.rows; i++) {
                for (var j = 0; j < this.cardside.data.grid.columns; j++) {
                    let cell = new PIXI.Graphics();
                    cell.lineStyle(1, 0xaeaeae, 1);
                    cell.drawRect(0, 0, width, height);
                    cell.x = j * width;
                    cell.y = i * height;
                    this.cardside.graphics.grid.addChild(cell);
                }
            }
            this.cardside.graphics.card.addChild(this.cardside.graphics.grid);
        }
    }

    cleanGrid() {
        if (this.cardside.graphics.grid !== undefined && this.cardside.graphics.grid !== null)
        {
            this.cardside.graphics.card.removeChild(this.cardside.graphics.grid);
            this.cardside.graphics.grid.destroy(true);
            this.cardside.graphics.grid = null;
        }
    }
}

export default Grid;
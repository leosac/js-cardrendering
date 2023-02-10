import * as PIXI from "pixi.js-legacy";
import {
    reloadTemplate
} from './common';

function editGrid()
{
    this.setState({
        show_gridsettings: true
    });
}

function editGridConfirm(grid)
{
    const oldunit = this.state.grid.unit;
    const oldscale = this.state.grid.scale;
    const oldruler = this.state.grid.ruler;

    const options = Object.keys(grid);
    options.forEach((key) =>
    {
        this.state.grid[key] = grid[key];
    });

    if (oldunit !== this.state.grid.unit || oldruler !== this.state.grid.ruler || oldscale !== this.state.grid.scale)
    {
        reloadTemplate.call(this);
    }
    else
    {
        drawGrid.call(this);
    }
}

function drawGrid(cardSide)
{
    if (cardSide === undefined) {
        this.getSides().forEach(sideType => {
            const side = this.state.sides[sideType];
            cleanGrid(side);
            if (this.state.grid.enabled) {
                drawGrid.call(this, side);
            }
        });
    } else {
        const width = Math.ceil(this.state.cardwidth / this.state.grid.columns);
        const height = Math.ceil(this.state.cardheight / this.state.grid.rows);
        if (width > 0 && height > 0)
        {
            cardSide.grid = new PIXI.Container();

            for (var i = 0; i < this.state.grid.rows; i++) {
                for (var j = 0; j < this.state.grid.columns; j++) {
                    let cell = new PIXI.Graphics();
                    cell.lineStyle(1, 0xaeaeae, 1);
                    cell.drawRect(0, 0, width, height);
                    cell.x = j * width;
                    cell.y = i * height;
                    cardSide.grid.addChild(cell);
                }
            }
            cardSide.card.addChild(cardSide.grid);
        }
    }
}

function cleanGrid(cardSide)
{
    if (cardSide.grid !== undefined && cardSide.grid !== null)
    {
        cardSide.card.removeChild(cardSide.grid);
        cardSide.grid.destroy(true);
        cardSide.grid = null;
    }
}

function toggleGrid()
{
    this.state.grid.enabled = !this.state.grid.enabled;
    this.setState({
        grid: this.state.grid
    });
    
    drawGrid.call(this);
}

export {
    editGrid, editGridConfirm, drawGrid, cleanGrid, toggleGrid
}
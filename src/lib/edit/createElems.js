/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import $ from 'jquery';
import * as PIXI from "pixi.js-legacy";
import {
    onResizeStart, onRotationStart
} from './onEvent';

function createResizeBox(position, scale, sideType)
{
    const rbox = new PIXI.Graphics();
    rbox.lineStyle(1, 0xffffff, 1);
    rbox.beginFill(0x000000);
    if ($(window).width() <= 759 || $(window).height() <= 759)
        rbox.drawRect(0, 0, 12 / scale.x, 12 / scale.y);
    else
        rbox.drawRect(0, 0, 8 / scale.x, 8 / scale.y);
    rbox.zindex = -1001;
    rbox.endFill();
    rbox.interactive = true;
    rbox.buttonMode = true;
    if (position === 'top' || position === 'bottom')
    {
        rbox.cursor = 'ns-resize';
    }
    else if (position === 'rightBottom' || position === 'leftTop')
    {
        rbox.cursor = 'nwse-resize';
    }
    else if (position === 'leftBottom' || position === 'rightTop')
    {
        rbox.cursor = 'nesw-resize';
    }
    else
    {
        rbox.cursor = 'ew-resize';
    }
    rbox
        .on('mousedown', (event) =>
        {
            onResizeStart.call(this, event, position, sideType);
        })
        .on('touchstart', (event) =>
        {
            onResizeStart.call(this, event, position, sideType);
        });
    return rbox;
}

function createRotationBox(position, scale, sideType)
{
    const rbox = new PIXI.Graphics();
    rbox.lineStyle(1, 0xffffff, 1);
    rbox.beginFill(0x000000);
    rbox.drawRect(0, 0, 6 / scale.x, 6 / scale.y);
    rbox.endFill();
    rbox.interactive = true;
    rbox.buttonMode = true;
    rbox.cursor = 'grab';
    rbox
        .on('mousedown', (event) =>
        {
            onRotationStart.call(this, event, position, sideType);
        })
        .on('touchstart', (event) =>
        {
            onRotationStart.call(this, event, position, sideType);
        });
    return rbox;
}

function createSelectedSprite(parent)
{
    const boxwidth = (parent.width + 1) / parent.scale.x;
    const boxheight = parent.height / parent.scale.y;
    const selectgraph = new PIXI.Graphics();
    selectgraph.lineStyle(1, 0x000000, 1);
    selectgraph.drawRect(-1, -1, boxwidth, boxheight);
    selectgraph.lineStyle(1, 0xffffff, 1);
    selectgraph.drawRect(-2, -2, (parent.width + 3) / parent.scale.x , (parent.height + 2) / parent.scale.y);
    
    if (this.state.rotationmode)
    {
        const rsRightBot = createRotationBox.call(this, 'rightBottom', parent.scale, parent.sideType);
        rsRightBot.x = boxwidth - ((rsRightBot.width - 3) / 2);
        rsRightBot.y = boxheight - ((rsRightBot.height - 2) / 2);
        selectgraph.addChild(rsRightBot);

        const rsLeftBot = createRotationBox.call(this, 'leftBottom', parent.scale, parent.sideType);
        rsLeftBot.x = -((rsLeftBot.width + 3) / 2);
        rsLeftBot.y = boxheight - ((rsLeftBot.height - 2) / 2);
        selectgraph.addChild(rsLeftBot);

        const rsLeftTop = createRotationBox.call(this, 'leftTop', parent.scale, parent.sideType);
        rsLeftTop.x = -((rsLeftTop.width + 3) / 2);
        rsLeftTop.y = -((rsLeftTop.height + 2) / 2);
        selectgraph.addChild(rsLeftTop);

        const rsRightTop = createRotationBox.call(this, 'rightTop', parent.scale, parent.sideType);
        rsRightTop.x = boxwidth - ((rsRightTop.width - 3) / 2);
        rsRightTop.y = -((rsRightTop.height + 2) / 2);
        selectgraph.addChild(rsRightTop);
    }
    else
    {
        const rstop = createResizeBox.call(this, 'top', parent.scale, parent.sideType);
        rstop.x = (boxwidth - 6) / 2;
        rstop.y = -((rstop.height + 2) / 2);
        selectgraph.addChild(rstop);

        const rsbottom = createResizeBox.call(this, 'bottom', parent.scale, parent.sideType);
        rsbottom.x = (boxwidth - 6) / 2;
        rsbottom.y = boxheight - ((rsbottom.height - 2) / 2);
        selectgraph.addChild(rsbottom);

        const rsleft = createResizeBox.call(this, 'left', parent.scale, parent.sideType);
        rsleft.x = -((rsleft.width + 3) / 2);
        rsleft.y = (boxheight - 6) / 2;
        selectgraph.addChild(rsleft);

        const rsright = createResizeBox.call(this, 'right', parent.scale, parent.sideType);
        rsright.x = boxwidth - ((rsleft.width - 3) / 2);
        rsright.y = (boxheight - 6) / 2;
        selectgraph.addChild(rsright);

        const rsRightBot = createResizeBox.call(this, 'rightBottom', parent.scale, parent.sideType);
        rsRightBot.x = boxwidth - ((rsleft.width - 3) / 2);
        rsRightBot.y = boxheight - ((rsbottom.height - 2) / 2);
        selectgraph.addChild(rsRightBot);

        const rsLeftBot = createResizeBox.call(this, 'leftBottom', parent.scale, parent.sideType);
        rsLeftBot.x = -((rsLeftBot.width + 3) / 2);
        rsLeftBot.y = boxheight - ((rsbottom.height - 2) / 2);
        selectgraph.addChild(rsLeftBot);

        const rsLeftTop = createResizeBox.call(this, 'leftTop', parent.scale, parent.sideType);
        rsLeftTop.x = -((rsLeftBot.width + 3) / 2);
        rsLeftTop.y = -((rstop.height + 2) / 2);
        selectgraph.addChild(rsLeftTop);

        const rsRightTop = createResizeBox.call(this, 'rightTop', parent.scale, parent.sideType);
        rsRightTop.x = boxwidth - ((rsleft.width - 3) / 2);
        rsRightTop.y = -((rstop.height + 2) / 2);
        selectgraph.addChild(rsRightTop);
    }
    parent.box = selectgraph;

    return selectgraph;
}

export {
    createResizeBox, createRotationBox, createSelectedSprite
}
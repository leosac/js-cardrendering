/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import * as PIXI from "pixi.js";
import { createCanvas } from "canvas";
import bwipjs from 'bwip-js';
import { decimalToHexColor, hexColorToSignedNumber, pixelToInch, inchToMillimeter } from "./convert";
import CardHelper from './helpers';

const fingerimg = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI4My40NiAyODMuNDYiIGhlaWdodD0iNTEycHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyODMuNDYgMjgzLjQ2IiB3aWR0aD0iNTEycHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnPjxnPjxwYXRoIGQ9Ik0yMi44NTUsODEuMDg3ICAgIEM5LjU0MywxMDcuMDgyLDQuNjEsMTM3LjU5NiwxMC44MzIsMTY4LjQ1MSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLXdpZHRoPSI4Ii8+PHBhdGggZD0iTTIwMC44NzUsMjEuODM1ICAgIGMtMjUuNTQzLTEyLjUzOC01NS4yNzEtMTcuMDYtODUuMzIxLTExLjAwMWMtMzQuMTM2LDYuODgyLTYyLjU5MywyNi4xODctODEuNjE4LDUyLjI1NyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLXdpZHRoPSI4Ii8+PHBhdGggZD0iTTI3My4xNjQsMTE1LjU1NSAgICBjLTcuMDYtMzUuMDEzLTI3LjE4OS02NC4wNTYtNTQuMjg1LTgzLjA3IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjgiLz48L2c+PC9nPjxnPjxnPjxwYXRoIGQ9Ik0yNzUuODc3LDE0NC42OTUgICAgYzAuMTg0LTkuNTk0LTAuNjY2LTE5LjM1Ny0yLjY0MS0yOS4xNTQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iOCIvPjxwYXRoIGQ9Ik0xMC45MDQsMTY4LjQzOCAgICBjMC4zODgsMS45MjEsMC44MTQsMy44MjQsMS4yNzksNS43MDkiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iOCIvPjwvZz48L2c+PHBhdGggZD0iTTEwNy40NTQsMjcxLjI5ICBjMjkuOTc3LTM0LjExOSw0NC4yNDktODEuMzQsMzQuNTc5LTEyOS4yOTQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iOCIvPjxwYXRoIGQ9Ik0xMTkuMTc2LDIyMC4zMzggIGMtNi41NTUsMTYuNzk4LTE2LjQ0MywzMi4xMzEtMjkuMDIsNDUuMDI2IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjgiLz48cGF0aCBkPSJNMTI2LjE4NywyNzQuODk2ICBjMjkuMDUxLTM3LjE3NSw0Mi4zMDItODYuMzMzLDMyLjI0NS0xMzYuMjA1bDAuMDUyLTAuMDE3Yy0xLjgzNi05LjEwNC0xMC43MDMtMTQuOTk2LTE5LjgwNy0xMy4xNiAgYy05LjEwMywxLjgzNi0xNC45OTQsMTAuNzAzLTEzLjE1OSwxOS44MDhsMC4xMTktMC4wMmMzLjc0NiwxOC41ODEsMy40NSwzNy4wNC0wLjI4NCw1NC40NjUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iOCIvPjxwYXRoIGQ9Ik0xMTAuNTEsMTU2LjE0NCAgYzUuMjQ1LDM4LjcwMS05LjIxNSw3Ni4wODItMzYuMTYyLDEwMS4yOTMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iOCIvPjxwYXRoIGQ9Ik0xNzguNDk0LDE3MS40MzQgIGMtMC4wMzMtMTEuODktMS4yMjctMjMuOTUtMy42NjYtMzYuMDQ5bDAuMDM3LTAuMDE0Yy0zLjY1OS0xOC4xNTItMjEuMzQtMjkuOTAxLTM5LjQ5Mi0yNi4yNCAgYy0xMy41NTksMi43MzQtMjMuNTQ2LDEzLjI5Mi0yNi4yMDMsMjYuMDI3IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjgiLz48cGF0aCBkPSJNMTQ2LjI3MywyNzUuNzQ4ICBjMTYuNzQ0LTI0LjQ2OSwyNy42MDYtNTIuOTM5LDMxLjA0NS04My4wOTgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iOCIvPjxwYXRoIGQ9Ik0xNDUuOTMsOTEuODk4ICBjLTQuNTI5LTAuMzUzLTkuMTg0LTAuMDkzLTEzLjg1OSwwLjg1Yy0yNy4yMDEsNS40ODUtNDQuODA1LDMxLjk3OS0zOS4zMiw1OS4xODJsMC4wOTQtMC4wMTYgIGM3LjQxOCwzNi43OTItNi4yOTMsNzIuOTM4LTMyLjc3OSw5NS44NzYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iOCIvPjxwYXRoIGQ9Ik0xNjcuNjA4LDI3My4zMjQgIGMyNC4xMDgtNDEuMDk4LDMzLjc3Ni05MC44NjcsMjMuNjE3LTE0MS4yNDZsMC4wMjQtMC4wMWMtMy4wMjMtMTQuOTg4LTEyLjQyNC0yNy4wNjMtMjQuODA3LTMzLjk2NyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLXdpZHRoPSI4Ii8+PHBhdGggZD0iTTcyLjQ1NywyMDEuOTkyICBjLTUuMjI4LDEzLjQ2MS0xMy44NzcsMjUuNDIyLTI1LjA5NSwzNC42MTEiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iOCIvPjxwYXRoIGQ9Ik0yMDkuMDg0LDIwNy4wNiAgYzQuMTYyLTI1LjI2NiwzLjktNTEuNjk3LTEuNDYxLTc4LjI4N2wwLjAxLTAuMDA3Yy03LjMxLTM2LjI1LTQyLjYxNy01OS43MDktNzguODY1LTUyLjRjLTM2LjI1LDcuMzEtNTkuNzEsNDIuNjE4LTUyLjQsNzguODY5ICBsMC4wNzgtMC4wMTZjMS43MzYsOC42MSwyLjA4NCwxNy4xNzgsMS4xOTcsMjUuNDciIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iOCIvPjxwYXRoIGQ9Ik0xOTAuMDA2LDI2Ni45MDkgIGM2LjA2OC0xMi40NTYsMTAuOTY3LTI1LjUyLDE0LjU4Mi0zOS4wMjEiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iOCIvPjxwYXRoIGQ9Ik0yMDkuNjY2LDkyLjc1OCAgYzYuODgzLDkuNDQ3LDExLjg4NywyMC40OTYsMTQuMzUsMzIuNzA1bDAuMDA1LDAuMDA0YzkuMDk1LDQ1LjEwNCw0LjU2Myw4OS43ODktMTAuNzQ0LDEyOS44MDYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iOCIvPjxwYXRoIGQ9Ik0xMDcuMDcsNjUuOTUyICBjNS43Ni0yLjY0LDExLjkxMy00LjY2MywxOC4zOTMtNS45NjljMjUuNjA5LTUuMTYzLDUwLjg0MiwxLjk2Miw2OS41ODgsMTcuMzE1IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjgiLz48cGF0aCBkPSJNMzYuMjc1LDIyNC4wNSAgYzE4LjkwMi0xNS4xODUsMjguODk2LTQwLjExOCwyMy43NzEtNjUuNTI0bC0wLjA2MywwLjAxNGMtNi4zNjYtMzEuNTY3LDUuOTQtNjIuNTYyLDI5LjMxNS04MS41NDQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iOCIvPjxwYXRoIGQ9Ik00MS42ODQsMTQ1Ljk3NiAgYzAuMjE1LDUuMjUsMC44NDQsMTAuNTUyLDEuOTE2LDE1Ljg2N2wwLjA1MS0wLjAxM2MzLjc1MiwxOC42MDctMy4yOTUsMzYuODgxLTE2LjgyMSw0OC4zNDMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iOCIvPjxwYXRoIGQ9Ik0yNDIuNjksMTM1LjE1NiAgYy0wLjY0Mi00LjMyNi0xLjM5OS04LjY1OC0yLjI3Mi0xMi45OTRsLTAuMDItMC4wMDFDMjI5LjQ0LDY3LjgxMywxNzYuNTA2LDMyLjY0MywxMjIuMTYsNDMuNiAgYy00MS43NjUsOC40MjItNzIuMjA3LDQxLjYzNS03OS4wODgsODEuMjI5IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjgiLz48cGF0aCBkPSJNMjM2Ljk4MywyMzYuMjU4ICBjNi44MjYtMjUuNjAzLDkuNjY0LTUyLjU2NCw3LjkzMS04MC4wMjkiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iOCIvPjxwYXRoIGQ9Ik0xNTcuNjg4LDI1LjkzMSAgYy0xMi41OTItMS43MDEtMjUuNjc1LTEuMzY2LTM4LjgzLDEuMjg3QzU1LjQ2MSw0MCwxNC40MzIsMTAxLjc1LDI3LjIxNSwxNjUuMTQ2bDAuMDM5LTAuMDFjMi4yMTksMTEtMS4yMjUsMjEuODIzLTguMzEzLDI5LjQ3IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjgiLz48cGF0aCBkPSJNMjYwLjEwNCwyMDQuODk2ICBjMy40NzktMjcuOTQ1LDIuNTg0LTU2LjkxNi0zLjI4OS04Ni4wNDFsLTAuMDMzLDAuMDAyYy04LjY5My00My4xMTItNDAuMDMxLTc1Ljg3OC03OS4xMjktODguNDEzIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjgiLz48L3N2Zz4=";

function setFieldBorder(box, border) {
    const width = Number(border.width);
    if (width > 0)
    {
        box.lineStyle(width, hexColorToSignedNumber(border.color), 1);
    }
}

function createTextField(options, scale = 1)
{
    options.type = 'label';
    const text = new PIXI.Text(options.value);
    let style = [];
    style['fill'] = options.color ? hexColorToSignedNumber(options.color) : 0x000000;
    style['fontFamily'] = options.fontFamily ? options.fontFamily : 'Verdana';
    style['fontSize'] = options.fontSize ? options.fontSize : '12pt';
    if (options.fontStyle) {
        if (options.fontStyle === "Normal" || options.fontStyle === "Italic") {
            style['fontStyle'] = options.fontStyle;
            style['fontWeight'] = "Normal";
        } else if (options.fontStyle === "Bold") {
            style['fontStyle'] = "Normal";
            style['fontWeight'] = "Bold";
        }
    } else {
        options.fontStyle = "Normal";
    }
    text.style = style;
    text.resolution = scale;
    if (options.wordBreak) {
        text.wordWrap = true;
        text.wordWrapWidth = options.width;
    }
    if (options.scaleFont) {
        let scale;
        if (options.scaleFont === true || options.scaleFont === 'always') {
            scale = true;
        } else if (options.scaleFont === 'exceed') {
            scale = (text.width > options.width) || (text.height > options.height);
        } else {
            scale = false;
        }

        if (scale) {
            text.width = options.width;
            text.height = options.height;
        }
    }
    if (!options.autoSize) {
        while (text.width > options.width && text.text.length > 0) {
            text.text = text.text.substring(0, text.text.length - 1);
        }
    }

    let label;
    if (options.colorFill !== '' && options.colorFill !== undefined) {
        const width = options.autoSize ? text.width : options.width;
        const height = options.autoSize ? text.height : options.height;

        if (options.align === 'TopLeft') {
            text.anchor.set(0, 0);
            text.position.set(0, 0);
        } else if (options.align === 'TopCenter') {
            text.anchor.set(0.5, 0);
            text.position.set(width / 2, 0);
        } else if (options.align === 'TopRight') {
            text.anchor.set(1, 0);
            text.position.set(width, 0);
        } else if (options.align === 'MiddleLeft') {
            text.anchor.set(0, 0.5);
            text.position.set(0, height / 2);
        } else if (options.align === 'MiddleCenter') {
            text.anchor.set(0.5, 0.5);
            text.position.set(width / 2, height / 2);
        } else if (options.align === 'MiddleRight') {
            text.anchor.set(1, 0.5);
            text.position.set(width, height / 2);
        } else if (options.align === 'BottomLeft') {
            text.anchor.set(0, 1);
            text.position.set(0, height);
        } else if (options.align === 'BottomCenter') {
            text.anchor.set(0.5, 1);
            text.position.set(width / 2, height);
        } else if (options.align === 'BottomRight') {
            text.anchor.set(1, 1);
            text.position.set(width, height);
        }

        label = new PIXI.Graphics();
        setFieldBorder(label, options.border);
        let alpha = 1;
        if (options.colorFill === -1) {
            alpha = 0;
        }
        label.beginFill(hexColorToSignedNumber(options.colorFill), alpha);
        label.drawRect(0, 0, width, height);
        label.endFill();
        label.addChild(text);

        options.width = width;
        options.height = height;
    } else {
        label = text;
    }
    label.position.set(options.x, options.y);
    label.options = options;

    if (options.rotation > 0) {
        label.angle = options.rotation;
    }
    return label;
}

async function createBwipSprint(options, bwopts, dpi = 300) {
    try {
        let pngDataURL;
        let height = (options.height) ? options.height : 100;
        let width = (options.width) ? options.width : 100;
        
        if (!bwopts.height) {
            bwopts.height = inchToMillimeter(pixelToInch(height, dpi));
        }
        if (!bwopts.width) {
            bwopts.width = inchToMillimeter(pixelToInch(width, dpi));
        }

        if (bwipjs.toCanvas) {
            const canvas = createCanvas(height, width);
            bwipjs.toCanvas(canvas, bwopts);
            pngDataURL = canvas.toDataURL('image/png');
            height = canvas.height;
            width = canvas.width;
        } else {
            const png = await bwipjs.toBuffer(bwopts);
            pngDataURL = "data:image/png;base64," + png.toString("base64");
        }
        const texture = await PIXI.Assets.load(pngDataURL);
        const sprite = PIXI.Sprite.from(texture);
        sprite.options = options;
        sprite.x = options.x;
        sprite.y = options.y;
        sprite.height = height;
        sprite.width = width;
        options.height = height;
        options.width = width;
        if (options.rotation > 0) {
            sprite.angle = options.rotation;
        }
        return sprite;
    } catch (e) {
        console.log(e);
        console.error("jscardrendering : Error during bwipjs generation");
    }
}

async function createBarcodeField(options, dpi = 300)
{
    options.type = 'barcode';
    const bwopts = {
        bcid:        options.fontFamily.toLowerCase(),
        text:        options.value,
        includetext: false,
        backgroundcolor: (options.colorFill && options.colorFill !== -1) ? decimalToHexColor(hexColorToSignedNumber(options.colorFill)) : null,
        barcolor: decimalToHexColor(hexColorToSignedNumber(options.color))
    };
    return await createBwipSprint(options, bwopts, dpi);
}

async function createQRCodeField(options, dpi = 300)
{
    options.type = 'qrcode';
    const bwopts = {
        bcid:        'qrcode',
        text:        options.value,
        includetext: false,
        backgroundcolor: (options.colorFill && options.colorFill !== -1) ? decimalToHexColor(hexColorToSignedNumber(options.colorFill)) : null,
        barcolor: decimalToHexColor(hexColorToSignedNumber(options.color)),
        eclevel: options.ecLevel
    };
    return await createBwipSprint(options, bwopts, dpi);
}

async function createPDF417Field(options, dpi = 300)
{
    options.type = 'pdf417';
    const bwopts = {
        bcid:        'pdf417',
        text:        options.value,
        includetext: true,
        textxalign:  'center',
        backgroundcolor: (options.colorFill && options.colorFill !== -1) ? decimalToHexColor(hexColorToSignedNumber(options.colorFill)) : null,
        barcolor: decimalToHexColor(hexColorToSignedNumber(options.color)),
        eclevel: options.ecLevel
    };
    return await createBwipSprint(options, bwopts, dpi);
}

async function createDatamatrixField(options, dpi = 300)
{
    options.type = 'datamatrix';
    options.sizeIdx = Number(options.sizeIdx);
    options.scheme = Number(options.scheme);
    const bwopts = {
        text:        options.value,
        includetext: true,
        textxalign:  'center',
        backgroundcolor: (options.colorFill && options.colorFill !== -1) ? decimalToHexColor(hexColorToSignedNumber(options.colorFill)) : null,
        barcolor: decimalToHexColor(hexColorToSignedNumber(options.color))
    };
    
    if (options.scheme === 0)
    {
        //ASCII
        if (options.sizeIdx === -2 || (options.sizeIdx >= 0 && options.sizeIdx <= 23) )
        {
            //Square
            bwopts.bcid = "datamatrix";
            bwopts.format = "square";
            if (options.sizeIdx !== -2)
                bwopts.version = CardHelper.getDataMatrixSizeIdx().find(idx => idx.value === options.sizeIdx).label;
        }
        else if (options.sizeIdx === -3 || (options.sizeIdx >= 24 && options.sizeIdx <= 29) )
        {
            //Rectangle
            bwopts.bcid = "datamatrixrectangular";
            bwopts.format = "rectangle";
            if (options.sizeIdx !== -3)
                bwopts.version = CardHelper.getDataMatrixSizeIdx().find(idx => idx.value === options.sizeIdx).label;
        }
    }
    else if (options.scheme === 6)
    {
        bwopts.bcid = "gs1datamatrix";
        if (options.sizeIdx === -2 || (options.sizeIdx >= 0 && options.sizeIdx <= 23) )
        {
            bwopts.format = "square";
            if (options.sizeIdx !== -2)
                bwopts.version = CardHelper.getDataMatrixSizeIdx().find(idx => idx.value === options.sizeIdx).label;
        }
        else if (options.sizeIdx === -3 || (options.sizeIdx >= 24 && options.sizeIdx <= 29) )
        {
            bwopts.format = "rectangle";
            if (options.sizeIdx !== -3)
                bwopts.version = CardHelper.getDataMatrixSizeIdx().find(idx => idx.value === options.sizeIdx).label;
        }   
    }
    return await createBwipSprint(options, bwopts, dpi);
}

function createFingerprintField(options)
{
    options.type = 'fingerprint';
    const texture = PIXI.Texture.from(fingerimg);
    const sprite = new PIXI.Sprite(texture);

    const box = new PIXI.Graphics();
    const configureImage = () =>
    {
        sprite.width = options.width;
        sprite.height = options.height;
        setFieldBorder(box, options.border);
        if (options.rotation > 0)
        {
            sprite.angle = options.rotation;
        }
        box.beginFill(0, 0);
        box.drawRect(0, 0, options.width, options.height);
        box.endFill();
        box.addChild(sprite);

        box.position.set(options.x, options.y);
        box.options = options;
    };

    // Image is ready, apply options etc now.
    if (texture.baseTexture.valid)
    {
        configureImage();
    }
    // Or we set a callback to configure the image when
    // the texture is loaded.
    else
    {
        texture.once("update", configureImage);
    }
    return box;
}

async function createTextureFromDataUrl(url) {
    try
    {
        return await PIXI.Assets.load(url);
    }
    catch
    {
        await PIXI.Assets.unload(url);
        return await PIXI.Assets.load(url);
    }
}

async function createPictureField(options, createOpt)
{
    options.type = 'picture';
    let texture;
    if (options.value) {
        texture = await createTextureFromDataUrl(options.value);
    } else {
        texture = PIXI.Texture.WHITE;
    }
    const sprite = new PIXI.Sprite(texture);

    const box = new PIXI.Graphics();
    const configureImage = () =>
    {
        const autoSizeImg = createOpt && createOpt.autoSizeImg;
        if (autoSizeImg)
        {
            if (createOpt.maxWidth && createOpt.maxHeight)
            {
                const xscale = createOpt.maxWidth / sprite.width;
                const yscale = createOpt.maxHeight / sprite.height;

                // We don't want to extend the image, only shrink it if
                // its too big.
                const scale = yscale < xscale ? yscale : xscale;
                if (scale < 1)
                    sprite.scale = new PIXI.Point(scale, scale);
            }
        }
        else
        {
            sprite.width = options.width;
            sprite.height = options.height;
        }
        options.width = sprite.width;
        options.height = sprite.height;
        setFieldBorder(box, options.border);
        box.beginFill(0, 0);
        box.drawRect(0, 0, options.width, options.height);
        box.endFill();
        box.addChild(sprite);

        box.position.set(options.x, options.y);
        box.options = options;

        if (options.rotation > 0)
        {
            box.angle = options.rotation;
        }
    };
    // Image is ready, apply options etc now.
    if (texture.baseTexture.valid)
    {
        configureImage();
    }
    // Or we set a callback to configure the image when
    // the texture is loaded.
    else
    {
        texture.once("update", configureImage);
    }
    return box;
}

function createRectangleShapeField(options)
{
    options.type = 'rectangle';
    const rectangle = new PIXI.Graphics();
    rectangle.options = options;
    setFieldBorder(rectangle, options.border);
    let alpha = 1;
    if (options.color === -1) {
        alpha = 0;
    }
    rectangle.beginFill(hexColorToSignedNumber(options.color), alpha);
    rectangle.drawRect(0, 0, options.width, options.height);
    rectangle.endFill();
    rectangle.position.set(options.x, options.y);
    if (options.rotation > 0)
    {
        rectangle.angle = options.rotation;
    }
    return rectangle;
}

function createCircleShapeField(options)
{
    options.type = 'circle';
    const circle = new PIXI.Graphics();
    circle.options = options;
    setFieldBorder(circle, options.border);
    let alpha = 1;
    if (options.color === -1) {
        alpha = 0;
    }
    circle.beginFill(hexColorToSignedNumber(options.color), alpha);
    circle.drawEllipse((options.width / 2), (options.height / 2), options.width / 2, options.height / 2);
    circle.endFill();
    circle.x = options.x;
    circle.y = options.y;
    if (options.rotation > 0)
    {
        circle.angle = options.rotation;
    }
    return circle;
}

export {
    createFingerprintField, createCircleShapeField, createPictureField,
    createQRCodeField, createRectangleShapeField, createTextField,
    createBarcodeField, createPDF417Field, createDatamatrixField
};

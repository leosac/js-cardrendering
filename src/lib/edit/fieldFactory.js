/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import * as PIXI from "pixi.js-legacy";
import bwipjs from 'bwip-js';
import QRCode from 'qrcode';
import { hexColorToSignedNumber } from "./convert";
import GeneralHelper from '../GeneralHelper';

function createTextField(options)
{
    options.type = 'label';
    const text = new PIXI.Text(options.value);
    let style = [];
    style['fill'] = options.color ? hexColorToSignedNumber(options.color) : 0x000000;
    style['fontFamily'] = options.fontFamily ? options.fontFamily : 'Verdana';
    style['fontSize'] = options.fontSize ? options.fontSize : '12pt';
    if (options.fontStyle)
    {
        if (options.fontStyle === "Normal" || options.fontStyle === "Italic")
        {
            style['fontStyle'] = options.fontStyle;
            style['fontWeight'] = "Normal";
        }
        else if (options.fontStyle === "Bold")
        {
            style['fontStyle'] = "Normal";
            style['fontWeight'] = "Bold";
        }
    }
    else
        options.fontStyle = "Normal";
    text.style = style;
    if (options.wordBreak)
    {
        text.wordWrap = true;
        text.wordWrapWidth = options.width;
    }
    if (options.scaleFont)
    {
        text.width = options.width;
        text.height = options.height;
    }
    if (!options.autoSize)
    {
        while (text.width > options.width && text.text.length > 0)
        {
            text.text = text.text.substring(0, text.text.length - 1);
        }
    }

    let label;
    if (options.colorFill !== '' && options.colorFill !== undefined)
    {
        const width = options.autoSize ? text.width : options.width;
        const height = options.autoSize ? text.height : options.height;

        if (options.align === 'TopLeft')
        {
            text.anchor.set(0, 0);
            text.position.set(0, 0);
        } else if (options.align === 'TopCenter')
        {
            text.anchor.set(0.5, 0);
            text.position.set(width / 2, 0);
        } else if (options.align === 'TopRight')
        {
            text.anchor.set(1, 0);
            text.position.set(width, 0);
        } else if (options.align === 'MiddleLeft')
        {
            text.anchor.set(0, 0.5);
            text.position.set(0, height / 2);
        } else if (options.align === 'MiddleCenter')
        {
            text.anchor.set(0.5, 0.5);
            text.position.set(width / 2, height / 2);
        } else if (options.align === 'MiddleRight')
        {
            text.anchor.set(1, 0.5);
            text.position.set(width, height / 2);
        } else if (options.align === 'BottomLeft')
        {
            text.anchor.set(0, 1);
            text.position.set(0, height);
        } else if (options.align === 'BottomCenter')
        {
            text.anchor.set(0.5, 1);
            text.position.set(width / 2, height);
        } else if (options.align === 'BottomRight')
        {
            text.anchor.set(1, 1);
            text.position.set(width, height);
        }

        label = new PIXI.Graphics();
        if (options.borderWidth > 0)
        {
            label.lineStyle(options.borderWidth, options.borderColor, 1);
        }
        let alpha = 1;
        if (options.colorFill === -1)
        {
            alpha = 0;
        }
        label.beginFill(hexColorToSignedNumber(options.colorFill), alpha);
        label.drawRect(0, 0, width, height);
        label.endFill();
        label.addChild(text);

        options.width = width;
        options.height = height;
    } else
    {
        label = text;
    }
    label.position.set(options.x, options.y);
    label.options = options;

    if (options.rotation > 0)
    {
        label.rotation = PIXI.DEG_TO_RAD * options.rotation;
    }
    return label;
}

function createUrlLinkField(options)
{
    options.type = 'urllink';
    const text = new PIXI.Text(options.value);
    let style = [];
    style['fill'] = options.color ? hexColorToSignedNumber(options.color) : 0x000000;
    style['fontFamily'] = options.fontFamily ? options.fontFamily : 'Verdana';
    style['fontSize'] = options.fontSize ? options.fontSize : '12pt';
    if (options.fontStyle)
    {
        style['fontStyle'] = options.fontStyle;
    }
    text.style = style;

    if (options.scaleFont)
    {
        text.width = options.width;
        text.height = options.height;
    }
    if (!options.autoSize)
    {
        while (text.width > options.width && text.text.length > 0)
        {
            text.text = text.text.substring(0, text.text.length - 1);
        }
    }

    let label;
    if (options.colorFill !== '' && options.colorFill !== undefined)
    {
        const width = options.autoSize ? text.width : options.width;
        const height = options.autoSize ? text.height : options.height;

        label = new PIXI.Graphics();
        if (options.borderWidth > 0)
        {
            label.lineStyle(options.borderWidth, options.borderColor, 1);
        }
        let alpha = 1;
        if (options.colorFill === -1)
        {
            alpha = 0;
        }
        label.beginFill(hexColorToSignedNumber(options.colorFill), alpha);
        label.drawRect(0, 0, width, height);
        label.endFill();
        label.addChild(text);

        options.width = width;
        options.height = height;
    } else
    {
        label = text;
    }
    label.position.set(options.x, options.y);
    label.options = options;

    if (options.rotation > 0)
    {
        label.rotation = PIXI.DEG_TO_RAD * options.rotation;
    }
    return label;
}

function createBarcodeField(options)
{
    options.type = 'barcode';
    const barcode = new PIXI.Text(options.value);
    let style = [];
    //style['fill'] = options.color;
    style['fontFamily'] = options.fontFamily;
    style['fontSize'] = options.fontSize + 'pt';
    barcode.style = style;
    barcode.position.set(options.x, options.y);
    barcode.options = options;
    options.height = barcode.height;
    options.width = barcode.width;
    if (options.rotation > 0)
    {
        barcode.rotation = PIXI.DEG_TO_RAD * options.rotation;
    }
    return barcode;
}

async function createQRCodeField(options)
{
    options.type = 'qrcode';

    // Async would be great, but too much refactoring
    const qrcode_src = await QRCode.toDataURL(options.value, { errorCorrectionLevel: options.eclevel });
    const sprite = PIXI.Sprite.from(qrcode_src);

    sprite.options = options;
    sprite.x = options.x;
    sprite.y = options.y;
    sprite.height = options.height;
    sprite.width = options.width;

    if (options.rotation > 0)
    {
        sprite.rotation = PIXI.DEG_TO_RAD * options.rotation;
    }
    return sprite;
}

function createPDF417Field(options)
{
    options.type = 'pdf417';
    let canvas = document.createElement('canvas');
    try {
        bwipjs.toCanvas(canvas, {
            bcid:        'pdf417',          // Barcode type
            text:        options.value,     // Text to encode
            includetext: true,              // Show human-readable text
            textxalign:  'center',          // Always good to set this
            backgroundcolor: options.colorFill !== -1 ? hexColorToSignedNumber(options.colorFill) : null, //Background color
            barcolor: hexColorToSignedNumber(options.color), //Color
            eclevel: options.ecLevel        //Correction level
        });
        const sprite = PIXI.Sprite.from(canvas.toDataURL('image/png'));
    
        sprite.options = options;
        sprite.x = options.x;
        sprite.y = options.y;
        sprite.height = canvas.height;
        sprite.width = canvas.width;
        options.height = sprite.height;
        options.width = sprite.width;
    
        if (options.rotation > 0)
        {
            sprite.rotation = PIXI.DEG_TO_RAD * options.rotation;
        }
        return sprite;

    } catch (e) {
        console.error("jscardrendering : Error during pdf417 generation");
    }
}

function createDatamatrixField(options)
{
    options.type = 'dataMatrix';
    options.SizeIdx = Number(options.SizeIdx);
    options.Scheme = Number(options.Scheme);
    let canvas = document.createElement('canvas');
    try {
        let bwOptions = {
            text:        options.value,   // Text to encode
            includetext: true,            // Show human-readable text
            textxalign:  'center',        // Always good to set this
            backgroundcolor: options.colorFill !== -1 ? hexColorToSignedNumber(options.colorFill) : null, //Background color
            barcolor: hexColorToSignedNumber(options.color), //Color
        };

        if (options.Scheme === 0)
        {
            //ASCII
            if (options.SizeIdx === -2 || (options.SizeIdx >= 0 && options.SizeIdx <= 23) )
            {
                //Square
                bwOptions.bcid = "datamatrix";
                bwOptions.format = "square";
                if (options.SizeIdx !== -2)
                    bwOptions.version = GeneralHelper.getDataMatrixSizeIdx().find(idx => idx.value === options.SizeIdx).label;
            }
            else if (options.SizeIdx === -3 || (options.SizeIdx >= 24 && options.SizeIdx <= 29) )
            {
                //Rectangle
                bwOptions.format = "rectangle";
                bwOptions.bcid = "datamatrixrectangular";
                if (options.SizeIdx !== -3)
                    bwOptions.version = GeneralHelper.getDataMatrixSizeIdx().find(idx => idx.value === options.SizeIdx).label;
            }
        }
        else if (options.Scheme === 6)
        {
            //Faire un controle des datas pour voir si l input est valide afin de pas faire crash l appli
            //ASCII GS1
            bwOptions.bcid = "gs1datamatrix";
            if (options.SizeIdx === -2 || (options.SizeIdx >= 0 && options.SizeIdx <= 23) )
            {
                bwOptions.format = "square";
                if (options.SizeIdx !== -2)
                    bwOptions.version = GeneralHelper.getDataMatrixSizeIdx().find(idx => idx.value === options.SizeIdx).label;
            }
            else if (options.SizeIdx === -3 || (options.SizeIdx >= 24 && options.SizeIdx <= 29) )
            {
                bwOptions.format = "rectangle";
                if (options.SizeIdx !== -3)
                    bwOptions.version = GeneralHelper.getDataMatrixSizeIdx().find(idx => idx.value === options.SizeIdx).label;
            }   
        }


        bwipjs.toCanvas(canvas, bwOptions);
        const sprite = PIXI.Sprite.from(canvas.toDataURL('image/png'));
    
        sprite.options = options;
        sprite.x = options.x;
        sprite.y = options.y;
        sprite.height = options.height;
        sprite.width = options.width;
    
        if (options.rotation > 0)
        {
            sprite.rotation = PIXI.DEG_TO_RAD * options.rotation;
        }
        return sprite;

    } catch (e) {
        console.log(e)
        console.error("jscardrendering : Error during datamatrix generation");
    }
}

function createFingerprintField(options)
{
    options.type = 'fingerprint';
    const texture = PIXI.Texture.from('/packages/leosac_jscardrendering/src/img/finger-black.svg');
    const sprite = new PIXI.Sprite(texture);

    const box = new PIXI.Graphics();
    const configureImage = () =>
    {
        sprite.width = options.width;
        sprite.height = options.height;

        if (options.borderWidth > 0)
        {
            box.lineStyle(options.borderWidth, hexColorToSignedNumber(options.borderColor), 1);
        }
        if (options.rotation > 0)
        {
            sprite.rotation = PIXI.DEG_TO_RAD * options.rotation;
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
        texture.on("update", configureImage);
    }
    return box;
}

function createPictureField(options, createOpt)
{
    options.type = 'picture';
    const texture = PIXI.Texture.from(options.value);
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

        if (options.borderWidth > 0)
        {
            box.lineStyle(options.borderWidth, hexColorToSignedNumber(options.borderColor), 1);
        }
        box.beginFill(0, 0);
        box.drawRect(0, 0, options.width, options.height);
        box.endFill();
        box.addChild(sprite);

        box.position.set(options.x, options.y);
        box.options = options;

        if (options.rotation > 0)
        {
            box.rotation = PIXI.DEG_TO_RAD * options.rotation;
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
        texture.on("update", configureImage);
    }
    return box;
}

function createRectangleShapeField(options)
{
    options.type = 'rectangle';
    const rectangle = new PIXI.Graphics();
    rectangle.options = options;
    rectangle.lineStyle(options.borderWidth, hexColorToSignedNumber(options.borderColor));
    rectangle.beginFill(hexColorToSignedNumber(options.color));
    rectangle.drawRect(0, 0, options.width, options.height);
    rectangle.endFill();
    rectangle.position.set(options.x, options.y);
    if (options.rotation > 0)
    {
        rectangle.rotation = PIXI.DEG_TO_RAD * options.rotation;
    }
    return rectangle;
}

function createCircleShapeField(options)
{
    options.type = 'circle';
    const circle = new PIXI.Graphics();
    circle.options = options;
    circle.lineStyle(Number(options.borderWidth), hexColorToSignedNumber(options.borderColor));
    circle.beginFill(hexColorToSignedNumber(options.color));
    circle.drawEllipse((options.width / 2), (options.height / 2), options.width / 2, options.height / 2);
    circle.endFill();
    circle.x = options.x;
    circle.y = options.y;
    if (options.rotation > 0)
    {
        circle.rotation = PIXI.DEG_TO_RAD * options.rotation;
    }
    return circle;
}

export {
    createFingerprintField, createCircleShapeField, createPictureField,
    createQRCodeField, createRectangleShapeField, createTextField,
    createBarcodeField, createUrlLinkField, createPDF417Field, createDatamatrixField
};

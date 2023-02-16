/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import $ from 'jquery';
import "jquery-ui";
import "jquery-ui/ui/widgets/draggable";
import "jquery-ui/ui/widgets/droppable";
import moment from 'moment';
import * as PIXI from "pixi.js-legacy";
import {
    pixelToUnit, unitToPixel, decimalToHexColor, hexColorToSignedNumber, hex2a, a2hex
} from './convert';

import {
    onCardClickDown, onCardClickUp, onCardKeyDown, onCardKeyUp, onCardMouseMove, onCardPaste, onDragEnd, onDragMove, onDragStart, onResizeStart, onRotationStart
} from './onEvent';

import {
    addFieldToCard
} from './fields';

import {
    saveCurrentSnapshot
} from './history';

import {
    sortByZIndex
} from './common';

import {
    createFingerprintField, createCircleShapeField, createPictureField,
    createQRCodeField, createRectangleShapeField, createTextField,
    createBarcodeField, createPDF417Field, createUrlLinkField, createDatamatrixField
} from './fieldFactory';

import GeneralHelper from '../GeneralHelper';

function parseConditionalRenderingEntries($xml)
{
    let entries = [];
    $xml.children('ConditionalRenderingEntry').each(function ()
    {
        const $this = $(this);
        entries.push({
            condition: $this.children('Condition').text(),
            targetProperty: $this.children('TargetProperty').text(),
            propertyValue: $this.children('PropertyValue').text()
        });
    });
    return entries;
}

//Used for compatibility between pre format version 4.0.0.0
function getBorderWidth(field)
{
    if (field.children('BorderSize'))
    {
        //Since 4.0.0.0
        return (Number(field.children('BorderSize').text()));
    }
    else if (field.children('HasBorder'))
    {
        //Pre 4.0.0.0
        if (field.children('HasBorder').text() === "true")
            return (1);
        else
            return (0);
    }
}

/**
 * Create the PIXI stage for one side of card
 *
 * @param sideType either "recto" or "verso"
 */
 async function createCardStage(side, layout, orientation, $xside, sideType, resize)
{
    if (side.stage)
        side.stage.destroy(true);

    side.stage = new PIXI.Container();

    if (layout === undefined || layout === '')
    {
        if (!(layout in this.layouts['px']))
            layout = 'cr80';
        else
            layout = GeneralHelper.getLayouts()[0].value;
    }
    this.state.currentlayout = layout;
    this.state.cardwidth = (orientation === 'Landscape') ? this.layouts['px'][layout][0] : this.layouts['px'][layout][1];
    this.state.cardheight = (orientation === 'Landscape') ? this.layouts['px'][layout][1] : this.layouts['px'][layout][0];
    this.state.cardwidth_unit = (orientation === 'Landscape') ? this.layouts[this.state.grid.unit][layout][0] : this.layouts[this.state.grid.unit][layout][1];
    this.state.cardheight_unit = (orientation === 'Landscape') ? this.layouts[this.state.grid.unit][layout][1] : this.layouts[this.state.grid.unit][layout][0];
    let width = this.state.cardwidth + (2 * this.state.cardborder);
    let height = this.state.cardheight + (2 * this.state.cardborder);
    const rulerwidth = 40;
    const rulerspacing = 10;

    //Resize by screen resolution
    let parentRectoContainer = $("#carddesign_recto").parent();
    if (width > parentRectoContainer.width())
    {
        this.state.grid.ruler = false;
        this.state.grid.scale = 1 - ((width - parentRectoContainer.width()) / width);
    }
    else
    {
        if (resize)
            this.state.grid.scale = 1;
    }
    if (this.state.grid.ruler)
    {
        width += rulerwidth + rulerspacing * 2;
        height += rulerwidth + rulerspacing * 2;
    }

    //Create the renderer
    side.renderer = PIXI.autoDetectRenderer({width: width * this.state.grid.scale,
        heigth: height * this.state.grid.scale,
        transparent: true,
        clearBeforeRender: true,
        view: document.getElementById('carddesign_' + sideType),
        forceCanvas: true
    });
    //Resize Canvas with real size
    side.renderer.resize(width * this.state.grid.scale , height * this.state.grid.scale);

    let color = 0xFFFFFF;
    if ($xside !== undefined || color === '' || color === '-1')
    {
        color = decimalToHexColor($xside.children('BackgroundSolid').text());
    }

    let bg_picture_layout = 0;
    let bg_picture = '';
    if ($xside !== undefined)
    {
        bg_picture = $xside.children('BackgroundImage').text();
        if (bg_picture !== undefined && bg_picture !== '' && bg_picture.trim() !== '')
        {
            bg_picture = 'data:image/png;base64,' + btoa(hex2a(bg_picture));
        }

        bg_picture_layout = Number.parseInt($xside.children('BackgroundImageLayout').text())
    }

    side.card = new PIXI.Graphics();
    let cardOpt = {
        color: color,
        background_picture: bg_picture,
        background_picture_layout: bg_picture_layout
    };

    side.card.options = cardOpt;
    drawCardBackground.call(this, sideType);
    side.card.interactive = true;
    side.card.buttonMode = true;
    side.card.cursor = 'crosshair';
    side.card
        .on('mousedown', (event) =>
        {
            onCardClickDown.call(this, event, sideType);
        })
        .on('touchstart', (event) =>
        {
            this._lastTouchstartAt = moment();
            onCardClickDown.call(this, event, sideType);

        })
        .on('mouseup', (event) =>
        {
            onCardClickUp.call(this, event, sideType);
        })
        .on('touchend', (event) =>
        {
            onCardClickUp.call(this, event, sideType);
        })

    if ($xside !== undefined)
    {
        const designer = this;
        await Promise.all($xside.children('Fields').children('Field').map(async function()
        {
            const $this = $(this);
            const ftype = $this.attr('i:type').split(':')[1];
            let field = null;

            const font = $this.children('Font').text().split(',');
            let fontStyle;
            if (font.length > 2)
            {
                var fontext = font[2].split('=');
                if (fontext.length === 2 && fontext[0].trim() === 'style')
                {
                    fontStyle = fontext[1].trim();
                }
            }
            if (ftype === 'DataPrinter.Core.Objects.TextField')
            {
                const colorFill = $this.children('ColorFill').text();
                field = createTextField({
                    name: $this.children('Name').text(),
                    useMacros: ($this.children('UseMacros').text() === 'true'),
                    value: $this.children('Value').text(),
                    color: decimalToHexColor($this.children('Color').text()),
                    fontFamily: font[0].trim(),
                    fontSize: font[1].trim(),
                    fontStyle: fontStyle,
                    colorFill: (colorFill !== '' && colorFill !== '16777215') ? decimalToHexColor($this.children('ColorFill').text()) : -1,
                    borderWidth: getBorderWidth($this),
                    borderColor: $this.children('ColorBorder') ? $this.children('ColorBorder').text() : 0x000000,
                    scaleFont: ($this.children('AutoFontResize').text() === 'true'),
                    autoSize: ($this.children('AutoResize').text() === 'true'),
                    align: $this.children('Align').text(),
                    wordBreak: ($this.children('WordBreak').text() === 'true'),
                    maxLength: Number(($this.children('MaxLength')).text()),
                    width: Number($this.children('Width').text()),
                    height: Number($this.children('Height').text()),
                    x: Number($this.children('XPosition').text()),
                    y: Number($this.children('YPosition').text()),
                    zIndex: Number($this.children('ZIndex').text()),
                    rotation: Number($this.children('RotationAngle').text()),
                    conditionalRenderingEntries: parseConditionalRenderingEntries($this.children('ConditionalRenderingEntries')),
                });
            }
            else if (ftype === 'DataPrinter.Core.Objects.URLLinkField')
            {
                const colorFill = $this.children('ColorFill').text();
                field = createUrlLinkField({
                    name: $this.children('Name').text(),
                    useMacros: ($this.children('UseMacros').text() === 'true'),
                    value: $this.children('Value').text(),
                    color: decimalToHexColor($this.children('Color').text()),
                    fontFamily: font[0].trim(),
                    fontSize: font[1].trim(),
                    fontStyle: fontStyle,
                    colorFill: (colorFill !== '' && colorFill !== '16777215') ? decimalToHexColor($this.children('ColorFill').text()) : -1,
                    borderWidth: getBorderWidth($this),
                    borderColor: 0x000000,
                    scaleFont: ($this.children('AutoFontResize').text() === 'true'),
                    autoSize: ($this.children('AutoResize').text() === 'true'),
                    width: Number($this.children('Width').text()),
                    height: Number($this.children('Height').text()),
                    x: Number($this.children('XPosition').text()),
                    y: Number($this.children('YPosition').text()),
                    zIndex: Number($this.children('ZIndex').text()),
                    rotation: Number($this.children('RotationAngle').text()),
                    conditionalRenderingEntries: parseConditionalRenderingEntries($this.children('ConditionalRenderingEntries')),
                });
            }
            else if (ftype === 'DataPrinter.Core.Objects.BarcodeField')
            {
                field = createBarcodeField({
                    name: $this.children('Name').text(),
                    useMacros: ($this.children('UseMacros').text() === 'true'),
                    value: $this.children('Value').text(),
                    fontFamily: font[0].trim(),
                    fontSize: Number($this.children('Size').text()),
                    width: Number($this.children('Width').text()),
                    height: Number($this.children('Height').text()),
                    x: Number($this.children('XPosition').text()),
                    y: Number($this.children('YPosition').text()),
                    zIndex: Number($this.children('ZIndex').text()),
                    rotation: Number($this.children('RotationAngle').text()),
                    conditionalRenderingEntries: parseConditionalRenderingEntries($this.children('ConditionalRenderingEntries')),
                });
            }
            else if (ftype === 'DataPrinter.Core.Objects.QRCodeField')
            {
                const eclevels = ['L', 'M', 'Q', 'H'];
                field = await createQRCodeField({
                    name: $this.children('Name').text(),
                    useMacros: ($this.children('UseMacros').text() === 'true'),
                    value: $this.children('Value').text(),
                    ecLevel: eclevels[Number($this.children('ErrorCorrection').text())],
                    width: Number($this.children('Width').text()),
                    height: Number($this.children('Height').text()),
                    x: Number($this.children('XPosition').text()),
                    y: Number($this.children('YPosition').text()),
                    zIndex: Number($this.children('ZIndex').text()),
                    rotation: Number($this.children('RotationAngle').text()),
                    conditionalRenderingEntries: parseConditionalRenderingEntries($this.children('ConditionalRenderingEntries')),
                });
            }
            else if (ftype === 'DataPrinter.Core.Objects.Pdf417Field')
            {
                const colorFill = $this.children('ColorFill').text();
                field = createPDF417Field({
                    name: $this.children('Name').text(),
                    useMacros: ($this.children('UseMacros').text() === 'true'),
                    value: $this.children('Value').text(),
                    ecLevel: Number($this.children('ErrorCorrection').text()),
                    width: Number($this.children('Width').text()),
                    height: Number($this.children('Height').text()),
                    color: decimalToHexColor($this.children('ForeColor').text()),
                    colorFill: (colorFill !== '' && colorFill !== '16777215') ? decimalToHexColor($this.children('ColorFill').text()) : -1,
                    x: Number($this.children('XPosition').text()),
                    y: Number($this.children('YPosition').text()),
                    zIndex: Number($this.children('ZIndex').text()),
                    rotation: Number($this.children('RotationAngle').text()),
                    conditionalRenderingEntries: parseConditionalRenderingEntries($this.children('ConditionalRenderingEntries')),
                });
            }
            else if (ftype === 'DataPrinter.Core.Objects.DatamatrixField')
            {
                const colorFill = $this.children('ColorFill').text();
                field = createDatamatrixField({
                    name: $this.children('Name').text(),
                    useMacros: ($this.children('UseMacros').text() === 'true'),
                    value: $this.children('Value').text(),
                    width: Number($this.children('Width').text()),
                    height: Number($this.children('Height').text()),
                    Scheme: Number($this.children('Scheme').text()),
                    SizeIdx: Number($this.children('SizeIdx').text()),
                    color: decimalToHexColor($this.children('ForeColor').text()),
                    colorFill: (colorFill !== '' && colorFill !== '16777215') ? decimalToHexColor($this.children('ColorFill').text()) : -1,
                    x: Number($this.children('XPosition').text()),
                    y: Number($this.children('YPosition').text()),
                    zIndex: Number($this.children('ZIndex').text()),
                    rotation: Number($this.children('RotationAngle').text()),
                    conditionalRenderingEntries: parseConditionalRenderingEntries($this.children('ConditionalRenderingEntries')),
                });
            }
            else if (ftype === 'DataPrinter.Core.Objects.Fingerprint')
            {
                const targets = [];
                const obj = $this.children('Targets');
                obj.children('Target').each((idx) => {
                    targets.push(obj.children('Target')[idx].textContent);
                });
                field = createFingerprintField({
                    name: $this.children('Name').text(),
                    useMacros: ($this.children('UseMacros').text() === 'true'),
                    autoRequest: ($this.children('AutoRequest').text() === 'true'),
                    targets: targets,
                    width: Number($this.children('Width').text()),
                    height: Number($this.children('Height').text()),
                    x: Number($this.children('XPosition').text()),
                    y: Number($this.children('YPosition').text()),
                    zIndex: Number($this.children('ZIndex').text()),
                    rotation: Number($this.children('RotationAngle').text()),
                    conditionalRenderingEntries: parseConditionalRenderingEntries($this.children('ConditionalRenderingEntries')),
                });
            }
            else if (ftype === 'DataPrinter.Core.Objects.PictureField')
            {
                let data = $this.children('Value').text();
                if (data !== undefined && data !== '' && data.trim() !== '')
                {
                    data = 'data:image/png;base64,' + btoa(hex2a(data));
                } else
                {
                    data = this.blankimg;
                }
                field = createPictureField({
                    name: $this.children('Name').text(),
                    useMacros: ($this.children('UseMacros').text() === 'true'),
                    value: data,
                    width: Number($this.children('Width').text()),
                    height: Number($this.children('Height').text()),
                    borderWidth: getBorderWidth($this),
                    borderColor: $this.children('ColorBorder') ? $this.children('ColorBorder').text() : 0x000000,
                    x: Number($this.children('XPosition').text()),
                    y: Number($this.children('YPosition').text()),
                    zIndex: Number($this.children('ZIndex').text()),
                    rotation: Number($this.children('RotationAngle').text()),
                    conditionalRenderingEntries: parseConditionalRenderingEntries($this.children('ConditionalRenderingEntries')),
                });
            }
            else if (ftype === 'DataPrinter.Core.Objects.RectangleShapeField')
            {
                field = createRectangleShapeField({
                    name: $this.children('Name').text(),
                    useMacros: ($this.children('UseMacros').text() === 'true'),
                    color: decimalToHexColor($this.children('Color').text()),
                    borderWidth: Number($this.children('BorderWidth').text()),
                    borderColor: decimalToHexColor($this.children('BorderColor').text()),
                    width: Number($this.children('Width').text()),
                    height: Number($this.children('Height').text()),
                    x: Number($this.children('XPosition').text()),
                    y: Number($this.children('YPosition').text()),
                    zIndex: Number($this.children('ZIndex').text()),
                    rotation: Number($this.children('RotationAngle').text()),
                    conditionalRenderingEntries: parseConditionalRenderingEntries($this.children('ConditionalRenderingEntries')),
                });
            }
            else if (ftype === 'DataPrinter.Core.Objects.CircleShapeField')
            {
                field = createCircleShapeField({
                    name: $this.children('Name').text(),
                    useMacros: ($this.children('UseMacros').text() === 'true'),
                    color: decimalToHexColor($this.children('Color').text()),
                    borderWidth: Number($this.children('BorderWidth').text()),
                    borderColor: decimalToHexColor($this.children('BorderColor').text()),
                    width: Number($this.children('Width').text()),
                    height: Number($this.children('Height').text()),
                    x: Number($this.children('XPosition').text()),
                    y: Number($this.children('YPosition').text()),
                    zIndex: Number($this.children('ZIndex').text()),
                    rotation: Number($this.children('RotationAngle').text()),
                    conditionalRenderingEntries: parseConditionalRenderingEntries($this.children('ConditionalRenderingEntries')),
                });
            }
            if (!field)
            {
                designer.showAlert.call(designer, "danger", designer.props.t('alerts.error'), designer.props.t('alerts.errorDuringFieldGeneration'));
                return;
            }
            field.sideType = sideType;
            addFieldToCard.call(designer, field, sideType);
        }));
    }

    if (this.state.grid.ruler)
    {
        const rulerstep = (this.layouts[this.state.grid.unit][layout][0] > 20) ? ((this.layouts[this.state.grid.unit][layout][0] > 200) ? 10 : 1) : 0.1;
        const rulerdrawfactor = (rulerstep >= 1) ? 10 * rulerstep : 1;

        const topRuler = new PIXI.Graphics();
        topRuler.lineStyle(1, 0x000000, 1);
        topRuler.beginFill(0xa8a8a8);
        topRuler.drawRect(0, 0, this.state.cardwidth + rulerspacing * 2, rulerwidth);
        topRuler.endFill();
        for (let i = 0; i < this.state.cardwidth_unit + rulerstep; i += rulerstep)
        {
            i = Math.round(i * 10000) / 10000;

            const ipx = i * (this.state.cardwidth / this.state.cardwidth_unit);
            const drawindice = (Math.round((i % rulerdrawfactor) * 10000) < 1);
            const stepheight = drawindice ? (rulerwidth / 2) : (rulerwidth / 4);
            topRuler.lineStyle(1, 0x000000)
                .moveTo(rulerspacing + ipx, 0)
                .lineTo(rulerspacing + ipx, stepheight);
            if (drawindice)
            {
                const indice = new PIXI.Text(i, {fontFamily: 'Arial', fontSize: '8pt', fill: 0x000000});
                indice.position.set(rulerspacing + ipx - 4, stepheight + 2);
                topRuler.addChild(indice);
            }
        }
        topRuler.position.set(rulerwidth + this.state.cardborder, 0);
        if (!topRuler.options)
            topRuler.options = {};
        topRuler.options.zIndex = 999;
        side.stage.addChild(topRuler);

        const leftRuler = new PIXI.Graphics();
        leftRuler.lineStyle(1, 0x000000, 1);
        leftRuler.beginFill(0xa8a8a8);
        leftRuler.drawRect(0, 0, rulerwidth, this.state.cardheight + rulerspacing * 2);
        leftRuler.endFill();
        for (let i = 0; i < this.state.cardheight + rulerstep; i += rulerstep)
        {
            i = Math.round(i * 10000) / 10000;

            const ipx = i * (this.state.cardheight / this.state.cardheight_unit);
            const drawindice = (Math.round((i % rulerdrawfactor) * 10000) < 1);
            const stepheight = drawindice ? (rulerwidth / 2) : (rulerwidth / 4);
            leftRuler.lineStyle(1, 0x000000)
                .moveTo(0, rulerspacing + ipx)
                .lineTo(stepheight, rulerspacing + ipx);
            if (drawindice)
            {
                const indice = new PIXI.Text(i, {fontFamily: 'Arial', fontSize: '8pt', fill: 0x000000});
                indice.position.set(stepheight + 2, rulerspacing + ipx - 4);
                if (!indice.options)
                    indice.options = {};
                indice.options.zIndex = 998;
                leftRuler.addChild(indice);
            }
        }
        leftRuler.position.set(0, rulerwidth + this.state.cardborder);
        if (!leftRuler.options)
            leftRuler.options = {};
        leftRuler.options.zIndex = 999;
        side.stage.addChild(leftRuler);

        side.card.position.set(rulerwidth + rulerspacing, rulerwidth + rulerspacing);

        side.card
            .on('mousemove', (event) =>
            {
                onCardMouseMove.call(this, event, side.stage, topRuler, leftRuler);
            })
            .on('touchmove', (event) =>
            {
                onCardMouseMove.call(this, event, side.stage, topRuler, leftRuler);
            });
    }
    else
    {
        side.card
        .on('mousemove', (event) =>
        {
            onCardMouseMove.call(this, event, side.stage, undefined, undefined);
        })
        .on('touchmove', (event) =>
        {
            onCardMouseMove.call(this, event, side.stage, undefined, undefined);
        });
    }
    side.card.position.x += this.state.cardborder;
    side.card.position.y += this.state.cardborder - 1;

    side.stage.scale.x = this.state.grid.scale;
    side.stage.scale.y = this.state.grid.scale;

    side.stage.addChild(side.card);
    sortByZIndex.call(this);

    let dropEventFonction = (event, ui, side) =>
    {
        let field = createTextField({
            name: ui.draggable.attr("data-name"),
            useMacros: false,
            value: ui.draggable.attr("data-defaultValue") ? ui.draggable.attr("data-defaultValue") : ui.draggable.attr("data-name"),
            color: 0x000000,
            colorFill: -1,
            fontFamily: 'Verdana',
            fontSize: '12pt',
            fontStyle: 'Normal',
            align: 'TopLeft',
            borderWidth: 0,
            borderColor: 0x000000,
            scaleFont: false,
            autoSize: true,
            wordBreak: false,
            maxLength: 0,
            width: 46,
            height: 18,
            x: event.offsetX,
            y: event.offsetY,
            zIndex: 0,
            rotation: 0,
        });
        field.sideType = side;
        field.droppableId = ui.draggable.attr("data-id");
        ui.draggable.hide();
        addFieldToCard.call(this, field, side);
        saveCurrentSnapshot.call(this);
    }

    $("#carddesign_draggableFields").find(".draggableField").draggable({
        helper: "clone",
        revert: true
    });

    $("#carddesign_recto").droppable({
        tolerance: "pointer",
        drop: function(event, ui){
            dropEventFonction(event, ui, "recto");
        }
    });
    $("#carddesign_verso").droppable({
        tolerance: "pointer",
        drop: function(event, ui){
            dropEventFonction(event, ui, "verso");
        }
    });
}

/**
 * Draw the background of a side of the card.
 *
 * sideType is either 'recto' or 'verso'
 * @param sideType
 */
function drawCardBackground(sideType)
{
    let cardSideRef = this.state.sides[sideType].card || null;  // Reference to the card side object.
    let bgComponentRef = this.state.sides[sideType].bg_components;
    
    if (cardSideRef !== null)
    {
        cardSideRef.clear();

        // Remove previous bg component
        if (bgComponentRef)
        {
            bgComponentRef.forEach((bgc) =>
            {
                cardSideRef.removeChild(bgc);
            });
        }

        //This operation is used to prevent a bug from other apps
        cardSideRef.options.background_picture = cardSideRef.options.background_picture.trim();

        if (cardSideRef.options.background_picture !== '' && cardSideRef.options.background_picture !== null)
        {
            // Picture as a background.
            const texture = PIXI.Texture.from(cardSideRef.options.background_picture);
            const sprite = new PIXI.Sprite(texture);

            sprite.options = {};

            console.log("Drawing background... layout = " + cardSideRef.options.background_picture_layout);

            // Stretch background to card dimension.
            if (cardSideRef.options.background_picture_layout === 3)
            {
                sprite.width = this.state.cardwidth;
                sprite.height = this.state.cardheight;
            }
            // Center the background image.
            else if (cardSideRef.options.background_picture_layout === 2)
            {
                const anchor = new PIXI.ObservablePoint(() => {}, null, 0.5, 0.5);
                sprite.anchor = anchor;
                sprite.x = this.state.cardwidth / 2;
                sprite.y = this.state.cardheight / 2;
            }
            // Zoom
            else if (cardSideRef.options.background_picture_layout === 4)
            {
                // We need to wait for the texture to be loaded
                // otherwise we don't have access to width and height
                // and cannot compute the new scale.
                const setScaleFct = () =>
                {
                    const xscale = this.state.cardwidth / sprite.width;
                    const yscale = this.state.cardheight / sprite.height;

                    // Keep the smallest scale to avoid becoming too big.
                    const scale = yscale < xscale ? yscale : xscale;
                    sprite.scale = new PIXI.Point(scale, scale);
                };
                // Either the texture has already been loaded, in that case
                // we set the scale right now...
                if (texture.baseTexture.hasLoaded)
                {
                    setScaleFct();
                }
                // Or we set a callback to adjust the scale when the texture
                // is loaded.
                else
                {
                    texture.on("update", setScaleFct);
                }
            }

            sprite.options.zIndex = -1000; // Far behind, since its background...
            cardSideRef.addChild(sprite);

            let graphic_border = new PIXI.Graphics();
            graphic_border.lineStyle(this.state.cardborder, 0x000000, 1);
            graphic_border.options = {};
            graphic_border.options.zIndex = 990;

            if (this.state.currentlayout === "cr80") //cards
                graphic_border.drawRoundedRect(0, 0, this.state.cardwidth, this.state.cardheight, 20);
            else
                graphic_border.drawRect(0, 0, this.state.cardwidth, this.state.cardheight);
            cardSideRef.addChild(graphic_border);

            // Removed next time we draw the background.
            this.state.sides[sideType].bg_components = [graphic_border, sprite];
            sortByZIndex.call(this);
        }
        else
        {
            // Create card border
            let graphic_border = new PIXI.Graphics();
            graphic_border.lineStyle(this.state.cardborder, 0x000000, 1);
            if (this.state.currentlayout === "cr80") //cards
                graphic_border.drawRoundedRect(0, 0, this.state.cardwidth, this.state.cardheight, 20);
            else
                graphic_border.drawRect(0, 0, this.state.cardwidth, this.state.cardheight);
            graphic_border.options = {};
            graphic_border.options.zIndex = 1000;
            cardSideRef.addChild(graphic_border);

            // User colored (white included) background.
            cardSideRef.lineStyle(this.state.cardborder, 0x000000, 1);
            cardSideRef.beginFill(hexColorToSignedNumber(cardSideRef.options.color.toString()));

            if (this.state.currentlayout === "cr80") //cards
                cardSideRef.drawRoundedRect(0, 0, this.state.cardwidth, this.state.cardheight, 20);
            else
                cardSideRef.drawRect(0, 0, this.state.cardwidth, this.state.cardheight);
            cardSideRef.endFill();
        }
    }
}

function editBackground(sideType)
{
    this.setState({
        selectedside: sideType,
        show_background: true
    });
}

function updateBackground(sideType, background)
{
    const cardRef = this.state.sides[sideType].card;
    const options = Object.keys(background);
    options.forEach(key =>
    {
        cardRef.options[key] = background[key];
    });
    drawCardBackground.call(this, sideType);
    saveCurrentSnapshot.call(this);
}

function newCard(layout)
{
    this.setState({
        name: '',
        orientation: (layout !== 'cr80' && layout !== "custom") ? 'Portrait' : 'Landscape'
    });

    return Promise.all(this.getSides.call(this).map(async sideType => {
        const side = this.state.sides[sideType];
        await createCardStage.call(this, side, layout, this.state.orientation, undefined, sideType, false);
    }));
}

function getRectoCanvas()
{
    const side = this.state.sides['recto'];
    side.renderer.render(side.stage);

    const resizedCanvas = document.createElement("canvas");
    const resizedContext = resizedCanvas.getContext("2d");
    resizedCanvas.height = side.renderer.view.height / 2;
    resizedCanvas.width = side.renderer.view.width / 2;

    if (this.state.grid.ruler)
    {
        resizedContext.drawImage(side.renderer.view, side.card.position.x - this.state.cardborder, side.card.position.y - this.state.cardborder, side.card.width + this.state.cardborder, side.card.height + this.state.cardborder, 0, 0, resizedCanvas.width, resizedCanvas.height);
    }
    else
    {
        resizedContext.drawImage(side.renderer.view, 0, 0, resizedCanvas.width, resizedCanvas.height);
    }
    return resizedCanvas;
}

function getRectoCanvasSnap()
{
    //Set scale at 1 and save the old one
    let oldscale = this.state.grid.scale;
    this.state.grid.scale = 1;
    const side = this.state.sides['recto'];
    side.stage.transform.scale.x = 1;
    side.stage.transform.scale.y = 1;

    //Resize card designer with scale 1
    document.getElementById("carddesign_recto").width = document.getElementById("carddesign_recto").width / oldscale;
    document.getElementById("carddesign_recto").height = document.getElementById("carddesign_recto").height / oldscale;
    side.renderer.render(side.stage);

    const resizedCanvas = document.createElement("canvas");
    const resizedContext = resizedCanvas.getContext("2d");

    //Resize rendering canvas with 1
    resizedCanvas.height = (side.renderer.view.height / 2) / this.state.grid.scale ;
    resizedCanvas.width = (side.renderer.view.width / 2) / this.state.grid.scale ;
    this.state.grid.scale = oldscale;

    //Remove ruler if present
    if (!this.state.grid.ruler)
    {
        resizedCanvas.height += 30;
        resizedCanvas.width += 30;
    }

    resizedContext.drawImage(side.renderer.view, side.card.position.x - this.state.cardborder, side.card.position.y - this.state.cardborder, side.card.width + this.state.cardborder, side.card.height + this.state.cardborder, 0, 0, resizedCanvas.width, resizedCanvas.height);
    
    //Reset values
    side.stage.transform.scale.x = oldscale;
    side.stage.transform.scale.y = oldscale;
    document.getElementById("carddesign_recto").width = document.getElementById("carddesign_recto").width * oldscale;
    document.getElementById("carddesign_recto").height = document.getElementById("carddesign_recto").height * oldscale;
    return resizedCanvas;
}

function editCustomSize(side)
{
    //1px = 5,2mm
    //1in = 25,4mm

    //Note : 'inch' value is not exact and sometime can differ from 0,1 to 0,2 

    if (side === 'x')
    {
        this.layouts['px']['custom'][0] = Number($("#templateSizeX").val());
        this.layouts['mm']['custom'][0] = Number(Number($("#templateSizeX").val() / 5,2).toFixed(4));
        this.layouts['in']['custom'][0] = Number(Number(Number($("#templateSizeX").val() / 5,2) / 25,4).toFixed(4))
    }
    else
    {
        this.layouts['px']['custom'][1] = Number($("#templateSizeY").val());
        this.layouts['mm']['custom'][1] = Number(Number($("#templateSizeY").val() / 5,2).toFixed(4));
        this.layouts['in']['custom'][1] = Number(Number(Number($("#templateSizeY").val() / 5,2) / 25,4).toFixed(4));
    }

    newCard.call(this, 'custom');
}

export {
    getRectoCanvas, updateBackground, editBackground, newCard,
    drawCardBackground, createCardStage, parseConditionalRenderingEntries, getRectoCanvasSnap, editCustomSize
}
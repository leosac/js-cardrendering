/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import $ from 'jquery';
import * as PIXI from "pixi.js-legacy";
import {
    pixelToUnit
} from './convert';

import {
    onDragEnd, onDragMove, onDragStart
} from './onEvent';

import {
    saveCurrentSnapshot
} from './history';

import {
    createSelectedSprite
} from './createElems';

import {
    sortByZIndex, changeFactory
} from './common';

import {
    createFingerprintField, createCircleShapeField, createPictureField,
    createQRCodeField, createRectangleShapeField, createTextField,
    createBarcodeField, createUrlLinkField, createPDF417Field, createDatamatrixField
} from './fieldFactory';

function cleanHighlights(cardSide)
{
    if (cardSide.highlights !== undefined)
    {
        cardSide.highlights.forEach((f) => {
           cardSide.card.removeChild(f);
        });
    }
    cardSide.highlights = [];
}

function addFieldToCard(field, sideType)
{
    if (field !== null)
    {
        field.interactive = true;
        field
            .on('mousedown', (event) =>
            {
                onDragStart.call(this, event, field, sideType);
            })
            .on('touchstart', (event) =>
            {
                onDragStart.call(this, event, field, sideType);
            })
            .on('mouseup', (event) =>
            {
                onDragEnd.call(this, event, sideType);
            })
            .on('mouseupoutside', (event) =>
            {
                onDragEnd.call(this, event, sideType);
            })
            .on('touchend', (event) =>
            {
                onDragEnd.call(this, event, sideType);
            })
            .on('touchendoutside', (event) =>
            {
                onDragEnd.call(this, event, sideType);
            })
            .on('mousemove', (event) =>
            {
                onDragMove.call(this, event, field, sideType);
            })
            .on('touchmove', (event) =>
            {
                onDragMove.call(this, event, field, sideType);
            });
        if (field.selected)
        {
            field.addChild(createSelectedSprite.call(this, field));
        }
        this.state.sides[sideType].card.addChild(field);
        sortByZIndex.call(this);
    }
}

/**
 * Create a new field / element on the stage.
 *
 * @param fieldtype What kind of field we wish to create
 * @param position
 * @param options options for the field
 * @param createOpt some option regarding creation option
 *        {sideType: which side (recto/verso)
 *         autoSizeImg: true|false
 *        }
 * @returns {*}
 */
async function createField(fieldtype, position, options, createOpt)
{
    let field = null;
    if (options !== undefined && position !== undefined)
    {
        // Special case where we shouldn't change the position
        if (position.x !== -1 && position.y !== -1) {
            options.x = Math.round(position.x);
            options.y = Math.round(position.y);
        }
    }
    if (options !== undefined)
    {
        if (options.maxLength)
            options.maxLength = Number(options.maxLength);
        if (options.borderWidth)
            options.borderWidth = Number(options.borderWidth);
    }
    const sideType = createOpt.sideType;

    if (fieldtype === 'label')
    {
        field = createTextField(options !== undefined ? options : {
            useMacros: false,
            value: 'Label',
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
            x: Math.round(position.x),
            y: Math.round(position.y),
            zIndex: 0,
            rotation: 0,
        });
    } else if (fieldtype === 'picture')
    {
        field = createPictureField(options !== undefined ? options : {
            useMacros: false,
            value: this.blankimg,
            width: 75,
            height: 75,
            borderWidth: 0,
            borderColor: 0x000000,
            x: Math.round(position.x),
            y: Math.round(position.y),
            zIndex: 0,
            rotation: 0,
        }, createOpt);
    } else if (fieldtype === 'barcode')
    {
        field = createBarcodeField(options !== undefined ? options : {
            useMacros: false,
            value: '012345',
            fontFamily: 'Code39',
            fontSize: 64,
            width: 75,
            height: 75,
            x: Math.round(position.x),
            y: Math.round(position.y),
            zIndex: 0,
            rotation: 0,
        });
    } else if (fieldtype === 'pdf417')
    {
        field = createPDF417Field(options !== undefined ? options : {
            useMacros: false,
            value: '012345',
            fontSize: 30,
            width: 75,
            height: 75,
            x: Math.round(position.x),
            y: Math.round(position.y),
            ecLevel: 1,
            zIndex: 0,
            rotation: 0,
        });
    } else if (fieldtype === 'dataMatrix')
    {
        field = createDatamatrixField(options !== undefined ? options : {
            useMacros: false,
            value: '012345',
            width: 75,
            height: 75,
            color: 0x000000,
            x: Math.round(position.x),
            y: Math.round(position.y),
            SizeIdx: -2,
            Scheme: 0,
            zIndex: 0,
            rotation: 0,
        });
    } else if (fieldtype === 'qrcode')
    {
        field = await createQRCodeField(options !== undefined ? options : {
            useMacros: false,
            value: 'https://www.leosac.com',
            ecLevel: 'M',
            width: 132,
            height: 132,
            x: Math.round(position.x),
            y: Math.round(position.y),
            zIndex: 0,
            rotation: 0,
        });
    } else if (fieldtype === 'rectangle')
    {
        field = createRectangleShapeField(options !== undefined ? options : {
            useMacros: false,
            color: 0xffffff,
            borderWidth: 1,
            borderColor: 0x000000,
            width: 75,
            height: 75,
            x: Math.round(position.x),
            y: Math.round(position.y),
            zIndex: 0,
            rotation: 0,
        });
    } else if (fieldtype === 'circle')
    {
        field = createCircleShapeField(options !== undefined ? options : {
            useMacros: false,
            color: 0xffffff,
            borderWidth: 1,
            borderColor: 0x000000,
            width: 75,
            height: 75,
            x: Math.round(position.x),
            y: Math.round(position.y),
            zIndex: 0,
            rotation: 0,
        });
    } else if (fieldtype === 'fingerprint')
    {
        field = createFingerprintField(options !== undefined ? options : {
            useMacros: false,
            autoRequest: false,
            targets: [],
            x: Math.round(position.x),
            y: Math.round(position.y),
            width: 64,
            height: 64,
            zIndex: 0,
            rotation: 0,
        });
    }
    else if (fieldtype === 'urllink')
    {
        field = createUrlLinkField(options !== undefined ? options : {
            useMacros: false,
            value: 'https://leosac.com/',
            color: 0x1EB9DA,
            colorFill: -1,
            fontFamily: 'Verdana',
            fontSize: '12pt',
            borderWidth: 0,
            borderColor: 0x000000,
            scaleFont: false,
            autoSize: true,
            width: 46,
            height: 18,
            x: Math.round(position.x),
            y: Math.round(position.y),
            zIndex: 0,
            rotation: 0
        });
    }
    else
    {
        unselectField.call(this);
    }
    if (field)
    {
        field.sideType = sideType;
        addFieldToCard.call(this, field, sideType);
    }

    changeFactory.call(this, 'cursor', sideType);
    return field;
}

function alignSelectedField(align)
{
    if (this.state.selectedfield.length > 1)
    {
        // Found max positions
        let i = 0;
        let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
        this.state.selectedfield.forEach((f) => {
            if (i === 0 || f.options.x < x1)
            {
                x1 = f.options.x;
            }
            if (i === 0 || (f.options.x + f.options.width) > x2)
            {
                x2 = f.options.x + f.options.width;
            }

            if (i === 0 || f.options.y < y1)
            {
                y1 = f.options.y;
            }
            if (i === 0 || (f.options.y + f.options.height) > y2)
            {
                y2 = f.options.y + f.options.height;
            }
            ++i;
        });

        // Align fields according to alignment choice and positions
        this.state.selectedfield.forEach((f) => {
            if (align === 'left') {
                f.options.x = x1;
                f.position.x = f.options.x;
            }
            else if (align === 'right') {
                f.options.x = x2 - f.options.width;
                f.position.x = f.options.x;
            }
            else if (align === 'top') {
                f.options.y = y1;
                f.position.y = f.options.y;
            }
            else if (align === 'bottom') {
                f.options.y = y2 - f.options.height;
                f.position.y = f.options.y;
            }
            else if (align === 'vertical') {
                f.options.x = ((x1 + x2) - f.options.width) / 2;
                f.position.x = f.options.x;
            }
            else if (align === 'horizontal') {
                f.options.y = ((y1 + y2) - f.options.height) / 2;
                f.position.y = f.options.y;
            }
        });
    }
}


function selectFieldsInArea(sideType, area)
{
    const cardSide = this.state.sides[sideType];
    cardSide.card.children.forEach((f) => {
        if (f.options !== undefined && f.options.type !== undefined)
        {
            const areaRect = area.getBounds();
            const fRect = f.getBounds();

            // Only select fields fully in the area

            if (fRect.x >= areaRect.x && (fRect.x + fRect.width) <= (areaRect.x + areaRect.width) &&
                fRect.y >= areaRect.y && (fRect.y + fRect.height) <= (areaRect.y + areaRect.height))
            {
                selectField.call(this, f);
            }
        }
    });
}

function moveSelectedFields(field, mx, my, skipStepAlign)
{
    if (skipStepAlign !== true) {
        // Align to step
        if ((mx % this.state.grid.step) !== 0) {
            mx = 0;
        }
        if ((my % this.state.grid.step) !== 0) {
            my = 0;
        }
    }
    if (mx !== 0 || my !== 0)
    {
        this.state.selectedfield.forEach((f) => {
            f.options.x += mx;
            f.position.x += mx;
            f.options.y += mx;
            f.position.y += my;
            f.moved = true;
        });
    }
}

function highlightFieldPositions(cardSide, field, previousxy)
{
    cleanHighlights(cardSide);

    const displayRang = 10;
    const stickyRang = 4;
    let xa = [], ya = [];
    let stickx = false, sticky = false;
    cardSide.card.children.forEach((f) => {
        if (f.options !== undefined && f.options.type !== undefined && f !== field) {
            if ($.inArray(f.options.x, xa) === -1) {
                xa.push(f.options.x);
            }
            if ($.inArray(f.options.y, ya) === -1) {
                ya.push(f.options.y);
            }
            if ($.inArray(f.options.x + f.options.width, xa) === -1) {
                xa.push(f.options.x + f.options.width);
            }
            if ($.inArray(f.options.y + f.options.height, ya) === -1) {
                ya.push(f.options.y + f.options.height);
            }
        }
    });

    if (cardSide.grid !== undefined && cardSide.grid !== null) {
        cardSide.grid.children.forEach((g) => {
            if ($.inArray(g.position.x, xa) === -1) {
                xa.push(g.position.x);
            }
            if ($.inArray(g.position.y, ya) === -1) {
                ya.push(g.position.y);
            }
            if ($.inArray(g.position.x + g.width, xa) === -1) {
                xa.push(g.position.x + g.width);
            }
            if ($.inArray(g.position.y + g.height, ya) === -1) {
                ya.push(g.position.y + g.height);
            }
        });
    }

    xa.forEach((x) => {
       if (((field.position.x + displayRang) > x && (field.position.x - displayRang) < x) ||
           ((field.position.x + field.options.width + displayRang) > x && (field.position.x + field.options.width - displayRang) < x)) {

           // Sticky X positions
           if (!stickx && (field.position.x + stickyRang) > x && (field.position.x - stickyRang) < x && field.position.x < previousxy.x) {
               moveSelectedFields.call(this, field, x - field.position.x, 0, true);
               stickx = true;
           }
           if (!stickx && (field.position.x + field.options.width + stickyRang) > x && (field.position.x + field.options.width - stickyRang) < x && field.position.x > previousxy.x) {
               moveSelectedFields.call(this, field, x - field.options.width - field.position.x, 0, true);
               stickx = true;
           }

           let exactmatch = (x === field.position.x || x === field.position.x + field.options.width);
           let line = new PIXI.Graphics();
           line.position.set(x, 0);
           line.lineStyle(exactmatch ? 2 : 1, 0x2626c9)
               .moveTo(0, 0)
               .lineTo(0, cardSide.card.height);
           if (exactmatch)
           {
               const text = new PIXI.Text('X: ' + pixelToUnit.call(this, x), {fontFamily: 'Arial', fontSize: '10pt', fill: 0x000000});
               const label = new PIXI.Graphics();
               label.lineStyle(1, 0x000000, 1);
               label.beginFill(0xffd400, 1);
               label.drawRect(0, 0, text.width, text.height);
               label.endFill();
               label.addChild(text);
               label.position.set(0, (field.position.y - 25) > 0 ? (field.position.y - 25) : (field.position.y + field.options.height + 25));
               line.addChild(label);
           }
           cardSide.card.addChild(line);
           cardSide.highlights.push(line);
       }
    });

    ya.forEach((y) => {
        if (((field.position.y + displayRang) > y && (field.position.y - displayRang) < y) ||
            ((field.position.y + field.options.height + displayRang) > y && (field.position.y + field.options.height - displayRang) < y)) {

            // Sticky Y positions
            if (!sticky && (field.position.y + stickyRang) > y && (field.position.y - stickyRang) < y && field.position.y < previousxy.y) {
                moveSelectedFields.call(this, field, 0, y - field.position.y, true);
                sticky = true;
            }
            if (!sticky && (field.position.y + field.options.height + stickyRang) > y && (field.position.y + field.options.height - stickyRang) < y && field.position.y > previousxy.y) {
                moveSelectedFields.call(this, field, 0, y - field.options.height - field.position.y, true);
                sticky = true;
            }

            let exactmatch = (y === field.position.y || y === field.position.y + field.options.height);
            let line = new PIXI.Graphics();
            line.position.set(0, y);
            line.lineStyle(exactmatch ? 2 : 1, 0x2626c9)
                .moveTo(0, 0)
                .lineTo(cardSide.card.width, 0);
            if (exactmatch)
            {
                const text = new PIXI.Text('Y: ' + pixelToUnit.call(this, y), {fontFamily: 'Arial', fontSize: '10pt', fill: 0x000000});
                const label = new PIXI.Graphics();
                label.lineStyle(1, 0x000000, 1);
                label.beginFill(0xffd400, 1);
                label.drawRect(0, 0, text.width, text.height);
                label.endFill();
                label.addChild(text);
                label.position.set((field.position.x - 40) > 0 ? (field.position.x - 40) : (field.position.x + field.options.width + 25), 0);
                line.addChild(label);
            }
            cardSide.card.addChild(line);
            cardSide.highlights.push(line);
        }
    });
}

function selectAllFields(cardSide)
{
    if (cardSide === undefined || cardSide == null) {
        this.getSides().forEach(sideType => {
            const side = this.state.sides[sideType];
            selectAllFields.call(this, side);
        });
    } else {
        cardSide.card.children.forEach((f) => {
            selectField.call(this, f);
        });
    }
}

function selectField(field)
{
    if (field.selected === undefined || field.selected === null) {
        field.selected = createSelectedSprite.call(this, field);
        field.addChild(field.selected);
        this.state.selectedfield.push(field);
    }
}

function unselectField(field, updatelist)
{
    if (updatelist === undefined) {
        updatelist = true;
    }

    if (field === undefined || field === null) {
        if (this.state.selectedfield.length > 0)
        {
            this.state.selectedfield.forEach((f) => {
                unselectField.call(this, f, false)
            });
            this.state.selectedfield = [];
        }
    } else {
        field.removeChild(field.selected);
        field.selected = null;
        field.cursor = 'cursor';
        if (updatelist) {
            let index = this.state.selectedfield.indexOf(field);
            if (index > -1) {
                if (this.state.selectedfield.length > 1) {
                    this.state.selectedfield.splice(index, 1);
                } else {
                    this.state.selectedfield = [];
                }
            }
        }
    }

    if (updatelist) {
        this.setState({
            selectedfield: this.state.selectedfield
        });
    }
}

function cutField()
{
    if (this.state.selectedfield.length > 0)
    {
        this.state.clipboardfield = [];
        this.state.selectedfield.forEach((f) => {
            this.state.clipboardfield.push(f.options);
            f.parent.removeChild(f);
            f.destroy(true);
        });
        this.state.clipboardfieldSideType = this.state.selectedfield[0].sideType;
        unselectField.call(this);
    }
}

function copyField()
{
    if (this.state.selectedfield.length > 0)
    {
        this.state.clipboardfield = [];
        this.state.selectedfield.forEach((f) => {
            this.state.clipboardfield.push(Object.assign({}, f.options));
        });
        this.state.clipboardfieldSideType = this.state.selectedfield[0].sideType;
    }
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(),
      scaleX = canvas.width / rect.width,
      scaleY = canvas.height / rect.height;
  
    return {
      x: (evt.clientX - rect.left) * scaleX,
      y: (evt.clientY - rect.top) * scaleY
    }
  }

/**
 *
 * @param options
 * @param targetDiv renderer for recto or verso
 * @param sideType 'recto' or 'verso'
 */
async function pasteFieldFromMenu(ev, canvas, sideType)
{
    const pos = getMousePos(canvas.current, ev);
    const cardSide = this.state.sides[sideType];
    const x = pos.x - cardSide.card.x;
    const y = pos.y - cardSide.card.y;

    await pasteField.call(this, x, y, sideType);
}

async function pasteField(x, y, sideType)
{
    if (this.state.clipboardfield !== null && this.state.clipboardfield.length > 0)
    {
        await Promise.all(this.state.clipboardfield.map(async (f) => {
            const newfield = await createField.call(this,
                f.type,
                {x: x, y: y},
                f,
                {sideType: sideType}
            );
            selectField.call(this, newfield, sideType);
        }));
        this.state.clipboardfield = null;

        saveCurrentSnapshot.call(this);
        return true;
    }

    return false;
}

function deleteField()
{
    if (this.state.selectedfield.length > 0)
    {
        this.state.selectedfield.forEach((f) => {
            if (f.droppableId !== undefined)
                $(".draggableField[data-id='" + f.droppableId + "']").show();
            f.parent.removeChild(f);
        })
        unselectField.call(this);

        saveCurrentSnapshot.call(this);
    }
}

function editInternalField()
{
    if (this.state.selectedfield.length > 0)
    {
        this.setState({
            show_field: true
        });
        sortByZIndex.call(this);
    }
}

function editConditionalRenderingField()
{
    if (this.state.selectedfield.length > 0)
    {
        this.setState({
            show_conditionalrendering: true
        });
    }
}

/**
 * Recreate the currently selected field.
 *
 * createOpt is a dict containing some creation option, such
 * as sideType or autoSizeImg.
 * @param createOpt
 */
async function recreateSelectedField(createOpt)
{
    if (this.state.selectedfield.length > 0)
    {
        const options = this.state.selectedfield[0].options;
        let generatedField = await createField.call(this,
            options.type,
            {x: options.x, y: options.y},
            options,
            createOpt
        );
        if (generatedField)
        {
            this.state.selectedfield[0].parent.removeChild(this.state.selectedfield[0]);
            this.state.selectedfield[0].destroy();
            this.state.selectedfield[0] = generatedField;
            this.state.selectedfield[0].selected = createSelectedSprite.call(this, this.state.selectedfield[0]);
            this.state.selectedfield[0].addChild(this.state.selectedfield[0].selected);
        }
        else
            this.showAlert.call(this, "danger", this.props.t('alerts.error'), this.props.t('alerts.errorDuringFieldGeneration'));
    }
    sortByZIndex.call(this);
}

function editField()
{
    if (this.state.selectedfield.length > 0)
    {
        let newstate = {};
        newstate['show_field_' + this.state.selectedfield[0].options.type]  = true;
        this.setState(newstate);
    }
}

function updateField(field)
{
    if (this.state.selectedfield.length > 0)
    {
        const options = Object.keys(field);
        $.each(options, (index, key) =>
        {
            this.state.selectedfield[0].options[key] = field[key];
        });

        // When we edit a picture field, we'll automatically resize the
        // image.
        const createOpt = {
            sideType: this.state.selectedfield[0].sideType,
            autoSizeImg: true,
            maxWidth: this.state.cardwidth,
            maxHeight: this.state.cardheight
        };
        recreateSelectedField.call(this, createOpt);

        saveCurrentSnapshot.call(this);
    }
}

function addFieldFromList(ev, canvas, sideType)
{
    const pos = getMousePos(canvas.current, ev);
    const cardSide = this.state.sides[sideType];
    this.setState({
        currentside: sideType,
        add_x: pos.x - cardSide.card.x,
        add_y: pos.y -  cardSide.card.y,
        show_addfieldfromlist: true
    });
}

async function addFieldFromListConfirm(f)
{
    const cardRef = this.state.sides[this.state.currentside].card;
    let printField = this.props.fieldlist.findOne({_id: f.id});
    if (printField)
    {
        let field = await createField.call(this,
            printField.type,
            {x: this.state.add_x, y: this.state.add_y},
            undefined,
            {sideType: this.state.currentside}
        );
        field.options.name = printField.name;
        if (printField.type === 'label')
        {
            field.options.value = '<<' + printField.name + '>>';
            cardRef.removeChild(field);
            field = await createField.call(this, printField.type,
                {x: field.options.x, y: field.options.y},
                field.options,
                {sideType: this.state.currentside});
        }

        saveCurrentSnapshot.call(this);
    }
}

export {
    cleanHighlights, addFieldToCard ,createField ,alignSelectedField, selectFieldsInArea, moveSelectedFields, highlightFieldPositions, selectAllFields
    ,selectField, unselectField, cutField, copyField, pasteFieldFromMenu, pasteField, deleteField, editField, editInternalField, editConditionalRenderingField
    ,recreateSelectedField, updateField, addFieldFromList, addFieldFromListConfirm
}
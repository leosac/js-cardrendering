/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import * as PIXI from "pixi.js";
import {
    createFingerprintField, createCircleShapeField, createPictureField,
    createQRCodeField, createRectangleShapeField, createTextField,
    createBarcodeField, createPDF417Field, createDatamatrixField
} from './fieldFactory';

class Fields {
    constructor(cardside) {
        this.cardside = cardside;
        this.blankimg = "data:image/png;base64,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";
    }

    cleanHighlights() {
        if (this.cardside.graphics.highlights !== undefined)
        {
            this.cardside.graphics.highlights.forEach((f) => {
                this.cardside.graphics.card.removeChild(f);
            });
        }
        this.cardside.graphics.highlights = [];
    }

    addFieldToCard(field) {
        if (field !== null)
        {
            field.interactive = this.cardside.options.interaction;
            if (this.cardside.options.interaction) {
                field
                    .on('mousedown', (event) =>
                    {
                        if (this.cardside.options.onFieldDragStart) {
                            this.cardside.options.onFieldDragStart(event, this.cardside, field);
                        }
                    })
                    .on('touchstart', (event) =>
                    {
                        if (this.cardside.options.onFieldDragStart) {
                            this.cardside.options.onFieldDragStart(event, this.cardside, field);
                        }
                    })
                    .on('mouseup', (event) =>
                    {
                        if (this.cardside.options.onFieldDragEnd) {
                            this.cardside.options.onFieldDragEnd(event, this.cardside, field);
                        }
                    })
                    .on('mouseupoutside', (event) =>
                    {
                        if (this.cardside.options.onFieldDragEnd) {
                            this.cardside.options.onFieldDragEnd(event, this.cardside, field);
                        }
                    })
                    .on('touchend', (event) =>
                    {
                        if (this.cardside.options.onFieldDragEnd) {
                            this.cardside.options.onFieldDragEnd(event, this.cardside, field);
                        }
                    })
                    .on('touchendoutside', (event) =>
                    {
                        if (this.cardside.options.onFieldDragEnd) {
                            this.cardside.options.onFieldDragEnd(event, this.cardside, field);
                        }
                    })
                    .on('mousemove', (event) =>
                    {
                        if (this.cardside.options.onFieldDragMove) {
                            this.cardside.options.onFieldDragMove(event, this.cardside, field);
                        }
                    })
                    .on('touchmove', (event) =>
                    {
                        if (this.cardside.options.onFieldDragMove) {
                            this.cardside.options.onFieldDragMove(event, this.cardside, field);
                        }
                    });
            }
            if (field.selected)
            {
                field.addChild(this.createSelectedSprite(field));
            }
            this.cardside.graphics.card.addChild(field);
            this.cardside.sortByZIndex();

            if (this.cardside.options.onFieldAdded) {
                this.cardside.options.onFieldAdded(field);
            }
        }
    }

    /**
     * Create a new field / element on the stage.
     *
     * @param options options for the field
     * @param position
     * @param createOpt some option regarding creation option
     *        {autoSizeImg: true|false}
     * @returns {*}
     */
    async createField(options, position, createOpt) {
        let field = null;
        if (position !== undefined) {
            // Special case where we shouldn't change the position
            if (position.x !== -1 && position.y !== -1) {
                options.x = Math.round(position.x);
                options.y = Math.round(position.y);
            }
        } else {
            position = {x: 0, y: 0};
        }

        if (options.type === 'label') {
            field = createTextField({
                useMacros: false,
                value: 'Label',
                color: 0x000000,
                colorFill: -1,
                fontFamily: 'Verdana',
                fontSize: '12pt',
                fontStyle: 'Normal',
                align: 'TopLeft',
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
                border: {
                    width: 0,
                    color: 0x000000
                },
                ...options
            });
        } else if (options.type === 'picture') {
            field = await createPictureField({
                useMacros: false,
                value: this.blankimg,
                width: 75,
                height: 75,
                x: Math.round(position.x),
                y: Math.round(position.y),
                zIndex: 0,
                rotation: 0,
                border: {
                    width: 0,
                    color: 0x000000
                },
                ...options
            }, createOpt);
        } else if (options.type === 'barcode') {
            field = await createBarcodeField({
                useMacros: false,
                value: '012345',
                fontFamily: 'code39',
                width: 100,
                height: 30,
                color: 0x000000,
                x: Math.round(position.x),
                y: Math.round(position.y),
                zIndex: 0,
                rotation: 0,
                ...options
            }, this.cardside.data.card.layout.dpi);
        } else if (options.type === 'pdf417') {
            field = await createPDF417Field({
                useMacros: false,
                value: '012345',
                fontSize: 30,
                width: 75,
                height: 75,
                color: 0x000000,
                x: Math.round(position.x),
                y: Math.round(position.y),
                ecLevel: 1,
                zIndex: 0,
                rotation: 0,
                ...options
            }, this.cardside.data.card.layout.dpi);
        } else if (options.type === 'datamatrix') {
            field = await createDatamatrixField({
                useMacros: false,
                value: '012345',
                width: 75,
                height: 75,
                color: 0x000000,
                x: Math.round(position.x),
                y: Math.round(position.y),
                sizeIdx: -2,
                scheme: 0,
                zIndex: 0,
                rotation: 0,
                ...options
            }, this.cardside.data.card.layout.dpi);
        } else if (options.type === 'qrcode') {
            field = await createQRCodeField({
                useMacros: false,
                value: 'https://www.leosac.com',
                ecLevel: 'M',
                width: 132,
                height: 132,
                color: 0x000000,
                x: Math.round(position.x),
                y: Math.round(position.y),
                zIndex: 0,
                rotation: 0,
                ...options
            }, this.cardside.data.card.layout.dpi);
        } else if (options.type === 'rectangle') {
            field = createRectangleShapeField({
                useMacros: false,
                color: 0xffffff,
                width: 75,
                height: 75,
                x: Math.round(position.x),
                y: Math.round(position.y),
                zIndex: 0,
                rotation: 0,
                border: {
                    width: 1,
                    color: 0x000000
                },
                ...options
            });
        } else if (options.type === 'circle') {
            field = createCircleShapeField({
                useMacros: false,
                color: 0xffffff,
                width: 75,
                height: 75,
                x: Math.round(position.x),
                y: Math.round(position.y),
                zIndex: 0,
                rotation: 0,
                border: {
                    width: 1,
                    color: 0x000000
                },
                ...options
            });
        } else if (options.type === 'fingerprint') {
            field = createFingerprintField({
                useMacros: false,
                autoRequest: false,
                targets: [],
                x: Math.round(position.x),
                y: Math.round(position.y),
                width: 64,
                height: 64,
                zIndex: 0,
                rotation: 0,
                border: {
                    width: 0,
                    color: 0x000000
                },
                ...options
            });
        }  else {
            this.unselectField();
        }

        if (field) {
            this.addFieldToCard(field);
            this.cardside.handleOnChange();
        }
        
        return field;
    }

    alignSelectedField(align) {
        if (this.cardside.data.fields.selected.length > 1)
        {
            // Found max positions
            let i = 0;
            let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
            this.cardside.data.fields.selected.forEach((f) => {
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
            this.cardside.data.fields.selected.forEach((f) => {
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


    selectFieldsInArea(area) {
        this.cardside.graphics.card.children.forEach((f) => {
            if (f.options !== undefined && f.options.type !== undefined)
            {
                const areaRect = area.getBounds();
                const fRect = f.getBounds();

                // Only select fields fully in the area

                if (fRect.x >= areaRect.x && (fRect.x + fRect.width) <= (areaRect.x + areaRect.width) &&
                    fRect.y >= areaRect.y && (fRect.y + fRect.height) <= (areaRect.y + areaRect.height))
                {
                    this.selectField(f);
                }
            }
        });
    }

    moveSelectedFields(mx, my, skipStepAlign) {
        this.cardside.data.fields.selected.forEach((f) => {
            this.moveField(f, mx, my, skipStepAlign);
        });
        this.cardside.handleOnChange();
    }

    moveField(field, mx, my, skipStepAlign) {
        if (skipStepAlign !== true) {
            // Align to step
            if ((mx % this.cardside.data.grid.step) !== 0) {
                mx = 0;
            }
            if ((my % this.cardside.data.grid.step) !== 0) {
                my = 0;
            }
        }
        if (mx !== 0 || my !== 0)
        {
            field.options.x += mx;
            field.position.x += mx;
            field.options.y += mx;
            field.position.y += my;
            field.moved = true;
        }
    }

    pixelToUnit(cardwidth_unit, cardwidth, pixel) {
        if (cardwidth_unit === cardwidth)
            return pixel;

        const ratio = cardwidth_unit / cardwidth;
        return Math.round(pixel * ratio * 10000) / 10000;
    }

    unitToPixel(cardwidth_unit, cardwidth, unit) {
        if (cardwidth_unit === cardwidth)
            return unit;

        const ratio = cardwidth_unit / cardwidth;
        return Math.round(unit / ratio);
    }

    highlightFieldPositions(field, previousxy) {
        this.cleanHighlights();

        const displayRang = 10;
        const stickyRang = 4;
        let xa = [], ya = [];
        let stickx = false, sticky = false;
        this.cardside.graphics.card.children.forEach((f) => {
            if (f.options !== undefined && f.options.type !== undefined && f !== field) {
                if (xa.indexOf(f.options.x) === -1) {
                    xa.push(f.options.x);
                }
                if (ya.indexOf(f.options.y) === -1) {
                    ya.push(f.options.y);
                }
                if (xa.indexOf(f.options.x + f.options.width) === -1) {
                    xa.push(f.options.x + f.options.width);
                }
                if (ya.indexOf(f.options.y + f.options.height) === -1) {
                    ya.push(f.options.y + f.options.height);
                }
            }
        });

        if (this.cardside.graphics.grid !== undefined && this.cardside.graphics.grid !== null) {
            this.cardside.graphics.grid.children.forEach((g) => {
                if (xa.indexOf(g.position.x) === -1) {
                    xa.push(g.position.x);
                }
                if (ya.indexOf(g.position.y) === -1) {
                    ya.push(g.position.y);
                }
                if (xa.indexOf(g.position.x + g.width) === -1) {
                    xa.push(g.position.x + g.width);
                }
                if (ya.indexOf(g.position.y + g.height) === -1) {
                    ya.push(g.position.y + g.height);
                }
            });
        }

        xa.forEach((x) => {
        if (((field.position.x + displayRang) > x && (field.position.x - displayRang) < x) ||
            ((field.position.x + field.options.width + displayRang) > x && (field.position.x + field.options.width - displayRang) < x)) {

            // Sticky X positions
            if (!stickx && (field.position.x + stickyRang) > x && (field.position.x - stickyRang) < x && field.position.x < previousxy.x) {
                this.moveField(field, x - field.position.x, 0, true);
                stickx = true;
            }
            if (!stickx && (field.position.x + field.options.width + stickyRang) > x && (field.position.x + field.options.width - stickyRang) < x && field.position.x > previousxy.x) {
                this.moveField(field, x - field.options.width - field.position.x, 0, true);
                stickx = true;
            }

            let exactmatch = (x === field.position.x || x === field.position.x + field.options.width);
            let line = new PIXI.Graphics();
            line.position.set(x, 0);
            line.lineStyle(exactmatch ? 2 : 1, 0x2626c9)
                .moveTo(0, 0)
                .lineTo(0, this.cardside.graphics.card.height);
            if (exactmatch)
            {
                const text = new PIXI.Text('X: ' + this.pixelToUnit(this.cardside.data.card.width_unit, this.cardside.data.card.width, x) + this.cardside.data.grid.unit, {fontFamily: 'Arial', fontSize: '10pt', fill: 0x000000});
                const label = new PIXI.Graphics();
                label.lineStyle(1, 0x000000, 1);
                label.beginFill(0xffd400, 1);
                label.drawRect(0, 0, text.width, text.height);
                label.endFill();
                label.addChild(text);
                label.position.set(0, (field.position.y - 25) > 0 ? (field.position.y - 25) : (field.position.y + field.options.height + 25));
                line.addChild(label);
            }
            this.cardside.graphics.card.addChild(line);
            this.cardside.graphics.highlights.push(line);
        }
        });

        ya.forEach((y) => {
            if (((field.position.y + displayRang) > y && (field.position.y - displayRang) < y) ||
                ((field.position.y + field.options.height + displayRang) > y && (field.position.y + field.options.height - displayRang) < y)) {

                // Sticky Y positions
                if (!sticky && (field.position.y + stickyRang) > y && (field.position.y - stickyRang) < y && field.position.y < previousxy.y) {
                    this.moveField(field, 0, y - field.position.y, true);
                    sticky = true;
                }
                if (!sticky && (field.position.y + field.options.height + stickyRang) > y && (field.position.y + field.options.height - stickyRang) < y && field.position.y > previousxy.y) {
                    this.moveField(field, 0, y - field.options.height - field.position.y, true);
                    sticky = true;
                }

                let exactmatch = (y === field.position.y || y === field.position.y + field.options.height);
                let line = new PIXI.Graphics();
                line.position.set(0, y);
                line.lineStyle(exactmatch ? 2 : 1, 0x2626c9)
                    .moveTo(0, 0)
                    .lineTo(this.cardside.graphics.card.width, 0);
                if (exactmatch)
                {
                    const text = new PIXI.Text('Y: ' + this.pixelToUnit(this.cardside.data.card.width_unit, this.cardside.data.card.width, y) + this.cardside.data.grid.unit, {fontFamily: 'Arial', fontSize: '10pt', fill: 0x000000});
                    const label = new PIXI.Graphics();
                    label.lineStyle(1, 0x000000, 1);
                    label.beginFill(0xffd400, 1);
                    label.drawRect(0, 0, text.width, text.height);
                    label.endFill();
                    label.addChild(text);
                    label.position.set((field.position.x - 40) > 0 ? (field.position.x - 40) : (field.position.x + field.options.width + 25), 0);
                    line.addChild(label);
                }
                this.cardside.graphics.card.addChild(line);
                this.cardside.graphics.highlights.push(line);
            }
        });
    }

    selectAllFields() {
        this.cardside.graphics.card.children.forEach((f) => {
            this.selectField(f);
        });
    }

    selectField(field) {
        if (field.selected === undefined || field.selected === null) {
            field.selected = this.createSelectedSprite( field);
            field.addChild(field.selected);
            this.cardside.data.fields.selected.push(field);
            if (this.cardside.options.onSelectionChanged) {
                this.cardside.options.onSelectionChanged(this.cardside.data.fields.selected);
            }
        }
    }

    unselectField(field, updatelist) {
        if (updatelist === undefined) {
            updatelist = true;
        }

        if (field === undefined || field === null) {
            if (this.cardside.data.fields.selected.length > 0)
            {
                this.cardside.data.fields.selected.forEach((f) => {
                    this.unselectField(f, false)
                });
                this.cardside.data.fields.selected = [];
                if (this.cardside.options.onSelectionChanged) {
                    this.cardside.options.onSelectionChanged(this.cardside.data.fields.selected);
                }
            }
        } else {
            field.removeChild(field.selected);
            field.selected = null;
            field.cursor = 'cursor';
            if (updatelist) {
                let index = this.cardside.data.fields.selected.indexOf(field);
                if (index > -1) {
                    if (this.cardside.data.fields.selected.length > 1) {
                        this.cardside.data.fields.selected.splice(index, 1);
                    } else {
                        this.cardside.data.fields.selected = [];
                    }
                    if (this.cardside.options.onSelectionChanged) {
                        this.cardside.options.onSelectionChanged(this.cardside.data.fields.selected);
                    }
                }
            }
        }
    }

    cutField() {
        if (this.cardside.data.fields.selected.length > 0)
        {
            this.cardside.data.fields.clipboard = [];
            this.cardside.data.fields.selected.forEach((f) => {
                this.cardside.data.fields.clipboard.push(f.options);
                f.parent.removeChild(f);
                f.destroy(true);
            });
            this.unselectField();
        }
    }

    copyField() {
        if (this.cardside.data.fields.selected.length > 0)
        {
            this.cardside.data.fields.clipboard = [];
            this.cardside.data.fields.selected.forEach((f) => {
                this.cardside.data.fields.clipboard.push(Object.assign({}, f.options));
            });
        }
    }

    getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect(),
        scaleX = canvas.width / rect.width,
        scaleY = canvas.height / rect.height;
    
        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY
        };
    }

    /**
     *
     * @param options
     * @param targetDiv renderer div
     */
    async pasteFieldAtMousePos(ev, canvas)
    {
        const pos = this.getMousePos(canvas, ev);
        const x = pos.x - this.cardside.graphics.card.x;
        const y = pos.y - this.cardside.graphics.card.y;

        await this.pasteField(x, y);
    }

    async pasteField(x, y) {
        if (this.cardside.data.fields.clipboard !== null && this.cardside.data.fields.clipboard.length > 0)
        {
            await Promise.all(this.cardside.data.fields.clipboard.map(async (f) => {
                const newfield = await this.createField(f, {x: x, y: y});
                this.selectField(newfield);
            }));
            this.cardside.data.fields.clipboard = null;

            this.cardside.handleOnChange();
            return true;
        }

        return false;
    }

    deleteField() {
        if (this.cardside.data.fields.selected.length > 0)
        {
            this.cardside.data.fields.selected.forEach((f) => {
                f.parent.removeChild(f);
            })
            this.unselectField();

            this.cardside.handleOnChange();
        }
    }

    /**
     * Recreate the currently selected field.
     *
     * createOpt is a dict containing some creation option, such as autoSizeImg.
     * @param createOpt
     */
    async recreateSelectedField(createOpt)
    {
        if (this.cardside.data.fields.selected.length > 0)
        {
            const options = this.cardside.data.fields.selected[0].options;
            let generatedField = await this.cardside.features.fields.createField(options, undefined, createOpt);
            if (generatedField)
            {
                this.cardside.data.fields.selected[0].parent.removeChild(this.cardside.data.fields.selected[0]);
                this.cardside.data.fields.selected[0].destroy();
                this.cardside.data.fields.selected[0] = generatedField;
                this.cardside.data.fields.selected[0].selected = this.createSelectedSprite(this.cardside.data.fields.selected[0]);
                this.cardside.data.fields.selected[0].addChild(this.cardside.data.fields.selected[0].selected);
            }
            else
            {
                this.cardside.handleOnError("errorDuringFieldGeneration");
            }
        }
        this.cardside.sortByZIndex();
    }

    updateField(field, createOpt = {}) {
        if (this.cardside.data.fields.selected.length > 0)
        {
            Object.keys(field).forEach(key => {
                this.cardside.data.fields.selected[0].options[key] = field[key];
            });

            this.recreateSelectedField({
                autoSizeImg: false,
                maxWidth: this.cardside.data.card.width,
                maxHeight: this.cardside.data.card.height,
                ...createOpt
            });

            this.cardside.handleOnChange();
        }
    }

    createSelectedSprite(parent) {
        const boxwidth = (parent.width + 1) / parent.scale.x;
        const boxheight = parent.height / parent.scale.y;
        const selectgraph = new PIXI.Graphics();
        selectgraph.lineStyle(1, 0x000000, 1);
        selectgraph.drawRect(-1, -1, boxwidth, boxheight);
        selectgraph.lineStyle(1, 0xffffff, 1);
        selectgraph.drawRect(-2, -2, (parent.width + 3) / parent.scale.x , (parent.height + 2) / parent.scale.y);

        if (this.cardside.options.onSelectedSpriteCreated) {
            this.cardside.options.onSelectedSpriteCreated(this.cardside, selectgraph, boxwidth, boxheight, parent.scale);
        }
        
        parent.box = selectgraph;
        return selectgraph;
    }

    getAllNamedFields() {
        let fields = [];
        const cardRef = this.cardside.graphics.card;
        for (let f = 0; f < cardRef.children.length; ++f) {
            const child = cardRef.getChildAt(f);
            if (child.options !== undefined && child.options.name !== undefined && child.options.name !== '' && child.options.type !== undefined) {
                fields.push({...child.options});
            }
        }
        return fields;
    }

    resolveVariables(input, data) {
        return input.replace(/%%(\w*)/, (match, capture) => {
            const cname = capture.toLowerCase();
            return (data && data[cname]) ? data[cname] : '';
        });
    }

    resolveMacros(input, data) {
        let res = input;
        const funcre = /\$(?<func>\w+)\((?<params>.*)\)/g;
        // We only support basic macro definition for now, no nested macros support.
        let f = funcre.exec(res);
        if (f != null && f.groups.func) {
            const macro = f.groups.func.toUpperCase();
            let params = [];
            if (f.groups.params) {
                const matches = f.groups.params.matchAll(/(,?(?<param>[ %\w]*)*,?)/g);
                params = Array.from(matches).map(m => m.groups.param).filter(m => m != undefined);
            }

            if (macro === "TIMESTAMP" && params.length >= 1) {
                res = Math.floor(Date.parse(params[0]).valueOf() / 1000);
            } else if (macro === "EXPLODE" && params.length >= 2) {
                const index = Number(params[0]);
                let separator = ",";
                let val = params[1];
                if (params.length >= 3) {
                    separator = params[1];
                    val = params[2];
                }
                const parts = this.resolveVariables(val, data).split(separator);
                if (index < parts.length) {
                    res = parts[index];
                } else {
                    res = "";
                    console.warn("EXPLODE macro error. Wrong index.");
                }
            } else if (macro === "CONTAINS" && params.length >= 2) {
                const success = params.length > 2 ? params[2] : params[1];
                const error = params.length > 3 ? params[3] : '';
                res = (this.resolveVariables(params[1], data).indexOf(params[0]) !== -1) ? success : error;
            } else if (macro === "SUB" && params.length >= 3) {
                const index = Number(params[0]);
                const length = Number(params[1]);
                res = this.resolveVariables(params[2], data).substring(index, index + length);
            } else {
                console.warn("Cannot resolve macro.", input, macro, params);
            }
        } else {
            res = this.resolveVariables(res, data);
        }
        return res;
    }
}

export default Fields;
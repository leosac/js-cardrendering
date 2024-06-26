/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import * as PIXI from "pixi.js";
import { createCanvas } from "canvas";
import { hexColorToSignedNumber, inchToPixel, inchToMillimeter } from './convert';
import Fields from './fields';
import Grid from './grid';
import Assets from './assets';
import CardHelper from './helpers';

class CardRenderer {
    constructor(options) {
        if (!options) {
            options = {};
        }
        this.options = options;
        this.features = {
            fields: new Fields(this),
            grid: new Grid(this),
            assets: new Assets(this)
        };
        this.data = {
            card: {
                layout: {
                    size: 'cr80',
                    orientation: 'landscape',
                    rounded: true,
                    assets: {
                        safetyarea: false,
                        contactchip: false,
                        magstripe_1to2: false,
                        magstripe_5to16: false,
                        luggagetagslot: false
                    },
                    dpi: 300
                },
                width: 0,
                height: 0,
                width_unit: 0,
                height_unit: 0,
                border: 1
            },
            fields: {
                selected: [],
                clipboard: []
            },
            grid: {
                ruler: true,
                enabled: false,
                unit: 'px',
                scale: 1,
                step: 1,
                columns: 8,
                rows: 6,
                ...options.grid
            }
        };
        this.graphics = {};
        
        this.layoutsizes = {
            // Sizes references are in inches
            in: {
                cr80: [3.375, 2.125],
                cr79: [3.303, 2.051],
                cr100: [3.88, 2.63],
                res_4to3: [6.2992, 4.7244],
                res_3to2: [6.2992, 4.1968],
                res_8to5: [6.2992, 3.9370],
                res_5to3: [6.2992, 3.7795],
                res_16to9: [6.2992, 3.5433],
                custom: [3.375, 2.125]
            },
            mm: {},
            px: {}
        };
        // We convert into others units for further use
        Object.keys(this.layoutsizes.in).forEach(size => {
            const i = this.layoutsizes.in[size];
            this.layoutsizes.mm[size] = [inchToMillimeter(i[0]), inchToMillimeter(i[1])];
            // layout sizes for Pixel unit is dependent on DPI. It will then be calculated on stage creation
        });
    }

    handleOnError(error) {
        if (this.options.onError) {
            this.options.onError(error);
        } else {
            console.error(error);
        }
    }

    handleOnChange() {
        if (this.options.onChange) {
            this.options.onChange();
        }
    }

    /**
     * Create the PIXI stage for one side of card
     */
    async createCardStage(layout = {size: 'cr80', orientation: 'landscape'}, tpl = undefined, resize = false)
    {
        if (this.options.stage) {
            this.graphics.stage = this.options.stage;
        } else {
            if (this.graphics.stage) {
                this.graphics.stage.destroy(true);
            }
            this.graphics.stage = new PIXI.Container();
        }

        const sizes = CardHelper.getLayoutSizes();
        if (layout.size === undefined || layout.size === '' || !(layout.size in this.layoutsizes['in'])) {
            layout.size = sizes[0].value;
        }
        const size = sizes.find(s => s.value === layout.size);
        this.data.card.layout = {
            ...(size ? size.default : {}),
            ...layout
        };

        if (!this.data.card.layout.dpi) {
            // Screen are usually 96 dpi
            // The ratio 1.373 is arbitrary to have proper sizing at screen
            // This is now for compatibility reason with legacy templates, we should probably better use 300 dpi by default and rescale for screen rendering
            this.data.card.layout.dpi = 96 * 1.373;
        }
        // We convert into pixel units for further use
        Object.keys(this.layoutsizes.in).forEach(size => {
            const i = this.layoutsizes.in[size];
            this.layoutsizes.px[size] = [inchToPixel(i[0], this.data.card.layout.dpi), inchToPixel(i[1], this.data.card.layout.dpi)];
        });

        this.data.card.width = (layout.orientation === 'landscape') ? this.layoutsizes['px'][layout.size][0] : this.layoutsizes['px'][layout.size][1];
        this.data.card.height = (layout.orientation === 'landscape') ? this.layoutsizes['px'][layout.size][1] : this.layoutsizes['px'][layout.size][0];
        this.data.card.width_unit = (layout.orientation === 'landscape') ? this.layoutsizes[this.data.grid.unit][layout.size][0] : this.layoutsizes[this.data.grid.unit][layout.size][1];
        this.data.card.height_unit = (layout.orientation === 'landscape') ? this.layoutsizes[this.data.grid.unit][layout.size][1] : this.layoutsizes[this.data.grid.unit][layout.size][0];
        let width = this.data.card.width + (2 * this.data.card.border);
        let height = this.data.card.height + (2 * this.data.card.border);
        const rulerwidth = 40;
        const rulerspacing = 10;

        //Resize by screen resolution
        let parentRectoContainer = undefined;
        if (this.options.canvas) {
            parentRectoContainer = this.options.canvas.parentNode;
        }
        if (parentRectoContainer && width > parentRectoContainer.offsetWidth) {
            this.data.grid.ruler = false;
            this.data.grid.scale = 1 - ((width - parentRectoContainer.offsetWidth) / width);
        } else {
            if (resize) {
                this.data.grid.scale = 1;
            }
        }
        if (this.data.grid.ruler) {
            width += rulerwidth + rulerspacing * 2;
            height += rulerwidth + rulerspacing * 2;
        }

        if (this.options.renderer) {
            this.graphics.renderer = this.options.renderer;
        } else {
            //Create the renderer
            this.graphics.renderer = PIXI.autoDetectRenderer({width: width * this.data.grid.scale,
                heigth: height * this.data.grid.scale,
                transparent: true,
                clearBeforeRender: true,
                view: this.options.canvas
            });
        }
        //Resize Canvas with real size
        this.graphics.renderer.resize(width * this.data.grid.scale , height * this.data.grid.scale);
        this.graphics.card = new PIXI.Graphics();
        this.graphics.card.options = {
            background: tpl ? tpl.background : {}
        };
        await this.drawCardBackground();
        this.graphics.card.interactive = this.options.interaction;
        this.graphics.card.buttonMode = true;
        this.graphics.card.cursor = this.options.interaction ? 'crosshair' : 'not-allowed';
        if (this.options.interaction) {
            this.graphics.card
                .on('mousedown', (event) => {
                    if (this.options.onCardClickDown) {
                        this.options.onCardClickDown(event, this);
                    }
                })
                .on('touchstart', (event) => {
                    if (this.options.onCardClickDown) {
                        this.options.onCardClickDown(event, this);
                    }

                })
                .on('mouseup', (event) => {
                    if (this.options.onCardClickUp) {
                        this.options.onCardClickUp(event, this);
                    }
                })
                .on('touchend', (event) => {
                    if (this.options.onCardClickUp) {
                        this.options.onCardClickUp(event, this);
                    }
                });
        }

        if (tpl && tpl.fields) {
            await Promise.all(tpl.fields.map(async (field) => {
                const vfield = await this.features.fields.createField(field);
                if (!vfield) {
                    this.handleOnError("errorDuringFieldGeneration");
                    return;
                }
            }));
        }

        if (this.data.grid.ruler)
        {
            const rulerstep = (this.layoutsizes[this.data.grid.unit][layout.size][0] > 20) ? ((this.layoutsizes[this.data.grid.unit][layout.size][0] > 200) ? 10 : 1) : 0.1;
            const rulerdrawfactor = (rulerstep >= 1) ? 10 * rulerstep : 1;

            const topRuler = new PIXI.Graphics();
            topRuler.lineStyle(1, 0x000000, 1);
            topRuler.beginFill(0xa8a8a8);
            topRuler.drawRect(0, 0, this.data.card.width + rulerspacing * 2, rulerwidth);
            topRuler.endFill();
            for (let i = 0; i < this.data.card.width_unit + rulerstep; i += rulerstep)
            {
                i = Math.round(i * 10000) / 10000;

                const ipx = i * (this.data.card.width / this.data.card.width_unit);
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
            topRuler.position.set(rulerwidth + this.data.card.border, 0);
            if (!topRuler.options)
                topRuler.options = {};
            topRuler.options.zIndex = 999;
            this.graphics.stage.addChild(topRuler);

            const leftRuler = new PIXI.Graphics();
            leftRuler.lineStyle(1, 0x000000, 1);
            leftRuler.beginFill(0xa8a8a8);
            leftRuler.drawRect(0, 0, rulerwidth, this.data.card.height + rulerspacing * 2);
            leftRuler.endFill();
            for (let i = 0; i < this.data.card.height + rulerstep; i += rulerstep)
            {
                i = Math.round(i * 10000) / 10000;

                const ipx = i * (this.data.card.height / this.data.card.height_unit);
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
            leftRuler.position.set(0, rulerwidth + this.data.card.border);
            if (!leftRuler.options)
                leftRuler.options = {};
            leftRuler.options.zIndex = 999;
            this.graphics.stage.addChild(leftRuler);

            this.graphics.card.position.set(rulerwidth + rulerspacing, rulerwidth + rulerspacing);

            this.graphics.card.on('mousemove', (event) =>
                {
                    if (this.options.onCardMouseMove) {
                        this.options.onCardMouseMove(event, this, topRuler, leftRuler);
                    }
                }).on('touchmove', (event) =>
                {
                    if (this.options.onCardMouseMove) {
                        this.options.onCardMouseMove(event, this, topRuler, leftRuler);
                    }
                });
        }
        else
        {
            this.graphics.card .on('mousemove', (event) =>
            {
                if (this.options.onCardMouseMove) {
                    this.options.onCardMouseMove(event, this, undefined, undefined);
                }
            }).on('touchmove', (event) =>
            {
                if (this.options.onCardMouseMove) {
                    this.options.onCardMouseMove(event, this, undefined, undefined);
                }
            });
        }
        this.graphics.card.position.x += this.data.card.border;
        this.graphics.card.position.y += this.data.card.border - 1;

        this.graphics.stage.scale.x = this.data.grid.scale;
        this.graphics.stage.scale.y = this.data.grid.scale;

        this.graphics.stage.addChild(this.graphics.card);
        this.sortByZIndex();

        if (this.data.grid.enabled) {
            this.features.grid.drawGrid();
        }
        this.features.assets.drawAssets();
    }

    animate() {
        if (this.graphics.renderer && this.graphics.stage) {
            this.graphics.renderer.render(this.graphics.stage);
        }

        if (typeof requestAnimationFrame === 'function') {
            requestAnimationFrame(() => this.animate());
        } else {
            setImmediate(() => this.animate());
        }
    }

    /**
     * Sort the template by zindex.
     *
     * This will sort graphics.card and graphics.stage fields.
     */
    sortByZIndex() {
        const zIndexCompare = (a, b) => {
            const ao = a.options || {};
            const bo = b.options || {};
            const az = ao.zIndex || 0;
            const bz = bo.zIndex || 0;
            if (az < bz)
                return -1;
            if (az > bz)
                return 1;
            return 0;
        };

        if (this.graphics.card) {
            this.graphics.card.children.sort(zIndexCompare);
        }

        if (this.graphics.stage && this.graphics.stage.children) {
            this.graphics.stage.children.sort(zIndexCompare);
        }
    }

    /**
     * Draw the card background.
     */
    async drawCardBackground() {
        const cardSideRef = this.graphics.card;
        if (cardSideRef !== null) {
            cardSideRef.clear();

            const bgComponentRef = this.graphics.bg_components;
            // Remove previous bg component
            if (bgComponentRef) {
                bgComponentRef.forEach((bgc) =>
                {
                    cardSideRef.removeChild(bgc);
                });
            }

            let hasBackground = false;
            if (cardSideRef.options.background) {
                if (cardSideRef.options.background.picture) {
                    cardSideRef.options.background.picture = cardSideRef.options.background.picture.trim();
                    if (cardSideRef.options.background.picture !== '') {
                        // Picture as a background.
                        const texture = await PIXI.Assets.load(cardSideRef.options.background.picture);
                        const sprite = new PIXI.Sprite(texture);
                        sprite.options = {};

                        // Stretch background to card dimension.
                        if (cardSideRef.options.background.picture_layout === 3)
                        {
                            sprite.width = this.data.card.width;
                            sprite.height = this.data.card.height;
                        }
                        // Center the background image.
                        else if (cardSideRef.options.background.picture_layout === 2)
                        {
                            const anchor = new PIXI.ObservablePoint(() => {}, null, 0.5, 0.5);
                            sprite.anchor = anchor;
                            sprite.x = this.data.card.width / 2;
                            sprite.y = this.data.card.height / 2;
                        }
                        // Zoom
                        else if (cardSideRef.options.background.picture_layout === 4)
                        {
                            // We need to wait for the texture to be loaded
                            // otherwise we don't have access to width and height
                            // and cannot compute the new scale.
                            const setScaleFct = () => {
                                const xscale = this.data.card.width / sprite.width;
                                const yscale = this.data.card.height / sprite.height;

                                // Keep the smallest scale to avoid becoming too big.
                                const scale = yscale < xscale ? yscale : xscale;
                                sprite.scale = new PIXI.Point(scale, scale);
                            };
                            // Either the texture has already been loaded, in that case
                            // we set the scale right now...
                            if (texture.baseTexture.hasLoaded) {
                                setScaleFct();
                            }
                            // Or we set a callback to adjust the scale when the texture
                            // is loaded.
                            else {
                                texture.on("update", setScaleFct);
                            }
                        }

                        sprite.options.zIndex = -1000; // Far behind, as it is the background...
                        cardSideRef.addChild(sprite);

                        let graphic_border = new PIXI.Graphics();
                        graphic_border.lineStyle(this.data.card.border, 0x000000, 1);
                        graphic_border.options = {};
                        graphic_border.options.zIndex = 990;

                        if (this.data.card.layout.rounded)
                            graphic_border.drawRoundedRect(0, 0, this.data.card.width, this.data.card.height, 20);
                        else
                            graphic_border.drawRect(0, 0, this.data.card.width, this.data.card.height);
                        cardSideRef.addChild(graphic_border);

                        // Removed next time we draw the background.
                        this.graphics.bg_components = [graphic_border, sprite];
                        this.sortByZIndex();
                        hasBackground = true;
                    }
                }
                if (!hasBackground) {
                    // Create card border
                    let graphic_border = new PIXI.Graphics();
                    graphic_border.lineStyle(this.data.card.border, 0x000000, 1);
                    if (this.data.card.layout.rounded)
                        graphic_border.drawRoundedRect(0, 0, this.data.card.width, this.data.card.height, 20);
                    else
                        graphic_border.drawRect(0, 0, this.data.card.width, this.data.card.height);
                    graphic_border.options = {};
                    graphic_border.options.zIndex = 1000;
                    cardSideRef.addChild(graphic_border);

                    // User colored (white included) background.
                    cardSideRef.lineStyle(this.data.card.border, 0x000000, 1);
                    cardSideRef.beginFill(cardSideRef.options.background.color ? hexColorToSignedNumber(cardSideRef.options.background.color) : 0xffffff);

                    if (this.data.card.layout.rounded)
                        cardSideRef.drawRoundedRect(0, 0, this.data.card.width, this.data.card.height, 20);
                    else
                        cardSideRef.drawRect(0, 0, this.data.card.width, this.data.card.height);
                    cardSideRef.endFill();
                    hasBackground = true;
                }
            }
        }
    }

    createCanvas() {
        if (!this.graphics.stage) {
            return undefined;
        }

        this.graphics.renderer.render(this.graphics.stage);

        const resizedCanvas = createCanvas(this.graphics.renderer.view.width / 2, this.graphics.renderer.view.height / 2);
        const resizedContext = resizedCanvas.getContext("2d");

        if (this.data.grid.ruler)
        {
            resizedContext.drawImage(this.graphics.renderer.view, this.graphics.card.position.x - this.data.card.border, this.graphics.card.position.y - this.data.card.border, this.graphics.card.width + this.data.card.border, this.graphics.card.height + this.data.card.border, 0, 0, resizedCanvas.width, resizedCanvas.height);
        }
        else
        {
            resizedContext.drawImage(this.graphics.renderer.view, 0, 0, resizedCanvas.width, resizedCanvas.height);
        }
        return resizedCanvas;
    }

    getTemplate() {
        const tpl = { fields: [] };
        if (this.graphics.card) {
            tpl.background = this.graphics.card.options.background
            if (this.graphics.card.children && this.graphics.card.children.length > 0) {
                for (let i = 0; i < this.graphics.card.children.length; ++i) {
                    let child = this.graphics.card.getChildAt(i);
                    if (child.options !== undefined && child.options.type !== undefined) {
                        tpl.fields.push(child.options);
                    }
                }
            }
        }
        return tpl;
    }

    toJson() {
        const tpl = this.getTemplate();
        return JSON.stringify(tpl, null, 2);
    }

    async setCardData(data) {
        data = Object.entries(data).reduce((carry, [key, value]) => {
            carry[key.toLowerCase()] = value;
            return carry;
        }, {});
        const odata = {};
        this.features.fields.getAllNamedFields().forEach(f => {
            odata[f.name.toLowerCase()] = f.useMacros ? this.features.fields.resolveMacros(f.value, data) : f.value;
        });
        const alldata = {...odata, ...data};

        const cardRef = this.graphics.card;
        let fields = [];
        for (let f = 0; f < cardRef.children.length; ++f) {
            const child = cardRef.getChildAt(f);
            if (child.options !== undefined && child.options.name !== undefined && child.options.name !== '' && child.options.type !== undefined) {
                const childname = child.options.name.toLowerCase();
                if (alldata[childname] !== undefined) {
                    child.options.value = alldata[childname];
                    fields.push(child);
                }
            }
        }

        for (let f = 0; f < fields.length; ++f) {
            cardRef.removeChild(fields[f]);
            await this.features.fields.createField(
                fields[f].options,
                {x: fields[f].options.x, y: fields[f].options.y}
            );
        }
    }
}

export default CardRenderer;
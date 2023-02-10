import $ from 'jquery';
import * as PIXI from "pixi.js-legacy";
import {
    cleanHighlights ,createField, selectFieldsInArea, moveSelectedFields, highlightFieldPositions, selectAllFields
    ,selectField, unselectField, cutField, copyField, pasteField, deleteField, editField ,recreateSelectedField
} from './fields';

import {
    undoTemplate, redoTemplate ,saveCurrentSnapshot
} from './history';

async function onCardClickDown(event, sideType)
{
    if (this.state.selectedfield.length > 0 && (this.state.selectedfield[0].dragging || this.state.selectedfield[0].resizing || this.state.selectedfield[0].rotating))
    {
        onDragEnd.call(this, event, sideType);
    }
    else
    {
        const cardSide = this.state.sides[sideType];
        const position = cardSide.card.toLocal(event.global);
        
        if (cardSide.factorytype === 'cursor')
        {
            if (cardSide.stage.selectarea !== undefined && cardSide.stage.selectarea !== null)
            {
                cardSide.card.removeChild(cardSide.stage.selectarea);
                cardSide.stage.selectarea.destroy(true);
            }
            cardSide.stage.selectarea = new PIXI.Graphics();
            cardSide.stage.selectarea.alpha = 0.3;
            cardSide.stage.selectarea.position.set(position.x, position.y);
            cardSide.card.addChild(cardSide.stage.selectarea);
        }

        let field = await createField.call(this, cardSide.factorytype, position, undefined, {sideType: sideType});
        if (field) {
            saveCurrentSnapshot.call(this);
        }
    }
}

function onCardClickUp(event, sideType)
{
    const cardSide = this.state.sides[sideType];
    if (cardSide.stage.selectarea !== undefined && cardSide.stage.selectarea !== null)
    {
        selectFieldsInArea.call(this, sideType, cardSide.stage.selectarea);
        cardSide.card.removeChild(cardSide.stage.selectarea);
        cardSide.stage.selectarea.destroy(true);
        cardSide.stage.selectarea = null;
    }
}

function onCardMouseMove(event, stage, topRuler, leftRuler)
{
    const position = stage.toLocal(event.global);

    if (this.state.grid.ruler)
    {
        if (topRuler.cursorTracker === undefined || topRuler.cursorTracker === null)
        {
            topRuler.cursorTracker = new PIXI.Graphics();
            topRuler.cursorTracker.lineStyle(1, 0xffff00)
                .moveTo(0, 1)
                .lineTo(0, topRuler.height - 1);
            topRuler.addChild(topRuler.cursorTracker);
        }
        topRuler.cursorTracker.position.set(position.x - topRuler.x, 0);

        if (leftRuler.cursorTracker === undefined || leftRuler.cursorTracker === null)
        {
            leftRuler.cursorTracker = new PIXI.Graphics();
            leftRuler.cursorTracker.lineStyle(1, 0xffff00)
                .moveTo(1, 0)
                .lineTo(leftRuler.width - 1, 0);
            leftRuler.addChild(leftRuler.cursorTracker);
        }
        leftRuler.cursorTracker.position.set(0, position.y - leftRuler.y);
    }

    if (stage.selectarea !== undefined && stage.selectarea !== null)
    {
        stage.selectarea.clear();
        stage.selectarea.lineStyle(1, 0x000000);
        stage.selectarea.beginFill(0xa8a8a8);

        //If x or y negative, we set x/y with negatives values and draw with width/height set as positive
        //If not, x/y set 0, draw with positive values
        //This fix a problem with selected area in reverse
        let areaxpos = 0;
        let areaypos = 0;
        let areawidth = position.x - (this.state.grid.ruler ? topRuler.x : 0) - this.state.cardborder - stage.selectarea.position.x;
        let areaheight = position.y - (this.state.grid.ruler ? leftRuler.y : 0) - this.state.cardborder - stage.selectarea.position.y;

        if (areawidth < 0)
        {
            areaxpos = areawidth;
            areawidth = Math.abs(areawidth);
        }
        if (areaheight < 0)
        {
            areaypos = areaheight;
            areaheight = Math.abs(areaheight);
        }
        stage.selectarea.drawRect(areaxpos, areaypos, areawidth, areaheight);
        stage.selectarea.endFill();
    }
}

async function onCardKeyDown(event)
{
    if (event.ctrlKey)
    {
        this.state.multiselection = true;

        if (!this.preventkeystroke) {
            if (this.state.selectedfield.length > 0) {
                if (event.keyCode === 65) {
                    event.preventDefault();
                    selectAllFields.call(this);
                    event.stopPropagation();
                }
                // C char
                else if (event.keyCode === 67) {
                    copyField.call(this);
                }
                // X char
                else if (event.keyCode === 88) {
                    cutField.call(this);
                }
                // Z char
                else if (event.keyCode === 89) {
                    redoTemplate.call(this);
                }
                // Z char
                else if (event.keyCode === 90) {
                    undoTemplate.call(this);
                }
            }

            // V char, in case paste event is not supported
            if (event.keyCode === 86) {
                if (await pasteField.call(this, -1, -1, 'recto')) {
                    // Avoid paste for few milliseconds
                    this.preventkeystroke = true;
                    setTimeout(() => {
                        this.preventkeystroke = false;
                    }, 300);
                }
            }
        }
    }

    if (event.shiftKey) {
        this.setState({rotationmode: true});
    }
}

async function onCardPaste(event)
{
    if (!this.preventkeystroke) {
        // Avoid paste for few milliseconds
        this.preventkeystroke = true;
        setTimeout(() => {
            this.preventkeystroke = false;
        }, 300);

        if (!await pasteField.call(this, -1, -1, 'recto')) {
            const textdata = event.originalEvent.clipboardData ? event.originalEvent.clipboardData.getData('text/plain') :
                (window.clipboardData ? window.clipboardData.getData('Text') : false);
            if (textdata !== false) {
                let newfield = createField.call(this,
                    'label',
                    {x: 10, y: 10},
                    {value: textdata, autoSize: true, colorFill: -1},
                    {sideType: 'recto'}
                );

                selectField.call(this, newfield);
                saveCurrentSnapshot.call(this);
            }
        }
    }
}

function onCardKeyUp(event)
{
    if (this.state.multiselection) {
        this.setState({multiselection: false});
    }

    if (this.state.rotationmode) {
        this.setState({rotationmode: false});
    }

    if (!this.preventkeystroke)  {
        // Catch "BACKSPACE" and "DELETE" keypress.
        // Key code have to be hardcoded as number.
        // See here for keycode: https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
        if (event.keyCode === 8 || event.keyCode === 46) {
            deleteField.call(this);
        }
        if (this.state.selectedfield.length > 0) {
            // Left arrow
            if (event.keyCode === 37) {
                moveSelectedFields.call(this, this.state.selectedfield[0], -this.state.grid.step, 0);
                saveCurrentSnapshot.call(this);
            }
            // Up arrow
            else if (event.keyCode === 38) {
                moveSelectedFields.call(this, this.state.selectedfield[0], 0, -this.state.grid.step);
                saveCurrentSnapshot.call(this);
            }
            // Right arrow
            else if (event.keyCode === 39) {
                moveSelectedFields.call(this, this.state.selectedfield[0], this.state.grid.step, 0);
                saveCurrentSnapshot.call(this);
            }
            // Down arrow
            else if (event.keyCode === 40) {
                moveSelectedFields.call(this, this.state.selectedfield[0], 0, this.state.grid.step);
                saveCurrentSnapshot.call(this);
            }

            event.stopPropagation();
        }
    }

    if (!this.preventkeystrokemodal)
    {
        //Escape key, close modal
        if (event.keyCode === 27)
        {
            $(".modal.fade.show").find(".modal-footer").children(".btnclose").click();
        }
    }
}

function onDragStart(event, field, sideType)
{
    const factorytype = this.state.sides[sideType].factorytype;

    $(':focus').blur();
    if (factorytype === 'cursor')
    {
        if (this.state.clicks !== 1)
        {
            this.setState({
                clicks: 1,
                clicksTimer: setTimeout(() => {
                    this.setState({clicks: 0});
                }, 300)
            });

            if ($.inArray(field, this.state.selectedfield) === -1)  {
                if (!this.state.multiselection) {
                    if (this.state.selectedfield.length > 0) {
                        unselectField.call(this);
                    }
                }
                selectField.call(this, field, sideType)
            } else {
                if (this.state.multiselection) {
                    unselectField.call(this, field);
                }
            }

            if (field.selected !== undefined && field.selected !== null) {
                // store a reference to the global position
                // the reason for this is because of multitouch
                // we want to track the movement of this particular touch
                field.global = event.global;
                const position = field.toLocal(field.global);
                field.sx = (position.x * field.scale.x);
                field.sy = (position.y * field.scale.y);
                field.alpha = 0.5;
                field.dragging = true;
                field.cursor = 'move';
            }
        }
        else
        {
            this.setState({clicks: 0});
            editField.call(this);
        }
    }
    else
    {
        // We want to draw a new item (on top of an other one).
        onCardClickDown.call(this, event, sideType);
    }

    event.stopPropagation();
}

function onDragEnd(event, sideType)
{
    if (this.state.selectedfield.length > 0)
    {
        let savesnapshot = false;
        this.state.selectedfield.forEach((f) => {
            f.alpha = 1;

            f.dragging = false;
            // set the interaction global to null
            f.global = null;

            if (f.resizing || f.rotating)
            {
                f.resizing = false;
                f.rotating = false;
                const createOpt = {
                    sideType: sideType,
                    autoSizeImg: false
                };

                recreateSelectedField.call(this, createOpt);
                savesnapshot = true;
            }
            else if (f.moved)
            {
                savesnapshot = true;
            }
            f.moved = false;
        });

        if (savesnapshot) {
            saveCurrentSnapshot.call(this);
        }
    }

    cleanHighlights(this.state.sides[sideType]);
}

function onResizeStart(event, position, sideType)
{
    const selectedFieldRef = this.state.selectedfield[0];

    // store a reference to the global
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    selectedFieldRef.global = event.global;
    selectedFieldRef.alpha = 0.5;
    selectedFieldRef.resizingFrom = position;
    selectedFieldRef.resizing = true;
    if (selectedFieldRef.selected !== null)
    {
        selectedFieldRef.removeChild(selectedFieldRef.selected);
        selectedFieldRef.selected.destroy(true);
    }
    event.stopPropagation();
}

function onRotationStart(event, position, sideType)
{
    const selectedFieldRef = this.state.selectedfield[0];

    // store a reference to the global
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch

    selectedFieldRef.global = event.global;
    selectedFieldRef.alpha = 0.5;
    selectedFieldRef.rotatingFrom = position;
    selectedFieldRef.rotating = true;
    if (selectedFieldRef.selected !== null)
    {
        selectedFieldRef.removeChild(selectedFieldRef.selected);
        selectedFieldRef.selected.destroy(true);
    }
    event.stopPropagation();
}

function onDragMove(event, field, sideType)
{
    if (field.dragging || field.resizing || field.rotating)
    {
        if (field.global)
        {
            const newPosition = field.parent.toLocal(field.global);
            if (newPosition !== null)
            {
                if (field.dragging)
                {
                    // Move all selected fields
                    let mx = (newPosition.x - field.sx) - field.position.x;
                    let my = (newPosition.y - field.sy) - field.position.y;
                    const previousxy = {x: field.position.x, y: field.position.y};

                    // Quick fix for rotation (field.rotation -> Disable StepAlign)
                    moveSelectedFields.call(this, field, mx, my, true);
                    highlightFieldPositions.call(this, this.state.sides[sideType], field, previousxy);
                }
                else if (field.resizing)
                {
                    // Don't resize if multiselection
                    if (this.state.selectedfield.length === 1) {
                        if (field.options) {
                            if (field.resizingFrom === 'top') {
                                if ((newPosition.y) < (field.position.y + field.options.height)) {
                                    field.height = (field.height + (field.position.y - (newPosition.y)));
                                    field.options.height = (field.height + (field.position.y - (newPosition.y)));
                                    
                                    field.position.y = newPosition.y;
                                }
                            } else if (field.resizingFrom === 'bottom') {
                                if ((newPosition.y) > field.position.y) {
                                    field.height = (newPosition.y) - field.position.y;
                                    field.options.height = (newPosition.y) - field.options.y;
                                }
                            } else if (field.resizingFrom === 'left') {
                                if ((newPosition.x) < (field.position.x + field.options.width)) {
                                    field.width = field.width + (field.position.x - (newPosition.x));
                                    field.options.width = field.options.width + (field.position.x - (newPosition.x));
                                    field.position.x = (newPosition.x);
                                }
                            } else if (field.resizingFrom === 'right') {
                                if ((newPosition.x) > field.position.x) {
                                    field.width = (newPosition.x) - field.position.x;
                                    field.options.width = (newPosition.x) - field.options.x;
                                }
                            } else if (field.resizingFrom === 'rightBottom') {
                                if ((newPosition.x) > field.position.x && (newPosition.y) > field.position.y) {
                                    field.width = (newPosition.x) - field.position.x;
                                    field.options.width = (newPosition.x) - field.options.x;

                                    field.height = (newPosition.y) - field.position.y;
                                    field.options.height = (newPosition.y) - field.options.y;
                                }
                            } else if (field.resizingFrom === 'leftBottom') {
                                if ((newPosition.x) < (field.position.x + field.options.width) &&
                                (newPosition.y) > field.position.y) {
                                    field.width = field.width + (field.position.x - (newPosition.x));
                                    field.options.width = field.options.width + (field.position.x - (newPosition.x));
                                    field.position.x = (newPosition.x);

                                    field.height = (newPosition.y) - field.position.y;
                                    field.options.height = (newPosition.y) - field.options.y;
                                }
                            }
                            else if (field.resizingFrom === 'leftTop') {
                                if ((newPosition.x) < (field.position.x + field.options.width) &&
                                (newPosition.y) < (field.position.y + field.options.height)) {
                                    field.width = field.width + (field.position.x - (newPosition.x));
                                    field.options.width = field.options.width + (field.position.x - (newPosition.x));
                                    field.position.x = (newPosition.x);

                                    field.height = field.height + (field.position.y - (newPosition.y));
                                    field.options.height = field.options.height + (field.position.y - (newPosition.y));
                                    field.position.y = (newPosition.y);
                                }
                            }
                            else if (field.resizingFrom === 'rightTop') {
                                if ((newPosition.x) > field.position.x &&
                                    (newPosition.y) < (field.position.y + field.options.height)) {
                                    field.width = (newPosition.x) - field.position.x;
                                    field.options.width = (newPosition.x) - field.options.x;

                                    field.height = field.height + (field.position.y - (newPosition.y));
                                    field.options.height = field.options.height + (field.position.y - (newPosition.y));
                                    field.position.y = (newPosition.y);
                                }
                            }
                        }
                    }
                } else if (field.rotating)
                {
                    // Don't rotate if multiselection
                    if (this.state.selectedfield.length === 1) {
                        let x = 0;
                        let y = 0;
                        if (field.rotatingFrom === 'rightBottom') {
                            x = field.position.x + field.options.width;
                            y = field.position.y + field.options.height;
                        } else if (field.rotatingFrom === 'leftBottom') {
                            x = field.position.x;
                            y = field.position.y + field.options.height;
                        }
                        else if (field.rotatingFrom === 'leftTop') {
                            x = field.position.x;
                            y = field.position.y;
                        }
                        else if (field.rotatingFrom === 'rightTop') {
                            x = field.position.x + field.options.width;
                            y = field.position.y;
                        }

                        let angle = Math.atan2(newPosition.y - y, newPosition.x - x);
                        if (field.options.rotation !== undefined) {
                            angle += field.rotation;
                        }

                        field.rotation = angle;
                        field.options.rotation = angle;
                    }
                }

                if (field.options)
                {
                    field.options.x = Math.round(field.position.x);
                    field.options.y = Math.round(field.position.y);
                }
            }
        }
    }
}

export {
    onCardClickDown, onCardClickUp, onCardKeyDown, onCardKeyUp, onCardMouseMove, onCardPaste, onDragEnd, onDragMove, onDragStart, onResizeStart, onRotationStart
}
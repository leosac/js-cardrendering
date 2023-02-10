import $ from 'jquery';
import FormValidator from '../form';

import {
    toDPF, loadDPF
} from './xml';

function zIndexCompare(a, b)
{
    const ao = a.options || {};
    const bo = b.options || {};
    const az = ao.zIndex || 0;
    const bz = bo.zIndex || 0;
    if (az < bz)
        return -1;
    if (az > bz)
        return 1;
    return 0;
}

/**
 * Sort the template by zindex.
 *
 * This will sort the tpl.recto.card and tpl.recto.stage field.
 * And verso too.
 */
function sortByZIndex()
{
    this.getSides().forEach(sideType => {
        const side = this.state.sides[sideType];
        if (side.card)
            side.card.children.sort(zIndexCompare);

        if (side.stage)
            side.stage.children.sort(zIndexCompare);
    });
}

function validateForm()
{
    const f = (elem_id) =>
    {
        return $('#' + elem_id).value;
    };

    const validator = new FormValidator('cardDesigner', f);
    validator.clearAll();

    validator.validateNotEmpty('configuration_name');

    return !validator.hasError();
}

function reloadTemplate()
{
    const xmldoc = $.parseXML(toDPF.call(this));
    const xmlContent = $(xmldoc);
    loadDPF.call(this, xmlContent);
}

/**
 * Change the active factory for a given side.
 *
 * Most of time we retrieve the `tpl` object from Template.instance(),
 * but sometimes we need to call this function directly. In that case
 * we pass the tpl object explicitly.
 */
function changeFactory(factory, sideType)
{
    this.state.sides[sideType].factorytype = factory;
}

function animate()
{
    let sides = [];
    this.getSides().forEach(sideType => {
        sides.push(this.state.sides[sideType]);
    });
    animateSides(sides);
}

function animateSides(sides)
{
    sides.forEach(side => {
        side.renderer.render(side.stage);
    });
    requestAnimationFrame(() => animateSides(sides));
}

export {
    zIndexCompare, sortByZIndex, validateForm, reloadTemplate, changeFactory, animate
}
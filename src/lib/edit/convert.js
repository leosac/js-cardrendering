/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
function pixelToUnit(pixel)
{
    if (this.state.cardwidth_unit === this.state.cardwidth)
        return pixel;

    const ratio = this.state.cardwidth_unit / this.state.cardwidth;
    return Math.round(pixel * ratio * 10000) / 10000;
}

function unitToPixel(unit)
{
    if (this.state.cardwidth_unit === this.state.cardwidth)
        return unit;

    const ratio = this.state.cardwidth_unit / this.state.cardwidth;
    return Math.round(unit / ratio);
}

function decimalToHexColor(number)
{
    if (!Number.isFinite(number))
    {
        number = Number(number);
    }

    if (number === 0x00FFFFFF)
    {
        return '';
    }

    if (number < 0)
    {
        number = 0xFFFFFFFF + number + 1;
    }
    return parseInt('0x' + ('00000000' + number.toString(16).toUpperCase()).substr(-6, 6), 16);
}

function hexColorToSignedNumber(number, transparency)
{
    if (!Number.isFinite(number))
    {
        if (number.toString().startsWith('#')) {
            number = "0x" + number.substr(1);
            number = parseInt(number, 16);
        } else {
            number = parseInt(number, 10);
        }
        if (isNaN(number))
        {
            number = 0x000000;
        }
    }

    if (transparency)
    {
        if (number === -1)
        {
            number = 0x00ffffff;
        } else
        {
            number = parseInt('0xff' + ('000000' + number.toString(16).toUpperCase()).substr(-6, 6), 16);
            if ((number & 0x80000000))
            {
                number = -(~number & 0x7fffffff) - 1;
            }
        }
    }

    return number;
}

function hex2a(hexx)
{
    const hex = hexx.toString();
    let str = '';
    for (let i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

function a2hex(str)
{
    let arr = [];
    for (let i = 0, l = str.length; i < l; i++)
    {
        const hex = Number(str.charCodeAt(i)).toString(16);
        arr.push(hex.length > 1 ? hex : ("0" + hex));
    }
    return arr.join('');
}

function inchToPixel(value){
    return (value * 96);
};

function pixelToInch(value){
    return (value / 96);
}

export {
    pixelToUnit, unitToPixel, decimalToHexColor, hexColorToSignedNumber, hex2a, a2hex, inchToPixel, pixelToInch
}
/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
function decimalToHexColor(number) {
    if (!Number.isFinite(number)) {
        number = Number(number);
    }

    if (number === 0x00FFFFFF) {
        return '';
    }

    if (number < 0) {
        number = 0xFFFFFFFF + number + 1;
    }
    return '#' + ('00000000' + number.toString(16).toUpperCase()).substr(-6, 6);
}

function hexColorToSignedNumber(number, transparency) {
    if (!Number.isFinite(number)) {
        if (number.toString().startsWith('#')) {
            number = "0x" + number.substr(1);
            number = parseInt(number, 16);
        } else {
            number = parseInt(number, 10);
        }
        if (isNaN(number)) {
            number = 0x000000;
        }
    }

    // For XML format compatibility, will be removed on a further version
    if (transparency) {
        if (number === -1) {
            number = 0x00ffffff;
        } else {
            number = parseInt('0xff' + ('000000' + number.toString(16).toUpperCase()).substr(-6, 6), 16);
            if ((number & 0x80000000)) {
                number = -(~number & 0x7fffffff) - 1;
            }
        }
    } else {
        number &= 0xffffff;
    }

    return number;
}

function hex2a(hexx) {
    const hex = hexx.toString();
    let str = '';
    for (let i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

function a2hex(str) {
    let arr = [];
    for (let i = 0, l = str.length; i < l; i++) {
        const hex = Number(str.charCodeAt(i)).toString(16);
        arr.push(hex.length > 1 ? hex : ("0" + hex));
    }
    return arr.join('');
}

function inchToPixel(value) {
    // This 96 ppi could be wrong depending the context
    // The ratio 1.373 is arbitrary to have proper sizing at screen
    // Changing any of this value will impact the fields x/y/width/height and general rendering result
    return Math.round(value * 96 * 1.373);
}

function pixelToInch(value) {
    return (value / 96 * 1.373);
}

function inchToMillimeter(value) {
    return (value * 25.4);
}

function millimeterToInch(value) {
    return (value / 25.4);
}

export {
    decimalToHexColor, hexColorToSignedNumber, hex2a, a2hex, inchToPixel, pixelToInch, inchToMillimeter, millimeterToInch
}
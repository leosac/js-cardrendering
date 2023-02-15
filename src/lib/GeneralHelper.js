/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
const GeneralHelper = {};

function getRandomHex()
{
    const possible = "ABCDEF0123456789";
    return possible.charAt(Math.floor(Math.random() * possible.length));
}

/**
 * Return len "random" hex bytes as a string.
 * @param len
 */
GeneralHelper.getRandomHex = function (len)
{
    let s = '';
    for (let i = 0; i < len; ++i)
        s += getRandomHex();
    return s;
};

GeneralHelper.isHex = function (obj)
{
    return /^[0-9A-F]+$/i.test(obj) === true;
};

GeneralHelper.getLayouts = function(enabledCardSizes) {
    let layouts = [];
    if (enabledCardSizes.cr80)
        layouts.push({value: 'cr80', text: 'create.cr80'});
    if (enabledCardSizes.res_3to2)
        layouts.push({value: 'res_4to3', textv: '4:3'});
    if (enabledCardSizes.res_3to2)
        layouts.push({value: 'res_3to2', textv: '3:2'});
    if (enabledCardSizes.res_8to5)
        layouts.push({value: 'res_8to5', textv: '8:5'});
    if (enabledCardSizes.res_5to3)
        layouts.push({value: 'res_5to3', textv: '5:3'});
    if (enabledCardSizes.res_16to9)
        layouts.push({value: 'res_16to9', textv: '16:9'});
    if (enabledCardSizes.custom)
        layouts.push({value: 'custom', text: 'create.customSize'});
    return layouts;
}

GeneralHelper.getFontFamilies = function() {
    return ['Agency FB', 'Algerian', 'Arial', 'Arial Rounded MT', 'Arimo', 'Axure Handwriting', 'Baskerville Old Face', 'Bauhaus 93', 'Bell MT', 'Berlin Sans FB', 'Bernard MT', 'Blackadder ITC', 'Bodoni MT', 'Bodoni MT Poster', 'Book Antiqua', 'Bookman Old Style', 'Bookshelf Symbol 7', 'Bradley Hand ITC', 'Britannic', 'Broadway', 'Brush Script MT', 'Buxton Sketch', 'Calibri', 'Californian FB', 'Calisto MT', 'Cambria', 'Cambria Math', 'Candara', 'Castellar', 'Centaur', 'Century', 'Century Gothic', 'Century Schoolbook', 'Chiller', 'Colonna MT', 'Comic Sans MS', 'Consolas', 'Constantia', 'Cooper', 'Copperplate Gothic', 'Corbel', 'Courier New', 'Curlz MT', 'DejaVu Sans', 'DejaVu Sans Mono', 'DejaVu Serif', 'Edwardian Script ITC', 'Elephant', 'Engravers MT', 'Eras ITC', 'Felix Titling', 'Footlight MT', 'Forte', 'Franklin Gothic', 'Franklin Gothic Book', 'Freestyle Script', 'French Script MT', 'Gabriola', 'Garamond', 'Gentium Basic', 'Gentium Book Basic', 'Georgia', 'Gigi', 'Gill Sans', 'Gill Sans MT', 'Gloucester MT', 'Goudy Old Style', 'Goudy Stout', 'Haettenschweiler', 'Harlow Solid', 'Harrington', 'High Tower Text', 'Impact', 'Imprint MT Shadow', 'Informal Roman', 'Jokerman', 'Juice ITC', 'Kristen ITC', 'Kunstler Script', 'Latin', 'Lucida Bright', 'Lucida Calligraphy', 'Lucida Console', 'Lucida Fax', 'Lucida Handwriting', 'Lucida Sans', 'Lucida Sans Typewriter', 'Lucida Sans Unicode', 'Magneto', 'Maiandra GD', 'Matura MT Script Capitals', 'Microsoft MHei', 'Microsoft NeoGothic', 'Microsoft Sans Serif', 'Mistral', 'Modern No. 20', 'Monotype Corsiva', 'MS Outlook', 'MS Reference Sans Serif', 'MS Reference Specialty', 'MT Extra', 'Niagara Engraved', 'Niagara Solid', 'OCR A', 'Old English Text MT', 'Onyx', 'OpenSymbol', 'Palace Script MT', 'Palatino Linotype', 'Papyrus', 'Parchment', 'Perpetua', 'Perpetua Titling MT', 'Playbill', 'Poor Richard', 'Pristina', 'Rage', 'Ravie', 'Rockwell', 'Script MT', 'Segoe Marker', 'Segoe MDL2 Assets', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Segoe WP', 'Showcard Gothic', 'Sitka Banner', 'Sitka Display', 'Sitka Heading', 'Sitka Small', 'Sitka Subheading', 'Sitka Text', 'SketchFlow Print', 'Snap ITC', 'STENCIL', 'Symbol', 'Tahoma', 'Tempus Sans ITC', 'Times New Roman', 'Trebuchet MS', 'Tw Cen MT', 'Verdana', 'Viner Hand ITC', 'Vivaldi', 'Vladimir Script', 'Webdings', 'Wingdings', 'Wingdings 2', 'Wingdings 3'];
}

GeneralHelper.getDataMatrixSizeIdx = function(t) {
    return [
        { value: -2, label: t('properties.prop_datamatrix_autoSquare')},
        { value: -3, label: t('properties.prop_datamatrix_autoRectangle')},
        { value: 0, label: '10x10'},
        { value: 1, label: '12x12'},
        { value: 2, label: '14x14'},
        { value: 3, label: '16x16'},
        { value: 4, label: '18x18'},
        { value: 5, label: '20x20'},
        { value: 6, label: '22x22'},
        { value: 7, label: '24x24'},
        { value: 8, label: '26x26'},
        { value: 9, label: '32x32'},
        { value: 10, label: '36x36'},
        { value: 11, label: '40x40'},
        { value: 12, label: '44x44'},
        { value: 13, label: '48x48'},
        { value: 14, label: '52x52'},
        { value: 15, label: '64x64'},
        { value: 16, label: '72x72'},
        { value: 17, label: '80x80'},
        { value: 18, label: '88x88'},
        { value: 19, label: '96x96'},
        { value: 20, label: '104x104'},
        { value: 21, label: '120x120'},
        { value: 22, label: '132x132'},
        { value: 23, label: '144x144'},
        { value: 24, label: '8x18'},
        { value: 25, label: '8x32'},    
        { value: 26, label: '12x26'},
        { value: 27, label: '12x36'},
        { value: 28, label: '16x36'},
        { value: 29, label: '16x48'}
    ];
}

GeneralHelper.getColorInt = function(hexColor) {
    if (hexColor === 'transparent') {
        return -1;
    } else if (hexColor !== '') {
        return parseInt('0x' + hexColor.substring(1), 16);
    }
    return hexColor;
}

export default GeneralHelper;

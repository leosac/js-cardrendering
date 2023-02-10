import $ from 'jquery';
import {
    toDPF, loadDPF
} from './xml';

import {
    createField, unselectField
} from './fields';

import {
    cleanGrid
} from './grid';

import {
    reloadTemplate
} from './common';

function printTemplate()
{
    unselectField.call(this);
    if (this.state.grid.enabled)
    {
        this.getSides().forEach(sideType => {
            const side = this.state.sides[sideType];
            cleanGrid(side);
        });
    }

    // Be sure we hide visual helpers
    const grid = this.state.grid;
    grid.enabled = false;
    grid.ruler = false;
    this.setState({
        cardborder: 0,
        grid: grid
    });
    reloadTemplate.call(this);

    // If we're in recto/verso mode, we need twice the height.
    let height = 0;
    this.getSides().forEach(sideType => {
        const side = this.state.sides[sideType];
        height += side.renderer.view.height;
    });

    const mywindow = window.open('', 'Card', 'height=' + height + ',width=' + this.state.sides['recto'].renderer.view.width);
    mywindow.document.write('<html><head><title>Card</title>');
    mywindow.document.write('<style>@page { size: 85.725mm 53.975mm; margin: 0; } body { overflow-x: visible; overflow-y: visible; }</style>');
    mywindow.document.write('</head><body >');

    this.getSides().forEach(sideType => {
        const side = this.state.sides[sideType];
        side.renderer.render(side.stage);
        mywindow.document.write('<img src="' + side.renderer.view.toDataURL("image/png") + '" style="width: 100%; height: 100%" />');
    });

    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10
    mywindow.print();

    /*
    *   This part is used to close print window, because of Chrome choices we need to check
    *   manually each navigator. Yes, because lot of navigator include "Chrome" inside their userAgent.
    *   So, if navigator is Chrome, we add aventlistener, else, we just call close.
    *   If you find a better solution, fell free to change this !
    */
    let userAgent = mywindow.navigator.userAgent;
    if (userAgent.indexOf("Chrome") !== -1 && userAgent.indexOf("Edge") === -1 &&
        userAgent.indexOf("OPR") === -1 && userAgent.indexOf("Opera") === -1 &&
        userAgent.indexOf("SamsungBrowser") === -1)
            mywindow.addEventListener("afterprint", function(e) {mywindow.close();});
    else
        mywindow.close();
}

function printCard()
{
    // Generate form inputs
    document.getElementById('print_card_form').innerHTML = '';

    this.getSides().forEach(sideType => {
        const side = this.state.sides[sideType];
        const cardRef = side.card;
        for (let f = 0; f < cardRef.children.length; ++f)
        {
            const child = cardRef.getChildAt(f);
            if (child.options !== undefined && child.options.name !== undefined && child.options.name !== '' && child.options.type !== undefined)
            {
                let $input;
                if (child.options.type === 'label' || child.options.type === 'barcode' || child.options.type === 'qrcode')
                {
                    $input = $('<div class="form-group">').html('<label for="pcard_' + child.options.name + '">' + child.options.name + '</label><input type="text" class="form-control" id="pcard_' + child.options.name + '" placeholder="' + child.options.value + '">');
                    $('#print_card_form').append($input);
                } else if (child.options.type === 'picture')
                {
                    const pcard = 'pcard_' + child.options.name;
                    $input = $('<div class="form-group">').html('<label for="' + pcard + '">' + child.options.name + '</label><input type="text" class="form-control" id="' + pcard + '" value="' + child.options.value + '" style="display: none;"><div id="img-' + pcard + '"></div>');
                    $('#print_card_form').append($input);
                    $('#' + pcard).change(function ()
                    {
                        $('#img-' + pcard).imageEditor({
                            'source': $('#' + pcard).val(),
                            'maxHeight': 300,
                            'applyCallBack': function (e)
                            {
                                $('#' + pcard).val(e);
                            },
                            'croppedCallBack': function (e)
                            {
                                $('#' + pcard).val(e);
                                $('#' + pcard).change();
                            }
                        });
                    });
                    $('#pcard_' + child.options.name).change();
                }
            }
        }
    });
    this.setState({
        show_printcard: true
    })
}

function printCardConfirm()
{
    // Duplicate template
    const xmldoc = $.parseXML(toDPF());
    const $xml = $(xmldoc);

    // Update values from form. For each side if need be.
    this.getSides().forEach(sideType => {
        const side = this.state.sides[sideType];
        const cardRef = side.card;
        let fields = [];
        for (let f = 0; f < cardRef.children.length; ++f)
        {
            const child = cardRef.getChildAt(f);
            if (child.options !== undefined && child.options.name !== undefined && child.options.name !== '' && child.options.type !== undefined)
            {
                if (child.options.type === 'label' || child.options.type === 'barcode' || child.options.type === 'qrcode' || child.options.type === 'picture')
                {
                    child.options.value = $('#pcard_' + child.options.name).val();
                    fields.push(child);
                }
            }
        }
        for (let f = 0; f < fields.length; ++f)
        {
            cardRef.removeChild(fields[f]);
            createField(
                fields[f].options.type,
                {x: fields[f].options.x, y: fields[f].options.y},
                fields[f].options,
                {sideType: fields[f].sideType}
            );
        }
    });
    printTemplate();

    // Restore template
    loadDPF($xml);
}

export {
    printCardConfirm, printCard, printTemplate
}
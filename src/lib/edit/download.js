import {
    toDPF
} from './xml';

import {
    getRectoCanvas
} from './card';

function downloadDPF()
{
    const xml = toDPF.call(this);
    let tplname = this.state.name;
    if (tplname === '')
    {
        tplname = 'Template';
    }
    const element = document.createElement('a');
    const blob = new Blob([xml], {
        type: 'text/xml'
    });
    element.href = URL.createObjectURL(blob);
    element.setAttribute('download', tplname.toLowerCase() + '.dpf');
    document.body.appendChild(element);
    element.click();
}

function downloadImage()
{
    const resizedCanvas = getRectoCanvas.call(this);
    let imgdata = resizedCanvas.toDataURL('image/png');
    let tplname = this.state.name;
    if (tplname === '')
    {
        tplname = 'Template';
    }
    const element = document.createElement('a');
    element.href = imgdata;
    element.setAttribute('download', tplname.toLowerCase() + '.png');
    document.body.appendChild(element);
    element.click();
}

export {
    downloadDPF, downloadImage
}
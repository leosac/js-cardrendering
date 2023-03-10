# JS-CardRendering [![Build Status](https://github.com/leosac/js-cardrendering/actions/workflows/node.js.yml/badge.svg?branch=master)](https://github.com/leosac/js-cardrendering/actions/workflows/node.js.yml)
JS-CardRendering is a javascript library used to render card printing templates.
For node.js and web browsers.

![CardRendering Sample](https://github.com/leosac/js-cardrendering/blob/master/example/sample-cardrendering-red.png?raw=true)

Related projects using *js-cardrendering*:
 * [js-cardeditor](https://github.com/leosac/js-cardeditor): a web editor for card printing template
 * [card-printing-worker](https://github.com/leosac/card-printing-worker): a node server providing REST API for bitmap generation/printing
 * [leosac-credential-provisioning](https://leosac.com/credential-provisioning/): a complete professional card provisioning solution for both card encoding and printing

## Usage
```js
const tpl = {
  background: {
    color: '#ff0000'
  },
  fields: [
    {
      type: 'label',
      autoSize: true,
      color: '#000000',
      value: 'My first card',
      width: 46,
      height: 18,
      x: 80,
      y: 50
    },
    {
      type: 'qrcode',
      value: 'https://www.leosac.com',
      width: 132,
      height: 132,
      x: 250,
      y: 100,
    }
  ]
};
```

### Node
`npm install @leosac/cardrendering --save`

PIXI.js is required. It is a peer dependency because of the differents versions available depending of your targeted environment.
Use `npm install pixi.js --save` or `npm install @pixi/node --save`.

```js
import { createCanvas } from "canvas";
import { CardRenderer } from "@leosac/cardrendering";

const renderer = new CardRenderer({
  canvas: createCanvas(445, 280),
  grid: {
    ruler: true
  }
});
renderer.createCardStage({size: 'cr80', orientation: 'landscape'}, tpl);
renderer.animate();
```

### Web Browser
```html
<script type="text/javascript" src="cardrendering.js" />
<canvas id="card"></canvas>
```

```js
const renderer = new cardrendering.CardRenderer({
  canvas: document.getElementById('card'),
  grid: {
    ruler: true
  }
});
renderer.createCardStage({size: 'cr80', orientation: 'landscape'}, tpl);
renderer.animate();
```

## From source
```bash
git clone https://github.com/leosac/js-cardrendering.git
cd "js-cardrendering"
npm install
```

### Build for redistribution
```bash
npm run build
```

### Run tests
```bash
npm run test
```

## Parameters

### CardRenderer constructor

#### canvas
The canvas where to render the template.
#### grid
Grid/View settings
```js
{
  ruler: false
}
```
#### interaction
Set to `true` to enable onCard* events.
#### onCardClickDown
Event triggered on card click down.
#### onCardClickUp
Event triggered on card click up.
#### onCardMouseMove
Event triggered on card mouse move.
#### onFieldDragStart
Event triggered on a field drag start.
#### onFieldDragEnd
Event triggered on a field drag end.
#### onFieldDragMove
Event triggered on a field drag move.
#### onSelectedSpriteCreated
Event triggered on selected sprite creation.
#### onFieldAdded
Event triggered on new field addition.
#### onSelectionChanged
Event triggered on field selection change.
#### onChange
Event triggered on template content change.
#### onError
Event triggered on error.

### createCardStage method

#### layout.size
The card layout size.
  - `cr80` : Standard CR-80 card size
  - `cr79` : CR-79 card size
  - `cr100` : CR-100 ID card size
  - `res_4to3` : 4/3 visual
  - `res_3to2` : 3/2 visual
  - `res_8to5` : 8/5 visual
  - `res_5to3` : 5/3 visual
  - `res_16to9` : 16/9 visual
  - `custom` : Use custom size
#### layout.orientation
The layout orientation.
 - `landscape`
 - `portrait`
#### tpl
The template to render.
#### resize
Resize based on the parent container. If the layout size exceed the container size, then rulers are forced as disabled and the view scaled.

# License
This project has been created by Leosac SAS.
The source code of this library is released under LGPLv3 license.
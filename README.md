# JsCardRendering

JS-CardRendering is a React component used to make card printing templates.
It works with node.js and web browsers (one packaged with webpack).

## Pre-Required

You need React >= 18

## Installation

`npm install @leosac/js-cardrendering --save`

## Usage

```js
import { CardDesigner } from "@leosac/js-cardrendering";

/* Import bootstrap css if missing */
import "bootstrap/dist/css/bootstrap.min.css";
/* Import barcode fonts if missing */
import "./css/barcode-fonts.css";

const App = () => (
  <CardDesigner enableDownload="true" enablePrint="true" />
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
```

If you correctly made the previous steps, the package is now installed in your project.

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

### Start in development mode
```bash
npm start
```

### Run tests
```bash
npm run test
```

## Parameters

Several properties can be optionally passed to the component.

There is two parameters :

    - cb_AtEdit [`Function`] (`Param 1: Card Template, Param 2: Snapshot`: Function called at each field edition (created, removed, resized, moved...)
    - content [`Object`]: Card Template (more informations inside "Load Card Template" section)
    - draggableFields [`Array`] (`{name : String, default_value: String}`): List of draggable fields
    - formatVersion [`String`] (`Default: Undefined`): Force a specific format version for the output (default to latest version)
    - enabledCardSizes [`Object` : Select cards templates you want to authorize. (more informations inside "Card Templates" section)
    - enableDownload [`Boolean`] (`Default: false`): Enable/Disable Download features
    - enableName [`Boolean`] (`Default:true`): Enable/Disable Name input
    - enablePrint [`Boolean`] (`Default:false`): Enable/Disable Printing features
    - enableSubmitBtn [`Boolean`] (`Default:true`): Enable/Disable Submit button
    - enableUnprintable [`Boolean`] (`Default:false`): Active unprintable objects, like fingerprint
    - maxNameLength [`Number`]: Set name max length

#### NOTE : If "datas.content" is undefined, it create a new card template.

## Enable Card Sizes

Parameter `enabledCardSizes` enable/disable templates size.
To do it , you need to create a `Object` like this :

```js
enabledCardSizes: {
  cr80: true,
  res_4to3: false,
  res_3to2 : false,
  res_16to9 : true,
  custom: false
}
```

This is the current list of supported sizes :

  - `cr80` : Standard card size
  - `res_4to3` : 4/3 visual
  - `res_3to2` : 3/2 visual
  - `res_8to5` : 8/5 visual
  - `res_5to3` : 5/3 visual
  - `res_16to9` : 16/9 visual
  - `custom` : Allow custom size

## Load Card Templates

The function can take a card template in parameter `content`, useful if you want to edit a card directly after loading.

It is recommended to use JSON format.

XML import and export is supported as well for compatibility reasons (.dpf files).

## Jquery

Jquery is being used for some specific aspects of this component. This is not a best practice as it may conflict with React DOM management. Ideally, it will be further removed on a later version.

# License

This project has been created by Leosac SAS.
The source of this library is released under LGPLv3 license.
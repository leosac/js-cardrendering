# JsCardRendering

JS-CardRendering is a client-side Meteor package used to make card printing templates.

## Pre-Required

You need Meteor 1.8.1.

## Installation

`Git clone` the project in the `/packages` of your Meteor project.

Open a terminal inside your project directory and enter this command :

```bash
meteor add leosac:jscardrendering
```

After it, you need to install NPM dependency's

```bash
cd "/packages/jscardrendering"
npm install
```

If you correctly make the previous steps, the package is now installed in your project.

## Update

We don't use Meteor package manager (Atmosphere), to make a update, just make a `Git pull` inside the project folder.

```bash
cd "/packages/jscardrendering"
git pull
```

## How to use

This package create Blaze Templates and Helpers, so package can be initialized long time before inside your code.

In way to use jscardrendering, you just need to do a `import` and execute it...

```js
  import jscardrendering from 'meteor/leosac:jscardrendering';

  jscardrendering.init();
```

... and insert a template call somewhere.

```html
<div id="cardTemplateCreator">
  {{>jscardrendering requiredID="cardTemplateCreator" datas=myDatas }}
</div>
```

<b>Important Note : You can't create multiple instances in the same page.</b>

### Potential conflicts

JsCardRendering use `_jcr_` Blaze Helper for translation, please keep this helper unused.

## Parameters

As you can see, js initalization don't take any parameter, but template does.

There is two parameters :

    - [`required`] requiredID [`String`] : ID you want to attribute to the editor 
    - [`required`] datas [`Object`] : Object with all required datas and options
    - [`required`] lang (fr/en) [`String`] : Selected language, if value is not supported it fallback to english
    - cb_AtEdit [`Function`] (`Param 1 : Card Template, Param 2 : Snapshot`) : Function called at each field edition (created, removed, resized, moved...)
    - content [`Object`] : Card Template (more informations inside "Load Card Template" section)
    - draggableFields [`Array`] (`{name : String, default_value: String}`): List of draggable fields
    - formatVersion [`String`] (`Default:Undefined`) : Force a specific format version for the output (default to latest version)
    - enabledCardSizes [`Object`] : Select cards templates you want to authorize. (more informations inside "Card Templates" section)
    - enableDownload [`Boolean`] (`Default:false`) : Enable/Disable Download features
    - enableName [`Boolean`] (`Default:true`) : Enable/Disable Name input
    - enablePrint [`Boolean`] (`Default:false`) : Enable/Disable Printing features
    - enableSubmitBtn [`Boolean`] (`Default:true`) : Enable/Disable Submit button
    - enableUnprintable [`Boolean`] (`Default:false`) : Active unprintable objects like fingerprint
    - maxNameLength [`Number`] : Set name max length

#### NOTE 1 : If "datas.template" is undefined, it create a new card template.

#### NOTE 2 : A wrong requiredID or missing parameter don't crash the script, but return a string containing error description, and show them inside browser console.

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

File extension is ".dpf", it can be downloaded in the module or exported from another paplication

Note : ".dpf" files are XML formated, if you modify them manually you can make them invalid and unreadable.

## Init() Return value

The function return nothing in case of success, and a string explaining the error in case of failure.

## Errors

If an error occured and have been catched (or prevented), a message appear at top of module explaining the problem.

## Get template



# Examples

### Create card

##### HTML File

```html
<div id="cardTemplateCreator">
  
</div>
```

##### "myDatas" Object :

```json
{
  "lang": "en"
}
```

##### Js File :

```js
//Import the package
import jscardrendering from 'meteor/leosac:jscardrendering';

//Loading the package
jscardrendering.init();

```

### Edit card

##### HTML File

```html
<div id="cardTemplateCreator">
  {{>jscardrendering datas=myDatas requiredID="template-editor-form"}}
</div>
```

##### "myDatas" Object :

```json
{
  "lang": "en"
  ,"template": "YourCardTemplate"
}
```

##### Js File :

```js
//Import the package
import jscardrendering from 'meteor/leosac:jscardrendering';

//Loading the package
jscardrendering.init();

```

# Use internal functions

You can use functions presents in `"src/js/edit/common"` and `"src/js/edit/converts"` from the package in order to add functionality like save. Is order to use theses functions, you can do something like :

```js
  //Import the package
  import jscardrendering from 'meteor/leosac:jscardrendering';

  //Access functions from "/src/js/edit/common"
  let common = jscardrendering.common();

  //Call the function
  common.zIndexCompare();
```

# Dev notes

## Dependency
The package is currently dependent of Meteor on two ciritical points :

  - Template system (meteor/templating)
  - Blaze

Also, jscardrendering require number of NPM modules, and some external modules located inside `"src/js/ext"` folder.

## How to get url of exported files

Because of Meteor Packages export files system, who is totally different from Meteor application export system, and because it's used for importing modules inside browser, this point is very important, and very useful for the next point "How to add another module".

Url is composed of two parts :
  - The first one is always `"/packages/leosac_jscardrendering/"`.

  - The second is based on path inside jscardrendering package folder.

### Example 1 - Npm Module

  - The first one is `"/packages/leosac_jscardrendering/"`.

  - Second part is `"/node_modules/YourModule/module.js"`.

  - The url is : `"/packages/leosac_jscardrendering/node_modules/YourModule/module.js"`

### Example 2 - Non Npm Module

  - The first one is `"/packages/leosac_jscardrendering/"`.

  - Second part is `"/src/js/ext/YourModule.js"`.

  - The url is : `"/packages/leosac_jscardrendering/src/js/ext/YourModule.js"`

## Test module

You can launch tests with 

```bash
npm test
```

## How to add module

<i>Please read this after well understand the previous point : "How to get url of exported files" </i>

To make the package working with Meteor Package system, you need to make some steps :

  - Install your module
    - Using NPM, juste make a classic NPM Install inside package folder
    - Using non NPM module, drop your file inside `/src/js/ext` folder
  - Make your module static
    - Inside `package.js` insert path to your module, for example :
      ```js
        //Inject npm scripts
        api.addAssets([
          './node_modules/YourModule/module.js',
        ], ['client']);
      ```
  - Insert inside webpage and Prevent double import
    - Inside `requiredModules.js` insert in the object  :
    ```js
        ,yourModule: {
          jsUrl: "/url/to/the/exported/module.js"
          ,cssUrl: '/url/to/the/exported/module.css'
          ,windowTest:["Exported Variable Inside window variable"]
          ,fnTest: function(){return (TestPresenceWithThisCommand)}
        }
    ```
    - Note : "jsUrl" contain module url, if undefined, the Module is omited
    - | "cssUrl" contain module css url, if undefined, we don't add related css
    - | WindowTest check presence of variable created inside "window" variable. Each [] contain object and can be read like : window["parent"]["children"]
    - | fnTest is a function who can be used to test presence of commands, like "$.contextMenu"
    
  In case of modules who export nothing inside "window" like some middlewares, check for related module or juste don't insert "windowTest" and "fnTest" to force import of module.

  <i>More informations and details related to this loading system can be found at top of "requiredModules.js".</i>
  

## Jquery

Jquery is inclued with Meteor and exported client side, but you can't use `import` command inside package to use any Jquery related module. That's why you need to use the homemade import system presented inside "How to add module".

## Update

- Please change `version` at top of `package.js`
- Also, add a note inside `Changelog.md`

## Add tests

- Tests uses Mocha (not Meteor Mocha) : https://mochajs.org/
- ES6 is supported with module "esm" : https://www.npmjs.com/package/esm
- Tests folder is `/test`.
- Launch tests with
  ```bash
    npm test
  ```

# License

All rights reserved
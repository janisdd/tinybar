# TinyBar

A tiny progressbar like on YouTube, Github, ...

![TinyBar Screenshot](https://raw.githubusercontent.com/janisdd/tinybar/master/screenshots/01.png)

## Include

Include `tinybar.js` in your html file

```html
<script src="path/to/tinybar.js"></script>

```

with typescript (the .d.ts file is used)
```ts
import {TinyBarExport} from "path/to/tinyBar";

declare var TinyBar: TinyBarExport
```

or **require** in js via

```js
var TinyBar = require('/path/to/tinybar')
```
with typescript (the .d.ts file is required)

```ts
import TinyBar = require('path/to/tinybar)
```

### Create bar

Variables with `[]` are optional.

```js
var tinyBar = new TinyBar.TinyBar([settings], [parent], [callback])
```
* `settings: Settings ` the settings for the bar
* `parent: string | HTMLElement` html id where the bar should be inserted (via append) OR the html parent object
* `callback: () => void` called when the dom elements were created and the bar is ready to be used

**`settings` and `parentId` can be exchanged (the order shouldn't matter ...)**
**to use the callback you need to provide settings and parent (can be both null)**

so you could also do this

```js
var tinyBar = new TinyBar.TinyBar([parentId], [settings], [callback])
```

## Settings 

The transition properties **cannot** be set through the css property because you are able to change the html structure of the bar and we need to change the transition (backwards is faster) on the fly. 

* `css: any` an object with key-value pairs (key css style name [htmlObj.style.key], value style value) to style the bar
default:
```js
{
    backgroundColor: '#29d',
    boxShadow: '0 0 10px rgba(119,182,255,0.7)',
    position: 'absolute',
    left: '0',
    right: '100%', 
    top: '0',
    bottom: '0'
}
```
* `cssWrapper: any` an object with key-value pairs (key css style name [htmlObj.style.key], value style value) to style the bar wrapper
default:
```js
{
     height: '2px',
        position: 'relative',
        backgroundColor: 'transparent',
        zIndex: '1050'
}
```
* `wrapperCssClasses: string[]` the css classes to add the the bar wrapper  
default: `[]`
* `cssClasses: string[]` the css classes to add to the bar  
default: `[]`
* `incrementTimeoutInMs: number` the delay in ms, every tick the .inc method is called  
default: `300`
* `changeValueTransition: string` the transition for the bar when the value changes (must not be empty! and **cannot** be set through the css property)  
default: `'all 0.3s ease'`
* `changeValueBackTransition: string`  the transition for the bar when animating from bigger to smaller value (backwards) (must not be empty! and **cannot** be set through the css property)  
default: `'all 0.2s ease'`
* `changeVisibilityTransition: string` the transition for the bar wrapper when the visibility (must not be empty! and **cannot** be set through the css property)    
 default: `'all 0.05s linear'`
* `changeValueProperty: string` the property name of the value property (property that changes when the value should change)  
 default: `null`
* `changeVisibilityProperty: string` the property name of the visibility property (property that changes when the visibility should change)  
 default: `null`
* `changeVisibilityElement: BarElement`  the element that will used to change the visibility  
 default: `BarElement.bar`
* `changeValueElement: BarElement` the element that will used to change the value  
 default: `BarElement.barWrapper`
* `applyInitialBarWrapperStyle: (barWrapperDiv:HTMLDivElement, shouldPositionTopMost:boolean) => void` function that applies the initial style to the bar wrapper (the initial styles)  
default:  

```js
{
    if (this.cssWrapper)
        for (let key in this.cssWrapper) {
            if (this.cssWrapper.hasOwnProperty(key) && barWrapperDiv.style[key] !== undefined) {
                barWrapperDiv.style[key] = this.cssWrapper[key]
            }
        }

    if (barWrapperDiv.style.transition) {
        console.error('tinybar: the changeVisibilityTransition property must be set (not though css property) ')
    }

    barWrapperDiv.style.transition = this.changeVisibilityTransition


    //override style...
    if (shouldPositionTopMost) {
        barWrapperDiv.style.position = 'fixed'
        barWrapperDiv.style.left = '0'
        barWrapperDiv.style.right = '0'
        barWrapperDiv.style.top = '0'
    }

    this.extendInitialBarWrapperStyle(barWrapperDiv, shouldPositionTopMost)
}
```

* `extendInitialBarWrapperStyle: (barWrapperDiv:HTMLDivElement, shouldPositionTopMost:boolean) => void` a function that is called after applyInitialBarWrapperStyle to do some minor changes on the bar wrapper style  
 default:
```js
{}
```
 
* `applyInitialBarStyle: (barDiv:HTMLDivElement, shouldPositionTopMost:boolean) => void` function that applies the initial style to the bar (the initial styles)  
 default:
```js
{
    if (this.css)
        for (let key in this.css) {
            if (this.css.hasOwnProperty(key) && barDiv.style[key] !== undefined) {
                barDiv.style[key] = this.css[key]
            }
        }

    if (barDiv.style.transition) {
        console.error('tinybar: the changeValueTransition (& the changeValueBackTransition) property must be set (not though css property) ')
    }

    barDiv.style.transition = this.changeValueTransition

    //let the user modify the style
    this.extendInitialBarStyle(barDiv, shouldPositionTopMost)
}
```
 
* `extendInitialBarStyle: (barDiv:HTMLDivElement, shouldPositionTopMost:boolean) => void`  a function that is called after applyInitialBarStyle to do some minor changes on the bar style  
 default:
```js
{}
```
 
* `changeBarVisibility: (barWrapperDiv:HTMLDivElement, barDiv:HTMLDivElement, newVisibility:boolean) => void` function that changes the visibility of the bar
 default:
```js
{
    if (newVisibility) {
        barWrapperDiv.style.opacity = '1';
    } else {
        barWrapperDiv.style.opacity = '0';
    }
}
```
 
* `changeValueFunc: (barWrapperDiv:HTMLDivElement, barDiv:HTMLDivElement, value:number) => void` function to change to value of the bar
 default: 
```js
{
    barDiv.style.right = (100 - value) + '%'
}
```

## Enum BarElement

* `BarElement.barWrapper` represents the bar wrapper
* `BarElement.bar` represents the bar

access:
```js
var _ = TinyBar.BarElement.bar
```

## Enum ProgressbarStatus

* `ProgressbarStatus.initial` only when the bar is created
* `ProgressbarStatus.started` the bar is "running"
* `ProgressbarStatus.finished` the bar has finished

access:
```js
var _ = TinyBar.ProgressbarStatus.bar
```

## Example Settings

Making the bar red
```js
var TinyBar = require('/path/to/tinybar')

var tinyBar = new TinyBar.TinyBar({
    backgroundColor: 'red'
})
```

Let the bar go from right to left
```js
var tinyBar = new TinyBar.TinyBar({
 
    extendInitialBarStyle: function (barDiv, shouldPositionTopMost) {
        barDiv.style.right = '0'
        barDiv.style.left = '100%'
    },
    changeValueFunc: function (barWrapperDiv, barDiv, value) {
        barDiv.style.left = (100 - value) + '%'
    }
})
```

Use parent
```js
var tinyBar = new TinyBar.TinyBar('myHtmlId')
```

## Properties on a TinyBar instance

* `version: string` ... the version ;D  **use as readonly**
* `projectName: string` the project name, used for output
* `settings: Settings` the settings of the current progressbar  
TODO which options should not be changed??
* `value: number` the current value (percentage 0 <= value <= 100) **use as readonly**
* `status: ProgressbarStatus` the status of the bar  **use as readonly**
* `shouldPositionTopMost: boolean`true: no parent provided so position at the top, false: parent id present **use as readonly**
* `barWrapper:HTMLDivElement` the html div that represents the bar wrapper **use as readonly**
* `bar:HTMLDivElement` the html div element represents the bar **use as readonly**



## Functions on a TinyBar instance

* `constructor(settings?:Settings | string, htmlParentDivId?:string | Settings | HTMLElement, domElementsCreatedCallback?:() => void) => TinyBar`  
`settings` the settings for the bar  
`htmlParentDivId` htmlParentDivId the parent div id OR the parent html div object OR null (to position the progressbar at the top)    
`domElementsCreatedCallback` called when the dom elements were created and the bar is ready to be used

* `start(startingValue:number = 0.5) => TinyBar ` displays the bar and sets the given value  
`startingValue` the value to start with

* `go(value:number, callback?:() => void, hideBarWhenFinished:boolean = true) => void` goes to the given percentage (0 <= percentage <= 100)  
`value` the percentage to set (you can decrease the value with this function)  
`callback` called when the value has changed and the transition has finished  
`hideBarWhenFinished` true: hides the bar when the value is >= 100, false: not

* `inc(callback?:() => void) => void` increments the value by a random value but never reaches 100%  
taken from https://github.com/rstacruz/nprogress/blob/master/nprogress.js (check out the project!)  
`callback` called when the value has changed and the transition has finished

* `done(hideBar:boolean = true, callback?:() => void) => void` 

* `autoIncrement() => void` starts automatically incrementing the value of the bar (calls .inc in a setInterval loop)

* `clearAutoIncrement() => void` clears the auto increment interval

## Default Settings

Every time an instance of TinyBar is created the default settings are applied...

to change the default settings (e.g. you want all bars to be black) try

```js
TinyBar.defaultSettings.css.backgroundColor = 'black'
```
where `TinyBar.defaultSettings` has the type `Settings`

## Usage

```js
//crate the bar
var tinyBar = new TinyBar.TinyBar()

//start and increment
tinybar.start().autoIncrement()

//do something...

//finally hide the bar
tinybar.done()
```

For more examples see the `examples` dir 

To run the require examples with webpack you will need webpack and the webpack-dev-server  

*to install dependencies open a shell and cd to the example project folder (examples) and run:*  
npm install  
or  
npm install webpack  
npm install webpack-dev-server

then you can execute `npm run dev` to start the webpack-dev-server (wich serves the bundle.js on port 8080)

## Hints
* All callbacks are called with the corresponding TinyBar as the `this` value

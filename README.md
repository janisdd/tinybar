# TinyBar

A Tiny progressbar like on YouTube, Github, ...

![TinyBar Screenshot](https://raw.githubusercontent.com/janisdd/tinybar/master/screenshots/01.png)

## Include

Include `tinybar.js` in your html file

```html
<script src="path/to/tinybar.js"></script>

```
or require in js via

```js
var TinyBar = require('/path/to/tinybar')
```

### Create bar

```js
var tinyBar = new TinyBar.TinyBar([settings], [parentId], [callback])
```
* `settings: Settings ` the settings for the bar
* `parentId: string` html id where the bar should be inserted (via append)
* `callback: () => void` called when the dom elements were created and the bar is ready to be used

**`settings` and `parentId` can be exchanged (the order shouldn't matter ...)**

so you could also do this

```js
var tinyBar = new TinyBar.TinyBar([parentId], [settings], [callback])
```

## Settings 
* `wrapperCssClasses: string[]` the css classes to add the the bar wrapper  
default: `[]`
* `cssClasses: string[]` the css classes to add to the bar  
default: `[]`
* `incrementTimeoutInMs: number` the delay in ms, every tick the .inc method is called  
default: `300`
* `changeValueTransition: string` the transition for the bar when the value changes (must not be empty!)  
default: `'all 0.3s ease'`
* `changeValueBackTransition: string`  the transition for the bar when animating from bigger to smaller value (backwards) (must not be empty!)  
default: `'all 0.2s ease'`
* `changeVisibilityTransition: string` the transition for the bar wrapper when the visibility (not the css value)  
 default: `'all 0.05s linear'`
* `height: string` the height of the bar (applied to barWrapper)  
 default: `'2px'`
* `wrapperBackgroundColor: string` the wrapper background color (applied to barWrapper)  
 default: `'transparent'`
* `backgroundColor: string` the background color  
 default: `'#29d'`
* `boxShadow: string` the box shadow  
 default: `'0 0 10px rgba(119,182,255,0.7)'`
* `zIndex: string` the z index  
 default: `'1000'`
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
    if (shouldPositionTopMost) {
        barWrapperDiv.style.position = 'fixed'
        barWrapperDiv.style.left = '0'
        barWrapperDiv.style.right = '0'
        barWrapperDiv.style.top = '0'
    } else {
        barWrapperDiv.style.position = 'relative'
    }

    barWrapperDiv.style.height = this.height
    barWrapperDiv.style.backgroundColor = this.wrapperBackgroundColor
    barWrapperDiv.style.zIndex = this.zIndex
    barWrapperDiv.style.transition = this.changeVisibilityTransition

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
    barDiv.style.position = 'absolute'
    barDiv.style.left = '0'
    barDiv.style.right = '100%'
    barDiv.style.top = '0'
    barDiv.style.bottom = '0'
    barDiv.style.backgroundColor = this.backgroundColor
    barDiv.style.transition = this.changeValueTransition
    barDiv.style.boxShadow = this.boxShadow

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
    if (newVisibility)
            barWrapperDiv.style.height = this.height
        else {
            barWrapperDiv.style.height = '0px'
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


## Enum ProgressbarStatus

* `ProgressbarStatus.initial` only when the bar is created
* `ProgressbarStatus.started` the bar is "running"
* `ProgressbarStatus.finished` the bar has finished

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

* `version: string` ... the version ;D  
* `projectName: string` the project name, used for output
* `settings: Settings` the settings of the current progressbar  
TODO which options should not be changed??
* `value: number` the current value (percentage 0 <= value <= 100) **use as readonly**
* `status: ProgressbarStatus` the status of the bar  **use as readonly**





## Functions

* `constructor(settings?:Settings, htmlParentDivId?:string, domElementsCreatedCallback?:() => void) => TinyBar`  
`settings` the settings for the bar  
`htmlParentDivId` the parent html id or null (in this case the bar is positioned fixed at the top)    
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

## Hints

All callbacks are called with the corresponding TinyBar as the `this` value


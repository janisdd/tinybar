'use strict'

//inspired by https://github.com/rstacruz/nprogress/blob/master/nprogress.js
enum BarElement {
    barWrapper,
    bar,
}

enum TransitionState {
    running,
    finished
}

enum TransitionType {
    value,
    visibility
}

enum ProgressbarStatus {
    /**
     * starting value (only once)
     */
    initial,
    /**
     * displayed and 0 <= value < 1 (normally after .start was called)
     */
    started,
    /**
     * displayed and value === 1 (normally after .done was called)
     */
    finished
}

//from https://developer.mozilla.org/de/docs/Web/Events/transitionend
interface TransitionEndEvent extends Event {
    target:EventTarget
    type:string
    bubbles:boolean
    cancelable:boolean
    propertyName:string
    elapsedTime:number
    pseudoElement:string
}

/**
 * a class for the default settings (class because of functions)
 */
class DefaultSettings implements Settings {

    incrementTimeoutInMs = 300

    wrapperCssClasses = []
    cssClasses = []
    changeValueTransition = 'all 0.3s ease'
    changeVisibilityTransition = 'all 0.2s ease'

    //used when transitioning/animating backwards
    changeValueBackTransition = 'all 0.05s linear'

    height = '2px'
    wrapperBackgroundColor = 'transparent'
    backgroundColor = '#29d' //github: #77b6f
    boxShadow = '0 0 10px rgba(119,182,255,0.7)' //github
    zIndex = '1000'

    changeValueProperty = null //right //null for all
    changeValueElement = BarElement.bar
    changeVisibilityProperty = null //height //null for all
    changeVisibilityElement = BarElement.barWrapper

    applyInitialBarWrapperStyle(barWrapperDiv:HTMLDivElement, shouldPositionTopMost:boolean) {

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

    extendInitialBarWrapperStyle(barWrapperDiv:HTMLDivElement, shouldPositionTopMost:boolean) {
        //do nothing here...
    }

    applyInitialBarStyle(barDiv:HTMLDivElement, shouldPositionTopMost:boolean) {
        barDiv.style.position = 'absolute'
        barDiv.style.left = '0'
        barDiv.style.right = '100%' //we will change only this value
        barDiv.style.top = '0'
        barDiv.style.bottom = '0'
        barDiv.style.backgroundColor = this.backgroundColor
        barDiv.style.transition = this.changeValueTransition
        barDiv.style.boxShadow = this.boxShadow

        //let the user modify the style
        this.extendInitialBarStyle(barDiv, shouldPositionTopMost)
    }

    extendInitialBarStyle(barDiv:HTMLDivElement, shouldPositionTopMost:boolean) {
        //do nothing here...
    }

    changeBarVisibility(barWrapperDiv:HTMLDivElement, barDiv:HTMLDivElement, newVisibility:boolean) {
        if (newVisibility)
            barWrapperDiv.style.height = this.height
        else {
            barWrapperDiv.style.height = '0px'
        }

    }

    changeValueFunc(barWrapperDiv:HTMLDivElement, barDiv:HTMLDivElement, value:number) {
        barDiv.style.right = (100 - value) + '%'
    }
}

interface Settings {

    /**
     * the css classes to add the the bar wrapper
     */
    wrapperCssClasses?:string[]


    /**
     * the delay in ms, every tick the .inc method is called
     */
    incrementTimeoutInMs?:number

    /**
     * the css classes to add to the bar
     */
    cssClasses?:string[]

    /**
     * the transition for the bar when the value changes
     * (must not be empty!)
     */
    changeValueTransition?:string

    /**
     * the transition for the bar when animating from bigger to smaller value (backwards)
     * (must not be empty!)
     */
    changeValueBackTransition?:string

    /**
     * the transition for the bar wrapper when the visibility (not the css value) changes e.g. set height to 0
     * (must not be empty!)
     */
    changeVisibilityTransition?:string

    /**
     * the height of the bar (applied to barWrapper)
     */
    height?:string

    /**
     * the wrapper background color (applied to barWrapper)
     */
    wrapperBackgroundColor?:string

    /**
     * the background color (applied to the bar)
     */
    backgroundColor?:string

    /**
     * the box shadow (applied to the bar)
     */
    boxShadow?:string

    /**
     * the z index (applied to the barWrapper)
     */
    zIndex?:string

    /**
     * the property name of the value property (property that changes when the value should change)
     * (default right)
     */
    changeValueProperty?:string

    /**
     * the element that will used to change the value
     * (default bar)
     */
    changeValueElement?:BarElement

    /**
     * the property name of the visibility property (property that changes when the visibility should change)
     * (default height)
     */
    changeVisibilityProperty?:string

    /**
     * the element that will used to change the visibility
     * (default barWrapper)
     */
    changeVisibilityElement?:BarElement


    /**
     * function that applies the initial style to the bar wrapper (the initial styles)
     * @param barWrapperDiv hte bar wrapper div
     * @param shouldPositionTopMost true: no parent provided position on the top, false: parent provided
     */
    applyInitialBarWrapperStyle?:(barWrapperDiv:HTMLDivElement, shouldPositionTopMost:boolean) => void

    /**
     * a function that is called after applyInitialBarWrapperStyle to do some minor changes on the bar wrapper style
     * @param barWrapperDiv the bar wrapper
     * @param shouldPositionTopMost true: no parent provided position on the top, false: parent provided
     */
    extendInitialBarWrapperStyle?:(barWrapperDiv:HTMLDivElement, shouldPositionTopMost:boolean) => void

    /**
     * function that applies the initial style to the bar (the initial styles)
     * @param barDiv the bar div
     * @param shouldPositionTopMost true: no parent provided position on the top, false: parent provided
     */
    applyInitialBarStyle?:(barDiv:HTMLDivElement, shouldPositionTopMost:boolean) => void

    /**
     *  a function that is called after applyInitialBarStyle to do some minor changes on the bar style
     * @param barDiv the bar
     * @param shouldPositionTopMost true: no parent provided position on the top, false: parent provided
     */
    extendInitialBarStyle?:(barDiv:HTMLDivElement, shouldPositionTopMost:boolean) => void

    /**
     * function that changes the visibility of the bar (wrapper)
     * @param barWrapperDiv the bar wrapper
     * @param barDiv the bar the bar
     * @param newVisibility true: make visible, false: invisible
     */
    changeBarVisibility?:(barWrapperDiv:HTMLDivElement, barDiv:HTMLDivElement, newVisibility:boolean) => void

    /**
     * function to change to value of the bar (set the right css values here)
     * @param barWrapperDiv the bar wrapper
     * @param barDiv the bar
     * @param value the new value (0 <= value <= 100)
     */
    changeValueFunc?:(barWrapperDiv:HTMLDivElement, barDiv:HTMLDivElement, value:number) => void

}

/**
 * the global default (static) settings for a tiny bar
 * @type {DefaultSettings}
 */
 var defaultSettings = new DefaultSettings()

/**
 * a tiny (progress) bar
 */
 class TinyBar {

    /**
     * just the version
     * @type {string}
     */
    version:string = '1.0.0'

    /**
     * the project name ... used for output
     * @type {string}
     */
    projectName:string = 'TinyBar'

    /**
     * the settings of the current progressbar
     * @type {DefaultSettings}
     */
    settings:Settings = new DefaultSettings()

    /**
     * the current status of the progressbar (initial | started | finished)
     * @type {ProgressbarStatus}
     */
    status:ProgressbarStatus = ProgressbarStatus.initial

    /**
     * the current value of the progressbar
     * @type {number}
     */
    value:number = 0

    /**
     * true: no parent provided so position on the top, false: parent id present
     * @type {boolean}
     */
    shouldPositionTopMost:boolean = true

    /**
     * the html div that represents the bar wrapper
     * @type {null}
     */
    barWrapper:HTMLDivElement = null

    /**
     * the html div element represents the bar
     * @type {null}
     */
    bar:HTMLDivElement = null

    /**
     * a queue to help with the transition events
     * @type {null}
     */
    transitionQueue:_TransitioQueue = null

    /**
     * used to store the handle for the interval cleanup when incrementing to infinity
     * @type {null}
     */
    tricklingHandle = null

    /**
     * creates a new tiny (progress) bar
     * @param htmlParentDivId the parent div id or null (to position the progressbar on the top
     * @param settings the settings for the new tiny bar
     * @param domElementsCreatedCallback  called when the bar and bar wrapper are created and inserted in the dom
     */
    constructor(htmlParentDivId?:string, settings?:Settings, domElementsCreatedCallback?:() => void) {

        //first apply settings
        this._setSettings(settings)

        //then create html
        if (htmlParentDivId) {
            this.shouldPositionTopMost = false
            this._createBar(document.getElementById(htmlParentDivId), false, domElementsCreatedCallback)

        } else {
            //create bar on the top
            this.shouldPositionTopMost = true
            this._createBar(document.body, true, domElementsCreatedCallback)
        }

        this.transitionQueue = new _TransitioQueue(this)
    }

    /**
     * appends the html for the bar and the bar wrapper (applies the initial state
     * @param parentHtmlElement the parent element where the tiny bar should be inserted (through appendChild)
     * @param positionTopMost true: no parent provided position on the top, false: parent provided
     * @param domElementsCreatedCallback called when the bar and bar wrapper are created and inserted in the dom
     * @private
     */
    private _createBar(parentHtmlElement, positionTopMost:boolean, domElementsCreatedCallback?:() => void) {

        //create wrapper div
        let barWrapper = document.createElement('div')
        for (let i = 0; i < this.settings.wrapperCssClasses.length; i++) {
            let cssClass = this.settings.wrapperCssClasses[i];
            barWrapper.classList.add(cssClass)
        }

        //create bar div
        let bar = document.createElement('div')
        for (let i = 0; i < this.settings.cssClasses.length; i++) {
            let cssClass = this.settings.cssClasses[i];
            bar.classList.add(cssClass)
        }

        this.settings.applyInitialBarWrapperStyle(barWrapper, positionTopMost)
        this.settings.applyInitialBarStyle(bar, positionTopMost)

        this.bar = bar
        this.barWrapper = barWrapper

        barWrapper.appendChild(bar)
        parentHtmlElement.appendChild(barWrapper)

        if (domElementsCreatedCallback)
            domElementsCreatedCallback()

    }

    /**
     * sets the settings for this bar (call only once per setup ... when called a second time the
     * settings from the first call are deleted)
     * @param settings the settings
     * @returns {TinyBar} the bar
     */
    private _setSettings(settings:Settings) {

        //first apply the defaultSettings

        for (let key in defaultSettings) {
            if (defaultSettings.hasOwnProperty(key)) {
                let value = defaultSettings[key]
                if (value !== undefined)
                    this.settings[key] = value
            }
        }

        //then user settings if any
        if (settings)
            for (let key in settings) {
                if (settings.hasOwnProperty(key)) {
                    let value = settings[key]
                    if (value !== undefined)
                        this.settings[key] = value
                }
            }
        /*
        if (this.settings.changeValueElement === this.settings.changeVisibilityElement) {

            if (this.settings.changeValueProperty === this.settings.changeVisibilityProperty) {
                console.error(this.projectName + ': changeValueProperty can\'t be the same as changeVisibilityProperty ' +
                    'because we need to watch the transition events')
            }
        }

         normally the bar is only animated by this class and only the appropriated properties so nully value should be ok
         -> no filter for transitionend events in the transition queue
         if (!this.settings.changeValueProperty) {
         console.error(this.projectName + ': changeValueProperty needs to be set')
         }
         if (!this.settings.changeVisibilityProperty) {
         console.error(this.projectName + ': changeVisibilityProperty needs to be set')
         }
         */

        if (!this.settings.changeValueTransition || !this.settings.changeVisibilityTransition) {
            console.error(this.projectName + ': changeValueTransition and/or changeVisibilityTransition where not set ' +
                'the is needed becase we need to watche the transition events')
        }

        //TODO maybe add more validation

        return this
    }


    /**
     * starts the bar and shows it
     */
    start(startingValue:number = 0.5) {

        if (this.status === ProgressbarStatus.started)
            return this

        this.status = ProgressbarStatus.started

        //clear all old queue actions (from old .done calls)
        this.transitionQueue.valueChangedQueue = []
        this.transitionQueue.visibilityChangedQueue = []

        //make bar visible
        this.settings.changeBarVisibility(this.barWrapper, this.bar, true)

        //set starting value
        //??this._getValueChangingElement().style.transition = this.settings.changeValueTransition
        this._go(startingValue, null, true)
        this.value = startingValue

        return this
    }

    /**
     * goes to the given percentage (0 <= percentage <= 100)
     * @param value the value between 0 and 100 to go to
     * @param hideBarWhenFinished when value >= 100 then the done method is called with this parameter as argument
     * @param callback called when the animation has finished
     */
    go(value:number, hideBarWhenFinished:boolean = true, callback?:() => void) {
        
        if (this.status !== ProgressbarStatus.started) return
        
        //e.g. when .done calls this with value 0 the bar status should stay finished...
        this.status = ProgressbarStatus.started

        this._go(value, callback, hideBarWhenFinished)
    }

    /**
     * goes to the given percentage (0 <= percentage <= 100)
     * @param value the value between 0 and 100 to go to
     * @param callback called when the animation has finished
     * @param hideBarWhenFinished when value >= 100 then the done method is called with this parameter as argument
     * @param setBarStatus true: set the bar status to running, false: do not touch the bar status
     * @private
     */
    _go(value:number, callback:() => void, hideBarWhenFinished:boolean) {

        if (value >= 0) {
            //&& this.status !== ProgressbarStatus.finished //when the bar finished then only allow .start

            if (value <= this.value) {

                this.transitionQueue.valueChangedQueue = []
                this.transitionQueue.visibilityChangedQueue = []
                this.clearAutoIncrement()

                //when we want to go back transition/animate faster...
                this._getValueChangingElement().style.transition = this.settings.changeValueBackTransition

                this.transitionQueue._executeActionAfterTransition(TransitionType.value, () => {
                    this._getValueChangingElement().style.transition = this.settings.changeValueTransition

                    if (callback)
                        callback()
                })

                this.transitionQueue._beforeTransition(TransitionType.value)
                this.settings.changeValueFunc(this.barWrapper, this.bar, value)
                this.value = value

            } else {
                let myValue = Math.min(value, 100)
                this.value = myValue

                //when calling .start(true).done(false) multiple times
                //then the done will call _go(0) -> 0 < 100 -> fast transition is set and nev
                //this._getValueChangingElement().style.transition = this.settings.changeValueTransition

                //provide callback
                this.transitionQueue._executeActionAfterTransition(TransitionType.value, () => {
                    if (callback)
                        callback()
                })

                this.transitionQueue._beforeTransition(TransitionType.value)
                this.settings.changeValueFunc(this.barWrapper, this.bar, myValue)

                if (value >= 100) {
                    this.done(hideBarWhenFinished, null)
                }
            }
        }
    }

    /**
     * increments the value by a random value but never reaches 100%
     * taken from https://github.com/rstacruz/nprogress/blob/master/nprogress.js
     */
    inc(callback?:() => void) {
        if (this.value >= 100) {
            return
        } else {

            let amount = 0

            if (this.value >= 0 && this.value < 25) {
                // Start out between 3 - 6% increments
                amount = (Math.random() * (5 - 3 + 1) + 3) / 100;
            } else if (this.value >= 25 && this.value < 65) {
                // increment between 0 - 3%
                amount = (Math.random() * 3) / 100;
            } else if (this.value >= 65 && this.value < 90) {
                // increment between 0 - 2%
                amount = (Math.random() * 2) / 100;
            } else if (this.value >= 90 && this.value < 99) {
                // finally, increment it .5 %
                amount = 0.005;
            } else {
                // after 99%, don't increment:
                amount = 0;
            }
            this._go(this.value + (amount * 100 / 2), callback, true)
        }
    }

    /**
     * finishes the bar
     * @param hideBar true: hide the bar after finishing, false: not
     * @param callback called when the transition has finished
     * when hideBar = true then the callback is called after the hide transition has finished
     * and the value has returned to 0,
     * if hideBar = false then the callback is called after the value transition has finished
     */
    done(hideBar:boolean = true, callback?:() => void) {
        let self = this

        this.transitionQueue.valueChangedQueue = []
        this.transitionQueue.visibilityChangedQueue = []
        //clear handle if any
        this.clearAutoIncrement()

        let hideFunc = () => {

            //set the value to 0 after the visibility changed to invisible
            // else when we call start the bar would animate from 100 to 0
            self.transitionQueue._executeActionAfterTransition(TransitionType.visibility, () => {

                //do not set the bar status to running...
                //self._go(0,null, hideBar, false)
                setTimeout(() => {
                    self._go(0, () => {
                        if (callback) callback()
                    }, hideBar)
                }, 100)
            })

            self.transitionQueue._beforeTransition(TransitionType.visibility)
            self.settings.changeBarVisibility(this.barWrapper, self.bar, false)
        }

        if (this.status === ProgressbarStatus.finished) {
            if (hideBar)
                hideFunc()

            return
        }

        if (this.value !== 100) {
            //queue because we want to let the value animation finish before hiding the bar
            this.transitionQueue._executeActionAfterTransition(TransitionType.value, () => {
                this.value = 100
                self.status = ProgressbarStatus.finished

                if (hideBar) {

                    //wait until bar is invisible and value returned to 0 then call the callback
                    hideFunc()

                } else {

                    //bar wont hide so call the callback now
                    if (callback)
                        callback()
                }
            })
            this.transitionQueue._beforeTransition(TransitionType.value)
            this.settings.changeValueFunc(this.barWrapper, this.bar, 100)

        } else {

            if (hideBar) {
                hideFunc()
            }
        }
    }

    /**
     * starts automatically incrementing the value of the bar (calls .inc in a setInterval loop)
     */
    autoIncrement() {

        //first clear old increment else we could lose the clear handle for the old increment
        this.clearAutoIncrement()

        this.tricklingHandle = setInterval(() => {
            this.inc()
        }, this.settings.incrementTimeoutInMs)
    }

    /**
     * clears the auto increment interval
     * @private
     */
    clearAutoIncrement() {
        if (this.tricklingHandle) {
            clearInterval(this.tricklingHandle)
            this.tricklingHandle = null
        }
    }

    /**
     * returns the value that indicates the value of the tiny bar (relies on this.settings.changeValueElement)
     * @returns {HTMLDivElement} the value that indicates the value of the tiny bar
     * @private
     */
    _getValueChangingElement():HTMLDivElement {
        return this.settings.changeValueElement === BarElement.bar
            ? this.bar : this.barWrapper
    }

}

/**
 * a class to handle transition events and (queue) actions
 */
 class _TransitioQueue {

    /**
     * the related tiny bar
     */
    tinyBar:TinyBar

    /**
     * the transition state of the tiny bar
     * @type {TransitionState}
     */
    valueTransitionState:TransitionState = TransitionState.finished

    /**
     * the transition state of the tiny bar
     * @type {TransitionState}
     */
    visibilityTransitionState:TransitionState = TransitionState.finished

    /**
     * the change value transition start handler
     * @type {null}
     */
    changeValueTransitionStartHandler:() => void = null
    /**
     * the change value transition end handler
     * @type {null}
     */
    changeValueTransitionEndHandler:(transition:TransitionEndEvent) => void = null

    /**
     * the change visibility transition start handler
     * @type {null}
     */
    changeVisibilityTransitionStartHandler:() => void = null
    /**
     * the change visibility transition end handler
     * @type {null}
     */
    changeVisibilityTransitionEndHandler:(transition:TransitionEndEvent) => void = null

    /**
     * the queue with actions to to when the a value transition has finished
     * (only the first item is used when a transition finished)
     * @type {Array}
     */
    valueChangedQueue:Array<() => void> = []

    /**
     * the queue with actions to to when the a visibility transition has finished
     * (only the first item is used when a transition finished)
     * @type {Array}
     */
    visibilityChangedQueue:Array<() => void> = []

    /**
     * creates a new transition queue
     * @param tinyBar  the connected tiny bar
     */
    constructor(tinyBar:TinyBar) {
        this.tinyBar = tinyBar
        this._setupQueue()
    }

    /**
     * notifies the queue that a transition is started (no transitionStart event on js)
     * @param transition the transition type
     * @private
     */
    _beforeTransition(transition:TransitionType) {

        if (transition === TransitionType.value)
            this.changeValueTransitionStartHandler()

        else if (transition === TransitionType.visibility) {
            this.changeVisibilityTransitionStartHandler()
        }
    }

    /**
     * enqueues an action which should be executed after an transition has started and finished
     * (after finishing the action is executed)
     * @param transition the transition to finish
     * @param action the action to execute
     * @private
     */
    _executeActionAfterTransition(transition:TransitionType, action:() => void) {

        if (transition === TransitionType.value)
            this.valueChangedQueue.push(action)

        else if (transition === TransitionType.visibility) {
            this.visibilityChangedQueue.push(action)
        }

    }

    /**
     * sets all listeners up
     * @private
     */
    _setupQueue() {

        let self = this
        let transitionEndEvent = 'transitionend' //transitionend //webkitTransitionEnd

        let changeValueElement = this.tinyBar.settings.changeValueElement === BarElement.bar
            ? this.tinyBar.bar : this.tinyBar.barWrapper

        this.changeValueTransitionStartHandler = () => {
            self.valueTransitionState = TransitionState.running
        }

        this.changeValueTransitionEndHandler = (trans:TransitionEndEvent) => {
            //only do sth when the right property was transitioned
            if (!self.tinyBar.settings.changeValueProperty //if nully value then allow all
                || trans.propertyName === self.tinyBar.settings.changeValueProperty) {
                self.valueTransitionState = TransitionState.finished

                if (self.valueChangedQueue.length > 0) {
                    let action = self.valueChangedQueue.shift()
                    action()
                }
            }
        }

        changeValueElement.addEventListener(transitionEndEvent, this.changeValueTransitionEndHandler)

        let changeVisibilityElement = this.tinyBar.settings.changeVisibilityElement === BarElement.bar
            ? this.tinyBar.bar : this.tinyBar.barWrapper

        this.changeVisibilityTransitionStartHandler = () => {
            self.visibilityTransitionState = TransitionState.running

        }


        this.changeVisibilityTransitionEndHandler = (trans:TransitionEndEvent) => {
            //only do sth when the right property was transitioned
            if (!self.tinyBar.settings.changeVisibilityProperty //if nully value then allow all
                || trans.propertyName === self.tinyBar.settings.changeVisibilityProperty) {
                self.visibilityTransitionState = TransitionState.finished

                if (self.visibilityChangedQueue.length > 0) {
                    let action = self.visibilityChangedQueue.shift()
                    action()
                }
            }
        }

        changeVisibilityElement.addEventListener(transitionEndEvent, this.changeVisibilityTransitionEndHandler)
    }
}

interface TinyBarExport {
    TinyBar: new (htmlParentDivId?:string, settings?:Settings, domElementsCreatedCallback?:() => void) => TinyBar,
    defaultSettings:Settings,
    
    BarElement: any,
    TransitionState: any,
    TransitionType: any,
    ProgressbarStatus: any
}

var myExport: TinyBarExport = {
    TinyBar: TinyBar,
    defaultSettings: defaultSettings,
    BarElement: BarElement,
    TransitionState: TransitionState,
    TransitionType: TransitionType,
    ProgressbarStatus: ProgressbarStatus
}
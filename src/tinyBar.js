'use strict';
//inspired by https://github.com/rstacruz/nprogress/blob/master/nprogress.js
var BarElement;
(function (BarElement) {
    BarElement[BarElement["barWrapper"] = 0] = "barWrapper";
    BarElement[BarElement["bar"] = 1] = "bar";
})(BarElement || (BarElement = {}));
var TransitionState;
(function (TransitionState) {
    TransitionState[TransitionState["running"] = 0] = "running";
    TransitionState[TransitionState["finished"] = 1] = "finished";
})(TransitionState || (TransitionState = {}));
var TransitionType;
(function (TransitionType) {
    TransitionType[TransitionType["value"] = 0] = "value";
    TransitionType[TransitionType["visibility"] = 1] = "visibility";
})(TransitionType || (TransitionType = {}));
var ProgressbarStatus;
(function (ProgressbarStatus) {
    /**
     * starting value (only once)
     */
    ProgressbarStatus[ProgressbarStatus["initial"] = 0] = "initial";
    /**
     * displayed and 0 <= value < 1 (normally after .start was called)
     */
    ProgressbarStatus[ProgressbarStatus["started"] = 1] = "started";
    /**
     * displayed and value === 1 (normally after .done was called)
     */
    ProgressbarStatus[ProgressbarStatus["finished"] = 2] = "finished";
})(ProgressbarStatus || (ProgressbarStatus = {}));
/**
 * a class for the default settings (class because of functions)
 */
var DefaultSettings = (function () {
    function DefaultSettings() {
        this.incrementTimeoutInMs = 300;
        this.wrapperCssClasses = [];
        this.cssClasses = [];
        this.changeValueTransition = 'all 0.3s ease';
        this.changeVisibilityTransition = 'all 0.2s ease';
        //used when transitioning/animating backwards
        this.changeValueBackTransition = 'all 0.05s linear';
        this.height = '2px';
        this.wrapperBackgroundColor = 'transparent';
        this.backgroundColor = '#29d'; //github: #77b6f
        this.boxShadow = '0 0 10px rgba(119,182,255,0.7)'; //github
        this.zIndex = '1000';
        this.changeValueProperty = null; //null for all
        this.changeValueElement = BarElement.bar;
        this.changeVisibilityProperty = null; //null for all
        this.changeVisibilityElement = BarElement.barWrapper;
    }
    DefaultSettings.prototype.applyInitialBarWrapperStyle = function (barWrapperDiv, shouldPositionTopMost) {
        if (shouldPositionTopMost) {
            barWrapperDiv.style.position = 'fixed';
            barWrapperDiv.style.left = '0';
            barWrapperDiv.style.right = '0';
            barWrapperDiv.style.top = '0';
        }
        else {
            barWrapperDiv.style.position = 'relative';
        }
        barWrapperDiv.style.height = this.height;
        barWrapperDiv.style.backgroundColor = this.wrapperBackgroundColor;
        barWrapperDiv.style.zIndex = this.zIndex;
        barWrapperDiv.style.transition = this.changeVisibilityTransition;
        this.extendInitialBarWrapperStyle(barWrapperDiv, shouldPositionTopMost);
    };
    DefaultSettings.prototype.extendInitialBarWrapperStyle = function (barWrapperDiv, shouldPositionTopMost) {
        //do nothing here...
    };
    DefaultSettings.prototype.applyInitialBarStyle = function (barDiv, shouldPositionTopMost) {
        barDiv.style.position = 'absolute';
        barDiv.style.left = '0';
        barDiv.style.right = '100%'; //we will change only this value
        barDiv.style.top = '0';
        barDiv.style.bottom = '0';
        barDiv.style.backgroundColor = this.backgroundColor;
        barDiv.style.transition = this.changeValueTransition;
        barDiv.style.boxShadow = this.boxShadow;
        //let the user modify the style
        this.extendInitialBarStyle(barDiv, shouldPositionTopMost);
    };
    DefaultSettings.prototype.extendInitialBarStyle = function (barDiv, shouldPositionTopMost) {
        //do nothing here...
    };
    DefaultSettings.prototype.changeBarVisibility = function (barWrapperDiv, barDiv, newVisibility) {
        //use opacity here... looks nicer
        if (newVisibility) {
            //barWrapperDiv.style.height = this.height;
            barWrapperDiv.style.opacity = '1';
        }
        else {
            //barWrapperDiv.style.height = '0px';
            barWrapperDiv.style.opacity = '0';
        }
    };
    DefaultSettings.prototype.changeValueFunc = function (barWrapperDiv, barDiv, value) {
        barDiv.style.right = (100 - value) + '%';
    };
    return DefaultSettings;
}());
/**
 * the global default (static) settings for a tiny bar
 * @type {DefaultSettings}
 */
var defaultSettings = new DefaultSettings();
/**
 * a tiny (progress) bar
 */
var TinyBar = (function () {
    /**
     * creates a new tiny (progress) bar
     * @param settings the settings for the new tiny bar
     * @param htmlParentDivId the parent div id or null (to position the progressbar at the top
     * @param domElementsCreatedCallback  called when the bar and bar wrapper are created and inserted in the dom
     */
    function TinyBar(settings, htmlParentDivId, domElementsCreatedCallback) {
        /**
         * just the version
         * (use as readonly)
         * @type {string}
         */
        this.version = '1.0.0';
        /**
         * the project name ... used for output
         * @type {string}
         */
        this.projectName = 'TinyBar';
        /**
         * the settings of the current progressbar
         * @type {DefaultSettings}
         */
        this.settings = new DefaultSettings();
        /**
         * the current status of the progressbar (initial | started | finished)
         * (use as readonly)
         * @type {ProgressbarStatus}
         */
        this.status = ProgressbarStatus.initial;
        /**
         * the current value of the progressbar
         * (use as readonly)
         * @type {number}
         */
        this.value = 0;
        /**
         * true: no parent provided so position at the top, false: parent id present
         * (use as readonly)
         * @type {boolean}
         */
        this.shouldPositionTopMost = true;
        /**
         * the html div that represents the bar wrapper
         * (use as readonly)
         * @type {null}
         */
        this.barWrapper = null;
        /**
         * the html div element represents the bar
         *  (use as readonly)
         * @type {null}
         */
        this.bar = null;
        /**
         * a queue to help with the transition events
         * (use as readonly)
         * @type {null}
         */
        this.transitionQueue = null;
        /**
         * used to store the handle for the interval cleanup when incrementing to infinity
         * (use as readonly)
         * @type {null}
         */
        this.tricklingHandle = null;
        //if first arg is a string assume that the second arg represents the settings...
        if (typeof settings === 'string') {
            var temp = htmlParentDivId;
            htmlParentDivId = settings;
            settings = temp;
            //first apply settings
            this._setSettings(settings);
            if (htmlParentDivId) {
                this.shouldPositionTopMost = false;
                this._createBar(document.getElementById(htmlParentDivId), false, domElementsCreatedCallback);
            }
            else {
                //create bar at the top
                this.shouldPositionTopMost = true;
                this._createBar(document.body, true, domElementsCreatedCallback);
            }
        }
        else if (typeof htmlParentDivId === 'string') {
            //first apply settings
            this._setSettings(settings);
            if (htmlParentDivId) {
                this.shouldPositionTopMost = false;
                this._createBar(document.getElementById(htmlParentDivId), false, domElementsCreatedCallback);
            }
            else {
                //create bar at the top
                this.shouldPositionTopMost = true;
                this._createBar(document.body, true, domElementsCreatedCallback);
            }
        }
        else {
            //first apply settings
            this._setSettings(settings);
            //create bar at the top
            this.shouldPositionTopMost = true;
            this._createBar(document.body, true, domElementsCreatedCallback);
        }
        this.transitionQueue = new _TransitioQueue(this);
    }
    /**
     * appends the html for the bar and the bar wrapper (applies the initial state
     * @param parentHtmlElement the parent element where the tiny bar should be inserted (through appendChild)
     * @param positionTopMost true: no parent provided position at the top, false: parent provided
     * @param domElementsCreatedCallback called when the bar and bar wrapper are created and inserted in the dom
     * @private
     */
    TinyBar.prototype._createBar = function (parentHtmlElement, positionTopMost, domElementsCreatedCallback) {
        //create wrapper div
        var barWrapper = document.createElement('div');
        for (var i = 0; i < this.settings.wrapperCssClasses.length; i++) {
            var cssClass = this.settings.wrapperCssClasses[i];
            barWrapper.classList.add(cssClass);
        }
        //create bar div
        var bar = document.createElement('div');
        for (var i = 0; i < this.settings.cssClasses.length; i++) {
            var cssClass = this.settings.cssClasses[i];
            bar.classList.add(cssClass);
        }
        this.settings.applyInitialBarWrapperStyle(barWrapper, positionTopMost);
        this.settings.applyInitialBarStyle(bar, positionTopMost);
        this.bar = bar;
        this.barWrapper = barWrapper;
        barWrapper.appendChild(bar);
        parentHtmlElement.appendChild(barWrapper);
        if (domElementsCreatedCallback)
            domElementsCreatedCallback.call(this);
    };
    /**
     * sets the settings for this bar (call only once per setup ... when called a second time the
     * settings from the first call are deleted)
     * @param settings the settings
     * @returns {TinyBar} the bar
     */
    TinyBar.prototype._setSettings = function (settings) {
        //first apply the defaultSettings
        for (var key in defaultSettings) {
            if (defaultSettings.hasOwnProperty(key)) {
                var value = defaultSettings[key];
                if (value !== undefined)
                    this.settings[key] = value;
            }
        }
        //then user settings if any
        if (settings)
            for (var key in settings) {
                if (settings.hasOwnProperty(key)) {
                    var value = settings[key];
                    if (value !== undefined)
                        this.settings[key] = value;
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
                'the is needed becase we need to watche the transition events');
        }
        //TODO maybe add more validation
        return this;
    };
    /**
     * starts the bar and shows it
     * @param startingValue the value to start with
     * @param callback  callback called when the animation has finished
     * @returns {TinyBar}
     */
    TinyBar.prototype.start = function (startingValue, callback) {
        if (startingValue === void 0) { startingValue = 0.5; }
        if (this.status === ProgressbarStatus.started)
            return this;
        this.status = ProgressbarStatus.started;
        //clear all old queue actions (from old .done calls)
        this.transitionQueue.valueChangedQueue = [];
        this.transitionQueue.visibilityChangedQueue = [];
        //make bar visible
        this.settings.changeBarVisibility(this.barWrapper, this.bar, true);
        //set starting value
        this._go(startingValue, callback, true);
        this.value = startingValue;
        return this;
    };
    /**
     * goes to the given percentage (0 <= percentage <= 100)
     * @param value the value between 0 and 100 to go to
     * @param callback called when the animation has finished
     * @param hideBarWhenFinished when value >= 100 then the done method is called with this parameter as argument
     */
    TinyBar.prototype.go = function (value, callback, hideBarWhenFinished) {
        //if (this.status !== ProgressbarStatus.started) return
        if (hideBarWhenFinished === void 0) { hideBarWhenFinished = true; }
        //when the bar has finished and we call go to set the bar to a lower 
        // value then the status needs to be started
        this.status = ProgressbarStatus.started;
        this._go(value, callback, hideBarWhenFinished);
    };
    /**
     * goes to the given percentage (0 <= percentage <= 100)
     * @param value the value between 0 and 100 to go to
     * @param callback called when the value is set and the animation has finished
     * @param hideBarWhenFinished when value >= 100 then the done method is called with this parameter as argument
     * @private
     */
    TinyBar.prototype._go = function (value, callback, hideBarWhenFinished) {
        var _this = this;
        var self = this;
        if (value >= 0) {
            //&& this.status !== ProgressbarStatus.finished //when the bar finished then only allow .start
            if (value <= this.value) {
                this.transitionQueue.valueChangedQueue = [];
                this.transitionQueue.visibilityChangedQueue = [];
                this.clearAutoIncrement();
                //when we want to go back transition/animate faster...
                this._getValueChangingElement().style.transition = this.settings.changeValueBackTransition;
                this.transitionQueue._executeActionAfterTransition(TransitionType.value, function () {
                    _this._getValueChangingElement().style.transition = _this.settings.changeValueTransition;
                    if (callback)
                        callback.call(self);
                });
                this.transitionQueue._beforeTransition(TransitionType.value);
                this.settings.changeValueFunc(this.barWrapper, this.bar, value);
                this.value = value;
            }
            else {
                var myValue = Math.min(value, 100);
                if (myValue === 100) {
                    this.done(hideBarWhenFinished, callback);
                }
                else {
                    this.value = myValue;
                    //when calling .start(true).done(false) multiple times
                    //then the done will call _go(0) -> 0 < 100 -> fast transition is set and nev
                    //this._getValueChangingElement().style.transition = this.settings.changeValueTransition
                    //provide callback
                    this.transitionQueue._executeActionAfterTransition(TransitionType.value, function () {
                        if (callback)
                            callback.call(self);
                    });
                    this.transitionQueue._beforeTransition(TransitionType.value);
                    this.settings.changeValueFunc(this.barWrapper, this.bar, myValue);
                }
            }
        }
    };
    /**
     *      * increments the value by a random value but never reaches 100%
     * taken from https://github.com/rstacruz/nprogress/blob/master/nprogress.js
     * @param callback called when the value is set and the animation has finished
     */
    TinyBar.prototype.inc = function (callback) {
        if (this.value >= 100) {
            return;
        }
        else {
            var amount = 0;
            if (this.value >= 0 && this.value < 25) {
                // Start out between 3 - 6% increments
                amount = (Math.random() * (5 - 3 + 1) + 3) / 100;
            }
            else if (this.value >= 25 && this.value < 65) {
                // increment between 0 - 3%
                amount = (Math.random() * 3) / 100;
            }
            else if (this.value >= 65 && this.value < 90) {
                // increment between 0 - 2%
                amount = (Math.random() * 2) / 100;
            }
            else if (this.value >= 90 && this.value < 99) {
                // finally, increment it .5 %
                amount = 0.005;
            }
            else {
                // after 99%, don't increment:
                amount = 0;
            }
            this._go(this.value + (amount * 100 / 2), callback, true);
        }
    };
    /**
     * finishes the bar
     * @param hideBar true: hide the bar after finishing, false: not
     * @param callback called when the transition has finished
     * when hideBar = true then the callback is called after the hide transition has finished
     * and the value has returned to 0,
     * if hideBar = false then the callback is called after the value transition has finished
     */
    TinyBar.prototype.done = function (hideBar, callback) {
        var _this = this;
        if (hideBar === void 0) { hideBar = true; }
        var self = this;
        this.transitionQueue.valueChangedQueue = [];
        this.transitionQueue.visibilityChangedQueue = [];
        //clear handle if any
        this.clearAutoIncrement();
        var hideFunc = function () {
            //set the value to 0 after the visibility changed to invisible
            // else when we call start the bar would animate from 100 to 0
            self.transitionQueue._executeActionAfterTransition(TransitionType.visibility, function () {
                //do not set the bar status to running...
                //self._go(0,null, hideBar, false)
                setTimeout(function () {
                    self._go(0, function () {
                        if (callback)
                            callback.call(self);
                    }, hideBar);
                }, 100);
            });
            self.transitionQueue._beforeTransition(TransitionType.visibility);
            self.settings.changeBarVisibility(_this.barWrapper, self.bar, false);
        };
        if (this.status === ProgressbarStatus.finished) {
            if (hideBar)
                hideFunc();
            return;
        }
        if (this.value !== 100) {
            //queue because we want to let the value animation finish before hiding the bar
            this.transitionQueue._executeActionAfterTransition(TransitionType.value, function () {
                _this.value = 100;
                self.status = ProgressbarStatus.finished;
                if (hideBar) {
                    //wait until bar is invisible and value returned to 0 then call the callback
                    hideFunc();
                }
                else {
                    //bar wont hide so call the callback now
                    if (callback)
                        callback.call(self);
                }
            });
            this.transitionQueue._beforeTransition(TransitionType.value);
            this.settings.changeValueFunc(this.barWrapper, this.bar, 100);
        }
        else {
            if (hideBar) {
                hideFunc();
            }
        }
    };
    /**
     * starts automatically incrementing the value of the bar (calls .inc in a setInterval loop)
     * @param callback called when the value is set and the animation has finished
     */
    TinyBar.prototype.autoIncrement = function (callback) {
        var _this = this;
        //first clear old increment else we could lose the clear handle for the old increment
        this.clearAutoIncrement();
        this.tricklingHandle = setInterval(function () {
            _this.inc(callback);
        }, this.settings.incrementTimeoutInMs);
    };
    /**
     * clears the auto increment interval
     * @private
     */
    TinyBar.prototype.clearAutoIncrement = function () {
        if (this.tricklingHandle) {
            clearInterval(this.tricklingHandle);
            this.tricklingHandle = null;
        }
    };
    /**
     * returns the value that indicates the value of the tiny bar (relies on this.settings.changeValueElement)
     * @returns {HTMLDivElement} the value that indicates the value of the tiny bar
     * @private
     */
    TinyBar.prototype._getValueChangingElement = function () {
        return this.settings.changeValueElement === BarElement.bar
            ? this.bar : this.barWrapper;
    };
    return TinyBar;
}());
/**
 * a class to handle transition events and (queue) actions
 */
var _TransitioQueue = (function () {
    /**
     * creates a new transition queue
     * @param tinyBar  the connected tiny bar
     */
    function _TransitioQueue(tinyBar) {
        /**
         * the transition state of the tiny bar
         * @type {TransitionState}
         */
        this.valueTransitionState = TransitionState.finished;
        /**
         * the transition state of the tiny bar
         * @type {TransitionState}
         */
        this.visibilityTransitionState = TransitionState.finished;
        /**
         * the change value transition start handler
         * @type {null}
         */
        this.changeValueTransitionStartHandler = null;
        /**
         * the change value transition end handler
         * @type {null}
         */
        this.changeValueTransitionEndHandler = null;
        /**
         * the change visibility transition start handler
         * @type {null}
         */
        this.changeVisibilityTransitionStartHandler = null;
        /**
         * the change visibility transition end handler
         * @type {null}
         */
        this.changeVisibilityTransitionEndHandler = null;
        /**
         * the queue with actions to to when the a value transition has finished
         * (only the first item is used when a transition finished)
         * @type {Array}
         */
        this.valueChangedQueue = [];
        /**
         * the queue with actions to to when the a visibility transition has finished
         * (only the first item is used when a transition finished)
         * @type {Array}
         */
        this.visibilityChangedQueue = [];
        this.tinyBar = tinyBar;
        this._setupQueue();
    }
    /**
     * notifies the queue that a transition is started (no transitionStart event on js)
     * @param transition the transition type
     * @private
     */
    _TransitioQueue.prototype._beforeTransition = function (transition) {
        if (transition === TransitionType.value)
            this.changeValueTransitionStartHandler();
        else if (transition === TransitionType.visibility) {
            this.changeVisibilityTransitionStartHandler();
        }
    };
    /**
     * enqueues an action which should be executed after an transition has started and finished
     * (after finishing the action is executed)
     * @param transition the transition to finish
     * @param action the action to execute
     * @private
     */
    _TransitioQueue.prototype._executeActionAfterTransition = function (transition, action) {
        if (transition === TransitionType.value)
            this.valueChangedQueue.push(action);
        else if (transition === TransitionType.visibility) {
            this.visibilityChangedQueue.push(action);
        }
    };
    /**
     * sets all listeners up
     * @private
     */
    _TransitioQueue.prototype._setupQueue = function () {
        var self = this;
        var transitionEndEvent = 'transitionend'; //transitionend //webkitTransitionEnd
        var changeValueElement = this.tinyBar.settings.changeValueElement === BarElement.bar
            ? this.tinyBar.bar : this.tinyBar.barWrapper;
        this.changeValueTransitionStartHandler = function () {
            self.valueTransitionState = TransitionState.running;
        };
        this.changeValueTransitionEndHandler = function (trans) {
            //only do sth when the right property was transitioned
            if (!self.tinyBar.settings.changeValueProperty //if nully value then allow all
                || trans.propertyName === self.tinyBar.settings.changeValueProperty) {
                self.valueTransitionState = TransitionState.finished;
                if (self.valueChangedQueue.length > 0) {
                    var action = self.valueChangedQueue.shift();
                    action();
                }
            }
        };
        changeValueElement.addEventListener(transitionEndEvent, this.changeValueTransitionEndHandler);
        var changeVisibilityElement = this.tinyBar.settings.changeVisibilityElement === BarElement.bar
            ? this.tinyBar.bar : this.tinyBar.barWrapper;
        this.changeVisibilityTransitionStartHandler = function () {
            self.visibilityTransitionState = TransitionState.running;
        };
        this.changeVisibilityTransitionEndHandler = function (trans) {
            //only do sth when the right property was transitioned
            if (!self.tinyBar.settings.changeVisibilityProperty //if nully value then allow all
                || trans.propertyName === self.tinyBar.settings.changeVisibilityProperty) {
                self.visibilityTransitionState = TransitionState.finished;
                if (self.visibilityChangedQueue.length > 0) {
                    var action = self.visibilityChangedQueue.shift();
                    action();
                }
            }
        };
        changeVisibilityElement.addEventListener(transitionEndEvent, this.changeVisibilityTransitionEndHandler);
    };
    return _TransitioQueue;
}());
var myExport = {
    TinyBar: TinyBar,
    defaultSettings: defaultSettings,
    BarElement: BarElement,
    TransitionState: TransitionState,
    TransitionType: TransitionType,
    ProgressbarStatus: ProgressbarStatus
};

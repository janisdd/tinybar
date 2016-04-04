export declare enum BarElement {
    barWrapper = 0,
    bar = 1,
}
export declare enum TransitionState {
    running = 0,
    finished = 1,
}
export declare enum TransitionType {
    value = 0,
    visibility = 1,
}
export declare enum ProgressbarStatus {
    /**
     * starting value (only once)
     */
    initial = 0,
    /**
     * displayed and 0 <= value < 1 (normally after .start was called)
     */
    started = 1,
    /**
     * displayed and value === 1 (normally after .done was called)
     */
    finished = 2,
}
export interface TransitionEndEvent extends Event {
    target: EventTarget;
    type: string;
    bubbles: boolean;
    cancelable: boolean;
    propertyName: string;
    elapsedTime: number;
    pseudoElement: string;
}
/**
 * a class for the default settings (class because of functions)
 */
export declare class DefaultSettings implements Settings {
    incrementTimeoutInMs: number;
    wrapperCssClasses: any[];
    cssClasses: any[];
    changeValueTransition: string;
    changeVisibilityTransition: string;
    changeValueBackTransition: string;
    height: string;
    wrapperBackgroundColor: string;
    backgroundColor: string;
    boxShadow: string;
    zIndex: string;
    changeValueProperty: any;
    changeValueElement: BarElement;
    changeVisibilityProperty: any;
    changeVisibilityElement: BarElement;
    applyInitialBarWrapperStyle(barWrapperDiv: HTMLDivElement, shouldPositionTopMost: boolean): void;
    extendInitialBarWrapperStyle(barWrapperDiv: HTMLDivElement, shouldPositionTopMost: boolean): void;
    applyInitialBarStyle(barDiv: HTMLDivElement, shouldPositionTopMost: boolean): void;
    extendInitialBarStyle(barDiv: HTMLDivElement, shouldPositionTopMost: boolean): void;
    changeBarVisibility(barWrapperDiv: HTMLDivElement, barDiv: HTMLDivElement, newVisibility: boolean): void;
    changeValueFunc(barWrapperDiv: HTMLDivElement, barDiv: HTMLDivElement, value: number): void;
}
export interface Settings {
    /**
     * the css classes to add the the bar wrapper
     */
    wrapperCssClasses?: string[];
    /**
     * the delay in ms, every tick the .inc method is called
     */
    incrementTimeoutInMs?: number;
    /**
     * the css classes to add to the bar
     */
    cssClasses?: string[];
    /**
     * the transition for the bar when the value changes
     * (must not be empty!)
     */
    changeValueTransition?: string;
    /**
     * the transition for the bar when animating from bigger to smaller value (backwards)
     * (must not be empty!)
     */
    changeValueBackTransition?: string;
    /**
     * the transition for the bar wrapper when the visibility (not the css value) changes e.g. set height to 0
     * (must not be empty!)
     */
    changeVisibilityTransition?: string;
    /**
     * the height of the bar (applied to barWrapper)
     */
    height?: string;
    /**
     * the wrapper background color (applied to barWrapper)
     */
    wrapperBackgroundColor?: string;
    /**
     * the background color (applied to the bar)
     */
    backgroundColor?: string;
    /**
     * the box shadow (applied to the bar)
     */
    boxShadow?: string;
    /**
     * the z index (applied to the barWrapper)
     */
    zIndex?: string;
    /**
     * the property name of the value property (property that changes when the value should change)
     * (default right)
     */
    changeValueProperty?: string;
    /**
     * the element that will used to change the value
     * (default bar)
     */
    changeValueElement?: BarElement;
    /**
     * the property name of the visibility property (property that changes when the visibility should change)
     * (default height)
     */
    changeVisibilityProperty?: string;
    /**
     * the element that will used to change the visibility
     * (default barWrapper)
     */
    changeVisibilityElement?: BarElement;
    /**
     * function that applies the initial style to the bar wrapper (the initial styles)
     * @param barWrapperDiv hte bar wrapper div
     * @param shouldPositionTopMost true: no parent provided position on the top, false: parent provided
     */
    applyInitialBarWrapperStyle?: (barWrapperDiv: HTMLDivElement, shouldPositionTopMost: boolean) => void;
    /**
     * a function that is called after applyInitialBarWrapperStyle to do some minor changes on the bar wrapper style
     * @param barWrapperDiv the bar wrapper
     * @param shouldPositionTopMost true: no parent provided position on the top, false: parent provided
     */
    extendInitialBarWrapperStyle?: (barWrapperDiv: HTMLDivElement, shouldPositionTopMost: boolean) => void;
    /**
     * function that applies the initial style to the bar (the initial styles)
     * @param barDiv the bar div
     * @param shouldPositionTopMost true: no parent provided position on the top, false: parent provided
     */
    applyInitialBarStyle?: (barDiv: HTMLDivElement, shouldPositionTopMost: boolean) => void;
    /**
     *  a function that is called after applyInitialBarStyle to do some minor changes on the bar style
     * @param barDiv the bar
     * @param shouldPositionTopMost true: no parent provided position on the top, false: parent provided
     */
    extendInitialBarStyle?: (barDiv: HTMLDivElement, shouldPositionTopMost: boolean) => void;
    /**
     * function that changes the visibility of the bar (wrapper)
     * @param barWrapperDiv the bar wrapper
     * @param barDiv the bar the bar
     * @param newVisibility true: make visible, false: invisible
     */
    changeBarVisibility?: (barWrapperDiv: HTMLDivElement, barDiv: HTMLDivElement, newVisibility: boolean) => void;
    /**
     * function to change to value of the bar (set the right css values here)
     * @param barWrapperDiv the bar wrapper
     * @param barDiv the bar
     * @param value the new value (0 <= value <= 100)
     */
    changeValueFunc?: (barWrapperDiv: HTMLDivElement, barDiv: HTMLDivElement, value: number) => void;
}
/**
 * the global default (static) settings for a tiny bar
 * @type {DefaultSettings}
 */
export declare var defaultSettings: DefaultSettings;
/**
 * a tiny (progress) bar
 */
export declare class TinyBar {
    /**
     * just the version
     * @type {string}
     */
    version: string;
    /**
     * the project name ... used for output
     * @type {string}
     */
    projectName: string;
    /**
     * the settings of the current progressbar
     * @type {DefaultSettings}
     */
    settings: Settings;
    /**
     * the current status of the progressbar (initial | started | finished)
     * @type {ProgressbarStatus}
     */
    status: ProgressbarStatus;
    /**
     * the current value of the progressbar
     * @type {number}
     */
    value: number;
    /**
     * true: no parent provided so position on the top, false: parent id present
     * @type {boolean}
     */
    shouldPositionTopMost: boolean;
    /**
     * the html div that represents the bar wrapper
     * @type {null}
     */
    barWrapper: HTMLDivElement;
    /**
     * the html div element represents the bar
     * @type {null}
     */
    bar: HTMLDivElement;
    /**
     * a queue to help with the transition events
     * @type {null}
     */
    transitionQueue: _TransitioQueue;
    /**
     * used to store the handle for the interval cleanup when incrementing to infinity
     * @type {null}
     */
    tricklingHandle: any;
    /**
     * creates a new tiny (progress) bar
     * @param htmlParentDivId the parent div id or null (to position the progressbar on the top
     * @param settings the settings for the new tiny bar
     * @param domElementsCreatedCallback  called when the bar and bar wrapper are created and inserted in the dom
     */
    constructor(htmlParentDivId?: string, settings?: Settings, domElementsCreatedCallback?: () => void);
    /**
     * appends the html for the bar and the bar wrapper (applies the initial state
     * @param parentHtmlElement the parent element where the tiny bar should be inserted (through appendChild)
     * @param positionTopMost true: no parent provided position on the top, false: parent provided
     * @param domElementsCreatedCallback called when the bar and bar wrapper are created and inserted in the dom
     * @private
     */
    private _createBar(parentHtmlElement, positionTopMost, domElementsCreatedCallback);
    /**
     * sets the settings for this bar (call only once per setup ... when called a second time the
     * settings from the first call are deleted)
     * @param settings the settings
     * @returns {TinyBar} the bar
     */
    private _setSettings(settings);
    /**
     * starts the bar and shows it
     */
    start(startingValue?: number): this;
    /**
     * goes to the given percentage (0 <= percentage <= 100)
     * @param value the value between 0 and 100 to go to
     * @param hideBarWhenFinished when value >= 100 then the done method is called with this parameter as argument
     * @param callback called when the animation has finished
     */
    go(value: number, hideBarWhenFinished?: boolean, callback?: () => void): void;
    /**
     * goes to the given percentage (0 <= percentage <= 100)
     * @param value the value between 0 and 100 to go to
     * @param callback called when the animation has finished
     * @param hideBarWhenFinished when value >= 100 then the done method is called with this parameter as argument
     * @param setBarStatus true: set the bar status to running, false: do not touch the bar status
     * @private
     */
    _go(value: number, callback: () => void, hideBarWhenFinished: boolean): void;
    /**
     * increments the value by a random value but never reaches 100%
     * taken from https://github.com/rstacruz/nprogress/blob/master/nprogress.js
     */
    inc(callback?: () => void): void;
    /**
     * finishes the bar
     * @param hideBar true: hide the bar after finishing, false: not
     * @param callback called when the transition has finished
     * when hideBar = true then the callback is called after the hide transition has finished
     * and the value has returned to 0,
     * if hideBar = false then the callback is called after the value transition has finished
     */
    done(hideBar?: boolean, callback?: () => void): void;
    /**
     * starts automatically incrementing the value of the bar (calls .inc in a setInterval loop)
     */
    autoIncrement(): void;
    /**
     * clears the auto increment interval
     * @private
     */
    clearAutoIncrement(): void;
    /**
     * returns the value that indicates the value of the tiny bar (relies on this.settings.changeValueElement)
     * @returns {HTMLDivElement} the value that indicates the value of the tiny bar
     * @private
     */
    _getValueChangingElement(): HTMLDivElement;
}
/**
 * a class to handle transition events and (queue) actions
 */
export declare class _TransitioQueue {
    /**
     * the related tiny bar
     */
    tinyBar: TinyBar;
    /**
     * the transition state of the tiny bar
     * @type {TransitionState}
     */
    valueTransitionState: TransitionState;
    /**
     * the transition state of the tiny bar
     * @type {TransitionState}
     */
    visibilityTransitionState: TransitionState;
    /**
     * the change value transition start handler
     * @type {null}
     */
    changeValueTransitionStartHandler: () => void;
    /**
     * the change value transition end handler
     * @type {null}
     */
    changeValueTransitionEndHandler: (transition: TransitionEndEvent) => void;
    /**
     * the change visibility transition start handler
     * @type {null}
     */
    changeVisibilityTransitionStartHandler: () => void;
    /**
     * the change visibility transition end handler
     * @type {null}
     */
    changeVisibilityTransitionEndHandler: (transition: TransitionEndEvent) => void;
    /**
     * the queue with actions to to when the a value transition has finished
     * (only the first item is used when a transition finished)
     * @type {Array}
     */
    valueChangedQueue: Array<() => void>;
    /**
     * the queue with actions to to when the a visibility transition has finished
     * (only the first item is used when a transition finished)
     * @type {Array}
     */
    visibilityChangedQueue: Array<() => void>;
    /**
     * creates a new transition queue
     * @param tinyBar  the connected tiny bar
     */
    constructor(tinyBar: TinyBar);
    /**
     * notifies the queue that a transition is started (no transitionStart event on js)
     * @param transition the transition type
     * @private
     */
    _beforeTransition(transition: TransitionType): void;
    /**
     * enqueues an action which should be executed after an transition has started and finished
     * (after finishing the action is executed)
     * @param transition the transition to finish
     * @param action the action to execute
     * @private
     */
    _executeActionAfterTransition(transition: TransitionType, action: () => void): void;
    /**
     * sets all listeners up
     * @private
     */
    _setupQueue(): void;
}
export interface MyExport {
    TinyBar: Function;
    defaultSettings: Settings;
}

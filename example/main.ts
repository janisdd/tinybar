

import {TinyBar, MyExport} from "./js/tinyBar";
/**
 * Created by janis dähne
 */

declare var require
//import TinyBar = require('../src/tinyBar')

///<reference path="js/tinyBar.d.ts"/>


var Tiny: MyExport = require('./js/tinyBar')
//import Tiny = require('./js/tinyBar')
console.log(Tiny)

Tiny.defaultSettings.extendInitialBarStyle = (barDiv: HTMLDivElement, topmost: boolean) => {
    barDiv.style.left = '100%'
    barDiv.style.right = '0'
}

Tiny.defaultSettings.changeValueFunc = (barWrapperDiv:HTMLDivElement, barDiv:HTMLDivElement, value:number) => {
    barDiv.style.left = (100 - value) + '%'
}



//let tinyProgress2 = new TinyProgress.TinyBar() //'top-test'
//tinyProgress2.start(true)

let tinyProgress = new Tiny.TinyBar('top-test', {
    backgroundColor: 'red',
    //changeValueFunc: (barWrapperDiv:HTMLDivElement, barDiv:HTMLDivElement, value:number) => {barDiv.style.left = (100 - value) + '%'},
    //height: '1em'
}) //'top-test'


/*
setTimeout(() => {
    tinyProgress.go(10)
}, 1000)

setTimeout(() => {
    tinyProgress.go(20)
}, 2000)


setTimeout(() => {
    tinyProgress.go(50)
}, 3000)
*/

window.gotoStart = function () {
    /*
    tinyProgress.start(false).done(true, () => {
        console.log('bar is done!')
    })*/
    tinyProgress.start()
}

window.gotoStart2 = function () {
    //this wont work
    /*
    tinyProgress.start(true).done(false, () => {
        console.log('bar is done!')
    })*/

    tinyProgress.start().autoIncrement()
}


window.goto20 = function() {
    tinyProgress.go(20)
}

window.goto80 = function() {

    //tinyProgress.start()

    tinyProgress.go(80)
    /*
    tinyProgress.startAutoIncrement()

    setTimeout(() => {
        tinyProgress.clearAutoIncrement()
    }, 3000)
    */

}
window.gotoDone = function() {
    tinyProgress.done()
}

window.gotoDoneStay = function() {
    tinyProgress.done(false)
}

window.gotoTrickle = function () {
    tinyProgress.inc()
}
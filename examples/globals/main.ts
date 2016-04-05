'use strict'

declare var TinyBar
var Tiny: TinyBarExport = TinyBar

class Example1 {
    
    el = 'ex1'
    bar = new Tiny.TinyBar()
    
    start() {
        this.bar.start()
    }
    
    go(percentage) {
        this.bar.go(percentage)
    }
    
    done() {
        this.bar.done()
    }
}

var ex1 = new Example1()


class Example2 {

    el = 'ex2'
    bar = null
    
    constructor() {
        this.bar = new Tiny.TinyBar(this.el, {
            backgroundColor: 'red',
            height: '4px'
        })
    }

    start() {
        this.bar.start().autoIncrement()
    }

    go(percentage) {
        this.bar.go(percentage)
    }

    clearAutoIncrement() {
        this.bar.clearAutoIncrement()
    }

    done() {
        this.bar.done()
    }
}
var ex2 = new Example2()


class Example3 {

    el = 'ex3'
    bar = null

    constructor() {
        this.bar = new Tiny.TinyBar(this.el, {
            backgroundColor: 'green',
            height: '4px',
            boxShadow: '',
            changeVisibilityElement: Tiny.BarElement.bar,
            changeVisibilityProperty: 'bottom',
            changeBarVisibility(barWrapperDiv:HTMLDivElement, barDiv:HTMLDivElement, newVisibility:boolean) {
                if (newVisibility) {

                    barDiv.style.bottom = '0'

                } else {
                    barDiv.style.bottom = '100%'
                }
            }
        })
    }

    start() {
        this.bar.start().autoIncrement()
    }

    go(percentage) {
        this.bar.go(percentage)
    }

    clearAutoIncrement() {
        this.bar.clearAutoIncrement()
    }

    done() {
        this.bar.done()
    }
}
var ex3 = new Example3()


class Example4 {

    el = 'ex4'
    bar = null

    constructor() {
        this.bar = new Tiny.TinyBar(this.el, {
            backgroundColor: 'orange',
            boxShadow: ''
        })
    }

    start() {
        this.bar.start()
    }
    inc() {
        this.bar.inc()
    }
    done() {
        this.bar.done()
    }
}
var ex4 = new Example4()


class Example5 {

    el = 'ex5'
    bar = null

    constructor() {
        this.bar = new Tiny.TinyBar(this.el, {
            extendInitialBarStyle(barDiv:HTMLDivElement, shouldPositionTopMost:boolean) {
                barDiv.style.right = '0'
                barDiv.style.left = '100%'
            },
            changeValueFunc(barWrapperDiv:HTMLDivElement, barDiv:HTMLDivElement, value:number) {
                barDiv.style.left = (100 - value) + '%'
            }
        })
    }

    start() {
        this.bar.start().autoIncrement()
    }

    inc() {
        this.bar.inc()
    }

    done() {
        this.bar.done()
    }
}
var ex5 = new Example5()



class Example6 {

    el = 'ex6'
    bar = null

    constructor() {
        this.bar = new Tiny.TinyBar(this.el)
    }

    start() {
        this.bar.start().autoIncrement()
    }
    done(hideBar: boolean) {
        this.bar.done(hideBar)
    }
}
var ex6 = new Example6()
'use strict';
var Tiny = TinyBar;
var Example1 = (function () {
    function Example1() {
        this.el = 'ex1';
        this.bar = new Tiny.TinyBar();
    }
    Example1.prototype.start = function () {
        this.bar.start();
    };
    Example1.prototype.go = function (percentage) {
        this.bar.go(percentage, function () {
            console.log(this);
        });
    };
    Example1.prototype.done = function () {
        this.bar.done();
    };
    return Example1;
}());
var ex1 = new Example1();
var Example2 = (function () {
    function Example2() {
        this.el = 'ex2';
        this.bar = null;
        this.bar = new Tiny.TinyBar(this.el, {
            backgroundColor: 'red',
            height: '4px'
        });
    }
    Example2.prototype.start = function () {
        this.bar.start().autoIncrement();
    };
    Example2.prototype.go = function (percentage) {
        this.bar.go(percentage);
    };
    Example2.prototype.clearAutoIncrement = function () {
        this.bar.clearAutoIncrement();
    };
    Example2.prototype.done = function () {
        this.bar.done();
    };
    return Example2;
}());
var ex2 = new Example2();
var Example3 = (function () {
    function Example3() {
        this.el = 'ex3';
        this.bar = null;
        this.bar = new Tiny.TinyBar(this.el, {
            backgroundColor: 'orange',
            height: '4px',
            boxShadow: '',
            changeVisibilityElement: Tiny.BarElement.bar,
            changeVisibilityProperty: 'bottom',
            changeBarVisibility: function (barWrapperDiv, barDiv, newVisibility) {
                if (newVisibility) {
                    barDiv.style.bottom = '0';
                }
                else {
                    barDiv.style.bottom = '100%';
                }
            }
        });
    }
    Example3.prototype.start = function () {
        this.bar.start().autoIncrement();
    };
    Example3.prototype.go = function (percentage) {
        this.bar.go(percentage);
    };
    Example3.prototype.clearAutoIncrement = function () {
        this.bar.clearAutoIncrement();
    };
    Example3.prototype.done = function () {
        this.bar.done();
    };
    return Example3;
}());
var ex3 = new Example3();
/*
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
*/
var Example5 = (function () {
    function Example5() {
        this.el = 'ex5';
        this.bar = null;
        this.bar = new Tiny.TinyBar({
            extendInitialBarStyle: function (barDiv, shouldPositionTopMost) {
                barDiv.style.right = '0';
                barDiv.style.left = '100%';
            },
            changeValueFunc: function (barWrapperDiv, barDiv, value) {
                barDiv.style.left = (100 - value) + '%';
            }
        }, this.el);
    }
    Example5.prototype.start = function () {
        this.bar.start().autoIncrement();
    };
    Example5.prototype.inc = function () {
        this.bar.inc();
    };
    Example5.prototype.done = function () {
        this.bar.done();
    };
    return Example5;
}());
var ex5 = new Example5();
var Example6 = (function () {
    function Example6() {
        this.el = 'ex6';
        this.bar = null;
        this.bar = new Tiny.TinyBar(this.el);
    }
    Example6.prototype.start = function () {
        this.bar.start().autoIncrement();
    };
    Example6.prototype.auto = function () {
        this.bar.autoIncrement();
    };
    Example6.prototype.go = function (value) {
        this.bar.go(value);
    };
    Example6.prototype.done = function (hideBar) {
        this.bar.done(hideBar);
    };
    return Example6;
}());
var ex6 = new Example6();
var Example7 = (function () {
    function Example7() {
        this.el = 'ex7';
        this.bar = null;
        this.func = function () {
            document.getElementById('ex7Status').innerText = this.value + ' status: ' + this.status;
        };
        this.bar = new Tiny.TinyBar(this.el);
    }
    Example7.prototype.start = function () {
        this.bar.start().autoIncrement(this.func);
    };
    Example7.prototype.go = function (value) {
        this.bar.go(value, this.func);
    };
    Example7.prototype.clear = function () {
        this.bar.clearAutoIncrement();
    };
    Example7.prototype.done = function () {
        this.bar.done(true, this.func);
    };
    return Example7;
}());
var ex7 = new Example7();
var Example8 = (function () {
    function Example8() {
        this.el = 'ex8';
        this.bar = null;
        this.bar = new Tiny.TinyBar(this.el);
    }
    Example8.prototype.start = function () {
        var self = this;
        this.bar.start(10, function () {
            self.bar.go(20, function () {
                self.bar.go(50, function () {
                    self.bar.go(70, function () {
                        self.bar.go(90, function () {
                            self.bar.go(100);
                        });
                    });
                });
            });
        });
    };
    return Example8;
}());
var ex8 = new Example8();

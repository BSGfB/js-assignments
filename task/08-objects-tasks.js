'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
    this.width   = width;
    this.height  = height;
}

Rectangle.prototype.getArea = function() {
    return this.width * this.height;
};


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
    return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
    return Object.setPrototypeOf(JSON.parse(json), proto);
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

function CssSelector() {
    this.elementItem = null;
    this.idItem = null;
    this.classItems = [];
    this.attrItems = [];
    this.pseudoClassItems = [];
    this.pseudoElementItem = null;
    this.multipleDataItem = [3, 4, 5];
    this.rank = 0;
}

CssSelector.prototype = {
    checkRules: function (stageIndex) {
        if (this.rank === stageIndex && this.multipleDataItem.indexOf(stageIndex) === -1)
            throw new Error("Element, id and pseudo-element should not occur more then one time inside the selector");

        if (stageIndex < this.rank)
            throw new Error("Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element");
    },

    element: function (value) {
        this.checkRules(1);
        this.rank = 1;
        this.elementItem = value;

        return this;
    },

    id: function (value) {
        this.checkRules(2);
        this.rank = 2;
        this.idItem = value;

        return this;
    },

    class: function (value) {
        this.checkRules(3);
        this.rank = 3;
        this.classItems.push(value);

        return this;
    },

    attr: function (value) {
        this.checkRules(4);
        this.rank = 4;
        this.attrItems.push(value);

        return this;
    },

    pseudoClass: function (value) {
        this.checkRules(5);
        this.rank = 5;
        this.pseudoClassItems.push(value);

        return this;
    },

    pseudoElement: function (value) {
        this.checkRules(6);
        this.rank = 6;
        this.pseudoElementItem = value;

        return this;
    },

    toString: function (items, before, after) {
        items = items || [];

        if (!Array.isArray(items) && items !== null)
            items = [items];

        return items.reduce((prev, curr) => prev + before + curr + after, "");
    },

    stringify: function () {
        return this.toString(this.elementItem, "", "") +
            this.toString(this.idItem, "#", "") +
            this.toString(this.classItems, ".", "") +
            this.toString(this.attrItems, "[", "]") +
            this.toString(this.pseudoClassItems, ":", "") +
            this.toString(this.pseudoElementItem, "::", "");
    }
};

function CssSelectorCombinator(selector1, combinator, selector2) {
    this.selector1 = selector1;
    this.selector2 = selector2;
    this.combinator = combinator;

}

CssSelectorCombinator.prototype = {
    stringify: function () {
        return this.selector1.stringify() + " " + this.combinator + " " + this.selector2.stringify();
    }
};


const cssSelectorBuilder = {

    element: function(value) {
        return new CssSelector().element(value)
    },

    id: function(value) {
        return new CssSelector().id(value)
    },

    class: function(value) {
        return new CssSelector().class(value)
    },

    attr: function(value) {
        return new CssSelector().attr(value)
    },

    pseudoClass: function(value) {
        return new CssSelector().pseudoClass(value)
    },

    pseudoElement: function(value) {
        return new CssSelector().pseudoElement(value)
    },

    combine: function(selector1, combinator, selector2) {
        return new CssSelectorCombinator(selector1, combinator, selector2)
    }
};


module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};

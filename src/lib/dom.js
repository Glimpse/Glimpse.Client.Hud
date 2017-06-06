module.exports = {
    hasClass: function(el, className) {
        return el.classList
            ? el.classList.contains(className)
            : new RegExp('\\b' + className + '\\b').test(el.className);
    },
    addClass: function(el, className) {
        if (el.classList) {
            el.classList.add(className);
        }
        else if (!hasClass(el, className)) {
            el.className += ' ' + className;
        }
    },
    removeClass: function(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        }
        else {
            el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
        }
    }
}

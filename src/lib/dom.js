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
        else if (!module.exports.hasClass(el, className)) {
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
    },
    createElement: function(html) {
        var div = document.createElement('div');
        div.innerHTML = html.trim();
        return div.firstChild;
    }
}

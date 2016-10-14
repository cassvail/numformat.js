(function(factory) {

    // Establish the root object, `window` (`self`) in the browser, or `global` on the server.
    // We use `self` instead of `window` for `WebWorker` support.
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    // Set up nf appropriately for the environment. Start with AMD.
    if (typeof define === 'function' && define.amd) {
        define(['exports'], function(exports) {
            // Export global even in AMD case in case this script is loaded with
            // others that may still expect a global nf.
            root.nf = factory(root, exports);
        });

        // Next for Node.js or CommonJS. jQuery may not be needed as a module.
    } else if (typeof exports !== 'undefined') {
        factory(root, exports);

        // Finally, as a browser global.
    } else {
        root.nf = factory(root, {});
    }

}(function(root, nf) {

    //--utilities
    function clone(o) {
        var out, v, key;
        out = Array.isArray(o) ? [] : {};
        for (key in o) {
            v = o[key];
            out[key] = (typeof v === "object") ? clone(v) : v;
        }
        return out;
    }

    function extend(o, ox) {
        if(!ox) return o;

        for(var key in ox) {
            if(ox[key] != null) o[key] = ox[key];
        }
        return o;
    }

    function escapeRegexp(s) {
        return String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    //--from //https://github.com/component/pad
    function pad(str, len, c) {
        c = c || ' ';
        if (str.length >= len) return str;
        len = len - str.length;
        var left = new Array(Math.ceil(len / 2) + 1).join(c);
        var right = new Array(Math.floor(len / 2) + 1).join(c);
        return left + str + right;
    }

    function padLeft(str, len, c){
        c = c || ' ';
        if (str.length >= len) return str;
        return new Array(len - str.length + 1).join(c) + str;
    }

    function padRight(str, len, c){
        c = c || ' ';
        if (str.length >= len) return str;
        return str + new Array(len - str.length + 1).join(c);
    }
    //--

    var defaultLanguageSettings = {
        integer: {
            decimalPlaces: 0, //%d
            decimalSeparator: '.', //%s
            thousandSeparator: ',',
            currencySymbol: '', //%c
            negativeSymbol: '-', //%n
            pattern: '%n%i%s%d%c',
            emptyValue: '',
            toFixed: true
        },
        number: {
            decimalPlaces: 2,
            decimalSeparator: '.',
            thousandSeparator: ',',
            currencySymbol: '',
            negativeSymbol: '-',
            pattern: '%n%i%s%d%c',
            emptyValue: '',
            toFixed: true
        },
        currency: {
            decimalPlaces: 2,
            decimalSeparator: '.',
            thousandSeparator: ',',
            currencySymbol: '$',
            negativeSymbol: '-',
            pattern: '%n%i%s%d%c',
            emptyValue: '',
            toFixed: true
        }
    };

    nf.languages = {};

    nf.loadLanguage = function(language, languageSettings) {
        var currentLanguage = extendSettings(cloneSettings(defaultLanguageSettings), nf.languages[language] || {});
        nf.languages[language] = extendSettings(currentLanguage, languageSettings);
        nf.language = language;
    };

    nf.loadLanguage('en', {});

    function cloneSettings(settings) {
        return {
            integer: clone(settings.integer),
            number: clone(settings.number),
            currency: clone(settings.currency)
        };
    }

    function extendSettings(settings, xsettings) {
        extend(settings.integer, xsettings.integer);
        extend(settings.number, xsettings.number);
        extend(settings.currency, xsettings.currency);
        return settings;
    }

    function getOptions(type, language) {
        var currentLanguage = language ? language : nf.language;
        if(nf.languages[currentLanguage] instanceof Object) {
            return clone(nf.languages[currentLanguage][type]);
        }
        else {
            return cloneSettings(defaultLanguageSettings);
        }
    }

    function toFixedValue(value, decimalPlaces) {
        // return parseFloat(Math.round(value * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces))
        return parseFloat(value).toFixed(decimalPlaces);
    }

    nf.formatNumber = function(value, options)
    {
        var opts = getOptions('number');
        extend(opts, options);

        value += '';

        //handling ".123"
        if(value.charAt(0) == '.') value = '0' + value;

        //handling "-.123"
        if(value.charAt(0) == '-' && value.charAt(1) == '.' ) {
            value.replace('.','0.');
        }

        value = parseFloat(value);

        if(isNaN(value) || value == 0) {
            value = opts.emptyValue;
        } else {
            //rounding decimals
            if(opts.toFixed) value = toFixedValue(value, opts.decimalPlaces);
            value += '';

            var sign = '';
            if(value.indexOf('-') >= 0) {
                sign = opts.negativeSymbol;
                value = value.replace(/-/g,'');
            }

            var leftPart = '';
            var valueArray = value.split('.');
            var left = valueArray[0];
            var right = valueArray[1] ? valueArray[1] : '';

            var decimalSeparator = '';
            if(opts.decimalPlaces > 0) {
                decimalSeparator = opts.decimalSeparator;
                if(opts.toFixed) right = padRight(right, opts.decimalPlaces, '0');
                else if(right.length == 0) decimalSeparator = ''; //remove decimalSeparator when handling integer without toFixed
            }

            if(opts.thousandSeparator != null && opts.thousandSeparator !== '') {
                while (left.length > 3) {
                    var l = left.substr(0, left.length-3);
                    var r = left.substr(left.length-3, left.length-1);

                    left = l + opts.thousandSeparator + r;
                    leftPart = opts.thousandSeparator + r + leftPart;

                    left = left.substr(0, left.indexOf(opts.thousandSeparator)).toString();
                }
            } else {
                leftPart = '';
            }
            leftPart = left + leftPart;

            value = opts.pattern
                        .replace(new RegExp('%n'), sign)
                        .replace(new RegExp('%i'), leftPart)
                        .replace(new RegExp('%s'), decimalSeparator)
                        .replace(new RegExp('%d'), right)
                        .replace(new RegExp('%c'), opts.currencySymbol);
            // value = ((leftPart != '') ? leftPart : left )+ right;
        }

        return value;
    };


    nf.unformatNumber = function(value, options, toFixed)
    {
        //TODO use options.pattern to unformat?
        var opts = getOptions('number');
        extend(opts, options);

        value += '';
        value = value.replace(new RegExp(escapeRegexp(opts.thousandSeparator), 'g'), '')
                     .replace(new RegExp(escapeRegexp(opts.currencySymbol), 'g'), '')
                     .replace(new RegExp(escapeRegexp(opts.decimalSeparator), 'g'), '.')
                     .replace(new RegExp(escapeRegexp(opts.negativeSymbol)), '-')
                     .replace(/[\s]/g, '');

        var floatValue = parseFloat(value);

        if(isNaN(floatValue)) {
            if(value.match(new RegExp(escapeRegexp(opts.emptyValue)))) {
                return 0;
            } else {
                return null;
            }
        } else if(toFixed == true) {
            return toFixedValue(floatValue, opts.decimalPlaces);
        } else {
            return parseFloat(floatValue);
        }
    };

    nf.formatInteger = function(value, options)
    {
        var opts = getOptions('integer');
        extend(opts, options);

        return nf.formatNumber(value, opts);
    };

    nf.unformatInteger = function(value, options)
    {
        var opts = getOptions('integer');
        extend(opts, options);

        value = parseInt(nf.unformatNumber(value, opts), 10);
        if(isNaN(value)) return 0;
        else return value;
    };

    nf.formatCurrency = function (value, options)
    {
        var opts = getOptions('currency');
        extend(opts, options);

        return nf.formatNumber(value, opts);
    };

    nf.unformatCurrency = nf.parseCurrency = function (value, options, toFixed)
    {
        var opts = getOptions('currency');
        extend(opts, options);

        return nf.unformatNumber(value, opts, toFixed);
    };

    return nf;
}));
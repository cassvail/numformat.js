# numformat.js

[![Build Status](https://travis-ci.org/cassvail/numformat.js.svg?branch=master)](https://travis-ci.org/cassvail/numformat.js)

**numformat.js** is a tiny JavaScript library for number, decimal, integer, money and currency formatting/unformatting.  

The library allows two way format and unformat function with custom symbols and patterns.  
The unformat functions use the original format options to parse formatted values.

The library is lightweight and works great client-side or server-side.  

## Install

NPM

```
npm install numformat.js
```

Bower

```
bower install numformat.js
```

## How to use

```
var nf = require('numformat.js');
```

###format Functions

* **value** integer/float value to format
* **options** override default language options [see available options]

####formatCurrency
```
//value = 1234.123
var formattedString = nf.formatCurrency(value [, options]); //1,234.12$
```

####formatNumber
```
//value = 1234.567
var formattedString = nf.formatNumber(value [, options]); //1,234.12
```

####formatInteger
```
//value = 1234.123
var formattedString = nf.formatInteger(value [, options]); //1,234
```

---

###unformat Functions

* **value** integer/float value to format
* **options** override default language options [see available options]
* **toFixed**
    * **false** [default] unformat functions do not apply a fixed number of decimal places to the unformatted value
    * **true** use *decimalPlaces* option to apply a fixed number of decimal places to the unformatted value

####unformatCurrency
```
//value="1,234.123$"
var floatValue = nf.unformatNumber(value [, options] [, toFixed=false]); //1234.123
```

####unformatNumber
```
//value="1,234.123"
var floatValue = nf.unformatNumber(value [, options] [, toFixed=false]); //1234.123
```

####unformatInteger
```
//value="1,234.123"
var intValue = nf.unformatInteger(value [, options] [, toFixed=false]); //1234
```

---

###available options 

* *decimalPlaces* - decimal places
* *decimalSeparator*  - decimal separator symbol
* *thousandSeparator* - thousand separator symbol
* *currencySymbol* - currency symbol
* *negativeSymbol* - negative symbol
* *pattern* - pattern used to replace placeholders with number and symbol parts
    * *%n* - negative symbol placeholder
    * *%i* - integer part placeholder
    * *%s* - decimal separator placeholder
    * *%d* - decimal part placeholder
    * *%c* - currency symbol placeholder
* *emptyValue* - value to return when the value is empty
* *toFixed* - [only format functions]
    * **true** [default] format functions apply fixed number of *decimalPlaces*
    * **false** format functions ignore *decimalPlaces* option


##Localization

A few locale files are available in */i18n* folder.  
Locale can be dinamically customized by adding and completely/partially overriding existing ones, using the **loadLanguage** method:

```
nf.loadLanguage('en', {
  integer: {
      decimalPlaces: 0,
      decimalSeparator: '.',
      thousandSeparator: ',',
      currencySymbol: '',
      negativeSymbol: '-',
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
});

```
**loadLanguage** immediately sets the **current language** to the loaded language key.  
To manually set the current language use:

```
nf.language = 'en';
```

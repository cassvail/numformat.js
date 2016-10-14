nf.loadLanguage('it', {
    integer: {
        decimalPlaces: 0, //%d
        decimalSeparator: ',', //%s
        thousandSeparator: ' ',
        currencySymbol: '', //%c
        negativeSymbol: '-', //%n
        pattern: '%n%i%s%d%c',
        emptyValue : '',
        toFixed: true
    },
    number: {
        decimalPlaces: 2,
        decimalSeparator: ',',
        thousandSeparator: ' ',
        currencySymbol: '',
        negativeSymbol: '-',
        pattern: '%n%i%s%d%c',
        emptyValue : '',
        toFixed: true
    },
    currency: {
        decimalPlaces: 2,
        decimalSeparator: ',',
        thousandSeparator: ' ',
        currencySymbol: '€',
        negativeSymbol: '-',
        pattern: '%n%i%s%d%c',
        emptyValue : '',
        toFixed: true
    }
});
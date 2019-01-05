var assert = require('assert');
var nf = require('../numformat.js');

describe('numformat', function() {

    describe('#formatNumber()', function() {

        it('should format thousands', function() {
            assert.equal(nf.formatNumber(1234567.123), '1,234,567.12');
        });

        it('should convert string to float', function() {
            assert.equal(nf.formatNumber('1234567.123'), '1,234,567.12');
        });

        it('should return float when passing integer values', function() {
            assert.equal(nf.formatNumber(123), '123.00');
        });

        it('should format zero', function() {
            assert.equal(nf.formatNumber(0), '');
        });

        it('should format zero values with lower precision', function() {
            assert.equal(nf.formatNumber(-0.0001), '');
        });

        it('should format decimal', function() {
            assert.equal(nf.formatNumber(0.123), '0.12');
        });

        it('should format decimal with leading .', function() {
            assert.equal(nf.formatNumber(0.123), '0.12');
        });

        it('should format decimal rounding', function() {
            assert.equal(nf.formatNumber(1.345), '1.35');
        });

        it('should format negative decimal rounding', function() {
            assert.equal(nf.formatNumber(-1.345), '-1.35');
        });
    });

    describe('#unformatNumber()', function() {

        it('should convert string to float', function() {
            assert.equal(nf.unformatNumber('1234567.12'), 1234567.12);
        });

        it('should return decimals ignoring toFixed', function() {
            assert.equal(nf.unformatNumber('123.345'), 123.345);
        });

        it('should return float when passing integer values', function() {
            assert.equal(nf.unformatNumber('123'), 123.00);
        });

        it('should unformat zero', function() {
            assert.equal(nf.formatNumber(''), 0);
            assert.equal(nf.formatNumber('.'), 0);
            assert.equal(nf.formatNumber(','), 0);
            assert.equal(nf.formatNumber('0'), 0);
            assert.equal(nf.formatNumber('0.00'), 0);
        });

    });

    describe('#formatCurrency()', function() {

        it('should return currency format', function() {
            assert.equal(nf.formatCurrency(123456.123), '123,456.12$');
        });

        it('should allow symbol override', function() {
            assert.equal(nf.formatCurrency(123456.123, {currencySymbol: '€'}), '123,456.12€');
        });

    });

    describe('#unformatCurrency()', function() {

        it('should return currency value', function() {
            assert.equal(nf.unformatCurrency('123,456.123$'), 123456.123);
        });

        it('should allow symbol override', function() {
            assert.equal(nf.unformatCurrency('123,456.123€', {currencySymbol: '€'}), 123456.123);
        });

    });

    describe('#formatInteger()', function() {

        it('should return int when passing decimal values', function() {
            assert.equal(nf.formatInteger(123.345), 123);
        });

        it('should return formatted int when passing decimal values', function() {
            assert.equal(nf.formatInteger(123456.123), '123,456');
        });

        it('should format Numeric after Integer (not overriding settings)', function() {
            assert.equal(nf.formatNumber(1.234), '1.23');
        });
    });

    describe('#unformatInteger()', function() {

        it('should return int when passing decimal values', function() {
            assert.equal(nf.unformatInteger('123.456'), 123);
        });

        it('should return formatted int when passing decimal values', function() {
            assert.equal(nf.unformatInteger('123,456.123'), 123456);
        });
    });

    var overrideOptions = {
        decimalPlaces: 1,
        thousandSeparator: '*',
        decimalSeparator: '-',
        currencySymbol: '=',
        negativeSymbol: 'nn',
        pattern: '%c %n %i%s%d',
        emptyValue: 'ZERO',
        toFixed: false
    };

    describe('#format*', function () {

        it('should allow overriding options with negative value', function() {
            assert.equal(nf.formatNumber(-1234567.123, overrideOptions), '= nn 1*234*567-123');
        });

        it('should allow overriding options with positive value', function() {
            assert.equal(nf.formatNumber(1234567.123, overrideOptions), '=  1*234*567-123');
        });

        it('should allow overriding option toFixed and round decimal', function() {
            assert.equal(nf.formatNumber(1234567.456, overrideOptions), '=  1*234*567-456');
        });

        it('should return clean integer when passing only int part and toFixed is disabled', function() {
            assert.equal(nf.formatNumber(123.00, overrideOptions), '=  123');
        });

        it('should allow overriding options and format zero', function() {
            assert.equal(nf.formatNumber(0, overrideOptions), 'ZERO');
        });
    });

    describe('#unformat*', function () {

        it('should allow overriding options with negative value', function() {
            assert.equal(nf.unformatNumber('= nn 1*234*567-123', overrideOptions), -1234567.123);
        });

        it('should allow overriding options with positive value', function() {
            assert.equal(nf.unformatNumber('= 1*234*567-123', overrideOptions), 1234567.123 );
        });

        it('should allow overriding options and round decimal with toFixed parameter', function() {
            assert.equal(nf.unformatNumber('= nn 1*234*567-456', overrideOptions, true), -1234567.5);
        });

        it('should allow overriding options and format zero', function() {
            assert.equal(nf.unformatNumber('ZERO ', overrideOptions), 0);
        });
    });
});
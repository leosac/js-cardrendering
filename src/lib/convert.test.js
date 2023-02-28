import {describe, expect, test} from '@jest/globals';
import * as convert from './convert';

describe('convert.js', () => {
    describe('decimalToHexColor', () => {
        test('should return 4281CD with decimal 4358605', () => {
            expect(convert.decimalToHexColor(4358605)).toBe("#4281CD");
        });
    });
    describe('hexColorToSignedNumber', () => {
        test('should return 4358605 with decimal 4281CD', () => {
            expect(convert.hexColorToSignedNumber(Number("0x4281CD"), 0)).toBe(4358605);
        });

        test('should return 4358605 with string #4281CD', () => {
            expect(convert.hexColorToSignedNumber("#4281CD", 0)).toBe(4358605);
        });
    });
});
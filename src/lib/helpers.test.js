import {describe, expect, test} from '@jest/globals';
import CardHelper from './helpers';

describe('helpers.js', () => {
    describe('getRandomHex and isHex', () => {
        test('should return true if getRandomHex() return an Hexadecimal at isHex()', () => {
            expect(CardHelper.isHex(CardHelper.getRandomHex(10))).toBe(true);
        });

        test('should return true if getRandomHex() return a Hexadecimal at isHex() with Hexadecimal length 1-32', () => {
            let work = true;
            for (let i = 1; i <= 32 && work; i++) {
                if (!CardHelper.isHex(CardHelper.getRandomHex(i))) {
                    work = false;
                    break;
                }
            }
            expect(work).toBe(true);
        });

        test('should return false if isHex() got a Object', () => {
            expect(CardHelper.isHex({"YouShouldFail": 0x1})).toBe(false);
        });
    });
});
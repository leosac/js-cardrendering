import {describe, expect, test} from '@jest/globals';
import Fields from './fields';

describe('fields.js', () => {
    describe('resolveMacros', () => {
        var fields = new Fields(undefined);
        test('should not perform transformation', () => {
            expect(fields.resolveMacros("basic test")).toBe("basic test");
        });
        test('test $CONTAINS macro on success', () => {
            expect(fields.resolveMacros("$CONTAINS(A,Test A or B,Success)")).toBe("Success");
        });
        test('test $CONTAINS macro on error', () => {
            expect(fields.resolveMacros("$CONTAINS(C,Test A or B,Success,Error)")).toBe("Error");
        });
        test('test $CONTAINS macro on success with variable', () => {
            expect(fields.resolveMacros("$CONTAINS(A,%%MyField,Success)", {MyField: "Test A or B"})).toBe("Success");
        });
        test('test $TIMESTAMP macro', () => {
            expect(fields.resolveMacros("$TIMESTAMP(2023/01/01)")).toBe(1672531200);
        });
        test('test $EXPLODE macro with variable', () => {
            expect(fields.resolveMacros("$EXPLODE(1,%%MyField)", {MyField: "AA,BB,CC,DD"})).toBe("BB");
        });
    });
});
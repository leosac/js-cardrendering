var assert = require('assert');
import CardHelper from '../../src/lib/helpers';

export default function CardHelperTests(){

    describe('CardHelper.js', function() {
        describe('getRandomHex and isHex', function() {
          it('should return true if getRandomHex() return an Hexadecimal at isHex()', function() {
              assert.equal(CardHelper.isHex(CardHelper.getRandomHex(10)), true);
          });
          it('should return true if getRandomHex() return a Hexadecimal at isHex() with Hexadecimal length 1-1000', function() {
              let work = true;
              for (let i = 1; i <= 1000; i++)
              {
                 if (!CardHelper.isHex(CardHelper.getRandomHex(i)))
                 {
                     work = false;
                     break;
                 }
              }
              assert.equal(work, true);
          });
          it('should return false if isHex() got a Object', function() {
              assert.equal(CardHelper.isHex({"YouShouldFail": 0x1}), false);
          });
        });
      });

}
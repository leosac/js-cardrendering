var assert = require('assert');
import GeneralHelper from '../../src/js/GeneralHelper';

export default function GeneralHelperTests(){

    describe('GeneralHelper.js', function() {
        describe('getRandomHex and isHex', function() {
          it('should return true if getRandomHex() return an Hexadecimal at isHex()', function() {
              assert.equal(GeneralHelper.isHex(GeneralHelper.getRandomHex(10)), true);
          });
          it('should return true if getRandomHex() return a Hexadecimal at isHex() with Hexadecimal length 1-1000', function() {
              let work = true;
              for (let i = 1; i <= 1000; i++)
              {
                 if (!GeneralHelper.isHex(GeneralHelper.getRandomHex(i)))
                 {
                     work = false;
                     break;
                 }
              }
              assert.equal(work, true);
          });
          it('should return false if isHex() got a Object', function() {
              assert.equal(GeneralHelper.isHex({"YouShouldFail": 0x1}), false);
          });
        });
      });

}
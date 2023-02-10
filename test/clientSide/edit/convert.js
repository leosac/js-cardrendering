var assert = require('assert');
import * as convert from '../../../src/js/edit/convert';

//Exported function
export default function convertTests(){
    
    //Describe parent (contain all tests)
    describe('convert.js', function() {
        //Describe category (contain tests for a category, here function decimalToHexColor)
        describe('decimalToHexColor', function() {
          //This is a test, with a description of it
          it('should return 4281CD with decimal 4358605', function() {
            //This is the test, test if function return "0x4281CD"
            assert.equal(convert.decimalToHexColor(4358605), "0x4281CD");
          });
        });
        describe('hexColorToSignedNumber', function() {
            it('should return 4358605 with decimal 4281CD', function() {
                assert.equal(convert.hexColorToSignedNumber(Number("0x4281CD"), 0), 4358605);
            });
          });
    });
}
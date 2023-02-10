import I18n from 'i18next';
require('./src/js/edit')();

/**
 * Init Template Designer
 */
module.exports = 
{
   init:  function()
   {
        var requiredArgs;

        //Entry point for all the script and css loading, and rendering
        function core(){
            
            window.i18next = I18n;
        };
        return(false);
    }
    ,common : function(){return(require('./src/js/edit/common'))}
    ,convert : function(){return(require('./src/js/edit/convert'))}
};

export const name = 'jscardrendering';

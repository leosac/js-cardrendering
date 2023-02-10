function setErrorFlag(formName, field, errorMessage)
{
    const sessionKey = 'error_storage_' + formName;
    let errors = sessionStorage.getItem(sessionKey);
    if (!errors)
        errors = {};
	else
		errors = JSON.parse(errors);
    errors[field] = {msg: errorMessage};
    sessionStorage.setItem(sessionKey, JSON.stringify(errors));
}

function getErrorFlag(formName, field)
{
    const sessionKey = 'error_storage_' + formName;
    let errors = sessionStorage.getItem(sessionKey);
    if (!errors)
        return false;
	else
		errors = JSON.parse(errors);

    if (errors[field])
        return errors[field].msg;
    return false;
}

function clearErrorFlag(formname, field)
{
    const sessionKey = 'error_storage_' + formname;
    let errors = sessionStorage.getItem(sessionKey);
    if (!errors)
        errors = {};
	else
		errors = JSON.parse(errors);
    delete errors[field];
    sessionStorage.setItem(sessionKey, JSON.stringify(errors));
}

function hasError(formName)
{
    const sessionKey = 'error_storage_' + formName;
    const errors = sessionStorage.getItem(sessionKey);

    if (!errors)
        return false;
    return !!Object.keys(JSON.parse(errors)).length;
}

/**
 * Clear errors for a whole form
 * @param formName
 */
function clearAllErrorFlag(formName)
{
    const sessionKey = 'error_storage_' + formName;
    sessionStorage.setItem(sessionKey, false);
}

function validateField(formName, field, condition, messageOnError)
{
    if (!condition())
    {
        setErrorFlag(formName, field, messageOnError);
        return false;
    }
    else
    {
        clearErrorFlag(formName, field);
        return true;
    }
}

/**
 * An helper class to perform form validation.
 *
 * It's a wrapper around the free function found earlier in this file.
 * The error state is backed by the session.
 *
 * `form_name` specified in the constructor act as a key in the session
 * dictionary.
 */
class FormValidator {
    /**
     *
     * @param formName
     * @param accessorFunction Get a field's value from a field name.
     */
    constructor(formName, accessorFunction)
    {
        this.form_name = formName;

        // Add '#' in front of the field name.
        this.accessor_function = (name) =>
        {
            return accessorFunction('#' + name);
        };
    }

    clearAll()
    {
        clearAllErrorFlag(this.form_name);
    }

    /**
     * Does the form have at least one error?
     */
    hasError()
    {
        return hasError(this.form_name);
    }

    validateField(fieldName, checkFunction, errorMessage)
    {
        const value = this.accessor_function(fieldName);
        const fct = () =>
        {
            return checkFunction(value);
        };
        return validateField(this.form_name, fieldName, fct, errorMessage);
    }

    validateNotEmpty(fieldName)
    {
        return this.validateField(fieldName, (v) =>
        {
            return !!v.trim();
        }, "Form Error");
    }

    getErrorFor(fieldName)
    {
        return getErrorFlag(this.form_name, fieldName);
    }
}

export default FormValidator;

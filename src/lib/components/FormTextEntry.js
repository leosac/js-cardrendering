import { useState } from 'react';
import { withTranslation } from "react-i18next";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import FormValidator from "../form";

function FormTextEntry({t, option, label, name, current, onChange, tooltip = undefined, isDisabled = false, show = true, maxlength = undefined}) {
    const [value, setValue] = useState(current);
    
    function errorState(fieldName) {
        const e = new FormValidator('cardDesigner').getErrorFor(fieldName);
        return e ? 'has-error' : '';
    }
    
    function errorMessage(fieldName) {
        return new FormValidator('cardDesigner').getErrorFor(fieldName);
    }

    function handleChange(e) {
        setValue(e.target.value);
        onChange(e.target.value);
    }
    
    const classes = "col-md-6 row form-group " + errorState(option);
    let inputClasses = "form-control";
    if (isDisabled)
        inputClasses += " disabled";
    return (    
        <div className={classes} style={{display: show ? 'block': 'none'}}>
            <OverlayTrigger placement="right" overlay={<Tooltip>{tooltip}</Tooltip>}>
                <label htmlFor={option} className="col-md-6 col-form-label">
                    {t(label)}
                </label>
            </OverlayTrigger>

            <div className="col-md-4">
                {maxlength
                    ? <input name={name} id={option} className={inputClasses} value={value}
                            aria-describedby={'helpBlock' + option}
                            maxLength={maxlength} onChange={handleChange} />
                    : <input name={name} id={option} className={inputClasses} value={value}
                            aria-describedby={'helpBlock' + option} onChange={handleChange} />
                }
                <span id={'helpBlock' + option} className="form-text">{errorMessage(option)}</span>
            </div>
        </div>
    );
}

export default withTranslation()(FormTextEntry);
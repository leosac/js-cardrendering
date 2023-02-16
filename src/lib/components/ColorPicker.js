/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import { useState } from 'react';
import { withTranslation } from "react-i18next";
import { SketchPicker } from 'react-color';

function ColorPicker({t, color, onChange}) {
    const [currentColor, setColor] = useState(color);
    const [show, setShow] = useState(false);

    function handleChange(color) {
        setColor(color.hex);
        if (onChange) {
            onChange(color.hex);
        }
    }

    return (
        <div>
            <div style={{
                padding: '5px',
                background: '#fff',
                borderRadius: '1px',
                boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                display: 'inline-block',
                cursor: 'pointer'}} onClick={() => setShow(true)}>
                <div style={{
                    width: '4em',
                    height: '1em',
                    borderRadius: '2px',
                    background: currentColor
                }} />
            </div>
            { show &&
                <div style={{
                    position: 'absolute',
                    zIndex: '2'
                }}>
                    <div style={{
                        position: 'fixed',
                        top: '0px',
                        right: '0px',
                        bottom: '0px',
                        left: '0px'
                    }} onClick={ () => setShow(false) }/>
                    <SketchPicker color={ currentColor } onChange={ handleChange } />
                </div>
            }
        </div>
    );
}

export default withTranslation()(ColorPicker);
/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import { useState } from 'react';
import { withTranslation } from "react-i18next";
import Form from 'react-bootstrap/Form';
import DesignerModal from "../DesignerModal";
import ImageEditor from "../ImageEditor";
import ColorPicker from "../ColorPicker";

function PictureProperties({t, field, show, editor, onClose, onSubmit}) {
    const [value, setValue] = useState(field.value);
    const [borderWidth, setBorderWidth] = useState(field.borderWidth);
    const [borderColor, setBorderColor] = useState(field.borderColor ?? '#000000');

    function modalSubmit() {
        if (onSubmit) {
            onSubmit({
                value: value,
                borderWidth: borderWidth,
                borderColor: borderColor
            });
        }
        if (onClose) {
            onClose();
        }
    }
    
    return (
        <DesignerModal id="picture_properties" show={show} editor={editor} title={t('properties.prop_picture')} onClose={onClose} onSubmit={modalSubmit}>
            <Form.Group>
                <Form.Label>{t('properties.borderwidth')}</Form.Label>
                <Form.Control type="number" min="0" max="1" placeholder="1" value={borderWidth} onChange={e => setBorderWidth(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.bordercolor')}</Form.Label>
                <ColorPicker color={borderColor} onChange={setBorderColor} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.picture')}</Form.Label>
                <ImageEditor image={value} onChange={img => { setValue(img)}} />
            </Form.Group>
        </DesignerModal>
    );
}

export default withTranslation()(PictureProperties);
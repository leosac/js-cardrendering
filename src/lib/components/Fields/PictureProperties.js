import { SketchPicker } from 'react-color';
import { useState } from 'react';
import { withTranslation } from "react-i18next";
import Form from 'react-bootstrap/Form';
import DesignerModal from "../DesignerModal";
import ImageEditor from "../ImageEditor";

function PictureProperties({t, field, show, onClose, onSubmit}) {
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
        <DesignerModal id="picture_properties" show={show} title={t('properties.prop_picture')} onClose={onClose} onSubmit={modalSubmit}>
            <Form.Group>
                <Form.Label>{t('properties.borderwidth')}</Form.Label>
                <Form.Control type="number" min="0" max="1" placeholder="1" value={borderWidth} onChange={e => setBorderWidth(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.bordercolor')}</Form.Label>
                <SketchPicker color={borderColor} onChangeComplete={color => setBorderColor(color.hex)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.picture')}</Form.Label>
                <ImageEditor image={value} onChange={img => { setValue(img); }} />
            </Form.Group>
        </DesignerModal>
    );
}

export default withTranslation()(PictureProperties);
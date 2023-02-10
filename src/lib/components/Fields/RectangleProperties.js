import { SketchPicker } from 'react-color';
import { useState } from 'react';
import { withTranslation } from "react-i18next";
import Form from 'react-bootstrap/Form';
import DesignerModal from "../DesignerModal";

function RectangleProperties({t, field, show, onClose, onSubmit}) {
    const [color, setColor] = useState(field.color ?? '#000000');
    const [borderWidth, setBorderWidth] = useState(field.borderWidth);
    const [borderColor, setBorderColor] = useState(field.borderColor ?? '#000000');

    function modalSubmit() {
        if (onSubmit) {
            onSubmit({
                color: color,
                borderWidth: borderWidth,
                borderColor: borderColor
            });
        }
        if (onClose) {
            onClose();
        }
    }

    return (
        <DesignerModal id="rectangle_properties" show={show} title={t('properties.prop_rectangle')} onClose={onClose} onSubmit={modalSubmit}>
            <Form.Group>
                <Form.Label>{t('properties.color')}</Form.Label>
                <SketchPicker color={color} onChangeComplete={color => setColor(color.hex)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.borderwidth')}</Form.Label>
                <Form.Control type="number" placeholder="1" min="0" max="1" value={borderWidth} onChange={e => setBorderWidth(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.bordercolor')}</Form.Label>
                <SketchPicker color={borderColor} onChangeComplete={color => setBorderColor(color.hex)} />
            </Form.Group>
        </DesignerModal>
    );
}

export default withTranslation()(RectangleProperties);
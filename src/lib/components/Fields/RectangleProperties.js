/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import { useState } from 'react';
import { withTranslation } from "react-i18next";
import Form from 'react-bootstrap/Form';
import DesignerModal from "../DesignerModal";
import ColorPicker from "../ColorPicker";

function RectangleProperties({t, field, show, editor, onClose, onSubmit}) {
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
        <DesignerModal id="rectangle_properties" show={show} editor={editor} title={t('properties.prop_rectangle')} onClose={onClose} onSubmit={modalSubmit}>
            <Form.Group>
                <Form.Label>{t('properties.color')}</Form.Label>
                <ColorPicker color={color} onChange={setColor} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.borderwidth')}</Form.Label>
                <Form.Control type="number" placeholder="1" min="0" max="1" value={borderWidth} onChange={e => setBorderWidth(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.bordercolor')}</Form.Label>
                <ColorPicker color={borderColor} onChange={setBorderColor} />
            </Form.Group>
        </DesignerModal>
    );
}

export default withTranslation()(RectangleProperties);
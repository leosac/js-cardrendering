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

function Pdf417Properties({t, field, show, editor, onClose, onSubmit}) {
    const [value, setValue] = useState(field.value);
    const [color, setColor] = useState(field.color ?? '#000000');
    const [colorFill, setColorFill] = useState(field.colorFill);
    const [ecLevel, setEcLevel] = useState(field.ecLevel);

    function modalSubmit() {
        if (onSubmit) {
            onSubmit({
                value: value,
                color: color,
                colorFill: colorFill,
                ecLevel: ecLevel
            });
        }
        if (onClose) {
            onClose();
        }
    }

    return (
        <DesignerModal id="pdf417_properties" show={show} editor={editor} title={t('properties.prop_pdf417')} onClose={onClose} onSubmit={modalSubmit}>
            <Form.Group>
                <Form.Label>{t('properties.value')}</Form.Label>
                <Form.Control type="text" placeholder="Text" value={value} onChange={e => setValue(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.color')}</Form.Label>
                <ColorPicker color={color} onChange={setColor} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.colorfill')}</Form.Label>
                <ColorPicker color={colorFill} onChange={setColorFill} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.errorcorrection')}</Form.Label>
                <Form.Control as="select" value={ecLevel} onChange={e => setEcLevel(e.target.value)}>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </Form.Control>
            </Form.Group>
        </DesignerModal>
    );
}

export default withTranslation()(Pdf417Properties);
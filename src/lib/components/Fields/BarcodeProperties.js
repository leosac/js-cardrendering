/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import { useState } from 'react';
import { withTranslation } from "react-i18next";
import Form from 'react-bootstrap/Form';
import DesignerModal from "../DesignerModal";

function BarcodeProperties({t, field, show, editor, onClose, onSubmit}) {
    const [value, setValue] = useState(field.value);
    const [fontFamily, setFontFamily] = useState(field.fontFamily);
    const [fontSize, setFontSize] = useState(field.fontSize);

    function modalSubmit() {
        if (onSubmit) {
            onSubmit({
                value: value,
                fontFamily: fontFamily,
                fontSize: fontSize
            });
        }
        if (onClose) {
            onClose();
        }
    }

    return (
        <DesignerModal id="barcode_properties" show={show} editor={editor} title={t('properties.prop_barcode')} onClose={onClose} onSubmit={modalSubmit}>
            <Form.Group>
                <Form.Label>{t('properties.value')}</Form.Label>
                <Form.Control type="text" placeholder="Text" value={value} onChange={e => setValue(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.fontfamily')}</Form.Label>
                <Form.Control as="select" value={fontFamily} onChange={e => setFontFamily(e.target.value)}>
                    <option>C39HrP24DhTt</option>
                    <option>C39HrP24DlTt</option>
                    <option>C39HrP36DlTt</option>
                    <option>C39HrP48DhTt</option>
                    <option>Code39</option>
                    <option>Code 93</option>
                    <option>Code 128</option>
                    <option>Code CodaBar</option>
                    <option>UPC-A</option>
                    <option>EanBwrP72Tt</option>
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.fontsize')}</Form.Label>
                <Form.Control type="text" placeholder="20" value={fontSize} onChange={e => setFontSize(e.target.value)} />
            </Form.Group>
        </DesignerModal>
    );
}

export default withTranslation()(BarcodeProperties);
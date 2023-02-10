import { useState } from 'react';
import { withTranslation } from "react-i18next";
import Form from 'react-bootstrap/Form';
import DesignerModal from "../DesignerModal";

function QrCodeProperties({t, field, show, onClose, onSubmit}) {
    const [value, setValue] = useState(field.value);
    const [ecLevel, setEcLevel] = useState(field.ecLevel);

    function modalSubmit() {
        if (onSubmit) {
            onSubmit({
                value: value,
                ecLevel: ecLevel
            });
        }
        if (onClose) {
            onClose();
        }
    }

    return (
        <DesignerModal id="qrCode_properties" show={show} title={t('properties.prop_qrcode')} onClose={onClose} onSubmit={modalSubmit}>
            <Form.Group>
                <Form.Label>{t('properties.value')}</Form.Label>
                <Form.Control type="text" placeholder="Text" value={value} onChange={e => setValue(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.errorcorrection')}</Form.Label>
                <Form.Control as="select" value={ecLevel} onChange={e => setEcLevel(e.target.value)}>
                    <option>L</option>
                    <option>M</option>
                    <option>Q</option>
                    <option>H</option>
                </Form.Control>
            </Form.Group>
        </DesignerModal>
    );
}

export default withTranslation()(QrCodeProperties);
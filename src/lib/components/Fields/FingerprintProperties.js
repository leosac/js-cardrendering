import { useState } from 'react';
import { withTranslation } from "react-i18next";
import Form from 'react-bootstrap/Form';
import DesignerModal from "../DesignerModal";

function FingerprintProperties({t, field, show, onClose, onSubmit}) {
    const [autoRequest, setAutoRequest] = useState(field.autoRequest);
    const [targets, setTargets] = useState(field.targets ?? []);

    function addTarget() {
        targets.push("");
        setTargets(targets);
    }

    function removeTarget(index) {
        if (index < targets.length) {
            targets.splice(index, 1);
            setTargets(targets);
        }
    }

    function updateTarget(index, value) {
        targets[index] = value;
        setTargets(targets);
    }

    function modalSubmit() {
        if (onSubmit) {
            onSubmit({
                autoRequest: autoRequest,
                targets: targets
            });
        }
        if (onClose) {
            onClose();
        }
    }

    return (
        <DesignerModal id="fingerprint_properties" show={show} title={t('properties.prop_fingerprint')} onClose={onClose} onSubmit={modalSubmit}>
            <Form.Group>
                <Form.Check type="checkbox" label={t('properties.auto_request')} checked={autoRequest} onChange={e => setAutoRequest(e.target.value)} />
            </Form.Group>
            <fieldset>
                <legend>{t('properties.targets')}</legend>
                <button href="#" onClick={addTarget()} className="multiple_text_input_add btn btn-link">{t('properties.add_fingerprint_target')}</button>
                <hr />
                {targets.map((target, index) => {
                    return (
                        <Form.Group key={index}>
                            <Form.Label>{t('properties.fingerprint_target')}</Form.Label>
                            <Form.Control type="text" value={target} onChange={e => updateTarget(index, e.target.value)} />
                            <button href="#" onClick={removeTarget(index)} className="multiple_text_input_remove btn btn-link">{t('common.remove')}</button>
                        </Form.Group>
                    )
                })}
            </fieldset>
        </DesignerModal>
    );
}

export default withTranslation()(FingerprintProperties);
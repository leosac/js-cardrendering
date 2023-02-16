/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import { useState } from 'react';
import { Form } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import DesignerModal from "./DesignerModal";

function AddFieldFromList({t, fieldlist, show, editor, onClose, onSubmit}) {
    const [selectedField, setSelectedField] = useState();

    function modalSubmit() {
        if (onSubmit) {
            onSubmit(selectedField);
        }
        if (onClose) {
            onClose();
        }
    }

    return (
        <DesignerModal id="addfieldfromlist" show={show} editor={editor} confirm={t('common.add')} title={t('common.add')} onClose={onClose} onSubmit={modalSubmit}>
            <Form.Group>
                <Form.Label>{t('common.name')}</Form.Label>
                <Form.Control as="select" value={selectedField} onChange={e => setSelectedField(e.target.value)}>
                {fieldlist && fieldlist.map((field) => {
                    return (
                        <option key={field._id} value={field._id}>{field.name}</option>
                    )
                })}
                </Form.Control>
            </Form.Group>
        </DesignerModal>
    );
}

export default withTranslation()(AddFieldFromList);
/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import { useState } from 'react';
import { Form } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import DisplayPrintFieldEntry from "./DisplayPrintFieldEntry";

function PrintField({t, isAdmin, fields, updateFields}) {
    const [name, setName] = useState('');
    const [type, setType] = useState('label');
    const [showModal, setShowModal] = useState('showModal');

    if (!isAdmin)
        return (<div></div>);

    function addField() {
        fields.push({
            name: name,
            type: type
        });
        if (updateFields)
            updateFields(fields);
    }

    function removeField(index) {
        fields.splice(index, 1);
        if (updateFields)
            updateFields(fields);
    }

    return (
        <div>
            <div className="card card.text-white.bg-info">
                <div className="card-header">{t('properties.printfields')}</div>
                <div className="card-body">
                    <div>

                    </div>
                    <div className="text-right">
                        <a className="btn btn-primary add-field" onClick={() => setShowModal(true)}>Add Field</a>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th>{t('common.name')}</th>
                        <th>{t('common.type' )}</th>
                        <th>{t('common.action')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {fields.map((field, index) => {
                        return (
                            <tr key={field.name} data-id={field.id}>
                                <td>{field.name}</td>
                                <td>{field.type}</td>
                                <td>
                                    <a className="remove-field" onClick={removeField(index)}><span className="fas fa-times" style={{color: 'red'}} aria-hidden="true"></span>{t('common.remove')}</a>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>

            <DesignerModal id="addfieldmodal" confirm={t('common.add')} title={t('common.addfield')} show={showModal} onClose={() => setShowModal(false)} onSubmit={addField}>
                <Form.Group>
                    <Form.Label>{t('properties.name')}</Form.Label>
                    <Form.Control type="text" placeholder="Name" value={name} onChange={setName(e.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>{t('common.type')}</Form.Label>
                    <Form.Control as="select" value={type} onChange={e => setType(e.target.value)}>
                        <option value="label" selected>{t('create.label')}</option>
                        <option value="picture">{t('create.picture')}</option>
                        <option value="qrcode">{t('create.qrcode')}</option>
                    </Form.Control>
                </Form.Group>
            </DesignerModal>
        </div>
    );
}

export default withTranslation()(PrintField);
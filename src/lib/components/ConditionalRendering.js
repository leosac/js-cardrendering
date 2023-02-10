import { useState } from 'react';
import { Form } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import DesignerModal from "./DesignerModal";

function ConditionalRendering({t, entries, show, onClose, onSubmit}) {
    const [newEntries, setEntries] = useState(entries ?? []);

    function modalSubmit() {
        if (onSubmit) {
            onSubmit(newEntries);
        }
        if (onClose) {
            onClose();
        }
    }

    function addEntry() {
        newEntries.push({
            condition: '',
            targetProperty: '',
            propertyValue: ''
        });
        setEntries(newEntries);
    }

    function removeEntry(index) {
        newEntries.splice(index, 1);
        setEntries(newEntries);
    }

    function setEntryCondition(index, val) {
        newEntries[index].condition = val;
    }

    function setEntryTargetProperty(index, val) {
        newEntries[index].targetProperty = val;
    }

    function setEntryPropertyValue(index, val) {
        newEntries[index].propertyValue = val;
    }

    return (
        <DesignerModal id="conditional_rendering" show={show} confirm={t('properties.update')} title={t('properties.conditional_rendering')} onClose={onClose} onSubmit={modalSubmit}>
            <div>
                <button type="button" className="btn btn-sm add_entry" onClick={addEntry}>
                    <span className=" fas fa-plus-circle" style={{color: 'green'}} aria-hidden="true"></span>
                    {t('properties.addentry')}
                </button>
            </div>
            <div id="conditional_rendering_entries">
                {newEntries.map((entry, index) => {
                    return (
                        <div key={index} className="row" id={'rendering_entry_' + index} data-index={index}>
                            <Form.Group className="col-md-3">
                                <Form.Label>{t('properties.condition_string')}</Form.Label>
                                <Form.Control type="text" value={entry.condition} placeholder="" onChange={e => setEntryCondition(index, e.target.value)} />
                            </Form.Group>
                            <Form.Group className="col-md-3">
                                <Form.Label>{t('properties.target_property')}</Form.Label>
                                <Form.Control as="select" value={entry.targetProperty} onChange={e => setEntryTargetProperty(index, e.target.value)}>
                                    <option value="color">{t('color')}</option>
                                    <option value="colorFill">{t('colorFill')}</option>
                                    <option value="isVisible">{t('isVisible')}</option>
                                    <option value="xPosition">{t('xPosition')}</option>
                                    <option value="yPosition">{t('yPosition')}</option>
                                    <option value="value">{t('value')}</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="col-md-3">
                                <Form.Label>{t('properties.target_property_value')}</Form.Label>
                                <Form.Control type="text" value={entry.propertyValue} placeholder="" onChange={e => setEntryPropertyValue(index, e.target.value)} />
                            </Form.Group>
                            <Form.Group className="col-md-3">
                                <Form.Label>{t('common.action')}</Form.Label>
                                <a className="btn btn-danger remove_entry form-control" onClick={removeEntry(index)}>{t('common.remove')}</a>
                            </Form.Group>
                        </div>
                    )
                })}
            </div>
        </DesignerModal>
    );
}

export default withTranslation()(ConditionalRendering);
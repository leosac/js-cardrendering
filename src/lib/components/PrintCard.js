/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import { useState } from 'react';
import { withTranslation } from "react-i18next";
import DesignerModal from "./DesignerModal";
import Form from 'react-bootstrap/Form';
import ImageEditor from "./ImageEditor";

function PrintCard({t, show, editor, fields, onClose, onSubmit}) {
    const initValues = {}
    fields.forEach(field => {
        initValues[field.name] = field.value;
    });
    const [values, setValues] = useState(initValues);

    function modalSubmit() {
        if (onSubmit) {
            onSubmit(values);
        }
        if (onClose) {
            onClose();
        }
    }

    function setValue(name, value) {
        const newValues = {...values};
        newValues[name] = value;
        setValues(newValues);
    }

    return(
        <DesignerModal id="printcard" show={show} editor={editor} confirm={t('create.print')} title={t('create.print_card')} onClose={onClose} onSubmit={modalSubmit}>
            <div>
                <div className="alert alert-info" role="alert">Please enter below the information for the new card to
                    jscardrendering.<br/>Only <em>Label</em>, <em>Picture</em> and <em>QRCode</em> fields with a valid name
                    are displayed.
                </div>
                <div>
                    {fields.map(field => {
                        return(
                            <Form.Group key={field.name}>
                            {(field.type === 'label' || field.type === 'barcode' || field.type === 'qrcode') &&
                                <div>
                                    <Form.Label>{field.name}</Form.Label>
                                    <Form.Control type="text" value={values[field.name]} onChange={e => setValue(field.name, e.target.value)} />
                                </div>
                            }
                            {(field.type === 'picture') &&
                                <div>
                                    <Form.Label>{field.name}</Form.Label>
                                    <ImageEditor image={field.value} onChange={img => { setValue(field.name, img); }} />
                                </div>
                            }
                            </Form.Group>
                        )
                    })}
                </div>
            </div>
        </DesignerModal>
    );
}

export default withTranslation()(PrintCard);
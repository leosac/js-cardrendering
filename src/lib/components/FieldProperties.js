/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import { useState } from 'react';
import { Form } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import DesignerModal from "./DesignerModal";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

function FieldProperties({t, field, show, onClose, onSubmit}) {
    const [name, setName] = useState(field.name);
    const [height, setHeight] = useState(field.height);
    const [width, setWidth] = useState(field.width);
    const [x, setX] = useState(field.x);
    const [y, setY] = useState(field.y);
    const [z, setZ] = useState(field.z);
    const [rotation, setRotation] = useState(field.rotation);
    const [useMacros, setUseMacros] = useState(field.useMacros);

    function modalSubmit() {
        if (onSubmit) {
            onSubmit({
                name: name,
                height: height,
                width: width,
                x: x,
                y: y,
                z: z,
                rotation: rotation,
                useMacros: useMacros
            });
        }
        if (onClose) {
            onClose();
        }
    }

    return (
        <DesignerModal id="field_properties" show={show} confirm={t('properties.update')} title={t('properties.prop_internal')} onClose={onClose} onSubmit={modalSubmit}>
            <Form.Group>
                <Form.Label>{t('properties.name')}</Form.Label>
                <Form.Control type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.height')}</Form.Label>
                <Form.Control type="number" placeholder="0" value={height} onChange={e => setHeight(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.width')}</Form.Label>
                <Form.Control type="number" placeholder="0" value={width} onChange={e => setWidth(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.x')}</Form.Label>
                <Form.Control type="number" placeholder="0" value={x} onChange={e => setX(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.y')}</Form.Label>
                <Form.Control type="number" placeholder="0" value={y} onChange={e => setY(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.z')}</Form.Label>
                <Form.Control type="number" placeholder="0" value={z} onChange={e => setZ(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.rotation')}</Form.Label>
                <Form.Control type="number" placeholder="0" value={rotation} onChange={e => setRotation(e.target.value)} />
                <input type="number" className="form-control" id="field_rotation" placeholder="0" max="360" min="-360" />
            </Form.Group>
            <Form.Group>
            <Form.Check type="checkbox" checked={useMacros} onChange={e => setUseMacros(e.target.value)} />
                <OverlayTrigger placement="right" overlay={<Tooltip>{t('macros.tooltip')}</Tooltip>}>
                    <Form.Check.Label>
                        {t('properties.usemacros')}
                    </Form.Check.Label>
                </OverlayTrigger>
            </Form.Group>
        </DesignerModal>
    );
}

export default withTranslation()(FieldProperties);
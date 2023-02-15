/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import { SketchPicker } from 'react-color';
import { useState } from 'react';
import Form from "react-bootstrap/Form";
import { withTranslation } from "react-i18next";
import DesignerModal from "./DesignerModal";
import ImageEditor from "./ImageEditor";

function BackgroundProperties({t, background, show, onClose, onSubmit}) {
    const [type, setType] = useState(background.background_picture_layout ? 'picture' : 'color');
    const [color, setColor] = useState(background.color ?? '#FFFFFF');
    const [picture, setPicture] = useState(background.background_picture);
    const [layout, setLayout] = useState(background.background_picture_layout);

    function modalSubmit() {
        if (onSubmit) {
            onSubmit({
                color: color,
                background_picture: (type === 'picture') ? picture : '',
                background_picture_layout: layout
            });
        }
        if (onClose) {
            onClose();
        }
    }

    return (
        <DesignerModal id="background_properties" show={show} confirm={t('properties.update')} title={t('properties.prop_background')} onClose={onClose} onSubmit={modalSubmit}>
            <Form.Group>
                <Form.Label>{t('properties.background_type')}</Form.Label>
                <Form.Control as="select" value={type} onChange={e => setType(e.target.value)}>
                    <option value="color">{t('properties.color')}</option>
                    <option value="picture">{t('properties.picture')}</option>
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.color')}</Form.Label>
                <SketchPicker color={color} onChangeComplete={color => setColor(color.hex)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.picture')}</Form.Label>
                <ImageEditor image={picture} onChange={img => { setPicture(img); }} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.prop_background_style')}</Form.Label>
                <Form.Control as="select" value={layout} onChange={e => setLayout(e.target.value)}>
                    <option value="0">{t('properties.prop_background_style_none')}</option>
                    {/*<option value="1">{t('properties.prop_background_style_tile')}</option> */}
                    <option value="2">{t('properties.prop_background_style_center')}</option>
                    <option value="3">{t('properties.prop_background_style_stretch')}</option>
                    <option value="4">{t('properties.prop_background_style_zoom')}</option>
                </Form.Control>
            </Form.Group>
        </DesignerModal>
    );
}

export default withTranslation()(BackgroundProperties);
import { SketchPicker } from 'react-color';
import { useState } from 'react';
import { withTranslation } from "react-i18next";
import Form from 'react-bootstrap/Form';
import DesignerModal from "../DesignerModal";
import GeneralHelper from "../../GeneralHelper";

function DataMatrixProperties({t, field, show, onClose, onSubmit}) {
    const [value, setValue] = useState(field.value);
    const [color, setColor] = useState(field.color);
    const [colorFill, setColorFill] = useState(field.colorFill);
    const [sizeIdx, setSizeIdx] = useState(field.sizeIdx);
    const [scheme, setScheme] = useState(field.scheme);

    function modalSubmit() {
        if (onSubmit) {
            onSubmit({
                value: value,
                color: color,
                colorFill: colorFill,
                sizeIdx: sizeIdx,
                scheme: scheme
            });
        }
        if (onClose) {
            onClose();
        }
    }

    return (
        <DesignerModal id="dataMatrix_properties" show={show} title={t('properties.prop_datamatrix')} onClose={onClose} onSubmit={modalSubmit}>
            <Form.Group>
                <Form.Label>{t('properties.value')}</Form.Label>
                <Form.Control type="text" placeholder="Text" value={value} onChange={e => setValue(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.color')}</Form.Label>
                <SketchPicker color={color} onChangeComplete={color => setColor(color.hex)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.colorfill')}</Form.Label>
                <SketchPicker color={colorFill} onChangeComplete={color => setColorFill(color.hex)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.prop_datamatrix_symbolSize')}</Form.Label>
                <Form.Control as="select" value={sizeIdx} onChange={e => setSizeIdx(e.target.value)}>
                    {GeneralHelper.getDataMatrixSizeIdx(t).map((idx) => {
                        return (
                            <option key={idx.value} value={idx.value}>{idx.label}</option>
                        )
                    })}
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.prop_datamatrix_scheme')}</Form.Label>
                <Form.Control as="select" value={scheme} onChange={e => setScheme(e.target.value)}>
                    <option value="0">Ascii</option>
                    <option value="6">Ascii GS1</option>
                </Form.Control>
            </Form.Group>
        </DesignerModal>
    );
}

export default withTranslation()(DataMatrixProperties);
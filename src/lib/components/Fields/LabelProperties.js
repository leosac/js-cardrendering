/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import { SketchPicker } from 'react-color';
import { useState } from 'react';
import { withTranslation } from "react-i18next";
import Form from 'react-bootstrap/Form';
import DesignerModal from "../DesignerModal";
import GeneralHelper from '../../GeneralHelper';

function LabelProperties({t, field, show, onClose, onSubmit}) {
    const [value, setValue] = useState(field.value);
    const [color, setColor] = useState(field.color ?? '#000000');
    const [fontFamily, setFontFamily] = useState(field.fontFamily);
    const [fontSize, setFontSize] = useState(field.fontSize);
    const [fontStyle, setFontStyle] = useState(field.fontStyle);
    const [colorFill, setColorFill] = useState(field.colorFill);
    const [borderWidth, setBorderWidth] = useState(field.borderWidth);
    const [borderColor, setBorderColor] = useState(field.borderColor ?? '#000000');
    const [align, setAlign] = useState(field.align);
    const [maxLength, setMaxLength] = useState(field.maxLength);
    const [autoSize, setAutoSize] = useState(field.autoSize);
    const [autoFontScale, setAutoFontScale] = useState(field.autoFontScale);
    const [wordBreak, setWordBreak] = useState(field.wordBreak);

    function modalSubmit() {
        if (onSubmit) {
            onSubmit({
                value: value,
                color: color,
                fontFamily: fontFamily,
                fontSize: fontSize,
                fontStyle: fontStyle,
                colorFill: colorFill,
                borderWidth: borderWidth,
                borderColor: borderColor,
                align: align,
                maxLength: maxLength,
                autoSize: autoSize,
                autoFontScale: autoFontScale,
                wordBreak: wordBreak
            });
        }
        if (onClose) {
            onClose();
        }
    }

    return (
        <DesignerModal id="label_properties" show={show} title={t('properties.prop_label')} onClose={onClose} onSubmit={modalSubmit}>
            <Form.Group>
                <Form.Label>{t('properties.value')}</Form.Label>
                <Form.Control type="text" placeholder="Text" value={value} onChange={e => setValue(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.color')}</Form.Label>
                <SketchPicker color={color} onChangeComplete={color => setColor(color.hex)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.fontfamily')}</Form.Label>
                <Form.Control as="select" value={fontFamily} onChange={e => setFontFamily(e.target.value)}>
                    {GeneralHelper.getFontFamilies().map((font) => {
                        return (
                            <option key={font}>{font}</option>
                        )
                    })}
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.fontsize')}</Form.Label>
                <Form.Control type="text" placeholder="8pt" value={fontSize} onChange={e => setFontSize(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.fontstyle')}</Form.Label>
                <Form.Control as="select" value={fontStyle} onChange={e => setFontStyle(e.target.value)}>
                    <option value="Bold" style={{fontWeight: 'bold'}}>{t('properties.bold')}</option>
                    <option value="Normal" style={{fontStyle: 'normal'}}>{t('properties.normal')}</option>
                    <option value="Italic" style={{fontStyle: 'italic'}}>{t('properties.italic')}</option>
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.colorfill')}</Form.Label>
                <SketchPicker color={colorFill} onChangeComplete={color => setColorFill(color.hex)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.borderwidth')}</Form.Label>
                <Form.Control type="number" min="0" max="1" placeholder="1" value={borderWidth} onChange={e => setBorderWidth(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.bordercolor')}</Form.Label>
                <SketchPicker color={borderColor} onChangeComplete={color => setBorderColor(color.hex)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.align')}</Form.Label>
                <Form.Control as="select" value={align} onChange={e => setAlign(e.target.value)}>
                    <option value="TopLeft">{t('properties.topleft')}</option>
                    <option value="TopCenter">{t('properties.topcenter')}</option>
                    <option value="TopRight">{t('properties.topright')}</option>
                    <option value="MiddleLeft">{t('properties.middleleft')}</option>
                    <option value="MiddleCenter">{t('properties.middlecenter')}</option>
                    <option value="MiddleRight">{t('properties.middleright')}</option>
                    <option value="BottomLeft">{t('properties.bottomleft')}</option>
                    <option value="BottomCenter">{t('properties.bottomcenter')}</option>
                    <option value="BottomRight">{t('properties.bottomright')}</option>
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.maxlength')}</Form.Label>
                <Form.Control type="text" placeholder="" value={maxLength} onChange={e => setMaxLength(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Check type="checkbox" label= {t('properties.autosize')} checked={autoSize} onChange={e => setAutoSize(e.target.value)} />
                <Form.Check type="checkbox" label= {t('properties.autofontscale')} checked={autoFontScale} onChange={e => setAutoFontScale(e.target.value)} />
                <Form.Check type="checkbox" label= {t('properties.wordbreak')} checked={wordBreak} onChange={e => setWordBreak(e.target.value)} />
            </Form.Group>
        </DesignerModal>
    );
}

export default withTranslation()(LabelProperties);
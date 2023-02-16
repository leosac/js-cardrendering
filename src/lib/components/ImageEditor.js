/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import { useState, useRef } from 'react';
import { withTranslation } from "react-i18next";
import FilerobotImageEditor, { TABS } from 'react-filerobot-image-editor';

function ImageEditor({t, image, onChange}) {
    const [showEditor, setShowEditor] = useState(false);
    const inputFile = useRef(null);

    function fileClick() {
        inputFile.current.click();
    }

    function changeFile(target) {
        if (FileReader && target.files && target.files.length > 0)
        {
            const reader = new FileReader();
            reader.onload = (e) => {
                onChange(e.target.result);
            };
            reader.onerror = (e) => {
                alert("Error reading image file.");
            };
            reader.readAsDataURL(target.files[0]);
        }
    }

    return (
        <div>
            {!showEditor &&
                <div className="row">
                    <div className="col-md-6 text-center">
                        <img src={image} alt={t('properties.currentimage')} />
                    </div>
                    <div className="col-md-6 list-group">
                        <button type="button" className="btn btn-primary" onClick={fileClick}>{t('create.loadfile')}</button>
                        <input type='file' ref={inputFile} style={{display: 'none'}} onChange={e => changeFile(e.target)} />
                        {image &&
                            <button type="button" className="btn" onClick={() => setShowEditor(true)}>{t('common.edit')}</button>
                        }
                    </div>
                </div>
            }
            {showEditor &&
                <FilerobotImageEditor
                    source={image}
                    tabsIds={[TABS.ADJUST, TABS.ANNOTATE, TABS.FILTERS, TABS.WATERMARK]}
                    onClose={() => setShowEditor(false)}
                    onSave={(edited) => onChange(edited.imageBase64)}
                />
            }
        </div>
    );
}

export default withTranslation()(ImageEditor);
import { useState } from 'react';
import { withTranslation } from "react-i18next";
import FilerobotImageEditor, { TABS } from 'react-filerobot-image-editor';

function ImageEditor({t, image, onChange}) {
    const [currentImage, setCurrentImage] = useState(image);
    const [showEditor, setShowEditor] = useState(false);

    return (
        <div>
            {!showEditor &&
                <div className="row">
                    <div className="col-md-6 text-center">
                        <img src={currentImage} alt={t('properties.currentimage')} />
                    </div>
                    <div className="col-md-6 list-group">
                        <button type="button" class="btn btn-primary">{t('create.loadfile')}</button>
                        {currentImage &&
                            <button type="button" class="btn" onClick={() => setShowEditor(true)}>{t('common.edit')}</button>
                        }
                    </div>
                </div>
            }
            {showEditor &&
                <FilerobotImageEditor
                    source={currentImage}
                    tabsIds={[TABS.ADJUST, TABS.ANNOTATE, TABS.FILTERS, TABS.WATERMARK]}
                    onClose={() => setShowEditor(false)}
                />
            }
        </div>
    );
}

export default withTranslation()(ImageEditor);
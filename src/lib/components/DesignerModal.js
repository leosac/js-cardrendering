/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import $ from 'jquery';
import { useEffect } from "react";
import { withTranslation } from "react-i18next";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function DesignerModal({t, show, editor, id, title, children, onClose, onSubmit, confirm = t('properties.update')}) {
    
    useEffect(() => {
        $(".modal-dialog").draggable({
            handle: ".modal-header"
        });
    });

    function handleOnShow(e) {
        if (editor) {
            editor.enterModal();
        }
    }

    function handleOnClose(e) {
        if (onClose) {
            onClose(e);
        }

        if (editor) {
            editor.leaveModal();
        }
    }

    function handleOnSubmit(e) {
        if (onSubmit) {
            onSubmit(e);
        }

        if (editor) {
            editor.leaveModal();
        }
    }
    
    return (
        <Modal id={id} show={show} onHide={handleOnClose} onShow={handleOnShow}>
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {children}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleOnSubmit}>{confirm}</Button>
                    <Button variant="secondary" className="btnclose" onClick={handleOnClose}>{t('properties.cancel')}</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </Modal>
    );
}

export default withTranslation()(DesignerModal);
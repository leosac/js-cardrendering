import $ from 'jquery';
import { useEffect } from "react";
import { withTranslation } from "react-i18next";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function DesignerModal({t, show, id, title, children, onClose, onSubmit, confirm = t('properties.update')}) {
    
    useEffect(() => {
        $(".modal-dialog").draggable({
            handle: ".modal-header"
        });
    });
    
    return (
        <Modal id={id} show={show} onHide={onClose}>
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {children}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={onSubmit}>{confirm}</Button>
                    <Button variant="secondary" className="btnclose" onClick={onClose}>{t('properties.cancel')}</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </Modal>
    );
}

export default withTranslation()(DesignerModal);
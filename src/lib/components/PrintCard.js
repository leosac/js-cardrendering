/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import { withTranslation } from "react-i18next";
import DesignerModal from "./DesignerModal";

function PrintCard({t, show, onClose, onSubmit}) {
    function modalSubmit() {
        if (onSubmit) {
            onSubmit();
        }
        if (onClose) {
            onClose();
        }
    }

    return(
        <DesignerModal id="editgrid" show={show} confirm={t('create.print')} title={t('create.print_card')} onClose={onClose} onSubmit={modalSubmit}>
            <div>
                <div className="alert alert-info" role="alert">Please enter below the information for the new card to
                    jscardrendering.<br/>Only <em>Label</em>, <em>Picture</em> and <em>QRCode</em> fields with a valid name
                    are displayed.
                </div>
                <div id="print_card_form">
                </div>
            </div>
        </DesignerModal>
    );
}

export default withTranslation()(PrintCard);
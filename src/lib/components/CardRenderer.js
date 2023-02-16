/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import { useRef } from 'react';
import { withTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, Item, Separator, useContextMenu } from 'react-contexify';
import 'react-contexify/ReactContexify.css';

function CardRenderer({t, sideType, editor}) {
    const canvasRef = useRef(null);
    const { show } = useContextMenu({ id: 'carddesign_menu_' + sideType });

    function handleContextMenu(event) {
        show({
            event: event,
            props: {}
        })
    }

    return (
        <div>
            <canvas ref={canvasRef} className="carddesign" id={'carddesign_' + sideType} onContextMenu={handleContextMenu}></canvas>
            {editor && editor.state.selectedfield.length > 0 &&
                <Menu id={'carddesign_menu_' + sideType}>
                    <Item onClick={editor.editField}>
                        <FontAwesomeIcon icon={["fas", "fa-edit"]} />
                        <span>Edit Properties</span>
                    </Item>
                    <Item onClick={editor.editInternalField}>
                        <FontAwesomeIcon icon={["fas", "fa-edit"]} />
                        <span>Edit Internal Properties</span>
                    </Item>
                    <Item onClick={editor.editConditionalRenderingField}>
                        <FontAwesomeIcon icon={["fas", "fa-edit"]} />
                        <span>Conditional Rendering</span>
                    </Item>
                    <Item onClick={editor.cutField}>
                        <FontAwesomeIcon icon={["fas", "fa-cut"]} />
                        <span>Cut</span>
                    </Item>
                    <Item onClick={editor.copyField}>
                        <FontAwesomeIcon icon={["fas", "fa-copy"]} />
                        <span>Copy</span>
                    </Item>
                    <Item onClick={editor.deleteField}>
                        <FontAwesomeIcon icon={["fas", "fa-remove"]} />
                        <span>{t('common.delete')}</span>
                    </Item>
                    <Separator />
                    <Item onClick={editor.unselectField}>
                        <span>Unselect</span>
                    </Item>
                </Menu>
            }

            {editor && editor.state.selectedfield.length === 0 &&
                <Menu id={'carddesign_menu_' + sideType}>
                    <Item onClick={({ event }) => editor.pasteFieldFromMenu(event, canvasRef, sideType)}>
                        <FontAwesomeIcon icon={["fas", "fa-paste"]} />
                        <span>Paste</span>
                    </Item>
                    <Item onClick={editor.undoTemplate} disabled={editor.state.snapshots.undo.length <= 1}>
                        <span>Undo</span>
                    </Item>
                    <Item onClick={editor.redoTemplate} disabled={editor.state.snapshots.redo.length <= 1}>
                        <span>Redo</span>
                    </Item>
                    <Item onClick={editor.viewHistory} disabled={editor.state.snapshots.undo.length <= 1 && editor.state.snapshots.redo.length <= 0}>
                        <span>History...</span>
                    </Item>
                    <Separator />
                    <Item onClick={({ event }) => editor.addFieldFromList(event, canvasRef, sideType)}>
                        <span>Add field from list...</span>
                    </Item>
                    <Item onClick={editor.editGrid}>
                        <span>View Settings...</span>
                    </Item>
                    <Separator />
                    <Item onClick={() => editor.editBackground(sideType)}>
                        <span>Set Background...</span>
                    </Item>
                </Menu>
            }
        </div>
    );
}

export default withTranslation()(CardRenderer);
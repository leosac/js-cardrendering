/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import { useState } from 'react';
import { withTranslation } from "react-i18next";
import Form from 'react-bootstrap/Form';
import DesignerModal from "./DesignerModal";

function GridSettings({t, grid, show, onClose, onSubmit}) {
    const [unit, setUnit] = useState(grid.unit);
    const [step, setStep] = useState(grid.step);
    const [zoom, setZoom] = useState(grid.zoom * 100);
    const [columns, setColumns] = useState(grid.columns);
    const [rows, setRows] = useState(grid.rows);
    const [ruler, setRuler] = useState(grid.ruler);
    const [enabled, setEnabled] = useState(grid.enabled);

    function modalSubmit() {
        if (onSubmit) {
            onSubmit({
                unit: unit,
                step: (step >= 1) ? step : 1,
                zoom: zoom / 100,
                columns: columns,
                rows: rows,
                ruler: ruler,
                enabled: enabled
            });
        }
        if (onClose) {
            onClose();
        }
    }

    return (
        <DesignerModal id="editgrid" show={show} confirm={t('common.edit')} title={t('common.edit')} onClose={onClose} onSubmit={modalSubmit}>
            <Form.Group>
                <Form.Label>{t('properties.grid_unit')}</Form.Label>
                <Form.Control as="select" value={unit} onChange={e => setUnit(e.target.value)}>
                    <option value='px'>Pixel</option>
                    <option value='mm'>Millimeter</option>
                    <option value='in'>Inch</option>
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.grid_step')}</Form.Label>
                <Form.Control type="number" placeholder="6" value={step} onChange={e => setStep(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.grid_zoom')} (%)</Form.Label>
                <Form.Control type="number" placeholder="100" value={zoom} onChange={e => setZoom(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Check type="checkbox" label={t('properties.grid_ruler')} checked={ruler} onChange={e => setRuler(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Check type="checkbox" label={t('properties.grid_enable')} checked={enabled} onChange={e => setEnabled(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.grid_columns')}</Form.Label>
                <Form.Control type="number" placeholder="8" value={columns} onChange={e => setColumns(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>{t('properties.grid_rows')}</Form.Label>
                <Form.Control type="number" placeholder="6" value={rows} onChange={e => setRows(e.target.value)} />
            </Form.Group>
        </DesignerModal>
    );
}

export default withTranslation()(GridSettings);
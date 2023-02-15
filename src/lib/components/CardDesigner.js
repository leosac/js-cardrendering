/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import $ from 'jquery';
import React from "react";
import { withTranslation } from "react-i18next";
import FormTextEntry from "./FormTextEntry";
import GridSettings from "./GridSettings";
import AddFieldFromList from "./AddFieldFromList";
import GeneralHelper from "../GeneralHelper";
import FormValidator from "../form";
import {
    createTextField
} from '../edit/fieldFactory';
import {
    alignSelectedField, updateField, addFieldFromListConfirm, addFieldToCard,
    unselectField, cutField, copyField, pasteFieldFromMenu, deleteField, editConditionalRenderingField,
    addFieldFromList, editInternalField, editField
} from '../edit/fields';
import {
    editGrid, editGridConfirm, toggleGrid
} from '../edit/grid';
import {
    updateBackground, newCard, createCardStage, editCustomSize, editBackground
} from '../edit/card';
import {
    changeFactory, animate
} from '../edit/common';
import {
    onCardKeyDown, onCardKeyUp, onCardPaste
} from '../edit/onEvent';
import {
    loadSnapshot, saveCurrentSnapshot, undoTemplate, redoTemplate, viewHistory
} from '../edit/history';
import {
    printCardConfirm, printCard, printTemplate
} from '../edit/print';
import {
    downloadDPF, downloadImage
} from '../edit/download';
import {
    toDPF, loadDPF
} from '../edit/xml';
import CardRenderer from "./CardRenderer";
import FieldProperties from "./FieldProperties";
import { BarcodeProperties, CircleProperties, DataMatrixProperties, FingerprintProperties, LabelProperties,
    Pdf417Properties, PictureProperties, QrCodeProperties, RectangleProperties, UrlLinkProperties} from "./Fields";
import BackgroundProperties from "./BackgroundProperties";
import ConditionalRendering from "./ConditionalRendering";
import PrintCard from "./PrintCard";
import History from "./History";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import NavDivider from "./NavDivider"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class CardDesigner extends React.Component {

    constructor(props) {
        super(props);
        this.initProps();

        this.downloadDPF = downloadDPF.bind(this);
        this.downloadImage = downloadImage.bind(this);
        this.printTemplate = printTemplate.bind(this);
        this.printCard = printCard.bind(this);
        this.printCardConfirm = printCardConfirm.bind(this);
        this.onCardKeyDown = onCardKeyDown.bind(this);
        this.onCardKeyUp = onCardKeyUp.bind(this);
        this.onCardPaste = onCardPaste.bind(this);
        this.createTextField = createTextField.bind(this);
        this.updateField = updateField.bind(this);
        this.alignSelectedField = alignSelectedField.bind(this);
        this.addFieldFromListConfirm = addFieldFromListConfirm.bind(this);
        this.addFieldToCard = addFieldToCard.bind(this);
        this.changeFactory = changeFactory.bind(this);
        this.animate = animate.bind(this);
        this.newCard = newCard.bind(this);
        this.createCardStage = createCardStage.bind(this);
        this.editCustomSize = editCustomSize.bind(this);
        this.editBackground = editBackground.bind(this);
        this.updateBackground = updateBackground.bind(this);
        this.loadSnapshot = loadSnapshot.bind(this);
        this.saveCurrentSnapshot = saveCurrentSnapshot.bind(this);
        this.undoTemplate = undoTemplate.bind(this);
        this.redoTemplate = redoTemplate.bind(this);
        this.viewHistory = viewHistory.bind(this);
        this.editGrid = editGrid.bind(this);
        this.editGridConfirm = editGridConfirm.bind(this);
        this.toggleGrid = toggleGrid.bind(this);
        this.toDPF = toDPF.bind(this);
        this.loadDPF = loadDPF.bind(this);
        this.unselectField = unselectField.bind(this);
        this.cutField = cutField.bind(this);
        this.copyField = copyField.bind(this);
        this.pasteFieldFromMenu = pasteFieldFromMenu.bind(this);
        this.deleteField = deleteField.bind(this);
        this.editConditionalRenderingField = editConditionalRenderingField.bind(this);
        this.editInternalField = editInternalField.bind(this);
        this.editField = editField.bind(this);
        this.addFieldFromList = addFieldFromList.bind(this);

        this.blankimg = "data:image/png;base64,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";

        this.layouts = {};
        this.layouts['px'] = {
            cr80: [445, 280],
            res_4to3: [800, 600],
            res_3to2: [800, 533],
            res_8to5: [800, 500],
            res_5to3: [800, 480],
            res_16to9: [800, 450],
            custom: [445, 280]
        };
        this.layouts['mm'] = {
            cr80: [85.6, 54],	// CR-80 is always 85.6mm * 54mm
            res_4to3: [160, 120],
            res_3to2: [160, 106.6],
            res_8to5: [160, 100],
            res_5to3: [160, 96],
            res_16to9: [160, 90],
            custom: [85.6, 54]
        };
    
        this.layouts['in'] = {
            cr80: [3.3700, 2.1259],
            res_4to3: [6.2992, 4.7244],
            res_3to2: [6.2992, 4.1968],
            res_8to5: [6.2992, 3.9370],
            res_5to3: [6.2992, 3.7795],
            res_16to9: [6.2992, 3.5433],
            custom: [3.3700, 2.1259]
        };
    
        this.state = {
            grid: {
                enabled: false,
                columns: 8,
                rows: 6,
                step: 1,
                unit: 'px',
                ruler: true,
                scale: 1
            },
            snapshots: {
                undo: [],
                redo: [],
                history: []
            },
            sides: {
                recto: {
                    card: undefined,
                    stage: undefined,
                    factorytype: 'cursor',
                    bg_components: null,
                    renderer: undefined,
                    options: {}
                },
                verso: {
                    card: undefined,
                    stage: undefined,
                    factorytype: 'cursor',
                    bg_components: null,
                    renderer: undefined,
                    options: {}
                }
            },
            selectedside: 'recto',
            alerts: [],

            isRectoVerso: false,
            cardwidth: 0,
            cardheight: 0,
            cardborder: 3,
            currentlayout: GeneralHelper.getLayouts(this.props.enabledCardSizes)[0].value,
            orientation: 'Landscape',
            selectedfield: [],
            clipboardfield: null,
            clipboardfieldSideType: null,
            multiselection: false,
            rotationmode: false,
            preventkeystroke: false,
            preventkeystrokeModal: true,
            
            show_field: false,
            show_field_label: false,
            show_field_urllink: false,
            show_field_picture: false,
            show_field_barcode: false,
            show_field_qrcode: false,
            show_field_pdf417: false,
            show_field_datamatrix: false,
            show_field_rectangle: false,
            show_field_circle: false,
            show_field_fingerprint: false,
            show_conditionalrendering: false,
            show_background: false,
            show_gridsettings: false,
            show_addfieldfromlist: false,

            add_x: 0,
            add_y: 0
        }
    }

    initProps() {
        //Check if "cb_AtEdit" option is a function
        if (this.props.cb_AtEdit && typeof this.props.cb_AtEdit !== "function")
        {
            console.error('JsCardRendering : cb_AtEdit option is not a function, option removed.');
            delete this.props.cb_AtEdit;
        }

        if (!this.props.formatVersion) {
            this.props.formatVersion = "3.0.0.0";
        }
    }

    getSides() {
        return Object.keys(this.state.sides);
    }

    //This function check if used version is the required version
    checkFormatVersion(current, required, requireExact = false) {
        let x=current.split('.').map(e=> parseInt(e));
        let y=required.split('.').map(e=> parseInt(e));
        let z = "";

        for(let i=0;i<x.length;i++) {
            if(x[i] === y[i]) {
                z+="e";
            } else
            if(x[i] > y[i]) {
                z+="m";
            } else {
                z+="l";
            }
        }
        if (!z.match(/[l|m]/g)) {
            return 1;
        } else if (z.split('e').join('')[0] === "m") {
            if (!requireExact)
                return (1);
            else
                return (0)
        } else {
            return 0;
        }
    }

    errorState(fieldName){
        const e = new FormValidator('cardDesigner').getErrorFor(fieldName);
        return e ? 'has-error' : '';
    }
    
    errorMessage(fieldName) {
        return new FormValidator('cardDesigner').getErrorFor(fieldName);
    }

    showAlert(type, title, text) {
        this.state.alerts.push({
            type: type,
            title: title,
            text: text,
            show: true
        });
        this.setState({
            alerts: this.state.alerts
        });
    }
    
    versoDisplayStyle() {
        if (this.state.isRectoVerso)
        {
            return "block";
        }
        return "none";
    }
    
    multipleFieldSelected() {
        return (this.state.selectedfield.length > 1);
    }

    showCustomSize() {
        if (this.state.currentlayout === "custom")
            return (true);
        return (false);
    }

    getCustomSize(axe) {
        if (axe === "x")
            return (this.state.cardwidth);
        else
            return (this.state.cardheight);
    }

    showMessageInvalidFormatVersion(current) {
        if (!current || current !== "0.0.0.0")
            return (false);
        else
            return (true);
    }
    
    addDraggableField(target, side) {
        const field = $(target).closest(".draggableField");
        this.addFieldBtn(field, side);
    }

    addFieldBtn(target, side)
    {
        let field = this.createTextField({
            name: target.attr("data-name"),
            useMacros: false,
            value: target.attr("data-defaultValue") ? target.attr("data-defaultValue") : target.attr("data-name"),
            color: 0x000000,
            colorFill: -1,
            fontFamily: 'Verdana',
            fontSize: '12pt',
            fontStyle: 'Normal',
            align: 'TopLeft',
            borderWidth: 0,
            borderColor: 0x000000,
            scaleFont: false,
            autoSize: true,
            wordBreak: false,
            maxLength: 0,
            width: 46,
            height: 18,
            x: $("#carddesign_" + side).width() / 2,
            y: $("#carddesign_" + side).height() / 2,
            zIndex: 0,
            rotation: 0,
        });
        field.sideType = side;
        field.droppableId = target.attr("data-id");
        target.hide();
        this.addFieldToCard(field, side);
        this.saveCurrentSnapshot();
    }

    loadFile(ev) {
        const file = ev.files[0];
        //Prevent error when a template is loaded, selecting 'load from...' and 'cancel' during selection
        if (!file)
            return;

        const reader = new FileReader();
        reader.onload = (e) =>
        {
            const xmldoc = $.parseXML(e.target.result);
            let $xml = $(xmldoc);
            this.loadDPF($xml);
        };
        reader.onerror = (e) =>
        {
            alert("Error reading file.");
        };
        reader.readAsText(file, "UTF-8");
    }

    changeLayout(layout) {
        this.setState({
            currentlayout: layout
        })
    }

    async changeOrientation(orientation) {
        this.setState({orientation: orientation});
        await Promise.all(this.getSides().map(async sideType => {
            const side = this.state.sides[sideType];
            side.stage = await this.createCardStage(side, this.currentlayout, orientation, undefined, sideType, false);
        }));
    }

    componentDidMount() {
        //Actions when a modal is open
        $(document).on('show.bs.modal', (event) =>
        {
            //Disable keyblinds
            this.setState({
                preventkeystroke: true,
                preventkeystrokeModal: false
            });
        });

        //Actions when a modal is close
        $(document).on('hidden.bs.modal', (event) =>
        {
            //Activate keyblinds
            this.setState({
                preventkeystroke: false,
                preventkeystrokeModal: true
            });
        });

        $(document).on('keydown', (event) =>
        {
            this.onCardKeyDown(event);
        });
        $(document).on('keyup', (event) =>
        {
            this.onCardKeyUp(event);
        });
        $(document).on('paste', (event) =>
        {
            this.onCardPaste(event);
        });

        $('input').on('focus', () => {
            this.setState({
                preventkeystroke: true
            });
        });
        $('input').on('blur', () => {
            this.setState({
                preventkeystroke: false
            });
        });

        this.newCard(GeneralHelper.getLayouts(this.props.enabledCardSizes)[0].value);

        const content = this.props.content;
        if (content !== undefined)
        {
            setTimeout(() =>
            {
                var xmldoc = $.parseXML(content);
                let $xml = $(xmldoc);
    
                //TODO Make all functions related async
                this.loadDPF($xml).then(() => {
                    setTimeout(() => {
                        this.saveCurrentSnapshot();
                    }, 2500);
                });
            }, 1000);
        }
        else
        {
            this.saveCurrentSnapshot();
        }
        this.animate();
    
        //On Window Resize
        $(window).on('resize', (e) => {
            let xmldoc = $.parseXML(this.toDPF());
            let $xmlContent = $(xmldoc);
            let $templatecopied = $xmlContent.find('Template');
            this.getSides().forEach((sideType, index) => {
                const side = this.state.sides[sideType];
                if (side.stage)
                {
                    this.createCardStage(side, this.state.currentlayout, this.state.orientation,
                        $templatecopied.children('CardSides').children('CardSide').eq(index), sideType, true);
                }
            });
        });
    }

    render() {
        const { t } = this.props;
        return (
            <div>
                <span style={{visibility: 'hidden', fontFamily:'C39HrP24DhTt'}}>&nbsp;</span>
                <span style={{visibility: 'hidden', fontFamily:'C39HrP24DlTt'}}>&nbsp;</span>
                <span style={{visibility: 'hidden', fontFamily:'C39HrP36DlTt'}}>&nbsp;</span>
                <span style={{visibility: 'hidden', fontFamily:'C39HrP48DhTt'}}>&nbsp;</span>
                <span style={{visibility: 'hidden', fontFamily:'Code39'}}>&nbsp;</span>
                <span style={{visibility: 'hidden', fontFamily:'Code 93'}}>&nbsp;</span>
                <span style={{visibility: 'hidden', fontFamily:'Code 128'}}>&nbsp;</span>
                <span style={{visibility: 'hidden', fontFamily:'EanBwrP72Tt'}}>&nbsp;</span>
                <span style={{visibility: 'hidden', fontFamily:'UPC-A'}}>&nbsp;</span>
                <span style={{visibility: 'hidden', fontFamily: 'Code CodaBar'}}>&nbsp;</span>
            
                {this.showMessageInvalidFormatVersion(this.props.formatVersion) &&
                    <div id="invalidFormatVersion" className="alert alert-danger alert-dismissible" role="alert">
                        {t('create.invalidFormatVersion')}
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                }
                <form id="cardDesigner">
                    <div>
                        {this.state.alerts.map((alert, index) => {
                            return (
                                <Alert key={index} show={alert.show} variant={alert.type} onClose={() => alert.show = false} dismissible>
                                    <Alert.Heading>{alert.title}</Alert.Heading>
                                    <p>
                                        {alert.text}
                                    </p>
                                </Alert>
                            )
                        })}
                    </div>
                    <div className="row">
                        <FormTextEntry option='configuration_name' label='create.name'
                                placeholder='create.name_default' current={this.state.name} maxLength={this.props.maxNameLength}
                                tooltip={t('create.name_help')} show={this.props.name} />
            
                        <div className="col-md-6 row form-group">
                            <label className="col-md-6 col-form-label">
                                {t('create.orientation')}
                            </label>
                            <div className="col-md-4">
                                <Form.Control as="select" value={this.state.orientation} onChange={e => this.changeOrientation(e.target.value)}>
                                    <option value='Landscape'>{t('create.orientation_landscape')}</option>
                                    <option value='Portrait'>{t('create.orientation_portrait')}</option>
                                </Form.Control>
                            </div>
                        </div>
                    </div>
            
                    <div className="row">
                        <div className="col-md-6 row form-group">
                            <label className="col-md-6 col-form-label">
                                {t('common.ratio')}
                            </label>
                            <div className="col-md-4">
                                <Form.Control as="select" className="form-control field_type_selector" value={this.state.currentlayout} onChange={e => this.changeLayout(e.target.value)}>
                                    {GeneralHelper.getLayouts(this.props.enabledCardSizes).map(layout => {
                                        return(
                                            <option key={layout.value} value={layout.value}>
                                                {layout.textv}
                                                {layout.text &&
                                                    t(layout.text)
                                                }
                                            </option>
                                        )
                                    })}
                                </Form.Control>
                            </div>
                        </div>
                        <div className="col-md-6 row form-group">
                            <label className="col-md-6 col-form-label">
                                {t('properties.recto_verso')}
                            </label>
                            <div className="col-md-4">
                                <input type="checkbox" id="is_recto_verso" defaultChecked={this.state.isRectoVerso} />
                            </div>
                        </div>
                    </div>
            
                    <Navbar bg="light" expand="lg">
                        <Container>
                            <Navbar.Collapse id="wdcbtns">
                                <Nav className="me-auto">
                                    <NavDropdown title={(<span><FontAwesomeIcon icon={["fas", "fa-file"]} /> {t('create.new')}</span>)}>
                                        {GeneralHelper.getLayouts(this.props.enabledCardSizes).map(layout => {
                                            return (
                                                <NavDropdown.Item key={layout.value} href={'#new_' + layout.value} onClick={() => this.newCard(layout.value)}>{layout.textv}{t(layout.text)}</NavDropdown.Item>
                                            )
                                        })}
                                    </NavDropdown>
                                    <Nav.Link href="#load_file" onClick={() => $('#load_file').trigger('click')} id="load_file_link">
                                        <FontAwesomeIcon icon={["fas", "fa-cloud-upload-alt"]} /> {t('create.loadfile')}
                                        <input type="file" id="load_file" accept=".dpf" onChange={(e) => this.loadFile(e.target)} style={{display: 'none'}} />
                                    </Nav.Link>
                                    {this.checkFormatVersion(this.props.formatVersion, "3.0.0.0", false) && this.showCustomSize() &&
                                        <Nav.Link href="#">
                                            {t('properties.width')} <input id="templateSizeX" type="number" min="0" max="500" maxLength="4" value={this.getCustomSize('x')} onChange={e => this.editCustomSize('x', Number(e.target.value))} />
                                            {t('properties.height')} <input id="templateSizeY" type="number" min="0" max="500" maxLength="4" value={this.getCustomSize('y')} onChange={e => this.editCustomSize('y', Number(e.target.value))} />
                                        </Nav.Link>
                                    }
                                    <NavDivider />
                                    {this.props.enableDownload &&
                                        <NavDropdown title={(<span><FontAwesomeIcon icon={["fas", "cloud-download-alt"]} /> {t('create.download')}</span>)}>
                                            <NavDropdown.Item href="#download_dpf" onClick={() => this.downloadDPF()}>{t('create.download_template')}</NavDropdown.Item>
                                            <NavDropdown.Item href="#download_image" onClick={() => this.downloadImage()}>{t('create.download_image')}</NavDropdown.Item>
                                        </NavDropdown>
                                    }
                                    {this.props.enablePrint &&
                                        <NavDropdown title={(<span><FontAwesomeIcon icon={["fas", "fa-print"]} /> {t('create.print')}</span>)}>
                                            <NavDropdown.Item href="#print_template" onClick={() => this.printTemplate()}>{t('create.print_template')}</NavDropdown.Item>
                                            <NavDropdown.Item href="#print_card" onClick={() => this.printCard()}>{t('create.print_card')}</NavDropdown.Item>
                                        </NavDropdown>
                                    }
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>

                    {this.getSides().map(sideType => {
                        return (
                            <div key={sideType}>
                                <hr />
                                <Navbar bg="light" expand="lg">
                                    <Container>
                                        <Navbar.Collapse id={sideType + '_wdcbtns'}>
                                            <Nav className="me-auto">
                                                <Nav.Link id={sideType + '_factory_cursor'} href="#cursor" onClick={() => this.changeFactory('cursor', sideType)}>
                                                    <FontAwesomeIcon icon={["fas", "fa-mouse-pointer"]} /> {t('create.cursor')}
                                                </Nav.Link>
                                                <Nav.Link id={sideType + '_factory_label'} href="#label" onClick={() => this.changeFactory('label', sideType)}>
                                                    <FontAwesomeIcon icon={["fas", "fa-font"]} /> {t('create.label')}
                                                </Nav.Link>
                                                <Nav.Link id={sideType + '_factory_rectangle'} href="#rectangle" onClick={() => this.changeFactory('rectangle', sideType)}>
                                                    <div style={{display: 'inline-block', backgroundColor: '#777', width: '1em', height: '1em', verticalAlign: 'middle'}}></div> {t('create.rectangle')}
                                                </Nav.Link>
                                                <Nav.Link id={sideType + '_factory_circle'} href="#circle" onClick={() => this.changeFactory('circle', sideType)}>
                                                    <div style={{display: 'inline-block', backgroundColor: '#777', width: '1em', height: '1em', verticalAlign: 'middle', WebkitBorderRadius: '100px', MozBorderRadius: '0.5em', OBorderRadius: '0.5em', borderRadius: '0.5em'}}></div> {t('create.circle')}
                                                </Nav.Link>
                                                <Nav.Link id={sideType + '_factory_picture'} href="#picture" onClick={() => this.changeFactory('picture', sideType)}>
                                                    <FontAwesomeIcon icon={["fas", "fa-images"]} /> {t('create.picture')}
                                                </Nav.Link>
                        
                                                <NavDropdown title={(<span><FontAwesomeIcon icon={["fas", "fa-barcode"]} /> {t('common.codes')}</span>)}>
                                                    <NavDropdown.Item id={sideType + '_factory_barcode'} href="#barcode" onClick={() => this.changeFactory('barcode', sideType)}><FontAwesomeIcon icon={["fas", "fa-barcode"]} /> {t('create.barcode')}</NavDropdown.Item>
                                                    <NavDropdown.Item id={sideType + '_factory_qrcode'} href="#qrcode" onClick={() => this.changeFactory('qrcode', sideType)}><FontAwesomeIcon icon={["fas", "fa-qrcode"]} /> {t('create.qrcode')}</NavDropdown.Item>
                                                    <NavDropdown.Item id={sideType + '_factory_datamatrix'} href="#datamatrix" onClick={() => this.changeFactory('dataMatrix', sideType)}><FontAwesomeIcon icon={["fas", "fa-qrcode"]} /> {t('create.datamatrix')}</NavDropdown.Item>
                                                    <NavDropdown.Item id={sideType + '_factory_pdf417'} href="#pdf417" onClick={() => this.changeFactory('pdf417', sideType)}><FontAwesomeIcon icon={["fas", "fa-barcode"]} /> {t('create.pdf417')}</NavDropdown.Item>
                                                </NavDropdown>
                        
                                                {this.props.enableUnprintable &&
                                                    <NavDropdown title={(<span><FontAwesomeIcon icon={["fas", "fa-plus-circle"]} /> {t('common.unprintable')}</span>)}>
                                                        <NavDropdown.Item id={sideType + '_factory_fingerprint'} href="#fingerprint" onClick={() => this.changeFactory('fingerprint', sideType)}><FontAwesomeIcon icon={["fas", "fa-thumbs-up"]} /> {t('create.fingerprint')}</NavDropdown.Item>
                                                        <NavDropdown.Item id={sideType + '_factory_urllink'} href="#urllink" onClick={() => this.changeFactory('urllink', sideType)}><FontAwesomeIcon icon={["fas", "fa-globe-europe"]} /> {t('create.urllink')}</NavDropdown.Item>
                                                    </NavDropdown>
                                                }

                                                <NavDropdown title={t('create.align')}>
                                                    <NavDropdown.Item href="#align_left" onClick={() => this.alignSelectedField('left')}><FontAwesomeIcon icon={["fas", "fa-align-left"]} /> {t('create.align_left')}</NavDropdown.Item>
                                                    <NavDropdown.Item href="#align_right" onClick={() => this.alignSelectedField('right')}><FontAwesomeIcon icon={["fas", "fa-align-right"]} /> {t('create.align_right')}</NavDropdown.Item>
                                                    <NavDropdown.Item href="#align_top" onClick={() => this.alignSelectedField('top')}><FontAwesomeIcon icon={["fas", "fa-arrow-up"]} /> {t('create.align_top')}</NavDropdown.Item>
                                                    <NavDropdown.Item href="#align_bottom" onClick={() => this.alignSelectedField('bottom')}><FontAwesomeIcon icon={["fas", "fa-arrow-down"]} /> {t('create.align_bottom')}</NavDropdown.Item>
                                                    <NavDropdown.Item href="#align_vertical" onClick={() => this.alignSelectedField('vertical')}><FontAwesomeIcon icon={["fas", "fa-grip-lines-vertical"]} /> {t('create.align_vertical')}</NavDropdown.Item>
                                                    <NavDropdown.Item href="#align_horizontal" onClick={() => this.alignSelectedField('horizontal')}><FontAwesomeIcon icon={["fas", "fa-grip-lines"]} /> {t('create.align_horizontal')}</NavDropdown.Item>
                                                    <NavDropdown.Item href="#grid" onClick={() => this.toggleGrid()}><FontAwesomeIcon icon={["fas", "fa-border-all"]} /> {t('create.grid')}</NavDropdown.Item>
                                                </NavDropdown>
                                            </Nav>
                                        </Navbar.Collapse>
                                    </Container>
                                </Navbar>
                    
                                <div className="row">
                                    <div className="col-md-12 text-center">
                                        <CardRenderer sideType={sideType} editor={this} />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    
                    {this.props.enableSubmitBtn &&
                        <div className="text-right edit-create-button-template">
                            {this.props.create
                                ? <button type="submit" className="btn btn-lg btn-success">{t('common.create')}</button>
                                : <button id="print_submit" type="submit" className="btn btn-lg btn-success">{t('common.validate')}</button>
                            }
                        </div>
                    }

                    {this.props.draggableFields &&
                        <div id="carddesign_draggableFields">
                            <hr />
                            <p className="h5">{t('dragdropfields.title')}</p>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                <span></span>
                                            </th>
                                            <th scope="col">
                                                {t('properties.recto')}
                                            </th>
                                            <th scope="col" style={{display: this.state.isRectoVerso ? '' : 'none'}}>
                                                {t('properties.verso')}
                                            </th>
                                            <th scope="col">
                                                {t('common.name')}
                                            </th>
                                            <th scope="col">
                                                {t('dragdropfields.default_value')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.draggableFields.map((field, index) => {
                                            return (
                                                <tr key={field.name} className="draggableField" data-name={field.name} data-type={field.type} data-defaultValue={field.default_value} data-id={index}>
                                                    <td className="">
                                                        <i className="fas fa-th"></i>
                                                    </td>
                                                    <td className="">
                                                        <i className="fas fa-plus-square draggableFieldAddRecto" onClick={e => this.addDraggableField(e.target, 'recto')}></i>
                                                    </td>
                                                    <td className="" style={{display: this.state.isRectoVerso ? 'block' : 'none'}}>
                                                        <i className="fas fa-plus-square draggableFieldAddVerso" onClick={e => this.addDraggableField(e.target, 'verso')}></i>
                                                    </td>
                                                    <td className="">
                                                        {field.name}
                                                    </td>
                                                    <td className="">
                                                        {field.default_value}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }
                </form>

                {this.state.selectedfield.length > 0 &&
                    <div>
                        <FieldProperties show={this.state.show_field} field={this.state.selectedfield[0].options} onClose={() => this.setState({show_field: false})} onSubmit={this.updateField} />
                        <ConditionalRendering show={this.state.show_conditionalrendering} entries={this.state.selectedfield[0].options.conditionalRenderingEntries} onClose={() => this.setState({show_conditionalrendering: false})} onSubmit={entries => this.updateField({conditionalRenderingEntries: entries})} />
                        <LabelProperties show={this.state.show_field_label} field={this.state.selectedfield[0].options} onClose={() => this.setState({show_field_label: false})} onSubmit={this.updateField} />
                        <UrlLinkProperties show={this.state.show_field_urllink} field={this.state.selectedfield[0].options} onClose={() => this.setState({show_field_urllink: false})} onSubmit={this.updateField} />
                        <PictureProperties show={this.state.show_field_picture} field={this.state.selectedfield[0].options} onClose={() => this.setState({show_field_picture: false})} onSubmit={this.updateField} />
                        <BarcodeProperties show={this.state.show_field_barcode} field={this.state.selectedfield[0].options} onClose={() => this.setState({show_field_barcode: false})} onSubmit={this.updateField} />
                        <QrCodeProperties show={this.state.show_field_qrcode} field={this.state.selectedfield[0].options} onClose={() => this.setState({show_field_qrcode: false})} onSubmit={this.updateField} />
                        <Pdf417Properties show={this.state.show_field_pdf417} field={this.state.selectedfield[0].options} onClose={() => this.setState({show_field_pdf417: false})} onSubmit={this.updateField} />
                        <DataMatrixProperties show={this.state.show_field_datamatrix} field={this.state.selectedfield[0].options} onClose={() => this.setState({show_field_datamatrix: false})} onSubmit={this.updateField} />
                        <RectangleProperties show={this.state.show_field_rectangle} field={this.state.selectedfield[0].options} onClose={() => this.setState({show_field_rectangle: false})} onSubmit={this.updateField} />
                        <CircleProperties show={this.state.show_field_circle} field={this.state.selectedfield[0].options} onClose={() => this.setState({show_field_circle: false})} onSubmit={this.updateField} />
                    </div>
                }
                <BackgroundProperties show={this.state.show_background} background={this.state.sides[this.state.selectedside].options} onClose={() => this.setState({show_background: false})} onSubmit={background => this.updateBackground(this.state.selectedside, background)} />
                <PrintCard show={this.state.show_printcard} onClose={() => this.setState({show_printcard: false})} onSubmit={this.printCardConfirm} />                            
                <AddFieldFromList show={this.state.show_addfieldfromlist} fieldlist={this.props.fieldlist} onClose={() => this.setState({show_addfieldfromlist: false})} onSubmit={this.addFieldFromListConfirm} />
                <GridSettings show={this.state.show_gridsettings} grid={this.state.grid} onClose={() => this.setState({show_gridsettings: false})} onSubmit={this.editGridConfirm} />
                <History show={this.state.show_history} snapshots={this.state.snapshots.history} onClose={() => this.setState({show_history: false})} onSubmit={this.loadSnapshot} />
            </div>
        );
    }
}

CardDesigner.defaultProps = {
    formatVersion: '3.0.0.0',
    lang: 'en',
    enabledCardSizes: {
        cr80: true,
        res_4to3: true,
        res_3to2 : true,
        res_8to5: true,
        res_5to3: true,
        res_16to9 : true,
        custom: true
    },
    enableUnprintable: false,
    enableName: true,
    enableSubmitBtn: true,
    cb_AtEdit: undefined
}

export default withTranslation()(CardDesigner);
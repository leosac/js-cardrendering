/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import $ from 'jquery';
import moment from 'moment';
import { useState } from 'react';
import { withTranslation } from "react-i18next";
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import Carousel from 'react-bootstrap/Carousel';
import DesignerModal from "./DesignerModal";

function History({t, snapshots, show, editor, onClose, onSubmit}) {
    const [dates, setDates] = useState([new Date(), null]);
    const [index, setIndex] = useState(0);

    function onDatesChange(newDates) {
        setDates(newDates);

        $('.history-carousel-item').each(function () {
            let lidate = moment($(this).attr('snapdate'), 'D/M/Y HH:mm:ss:SSS');
            if (!newDates[1])
            {
                if (lidate.isSameOrAfter(newDates[0], 'minute') && lidate.isSameOrBefore(newDates[1], 'minute'))
                    $(this).show();
                else
                    $(this).hide();
            }
            else 
            {
                if (lidate.isSameOrAfter(newDates[0], 'minute'))
                    $(this).show();
                else
                    $(this).hide();
            }
        });
    }

    function reduceDate(date)  {
        return (moment(date, 'D/M/Y HH:mm:ss:SSS').format('D/M/Y HH:mm'));
    }

    function modalSubmit() {
        if (onSubmit) {
            onSubmit(snapshots[index]);
        }
        if (onClose) {
            onClose();
        }
    }

    return (
        <DesignerModal id="snapshothistory" show={show} editor={editor} confirm={t('common.goto')} title={t('create.history')} onClose={onClose} onSubmit={modalSubmit}>
            <Carousel activeIndex={index} onSelect={(selectedIndex, e) => setIndex(selectedIndex)}>
                {snapshots.map((snapshot, index) => {
                    return (
                        <Carousel.Item key={index} className="history-carousel-item">
                            <img className="d-block w-100" src={snapshot.preview} alt={"HISTORY IMAGE " + index} />
                            <Carousel.Caption>
                                <h5><i className="far fa-clock"></i>{reduceDate(snapshot.date)}</h5>
                            </Carousel.Caption>
                        </Carousel.Item>
                    )
                })}
                <hr />
                <div className="container">
                    <div className="row">
                        <DateTimeRangePicker onChange={onDatesChange} value={dates} />
                    </div>
                </div>
            </Carousel>
        </DesignerModal>
    );
}

export default withTranslation()(History);
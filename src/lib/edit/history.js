/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import $ from 'jquery';
import moment from 'moment';
import {
    toDPF, loadDPF
} from './xml';

import {
    getRectoCanvasSnap
} from './card';

async function undoTemplate()
{
    if (this.state.snapshots.undo.length > 1) {
        let snapshot = this.state.snapshots.undo.pop();
        addSnapshotToHistory(this.state.snapshots.redo, snapshot);
        snapshot = this.state.snapshots.undo[this.state.snapshots.undo.length - 1];

        await loadSnapshot(snapshot);
    }
}

async function redoTemplate()
{
    if (this.state.snapshots.redo.length > 0) {
        let snapshot = this.state.snapshots.redo.pop();
        addSnapshotToHistory(this.state.snapshots.undo, snapshot);

        await loadSnapshot(snapshot);
    }
}

async function loadSnapshot(snapshot)
{
    var xmldoc = $.parseXML(snapshot.content);
    let $xml = $(xmldoc);
    await loadDPF.call(this, $xml);
}

function viewHistory()
{
    this.state.snapshots.history = this.state.snapshots.undo.concat(this.state.snapshots.redo).reverse();
    this.setState({
        snapshots: this.state.snapshots,
        show_history: true
    });
}

function createSnapshot(preview)
{
    if (preview === undefined) {
        preview = false;
    }

    const snapshot = {
        name: this.state.name,
        orientation: this.state.orientation,
        layout: this.state.currentlayout,
        isCard: (this.state.currentlayout === "cr80" || this.state.currentlayout === "custom"), // check should be improved
        content: toDPF.call(this)
    };

    if (preview) {
        const side = this.state.sides['recto'];
        //Disable Grid
        if (side.grid)
        side.grid.visible = false;

        //Disable Highlights
        if (side.highlights)
        {
            side.highlights.forEach((h) => {h.visible = false;});
        }

        //Disable resize/rotate boxes
        side.card.children.forEach(child => {
            if (child.box)
            {
                child.box.visible = false;
            }
        });
        const resizedCanvas = getRectoCanvasSnap.call(this);
        snapshot.preview = resizedCanvas.toDataURL("image/png");

        //Enable Grid
        if (side.grid)
        side.grid.visible = true;
        //Enable Highlights
        if (side.highlights)
        {
            side.highlights.forEach((h) => {h.visible = true;});
        }

        //Enable resize/rotate boxes
        side.card.children.forEach(child => {
            if (child.box)
            {
                child.box.visible = true;
            }
        });
    }

    //Optional edit callback
    if (this.cb_AtEdit)
        this.cb_AtEdit(snapshot);
    return snapshot;
}

function saveCurrentSnapshot()
{
    let snapshot = createSnapshot.call(this, true);
    snapshot.date = new Date();

    let skip = false;
    if (this.state.snapshots.undo.length > 0) {
        let lastsnapshot = this.state.snapshots.undo[this.state.snapshots.undo.length - 1];
        if (lastsnapshot.content === snapshot.content) {
            // Skip if latest snapshot content is the same
            skip = true;
        } else if (lastsnapshot.date && lastsnapshot.date.getTime() > snapshot.date.getTime() - 500) {
            // Avoid creating to much snapshots per seconds
            skip = true;
        }
    }

    if (!skip) {
        if (this.state.snapshots.redo.length > 0) {
            this.state.snapshots.redo = [];
        }
        addSnapshotToHistory.call(this, this.state.snapshots.undo, snapshot);
    }
}

function addSnapshotToHistory(history, snapshot)
{
    // Save 30 snapshots max
    if (history.length === 30) {
        history.shift();
    }
    snapshot.lastuser = this.props.t('common.you')
    history.push(snapshot);
}

export {
    undoTemplate, redoTemplate, loadSnapshot, viewHistory,
    createSnapshot ,saveCurrentSnapshot, addSnapshotToHistory
}
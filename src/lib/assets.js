/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import * as PIXI from "pixi.js";

class Assets {
    constructor(cardside) {
        this.cardside = cardside;
    }

    drawAssets() {
        const assets = this.cardside.data.card.layout.assets;
        if (assets && this.cardside.graphics.card) {
            if (assets.safetyarea) {
                this.cardside.graphics.card.addChild(this.createSafetyArea());
            }
            if (assets.contactchip) {
                this.cardside.graphics.card.addChild(this.createContactChip());
            }
            if (assets.magstripe_1to2) {
                this.cardside.graphics.card.addChild(this.createMagstripe_1to2());
            }
            if (assets.magstripe_5to16) {
                this.cardside.graphics.card.addChild(this.createMagstripe_5to16());
            }
            if (assets.luggagetagslot) {
                this.cardside.graphics.card.addChild(this.createLuggageTagSlot());
            }
        }
    }

    createSafetyArea() {
        const offset = 15;
        const asset = new PIXI.Graphics();
        asset.lineStyle(1, 0x7ED321, 1);
        asset.drawRoundedRect(offset, offset, this.cardside.data.card.width - (2 * offset), this.cardside.data.card.height - (2 * offset), 20);
        asset.options = {};
        asset.options.zIndex = 1000;
        return asset;
    }

    createContactChip() {

    }

    createMagstripe_1to2() {

    }

    createMagstripe_5to16() {

    }

    createLuggageTagSlot() {

    }
}

export default Assets;
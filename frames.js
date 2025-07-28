export class Frames {
	constructor (model) {
		// store the model
		this.model = model;
        // set up storage for a bank of sprites
        this.bank = [];
        this.active = 0;
        // build the interface if desired
        this.redraw();
    }
    // store and retrieve the active index
    get index() {
        return this.active;
    }
    set index(id) {
        this.active = id;
        this.redraw();
    }
    // store and retrieve the entire bank in json format
    get json() {
        return JSON.stringify(this.bank);
    }
    set json(jsonData) {
        this.bank = JSON.parse(jsonData);
        this.redraw();
    }
    // redraw the interface to reflect the stored bitmaps and active index
    redraw() {
        // if the bank has a container 
        if (this.model.container) {
            // TODO: build a grid interface
            // TODO: populate it with all the sprites from the bank
            // TODO: make the sprites selectable
            // TODO: make the last grid element an "add" button
            // TODO: reorder the sprites in the bank using drag and drop
        }
    }
    // retrieve a bitmap from the bank
    load(index) {
        // return the bitmap from the requested or the active index
        index = (index || index === 0) ? index : this.index;
        return this.bank[index];
    }
    // store a bitmap in the bank
    save(bitmap, index) {
        // store the bitmap to an existing or a new index
        index = (index || index === 0) ? index : this.bank.length;
        this.bank[index] = bitmap;
        return index;
    }
    // update a bitmap in the bank
    update(bitmap, index) {
        // store the bitmap to an existing or the active index
        index = (index || index === 0) ? index : this.index;
        this.bank[index] = bitmap;
        return index;
    }
}

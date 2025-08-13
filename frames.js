import { Sprite } from "./sprite.js";

export class Frames {
	constructor (model) {
		// store the model
		this.model = model;
        // set up storage for a bank of sprites
        this.bank = [
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAcHAAAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAcHBwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwcHBwAAAAAAAAAAAAcAAAAABwAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAAHBwcHBwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwcHBwcAAAAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAcHAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAHAAAAAAAAAAAHBwcHBwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        ];
        this.previews = [];
        this.active = 0;
        this.buffer = null;
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
        // if the bank requires an interface 
        if (this.model.container) {
            // clear the container
            this.model.container.innerHTML = '';
            // populate it with all the sprites from the bank
            for (let index in this.bank) {
                // convert the index into a number
                index = +index;
                // make the sprite selectable
                let label = document.createElement('label');
                let radio = document.createElement('input');
                radio.setAttribute('type','radio');
                radio.setAttribute('name', 'frame');
                radio.setAttribute('value', index);
                radio.checked = (this.active === index);
                label.appendChild(radio);
                // add a preview
                this.previews[index] = new Sprite({
                    'container': label,
                    'width': this.model.width,
                    'height': this.model.height,
                    'padding': this.model.padding,
                    'layers': this.model.layers,
                    'shades': this.model.shades
                });
                this.previews[index].hex = this.bank[index];
                // add button to shift the position in the bank left
                let shiftLeft = document.createElement('button');
                shiftLeft.innerHTML = '&lt;';
                shiftLeft.disabled = (index === 0);
                shiftLeft.setAttribute('data-action', 'shift_left');
                shiftLeft.addEventListener('click', this.shift.bind(this, index, -1));
                label.appendChild(shiftLeft);
                // add a number label
                let span = document.createElement('span');
                span.innerHTML = index;
                label.appendChild(span);
                // add button to shift the position in the bank right
                let shiftRight = document.createElement('button');
                shiftRight.innerHTML = '&gt;';
                shiftRight.disabled = (index === this.bank.length - 1);
                shiftRight.setAttribute('data-action', 'shift_left');
                shiftRight.addEventListener('click', this.shift.bind(this, index, 1));
                label.appendChild(shiftRight);
                // add button to delete this frame
                let deleteFrame = document.createElement('button');
                deleteFrame.innerHTML = 'x';
                deleteFrame.setAttribute('data-action', 'delete_frame');
                deleteFrame.addEventListener('click', this.delete.bind(this, index));
                label.appendChild(deleteFrame);
                // handle making a selection
                radio.addEventListener('change', this.select.bind(this, index));
                // add the selector to the container
                this.model.container.appendChild(label);
            }
            // make the last grid element action controls
            const nav = document.createElement('nav');
            nav.setAttribute('class', 'actions')
            // add an "add" button
            const addButton = document.createElement('button');
            addButton.setAttribute('data-action', 'add_frame');
            addButton.addEventListener('click', this.add.bind(this));
            addButton.innerHTML = '+';
            nav.appendChild(addButton);
            // add a "copy" button
            const copyButton = document.createElement('button');
            copyButton.setAttribute('data-action', 'copy_frame');
            copyButton.addEventListener('click', this.copy.bind(this));
            copyButton.innerHTML = 'Copy';
            nav.appendChild(copyButton);
            // add a "paste" button
            const pasteButton = document.createElement('button');
            pasteButton.setAttribute('data-action', 'paste_frame');
            pasteButton.addEventListener('click', this.paste.bind(this));
            pasteButton.innerHTML = 'Paste';
            nav.appendChild(pasteButton);
            // add copy, paste, add, delete buttons to the container
            this.model.container.appendChild(nav);
        }
    }
    // select an active frame from the bank
    select(index) {
        // select the active bitmap
        this.active = index;
        // call back the parent
        this.model.handler();
    }
    // shift the position of a frame in the bank
    shift(sourceIndex, direction, evt) {
        // cancel the click
        evt?.preventDefault();
        // reorder the bank
        let destinationIndex = sourceIndex + direction;
        if (destinationIndex > -1 && destinationIndex < this.bank.length) {
            let destinationValue = this.bank[destinationIndex];
            this.bank[destinationIndex] = this.bank[sourceIndex];
            this.bank[sourceIndex] = destinationValue;
        }
        // redraw the interface
        this.redraw();
        // call back to parent
        this.model.handler();
    }
    // add a new frame to the bank
    add(evt) {
        evt?.preventDefault();
        // add a new item at the end of the bank
        this.bank.push(null);
        // update the interface
        this.redraw();
    }
    // TODO: remove a frame from the bank
    delete(index, evt) {
        evt?.preventDefault();
        // remove the active item from the bank
        this.bank.splice(index, 1);
        // update the interface
        this.redraw();
    }
    // TODO: copy the contents of a frame
    copy(evt) {
        evt?.preventDefault();
        // store the contents of the active item
        this.buffer = this.bank[this.active];
        // update the interface
        this.redraw();
    }
    // TODO: paste the contents of a frame
    paste(evt) {
        evt?.preventDefault();
        // insert the stored contents in the active item
        this.bank[this.active] = this.buffer;
        // update the interface
        this.redraw();
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
        // redraw the bank interface if needed
        this.redraw();
        // report back the index
        return index;
    }
    // update a bitmap in the bank
    update(bitmap, index) {
        // store the bitmap to an existing or the active index
        index = (index || index === 0) ? index : this.index;
        this.bank[index] = bitmap;
        // redraw the bank interface if needed
        this.redraw();
        // report back the index
        return index;
    }
}

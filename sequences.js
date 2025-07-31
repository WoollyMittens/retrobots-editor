export class Sequences {
	constructor (model) {
		// store the model
		this.model = model;
        // set up storage for a bank of sequences
		this.bank = {};
		this.step = 0;
		this.active = null;
		// build the interface if desired
		this.redraw();
    }
    // redraw the interface to reflect the stored sequences and active index
	redraw() {
        // if the bank requires an interface
        if (this.model.container) {
            // clear the container
            //this.model.container.innerHTML = '';
			// create the blank selector
			// create the selector list
				// create the selector radio
				// create the name field
				// create the frames field
				// create the remove button
			// create the add button
		}
	}
	// add a new sequence to the list
	add() {}
	// remove a sequence from the list
	remove(name) {}
	// rename a sequence
	rename(name, input) {}
	// update a sequence
	update(name, input) {}
}

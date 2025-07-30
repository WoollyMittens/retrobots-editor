export class Sequences {
	constructor (model) {
		// store the model
		this.model = model;
        // set up storage for a bank of sequences
		this.bank = [];
		this.step = 0;
		this.active = 0;
		// build the interface if desired
		this.redraw();
    }
    // redraw the interface to reflect the stored sequences and active index
	redraw() {
        // if the bank requires an interface
        if (this.model.container) {

		}
	}
}

import { Sprite } from "./sprite.js";

export class Preview {
	constructor (model) {
		// store the model
		this.model = model;
		this.sequences = model.sequences;
		this.frames = model.frames;
		// create the sprite in the preview container
		this.sprite = new Sprite({
			'container': this.model.container,
			'width': this.frames.model.width,
			'height': this.frames.model.height,
			'padding': this.frames.model.padding,
			'layers': this.frames.model.layers,
			'shades': this.frames.model.shades
		});
		// the current playing sequence
		this.sequence = '';
		this.counter = 0;
		this.timeout = null;
		// set the intial values
		this.rate = 0.25;
		this.scale = 0.5;
	}

	update() {
		// cancel any queued update
		clearTimeout(this.timeout);
		// reset the counter if the active sequence has changed
		if (this.sequence != this.sequences.active) {
			// make this the currently playing one
			this.sequence = this.sequences.active;
			// reset the frame count
			this.counter = 0;
		}
		// if the active sequence is currently playing
		if (this.sequence != '') {
			// increment the step count
			this.counter = (this.counter + 1) % this.sequences.bank[this.sequence].length;
			// show the corresponding frame from the sequence
			const index = this.sequences.bank[this.sequence][this.counter];
			this.sprite.hex = this.frames.bank[index];
			// queue the next update at the set rate
			const delay = 1000 / Math.max(60 * this.rate, 1);
			this.timeout = setTimeout(this.update.bind(this), delay);
		}
		// or
		else {
			// just display the active frame from the bank
			this.sprite.hex = this.frames.load();
		}
	}

	set direction(value) {
		this.sprite.direction = value;
	}

	get direction() {
		return this.sprite.direction;
	}

	set scale(value) {
		// convert the value to a range of scales
		const min = 1;
		const max = this.model.container.offsetWidth / +this.sprite.svg.getAttribute('width');
		const scale = Math.floor((max-min)*value+min);
		// apply the zoom value as a transformation style
		this.sprite.svg.style.transform = `scale(${scale})`;
	}

	get scale() {
		// convert the scale to a fraction
		const min = 1;
		const max = this.model.container.offsetWidth / +this.sprite.svg.getAttribute('width');
		// get the zoom value from the transformation style
		const transformValue = this.sprite.svg.style.transform || 'scale(1)';
		const zoomValue = parseFloat(transformValue.split('scale(').pop());
		return (zoomValue-min)/(max-min);
	}

	set background(value) {
		// apply the background colour as a container style
		this.model.container.style.backgroundColor = value;
	}

	get background() {
		// get the background colour from the container style
		return this.model.container.style.backgroundColor;
	}
}

import { Sprite } from "./sprite.js";

export class Preview {
	constructor (model) {
		// store the model
		this.model = model;
		// create the sprite in the preview container
		this.sprite = new Sprite(model);
		// set the intial values
		this.rate = 0.5;
		this.scale = 0.5;
	}

	set frame(value) {
		this.sprite.hex = value;
	}

	get frame() {
		return this.sprite.hex;
	}

	set direction(value) {
		this.sprite.direction = value;
	}

	get direction() {
		return this.sprite.direction;
	}

	set sequence(value) {}

	get sequence() { return null; }

	set step(value) {}

	get step() { return null; }

	set rate(value) {}

	get rate() { return null; }

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

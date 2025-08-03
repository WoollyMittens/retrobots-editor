import { Palette } from "./palette.js";
import { Sprite } from "./sprite.js";
import { Frames } from "./frames.js";
import { Sequences } from "./sequences.js";

class ParallexSpriteEditor {
	constructor(model) {
		// store the model
		this.model = model;
		this.red = 0;
		this.green = 0;
		this.blue = 0;
		this.alpha = 1;
		// connect the output
		this.encoded = document.querySelector(model.encoded);
		this.encoded.addEventListener('change', this.decodeInput.bind(this));
		// establish the sprite dimensions
		const width = model.width;
		const height = model.height;
		const padding = model.padding;
		const layers = model.layers;
		const shades = model.shades;
		// build the frames]
		this.frames = new Frames({
			container: document.querySelector(this.model.frames), 
			handler: this.update.bind(this), 
			width, height, padding, layers, shades
		});
		// build the sequences
		this.sequences = new Sequences({
			container: document.querySelector(this.model.sequences)
		});
		// build the sprite
		this.sprite = new Sprite({
			container: document.querySelector(model.canvas), 
			width, height, padding, layers, shades
		});
		this.sprite.hex = this.frames.load();
		// only show the directions if applicable
		this.directions = document.querySelector(model.directions);
		this.showDirections();
		// populate the colour palette
		this.palette = new Palette({
			container: document.querySelectorAll(`${model.palette}, ${model.opacity}`), 
			handler: this.changePalette.bind(this), 
			shades
		});
		// handle the drawing clicks
		this.handleDrawing();
		// populate the layer selector
		this.stack = document.querySelector(model.stack);
		this.buildStack(model.layers);
		// update the preview
		// TODO: move to a class that shows the frame, playback controls, and loops the sequence
		this.preview = new Sprite({
			container: document.querySelector(model.preview), 
			width, height, padding, layers, shades
		});
		this.updatePreview();
		// handle the controls TODO: handle clicks as well as changes
		this.controls = document.querySelector(model.controls);
		this.controls.addEventListener('submit', (evt) => { evt.preventDefault() });
		const actions = this.controls.querySelectorAll('[data-action]');
		for (let action of actions) {
			action.addEventListener('click', this.handleActions.bind(this, action));
		}
		const settings = this.controls.querySelectorAll('[data-setting]');
		for (let setting of settings) {
			setting.addEventListener('click', this.handleSettings.bind(this, setting));
		}
	}

	update() {
		// reload the active sprite from the bank
		this.sprite.hex = this.frames.load();
		// redraw the preview
		this.updatePreview();
	}

	showDirections() {
		// only show if there are parallax layers
		if (this.model.layers.length > 1) { this.directions.removeAttribute('disabled') }
		else { this.directions.setAttribute('disabled', '') }
	}

	buildStack(layers) {
		// for every layer in the stack
		for (let name of layers) {
			// add a visibility control
			let control = document.createElement('input');
			control.setAttribute('type', 'checkbox');
			control.setAttribute('name', 'stack');
			control.setAttribute('value', name);
			control.setAttribute('data-action', 'stack');
			control.checked = true;
			this.stack.appendChild(control);
		}
		// only show if there are parallax layers
		if (this.model.layers.length > 1) { this.stack.removeAttribute('disabled') }
		else { this.stack.setAttribute('disabled', '') }
	}

	applyPixel(index, evt) {
		// stop click through
		evt.stopPropagation();
		// formulate the colour code
		const colour = (this.alpha > 0) ? `rgba(${this.red},${this.green},${this.blue},${this.alpha})` : 'rgba(0,0,0,0)';
		// apply the colour code
		this.sprite.paint(index, colour);
		// update the preview
		this.updatePreview();
	}

	handleDrawing() {
		// for all of the sprite's individual pixels
		const rectangles = this.sprite.rectangles;
		for (let index in rectangles) {
			rectangles[index].addEventListener('click', this.applyPixel.bind(this, index));
		}
	}

	handleActions(element) {
		// handle controls with a predefined action
		const action = element.getAttribute('data-action');
		switch(action) {
			case 'nw': this.changeDirection(-1, -1, -1); break;
			case 'n': this.changeDirection(0, -1, -1); break;
			case 'ne': this.changeDirection(1, -1, -1); break;
			case 'w': this.changeDirection(-1, 0, 0); break;
			case 'x': this.changeDirection(0, 0, 0); break;
			case 'e': this.changeDirection(1, 0, 0); break;
			case 'sw': this.changeDirection(-1, 1, 1); break;
			case 's': this.changeDirection(0, 1, 1); break;
			case 'se': this.changeDirection(1, 1, 1); break;
			case 'stack': this.changeStack(element); break;
			default: console.log('unassigned action:', action);
		}
	}

	handleSettings(element) {
		// TODO: handle controls with a configuration value
		const setting = element.getAttribute('data-setting');
		switch(setting) {
			default: console.log('unassigned setting:', setting);
		}
	}

	changeDirection(x, y, z) {
		// call the sprite to update
		this.sprite.direction = {x, y, z};
		// update the preview
		this.updatePreview();
	}

	changePalette(colour) {
		// set the active colour values
		this.red = colour.red;
		this.green = colour.green;
		this.blue = colour.blue;
		// set the active alpha value
		this.alpha = colour.alpha;
	}

	changeStack(control) {
		const name = control.value;
		const state = control.checked;
		// show or hide the layer
		this.sprite.layers[name].style.display = state ? 'block' : 'none';
	}

	updatePreview() {
		// TODO: get the active sequence
		const spriteSequence = null;
		const spriteStep = null;
		// get the hex value of the sprite
		const spriteHex = this.sprite.hex;
		const spriteDirection = this.sprite.direction;
		// mirror the bitmap in the preview
		this.preview.hex = spriteHex;
		// mirror the direction in the preview
		this.preview.direction = spriteDirection;
		// export the binary bitmap as base64
		this.frames.update(spriteHex);
		// preview the bank json
		// TODO: export both the frames and sequences
		this.encoded.value = this.frames.json;
	}

	decodeInput() {
		// import the bank from the preview field
		// TODO: import both the frames and sequences
		this.frames.json = this.encoded.value;
		// load the active/default frame from the bank
		this.sprite.hex = this.frames.load();
		// redraw the preview
		this.updatePreview();
	}
}

window.editor = new ParallexSpriteEditor({
	'canvas': '.sprite-canvas',
	'preview': '.sprite-preview',
	'controls': '.sprite-controls',
	'palette': '.sprite-palette',
	'opacity': '.sprite-opacity',
	'stack': '.sprite-stack',
	'directions': '.sprite-directions',
	'encoded': '.sprite-encoded textarea',
	'frames': '.sprite-frames > div',
	'sequences': '.sprite-sequences > div',
	'width': 16,
	'height': 16,
	'padding': 1,
	'layers': ['back', 'middle', 'front'],
	'shades': [0X00,0X55,0XAA,0XFF]
});

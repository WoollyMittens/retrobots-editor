import { Palette } from "./palette.js";
import { Sprite } from "./sprite.js";

class ParallexSpriteEditor {
	constructor(model) {
		// store the model
		this.model = model;
		this.layers = {};
		this.bitmaps = {};
		this.red = 0;
		this.green = 0;
		this.blue = 0;
		this.alpha = 1;
		// connect the output
		this.encoded = document.querySelector(model.encoded);
		// build the sprite
		this.canvas = document.querySelector(model.canvas);
		this.sprite = new Sprite({
			'container': this.canvas,
			'width': model.width,
			'height': model.height,
			'padding': model.padding,
			'layers': model.layers,
			'shades': model.shades
		});
		// only show the directions if applicable
		this.directions = document.querySelector(model.directions);
		this.showDirections();
		// populate the colour palette
		this.palette = new Palette({
			'containers': document.querySelectorAll(`${model.palette}, ${model.opacity}`),
			'shades': model.shades,
			'multi': false,
			'handler': this.changePalette.bind(this)
		});
		// handle the drawing clicks
		this.handleDrawing();
		// populate the layer selector
		this.stack = document.querySelector(model.stack);
		this.buildStack(model.layers);
		// handle the controls
		this.controls = document.querySelector(model.controls);
		this.controls.addEventListener('click', this.handleControls.bind(this));
		this.controls.addEventListener('submit', evt => evt.preventDefault());
		// update the preview
		this.preview = document.querySelector(model.preview);
		this.updatePreview();
	}

	updateModel(model) {
		// merge the new model with the existing one
		Object.assign(this.model, model)
		console.log('model', this.model);
		// reset the sprite
		this.canvas.innerHTML = '';
		this.sprite = new Sprite({
			'container': this.canvas,
			'width': this.model.width,
			'height': this.model.height,
			'layers': this.model.layers,
			'shades': this.model.shades
		});
		// reset the directions
		this.showDirections();
		// re-apply the drawing clicks
		this.handleDrawing();
		// reset the stack
		this.stack.innerHTML = '<legend>Layers</legend>';
		this.buildStack(model.layers);
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

	handleControls(evt) {
		// check if something with a configured action has been pushed
		const target = evt.target;
		const action = target.getAttribute('data-action');
		if (action) {
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
				case 'stack': this.changeStack(target); break;
				default: console.log('unassigned button:', action);
			}
		}
	}

	changeDirection(x, y, z) {
		// call the sprite to update
		this.sprite.direction = {x, y, z};
		// update the preview
		this.updatePreview();
	}

	changePalette(colours) {
		const colour = colours[0];
		// set the active colour values
		this.red = colour.red;
		this.green = colour.green;
		this.blue = colour.blue;
		// set the active alpha value
		this.alpha = colour.alpha;
		console.log('picked', this);
	}

	changeStack(control) {
		const name = control.value;
		const state = control.checked;
		// show or hide the layer
		this.sprite.layers[name].style.display = state ? 'block' : 'none';
	}

	updatePreview() {
		console.log('update preview');
		// copy the contents of the editor to the preview window
		this.preview.innerHTML = this.sprite.html;
		// export the binary bitmap as base64
		this.encoded.value = this.sprite.hex;
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
	'bank': '.sprite-bank',
	'frames': '.sprite-frames',
	'composition': '.sprite-composition',
	'lumakey': '.sprite-lumakey',
	'chromakey': '.sprite-chromakey',
	'width': 16,
	'height': 16,
	'padding': 1,
	'layers': ['back', 'middle', 'front'],
	'shades': [0X00,0X55,0XAA,0XFF]
});

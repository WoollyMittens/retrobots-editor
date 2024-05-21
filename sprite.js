export class Sprite {
	constructor (model) {
		// store the model
		this.model = model;
		this.svg = null;
		this.layers = {};
		this.rectangles = [];
		this.offsets = this.model.offsets || {x: 0, y: 0, z: 0};
		// build or use the bitmap
		this.bitmap = model.bitmap || this.createBitmap();
		// populate the bitmap if available
		this.hex = model.hex;
		// populate the svg if available
		this.html = model.html
		// build the svg
		this.buildSvg();
		// set the default direction if available
		this.direction = this.offsets;
	}

	set hex (value) {
		if (!value) return;
		// import the base64 code
		const decoded = atob(value);
		// convert it to a binary array
		for (let index in decoded) { 
			this.bitmap[index] = decoded.charCodeAt(index); 
		}
		// redraw if needed
		if (this.svg) this.redraw();
	}

	get hex () {
		// return an encoded bitmap of the sprite
		return btoa(String.fromCharCode(...this.bitmap));
	}

	set html (value) {
		if (!value) return;
		// populate a temporary figure with svg markup
		let figure = document.createElement('figure');
		figure.innerHTML = value;
		// encode all pixels into a byte
		const rectangles = [...figure.querySelectorAll('rect')];
		for (let index in rectangles) {
			let fill = rectangles[index].getAttribute('fill');
			this.bitmap[index] = this.decodeRgba(fill);
		}
		// delete the temporary figure
		figure = null;
		// redraw if needed
		if (this.svg) this.redraw();
	}

	get html () {
		// return the svg markup of the sprite
		return this.svg.outerHTML;
	}

	set direction (value) {
		if (!value) return;
		// apply a parallax offset to the sprite
		const half = parseInt(this.model.layers.length / 2);
		const offset = 1 - this.model.width;
		for (let index in this.model.layers) {
			// get the layer properties
			let name = this.model.layers[index];
			let layer = this.layers[name];
			let depth = index - half;
			// rearrange the layers based on the orientation
			if (value.z < 0) { 
				// reverse the order
				layer.parentNode.insertBefore(layer, layer.parentNode.firstChild); 
				// mirror the layer
				layer.setAttribute('transform', `translate(${depth * value.x},${depth * value.y}) scale(-1, 1) translate(${offset}, 0)`);
			} else { 
				// reset the order
				layer.parentNode.appendChild(layer); 
				// reset the layer
				layer.setAttribute('transform', `translate(${depth * value.x},${depth * value.y})`);
			}
		}
		// store the offsets
		this.offsets = value;
	}

	get direction () {
		// return the offset direction of the sprite
		return this.offsets;
	}

	decodeRgba(value) {
		const shades = this.model.shades;
		// separate the components colours from the rgba string
		let fill = value.split(/rgba\(|,/);
		let red = parseInt(fill[1]);
		let green = parseInt(fill[2]);
		let blue = parseInt(fill[3]);
		let alpha = Math.round(parseFloat(fill[4]) * 3);
		// encode the component colours into a byte
		return (shades.indexOf(red) << 6) + (shades.indexOf(green) << 4) + (shades.indexOf(blue) << 2) + (alpha);
	}

	encodeRgba(value) {
		const shades = this.model.shades;
		// retrieve the rgba values from the bitmap
		let red = shades[(value & 0b11000000) >> 6];
		let green = shades[(value & 0b00110000) >> 4];
		let blue = shades[(value & 0b00001100) >> 2];
		let alpha = shades[value & 0b00000011];
		// encode the component colours into an rgba string
		return `rgba(${red},${green},${blue},${alpha})`;
	}

	createBitmap() {
		// build the bitmap
		const buffer = new ArrayBuffer((this.model.width - 2) * (this.model.height - 2) * this.model.layers.length);
		const bitmap = new Uint8Array(buffer);
		return bitmap;
	}

	addGroup(name, svg) {
		// create a layer group
		const layer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		layer.setAttribute('class', name);
		// add the grid to the layers
		const padding = this.model.padding || 0;
		const width = this.model.width - padding * 2;
		const height = this.model.height - padding * 2;
		const total = width * height;
		for (let index = 0; index < total; index+=1) {
			// get the byte associated with this pixel
			let byte = this.bitmap[index];
			// calculate the coordinates
			let x = index % width + padding;
			let y = parseInt(index / width) + padding;
			// create the grid tile
			let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			rect.setAttribute('x', x);
			rect.setAttribute('y', y);
			rect.setAttribute('fill', this.encodeRgba(byte));
			rect.setAttribute('width', 1);
			rect.setAttribute('height', 1);
			// add the tile to the layer
			layer.appendChild(rect);
			// store the tile for reference
			this.rectangles.push(rect);
		}
		// store a named reference to the layer
		this.layers[name] = layer;
		// add the layer to the container
		svg.appendChild(layer);
		// return the created layer
		return layer;
	}

	buildSvg () {
		// populate the canvas
		this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		this.svg.setAttribute('width', this.model.width);
		this.svg.setAttribute('height', this.model.height);
		this.svg.setAttribute('viewBox', `0 0 ${this.model.width} ${this.model.height}`);
		this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
		// add the layers
		for (let layer of this.model.layers) {
			this.addGroup(layer, this.svg);
		}
		// add the svg to the editor
		this.model.container.appendChild(this.svg);
	}

	paint (index, colour) {
		// change the pixel in the bitmap
		this.bitmap[index] = this.decodeRgba(colour);
		// redraw the sprite
		this.redraw();
		console.log('this.bitmap', this.bitmap);
	}

	redraw () {
		// reset the direction
		this.direction = this.offsets;
		// reset the colours
		for (let index in this.rectangles) {
			let byte = this.bitmap[index];
			this.rectangles[index].setAttribute('fill', this.encodeRgba(byte));
		}
	}
}

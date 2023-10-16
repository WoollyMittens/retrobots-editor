export class Palette {
	constructor (model) {
		// store the model
		this.model = model;
		// starting values
		this.alpha = 1;
		// fetch the containers
		this.paletteContainer = model.containers[0];
		this.opacityContainer = model.containers[1] || model.containers[0];
		// implement the palette swatches
		this.addColourSwatches();
		// implement the opacity swatches
		this.addAlphaSwatches();
	}

	getSelection () {
		// get all the checked colours
		const swatches = [...this.paletteContainer.querySelectorAll('input:checked')];
		const opacity = this.opacityContainer.querySelector('input:checked');
		const colours = swatches.map((swatch) => { 
			let red = +swatch.getAttribute('data-red');
			let green = +swatch.getAttribute('data-green');
			let blue = +swatch.getAttribute('data-blue');
			let alpha = +opacity.getAttribute('data-alpha');
			let rgba  = `rgba(${red},${green},${blue},${alpha})`;
			return {red, green, blue, alpha, rgba};
		});
		return colours;
	}

	onSelected () {
		// report the picked colour(s)
		this.model.handler(this.getSelection());
	}

	addColourSwatches () {
		// for every shade of every component colour
		const shades = this.model.shades;
		const multi = this.model.multi;
		for (let blue of shades) {
			for (let green of shades) {
				for (let red of shades) {
					// create a swatch out of a form element
					let colour = `rgb(${red},${green},${blue})`;
					let input = document.createElement('input');
					// allow multi or single selections
					input.setAttribute('type', multi ? 'checkbox' : 'radio');
					// populate the colour information
					input.setAttribute('name', 'colour');
					input.setAttribute('data-action', 'colour');
					input.setAttribute('data-red', red);
					input.setAttribute('data-green', green);
					input.setAttribute('data-blue', blue);
					input.style.backgroundColor = colour;
					input.value = colour;
					// report after an interaction
					input.addEventListener('change', this.onSelected.bind(this));
					// add the swatch to the palette container
					this.paletteContainer.appendChild(input);
				}
			}
		}
		// check the first option by default
		if (!multi) this.paletteContainer.querySelector('input:first-of-type').checked = true;
	}

	addAlphaSwatches () {
		// for every shade
		const shades = this.model.shades;
		for (let shade of shades) {
			let opacity = (shade / 255).toFixed(3);
			let input = document.createElement('input');
			input.setAttribute('type', 'radio');
			input.setAttribute('name', 'alpha');
			input.setAttribute('data-shade', shade);
			input.setAttribute('data-alpha', opacity);
			input.value = opacity;
			// report after an interaction
			input.addEventListener('change', this.onSelected.bind(this));
			// add the swatch to the palette container
			this.opacityContainer.appendChild(input);
		}
		// check the last option by default
		this.opacityContainer.querySelector('input:last-of-type').checked = true;
	}
}
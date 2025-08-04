export class Sequences {
	constructor (model) {
		// store the model
		this.model = model;
        // set up storage for a bank of sequences
		this.bank = {
			'lorem': '1,2,3',
			'ipsum': '4,5,6'
		};
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
            this.model.container.innerHTML = '';
			// create the blank selector
			const noneLabel = document.createElement('label');
			const noneInput = document.createElement('input');
			noneInput.setAttribute('type', 'radio');
			noneInput.setAttribute('name', 'sequence');
			noneInput.setAttribute('value', '');
			noneInput.setAttribute('checked', '');
			const noneSpan = document.createElement('span');
			noneSpan.innerHTML = 'None';
			noneLabel.appendChild(noneInput);
			noneLabel.appendChild(noneSpan);
			this.model.container.appendChild(noneLabel);
			// create the selector list
			const seqUl = document.createElement('ul');
			for (let key in this.bank) {
				// create the sequence selector
				let seqLi = document.createElement('li');
				// create the selector radio
				let seqLabel = document.createElement('label');
				let seqInput = document.createElement('input');
				seqInput.setAttribute('type', 'radio');
				seqInput.setAttribute('name', 'sequence');
				seqInput.setAttribute('value', key);
				let seqSpan = document.createElement('span');
				seqSpan.innerHTML = 'Name';
				seqLabel.appendChild(seqInput);
				seqLabel.appendChild(seqSpan);
				seqLi.appendChild(seqLabel);
				// create the name field
				let nameLabel = document.createElement('label');
				let nameInput = document.createElement('input');
				nameInput.setAttribute('type', 'text');
				nameInput.setAttribute('name', 'name');
				nameInput.setAttribute('value', key);
				nameInput.setAttribute('required', '');
				let nameSpan = document.createElement('span');
				nameSpan.innerHTML = "Name";
				nameLabel.appendChild(nameSpan);
				nameLabel.appendChild(nameInput);
				seqLi.appendChild(nameLabel);
				// create the frames field
				// TODO: make constructor for form fields, so this is more compact
				let framesLabel = document.createElement('label');
				let framesInput = document.createElement('input');
				framesInput.setAttribute('type', 'text');
				framesInput.setAttribute('name', 'frames');
				framesInput.setAttribute('value', this.bank[key]);
				framesInput.setAttribute('required', '');
				framesInput.setAttribute('pattern', '^\d(?:,\d)*$');
				framesInput.setAttribute('placeholder', '1,2,3');
				let framesSpan = document.createElement('span');
				framesSpan.innerHTML = "Frames";
				framesLabel.appendChild(framesSpan);
				framesLabel.appendChild(framesInput);
				seqLi.appendChild(framesLabel);
				// create the remove button
				let removeButton = document.createElement('button');
				removeButton.setAttribute('data-action', 'remove_sequence');
				removeButton.innerHTML = 'x';
				seqLi.appendChild(removeButton);
				// add everything to the list container
				seqUl.appendChild(seqLi);
			}
			this.model.container.appendChild(seqUl);
			// create the add button
			let addButton = document.createElement('button');
			addButton.setAttribute('data-action', 'add_sequence');
			addButton.innerHTML = '+';
			this.model.container.appendChild(addButton);
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

export class Sequences {
	constructor (model) {
		// store the model
		this.model = model;
        // set up storage for a bank of sequences
		this.bank = {
			'lorem': [0,1,2],
			'ipsum': [3,4,5]
		};
		this.active = '';
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
			noneInput.checked = (!this.active || !this.bank[this.active]);
			noneInput.addEventListener('change', this.select.bind(this, noneInput));
			const noneSpan = document.createElement('span');
			noneSpan.innerHTML = 'None';
			noneLabel.appendChild(noneInput);
			noneLabel.appendChild(noneSpan);
			this.model.container.appendChild(noneLabel);
			// create the selector list
			const sequenceList = document.createElement('ul');
			for (let key in this.bank) {
				// create the sequence selector
				let sequenceItem = document.createElement('li');
				// create the selector radio
				let radioLabel = document.createElement('label');
				let radioInput = document.createElement('input');
				radioInput.setAttribute('type', 'radio');
				radioInput.setAttribute('name', 'sequence');
				radioInput.setAttribute('value', key);
				radioInput.checked = (this.active === key);
				radioInput.addEventListener('change', this.select.bind(this, radioInput));
				let seqSpan = document.createElement('span');
				seqSpan.innerHTML = 'Name';
				radioLabel.appendChild(radioInput);
				radioLabel.appendChild(seqSpan);
				sequenceItem.appendChild(radioLabel);
				// create the name field
				let nameLabel = document.createElement('label');
				let nameInput = document.createElement('input');
				nameInput.setAttribute('type', 'text');
				nameInput.setAttribute('name', 'name');
				nameInput.setAttribute('value', key);
				nameInput.setAttribute('required', '');
				nameInput.addEventListener('change', this.rename.bind(this, radioInput, nameInput));
				let nameSpan = document.createElement('span');
				nameSpan.innerHTML = "Name";
				nameLabel.appendChild(nameSpan);
				nameLabel.appendChild(nameInput);
				sequenceItem.appendChild(nameLabel);
				// create the frames field
				let framesLabel = document.createElement('label');
				let framesInput = document.createElement('input');
				framesInput.setAttribute('type', 'text');
				framesInput.setAttribute('name', 'frames');
				framesInput.setAttribute('value', this.bank[key]);
				framesInput.setAttribute('required', '');
				framesInput.setAttribute('pattern', '^\\d(?:,\\d)*$');
				framesInput.setAttribute('placeholder', '1,2,3');
				framesInput.addEventListener('change', this.update.bind(this, radioInput, framesInput));
				let framesSpan = document.createElement('span');
				framesSpan.innerHTML = "Frames";
				framesLabel.appendChild(framesSpan);
				framesLabel.appendChild(framesInput);
				sequenceItem.appendChild(framesLabel);
				// create the remove button
				let removeButton = document.createElement('button');
				removeButton.setAttribute('data-action', 'remove_sequence');
				removeButton.innerHTML = 'x';
				removeButton.addEventListener('click', this.remove.bind(this, radioInput));
				sequenceItem.appendChild(removeButton);
				// add everything to the list container
				sequenceList.appendChild(sequenceItem);
			}
			this.model.container.appendChild(sequenceList);
			// create the add button
			let addButton = document.createElement('button');
			addButton.setAttribute('data-action', 'add_sequence');
			addButton.innerHTML = '+';
			addButton.addEventListener('click', this.add.bind(this));
			this.model.container.appendChild(addButton);
		}
	}
	// select an active sequence
	select(radioField) {
		// store the active key
		this.active = radioField.value;
        // call back the parent
        this.model.handler();
	}
	// add a new sequence to the list
	add(evt) {
		// cancel the click
		evt?.preventDefault();
		// add the given sequence to the bank, or create a new one
		const key = 'seq_' + new Date().getTime();
		const value = [];
		this.bank[key] = value;
		// redraw the interface
		this.redraw();
	}
	// remove a sequence from the list
	remove(radioField, evt) {
		// cancel the click
		evt?.preventDefault();
		// get the value from the field
		const key =  radioField.value;
		// remove the named key
		if (this.bank[key]) delete(this.bank[key]);
		// redraw the interface
		this.redraw();
        // call back the parent
        this.model.handler();
	}
	// rename a sequence
	rename(radioField, nameField, evt) {
		// cancel the click
		evt?.preventDefault();
		// get the values from the field
		const key =  radioField.value;
		const name = nameField.value;
		// if the old key exists
		if (this.bank[key] && name.length > 0) {
			// unmark any previous error
			nameField.removeAttribute('data-invalid');
			// add the new name
			this.bank[name] = this.bank[key];
			// remove the old key
			delete(this.bank[key]);
			// call back the parent
			this.model.handler();
		}
		// or mark the error
		else {
			nameField.setAttribute('data-invalid', '');
		}
	}
	// update a sequence
	update(radioField, framesField, evt) {
		// cancel the click
		evt?.preventDefault();
		// get the values from the field
		const key =  radioField.value;
		const value = framesField.value;
		// TODO: validate the csv for syntax
		const regExp = new RegExp(framesField.getAttribute('pattern'), 'gi');
		if (regExp.test(value)) {
			// unmark any previous error
			framesField.removeAttribute('data-invalid');
			// store the new value
			this.bank[key] = JSON.parse(`[${value}]`);
			// call back the parent
			this.model.handler();
		}
		// mark the error
		else {
			framesField.setAttribute('data-invalid', '');
		}
	}
}

// LunarInput 컴포넌트
class LunarInput extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: 'open' });
		const wrapper = document.createElement('input');
		wrapper.setAttribute('class', 'lunar-input');
		wrapper.setAttribute('type', 'text');

		wrapper.innerHTML = `
			<style>
				.lunar-input {
					width: 90%;
					padding: 10px 14px;
					border: 2px solid #ffcadd;
					border-radius: 10px;
					background-color: #fff6f9;
					font-size: 14px;
					color: #444;
					transition: all 0.3s ease;
				}
				.lunar-input:focus {
					outline: none;
					border-color: #ff8bb0;
					background-color: #fff0f5;
				}
			</style>
			<slot></slot>
		`;

		this.inputElement = wrapper;
		shadow.appendChild(wrapper);
	}

	static get observedAttributes() {
		return ['text', 'placeholder'];
	}

	connectedCallback() {
		this._updateAttributes();
	}

	attributeChangedCallback() {
		this._updateAttributes();
	}

	_updateAttributes() {
		if (this.hasAttribute('placeholder')) {
			this.inputElement.setAttribute('placeholder', this.getAttribute('placeholder'));
		}
	}
}

customElements.define('lunar-input', LunarInput);


// LunarSelect 컴포넌트
class LunarSelect extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: 'open' });
		const wrapper = document.createElement('select');
		wrapper.setAttribute('class', 'lunar-select');
		wrapper.innerHTML = `
			<style>
				.lunar-select {
					width: 90%;
					padding: 10px 14px;
					border: 2px solid #ffcadd;
					border-radius: 10px;
					background-color: #fff6f9;
					font-size: 14px;
					color: #444;
					transition: all 0.3s ease;
				}
				.lunar-select:focus {
					outline: none;
					border-color: #ff8bb0;
					background-color: #fff0f5;
				}
			</style>
			<slot></slot>
		`;
		this.selectElement = wrapper;
		shadow.appendChild(wrapper);
	}
}

customElements.define('lunar-select', LunarSelect);


// LunarRadioGroup 컴포넌트
class LunarRadioGroup extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: 'open' });
		const wrapper = document.createElement('div');
		wrapper.setAttribute('class', 'radio-group');
		wrapper.innerHTML = `
			<style>
				.radio-group {
					display: flex;
					gap: 14px;
					margin-top: 8px;
				}
				.radio-group input[type="radio"] {
					display: none;
				}
				.radio-group label {
					position: relative;
					padding-left: 26px;
					cursor: pointer;
					font-size: 14px;
					color: #555;
					user-select: none;
				}
				.radio-group label::before {
					content: "";
					position: absolute;
					left: 0;
					top: 2px;
					width: 16px;
					height: 16px;
					border: 2px solid #ffcadd;
					border-radius: 50%;
					background: white;
					box-sizing: border-box;
					transition: all 0.2s ease;
				}
				.radio-group input[type="radio"]:checked + label::before {
					background-color: #ff8bb0;
					border-color: #ff8bb0;
					box-shadow: 0 0 0 3px #ffe0eb;
				}
			</style>
			<slot></slot>
		`;

		this.radioGroupElement = wrapper;
		shadow.appendChild(wrapper);
	}
}

customElements.define('lunar-radio-group', LunarRadioGroup);


// LunarButton 컴포넌트
class LunarButton extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: 'open' });
		const wrapper = document.createElement('button');
		wrapper.innerHTML = `
			<style>
				button {
					padding: 8px 14px;
					background-color: #ff8bb0;
					color: white;
					border: none;
					border-radius: 8px;
					cursor: pointer;
					font-weight: bold;
					transition: background-color 0.2s ease;
				}
				button:hover {
					background-color: #ff5f9e;
				}
			</style>
			<slot></slot>
		`;

		this.buttonElement = wrapper;
		shadow.appendChild(wrapper);
	}

	// 버튼의 텍스트 속성을 설정하기 위한 메서드
	static get observedAttributes() {
		return ['text'];
	}

	connectedCallback() {
		this._updateText();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this._updateText();
	}

	_updateText() {
		if (this.hasAttribute('text')) {
			this.buttonElement.innerText = this.getAttribute('text');
		}
	}
}

customElements.define('lunar-button', LunarButton);

class MyOPTCodeInput extends HTMLElement {
	static formAssociated = true;

	#internals: ElementInternals;

	constructor() {
		super();
		this.#internals = this.attachInternals();

		this.#internals.setValidity(
			{
				valueMissing: true,
			},
			"Please fill in all the digits",
		);
	}

	public checkValidity(): boolean {
		return this.#internals.checkValidity();
	}

	public reportValidity(): boolean {
		return this.#internals.reportValidity();
	}

	public get validity(): ValidityState {
		return this.#internals.validity;
	}

	public get validationMessage(): string {
		return this.#internals.validationMessage;
	}

	connectedCallback() {
		const numberOfDigit = Number(this.getAttribute("number-of-digit") || "3");

		const shadow = this.attachShadow({ mode: "open", delegatesFocus: true });

		let s = "";
		for (let i = 0; i < numberOfDigit; i++) {
			s += `<input type="number" data-index=${i} type="text" maxlength="1" class="digit-input" />`;
		}

		shadow.innerHTML = `
<style>
            input::-webkit-outer-spin-button,
            input::-webkit-inner-spin-button {
                /* display: none; <- Crashes Chrome on hover */
                -webkit-appearance: none;
                margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
            }

            input[type=number] {
                -moz-appearance:textfield; /* Firefox */
            }

            .digit-input {
                width: 20px;
                height: 20px;
                text-align: center;
                font-size: 18px;
                margin: 2px;
            }
            .digit-input:focus {
                outline: none;
                border: 2px solid blue;
            }
</style>
${s}
`;
		shadow.addEventListener("input", (event) => {
			event.preventDefault();

			const target = event.target;
			if (!(target instanceof HTMLInputElement)) {
				return;
			}
			if (!target.dataset.index) {
				return;
			}

			let value = target.value;

			let index = Number(target.dataset.index);

			let input = shadow.querySelector(
				`input[data-index="${Number(index)}"]`,
			) as HTMLInputElement | undefined;
			while (value) {
				if (!input) {
					break;
				}
				input.focus();
				input.value = value[0];
				value = value.slice(1);
				index++;
				input = shadow.querySelector(`input[data-index="${Number(index)}"]`) as
					| HTMLInputElement
					| undefined;
			}
			if (input) {
				input.focus();
			}

			if (index >= numberOfDigit) {
				const inputs: NodeListOf<HTMLInputElement> =
					shadow.querySelectorAll("input");
				let value = "";
				for (const input of inputs) {
					value += input.value;
					input.blur();
				}

				this.#internals.setValidity({
					valueMissing: false,
				});
				this.#internals.setFormValue(value);
				this.dispatchEvent(new CustomEvent("fulfilled"));
			}
		});
	}
}

customElements.define("my-opt-code-input", MyOPTCodeInput);

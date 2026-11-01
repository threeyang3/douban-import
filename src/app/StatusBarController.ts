interface StatusElement {
	empty(): void;
	setText(text: string): void;
}

/** Owns delayed status cleanup so it cannot outlive a message or the plugin. */
export default class StatusBarController {
	private timer: ReturnType<typeof setTimeout> | undefined;
	private disposed = false;

	constructor(
		private readonly element: () => StatusElement | undefined,
		private readonly enabled: () => boolean,
		private readonly delay: number,
	) {}

	show(text: string): void {
		this.cancelClear();
		if (this.disposed || !this.enabled()) return;
		const element = this.element();
		if (!element) return;
		element.empty();
		element.setText(text);
	}

	clearLater(): void {
		this.cancelClear();
		if (this.disposed || !this.enabled() || !this.element()) return;
		this.timer = setTimeout(() => {
			this.timer = undefined;
			this.element()?.empty();
		}, this.delay);
	}

	dispose(): void {
		this.disposed = true;
		this.cancelClear();
		this.element()?.empty();
	}

	private cancelClear(): void {
		if (this.timer !== undefined) clearTimeout(this.timer);
		this.timer = undefined;
	}
}

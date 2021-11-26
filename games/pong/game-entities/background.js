import Entity from '../../common/entity';

/**
 * Background class
 */
export default class Background extends Entity {
	/**
	 * Creates a background instance
	 * @param {Object} game
	 * @param {String} lineColor
	 * @param {Number} lineWidth
	 * @param {Number} lineDashHeightRatio
	 */
	constructor(game, lineColor, lineWidth, lineDashHeightRatio) {
		super(game, game.contexts.background);

		//line parameters
		this.lineColor = lineColor;
		this.lineWidth = lineWidth;
		this.lineDashHeight = this.canvas.height / lineDashHeightRatio;
		this.lineX = (this.canvas.width / 2) - (this.lineWidth / 2);
	}

	/**
	 * Draws the background game line
	 */
	drawLine() {
		this.context.strokeStyle = this.lineColor;
		this.context.lineWidth = this.lineWidth;
		this.context.beginPath();
		this.context.setLineDash([this.lineDashHeight]);
		this.context.moveTo(this.lineX, 0);
		this.context.lineTo(this.lineX, this.canvas.height);
		this.context.stroke();
	}

	/**
	 * Draws the background
	 */
	draw() {
		this.drawLine();
	}
}

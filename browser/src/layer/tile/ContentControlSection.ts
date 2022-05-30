declare var L: any;
declare var app: any;

namespace cool {

export class ContentControlSection extends CanvasSectionObject {

	public onInitialize(): void {
		this.sectionProperties.rectangles = [];
		this.sectionProperties.strokeStyle = '#000000';
	}

	constructor() {
		super({
			processingOrder: L.CSections.ContentControl.processingOrder,
			drawingOrder: L.CSections.ContentControl.drawingOrder,
			zIndex: L.CSections.ContentControl.zIndex,
			name: L.CSections.ContentControl.name,
			interactable: false,
			sectionProperties: {},
			position: [0, 0],
			size: [],
			expand: '',
			anchor: [],
		});

		this.myTopLeft = [0, 0];
		this.documentObject = true;
		this.sectionProperties.rectangles = null;
		this.sectionProperties.strokeStyle = null;
	}

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	drawContentControl(json: any): void {
		if (json.action === 'show')	{
			//convert string to number coordinates
			var matches = json.rectangles.match(/\d+/g);
			this.sectionProperties.rectangles = [];
			if (matches !== null) {
				for (var i: number = 0; i < matches.length; i += 4) {
					this.sectionProperties.rectangles.push([parseInt(matches[i]), parseInt(matches[i + 1]), parseInt(matches[i + 2]), parseInt(matches[i + 3])]);
				}
			}
		} else if (json.action === 'hide') {
			this.sectionProperties.rectangles = [];
		}
		app.sectionContainer.requestReDraw();
	}

	private setPositionAndSize ():void {
		var rectangles = this.sectionProperties.rectangles;
		var xMin: number = Infinity, yMin: number = Infinity, xMax: number = 0, yMax: number = 0;
		for (var i = 0; i < rectangles.length; i++) {
			if (rectangles[i][0] < xMin)
				xMin = rectangles[i][0];

			if (rectangles[i][1] < yMin)
				yMin = rectangles[i][1];

			if (rectangles[i][0] + rectangles[i][2] > xMax)
				xMax = rectangles[i][0] + rectangles[i][2];

			if (rectangles[i][1] + rectangles[i][3] > yMax)
				yMax = rectangles[i][1] + rectangles[i][3];
		}
		// Rectangles are in twips. Convert them to core pixels.
		var ratio: number = (app.tile.size.pixels[0] / app.tile.size.twips[0]);
		xMin = Math.round(xMin * ratio);
		yMin = Math.round(yMin * ratio);
		xMax = Math.round(xMax * ratio);
		yMax = Math.round(yMax * ratio);

		this.setPosition(xMin, yMin); // This function is added by section container.
		this.size = [xMax - xMin, yMax - yMin];
		if (this.size[0] < 5)
			this.size[0] = 5;
	}

	public onResize (): void {
		this.setPositionAndSize();
	}

	public onDraw(): void {
		var rectangles = this.sectionProperties.rectangles;

		for (var i: number = 0; i < rectangles.length; i++) {
			var xMin: number = rectangles[i][0];
			var yMin: number = rectangles[i][1];
			var xMax: number = rectangles[i][0] + rectangles[i][2];
			var yMax: number = rectangles[i][1] + rectangles[i][3];

			var ratio: number = (app.tile.size.pixels[0] / app.tile.size.twips[0]);
			xMin = Math.round(xMin * ratio);
			yMin = Math.round(yMin * ratio);
			xMax = Math.round(xMax * ratio);
			yMax = Math.round(yMax * ratio);

			this.context.strokeStyle = this.sectionProperties.strokeStyle;
			this.context.strokeRect(xMin - this.position[0], yMin - this.position[1], xMax - xMin, yMax - yMin);
		}
	}

	public onNewDocumentTopLeft (): void {
		this.setPositionAndSize();
	}
}

}

app.definitions.ContentControlSection = cool.ContentControlSection;


/**
 * Image repository class that loads all provided images and calls the callback when done
 */
export default class ImageRepository {
	/**
	 * Creates a new ImageRepository instance
	 * @param {Object} images
	 * @param {Function} callback
	 */
	constructor(images, callback) {
		this.images = { ...images };
		this.callback = callback;

		this.loadedImages = 0;
		this.totalImages = 0;

		this.countImages(this.images);
		this.loadImages(this.images);
	}

	/**
	 * Recursive function that is used to count all images in the provided object
	 * @param {Object} object
	 */
	countImages(object) {
		_.forOwn(object, (value, key) => {
			if (typeof value === 'string') {
				this.totalImages++;
			} else {
				this.countImages(value);
			}
		});
	}

	/**
	 * Recursive function that is used to preload all images in the provided object
	 * @param {type} object
	 */
	loadImages(object) {
		_.forOwn(object, (value, key) => {
			//if the value is an image path preload it
			if (typeof value === 'string') {
				object[key] = new Image();
				object[key].src = value;

				object[key].onload = () => {
					this.loadedImages++;
					//call the callback once all images have been preloaded
					if (this.loadedImages === this.totalImages) {
						this.callback(this.images);
					}
				};
			} else {
				//otherwise dig deeper into the object
				this.loadImages(value);
			}
		});
	}
}

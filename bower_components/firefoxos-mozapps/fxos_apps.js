(function(exports) {

	// Hidden manifest roles that we do not show
	const HIDDEN_ROLES = ['system', 'input', 'homescreen', 'theme'];

	// Default icon size.
	const DEFAULT_ICON_SIZE = Math.floor(window.innerWidth / 4);

	// List of all application icons.
	var icons = [];

	// List of all application icons by identifier.
	var iconsMap = {};

	/**
	 * Creates icons for an app based on hidden roles and entry points.
	 */
	function makeIcons(app) {
		if (HIDDEN_ROLES.indexOf(app.manifest.role) !== -1) {
			return;
		}

		var newIcon;
		if (app.manifest.entry_points) {
			for (var i in app.manifest.entry_points) {
				newIcon = new Icon(app, i);
				icons.push(newIcon);
				iconsMap[newIcon.identifier] = newIcon;
			}
		} else {
			newIcon = new Icon(app);
			icons.push(newIcon);
			iconsMap[newIcon.identifier] = newIcon;
		}
	}

	/**
	 * Checks whether or not the input has a scheme like http://
	 */
	function hasScheme(input) {
		var rscheme = /^(?:[a-z\u00a1-\uffff0-9-+]+)(?::|:\/\/)/i;
		return !!(rscheme.exec(input) || [])[0];
  	}

	/**
	 * Represents a single app icon on the homepage.
	 */
	function Icon(app, entryPoint) {
		this.app = app;
		this.entryPoint = entryPoint;

		this.identifier = [app.manifestURL, entryPoint].join('-');
	}

	Icon.prototype = {

		defaultIcon: '/bower_components/firefoxos-mozapps/default_icon.png',

		get name() {
			var userLang = document.documentElement.lang;
			var locales = this.descriptor.locales;
			var localized = locales && locales[userLang] && locales[userLang].name;

			return localized || this.descriptor.name;
		},

		get icon() {
			return this.getIcon(DEFAULT_ICON_SIZE);
		},

		get descriptor() {
			if (this.entryPoint) {
				return this.app.manifest.entry_points[this.entryPoint];
			}
			return this.app.manifest;
		},

		/**
		 * Returns the icon closest to a given size.
		 */
		getIcon: function(size) {
			var choices = this.descriptor.icons;
			if (!choices) {
				return this.defaultIcon;
			}

			// Create a list with the sizes and order it by descending size.
			var list = Object.keys(choices).map(function(size) {
				return size;
			}).sort(function(a, b) {
				return b - a;
			});

			var accurateSize = list[0]; // The biggest icon available
			for (var i = 0; i < length; i++) {
				var iconSize = list[i];

				if (iconSize < size) {
					break;
				}

				accurateSize = iconSize;
			}

			var icon = choices[accurateSize];

			// Handle relative URLs
			if (!hasScheme(icon)) {
				var a = document.createElement('a');
				a.href = this.app.origin;
				icon = a.protocol + '//' + a.host + icon;
			}

			return icon;
		},

		/**
		 * Launches the application for this icon.
		 */
		launch: function() {
			if (this.entryPoint) {
				this.app.launch(this.entryPoint);
			} else {
				this.app.launch();
			}
		}
	};


	exports.FxosApps = {

		/**
		 * Exports the Icon class.
		 */
		Icon: Icon,

		/**
		 * Fetches all icons from mozApps.mgmt.
		 */
		all: function() {
			return new Promise((resolve, reject) => {
				navigator.mozApps.mgmt.getAll().onsuccess = function(event) {
					event.target.result.forEach(makeIcons);
					resolve(icons);
				};
			});
		},

		/**
		 * Gets an icon by identifier.
		 */
		get: function(identifier) {
			return iconsMap[identifier];
		}
	};

}(window));
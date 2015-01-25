# Firefox OS MozApps

This is a promise based library which wraps mozApp methods to make app developer's lives easier. Some things that this library takes care of:

* Proper icon selection.
* Icon text extraction from locale.
* Entry point normalization.

## Usage

Install the files into your project:
```
bower install KevinGrandon/firefoxos-mozapps
```

Include the script (if using bower install):
```
<script defer src="bower_components/firefoxos-mozapps/dist/build.standard.js"></script>
```

Getting app icons:
```
FxosApps.all().then(icons => {
	// Do something with icons.

	// Gets the icon image.
	console.log(icon.icon);

	// Launch the application:
	// icon.launch();
});
```

## Contributing

Run ```gulp``` to build and package everything into the dist/ folder.

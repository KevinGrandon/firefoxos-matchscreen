	// Can't figure out a nice way to have 6to5 export to a global FxOSApps object
	// as well which is needed for backwards compatibility.
	exports.FxosApps = {
		Icon: Icon,
		all: all,
		get: get
	};
}(window));

(function() {

  var HIDDEN_ROLES = ['system', 'keyboard', 'homescreen'];

  function shuffleDom() {
    var divs = document.body.children;
    var frag = document.createDocumentFragment();

    while (divs.length) {
        frag.appendChild(divs[Math.floor(Math.random() * divs.length)]);
    }
    document.body.appendChild(frag);
  }

  var icons = [];
  function Icon(app, entryPoint) {
    this.app = app;
    this.entryPoint = entryPoint;
  }

  Icon.prototype = {

    get name() {
      return this.descriptor.name;
    },

    get icon() {
      return this.descriptor.icons['60'];
    },

    get descriptor() {
      if (this.entryPoint) {
        return this.app.manifest.entry_points[this.entryPoint];
      }
      return this.app.manifest;
    },

    render: function() {
      var appEl = document.createElement('div');
      appEl.className = 'tile';
      appEl.dataset.origin = this.app.origin;
      if (this.entryPoint) {
        appEl.dataset.entryPoint = this.entryPoint;
      }

      appEl.innerHTML = '<div class="wrapper"><div class="back" style="background-image: url(' + this.app.origin + this.icon + ');"></div><div class="front"></div></div>';
      document.body.appendChild(appEl);
    },

    /**
     * Renders two icons
     */
    addAll: function() {
      this.render();
      this.render();
    },

    launch: function() {
      if (this.entryPoint) {
        this.app.launch(this.entryPoint);
      } else {
        this.app.launch();
      }
    }
  };

  function makeIcons(app) {
    if (HIDDEN_ROLES.indexOf(app.manifest.role) !== -1) {
      return;
    }

    if (app.manifest.entry_points) {
      for (var i in app.manifest.entry_points) {
        icons.push(new Icon(app, i));
      }
    } else {
      icons.push(new Icon(app));
    }
  }

  function getIconByElement(element) {
    var elEntryPoint = element.dataset.entryPoint;
    var elOrigin = element.dataset.origin;

    for (var i = 0, iLen = icons.length; i < iLen; i++) {
      var icon = icons[i];
      if (icon.entryPoint === elEntryPoint && icon.app.origin === elOrigin) {
        return icon;
      }
    }
  }

  navigator.mozApps.mgmt.getAll().onsuccess = function(event) {
    event.target.result.forEach(makeIcons);
    icons.forEach(function(icon) {
      icon.addAll()
    });

    shuffleDom();

    // Shuffle the dom every hour
    setTimeout(shuffleDom, 60 * 60 * 1000)
  };

  var opened = [];
  window.addEventListener('click', function(e) {

    var container = e.target

    var icon = getIconByElement(container);
  
    // If they already have two opened tiles, return
    if( opened.length == 2 ) { return false; }
    // Display a fact about the tile clicked on
    if( !container.classList.contains('flipped')) {
      container.classList.add('flipped')
      opened.push(icon)
      
    // Only allow the user to flip back if there is just one opened
    } else if( opened.length == 1 ) {
      container.classList.remove('flipped')
      opened = []
      return false
    }
  
    // Close opened containers if two or more are opened
    if( opened.length < 2 ) { return false; }
  
    setTimeout(function(){
      if( opened.length > 1 ) {
        var openedEls = document.querySelectorAll('.flipped');
        Array.prototype.forEach.call(openedEls, function(el) {
          el.classList.remove('flipped')
        })
  
        // If the first two opened items share the same resource, remove them
        if( opened[0] === opened[1] ) {
          for( var i = 0, container; container = opened[i] ; i++ ) {
            icon.launch();
          }
        }

        opened = [];
      }
  
      return false;
    }.bind(this), 900)
  });

}());

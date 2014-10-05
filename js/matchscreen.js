(function() {

  var iconMap = new WeakMap();

  function shuffleDom() {
    var divs = document.body.children;
    var frag = document.createDocumentFragment();

    while (divs.length) {
        frag.appendChild(divs[Math.floor(Math.random() * divs.length)]);
    }
    document.body.appendChild(frag);
  }

  function renderIcon(icon) {
    var appEl = document.createElement('div');
    appEl.className = 'tile';
    appEl.innerHTML = '<div class="wrapper"><div class="back" style="background-image: url(' + icon.icon + ');"></div><div class="front"></div></div>';

    iconMap.set(appEl, icon);

    document.body.appendChild(appEl);
  }

  FxosApps.all().then(icons => {
    icons.forEach(icon => {
      renderIcon(icon);
      renderIcon(icon);
    });
    shuffleDom();

    // Shuffle the dom every hour
    setTimeout(shuffleDom, 60 * 60 * 1000)
  });

  var opened = [];
  window.addEventListener('click', function(e) {

    var container = e.target

    var icon = iconMap.get(container);
  
    // If they already have two opened tiles, return
    if( opened.length == 2 ) { return false; }

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

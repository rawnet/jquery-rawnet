// TEMP:
$('[data-carousel=true]').each(function(i, listContainer) {
  var $listContainer = $(listContainer),
      $listContainerChildren = $listContainer.children(),
      interval;
    
  // set default stacking orientation
  if (!$listContainer.attr('data-stacking')) {
    $listContainer.attr('data-stacking', 'vertical');
  }
    
  // set default animation
  if (!$listContainer.attr('data-animate')) {
    $listContainer.attr('data-animate', 'false');
  }
    
  // wrap everything in a parent element
  var $parent = $('<div class="rawnet"></div>').insertBefore($listContainer);
    
  // contain the carousel in a "window" element
  var $window = $('<div class="rawnet-carousel"></div>').appendTo($parent);
                      
  // contain the list in a "container" element
  var $container = $('<div></div>')
                    .addClass($listContainer.attr('data-stacking'))
                    .append(listContainer)
                    .appendTo($window);
                    
  // container for the controls
  var $controlsContainer = $('<ol class="' + $listContainer.attr('data-stacking') + '"></ol>').insertBefore($window);
    
  // inject the controls and tag each list item with an idex for reference
  $listContainerChildren.each(function(i, listItem) {
    var $el = $('<li data-index="' + i + '"><a href="#">' + (i+1) + '</a></li>');
    $controlsContainer.append($el);
    if (i == 0) {
      $el.find('a').addClass('active');
    }
    $(listItem).attr('data-index', i);
  });
    
  // find the max list item height
  var listItemHeight = Math.max.apply(null, $listContainerChildren.map(function(i, listItem) {
    return $(listItem).height();
  }).toArray());
    
  // find the window width
  var listItemWidth = $window.width();
    
  // set this as the height on all list items
  $listContainerChildren.height(listItemHeight);
    
  // set the container to this height
  // the container has overflow:hidden so
  // this will hide all but the first
  // list item
  $window.height(listItemHeight);
    
  // should we animate?
  var animate = $listContainer.attr('data-animate') == 'true';
    
  // what property should animations use?
  var animateFrom = { left: 0, top: 0 }, animateTo = { top: -listItemHeight };
  if ($listContainer.attr('data-stacking') == 'horizontal') {
    animateTo = { left: -listItemWidth };
  }
    
  // bind events to the controls
  $controlsContainer.delegate('a', 'click', function(e) {
    e.preventDefault();
      
    // stop the interval
    if (interval) { clearInterval(interval) }
      
    $controlsContainer.find('a.active').removeClass('active');
    $(this).addClass('active');
      
    var i = +$(this).parent().attr('data-index'),
        listItem = $listContainerChildren.filter('[data-index=' + i + ']');
          
    // find out how far away this item is from the start of the carousel
    var firstItemIndex = +$listContainer.children().eq(0).attr('data-index');
        
    // calculate the distance (number of items)
    var distance;
    if (i > firstItemIndex) {
      distance = (i - firstItemIndex);
    } else if (i < firstItemIndex) {
      var maxIndex = ($listContainerChildren.length-1),
          distanceForward = maxIndex - firstItemIndex + (i+1),
          distanceBackward = (i - firstItemIndex);
            
      if (distanceForward < Math.abs(distanceBackward)) {
        distance = distanceForward;
      } else {
        distance = distanceBackward;
      }
    } else {
      distance = 0; // item clicked is same as current item
    }
      
    if (animate) {
      // build the animation options
      var distanceInPixels = listItemHeight * distance;
      var animateFrom = { left: 0, top: 0 }, animateTo = { top: -distanceInPixels };
      if ($listContainer.attr('data-stacking') == 'horizontal') {
        distanceInPixels = listItemWidth * distance;
        animateTo = { left: -distanceInPixels }
      }
        
      // if the distance is positive, we animate and then adjust the order
      // otherwise, we need to adjust the order prior to animating
      if (distance > 0) {
        $container.animate(animateTo, 500, 'swing', function() {
          for (var i = 0; i < distance; i++) {
            $listContainer.children().first().appendTo($listContainer);
          }
          $container.css(animateFrom);
          startTimer();
        });
      } else if (distance < 0) {
        for (var i = 0; i > distance; i--) {
          $listContainer.children().last().prependTo($listContainer);
        }
        if (animateTo.top) {
          animateTo.top = -animateTo.top;
        } else if (animateTo.left) {
          animateTo.left = -animateTo.left;
        }
        $container.css(animateTo);
        $container.animate(animateFrom, 500, 'swing', function() {
          startTimer();
        });
      } else {
        startTimer();
      }
    } else {
      if (distance > 0) {
        for (var i = 0; i < distance; i++) {
          $listContainer.children().first().appendTo($listContainer);
        }
      } else {
        for (var i = 0; i > distance; i--) {
          $listContainer.children().last().prependTo($listContainer);
        }
      }
      startTimer();
    }
  });
    
  // start an interval timer to rotate the list items
  startTimer();
    
  function startTimer() {
    interval = setInterval(function() {
      $controlsContainer.find('a.active').removeClass('active').parent().next().find('a').addClass('active');
        
      if ($controlsContainer.find('a.active').length == 0) {
        $controlsContainer.find('a').first().addClass('active');
      }
      if (!animate) {
        $listContainer.children().first().appendTo($listContainer);
      } else {
        $container.animate(animateTo, 500, 'swing', function() {
          $listContainer.children().first().appendTo($listContainer);
          $container.css(animateFrom);
        });
      }
    }, 5000);
  }
});

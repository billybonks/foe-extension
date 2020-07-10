requirejs.config({
});

// Start the main app logic.
setTimeout(function(){
  requirejs(['foe'],
  function(foe) {
      //jQuery, canvas and the app/sub module are all
      //loaded and can be used here now.
  });
}, 1000)

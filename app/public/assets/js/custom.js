$(document).ready(function() {

  $(".button-collapse").sideNav();

  dragula([document.getElementById('hand'), document.getElementById('discard')], {
    revertOnSpill: true,
    accepts: function (el, target, source, sibling) {
    	// Do not allow dragging from Discard and dropping into Player's hand
    	const sourceId = $(source).attr("id");

    	if(sourceId === 'discard') {
    		return false;
    	}

    	return true;
    }
  });

  function updateDiscard(event) {

    event.preventDefault();
    event.target.style.opacity = "";
    $('discard').replaceWith("");

  };

});

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

function Player() {
  this.inventory = ['Knife', 'Marbles'];
  this.health = 90;
}

Player.prototype.displayInventory = function() {
  $('#player-inventory').empty();
  for (var i = 0; i < this.inventory.length; i++) {
    $('#player-inventory').append('<li>' + this.inventory[i] + ' </li>');
  }
}

Player.prototype.removeInventory = function(item) {
	for (var i = 0; i <  this.inventory.length; i++) {
	  if (this.inventory[i] === item) {
    var x = this.inventory.indexOf(item);
	  this.inventory.splice(x, 1);
    this.displayInventory();
    }
  }
}

Player.prototype.checkForItem = function(item) {
  for (var i = 0; i < this.inventory.length; i++) {
    if (this.inventory[i] === item) {
      return true;
    }
  } return false;
}

$(document).ready(function() {
  var newPlayer = new Player();
  newPlayer.displayInventory();

  $('#player-health').text(newPlayer.health);

  $('.try-again').click(function() {
    location.reload();
  });

  $('#button1-left').click(function(event) {
    $('#entrance').hide(800);
    $('#death1').show(800);
  });

  $('#button1-right').click(function(event) {
    $('#entrance').hide(800);
    $('#wet-tunnel').show(800);
  });

  $('#button2-2-left').click(function(event) {
    $('#wet-tunnel').hide(800);
    $('#wet-tunnel-end').show(800);
  });

  $('#button2-2-right').click(function(event) {
    $('#wet-tunnel').hide(800);
    $('#cold-room').show(800);
  });

  $('#button3-1-right').click(function(event) {
    $('#wet-tunnel-end').hide(800);
    $('#cold-room').show(800);
  });

  $('#button3-2-return').click(function(event) {
    $('#cold-room').hide(800);
    $('#wet-tunnel-torch').show(800);
    newPlayer.inventory.push('Apples', 'Bread', 'Sling-Shot', 'Torch');
    newPlayer.displayInventory();
  });

  $('#button3-3-left').click(function(event) {
    $('#wet-tunnel-torch').hide(800);
    $('#bat-room').show(800);
    newPlayer.health = newPlayer.health - 10;
    $('#player-health').text(newPlayer.health);
  });

  $('#button4-1-knife').click(function(event) {
    $('#bat-room').hide(800);
    $('#bat-room-knife').show(800);
    newPlayer.health = newPlayer.health - 10;
    $('#player-health').text(newPlayer.health);
  });

  $('#button4-1-sling').click(function(event) {
    $('#bat-room').hide(800);
    $('#bat-room-sling').show(800);
  });

  $('#button4-2-tunnel').click(function(event) {
    $('#bat-room-sling').hide(800);
    $('#long-tunnel').show(800);
  });

  $('#button4-3-sling').click(function(event) {
    $('#bat-room-knife').hide(800);
    $('#bat-room-sling').show(800);
  });

  $('#button5-1-apples').click(function(event) {
    $('#long-tunnel').hide(800);
    $('#long-tunnel-end').show(800);
    newPlayer.health = newPlayer.health + 10;
    $('#player-health').text(newPlayer.health);
    newPlayer.removeInventory('Apples');
  });

  $('#button5-1-bread').click(function(event) {
    $('#long-tunnel').hide(800);
    $('#long-tunnel-end').show(800);
    newPlayer.health = newPlayer.health + 15;
    $('#player-health').text(newPlayer.health);
    newPlayer.removeInventory('Bread');
  });

});

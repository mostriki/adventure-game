function Game() {
  this.currentPlayer = null;
  this.rooms = [
    {
      name: 'entrance',
      messages: [
        'At long last you\'ve found the dungeon entrance of Flerb!!!',
        'You stand before two tunnels. The one on your left is large and appears relatively dry. The tunnel on your right appears narrow and wet.'
      ],
      buttons: [
        {
          text: 'Left Tunnel',
          roomName: 'death1'
        },
        {
          text: 'Right Tunnel',
          roomName: 'wet-tunnel',
        }
      ]
    },
    {
      name: 'death1',
      messages: ['Moments after entering the ground gives way beneath your feet and you fall to your death. The people of your homeland will surely perish now.'],
      buttons: [],
    },
    {
      name: 'wet-tunnel',
      messages: [
        'You duck into the damp and narrow tunnel, blindly squeazing your way through the tight turns, cold water dripping down your neck. You stumble out into a short corridor and at the end there are two doors.',
        'The door on your right has a cold draft and soft light coming through the cracks in the frame. The door on your left is solid and heavy with no distinguishable features.'
      ],
      buttons: [
        {
          text: 'Left Door',
          validatesInventoryFor: 'Torch',
          roomNameFailure: 'wet-tunnel-end',
          roomNameSuccess: 'bat-room',
        },
        {
          text: 'Right Door',
          roomName: 'cold-room'
        }
      ],
    },
    {
      name: 'wet-tunnel-end',
      messages: [
        'It\'s too dark to go in the door on the left. You curse yourself for going dungeon hunting without a torch.',
        'The door on your right has a cold draft and soft light coming through the cracks in the frame. The door on your left is solid and heavy with no distinguishable features.'
      ],
      buttons: [
        {
          text: 'Right Door',
          roomName: 'cold-room'
        }
      ]
    },
    {
      name: 'cold-room',
      messages: [
        'You walk into a cold room with a torch burning on the wall. Your see a table with a sling-shot, two apples, and half a loaf of bread on it. You grab these items and stow them.'
      ],
      buttons: [
        {
          text: 'Return To Corridor',
          roomName: 'wet-tunnel-torch',
          addsToInventory: ['Apples', 'Bread', 'Sling-Shot', 'Torch'],
        }
      ]
    },
    {
      name: 'wet-tunnel-torch',
      messages: [
        'Now that you have the torch you can continue on your journey.'
      ],
      buttons: [
        {
          text: 'Left Door',
          roomName: 'bat-room',
          healthVar: -10
        }
      ]
    },
    {
      name: 'bat-room',
      messages: [
        'You cautiously walk into the room with the torch held in front of you and are greeted with the sight of a giant ugly bat. It screeches loudly and dives at you, biting your face. You take 10 damage.',
      ],
      buttons: [
        {
          text: 'Attack With Sling-Shot',
          roomName: 'bat-room-sling'
        },
        {
          text: 'Attack With Knife',
          roomName: 'bat-room-knife',
          healthVar: -10
        }
      ]
    },
    {
      name: 'bat-room-sling',
      messages: [
        'You load a marble into your sling-shot and let it loose, striking the bat square between the eyes. It falls to the ground in a heap.',
        'You look around the room and notice the opening of a tunnel on the opposite side.'
      ],
      buttons: [
        {
          text: 'Enter Tunnel',
          roomName: 'long-tunnel'
        }
      ]
    },
    {
      name: 'bat-room-knife',
      messages: [
        'You strike with the knife missing the bat. It deals you 10 more damage.'
      ],
      buttons: [
        {
          text: 'Attack With Sling-Shot',
          roomName: 'bat-room-sling'
        }
      ]
    },
    {
      name: 'long-tunnel',
      messages: [
        'This tunnel is longer than the ones before. As you walk you notice it has smooth uniform sides. You continue in an uninterupted straight line for many hours.',
        'Your journey has left you feeling tired and weak.'
      ],
      buttons: [
        {
          text: 'Eat Apples',
          roomName: 'long-tunnel-end',
          healthVar: 10,
          removesFromInventory: 'Apples'
        },
        {
          text: 'Eat Bread',
          roomName: 'long-tunnel-end',
          healthVar: 15,
          removesFromInventory: 'Bread'
        }
      ]
    },
    {
      name: 'long-tunnel-end',
      messages: [
        'Your health has been replenished!',
        'You exit the long tunnel into a great cavern with a waterfall flowing into a small river. You see a staircase carved into the cliffside leading to the top of the waterfall.'
      ],
      buttons: [
        {
          text: 'Follow River',
          roomName: 'river'
        },
        {
          text: 'Climb Stairs',
          roomName: 'stairs'
        }
      ]
    }
  ];
}

Game.prototype.getCurrentPlayer = function() {
  return this.currentPlayer;
};

Game.prototype.start = function() {
  var newPlayer = new Player();
  newPlayer.displayInventory();
  newPlayer.updateHealth();
  this.currentPlayer = newPlayer;
  this.goToRoom('entrance');
};

Game.prototype.goToRoomByButton = function(button) {
  var roomToGoTo;

  if (button.validatesInventoryFor) {
    if (this.getCurrentPlayer().checkForItem(button.validatesInventoryFor)) {
      roomToGoTo = button.roomNameSuccess;
    } else {
      roomToGoTo = button.roomNameFailure;
    }
  } else {
    roomToGoTo = button.roomName;
  }

  if (button.addsToInventory) {
    this.getCurrentPlayer().inventory = this.getCurrentPlayer().inventory.concat(button.addsToInventory);
    this.getCurrentPlayer().displayInventory();
  }

  if (button.healthVar) {
    this.getCurrentPlayer().changeHealth(button.healthVar);
  }

  if (button.removesFromInventory) {
    this.getCurrentPlayer().removeInventory(button.removesFromInventory);
    this.getCurrentPlayer().displayInventory();
  }

  this.goToRoom(roomToGoTo);
};

Game.prototype.goToRoom = function(roomName) {
  var room = this.rooms.find(function(room) {
    return room.name === roomName;
  });

  if (!room) {
    window.alert('YOU HAVE NOT DEFINED THAT ROOM '+ roomName);
    return;
  }

  window.$('#story .messages').hide(800, function() {
    window.$('#story .messages')[0].innerHTML = room.messages.reduce(function(memo, message) {
      return memo + '<p>' + message + '</p>';
    }, '');
    window.$('#story .messages').show(800);
  });

  if (room.buttons.length) {
    window.$('#story .button-group').hide(800, function() {
      window.$('#story .button-group')[0].innerHTML = room.buttons.reduce(function(memo, button) {
        return memo + "<button class='btn' data-button='"+ JSON.stringify(button) +"'>" + button.text + "</button>";
      }, '');
      window.$('#story .button-group').show(800);
    });

  } else {
    window.$('.button-group').empty(800);
    window.$('.try-again').show(800);
  }
};

function Player() {
  this.inventory = ['Knife', 'Marbles'];
  this.health = 90;
}

Player.prototype.displayInventory = function() {
  $('#player-inventory').empty();
  for (var i = 0; i < this.inventory.length; i++) {
    $('#player-inventory').append('<li>' + this.inventory[i] + ' </li>');
  }
};

Player.prototype.removeInventory = function(item) {
	for (var i = 0; i <  this.inventory.length; i++) {
	  if (this.inventory[i] === item) {
    var x = this.inventory.indexOf(item);
	  this.inventory.splice(x, 1);
    this.displayInventory();
    }
  }
};

Player.prototype.checkForItem = function(item) {
  for (var i = 0; i < this.inventory.length; i++) {
    if (this.inventory[i] === item) {
      return true;
    }
  } return false;
};

Player.prototype.changeHealth = function(damage) {
  this.health += damage;
  this.updateHealth();
};

Player.prototype.updateHealth = function() {
  $('#player-health').text(this.health);
};

function handleDocumentReady() {
  prepareGame();
  prepareClickHandlers();
  window.game.start();
}

function prepareGame() {
  var game = new Game();
  window.game = game;
}

function prepareClickHandlers() {
  $('.try-again').click(function() {
    location.reload();
  });

  $('#story .button-group').click(function(event) {
    var button = event.target;
    var buttonObj = button.getAttribute('data-button');

    if(buttonObj) {
      window.game.goToRoomByButton(JSON.parse(buttonObj));
    }
  });
}

$(document).ready(handleDocumentReady);

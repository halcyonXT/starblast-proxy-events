
const createShipProxy = (ship, context) => {
  return new Proxy(ship, {
    set(target, property, value) {
      if (property === 'alive') {
        if (!ship.hasOwnProperty("wasAlive")) {
            ship.wasAlive = value; 
        } else {
            if (!ship.wasAlive & value) {
                context.event({name: 'ship_spawned', ship: ship}, game);
            }
            ship.wasAlive = value;
        }
      }
      return Reflect.set(target, property, value);
    }
  });
}

const proxiedShips = new Proxy(game.ships, {
  set: (target, property, value) => {
    const newShip = target[value - 1];
    if (newShip) {
      target[value - 1] = createShipProxy(newShip, this);
      this.event({name: 'ship_spawned', ship: target[value - 1]}, game);
      this.event({name: 'ship_joined', ship: target[value - 1]}, game);
    }
    return Reflect.set(target, property, value);
  }
});

game.ships = proxiedShips;

const proxiedAliens = new Proxy(game.aliens, {
  set: (target, property, value) => {
    const newAlien = target[value - 1];
    if (newAlien) {
      this.event({name: 'alien_spawned', alien: target[value - 1]}, game);
    }
    return Reflect.set(target, property, value);
  }
});

game.aliens = proxiedAliens

this.event = function (event, game) {
    switch (event.name) {
        case "ship_joined":
            if (event.ship) {
                echo("I just joined the game")
            }
            break
        case "ship_spawned":
            if (event.ship) {
                echo("I just joined/respawned")
            }
            break;
        case "alien_spawned":
            echo("An alien just spawned");
            break;
    }
};

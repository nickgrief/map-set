interface Server {
  name: string;
  maxPlayers: number;
  currentPlayers: Player[];
}

class Player {
  name: string;
  playerClass: "Warrior" | "Mage" | "Archer";
  team: "Orks" | "Humans" | "Aliens";
  server: Server | null;
  session: Session | null;

  constructor(
    name: string,
    playerClass: "Warrior" | "Mage" | "Archer",
    team: "Orks" | "Humans" | "Aliens"
  ) {
    this.name = name;
    this.playerClass = playerClass;
    this.team = team;
    this.server = null;
    this.session = null;
  }

  connect = (server: Server, session: Session) => {
    this.server = server;
    this.session = session;
    server.currentPlayers.push(this);
    this.session.set(this, <Stats>{
      kills: 0,
      deaths: 0,
    });
    console.log(
      `Player: ${this.name} has connected to the server ${server.name}.`
    );
  };

  disconnect = () => {
    const index = server.currentPlayers.findIndex((player) => player === this);
    server.currentPlayers.splice(index);
    this.server = null;
    this.session = null;
    console.log(
      `Player: ${this.name} has disconnected from the server ${server.name}.`
    );
  };

  die = () => {
    if (this.session) {
      const prev = this.session.get(this);
      if (prev) {
        this.session.set(this, <Stats>{
          kills: prev.kills,
          deaths: prev.deaths + 1,
        });
      }
    }
    console.log(`Player: ${this.name} has died.`);
  };

  kill = (targetPlayer: Player) => {
    if (this.session) {
      const prev = this.session.get(this);
      if (prev) {
        this.session.set(this, <Stats>{
          kills: prev.kills + 1,
          deaths: prev.deaths,
        });
      }
    }
    console.log(`Player: ${this.name} has killed player ${targetPlayer.name}.`);
    targetPlayer.die();
  };

  say = (message: string) => {
    console.log(`${this.name}: ${message}`);
  };

  showOff = () => {
    console.log(
      `Player ${this.name}'s stats:\nKills: ${
        this.session?.get(this)?.kills
      }\nDeaths: ${this.session?.get(this)?.deaths}`
    );
  };
}

interface Stats {
  kills: number;
  deaths: number;
}

type Session = WeakMap<Player, Stats>;

const server: Server = {
  name: "Evergaol",
  maxPlayers: 255,
  currentPlayers: [],
};

const sessions = new WeakMap<Player, Stats>();

const playerOne = new Player("Alugrath", "Mage", "Humans");
playerOne.connect(server, sessions);

let playerTwo = new Player("Magasa", "Archer", "Aliens");
playerTwo.connect(server, sessions);

playerOne.kill(playerTwo);
playerOne.kill(playerTwo);
playerTwo.kill(playerOne);
playerOne.kill(playerTwo);

playerOne.showOff();
playerOne.say("What's up?");

playerTwo.disconnect();

playerOne.say("Ha-ha-ha");

playerTwo = new Player("John", "Warrior", "Humans");
playerTwo.connect(server, sessions);

playerTwo.say("Hey, I'm his brother...");

playerTwo.kill(playerOne);
playerTwo.kill(playerOne);
playerTwo.kill(playerOne);
playerTwo.kill(playerOne);

playerTwo.showOff();

playerOne.say("I'm sorry.");

playerOne.disconnect();

playerTwo.disconnect();

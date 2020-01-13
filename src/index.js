import GameState from 'states/GameState';
import MainMenu from 'states/MainMenu';
import Preload from 'states/Preload';

class Game extends Phaser.Game {

	constructor(config) {
		super(config);
		//this.load.image('background','assets/images/backgrounds/background.jpg');
		this.state.add('MainMenu', MainMenu, false);
		this.state.add('GameState', GameState, false);
		//this.state.start('MainMenu');
		
	}
}
var config = {
    width: 720,
    height: 1280,
    renderer: Phaser.AUTO,
    state: Preload
}
new Game(config);

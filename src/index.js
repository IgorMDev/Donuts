import GameState from 'states/GameState';
import MainMenu from 'states/MainMenu';
import Preload from 'states/Preload';
import Tutorial from './objects/Tutorial';

class Game extends Phaser.Game {

	constructor(config) {
		super(config);
		this.state.add('MainMenu', MainMenu, false);
		this.state.add('Tutorial', Tutorial, false);
		this.state.add('GameState', GameState, false);
		
	}
}
var config = {
    width: 720,
    height: 1280,
    renderer: Phaser.AUTO,
    state: Preload
}
new Game(config);

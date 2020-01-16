
import MatchGrid from '../objects/MatchGrid';
import ScoreLabel from '../objects/ScoreLabel';
import ProgressTimer from '../objects/Timer';
import GameOver from '../objects/GameOver';

class GameState extends Phaser.State {
	constructor(){
		super();
	}
	preload(){
		
	}
	create() {
		let center = { x: this.game.world.centerX, y: this.game.world.centerY }
		

		this.scoreLabel = new ScoreLabel(this.game, center.x, 120, 0);
		this.add.existing(this.scoreLabel);

		let timerWidth = 680,
			timerHeight = 80;
		this.timer = new ProgressTimer(this.game, (this.world.width-timerWidth)/2, 250, timerWidth, timerHeight);

		let gridWidth = 700,
			gridHeight = 800;
		this.matchGrid = new MatchGrid(this.game,(this.world.width-gridWidth)/2, 400, gridWidth, gridHeight, 8, 7);
		this.matchGrid.onTimeAdd.add(this.timer.addSeconds, this.timer);
		this.matchGrid.onScoreChanged.add(this.scoreLabel.setValue, this.scoreLabel);
		let g = this.game.make.graphics(0,0);
		g.beginFill(0xaaaaaa, 0.6);
		g.drawRect(0,0, this.world.width, this.game.world.height);
		g.endFill();
		this.gameOver = new GameOver(this.game, 0,0, g.generateTexture());
		this.gameOver.visible = false;
		this.add.existing(this.gameOver);
		this.gameOver.onRestart.add(this.restartGame, this);
		this.gameOver.onMenu.add(this.endGame, this);

		this.timer.onTimeUp.add(this.matchGrid.disable, this.matchGrid);
		this.timer.onTimeUp.add(this.onTimeUp, this);

		this.startGame();
	}
	startGame(){
		this.matchGrid.createItems();
		this.timer.countDownSeconds(60);
	}
	restartGame(){
		this.matchGrid.reset();
		this.timer.countDownSeconds(60);
		this.gameOver.visible = false;
	}
	endGame(){
		this.timer.stop();
		this.matchGrid.disable();
		this.gameOver.visible = false;
		this.state.start('MainMenu');
	}
	onTimeUp(){
		this.gameOver.visible = true;
	}
}

export default GameState;

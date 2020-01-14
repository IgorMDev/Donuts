import DonutItem from '../objects/DonutItem';
import MatchGrid from '../objects/MatchGrid';
import ScoreLabel from '../objects/ScoreLabel';
import { Rectangle } from 'phaser';
import ProgressTimer from '../objects/Timer';
import ScoreManager from '../objects/ScoreManager';
import GameOver from '../objects/GameOver';

class GameState extends Phaser.State {
	constructor(){
		super();
		this.score = 0;
	}
	preload(){
		
	}
	create() {
		let center = { x: this.game.world.centerX, y: this.game.world.centerY }
		
		console.log('word width ' + this.world.width);
		let gridWidth = (this.world.width-30),
			gridHeight = this.world.height*0.6;
		let offset = (this.world.width-gridWidth)/2;
		this.game.score = new ScoreManager();
		this.matchGrid = new MatchGrid(this.game, offset, 500, gridWidth, gridHeight, gridWidth/7);
		this.matchGrid.createItems();
		this.timer = new ProgressTimer(this.game, 10000, 5, 150, 700, 64);
		this.timer.onTimeOut.add(this.matchGrid.disable, this.matchGrid);
		
		this.scoreLabel = new ScoreLabel(this.game, center.x, 100, 0);
		
		//this.scoreLabel.anchor.set(0.5, 0);
		this.add.existing(this.scoreLabel);
		DonutItem.ACTIONS.FIVE_SEC = () => {
			this.timer.addSeconds(5);
		}

		let g = this.game.make.graphics(0,0);
		g.beginFill(0xaaaaaa, 0.6);
		g.drawRect(0,0, this.world.width, this.game.world.height);
		g.endFill();
		this.gameOver = new GameOver(this.game, 0,0, g.generateTexture());
		this.gameOver.visible = false;
		this.add.existing(this.gameOver);
		this.gameOver.onRestart.add(this.startGame, this);
		this.gameOver.onMenu.add(this.endGame, this);
		this.startGame();
		
	}
	startGame(){
		this.matchGrid.respawnItems();
		this.timer.countDownSeconds(60);
	}
	endGame(){
		this.state.start('MainMenu');

	}
	countScore(items){
		let score = 0, multiplier = 1;
		for(let item of items){
			switch(item.type){
				
			}
		}
	}
}

export default GameState;

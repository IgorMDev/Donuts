import { Image, Signal } from "phaser";
import TextButton from "./TextButton";

class GameOver extends Image {
	constructor(game, x, y, key) {
		super(game, x, y, key);
		
		this.title = this.game.make.image(this.centerX, 150, 'timeUp');
		this.title.anchor.set(0.5, 0);
		this.addChild(this.title);
		
		this.restartBtn = new TextButton(this.game, this.centerX, 500, 'Рестарт', 64, this.onRestartBtn, this);
		this.restartBtn.anchor.set(0.5,0);
		this.menuBtn = new TextButton(this.game,this.centerX, 650, 'Меню', 64, this.onMenuBtn, this);
		this.menuBtn.anchor.set(0.5,0);
		this.addChild(this.restartBtn);
		this.addChild(this.menuBtn);
		this.onRestart = new Signal();
		this.onMenu = new Signal();
	}
	onRestartBtn(){
		this.onRestart.dispatch();
	}
	onMenuBtn(){
		this.onMenu.dispatch();
	}
}

export default GameOver;
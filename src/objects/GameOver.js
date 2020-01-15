import { Image, Signal } from "phaser";

class GameOver extends Image {
	constructor(game, x, y, key) {
		super(game, x, y, key);
		
		this.title = this.game.make.image(this.centerX, 150, 'timeUp');
		this.title.anchor.set(0.5, 0);
		this.addChild(this.title);
		
		this.label1 = this.game.make.text(0, 0,'Restart',{
			fontSize: 64,
			fill: 'white'
		});
		this.label2 = this.game.make.text(0, 0,'Menu',{
			fontSize: 64,
			fill: 'white'
		});
		this.label1.anchor.set(0.5,0);
		this.label2.anchor.set(0.5,0);
		this.restartBtn = this.game.make.button(this.centerX, 400, '', this.onRestartBtn, this);
		this.restartBtn.anchor.set(0.5,0);
		this.menuBtn = this.game.make.button(this.centerX, 600, '', this.onMenuBtn, this);
		this.menuBtn.anchor.set(0.5,0);
		this.addChild(this.restartBtn);
		this.addChild(this.menuBtn);
		this.restartBtn.addChild(this.label1);
		this.menuBtn.addChild(this.label2);
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
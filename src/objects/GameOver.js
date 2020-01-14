import { Sprite, Image, Button, Create, Signal } from "phaser";

class GameOver extends Image {
	constructor(game, x, y, key) {
		super(game, x, y, key);
		
		this.title = this.game.make.image(this.centerX, 100, 'timeUp');
		this.title.anchor.set(0.5, 0);
		this.addChild(this.title);
		let g = this.game.make.graphics(0,0);
		g.beginFill(0x888888);
		g.drawRect(0,0, this.world.width, this.game.world.height);
		g.endFill();
		this.label1 = this.game.make.text(this.centerX, 300,'Restart',{
			fontSize: 64,
			fill: 'white'
		});
		this.label2 = this.game.make.text(this.centerX, 500,'Menu',{
			fontSize: 64,
			fill: 'white'
		});
		this.label1.events.onInputUp.add(()=>{this.onRestart.dispatch();});
		this.label2.events.onInputUp.add(()=>{this.onMenu.dispatch()});
		this.addChild(this.label1);
		this.addChild(this.label2);
		this.onRestart = new Signal();
		this.onMenu = new Signal();
	}
	
}

export default GameOver;
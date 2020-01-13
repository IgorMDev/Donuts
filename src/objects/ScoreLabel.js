import { Sprite, Text } from "phaser";

class ScoreLabel extends Sprite {

	constructor(game, x, y, value) {
		super(game, x, y, 'scoreBoard');
		this.anchor.set(0.5);
		this.label = new Text(game,0,-8,value+'',{
			fontSize: 64,
			fill: 'white'
			
		});
		this.label.anchor.set(0.5);
		this.addChild(this.label);
	}
	
}

export default ScoreLabel;
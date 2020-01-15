import { Sprite, Text } from "phaser";

class ScoreLabel extends Sprite {

	constructor(game, x, y, value) {
		super(game, x, y, 'scoreBoard');
		this.anchor.set(0.5);
		this.value = value;
		this.label = this.game.make.text(0,-12,value+'',{
			fontSize: 54,
			fill: 'white',

		});
		this.label.anchor.set(0.5);
		this.addChild(this.label);
	}
	setValue(v){
		this.value = v;
		this.label.text = v+'';
	}
}

export default ScoreLabel;
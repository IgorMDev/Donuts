import { Button } from "phaser";

class TextButton extends Button{
	constructor(game, x, y, text, fsize, callback, context) {
		super(game, x, y, null, callback, context);
		this.label = this.game.make.text(0, 0,text,{
			fontSize: fsize,
			fill: 'white'
		});
		this.label.anchor.set(0.5);
		this.label.setShadow(5,5,'rgba(32,32,32,0.8)', 5);
		this.addChild(this.label);

	}
}

export default TextButton;
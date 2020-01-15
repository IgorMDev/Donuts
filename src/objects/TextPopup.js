import { Text } from "phaser";

class TextPopup extends Text{
	constructor(game, x, y, text) {
		super(game, x, y, text, {
			fontSize: 64,
			fill: 'white'
		})
		this.alpha = 0;
		this.popupTween = this.game.add.tween(this.scale).from({x: 0, y: 0},500, Phaser.Easing.Bounce.Out);
		this.hideTween = this.game.add.tween(this).to({alpha: 0},300);
		this.showTween = this.game.add.tween(this).to({alpha: 1},300);
	}
	showUpAt(x, y, text){
		this.x = x;
		this.y = y;
		if(text) this.text = text;
		this.showTween.start();
		this.popupTween.chain(this.hideTween).start();
	}
}

export default TextPopup;
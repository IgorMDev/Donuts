import { Image } from "phaser";

class Preload extends Phaser.State {

	preload(){
		this.load.image('background','assets/images/backgrounds/background.jpg');
		this.load.image('logo','assets/images/donuts_logo.png');
		this.load.image('scoreBoard','assets/images/bg-score.png');
		this.load.image('playBtn', 'assets/images/btn-play.png');
	}
	create() {
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.setMinMax(200,360,400,720)
		let center = { x: this.game.world.centerX, y: this.game.world.centerY }
		let bg = new Image(this, center.x, center.y, 'background');
		bg.scale.set(this.stage.height/bg.height)
		bg.anchor.set(0.5);
		this.stage.addChildAt(bg,0);
		this.state.start('GameState');
		//this.state.start('MainMenu');
		
	}
	
}

export default Preload;

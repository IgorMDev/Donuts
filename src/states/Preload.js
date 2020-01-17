import { Image } from "phaser";

class Preload extends Phaser.State {
	preload(){
		this.load.image('background','assets/images/backgrounds/background.jpg');
		this.load.image('logo','assets/images/donuts_logo.png');
		this.load.image('scoreBoard','assets/images/bg-score.png');
		this.load.image('playBtn', 'assets/images/btn-play.png');
		this.load.image('timeUp', 'assets/images/text-timeup.png');
		this.load.image('sfxBtn', 'assets/images/btn-sfx.png');
		this.load.image('item1','assets/images/game/gem-01.png');
		this.load.image('item2','assets/images/game/gem-02.png');
		this.load.image('item3','assets/images/game/gem-03.png');
		this.load.image('item4','assets/images/game/gem-04.png');
		this.load.image('item5','assets/images/game/gem-05.png');
		this.load.image('item6','assets/images/game/gem-06.png');
		// this.load.image('item7','assets/images/game/gem-07.png');
		// this.load.image('item8','assets/images/game/gem-08.png');
		// this.load.image('item9','assets/images/game/gem-09.png');
		// this.load.image('item10','assets/images/game/gem-10.png');
		// this.load.image('item11','assets/images/game/gem-11.png');
		// this.load.image('item12','assets/images/game/gem-12.png');
		this.load.image('itemShadow','assets/images/game/shadow.png');
		this.load.image('hand','assets/images/game/hand.png');
		this.load.audio('background', 'assets/audio/background.mp3');
		this.load.audio('kill', 'assets/audio/kill.mp3');
		this.load.audio('select', 'assets/audio/select-1.mp3');
		this.load.onLoadComplete.add(this.startGame, this);
	}
	create() {
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.setMinMax(200,360,400,720)
		let center = { x: this.game.world.centerX, y: this.game.world.centerY }
		let bg = new Image(this, center.x, center.y, 'background');
		bg.scale.set(this.stage.height/bg.height)
		bg.anchor.set(0.5);
		this.stage.addChildAt(bg,0);
	}
	startGame(){
		this.bgAudio = this.add.audio('background', 0.3, true)
		this.bgAudio.play();
		this.sound.onUnMute.add(()=>{this.bgAudio.play()});
		this.state.start('MainMenu');
		//this.state.start('GameState');
	}
}

export default Preload;

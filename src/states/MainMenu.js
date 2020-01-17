import SfxButton from "../objects/SfxButton";
import TextButton from "../objects/TextButton";

class MainMenu extends Phaser.State {
	create(){
		let center = { x: this.world.centerX, y: this.world.centerY }
		
		this.logo = this.add.image(center.x, 64, 'logo');
		this.logo.anchor.set(0.5,0);

		this.playBtn = this.add.button(center.x, center.y, 'playBtn', this.onPlayBtnClick, this);
		this.playBtn.onInputOver.add(this.onPlayBtnOver, this);
		this.playBtn.onInputOut.add(this.onPlayBtnOut, this);
		this.playBtn.anchor.set(0.5);

		this.soundBtn = new SfxButton(this.game, center.x, center.y + 500);
		this.soundBtn.anchor.set(0.5);
		this.add.existing(this.soundBtn);

		this.howToBtn = new TextButton(this.game, center.x, center.y + 300, 'Як грати', 60, this.showTutorial, this);
		this.howToBtn.anchor.set(0.5, 1);
		this.add.existing(this.howToBtn);

		this.playBtnOverTween = this.add.tween(this.playBtn).to({width: this.playBtn.width + 32}, 200, Phaser.Easing.Quadratic.In);
		this.playBtnOutTween = this.add.tween(this.playBtn).to({width: this.playBtn.width}, 200, Phaser.Easing.Quadratic.In);
		
	}
	onPlayBtnClick(target, pointer){
		this.state.start('GameState');
	}
	onPlayBtnOver(target, pointer){
		this.playBtnOverTween.start();
	}
	onPlayBtnOut(target, pointer){
		this.playBtnOutTween.start();
	}
	showTutorial(){
		this.state.start('Tutorial');
	}
}

export default MainMenu;

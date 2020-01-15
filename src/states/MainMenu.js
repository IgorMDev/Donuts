
class MainMenu extends Phaser.State {

	create() {
		let center = { x: this.world.centerX, y: this.world.centerY }
		
		this.logo = this.add.image(center.x, 64, 'logo');
		this.logo.anchor.set(0.5,0);

		this.playBtn = this.add.button(center.x, center.y, 'playBtn', this.onPlayBtnClick, this);
		this.playBtn.onInputOver.add(this.onPlayBtnOver, this);
		this.playBtn.onInputOut.add(this.onPlayBtnOut, this);
		this.playBtn.anchor.set(0.5);

		this.soundBtn = this.add.button(center.x, center.y+400, 'sfxBtn', this.onSoundBtn, this);
		this.soundBtn.anchor.set(0.5);

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
	onSoundBtn(){
		if(this.sound.mute){
			this.sound.mute = false;
		}else{
			this.sound.mute = true;
		}
	}
}

export default MainMenu;

import { Button } from "phaser";

class SfxButton extends Button{
	constructor(game, x, y) {
		super(game, x, y, 'sfxBtn', ()=>{
			this.onSoundBtn();
		});
	}
	onSoundBtn(){
		if(this.game.sound.mute){
			this.game.sound.mute = false;
		}else{
			this.game.sound.mute = true;
		}
	}
}

export default SfxButton;
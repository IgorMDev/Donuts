import GameOver from "../objects/GameOver";


class MainMenu extends Phaser.State {

	preload(){
		
		this.load.image('logo','assets/images/donuts_logo.png');
		this.load.image('scoreBoard','assets/images/bg-score.png');
		this.load.image('playBtn', 'assets/images/btn-play.png');
	}
	create() {
		
		let center = { x: this.world.centerX, y: this.world.centerY }
		
		console.log('childs '+this.stage.children.map(el => el.constructor+'\n'));
		console.log('stage width '+ this.stage.width + ' stage height '+this.stage.height);
		
		let logo = this.add.image(center.x, 64, 'logo');
		logo.anchor.set(0.5,0);

		let scoreBoard = this.add.image(center.x, this.stage.height, 'scoreBoard');
		scoreBoard.anchor.set(0.5,1);

		let playBtn = this.add.button(center.x, center.y, 'playBtn', this.onPlayBtnClick, this);
		playBtn.onInputOver.add(this.onPlayBtnOver, this);
		playBtn.onInputOut.add(this.onPlayBtnOut, this);
		playBtn.anchor.set(0.5);
		this.playBtnOverTween = this.add.tween(playBtn).to({width: playBtn.width + 32}, 200, Phaser.Easing.Quadratic.In);
		this.playBtnOutTween = this.add.tween(playBtn).to({width: playBtn.width}, 200, Phaser.Easing.Quadratic.In);
		
	}
	update(){

	}
	onPlayBtnClick(target, pointer){
		console.log('sender '+target);
		console.log('pointer '+pointer.x+','+pointer.y);
		//this.state.start('GameState');
	}
	onPlayBtnOver(target, pointer){
		this.playBtnOverTween.start();
		
	}
	onPlayBtnOut(target, pointer){
		this.playBtnOutTween.start();
	}
}

export default MainMenu;

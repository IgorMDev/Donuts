import { Signal } from "phaser";

class ProgressTimer{
	constructor(game, x, y, width, height) {
		this.game = game;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.timer = game.time.create(false);
		this.g = this.game.add.graphics(x,y);
		this.g1 = this.game.add.graphics(x,y);
		this.msDuration = 10000;
		this.msCounter = 0;
		this.step = 125;
		this.onTimeUp = new Signal();
		this.drawOuter();
		this.drawProgress(width);
	}
	countDownSeconds(s){
		this.msCounter = this.msDuration = s*1000;
		this.timer.loop(this.step, ()=>{
			this.msCounter -= this.step;
			if(this.msCounter <= 0){
				this.timeOut();
			}
			this.loop();
		}).timer.start();
	}
	addSeconds(ds){
		this.msCounter += ds*1000;
	}
	loop(){
		
		this.g1.width = this.msCounter/this.msDuration * this.width;
	}
	timeOut(){
		this.timer.stop();
		this.onTimeUp.dispatch();
	}
	stop(){
		this.timer.stop();
	}
	drawOuter(){
		this.g.beginFill(0x555555);
		this.g.drawRect(this.x-10,this.y-10,this.width+20, this.height+20);
		this.g.endFill();
	}
	drawProgress(p){
		this.g1.clear();
		this.g1.beginFill(0xaaaaaa);
		this.g1.drawRect(this.x,this.y, p*this.width, this.height);
		this.g1.endFill();
	}
}

export default ProgressTimer;
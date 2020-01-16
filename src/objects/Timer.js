import { Signal } from "phaser";

class ProgressTimer{
	constructor(game, x, y, width, height) {
		this.game = game;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.innerWidth = width - 20;
		this.timer = game.time.create(false);
		this.g = this.game.add.graphics(x,y);
		this.g1 = this.game.add.graphics(x,y);
		this.msDuration = 10000;
		this.msCounter = 0;
		this.step = 125;
		this.onTimeUp = new Signal();
		this.drawOuter();
		this.drawInner();
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
		this.drawInner(this.msCounter/this.msDuration);
		//this.g1.width = this.msCounter/this.msDuration * this.innerWidth;
	}
	timeOut(){
		this.timer.stop();
		this.onTimeUp.dispatch();
	}
	stop(){
		this.timer.stop();
	}
	drawOuter(){
		this.g.clear();
		this.g.beginFill(0x555555);
		this.g.drawRect(0,0,this.width, this.height);
		this.g.endFill();
	}
	drawInner(p){
		this.g1.clear();
		this.g1.beginFill(0xaaaaaa);
		this.g1.drawRect(10,10, p*this.innerWidth, this.height-20);
		this.g1.endFill();
	}
}

export default ProgressTimer;
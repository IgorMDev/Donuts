import { Image, Sprite, RandomDataGenerator } from 'phaser';

class MatchItem extends Sprite {
	
	constructor(game, row, column) {
		super(game, 0, 0);
		this.row = row;
		this.column = column;
		this.anchor.set(0.5);
		this.inputEnabled = true;
		this.events.onInputOver.add(this.onOver, this);
		this.events.onInputOut.add(this.onOut, this);
		this.overTween = this.game.add.tween(this.scale).to({x: 1.1, y:1.1}, 200);
		this.outTween = this.game.add.tween(this.scale).to({x: 1, y:1}, 200);
		this.spawnTween = this.game.add.tween(this.scale).to({x: 1, y: 1}, 500, );
		this.removeTween = this.game.add.tween(this.scale).to({x: 0, y:0}, 500, Phaser.Easing.Back.In);
		this.selectedTween = this.game.add.tween(this).to({alpha: 0.5}, 500).yoyo(true);
		this.isSelected = false;
	}
	create(){
		this.type = this.game.rnd.pick(Object.keys(MatchItem.TYPES));
		this.shadow = new Image(this.game, 5, 10, 'itemShadow');
		this.shadow.anchor.set(0.5);
		this.item = new Sprite(this.game, 0, 0, MatchItem.TYPES[this.type]);
		this.item.anchor.set(0.5);
		this.addChild(this.shadow);
		this.addChild(this.item);
		
		this.game.add.tween(this.scale).from({x:0,y:0}, 500, Phaser.Easing.Back.Out, true);
		this.alive = true;
	}
	spawn(type = null){
		if(type && MatchItem.TYPES[type]){
			this.type = type;
		}else{
			this.type = this.game.rnd.pick(Object.keys(MatchItem.TYPES));
		}
		let itemTextureKey = MatchItem.TYPES[this.type];
		this.item.loadTexture(itemTextureKey);
		this.scale.set(0);
		this.spawnTween.start();
		this.alive = true;
	}
	remove(){
		this.removeTween.start();
		this.unselect();
		this.alive = false;
	}
	select(){
		if(this.alive){
			this.selectedTween.loop(true).start();
			this.isSelected = true;
		}
	}
	unselect(){
		this.selectedTween.loop(false);
		this.alpha = 1;
		this.isSelected = false;
	}
	onOver(target, pointer){
		if(this.alive)
			this.overTween.start();
		
	}
	onOut(target, pointer){
		if(this.alive)
			this.outTween.start();
		
	}
	//static bonusTypes = ['item7','item8','item9','item10','item11','item12'];
	
}
MatchItem.TYPES = {
	RED: 'item1', BLUE: 'item2', GREEN: 'item3', LIGHTBLUE: 'item4', YELLOW: 'item5', PINK: 'item6'};

export default MatchItem;
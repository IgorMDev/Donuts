import { Signal } from 'phaser';
import MatchItem from './MatchItem';

class DonutItem extends MatchItem {
	constructor(game, matchGrid, row, column) {
		super(game, matchGrid, row, column);
		this.events.onInputOver.add(this.onOver, this);
		this.events.onInputOut.add(this.onOut, this);
		this.overTween = this.game.add.tween(this.scale).to({x: 1.1, y:1.1}, 200);
		this.outTween = this.game.add.tween(this.scale).to({x: 1, y:1}, 200);
		this.spawnTween = this.game.add.tween(this.scale).to({x: 1, y: 1}, 500, );
		this.removeTween = this.game.add.tween(this.scale).to({x: 0, y:0}, 500, Phaser.Easing.Back.In);
		this.selectedTween = this.game.add.tween(this).to({alpha: 0.5}, 500).yoyo(true);
	}
	spawn(type = null){
		this.setTypeOrRandom(type);
		this.shadow = this.game.make.image(5, 10, 'itemShadow');
		this.shadow.anchor.set(0.5);
		this.item = this.game.make.sprite(0, 0, DonutItem.TYPES[this.type]);
		this.item.anchor.set(0.5);
		this.addChild(this.shadow);
		this.addChild(this.item);
		this.game.add.tween(this.scale).from({x:0,y:0}, 500, Phaser.Easing.Back.Out, true);
		this.onSpawned();
	}
	respawn(type = null){
		this.setTypeOrRandom(type, true);
		let itemTextureKey = DonutItem.TYPES[this.type] || DonutItem.BONUS_TYPES[this.type];
		if(itemTextureKey)
			this.item.loadTexture(itemTextureKey);
		this.scale.set(0);
		this.spawnTween.start();
		this.onSpawned();
	}
	onRemoved(){
		
		this.removeTween.start();
		super.onRemoved();
	}
	checkAction(){
		let action = DonutItem.ACTIONS[this.type];
		if(action) action(this);
	}
	onSelected(){
		this.selectedTween.loop(true).start();
		super.onSelected();
	}
	onUnselected(){
		this.selectedTween.loop(false);
		this.alpha = 1;
		super.onUnselected();
	}
	onOver(target, pointer){
		if(this.alive)
			this.overTween.start();
		
	}
	onOut(target, pointer){
		if(this.alive)
			this.outTween.start();
		
	}
	setTypeOrRandom(type = null, bonus = false){
		if(type && this.isValidType(type)){
			this.type = type;
		}else{
			this.type = this.getRandomType(bonus);
		}
	}
	getRandomType(bonus = false){
		if(bonus && Math.random() < 0.2){
			return this.game.rnd.pick(Object.keys(DonutItem.BONUS_TYPES));
		}
		return this.game.rnd.pick(Object.keys(DonutItem.TYPES));
	}
	isValidType(type){
		return DonutItem.TYPES.hasOwnProperty(type) || DonutItem.BONUS_TYPES.hasOwnProperty(type);
	}
	isAcceptableTo(item2){
		return this.type === item2.type || 
		(DonutItem.BONUS_TYPES[this.type] && DonutItem.TYPES[item2.type]) ||
		(DonutItem.BONUS_TYPES[item2.type] && DonutItem.TYPES[this.type]) ||
		(DonutItem.BONUS_TYPES[item2.type] && DonutItem.BONUS_TYPES[this.type]);
	}
	//static bonusTypes = ['item7','item8','item9','item10','item11','item12'];
	
}
DonutItem.TYPES = {
	RED: 'item1', BLUE: 'item2', GREEN: 'item3', LIGHTBLUE: 'item4', YELLOW: 'item5', PINK: 'item6'
};
DonutItem.BONUS_TYPES = {
	ALL: 'item7', ROW_COL: 'item8', COL: 'item9', ROW: 'item10', FIVE_SEC: 'item11', SCORE_DOUBLE: 'item12'
};
DonutItem.ACTIONS = {
	ALL: function(item){
		item.matchGrid.selectAllType(item.type);
	},
	ROW_COL: function(item){
		item.matchGrid.selectRow(item.row);
		item.matchGrid.selectColumn(item.column);
	},
	COL: function(item){
		item.matchGrid.selectColumn(item.column);
	},
	ROW: function(item){
		item.matchGrid.selectRow(item.row);
	},
	FIVE_SEC: function(item){
		
	},
	SCORE_DOUBLE: function(item){
		
	}
}

DonutItem.OnDoubleScore = new Signal();


export default DonutItem;
import { Sprite } from 'phaser';

class MatchItem extends Sprite {
	constructor(game, matchGrid, row, column) {
		super(game, 0, 0);
		this.matchGrid = matchGrid;
		this.row = row;
		this.column = column;
		this.isSelected = false;
		this.anchor.set(0.5);
		
		this.events.onInputOver.add(this.onOver, this);
		this.events.onInputOut.add(this.onOut, this);
		this.overTween = this.game.add.tween(this.scale).to({x: 1.1, y:1.1}, 200);
		this.outTween = this.game.add.tween(this.scale).to({x: 1, y:1}, 200);
		this.selectedTween = this.game.add.tween(this).to({alpha: 0.5}, 500).yoyo(true);

		this.type = 1;
		this.setRandomType();
		this.name = MatchItem.Names[this.type];
		this.shadow = this.game.make.image(5, 10, 'itemShadow');
		this.shadow.anchor.set(0.5);
		this.item = this.game.make.sprite(0, 0, this.name);
		this.item.anchor.set(0.5);
		this.addChild(this.shadow);
		this.addChild(this.item);
	}
	spawn(){
		let name = MatchItem.Names[this.type];
		if(name !== this.name) this.item.loadTexture(this.name=name);
		this.unselect();
		this.alive = true;
	}
	remove(){
		this.unselect();
		this.alive = false;
	}
	playSpawn(s=500){
		this.spawn();
		this.scale.set(0);
		this.game.add.tween(this.scale).to({x: 1, y: 1}, s, Phaser.Easing.Back.Out, true);
	}
	playRemove(s=500){
		this.remove();
		this.game.add.tween(this.scale).to({x: 0, y:0}, s, Phaser.Easing.Back.In, true);
	}
	collect(){
		let action = MatchItem.Actions[this.type];
		if(action) action(this);
		return 100;
	}
	select(){
		if(this.alive && !this.isSelected){
			this.selectedTween.loop(true).start();
			this.isSelected = true;
		}
	}
	unselect(){
		if(this.isSelected){
			this.selectedTween.loop(false);
			this.alpha = 1;
			this.isSelected = false;
		}
	}
	onOver(target, pointer){
		if(this.alive){
			this.overTween.start();
		}
	}
	onOut(target, pointer){
		if(this.alive){
			this.outTween.start();
		}
	}
	setRandomType(bonus = false){
		if(bonus && Math.random() < 0.1){
			this.type = this.game.rnd.pick(Object.keys(MatchItem.BonusTypes));
		}else{
			this.type = this.game.rnd.pick(Object.keys(MatchItem.Types));
		}
	}
	setRandomTypeExcept(...types){
		do{
			this.type = this.game.rnd.pick(Object.keys(MatchItem.Types));
		}while(types.indexOf(this.type) >= 0);
	}
	isValidType(type){
		return MatchItem.Types.hasOwnProperty(type) || MatchItem.BonusTypes.hasOwnProperty(type);
	}
	isAcceptableTo(item2){
		return this.type === item2.type || 
		(this.isBonusType() && item2.isBasicType());
	}
	isBasicType(){
		return MatchItem.Types.hasOwnProperty(this.type)
	}
	isBonusType(){
		return MatchItem.BonusTypes.hasOwnProperty(this.type)
	}
}
MatchItem.Names = {
	RED: 'item1', BLUE: 'item2', GREEN: 'item3', LIGHTBLUE: 'item4', YELLOW: 'item5', PINK: 'item6',
	ALL: 'item7', ROW_COL: 'item8', COL: 'item9', ROW: 'item10', FIVE_SEC: 'item11', SCORE_DOUBLE: 'item12'
}
MatchItem.Types = {
	RED: 1, BLUE: 2, GREEN: 3, LIGHTBLUE: 4, YELLOW: 5, PINK: 6
};
MatchItem.BonusTypes = {
	ALL: 7, ROW_COL: 8, COL: 9, ROW: 10, FIVE_SEC: 11, SCORE_DOUBLE: 12
};
MatchItem.Actions = {
	ALL(item){
		item.matchGrid.selectAllType();
	},
	ROW_COL(item){
		item.matchGrid.selectRow(item.row);
		item.matchGrid.selectColumn(item.column);
	},
	COL(item){
		item.matchGrid.selectColumn(item.column);
	},
	ROW(item){
		item.matchGrid.selectRow(item.row);
	},
	FIVE_SEC(item){
		item.matchGrid.addTime(5);
	},
	SCORE_DOUBLE(item){
		item.matchGrid.multiplyCollectedScores(2);
	}
}
export default MatchItem;
import { Sprite } from 'phaser';

class MatchItem extends Sprite {
	constructor(game, matchGrid, row, column) {
		super(game, 0, 0);
		this.matchGrid = matchGrid;
		this.row = row;
		this.column = column;
		this.anchor.set(0.5);
		this.isSelected = false;
	}
	spawn(type = null){
		this.setTypeOrRandom(type);
		this.onSpawned();
	}
	respawn(type = null){
		this.setTypeOrRandom(type);
		this.onSpawned();
	}
	remove(){
		this.unselect();
		this.alive = false;
	}
	onSpawned(){
		this.alive = true;
	}
	onRemoved(){}
	select(){
		if(this.alive){
			this.onSelected();
			this.isSelected = true;
		}
	}
	unselect(){
		this.onUnselected();
		this.isSelected = false;
	}
	onSelected(){}
	onUnselected(){}
	setTypeOrRandom(type = null){
		if(type && this.isValidType(type)){
			this.type = type;
		}else{
			this.type = this.getRandomType();
		}
	}
	getRandomType(){
		return this.game.rnd.pick(Object.keys(MatchItem.TYPES));
	}
	isValidType(type){
		return MatchItem.TYPES.hasOwnProperty(type);
	}
	isAcceptableTo(item2){
		return this.type === item2.type;
	}
}
MatchItem.TYPES = {
	A: 1, B: 2, C: 3, D: 4, E: 5, F: 6
};
export default MatchItem;
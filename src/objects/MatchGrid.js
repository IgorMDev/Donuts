import { Group, Signal } from "phaser";
import MatchItem from "./MatchItem";
import TextPopup from "./TextPopup";

class MatchGrid extends Group{
	constructor(game, x, y, width, height, cellSize) {
		super(game);
		this.itemsGroup = this.game.add.group(this);
		this.itemsGroup.inputEnableChildren = true;
		this.position.set(x, y);
		this.width = width;
		this.height = height;
		this.cellSize = cellSize;
		this.rows = Math.floor(width/cellSize);
		this.cols = Math.floor(height/cellSize);
		this.itemsGrid = [];
		this.selectedItems = [];
		this.lastSelected = null;
		this.firstSelected = null;
		this.minMatchNum = 3;
		this.scores = 0;
		this.scoreMultiplier = 1;
		this.enabled = false;
		this.isTrying = false;
		this.onTimeAdd = new Signal();
		this.onScoreChanged = new Signal();
		this.popupText = new TextPopup(this.game);
		this.popupText.anchor.set(0.5,1);
		this.addChild(this.popupText);

		this.killSound = this.game.add.sound('kill');
		this.selectSound = this.game.add.sound('select');
		this.selectSound.addMarker('1', 0, 250);
	}
	createItems(){
		if(!this.itemsGrid.length){
			this.fillItems();
			this.itemsGroup.addMultiple(this.itemsGrid);
			this.itemsGroup.align(this.rows, this.cols, this.cellSize, this.cellSize, Phaser.CENTER);
		}
		this.enable();
	}
	reset(){
		this.scores = 0;
		this.selectedItems = [];
		this.lastSelected = null;
		this.firstSelected = null;
		this.spawnItems();
		this.onScoreChanged.dispatch(this.scores);
	}
	spawnItems(){
		this.itemsGrid.forEach(el => el.spawn());
		this.enable();
	}
	enable(){
		if(!this.enabled){
			this.game.input.onUp.add(this.onItemUp, this);
			this.itemsGroup.onChildInputOver.add(this.onItemOver, this);
			this.itemsGroup.onChildInputDown.add(this.onItemDown, this);
			this.enabled = true;
		}
	}
	disable(){
		if(this.enabled){
			this.game.input.onUp.remove(this.onItemUp, this);
			this.itemsGroup.onChildInputOver.remove(this.onItemOver, this);
			this.itemsGroup.onChildInputDown.remove(this.onItemDown, this);
			this.unselectAllItems();
			this.enabled = false;
		}
	}
	fillItems(){
		let i, j;
		for(i = 0; i < this.rows; ++i){
			for(j = 0; j < this.cols; ++j){
				this.itemsGrid.push(new MatchItem(this.game, this, i, j));
			}
		}
	}
	onItemOver(target, pointer){
		if(pointer.isDown && target instanceof MatchItem){
			this.trySelect(target);
		}
	}
	onItemDown(target, pointer){
		if(target instanceof MatchItem){
			this.beginSelect(target);
		}
	}
	onItemUp(target, pointer){
		this.endSelect();
	}
	beginSelect(item){
		if(!this.firstSelected && item.isBasicType()){
			this.firstSelected = item;
			this.selectItem(item);
			this.isTrying = true;
		}
	}
	trySelect(item){
		if(this.lastSelected && !item.isSelected){
			if(this.isNeighborTo(this.lastSelected, item) && item.isAcceptableTo(this.firstSelected)){
				this.selectItem(item);
			}
		}
	}
	endSelect(){
		if(this.isTrying){
			if(this.selectedItems.length >= this.minMatchNum){
				this.collectSelected();
				this.removeSelected();
				setTimeout(()=> {
					this.fallDown();
					this.spawnRemoved()
				}, 800);
			}else if(this.selectedItems.length ){
				this.unselectAllItems();
			}
			this.isTrying = false;
		}
	}
	selectItem(item){
		item.select();
		this.selectSound.play('1');
		this.selectedItems.push(this.lastSelected = item);
	}
	unselectLastItem(){
		let item = this.selectedItems.pop()
		item.unselect();
		if(this.selectedItems.length){
			this.lastSelected = this.selectedItems[this.selectedItems.length - 1];
		}else{
			this.lastSelected = this.firstSelected = null;
		}
	}
	unselectAllItems(){
		this.selectedItems.forEach(el => el.unselect());
		this.selectedItems = [];
		this.lastSelected = this.firstSelected = null;
	}
	collectSelected(){
		this.scoreMultiplier = 1;
		let collectedScores = 0;
		for(let i = 0; i < this.selectedItems.length; ++i){
			collectedScores += this.selectedItems[i].collect();
		}
		this.onCollected(collectedScores);
	}
	onCollected(collectedScores){
		collectedScores *= (this.selectedItems.length / this.minMatchNum)*this.scoreMultiplier;
		collectedScores = Phaser.Math.roundTo(collectedScores, 0);
		this.scores += collectedScores;
		this.popupText.showUpAt(this.lastSelected.x, this.lastSelected.y, collectedScores+'');
		this.onScoreChanged.dispatch(this.scores);
	}
	removeSelected(){
		this.killSound.play();
		this.selectedItems.forEach(el => el.remove());
		this.lastSelected = this.firstSelected = null;
	}
	spawnRemoved(){
		this.selectedItems.forEach(el => el.spawn(true));
		this.selectedItems = [];
	}
	fallDown(){
		let r, c, e;
		for(c = 0; c < this.cols; ++c){
			e = 0;
			for(r = this.rows-1; r >= 0; --r){
				let i = r*this.rows+c;
				let item = this.itemsGrid[i];
				if(item){
					if(item.alive && e > 0){
						let j = (r+e)*this.rows+c;
						this.swapItems(i, j);
					}else if(!item.alive){
						++e;
					}
				}
			}
		}
	}
	swapItems(i, j){
		let item = this.itemsGrid[i],
			item2 = this.itemsGrid[j];
		this.itemsGrid[i] = item2;
		this.itemsGrid[j] = item;
		[item.position, item2.position] = [item2.position, item.position];
		[item.row, item.column, item2.row, item2.column] = [item2.row, item2.column,item.row, item.column];
	}
	selectRow(r){
		for(let c = 0; c < this.cols; ++c){
			let item = this.itemsGrid[r*this.rows+c];
			if(!item.isSelected && item.alive){
				this.selectedItems.push(item);
				item.isSelected = true;
			}
		}
	}
	selectColumn(c){
		for(let r = 0; r < this.rows; ++r){
			let item = this.itemsGrid[r*this.rows+c];
			if(!item.isSelected && item.alive){
				this.selectedItems.push(item);
				item.isSelected = true;
			}
		}
	}
	selectAllType(){
		let items = this.itemsGrid.filter(el => {
			if(el.type === this.firstSelected.type && !el.isSelected  && el.alive){
				el.isSelected = true;
				return true;
			}
			return false;
		});
		this.selectedItems.push(...items);
	}
	addTime(sec){
		this.onTimeAdd.dispatch(sec);
	}
	multiplyCollectedScores(n){
		this.scoreMultiplier *= n;
	}
	isNeighborTo(item, neighbor){
		if(Math.abs(item.row - neighbor.row) <= 1 && Math.abs(item.column - neighbor.column) <= 1){
			return true;
		}
		return false;
	}
}

export default MatchGrid;
import { Group, Point, Time } from "phaser";
import MatchItem from "./MatchItem";

class MatchGrid extends Group{
	constructor(game, x, y, width, height, cellSize) {
		super(game);
		this.position.set(x, y);
		this.width = width;
		this.height = height;
		this.cellSize = cellSize;
		this.rows = Math.floor(width/cellSize);
		this.cols = Math.floor(height/cellSize);
		this.itemsGrid = [];
		this.selectedItems = [];
		this.lastSelected = null;
		this.inputEnableChildren = true;
		this.minMatchNum = 3;
		this.isTrying = false;
	}
	createItems(){
		
		this.fillItems();
		this.addMultiple(this.itemsGrid);
		this.align(this.rows, this.cols, this.cellSize, this.cellSize, Phaser.CENTER);
		console.log('group childs '+this.children.length);
		
		this.game.input.onUp.add(this.onItemUp, this);
		this.onChildInputOver.add(this.onItemOver, this);
		this.onChildInputDown.add(this.onItemDown, this);
		this.itemsGrid.forEach(el => el.create());
		
	}
	update(){

	}
	fillItems(){
		let i, j;
		for(i = 0; i < this.rows; ++i){
			for(j = 0; j < this.cols; ++j){
				this.itemsGrid.push(new MatchItem(this.game, i, j));
			}
		}
	}
	onItemOver(target, pointer){
		if(target instanceof MatchItem){
			if(pointer.isDown && this.lastSelected && !target.isSelected){
				if(this.isNeighborTo(this.lastSelected, target) && this.isAcceptableTypes(this.lastSelected, target)){
					this.selectItem(target);
				}
			}
		}
	}
	onItemDown(target, pointer){
		if(target instanceof MatchItem){
			if(!this.lastSelected){
				this.selectItem(target);
			}
			this.isTrying = true;
		}
	}
	onItemUp(target, pointer){
		if(this.isTrying){
			if(this.selectedItems.length >= this.minMatchNum){
				this.removeSelected();
				setTimeout(()=> {this.fallDown();this.spawnRemoved()}, 500);
			}else if(this.lastSelected){
				this.unselectAllItems();
			}
			this.isTrying = false;
		}
	}
	fallDown(){
		let r, c,
			e = 0;
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
	selectItem(item){
		item.select();
		this.selectedItems.push(this.lastSelected = item);
		console.log('item selected '+item.row +','+item.column);
	}
	unselectLastItem(){
		let item = this.selectedItems.pop()
		item.unselect();
		this.lastSelected = this.selectedItems[this.selectedItems.length - 1];
	}
	unselectAllItems(){
		this.selectedItems.forEach(el => el.unselect());
		this.selectedItems = [];
		this.lastSelected = null;
		
		console.log('all items unselected');
	}
	removeSelected(){
		this.selectedItems.forEach(el => el.remove());
		this.lastSelected = null;
	}
	spawnRemoved(){
		this.selectedItems.forEach(el => el.spawn());
		this.selectedItems = [];
	}
	isNeighborTo(item, neighbor){
		if(Math.abs(item.row - neighbor.row) <= 1 && Math.abs(item.column - neighbor.column) <= 1){
			return true;
		}
		return false;
	}
	isAcceptableTypes(item, item2){
		return item.type === item2.type;
	}
}

export default MatchGrid;
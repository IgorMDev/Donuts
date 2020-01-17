import { Group, Signal } from "phaser";
import MatchItem from "./MatchItem";
import TextPopup from "./TextPopup";

class MatchGrid extends Group{
	constructor(game, x, y, width, height, rows, cols) {
		super(game);
		this.itemsGroup = this.game.add.group(this);
		this.itemsGroup.inputEnableChildren = true;
		this.position.set(x, y);
		this.width = width;
		this.height = height;
		this.cellWidth = width/cols;
		this.cellHeight = height/rows;
		this.rows = rows;
		this.cols = cols;
		this.itemsGrid = [];
		this.selectedItems = [];
		this.removedItems = [];
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
			this.itemsGroup.align(this.cols, this.rows, this.cellWidth-1, this.cellHeight, Phaser.CENTER);
			this.itemsGroup.scale.set(1);
		}
		this.reset();
		this.enable();
	}
	reset(){
		this.scores = 0;
		this.selectedItems = [];
		this.lastSelected = null;
		this.firstSelected = null;
		this.itemsGrid.forEach(el=> el.setRandomType());
		for(let i = 0; i < this.itemsGrid.length; ++i){
			let item = this.itemsGrid[i];
			this.checkDifference(item);
		}
		this.spawnItems();
		this.onScoreChanged.dispatch(this.scores);
	}
	spawnItems(){
		this.itemsGrid.forEach(el=> el.playSpawn());
		this.enable();
	}
	checkDifference(item){
		let r = item.row, c = item.column;
		let exc;
		if(r-1 >= 0 && r+1 < this.rows){
			let p = this.itemsGrid[this.ij(r-1,c)],
				n = this.itemsGrid[this.ij(r+1,c)];
			if(p.type === item.type && n.type === item.type){
				exc = item.type;
			}
		}
		if(!exc && c-1 >= 0 && c+1 < this.cols){
			let p = this.itemsGrid[this.ij(r,c-1)],
				n = this.itemsGrid[this.ij(r,c+1)];
			if(p.type === item.type && n.type === item.type){
				exc = item.type;
			}
		}
		if(exc) item.setRandomTypeExcept(exc);
	}
	ij(i,j){
		return i*this.cols+j;
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
	onItemDown(target, pointer){
		if(target instanceof MatchItem){
			this.beginSwap(target);
		}
	}
	onItemOver(target, pointer){
		if(pointer.isDown && target instanceof MatchItem){
			this.endSwap(target);
		}
	}
	onItemUp(target, pointer){
		//this.endSwap();
	}
	
	beginSwap(item){
		if(!this.isTrying && item.isBasicType()){
			this.firstSelected = item;
			//this.selectItem(item);
			this.isTrying = true;
		}
		
	}
	async endSwap(item){
		if(this.isTrying && this.firstSelected && !this.lastSelected){
			if(this.isNeighborTo(this.firstSelected, item)){
				//this.selectItem(item);
				this.lastSelected = item;
				await this.swapItems(this.firstSelected, this.lastSelected);
				this.checkMatchAtItem(this.firstSelected);
				this.checkMatchAtItem(this.lastSelected);
				if(this.selectedItems.length < this.minMatchNum){
					await this.swapItems(this.firstSelected, this.lastSelected);
					this.firstSelected = this.lastSelected = null;
				}else{
					await this.checkSelected();
				}
			}
			this.isTrying = false;
		}
	}
	async checkSelected(){
		if(this.selectedItems.length >= this.minMatchNum && this.enabled){
			this.collectSelected();
			await this.playRemoveSelected(300);
			this.fallDown();
			await this.playSpawnRemoved(300);
			this.checkMatches();
			this.checkSelected();
		}
	}
	selectItem(item){
		item.select();
		this.selectSound.play('1');
		this.lastSelected = item
		//this.selectedItems.push(item);
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
		let rItem = this.game.rnd.pick(this.selectedItems);
		this.popupText.showUpAt(rItem.x, rItem.y, collectedScores+'');
		this.onScoreChanged.dispatch(this.scores);
	}
	playRemoveSelected(s=500){
		this.killSound.play();
		this.selectedItems.forEach(el => el.playRemove(s));
		return new Promise(resolve => {
			setTimeout(()=>{
				this.removedItems.push(...this.selectedItems.splice(0));
				this.lastSelected = this.firstSelected = null;
				resolve();
			}, s);
		});
	}
	playSpawnRemoved(s=500){
		this.removedItems.splice(0).forEach(el => {
			el.setRandomType();
			el.playSpawn(s);
		});
		return new Promise(resolve => {
			setTimeout(()=>{
				resolve();
			}, s);
		})
	}
	checkMatchAtItem(item){
		let ir = item.row, 
			ic = item.column;
		let item2;
		let cl = ic, cr = ic,
			rb = ir, rt = ir;
		let i;
		//left
		for(i = ic - 1; i >= 0; --i){
			item2 = this.itemsGrid[ir*this.cols+i];
			if(item2.type === item.type){
				cl = i;
				continue;
			}
			break;
		}
		//right
		for(i = ic + 1; i < this.cols; ++i){
			item2 = this.itemsGrid[ir*this.cols+i];
			if(item2.type === item.type){
				cr = i;
				continue;
			}
			break;
		}
		//top
		for(i = ir - 1; i >= 0; --i){
			item2 = this.itemsGrid[i*this.cols+ic];
			if(item2.type === item.type){
				rt = i;
				continue;
			}
			break;
		}
		//bottom
		for(i = ir + 1; i < this.rows; ++i){
			item2 = this.itemsGrid[i*this.cols+ic];
			if(item2.type === item.type){
				rb = i;
				continue;
			}
			break;
		}
		let dc = cr - cl + 1,
			dr = rb - rt + 1;
		if(dc >= this.minMatchNum) this.selectRow(ir, cl, cr+1);
		if(dr >= this.minMatchNum) this.selectColumn(ic, rt, rb+1);
	}
	checkMatches(){
		for(let r = 0; r < this.rows; ++r){
			this.checkMatchAtRow(r);
		}
		for(let c = 0; c < this.cols; ++c){
			this.checkMatchAtCol(c);
		}
	}
	checkMatchAtRow(r){
		let item,item2, c, c1;
		for(c = 0; c < this.cols; ++c){
			item = this.itemsGrid[r*this.cols+c];
			for(c1 = c+1; c1 < this.cols; ++c1){
				item2 = this.itemsGrid[r*this.cols+c1];
				if(item.type !== item2.type) break;
			}
			if(c1 - c >= this.minMatchNum){
				this.selectRow(r, c, c1);
			}
			c = c1-1;
		}
	}
	checkMatchAtCol(c){
		let item, item2, r, r1;
		for(r = 0; r < this.rows; ++r){
			item = this.itemsGrid[r*this.cols+c];
			for(r1 = r+1; r1 < this.rows; ++r1){
				item2 = this.itemsGrid[r1*this.cols+c];
				if(item.type !== item2.type) break;
			}
			if(r1 - r >= this.minMatchNum){
				this.selectColumn(c, r, r1);
			}
			r = r1-1;
		}
		
	}
	fallDown(){
		let r, c, e;
		for(c = 0; c < this.cols; ++c){
			e = 0;
			for(r = this.rows-1; r >= 0; --r){
				let i = r*this.cols+c;
				let item = this.itemsGrid[i];
				if(item){
					if(item.alive && e > 0){
						let j = (r+e)*this.cols+c;
						this.swapItemsByIndex(i, j);
					}else if(!item.alive){
						++e;
					}
				}
			}
		}
	}
	swapItems(item1, item2){
		this.swapItemsByIndex(item1.row*this.cols + item1.column, item2.row* this.cols + item2.column);
		return new Promise(resolve => {
			setTimeout(()=>{
				resolve();
			}, 200)
		});
	}
	swapItemsByIndex(i, j){
		let item = this.itemsGrid[i],
			item2 = this.itemsGrid[j];
		this.itemsGrid[i] = item2;
		this.itemsGrid[j] = item;
		[item.position, item2.position] = [item2.position, item.position];
		[item.row, item.column, item2.row, item2.column] = [item2.row, item2.column,item.row, item.column];
	}
	selectRow(r, c1, c2){
		let c = c1 || 0;
		let ct = c2 || this.cols;
		while(c < ct){
			let item = this.itemsGrid[r*this.cols+c];
			if(!item.isSelected && item.alive){
				this.selectedItems.push(item);
				item.isSelected = true;
			}
			c++;
		}
	}
	selectColumn(c, r1, r2){
		let r = r1 || 0;
		let rt = r2 || this.rows;
		while(r < rt){
			let item = this.itemsGrid[r*this.cols+c];
			if(!item.isSelected && item.alive){
				this.selectedItems.push(item);
				item.isSelected = true;
			}
			r++;
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
		return ((item.column === neighbor.column && Math.abs(item.row - neighbor.row) <= 1) || 
			(item.row === neighbor.row && Math.abs(item.column - neighbor.column) <= 1));
	}
}

export default MatchGrid;
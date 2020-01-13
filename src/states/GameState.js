import { MatchItem, MatchItemType } from '../objects/MatchItem';
import MatchGrid from '../objects/MatchGrid';
import ScoreLabel from '../objects/ScoreLabel';
import { Rectangle } from 'phaser';

class GameState extends Phaser.State {

	preload(){
		this.load.image('item1','assets/images/game/gem-01.png');
		this.load.image('item2','assets/images/game/gem-02.png');
		this.load.image('item3','assets/images/game/gem-03.png');
		this.load.image('item4','assets/images/game/gem-04.png');
		this.load.image('item5','assets/images/game/gem-05.png');
		this.load.image('item6','assets/images/game/gem-06.png');
		this.load.image('itemShadow','assets/images/game/shadow.png');
	}
	create() {
		let center = { x: this.game.world.centerX, y: this.game.world.centerY }
		//let item = new MatchItem(this.game, center.x, center.y, MatchItemType.RED);
		//this.add.existing(item);
		console.log('word width ' + this.world.width);
		let gridWidth = (this.world.width-30),
			gridHeight = this.world.height*0.6;
		let offset = (this.world.width-gridWidth)/2;
		this.matchGrid = new MatchGrid(this.game, offset, 500, gridWidth, gridHeight, gridWidth/7);
		this.matchGrid.createItems();
		
		
		this.scoreLabel = new ScoreLabel(this.game, center.x, 100, 1223);
		//this.scoreLabel.anchor.set(0.5, 0);
		this.add.existing(this.scoreLabel);
		//this.add.existing(mg);
	}

}

export default GameState;

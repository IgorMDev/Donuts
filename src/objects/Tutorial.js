import { State } from "phaser";
import TextButton from "./TextButton";

class Tutorial extends State{
	create(){
		let center = { x: this.world.centerX, y: this.world.centerY };
		let title = this.add.text(center.x, 64, 'Як грати',{
			fontSize: 70,
			fill: 'white'
		});
		title.anchor.set(0.5,0);
		title.setShadow(5,5,'rgba(32,32,32,0.8)', 5);

		this.items = this.game.add.group();
		this.items.addMultiple([
			this.make.image(0,0,'item2'),
			this.make.image(0,0,'item4'),
			this.make.image(0,0,'item3'),
			this.make.image(0,0,'item5'),
			this.make.image(0,0,'item2'),
			this.make.image(0,0,'item3'),
			this.make.image(0,0,'item2'),
			this.make.image(0,0,'item6'),
			this.make.image(0,0,'item4')
		]);
		this.items.align(3,3, 120, 120);
		this.items.position.set((this.world.width-this.items.width)/2, center.y-this.items.height/1.5);

		let h = this.items.getChildAt(4);
		let ht = this.items.getChildAt(3);
		let handPointer = this.game.make.image(h.x+h.width/2, h.y+h.height/2, 'hand');
		handPointer.anchor.set(0.1,0);
		this.items.addChild(handPointer);
		this.add.tween(handPointer).to({x: ht.x+ht.x/3}, 1000, Phaser.Easing.Quadratic.Out, true).loop(true);

		let desc = this.add.text(center.x, center.y + 300,'Перетягуйте пончики для комбінацї 3 або більше елементів одного кольору',{
			fontSize: 42,
			fill: 'white',
			wordWrap: true,
			wordWrapWidth: this.world.width - 100,
			maxLines: 4,
			align: 'center'
		});
		desc.anchor.set(0.5);
		desc.setShadow(5,5,'rgba(32,32,32,0.8)', 5);

		let closeBtn = new TextButton(this.game, center.x, center.y+550, 'Закрити', 60, this.close, this);
		closeBtn.anchor.set(0.5);
		this.add.existing(closeBtn);
	}
	close(){
		this.state.start('MainMenu');
	}
}

export default Tutorial;
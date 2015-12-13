var Battle = function(player, enermy, escapable) {
	if (typeof escapable === "undefined") {
		escapable = true;
	}
	this.state = "choose";
	this.player = player;
	this.enermy = enermy;
	this.record = [];
	this.frame = 0;
	this.anime = true;
	this.escapable = escapable;
	this.choose = ["attack", "defence", "item", "escape"];
	this.curChoose = 0;
	this.chooseItem = false;
	this.itemPointer = 0;
};

var BattleControl = function(game) {
	this.tick = function() {
		var battle = game.battle;
		if (battle.anime) {
			return;
		}
		if (battle.state === "choose") {
			return;
		}
		if (battle.state === "player") {
			battle.enermy.hp -= Math.floor(battle.player.atk * ((Math.random() - 0.5) * 0.4 + 1));
			if (battle.enermy.hp <= 0) {
				battle.state = "end";
				battle.anime = true;
			} else {
				battle.state = "enermy";
				battle.anime = true;
			}
		} else if (battle.state === "enermy") {
			var damage = battle.enermy.atk * ((Math.random() - 0.5) * 0.4 + 1);
			if (battle.choose[battle.curChoose] === "defence") {
				damage /= 2;
			}
			battle.player.hp -= Math.floor(damage);

			if (battle.player.hp <= 0) {
				battle.state = "end";
				battle.anime = true;
			} else {
				battle.state = "choose";
			}
		} else if (battle.state === "end") {
			if (game.player.hp <= 0) {
				game.state = "end";
			} else if (battle.enermy.hp <= 0) {
				battle.player.exp += battle.enermy.exp;
				battle.player.money += battle.enermy.money;
				if (battle.player.exp >= battle.player.needExp) {
					battle.player.levelUp();
				}
			}
			if (game.story.canToNext(game)) {
				game.story.toNext(game);
				game.state = "story";
				return;
			}
			game.battle = null;
			game.state = "ground";
		}
	};
	$env.bind("keydown", function(event) {
		var battle = game.battle;
		if (game.state === "battle" && battle.state === "choose") {
			if (event.which === 38) {
				if (battle.chooseItem) {
					battle.itemPointer--;
					battle.itemPointer = battle.itemPointer < 0 ? 0 : battle.itemPointer;
				} else {
					battle.curChoose--;
					battle.curChoose = battle.curChoose < 0 ? 0 : battle.curChoose;
				}
			} else if (event.which === 40) {
				if (battle.chooseItem) {
					battle.itemPointer++;
					battle.itemPointer = battle.itemPointer >= battle.player.items.length ? battle.player.items.length - 1 : battle.itemPointer;
				} else {
					battle.curChoose++;
					battle.curChoose = battle.curChoose >= battle.choose.length ? battle.choose.length - 1 : battle.curChoose;
				}
			} else if (event.which === 13) {
				if (battle.chooseItem) {
					var curItem = battle.player.items[battle.itemPointer];
					if (game.player.useItem(curItem.type)) {
						battle.chooseItem = false;
						battle.state = "enermy";
						battle.anime = true;
						battle.frame = 0;
					}
				} else {
					var cho = battle.choose[battle.curChoose];
					if (cho === "attack") {
						battle.state = "player";
						battle.anime = true;
					} else if (cho === "defence") {
						battle.state = "enermy";
						battle.anime = true;
					} else if (cho === "escape") {
						if (battle.escapable) {
							battle.state = "end";
						} else {
							alert("关键战斗，怎能逃跑");
						}
					} else if (cho === "item") {
						if (game.player.items.length > 0) {
							battle.chooseItem = true;
						}
					}
					battle.frame = 0;
				}
			} else if (event.which === 37) {
				if (battle.chooseItem) {
					battle.chooseItem = false;
				}
			}
		}
	});
};

var BattlePainter = function(game) {
	var frames = {
		player: {
			enermy: [0],
			player: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
			len: 13
		},
		enermy: {
			player: [0],
		},
		end: {
			player: [0],
			enermy: [0],
			len: 3
		},
		choose: {
			player: [0],
			enermy: [0]
		}
	};
	var choseText = ["攻击", "防御", "物品", "逃跑"];
	this.paint = function() {
		if (game.battle.anime || game.battle.state === "choose") {
			var battle = game.battle;
			if (battle.frame % 6 === 0) {
				var frame = Math.floor(battle.frame / 6);
				if (battle.state === "enermy") {
					frames.enermy.enermy = battle.enermy.frames;
					frames.enermy.len = battle.enermy.frames.length;
				}
				var playerFrame = frame % frames[battle.state]["player"].length;
				var enermyFrame = frame % frames[battle.state]["enermy"].length;
				var enermyRemain = battle.enermy.hp / battle.enermy.maxHp > 0 ? battle.enermy.hp / battle.enermy.maxHp : 0;
				var playerRemain = battle.player.hp / battle.player.maxHp > 0 ? battle.player.hp / battle.player.maxHp : 0;
				var i, m;
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.fillStyle = "black";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				PainterHelper.drawPanel(400, 0, 320, 80);
				PainterHelper.drawPanel(0, 400, 320, 80);
				ctx.fillStyle = "red";
				ctx.fillRect(420, 45, 280, 20);
				ctx.fillRect(20, 445, 280, 20);
				ctx.fillStyle = "yellow";
				ctx.fillRect(420, 45, 280 * enermyRemain, 20);
				ctx.fillRect(20, 445, 280 * playerRemain, 20);
				ctx.fillStyle = "white";
				ctx.font = "bolder 20px 'Microsoft YaHei'";
				PainterHelper.drawText(battle.enermy.name, 420, 30, 280);
				PainterHelper.drawText(battle.player.name, 20, 430, 200);
				PainterHelper.drawText("等级 " + battle.player.level, 220, 430, 60);
				ctx.drawImage(Resources.images.maps[game.ground.map.type].battle_back, 0, 0, 320, 100, 0, 112, 720, 225);
				ctx.drawImage(Resources.images.maps[game.ground.map.type].battle_player_stage, 0, 0, 155, 44, 360, 380, 365, 99);
				if(battle.state === "player"){
					ctx.drawImage(Resources.images.enermies[battle.enermy.type], 0, frames[battle.state]["enermy"][enermyFrame] * 200, 320, 200, 0, 0, 720, 450);
					ctx.drawImage(Resources.images.player.battle, 0, frames[battle.state]["player"][playerFrame] * 200, 320, 200, 0, 0, 720, 450);
				} else {
					ctx.drawImage(Resources.images.player.battle, 0, frames[battle.state]["player"][playerFrame] * 200, 320, 200, 0, 0, 720, 450);
					ctx.drawImage(Resources.images.enermies[battle.enermy.type], 0, frames[battle.state]["enermy"][enermyFrame] * 200, 320, 200, 0, 0, 720, 450);
				}
				
				if (battle.state === "choose") {
					PainterHelper.drawPanel(0, 280, 100, 120);
					ctx.font = "bolder 20px 'Microsoft YaHei'";
					for (i = 0, m = battle.choose.length; i < m; i++) {
						if (i === battle.curChoose) {
							ctx.fillStyle = "yellow";
						} else {
							ctx.fillStyle = "white";
						}
						PainterHelper.drawText(choseText[i], 20, i * 25 + 310, 80);
					}
					if (battle.chooseItem) {
						if (game.player.items.length > 0) {
							var items = game.player.items;
							var start = 0;
							var end = items.length;
							PainterHelper.drawPanel(100, 250, 150, 150);
							if (items.length <= 5) {
								start = 0;
								end = items.length;
							} else if (battle.itemPointer <= 3) {
								end = 5;
							} else if (end - battle.itemPointer <= 2) {
								start = end - 5;
							} else {
								start = battle.itemPointer - 3;
								end = battle.itemPointer + 2;
							}

							for (i = start; i < end; i++) {
								if (battle.itemPointer === i) {
									ctx.fillStyle = "yellow";
								} else {
									ctx.fillStyle = "white";
								}
								PainterHelper.drawText(Items[items[i].type].name, 110, (i - start) * 25 + 280, 130);
							}
						}
					}
				}
				if (battle.state !== "choose") {
					if (frame === frames[battle.state].len - 1) {
						battle.anime = false;
						battle.frame = 0;
						return;
					}
				}
			}
			battle.frame++;
		}
	};
};
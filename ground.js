var Ground = function(player, map) {
	this.state = "idle";
	this.pos = [0, 0];
	this.posPx = [0, 0];
	this.player = player;
	this.map = map;
	this.dir = "down";
	this.frame = 0;
	this.to = [0, 0];
	this.treasure = null;
	this.setPos = function(x, y) {
		this.pos = [x, y];
		this.posPx = [x * 48, y * 48];
		this.to = [x * 48, y * 48];
	};
};

var GroundControl = function(game) {
	var posPxChange = {
		left: [-48, 0],
		up: [0, -48],
		right: [48, 0],
		down: [0, 48]
	};
	var posChange = {
		left: [-1, 0],
		up: [0, -1],
		right: [1, 0],
		down: [0, 1]
	};
	var movePerFrame = {
		left: [-2, 0],
		up: [0, -2],
		right: [2, 0],
		down: [0, 2]
	};
	var keyToDir = {
		37: "left",
		38: "up",
		39: "right",
		40: "down"
	};
	var moveHandler = function(event) {
		if (game.state === "ground" && game.ground.state === "treasure") {
			if (event.which === 13) {
				game.ground.state = "idle";
				game.ground.treasure = null;
				return;
			}
		}
		if (game.state === "ground" && game.ground.state === "idle") {
			var ground = game.ground;
			var nx;
			var ny;
			if (event.which >= 37 && event.which <= 40) {
				if (ground.posPx[0] !== ground.to[0] || ground.posPx[1] !== ground.to[1]) {} else {
					ground.dir = keyToDir[event.which];
					nx = ground.pos[0] + posChange[ground.dir][0];
					ny = ground.pos[1] + posChange[ground.dir][1];
					if (nx >= 0 && nx < ground.map.width && ny >= 0 && ny < ground.map.height && ground.map.map[ny][nx] !== 2) {
						ground.state = "walk";
						ground.to[0] = posPxChange[ground.dir][0] + ground.posPx[0];
						ground.to[1] = posPxChange[ground.dir][1] + ground.posPx[1];
						ground.pos[0] += posChange[ground.dir][0];
						ground.pos[1] += posChange[ground.dir][1];
					}
				}
			} else if (event.which === 13) {
				var npcs = game.ground.map.npcs;
				var curNpc;
				for (var i = npcs.length; i--;) {
					if (ground.pos[0] + posChange[ground.dir][0] === npcs[i].pos[0] && ground.pos[1] + posChange[ground.dir][1] === npcs[i].pos[1]) {
						curNpc = npcs[i];
						switch (game.ground.dir) {
							case "left":
								curNpc.dir = "right";
								break;
							case "right":
								curNpc.dir = "left";
								break;
							case "up":
								curNpc.dir = "down";
								break;
							case "down":
								curNpc.dir = "up";
								break;
						}
						break;
					}
				}
				if (curNpc && typeof curNpc.dialog !== "undefined") {
					game.dialog = new Dialog(curNpc);
					game.state = "dialog";
				}
			}
		}
	};
	var swichToInfo = function(event) {
		if (game.state === "ground" && game.ground.state === "idle") {
			if (event.which === 219) {
				game.state = "info";
			}
		}
	};
	var atEndArea = function() {
		var ground = game.ground;
		var doors = ground.map.doors;
		for (var i = doors.length; i--;) {
			for (var j = doors[i].area.length; j--;) {
				if (doors[i].area[j][0] === ground.pos[0] && doors[i].area[j][1] === ground.pos[1]) {
					return doors[i];
				}
			}
		}
		return null;
	};
	var atTreasure = function() {
		var ground = game.ground;
		var treasures = ground.map.treasures;

		for (var i = treasures.length; i--;) {
			if (treasures[i].pos[0] === ground.pos[0] && treasures[i].pos[1] === ground.pos[1]) {
				return treasures[i];
			}
		}
		return null;
	};
	var move = function() {
		var ground = game.ground;

		if (ground.state === "walk") {
			if (ground.posPx[0] === ground.to[0] && ground.posPx[1] === ground.to[1]) {
				return true;
			}
			ground.posPx[0] += movePerFrame[ground.dir][0];
			ground.posPx[1] += movePerFrame[ground.dir][1];
			return false;
		}
		return false;
	};
	this.tick = function() {
		var curDoor;
		var curTreasure;
		if (move()) {
			if (game.story.canToNext(game)) {
				game.story.toNext(game);
				game.state = "story";
				return;
			}
			curDoor = atEndArea();
			if (curDoor) {
				game.ground = new Ground(game.player, Maps[curDoor.to]);
				game.ground.setPos(curDoor.desPos[0], curDoor.desPos[1]);
				game.ground.state = "idle";
				return;
			}
			curTreasure = atTreasure();
			if (curTreasure && !curTreasure.opened) {
				if (curTreasure.item === "money") {
					game.player.money += curTreasure.amount;
				} else {
					game.player.getItem(curTreasure.item, curTreasure.amount);
				}
				game.ground.treasure = curTreasure;
				game.ground.state = "treasure";
				curTreasure.opened = true;
				return;
			}
			game.ground.state = "idle";
			if (Math.random() < game.ground.map.radio) {
				game.battle = new Battle(game.player, new Enermy(game.ground.map.enermies[Math.floor(Math.random() * 500) % game.ground.map.enermies.length]));
				game.state = "battle";
				return;
			}
		}

	};
	$env.bind("keydown", moveHandler);
	$env.bind("keydown", swichToInfo);
};


var GroundPainter = function(game) {
	var playerFrames = {
		idle: {
			up: [7],
			down: [1],
			left: [4],
			right: [10]
		},
		walk: {
			up: [7, 6, 7, 8],
			down: [1, 0, 1, 2],
			left: [4, 3, 4, 5],
			right: [10, 9, 10, 11]
		}
	};
	var npcFrames = {
		down: 0,
		left: 1,
		up: 2,
		right: 3
	};
	var calPos = function(x, y, bx, by) {
		var ground = game.ground;
		var px = 48 * x - bx;
		var py = 48 * y - by;
		var show = false;
		if (px >= 0 && px <= canvas.width - 48 && py >= 0 && py <= canvas.height) {
			show = true;
		}
		return {
			x: px,
			y: py,
			show: show
		};
	};
	this.paint = function() {
		if (game.ground.frame % 1 === 0) {
			if (game.ground.state === "treasure") {
				PainterHelper.drawPanel(0, 330, 720, 150);
				PainterHelper.drawStaticAvatar(7, 337, 136, 136, true);
				ctx.font = "italic bolder 20px 'Microsoft YaHei'";
				ctx.fillStyle = "#f0f0f0";
				if (game.ground.treasure.item === "money") {
					PainterHelper.drawText("获得金币：" + game.ground.treasure.amount, 160, 370, 530);
				} else {
					PainterHelper.drawText("获得物品：" + Items[game.ground.treasure.item].name + " " + game.ground.treasure.amount + "个", 160, 370, 530);
				}
				return;
			}
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			var ground = game.ground;
			var playerFrame = (Math.floor(ground.frame / 6)) % (playerFrames[ground.state][ground.dir].length);
			var px;
			var py;
			var bx;
			var by;
			var i;
			var curNpc;
			var treasure;
			var pos;
			if (ground.posPx[0] < canvas.width / 2) {
				px = ground.posPx[0];
				bx = 0;
			} else if (ground.posPx[0] > ground.map.width * 48 - canvas.width / 2) {
				px = ground.posPx[0] - ground.map.width * 48 + canvas.width;
				bx = ground.map.width * 48 - canvas.width;
			} else {
				px = canvas.width / 2;
				bx = ground.posPx[0] - canvas.width / 2;
			}
			if (ground.posPx[1] < canvas.height / 2) {
				py = ground.posPx[1];
				by = 0;
			} else if (ground.posPx[1] > ground.map.height * 48 - canvas.height / 2) {
				py = ground.posPx[1] - ground.map.height * 48 + canvas.height;
				by = ground.map.height * 48 - canvas.height;
			} else {
				py = canvas.height / 2;
				by = ground.posPx[1] - canvas.height / 2;
			}
			ctx.drawImage(Resources.images.maps[game.ground.map.rc_index].map, bx, by, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

			for (i = ground.map.treasures.length; i--;) {
				treasure = ground.map.treasures[i];
				pos = calPos(treasure.pos[0], treasure.pos[1], bx, by);
				if (treasure.opened) {
					ctx.drawImage(Resources.images.other.treasure, 0, 24, 24, 24, pos.x, pos.y, 48, 48);
				} else {
					ctx.drawImage(Resources.images.other.treasure, 0, 0, 24, 24, pos.x, pos.y, 48, 48);
				}
			}

			ctx.drawImage(Resources.images.player.ground, 0, playerFrames[ground.state][ground.dir][playerFrame] * 24, 24, 24, px, py, 48, 48);
			for (i = ground.map.npcs.length; i--;) {
				curNpc = ground.map.npcs[i];
				pos = calPos(curNpc.pos[0], curNpc.pos[1], bx, by);
				ctx.drawImage(Resources.images.other.npcs, 0, 96 * curNpc.detail.rc_index + 24 * npcFrames[curNpc.dir], 24, 24, pos.x, pos.y, 48, 48);
			}
		}
		game.ground.frame++;
	};

};
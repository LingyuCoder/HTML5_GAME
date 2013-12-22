var Info = function() {
	this.frame = 0;
	this.itemPointer = 0;
};

var InfoControl = function(game) {
	this.tick = function() {
		game.info.frame++;
	};

	$env.bind("keydown", function(event) {
		if (game.state === "info") {
			var info = game.info;
			if (event.which === 221 || event.which === 27) {
				game.state = "ground";
				return;
			} else if (game.player.items.length > 0) {
				if (event.which === 37) {
					info.itemPointer -= 1;
				} else if (event.which === 38) {
					info.itemPointer -= 3;
				} else if (event.which === 39) {
					info.itemPointer += 1;
				} else if (event.which === 40) {
					info.itemPointer += 3;
				} else if (event.which === 13) {
					var curItem = game.player.items[info.itemPointer];
					game.player.useItem(curItem.type);
				}
				info.itemPointer = info.itemPointer < 0 ? 0 : info.itemPointer;
				info.itemPointer = info.itemPointer >= game.player.items.length ? game.player.items.length - 1 : info.itemPointer;
			}
		}
	});
};

var InfoPainter = function(game) {
	var avatarFrames = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0];
	var drawAvatar = function(x, y, width, height) {
		var cur = (game.info.frame / 6) % avatarFrames.length;
		ctx.drawImage(Resources.images.player.avatar, 0, 80 * avatarFrames[cur], 80, 80, x, y, width, height); //avatar
	};
	this.paint = function() {
		if (game.info.frame % 6 === 0) {
			var player = game.player;
			var info = game.info;
			var i, m, k;
			var desc;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			PainterHelper.drawPanel(0, 0, 160, 160);
			PainterHelper.drawPanel(160, 0, 560, 160);
			PainterHelper.drawPanel(0, 160, 720, 220);
			PainterHelper.drawPanel(0, 380, 720, 100);
			drawAvatar(2, 2, 156, 156);
			ctx.font = "italic bolder 30px 'Microsoft YaHei'";
			ctx.fillStyle = "#f0f0f0";
			PainterHelper.drawText("姓名：" + player.name, 190, 50, 250);
			PainterHelper.drawText("等级：" + player.level, 450, 50, 250);
			PainterHelper.drawText("ATK：" + player.atk, 190, 90, 250);
			PainterHelper.drawText("EXP：" + player.exp + "/" + player.needExp, 450, 90, 250);
			PainterHelper.drawText("HP：" + player.hp + "/" + player.maxHp, 190, 130, 250);
			PainterHelper.drawText("金币：" + player.money, 450, 130, 250);
			ctx.font = "bolder 25px 'Microsoft YaHei'";
			if (player.items.length > 0) {
				var start;
				var end;
				var cur;

				start = 0;
				end = Math.ceil(player.items.length / 3);
				cur = Math.ceil(info.itemPointer / 3) - 1;

				if (end - start > 5) {
					if (end - cur <= 2) {
						start = end - 5;
					} else if (cur - start <= 3) {
						start = 0;
						end = start + 5;
					} else {
						start = cur - 3;
						end = cur + 2;
					}
				}

				for (i = start * 3, m = player.items.length, k = end * 3; i < m && i < k; i++) {
					if (i === info.itemPointer) {
						ctx.fillStyle = "yellow";
					} else {
						ctx.fillStyle = "#f0f0f0";
					}
					PainterHelper.drawText(Items[player.items[i].type].name + " x" + player.items[i].amount, (i % 3) * 220 + 30, Math.floor(i / 3 - start) * 40 + 200, 220);
				}
				ctx.font = "bolder 20px 'Microsoft YaHei'";
				ctx.fillStyle = "#f0f0f0";
				desc = Items[player.items[info.itemPointer].type].desc;
				for (i = 0, m = desc.length; i < m; i++) {
					PainterHelper.drawText(desc[i], 10, 410 + i * 25, 700);
				}
			}
		}
	};
};
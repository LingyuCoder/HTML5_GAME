var Trade = function(npc) {
	this.items = npc.items;
	this.itemPt = 0;
	this.state = "anime";
	this.buy = true;
	this.npc = npc;
	this.sellPt = 0;
};

var TradeControl = function(game) {
	var buy = function(pt) {
		var item = Items[game.trade.items[pt]];
		var playerItems = game.player.items;
		var i;
		if (game.player.money >= item.buy) {
			game.player.money -= item.buy;
			game.player.getItem(game.trade.items[pt]);
			game.trade.state = "anime";
		} else {
			alert("金币不足");
		}
	};
	var sell = function(pt) {
		if (game.player.items.length > 0) {
			var item = Items[game.player.items[pt].type];
			game.player.money += item.buy / 2;
			game.player.items[pt].amount--;
			if (game.player.items[pt].amount === 0) {
				game.player.items.splice(pt, 1);
				game.trade.sellPt = 0;
			}
			game.trade.state = "anime";
		}
	};
	this.tick = function() {};
	$env.bind("keydown", function(event) {
		if (game.state === "trade" && game.trade.state === "idle") {
			var trade = game.trade;
			var key = event.which;
			if (key === 38) {
				if (trade.buy) {
					trade.itemPt -= 2;
					trade.state = "anime";
				} else {
					trade.sellPt -= 2;
					trade.state = "anime";
				}

			} else if (key === 40) {
				if (trade.buy) {
					trade.itemPt += 2;
					trade.state = "anime";
				} else {
					trade.sellPt += 2;
					trade.state = "anime";
				}
			} else if (key === 37) {
				if (trade.buy) {
					trade.itemPt--;
					trade.state = "anime";
				} else {
					trade.sellPt--;
					trade.state = "anime";
				}
			} else if (key === 39) {
				if (trade.buy) {
					trade.itemPt++;
					trade.state = "anime";
				} else {
					trade.sellPt++;
					trade.state = "anime";
				}
			} else if (key === 13) {
				if (trade.buy) {
					buy(trade.itemPt);
				} else {
					sell(trade.sellPt);
				}
			} else if (key === 27) {
				game.state = "ground";
				game.trade = null;
				if (game.story.canToNext(game)) {
					game.story.toNext(game);
					game.state = "story";
					return;
				}
			} else if (key === 188) {
				trade.buy = true;
				trade.state = "anime";
			} else if (key === 190) {
				trade.buy = false;
				trade.state = "anime";
			}
			if (trade.buy) {
				trade.itemPt = trade.itemPt < 0 ? 0 : trade.itemPt;
				trade.itemPt = trade.itemPt >= trade.items.length ? trade.items.length - 1 : trade.itemPt;
			} else {
				trade.sellPt = trade.sellPt < 0 ? 0 : trade.sellPt;
				trade.sellPt = trade.sellPt >= game.player.items.length ? game.player.items.length - 1: trade.sellPt;
			}
		}
	});
};

var TradePainter = function(game) {
	var getAmount = function(item) {
		var items = game.player.items;
		for (var i = items.length; i--;) {
			if (items[i].type === item) {
				return items[i].amount;
			}
		}
		return 0;
	};
	this.paint = function() {
		if (game.state === "trade") {
			var trade = game.trade;
			var start;
			var end;
			var cur;
			var i, m, k;
			var items;
			var pt;
			var index;
			var desc;
			if (trade.state === "anime") {
				//绘制面板
				PainterHelper.drawPanel(0, 0, 150, 150);
				PainterHelper.drawPanel(0, 150, 150, 200);
				PainterHelper.drawPanel(150, 0, 570, 350);
				PainterHelper.drawPanel(0, 350, 720, 130);
				//绘制头像
				PainterHelper.drawNpcAvatar(trade.npc.detail.rc_index, 7, 7, 136, 136);
				//定义字体,默认为白色
				ctx.font = "bold 20px 'Microsoft YaHei'";
				ctx.fillStyle = "#f0f0f0";
				//主选栏,选择操作类型
				if (trade.buy) {
					ctx.fillStyle = "yellow";
					PainterHelper.drawText("购买", 10, 190, 130);
					ctx.fillStyle = "#f0f0f0";
					PainterHelper.drawText("出售", 10, 220, 130);
				} else {
					ctx.fillStyle = "#f0f0f0";
					PainterHelper.drawText("购买", 10, 190, 130);
					ctx.fillStyle = "yellow";
					PainterHelper.drawText("出售", 10, 220, 130);
				}
				ctx.fillStyle = "#f0f0f0";
				PainterHelper.drawText("'<'和'>'切换", 10, 270, 130);
				PainterHelper.drawText("ESC退出", 10, 300, 130);
				PainterHelper.drawText("金币：" + game.player.money, 10, 330, 130);

				//物品选择栏
				ctx.font = "italic bold 35px 'Microsoft YaHei'";
				PainterHelper.drawText(trade.buy ? "购买" : "出售", 170, 40, 130);
				ctx.font = "bold 20px 'Microsoft YaHei'";

				if (trade.buy) {
					items = trade.items;
					pt = trade.itemPt;
				} else {
					items = game.player.items;
					pt = trade.sellPt;
				}
				start = 0;
				end = Math.ceil(items.length / 2);
				cur = Math.ceil(pt / 2) - 1;
				if (end - start > 10) {
					if (end - cur <= 5) {
						start = end - 10;
					} else if (cur - start <= 5) {
						end = start + 10;
					} else {
						start = cur - 5;
						end = cur + 5;
					}
				}

				for (i = start * 2, m = items.length, k = end * 2; i < m && i < k; i++) {
					if (i === pt) {
						ctx.fillStyle = "yellow";
					} else {
						ctx.fillStyle = "#f0f0f0";
					}
					ctx.textAlign = "left";
					if (trade.buy) {
						PainterHelper.drawText(Items[items[i]].name, (i % 2) * 285 + 170, 70 + 25 * Math.floor(i / 2 - start), 150);
						ctx.textAlign = "end";
						PainterHelper.drawText(Items[items[i]].buy + "/" + getAmount(items[i]), (i % 2) * 285 + 415, 70 + 25 * Math.floor(i / 2 - start), 95);
					} else if (game.player.items.length > 0) {
						PainterHelper.drawText(Items[items[i].type].name, (i % 2) * 285 + 170, 70 + 25 * Math.floor(i / 2 - start), 150);
						ctx.textAlign = "end";
						PainterHelper.drawText(Items[items[i].type].buy / 2 + "/" + items[i].amount, (i % 2) * 285 + 415, 70 + 25 * Math.floor(i / 2 - start), 95);
					}

				}
				ctx.textAlign = "left";
				ctx.fillStyle = "#f0f0f0";
				if (trade.buy) {
					console.log(items[pt], pt);
					desc = Items[items[pt]].desc;
				} else if (game.player.items.length > 0) {
					desc = Items[items[pt].type].desc;
				} else {
					desc = [];
				}
				for (i = 0, m = desc.length; i < m; i++) {
					PainterHelper.drawText(desc[i], 20, 380 + i * 25, 680);
				}
				trade.state = "idle";
			}
		}
	};
};
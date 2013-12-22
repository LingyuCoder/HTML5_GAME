var Resources = (function() {
	var ready = 0;
	var __recReady = function() {
		ready++;
	};
	var res_count = 0;
	var __loadRecs = function(res) {
		var tmp;
		for (var item in res) {
			if (res.hasOwnProperty(item)) {
				if (typeof res[item] === "string") {
					res_count++;
					tmp = res[item];
					res[item] = new Image();
					res[item].src = tmp;
					res[item].onload = __recReady;
				} else if (res[item].toString() === "[Object Array]") {
					for (var i = res[item].length; i--;) {
						__loadRecs(res[item][i]);
					}
				} else if (typeof res[item] === "object") {
					__loadRecs(res[item]);
				}
			}
		}
	};
	var srcs = {
		maps: {
			cave: {
				map: "maps/cave.png",
				battle_back: "maps/cave_back.png",
				battle_player_stage: "maps/cave_pla_stage.png"
			},
			garden: {
				map: "maps/garden.png",
				battle_back: "maps/garden_back.png",
				battle_player_stage: "maps/garden_pla_stage.png"
			},
			start: {
				map: "maps/start.png",
				battle_back: "maps/start_back.png",
				battle_player_stage: "maps/start_pla_stage.png"
			}
		},
		player: {
			ground: "player/ground.png",
			battle: "player/soul_battle.png",
			avatar: "player/avatar.png"
		},
		enermies: ["enermies/dragon.png", "enermies/chaofan.png", "enermies/chujin.png", "enermies/yaochang.png", "enermies/zhuzhenyu.png", "enermies/daleige.png", "enermies/yizong.png", "enermies/wanglingyu.png"],
		other: {
			panel: "other/panel.png",
			npcs: "other/npcs.png",
			npcavatar: "other/npcavatars.png",
			treasure: "other/treasure.png"
		}
	};
	__loadRecs(srcs);
	return {
		images: srcs,
		isReady: function() {
			return ready === res_count;
		}
	};
}());

var Skills = (function() {
	return {};
}());

var Npcs = (function() {
	return {
		"vill_m": {
			rc_index: 2,
			name: "男村民",
			type: "vill_m",
		},
		"vill_w": {
			rc_index: 1,
			name: "女村民",
			type: "vill_w",
		},
		"master": {
			rc_index: 0,
			name: "储大师",
			type: "master",
		}
	};
}());

var DialogTexts = (function() {
	return [
		[{
			player: false,
			text: ["小本经营，童叟无欺"]
		}], [{
			player: false,
			text: ["你越来越强了，师傅都打不过啦"]
		}], [{
			player: false,
			text: ["你这武艺，师傅已经快打不过了，哈哈"]
		}, {
			player: true,
			text: ["多谢师傅指导"]
		}, {
			player: false,
			text: ["去南边把那俩箱子里的东西拿回来吧", "准备一下今天最后的实战练习"]
		}], [{
			player: false,
			text: ["对对对，就是那俩箱子，把里面东西拿过来吧"]
		}], [{
			player: false,
			text: ["去找北边那个奸商买两份药草吧"]
		}], [{
			player: false,
			text: ["这么快就买好了？", "来进行今天最后一次实战练习吧，和我的小伙伴打一场吧"]
		}, {
			player: true,
			text: ["我去，师傅你的小伙伴好凶残！"]
		}], [{
			player: false,
			text: ["漂亮！", "好了今天就到这了", "明天为师要进城了，你也和我一起来吧"]
		}, {
			player: true,
			text: ["好的"]
		}],
	];
}());

var Enermies = (function() {
	return [{
		name: "炎龙",
		hp: 60,
		atk: 10,
		skills: [],
		exp: 30,
		money: 100,
		frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
	}, {
		name: "炒饭",
		hp: 250,
		atk: 120,
		skills: [],
		exp: 1,
		money: 1,
		frames: [0, 1, 2, 3, 4, 5]
	}, {
		name: "储壕牛",
		hp: 450,
		atk: 220,
		skills: [],
		exp: 1,
		money: 1,
		frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
	}, {
		name: "昌富帅",
		hp: 650,
		atk: 320,
		skills: [],
		exp: 1,
		money: 1,
		frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
	}, {
		name: "老祝",
		hp: 650,
		atk: 320,
		skills: [],
		exp: 1,
		money: 1,
		frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
	}, {
		name: "大磊哥",
		hp: 850,
		atk: 420,
		skills: [],
		exp: 1,
		money: 1,
		frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
	}, {
		name: "易总",
		hp: 1050,
		atk: 520,
		skills: [],
		exp: 1,
		money: 1,
		frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	}];
}());

var Items = (function() {
	return [{
		type: "hp",
		name: "药草",
		value: 50,
		desc: ["野生的药草", "使用恢复50hp"],
		buy: 100
	}, {
		type: "hp",
		name: "药水(小)",
		value: 100,
		desc: ["小瓶治疗药水", "使用恢复100hp"],
		buy: 200
	}, {
		type: "hp",
		name: "药水(中)",
		value: 200,
		desc: ["中瓶治疗药水", "使用恢复200hp"],
		buy: 400
	}, {
		type: "hp",
		name: "药水(大)",
		value: 400,
		desc: ["大瓶治疗药水", "使用恢复400hp"],
		buy: 800
	}, {
		type: "hp",
		name: "药水(超大)",
		value: 100000000,
		desc: ["巨大瓶装的治疗药水", "使用恢复所有HP"],
		buy: 2000
	}, {
		type: "exp",
		name: "经验石(小)",
		value: 20,
		desc: ["蕴含能量的石头", "使用后增加经验100"],
		buy: 100
	}];
}());

var PainterHelper = (function() {
	return {
		drawPanel: function(x, y, width, height) {
			var left = x;
			var right = x + width;
			var top = y;
			var bottom = y + height;
			var image = Resources.images.other.panel;
			ctx.drawImage(image, 0, 0, 11, 11, left, top, 22, 22); //top-left
			ctx.drawImage(image, 51, 0, 11, 11, right - 22, top, 22, 22); //top-right
			ctx.drawImage(image, 0, 15, 11, 11, left, bottom - 22, 22, 22); //bottom-left
			ctx.drawImage(image, 51, 15, 11, 11, right - 22, bottom - 22, 22, 22); //bottom-right

			ctx.drawImage(image, 11, 0, 40, 11, left + 22, top, width - 44, 22); //up
			ctx.drawImage(image, 11, 15, 40, 11, left + 22, bottom - 22, width - 44, 22); //down
			ctx.drawImage(image, 0, 11, 11, 4, left, top + 22, 22, height - 44); //left
			ctx.drawImage(image, 51, 11, 11, 4, right - 22, top + 22, 22, height - 44); //right

			ctx.drawImage(image, 11, 11, 40, 4, left + 22, top + 22, width - 44, height - 44); //center
		},
		drawText: function(str, x, y, maxWidth) {
			ctx.fillText(str, x, y, maxWidth);
		},
		drawStaticAvatar: function(x, y, width, height, flipped) {
			if (flipped) {
				ctx.save();
				ctx.scale(-1, 1);
				x *= -1;
			}
			ctx.drawImage(Resources.images.player.avatar, 0, 0, 80, 80, x - width, y, width, height); //avatar
			if (flipped) {
				ctx.restore();
			}
		},
		drawNpcAvatar: function(rc_index, x, y, width, height, flipped) {
			if (flipped) {
				ctx.save();
				ctx.scale(-1, 1);
				x *= -1;
			}
			ctx.drawImage(Resources.images.other.npcavatar, 0, 80 * rc_index, 80, 80, x, y, width, height); //npcavatar
			if (flipped) {
				ctx.restore();
			}
		}
	};
}());
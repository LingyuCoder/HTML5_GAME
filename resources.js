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
			},
			town_rural : {
				map: "maps/town_rural.png",
				battle_back: "maps/start_back.png",
				battle_player_stage: "maps/start_pla_stage.png"
			}
		},
		player: {
			ground: "player/ground.png",
			battle: "player/battle.png",
			avatar: "player/avatar.png",
			magic: "player/magic.png"
		},
		enermies: ["enermies/dragon.png", "enermies/chaofan.png", "enermies/chujin.png", "enermies/yaochang.png", "enermies/zhuzhenyu.png", "enermies/daleige.png", "enermies/yizong.png", "enermies/wanglingyu.png"],
		other: {
			panel: "other/panel.png",
			npcs: "other/npcs.png",
			npcavatar: "other/npcavatars.png",
			treasure: "other/treasure.png",
			win : "other/win.png",
			lose : "other/lose.png"
		},
		magics: ["magics/red_thun.png", "magics/blue_thun.png"]
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
			name: "黃師傅",
			type: "master",
		},
		"robber": {
			rc_index: 3,
			name: "天镶强盗团",
			type: "robber",
		}
	};
}());

var DialogTexts = (function() {
	return [
		//0-4
		[{player: false, text: ["小本經營，童叟無欺"] }],
		[{player: false, text: ["你越來越强了，師傅都打不過啦，哈哈"] }],
		[{player: false, text: ["你越來越强了，師傅都打不過啦，哈哈"] }, {player: true, text: ["多谢师傅指导"] }, {player: false, text: ["去南邊把那倆箱子里的東西拿過來吧", "準備一下今天的實戰練習"] }],
		[{player: false, text: ["對對，就是那倆箱子"] }],
		[{player: false, text: ["去北邊找奸商買倆藥草吧"] }],
		//5-9
		[{player: false, text: ["買好了？", "來，和我的小夥伴進行今天最後的實戰練習"] }, {player: true, text: ["我去，師傅你的小夥伴略兇殘啊"] }],
		[{player: false, text: ["表現不錯！", "好了，今天就到這吧", "明天師傅要進城買點東西，你也一起來吧"] }, {player: true, text: ["好的，師傅！"] }],
		[{player: false, text: ["嗯？怎么镇上都看不到人？上次来的时候还挺热闹的"] }, {player: true, text: ["人不都在北边吗？"] }, {player: false, text: ["走，过去看看发生了什么"] }],
	];
}());

var Enermies = (function() {
	return [
		//0-4
		{name: "炎龙", hp: 41,mp : 40, atk: 10, magics: [0, 1], exp: 30, money: 100, frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], magicFrames : [0, 1, 2 ,3, 4, 5]},
		{name: "炒饭", hp: 250,mp : 100, atk: 120, magics: [], exp: 1, money: 1, frames: [0, 1, 2, 3, 4, 5] },
		{name: "储壕牛", hp: 450,mp : 200, atk: 220, magics: [], exp: 1, money: 1, frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] },
		{name: "昌富帅", hp: 650,mp : 300, atk: 320, magics: [], exp: 1, money: 1, frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26] },
		{name: "老祝", hp: 650,mp : 400, atk: 320, magics: [], exp: 1, money: 1, frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21] },
		//5-9
		{name: "大磊哥", hp: 850,mp : 500, atk: 420, magics: [], exp: 1, money: 1, frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
		{name: "易总", hp: 1050,mp : 600, atk: 520, magics: [], exp: 1, money: 1, frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
	];
}());

var Items = (function() {
	return [
		//0-4
		{type: "hp", name: "药草", value: 50, desc: ["野生的药草", "使用恢复50hp"], buy: 100 },
		{type: "hp", name: "药水(小)", value: 100, desc: ["小瓶治疗药水", "使用恢复100hp"], buy: 200 },
		{type: "hp", name: "药水(中)", value: 200, desc: ["中瓶治疗药水", "使用恢复200hp"], buy: 400 },
		{type: "hp", name: "药水(大)", value: 400, desc: ["大瓶治疗药水", "使用恢复400hp"], buy: 800 },
		{type: "hp", name: "大地精华", value: 100000000, desc: ["蕴含大地之力的晶体", "使用恢复所有HP"], buy: 2000 },
		//5-9
		{type: "exp", name: "经验石(小)", value: 20, desc: ["蕴含能量的石头", "使用后增加经验20"], buy: 100},
		{type: "exp", name: "经验石(中)", value: 50, desc: ["蕴含能量的石头", "使用后增加经验50"], buy: 400},
		{type: "exp", name: "经验石(大)", value: 100, desc: ["蕴含能量的石头", "使用后增加经验100"], buy: 800 },
		{type: "mp", name: "魔石", value: 50, desc: ["小顆的魔石", "使用恢复50MP"], buy: 200 },
		{type: "mp", name: "魔晶(小)", value: 100, desc: ["小块的魔法水晶", "使用恢复100MP"], buy: 400},
		//10-14
		{type: "mp", name: "魔晶(中)", value: 200, desc: ["散发着强大能量的魔法水晶", "使用恢复200MP"], buy: 800 },
		{type: "mp", name: "魔晶(大)", value: 400, desc: ["散发着巨大能量的魔法水晶", "使用恢复400MP"], buy: 1600 },
		{type: "mp", name: "夜空精华", value: 100000000, desc: ["蕴含天空之力的晶体", "使用恢复所有MP"], buy: 4000 },
		{type: "hpmp", name: "治疗法球", value : 50, desc: ["战士常用的治疗用品", "使用恢复50HP和50MP"], buy: 400},
		{type: "hpmp", name: "龙之泪(小)", value : 100, desc: ["传说为深山中龙的眼泪", "使用恢复100HP和100MP"], buy: 800},
		//15-19
		{type: "hpmp", name: "龙之泪(中)", value : 200, desc: ["传说为深山中龙的眼泪", "使用恢复200HP和200MP"], buy: 1600},
		{type: "hpmp", name: "龙之泪(大)", value : 400, desc: ["传说为深山中龙的眼泪", "使用恢复400HP和400MP"], buy: 3200},
		{type: "hpmp", name: "龙之祝福", value : 100000000, desc: ["蕴含神龙祝福的石头", "使用恢复所有HP和MP"], buy: 3200},
		{type: "equip", pos: "arm", name: "短剑", atk: 10, desc: ["普通的佩剑，没什么特别的", "装备后加10ATK"], buy: 100},
		{type: "equip", pos: "body", name: "布衣", hp: 20, desc: ["亚麻制成的衣服，有韧性", "装备后加20HP"], buy: 100},
		//20-24
		{type: "equip", pos: "arm", name: "长剑", atk: 20, desc: ["王国剑士配置的标准长剑", "装备后加20ATK"], buy: 200},
		{type: "equip", pos: "body", name: "剑士战甲", hp: 40, desc: ["王国剑士配置的铠甲", "装备后加40HP"], buy: 400},
	];
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

var Animes = (function() {
	return [
	{type: "desc", texts: ["序章", "黃師傅，一個受人尊敬的武者", "年轻时曾游历世界进行冒险", "武艺赫赫有名", "如今他已经老了", "而他的徒弟--沛哥", "正要展开新的人生"] },
	{type: "desc", texts: ["第二天..."] },
	];
}());

var Magics = (function(){
	return [{
		name: "赤焰术",
		rc_index : 0,
		type: "atk",
		rc_width: 56,
		rc_height : 150,
		anime: [{
			frames : [0, 1, 2, 3, 4, 5],
			left: 0,
			top: 0,
			start: 0
		}, {
			frames : [0, 1, 2, 3, 4, 5],
			left: 100,
			top: 0,
			start: 6
		}, {
			frames : [0, 1, 2, 3, 4, 5],
			left: 200,
			top: 0,
			start: 3
		}],
		anime_length: 12,
		mp : 10,
		value : 40
	},{
		name: "苍焰术",
		rc_index : 1,
		type: "hp",
		rc_width: 56,
		rc_height : 150,
		anime: [{
			frames : [0, 1, 2, 3, 4, 5],
			left: 0,
			top: 0,
			start: 0
		}, {
			frames : [0, 1, 2, 3, 4, 5],
			left: 100,
			top: 0,
			start: 6
		}, {
			frames : [0, 1, 2, 3, 4, 5],
			left: 200,
			top: 0,
			start: 3
		}],
		anime_length: 12,
		mp : 10,
		value : 400
	}];
}());
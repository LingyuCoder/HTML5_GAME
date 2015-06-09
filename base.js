var Player = function() {
	this.name = "沛哥";
	this.maxHp = 100;
	this.hp = 100;
	this.maxMp = 100;
	this.mp = 100;
	this.crit = 0.1;
	this.atk = 20;
	this.magics = [0, 1];
	this.exp = 0;
	this.needExp = 30;
	this.level = 1;
	this.money = 0;
	this.items = [
		{type: 18, amount: 1 },
		{type: 19, amount: 1 },
		{type: 20, amount: 1 },
		{type: 21, amount: 1 }
	];
	this.equip = {
		arm: -1,
		body: -1,
		neck : -1,
		ring : -1
	};
};

Player.prototype.levelUp = function() {
	var raise = {
		hp: 20,
		mp: 10,
		atk: 10,
	};
	this.maxHp += Math.floor((Math.random() - 0.5) * 5 + raise.hp);
	this.atk += Math.floor((Math.random() - 0.5) * 5 + raise.atk);
	this.maxMp += Math.floor((Math.random() - 0.5) * 5 + raise.mp);
	this.level++;
	this.needExp = Math.floor(1.2 * this.needExp);
	this.hp = this.maxHp;
	console.log("升级啦");
	console.log("攻击:", this.atk);
	console.log("血上限:", this.maxHp);
	if (this.exp >= this.needExp) {
		this.levelUp();
	}
};

Player.prototype.getItem = function(type, amount) {
	amount = amount || 1;
	var playerItems = this.items;
	for (i = playerItems.length; i--;) {
		if (playerItems[i].type === type) {
			playerItems[i].amount += amount;
			return true;
		}
	}
	playerItems[playerItems.length] = {
		type: type,
		amount: amount
	};
	return false;
};

Player.prototype.hasItem = function(type, amount) {
	amount = amount || 0;
	for (i = this.items.length; i--;) {
		if (this.items[i].type === type) {
			if (this.items[i].amount >= amount) {
				return true;
			}
		}
	}
	return false;
};

Player.prototype.loseItem = function(type, amount) {
	amount = amount || 1;
	for (var i = this.items.length; i--;) {
		if (this.items[i].type === type) {
			this.items[i].amount -= amount;
			if (this.items[i].amount === 0) {
				this.items.splice(i, 1);
			}
			return true;
		}
	}
	return false;
};

Player.prototype.useItem = function(type) {
	var item = Items[type];
	var success = false;
	if (item.type === "hp") {
		if (this.hp < this.maxHp) {
			this.hp += item.value;
			this.hp = this.hp > this.maxHp ? this.maxHp : this.hp;
			success = true;
		} else {
			success = false;
		}
	} else if (item.type === "mp") {
		if (this.mp < this.maxMp) {
			this.mp += item.value;
			this.mp = this.mp > this.maxMp ? this.maxMp : this.mp;
			success = true;
		} else {
			success = false;
		}
	} else if (item.type === "exp") {
		this.exp += item.value;
		if (this.exp >= this.needExp) {
			this.levelUp();
		}
		success = true;
	} else if (item.type === "equip") {
		this.__equip(type);
		success = true;
	} else if (item.type === "hpmp") {
		if (this.mp < this.maxMp || this.hp < this.maxHp) {
			this.mp += item.value;
			this.mp = this.mp > this.maxMp ? this.maxMp : this.mp;
			this.hp += item.value;
			this.hp = this.hp > this.maxHp ? this.maxHp : this.hp;
			success = true;
		} else {
			success = false;
		}
	} else {
		return false;
	}
	if (success) {
		this.loseItem(type);
		return true;
	}
	return false;
};

Player.prototype.__equip = function(type) {
	var old;
	var item = Items[type];
	if (this.equip[item.pos] !== -1) {
		old = Items[this.equip[item.pos]];
		if (old.hp) this.maxHp -= old.hp;
		if (old.mp) this.maxMp -= old.mp;
		if (old.atk) this.atk -= old.atk;
		if (old.crit) this.crit -= old.crit;
		this.getItem(this.equip[item.pos]);
	}
	this.equip[item.pos] = type;
	if (item.hp) this.maxHp += item.hp;
	if (item.mp) this.maxMp += item.mp;
	if (item.atk) this.atk += item.atk;
	if (item.crit) this.crit += item.crit;
};

var Enermy = function(type) {
	var ene = Enermies[type];
	this.name = ene.name;
	this.maxHp = ene.hp;
	this.maxMp = ene.mp;
	this.hp = this.maxHp;
	this.mp = this.maxMp;
	this.atk = ene.atk;
	this.type = type;
	this.exp = ene.exp;
	this.money = ene.money;
	this.frames = ene.frames;
	this.magics = ene.magics;
	this.magicFrames = ene.magicFrames;
};

Enermy.prototype.AI = function() {
	var i;
	var cho;
	var max;
	var curMagic;
	if (this.hp >= this.maxHp * 0.3) {
		cho = 9999;
		max = this.atk;
		for (i = this.magics.length; i--;) {
			curMagic = Magics[this.magics[i]];
			console.log(curMagic.value);
			if (curMagic.type === "atk" && this.mp >= curMagic.mp && curMagic.value > max) {
				cho = i;
				max = curMagic.value;
			}
		}
		if (cho === 9999) {
			return {
				type: "atk"
			};
		} else {
			return {
				type: "magic",
				index: cho
			};
		}
	} else {
		cho = 9999;
		max = 0;
		for (i = this.magics.length; i--;) {
			curMagic = Magics[this.magics[i]];
			if (curMagic.type === "hp" && this.mp >= curMagic.mp && curMagic.value > max) {
				cho = i;
				max = curMagic.value;
			}
		}
		if (max === 0) {
			return {
				type: "atk"
			};
		} else {
			return {
				type: "magic",
				index: cho
			};
		}
	}
};
var Painter = function(game) {
	var painters = {
		battle: new BattlePainter(game),
		ground: new GroundPainter(game),
		bigmap: new BigmapPainter(game),
		info: new InfoPainter(game),
		dialog: new DialogPainter(game),
		trade: new TradePainter(game),
		story: new StoryPainter(game),
		anime: new AnimePainter(game),
		end : new EndPainter(game)
	};
	this.paint = function() {
		painters[game.state].paint();
	};
};

var Control = function(game) {
	var painter = new Painter(game);
	var controlers = {
		ground: new GroundControl(game),
		battle: new BattleControl(game),
		info: new InfoControl(game),
		dialog: new DialogControl(game),
		trade: new TradeControl(game),
		bigmap: new BigmapControl(game),
		story: new StoryControl(game),
		anime: new AnimeControl(game),
		end : new EndControl(game)
	};
	var __tick = function() {
		controlers[game.state].tick();
		painter.paint();
		window.requestAnimationFrame(__tick);
	};
	this.start = function() {
		window.requestAnimationFrame(__tick);
	};
};


var Game = function() {
	this.state = "story";
	this.story = new Story();
	this.player = new Player();
	this.info = new Info();
	this.battle = null;
	this.dialog = null;
	this.trade = null;
	this.anime = null;
	this.end = null;
};
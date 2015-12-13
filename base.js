var Player = function() {
	this.name = "天镶";
	this.maxHp = 50;
	this.hp = 50;
	this.atk = 20;
	this.skills = [];
	this.exp = 0;
	this.needExp = 100;
	this.level = 1;
	this.money = 0;
	this.items = [];
	this.levelUp = function() {
		var raise = {
			hp: 20,
			atk: 10
		};
		this.maxHp += Math.floor((Math.random() - 0.5) * 5 + raise.hp);
		this.atk += Math.floor((Math.random() - 0.5) * 5 + raise.atk);
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
	this.getItem = function(type, amount) {
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
	this.hasItem = function(type, amount) {
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
	this.loseItem = function(type, amount) {
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
	this.useItem = function(type) {
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
		} else {
			success = false;
		}
		if (success) {
			this.loseItem(type);
			return true;
		}
		return false;
	};
};

var Enermy = function(type) {
	var ene = Enermies[type];
	this.name = ene.name;
	this.maxHp = ene.hp;
	this.hp = this.maxHp;
	this.atk = ene.atk;
	this.type = type;
	this.exp = ene.exp;
	this.money = ene.money;
	this.frames = ene.frames;
};

var Painter = function(game) {
	var painters = {
		battle: new BattlePainter(game),
		ground: new GroundPainter(game),
		bigmap: new BigmapPainter(game),
		info: new InfoPainter(game),
		dialog: new DialogPainter(game),
		trade: new TradePainter(game),
		story: new StoryPainter(game)
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
		story: new StoryControl(game)
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
};
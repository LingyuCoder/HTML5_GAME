var Story = function() {
	this.storyPt = 0;
	this.canToNext = function(game) {
		return Stories[this.storyPt].require(game);
	};
	this.toNext = function(game) {
		if (typeof Stories[this.storyPt].endCallback === "function") {
			Stories[this.storyPt].endCallback(game);
		}
		this.storyPt++;
	};
};

var StoryControl = function(game) {
	var dialogHandler = function(story) {
		game.dialog = new Dialog(story.detail.npc);
		game.state = "dialog";
	};
	var groundHandler = function(story) {
		if (story.detail.map) {
			game.ground = new Ground(game.player, Maps[story.detail.map]);
		}
		if (story.detail.pos) {
			game.ground.setPos(story.detail.pos[0], story.detail.pos[1]);
		}
		if (story.detail.dir) {
			game.ground.dir = story.detail.dir;
		}
		game.state = "ground";
	};
	var battleHandler = function(story) {
		game.battle = new Battle(game.player, new Enermy(story.detail.enermy), false);
		game.state = "battle";
	};
	var handlers = {
		ground: groundHandler,
		dialog: dialogHandler,
		battle: battleHandler
	};
	this.tick = function() {
		if (game.state === "story") {
			var story = Stories[game.story.storyPt];
			handlers[story.type](story);
		}
	};
};

var StoryPainter = function(game) {
	this.paint = function() {};
};
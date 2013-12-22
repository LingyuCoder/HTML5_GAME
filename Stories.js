var Stories = (function() {
	return [{
		type: "dialog",
		detail: {
			npc: {
				name: "师傅",
				detail: Npcs["master"],
				dialog: 2,
				pos: [-1, -1],
				dir: "right",
			}
		},
		require: function(game) {
			return true;
		}
	}, {
		type: "ground",
		detail: {
			map: "start",
			pos: [10, 10],
			dir: "left"
		},
		require: function(game) {
			return true;
		}
	}, /*{
		type: "battle",
		detail: {
			enermy: 1
		},
		require: function(game) {
			return true;
		}
	}, {
		type: "battle",
		detail: {
			enermy: 2
		},
		require: function(game) {
			return true;
		}
	}, {
		type: "battle",
		detail: {
			enermy: 3
		},
		require: function(game) {
			return true;
		}
	}, {
		type: "battle",
		detail: {
			enermy: 4
		},
		require: function(game) {
			return true;
		}
	}, */{
		type: "battle",
		detail: {
			enermy: 5
		},
		require: function(game) {
			return false;
		}
	}/*, {
		type: "battle",
		detail: {
			enermy: 6
		},
		require: function(game) {
			return false;
		}
	}, */];
	/*return [{
		type: "dialog",
		detail: {
			npc: {name: "师傅", detail: Npcs["master"], dialog: 2, pos: [-1, -1], dir: "right", }
		},
		require: function(game) {
			return true;
		}
	}, {
		type: "ground",
		detail: {
			map: "start",
			pos: [10, 10],
			dir: "left"
		},
		require: function(game) {
			if (game.ground.pos[1] === 15 && (game.ground.pos[0] === 6 || game.ground.pos[0] === 5)) {
				return true;
			}
			return false;
		}
	}, {
		type: "dialog",
		detail: {
			npc: {name: "师傅", detail: Npcs["master"], dialog: 3, pos: [-1, -1], dir: "right", }
		},
		require: function(game) {
			return true;
		}
	}, {
		type: "ground",
		detail: {},
		require: function(game) {
			if (game.ground.map.treasures[0].opened && game.ground.map.treasures[1].opened) {
				return true;
			}
			return false;
		}
	}, {
		type: "dialog",
		detail: {
			npc: {name: "师傅", detail: Npcs["master"], dialog: 4, pos: [-1, -1], dir: "right", }
		},
		require: function(game) {
			return true;
		}
	},{
		type: "ground",
		detail: {},
		require: function(game) {
			if (game.player.hasItem(0, 3)) {
				return true;
			}
			return false;
		}
	}, {
		type: "dialog",
		detail: {
			npc: {name: "师傅", detail: Npcs["master"], dialog: 5, pos: [-1, -1], dir: "right", }
		},
		require: function(game) {
			return true;
		}
	}, {
		type: "battle",
		detail: {
			enermy : 0
		},
		require: function(game) {
			return true;
		},
		endCallback : function(game){
			game.ground.map.doors.push({
				to: "garden",
				area: [
					[19, 9],
					[19, 10],
				],
				desPos: [12, 35]
			});
		}
	}, {
		type: "dialog",
		detail: {
			npc: {name: "师傅", detail: Npcs["master"], dialog: 6, pos: [-1, -1], dir: "right", }
		},
		require: function(game) {
			return false;
		}
	}];*/
}());
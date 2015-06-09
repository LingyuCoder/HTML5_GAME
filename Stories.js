var Stories = (function() {
	return [
	//0-4
	{type: "anime", detail: {anime: 0 }, require: function(game) {return true; } },
	{type: "ground", detail: {map: "start", pos: [10, 10], dir: "left"}, require: function(game) {return true;} },
	{type: "dialog", detail: {npc: {name: "黃師傅", detail: Npcs["master"], dialog: 2, pos: [-1, -1], dir: "right", } }, require: function(game) {return true; } },
	{type: "ground", detail: {}, require: function(game) {if (game.ground.pos[1] === 15 && (game.ground.pos[0] === 6 || game.ground.pos[0] === 5)) {return true; } return false; } },
	{type: "dialog", detail: {npc: {name: "黃師傅", detail: Npcs["master"], dialog: 3, pos: [-1, -1], dir: "right", } }, require: function(game) {return true; } },
	//5-9
	{type: "ground", detail: {}, require: function(game) {if (game.ground.map.treasures[0].opened && game.ground.map.treasures[1].opened) {return true; } return false; } },
	{type: "dialog", detail: {npc: {name: "黃師傅", detail: Npcs["master"], dialog: 4, pos: [-1, -1], dir: "right", } }, require: function(game) {return true; } },
	{type: "ground", detail: {}, require: function(game) {if (game.player.hasItem(0, 3)) {return true; } return false; } },
	{type: "dialog", detail: {npc: {name: "黃師傅", detail: Npcs["master"], dialog: 5, pos: [-1, -1], dir: "right", } }, require: function(game) {return true; } },
	{type: "battle", detail: {enermy: 0 }, require: function(game) {return true; }, endCallback: function(game) {game.ground.map.doors.push({to: "garden", area: [[19, 9], [19, 10], ], desPos: [12, 35] }); } },
	//10-14
	{type: "dialog", detail: {npc: {name: "黃師傅", detail: Npcs["master"], dialog: 6, pos: [-1, -1], dir: "right", } }, require: function(game) {return true; } },
	{type: "anime", detail: {anime: 1 }, require: function(game) {return true; } },
	{type: "ground", detail: {map: "town_rural", pos: [12, 20], dir: "up"}, require: function(game) {return true;} },
	{type: "dialog", detail: {npc: {name: "黃師傅", detail: Npcs["master"], dialog: 7, pos: [-1, -1], dir: "right", } }, endCallback: function(game){game.ground.map.npcs.length--;}, require: function(game) {return true; } },
	{type: "ground", detail: {}, endCallback: function(game) {game.ground.map.npcs.push({name: "师傅", detail: Npcs["master"], pos: [9, 10], dir: "left", }); console.log(game.ground.map.npcs); }, require: function(game) {if ((game.ground.pos[0] === 10 && game.ground.pos[1] === 13) || (game.ground.pos[0] === 11 && game.ground.pos[1] === 12)) {return true; } return false; } },
	//15-19
	{type: "ground", detail: {pos: [9, 9], dir: "left", }, require: function(game) {return true; } },
	{type: "dialog", detail: {npc: {name: "？？？", detail: Npcs["master"], dialog: 7, pos: [-1, -1], dir: "right", } }, require: function(game) {return false; } },
	{
		type: "dialog",
		detail: {
			npc: {
				name: "黃師傅",
				detail: Npcs["master"],
				dialog: 7,
				pos: [-1, -1],
				dir: "right",
			}
		},
		require: function(game) {
			return false;
		}
	},
	//20-24
	{type: "end", require: function(game) {return false;}}];
}());
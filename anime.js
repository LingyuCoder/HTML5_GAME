var Anime = function(anime) {
	this.state = "anime";
	this.anime = 0;
	this.type = anime.type;
	this.texts = anime.texts;
	this.textPt = 0;
	this.frame = 0;
};

var AnimeControl = function(game) {
	this.tick = function() {

	};
	$env.bind("keydown", function(event) {
		if (game.state === "anime") {
			if (event.which === 13 && game.anime.state === "idle") {
				var anime = game.anime;
				anime.textPt++;
				if (anime.textPt >= anime.texts.length) {
					if (game.story.canToNext(game)) {
						game.story.toNext(game);
						game.state = "story";
						return;
					}
				} else {
					anime.frame = 0;
					anime.state = "anime";
				}
			}
		}
	});
};

var AnimePainter = function(game) {
	this.paint = function() {
		if (game.anime.state === "anime") {
			var anime = game.anime;
			var start = 0;
			var end = anime.textPt;
			var i;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = "#f0f0f0";
			ctx.font = "bolder 30px 'Microsoft YaHei'";
			if (anime.textPt >= 5) {
				start = anime.textPt - 5;
			}
			for (i = start; i < end; i++) {
				PainterHelper.drawText(anime.texts[i], 100, 100 + 60 * (i - start), 520);
			}
			PainterHelper.drawText(anime.texts[anime.textPt], 100 + (1 - anime.frame / 60) * 400, 100 + 60 * (i - start), 520);
		}
		if (game.anime.frame === 60) {
			game.anime.state = "idle";
		}
		game.anime.frame++;
	};
};
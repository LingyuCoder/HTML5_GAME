var End = function(type) {
	this.frame = 0;
	this.anime = true;
	this.type = type || "lose";
};

var EndControl = function(game) {
	this.tick = function() {
		if (game.state === "end") {
			if (game.end.anime) {
				game.end.frame++;
			}
		}
	};
};

var EndPainter = function(game) {
	var cache = document.createElement("canvas");
	cache.width = 720;
	cache.height = 480;
	var cacheCtx = cache.getContext("2d");

	this.paint = function() {
		var end = game.end;
		var frame = 0;
		var tranRadio;
		var image;
		if (end && end.anime) {
			if (game.end.frame % 6 === 0) {
				frame = Math.ceil(game.end.frame / 6);
				cacheCtx.clearRect(0, 0, cache.width, cache.height);
				cacheCtx.globalAlpha = frame / 20;
				cacheCtx.textAlign = "center";
				cacheCtx.fillStyle = "white";
				cacheCtx.font = "bolder 30px 'Microsoft YaHei'";
				if (end.type === "lose") {
					cacheCtx.fillText("胜败乃兵家常事，大侠请重新来过", cache.width / 2, 400);
				} else {
					cacheCtx.fillText("谢谢", cache.width / 2, 420);
				}

				image = end.type === "lose" ? Resources.images.other.lose : Resources.images.other.win;
				cacheCtx.drawImage(image, (720 - image.width * 2) / 2, (480 - image.height * 2) / 2, image.width * 2, image.height * 2);

				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.fillStyle = "black";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(cache, 0, 0);
				if (frame === 20) end.anime = false;
			}
		}
	};
};
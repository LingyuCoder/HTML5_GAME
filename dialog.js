var Dialog = function(npc) {
	this.dialogTexts = DialogTexts[npc.dialog];
	this.npc = npc;
	this.state = "anime";
	this.dialogPt = 0;
};

var DialogControl = function(game) {
	this.tick = function() {};
	$env.bind("keydown", function(event) {
		if (game.state === "dialog") {
			if (event.which === 13 && game.dialog.state === "idle") {
				var dialog = game.dialog;
				dialog.dialogPt++;
				if (dialog.dialogPt >= dialog.dialogTexts.length) {
					if (game.story.canToNext(game)) {
						game.story.toNext(game);
						game.state = "story";
						return;
					}
					if (dialog.npc.seller) {
						game.trade = new Trade(dialog.npc);
						game.state = "trade";
						game.dialog = null;
					} else {
						game.state = "ground";
						game.dialog = null;
					}
				} else {
					dialog.state = "anime";
				}
			}
		}
	});
};

var DialogPainter = function(game) {
	this.paint = function() {
		if (game.dialog.state === "anime") {
			var dialog = game.dialog;
			var texts = dialog.dialogTexts[dialog.dialogPt];
			var i, m;
			ctx.font = "bold 20px 'Microsoft YaHei'";
			ctx.fillStyle = "#f0f0f0";
			if (dialog.dialogTexts[dialog.dialogPt].player) {
				PainterHelper.drawPanel(0, 330, 720, 150);
				PainterHelper.drawStaticAvatar(7, 337, 136, 136, true);
				for (i = 0, m = texts.text.length; i < m; i++) {
					PainterHelper.drawText(texts.text[i], 170, 360 + i * 25, 530);
				}
			} else {
				PainterHelper.drawPanel(0, 0, 720, 150);
				PainterHelper.drawNpcAvatar(dialog.npc.detail.rc_index, 577, 7, 136, 136);
				PainterHelper.drawText(dialog.npc.name, 20, 30, 530);
				for (i = 0, m = texts.text.length; i < m; i++) {
					PainterHelper.drawText(texts.text[i], 20, 55 + i * 25, 530);
				}
			}
			dialog.state = "idle";
		}
	};
};
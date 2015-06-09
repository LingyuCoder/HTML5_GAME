var Battle = function(player, enermy, escapable) {
	if (typeof escapable === "undefined") {
		escapable = true;
	}
	this.state = "choose"; //战斗状态 choose 选择  player 玩家攻击  enermy 敌人攻击 magic玩家魔法 enermyMagic 敌人魔法 beforeEnd 敌人消失 end战斗结束
	this.player = player; //战斗的玩家
	this.enermy = enermy; //战斗的敌人
	this.record = []; //战斗记录,尚未开发
	this.frame = 0; //动画的帧数
	this.anime = true; //是否在画动画
	this.escapable = escapable; //战斗是否能逃跑
	this.choose = ["attack", "defence", "magic", "item", "escape"]; //战斗可选项
	this.curChoose = 0; //战斗选项指针,在战斗可选项中的顺序
	this.chooseItem = false; //是否在选择物品
	this.itemPointer = 0; //物品指针,在玩家背包中的顺序
	this.chooseMagic = false; //是否在选择魔法
	this.magicPointer = 0; //魔法指针,在玩家魔法中的顺序
	this.enermyMagic = false; //敌人是否在放魔法
	this.enermyMagicPt = 0; //敌人魔法指针,在敌人魔法中的顺序
	this.endInfo = null;
};

var BattleControl = function(game) {
	var calDamage = function(atk, crit) {
		crit = crit || 0;
		var damage = Math.floor(atk * ((Math.random() - 0.5) * 0.4 + 1));
		if (Math.random() < crit) {
			damage *= 2;
		}
		return damage;
	};
	var enermyMove = function(battle) {
		AIResult = battle.enermy.AI();
		if (AIResult.type === "atk") {
			battle.enermyMagic = false;
			battle.enermyMagicPt = 0;
			battle.state = "enermy";
		} else {
			battle.enermyMagic = true;
			battle.enermyMagicPt = AIResult.index;
			battle.state = "enermyMagic";
		}
		battle.anime = true;
	};
	var battleEnd = function(battle) {
		if (game.player.hp <= 0) {
			game.state = "end";
			game.end = new End("lose");
			return;
		}
		battle.state = "end";
		battle.player.exp += battle.enermy.exp;
		battle.player.money += battle.enermy.money;
		battle.endInfo = {
			money: battle.enermy.money,
			exp: battle.enermy.exp,
			levelUp: false
		};
		if (battle.player.exp >= battle.player.needExp) {
			battle.player.levelUp();
			battle.endInfo.levelUp = true;
		}
		battle.anime = true;
	};
	var battleBeforeEnd = function(battle) {
		battle.state = "beforeEnd";
		battle.anime = true;
		battle.frame = 0;
	};
	this.tick = function() {
		if (game.state !== "battle") {
			return;
		}
		if (game.battle.anime) {
			return;
		}
		var battle = game.battle;
		var AIResult;
		var damage;
		var curMagic;

		if (battle.state === "choose") {
			return;
		}
		if (battle.state === "player") {
			battle.enermy.hp -= calDamage(battle.player.atk, battle.player.crit);
			if (battle.enermy.hp <= 0) {
				battleBeforeEnd(battle);
			} else {
				enermyMove(battle);
			}
		} else if (battle.state === "enermy") {
			damage = calDamage(battle.enermy.atk, battle.enermy.crit);
			if (battle.choose[battle.curChoose] === "defence") {
				damage /= 2;
			}
			battle.player.hp -= Math.floor(damage);
			if (battle.player.hp <= 0) {
				battleEnd(battle);
			} else {
				battle.state = "choose";
				battle.anime = true;
			}
		} else if (battle.state === "magic") {
			curMagic = Magics[game.player.magics[battle.magicPointer]];
			battle.player.mp -= curMagic.mp;
			if (curMagic.type === "atk") {
				battle.enermy.hp -= curMagic.value;
			} else if (curMagic.type === "hp") {
				battle.player.hp += curMagic.value;
				battle.player.hp = battle.player.hp >= battle.player.maxHp ? battle.player.maxHp : battle.player.hp;
			}
			if (battle.enermy.hp <= 0) {
				battleBeforeEnd(battle);
			} else {
				enermyMove(battle);
			}
		} else if (battle.state === "enermyMagic") {
			curMagic = Magics[battle.enermy.magics[battle.enermyMagicPt]];
			battle.enermy.mp -= curMagic.mp;
			if (curMagic.type === "atk") {
				battle.player.hp -= curMagic.value;
			} else if (curMagic.type === "hp") {
				battle.enermy.hp += curMagic.value;
				battle.enermy.hp = battle.enermy.hp >= battle.enermy.maxHp ? battle.enermy.maxHp : battle.enermy.hp;
			}
			if (battle.player.hp <= 0) {
				battleEnd(battle);
			} else {
				battle.state = "choose";
				battle.anime = true;
			}
		} else if (battle.state === "beforeEnd") {
			battleEnd(battle);
		}
	};
	$env.bind("keydown", function(event) {
		var battle = game.battle;
		if (game.state === "battle") {
			if (battle.state === "end") {
				if (game.story.canToNext(game)) {
					game.story.toNext(game);
					game.state = "story";
					return;
				}
				game.battle = null;
				game.state = "ground";
			} else if (battle.state === "choose") {
				if (event.which === 38) {
					if (battle.chooseItem) {
						battle.itemPointer--;
						battle.itemPointer = battle.itemPointer < 0 ? 0 : battle.itemPointer;
					} else if (battle.chooseMagic) {
						battle.magicPointer--;
						battle.magicPointer = battle.magicPointer < 0 ? 0 : battle.magicPointer;
					} else {
						battle.curChoose--;
						battle.curChoose = battle.curChoose < 0 ? 0 : battle.curChoose;
					}
				} else if (event.which === 40) {
					if (battle.chooseItem) {
						battle.itemPointer++;
						battle.itemPointer = battle.itemPointer >= battle.player.items.length ? battle.player.items.length - 1 : battle.itemPointer;
					} else if (battle.chooseMagic) {
						battle.magicPointer++;
						battle.magicPointer = battle.magicPointer >= battle.player.magics.length ? battle.player.magics.length - 1 : battle.magicPointer;
					} else {
						battle.curChoose++;
						battle.curChoose = battle.curChoose >= battle.choose.length ? battle.choose.length - 1 : battle.curChoose;
					}
				} else if (event.which === 13) {
					if (battle.chooseItem) {
						var curItem = battle.player.items[battle.itemPointer];
						if (game.player.useItem(curItem.type)) {
							battle.chooseItem = false;
							battle.state = "enermy";
							battle.anime = true;
							battle.frame = 0;
						}
					} else if (battle.chooseMagic) {
						var curMagic = Magics[battle.player.magics[battle.itemPointer]];
						if (battle.player.mp >= curMagic.mp) {
							battle.chooseMagic = false;
							battle.state = "magic";
							battle.anime = "true";
							battle.frame = 0;
						}
					} else {
						var cho = battle.choose[battle.curChoose];
						if (cho === "attack") {
							battle.state = "player";
							battle.anime = true;
						} else if (cho === "defence") {
							battle.state = "enermy";
							battle.anime = true;
						} else if (cho === "escape") {
							if (battle.escapable) {
								battle.state = "end";
							} else {
								alert("关键战斗，怎能逃跑");
							}
						} else if (cho === "item") {
							if (game.player.items.length > 0) {
								battle.chooseItem = true;
							}
						} else if (cho === "magic") {
							if (game.player.magics.length > 0) {
								battle.chooseMagic = true;
							}
						}
						battle.frame = 0;
					}
				} else if (event.which === 37 || event.which === 27) {
					if (battle.chooseItem) {
						battle.chooseItem = false;
					} else if (battle.chooseMagic) {
						battle.chooseMagic = false;
					}
				}
			}

		}
	});
};

var BattlePainter = function(game) {
	var cache = document.createElement('canvas');
	cache.width = 720;
	cache.height = 450;
	var cacheCtx = cache.getContext("2d");
	//cacheCtx.backgroundAlpha = 0;
	var frames = {
		player: {
			enermy: [0],
			player: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
			len: 13
		},
		enermy: {
			player: [0],
		},
		end: {
			player: [0],
			enermy: [0],
			len: 3
		},
		choose: {
			player: [0],
			enermy: [0]
		},
		magic: {
			player: [0, 1, 2, 3, 4, 5, 6, 7, 8],
			enermy: [0]
		},
		enermyMagic: {
			player: [0],
			enermy: [0]
		},
		beforeEnd: {
			player: [0],
			enermy: [0],
			len: 10
		}
	};
	var choseText = ["攻击", "防御", "魔法", "物品", "逃跑"];
	this.paint = function() {
		if (game.battle.anime) {
			var battle = game.battle;
			if (battle.state === "end") {
				ctx.fillStyle = "white";
				ctx.font = "bolder 20px 'Microsoft YaHei'";
				PainterHelper.drawPanel(0, 330, 720, 150);
				PainterHelper.drawStaticAvatar(7, 337, 136, 136, true);
				if (battle.endInfo) {
					PainterHelper.drawText("击败敌人，获得 " + battle.endInfo.exp + " 点经验, 获得金币 " + battle.endInfo.money, 170, 360, 530);
					if (battle.endInfo.levelUp) {
						PainterHelper.drawText("升级了！升到了" + battle.player.level + "级!", 170, 390, 530);
					}
				} else {
					PainterHelper.drawText("成功逃跑了", 170, 360, 530);
				}

				battle.anime = false;
				battle.frame = 0;
				return;
			}
			if (battle.frame % 6 === 0) {
				var frame = Math.floor(battle.frame / 6);
				//HP及MP剩余百分比计算
				var enermyHp = battle.enermy.hp / battle.enermy.maxHp > 0 ? battle.enermy.hp / battle.enermy.maxHp : 0;
				var enermyMp = battle.enermy.mp / battle.enermy.maxMp > 0 ? battle.enermy.mp / battle.enermy.maxMp : 0;
				var playerHp = battle.player.hp / battle.player.maxHp > 0 ? battle.player.hp / battle.player.maxHp : 0;
				var playerMp = battle.player.mp / battle.player.maxMp > 0 ? battle.player.mp / battle.player.maxMp : 0;
				var i, m;
				var magics;
				var items;
				var start;
				var end;
				var curMagic;
				var magicLayer;
				var magicLayerFrame;
				var playerMagicFrameLen = frames["magic"]["player"].length;
				var enermyMagicFrameLen;
				var disRadio;
				var cacheImage;
				//敌人攻击时为动画控制器提供敌人攻击动画的长度及动画帧
				if (battle.state === "enermy") {
					frames.enermy.enermy = battle.enermy.frames;
					frames.enermy.len = battle.enermy.frames.length;
				}
				if (battle.state === "enermyMagic") {
					frames.enermyMagic.enermy = battle.enermy.magicFrames;
					enermyMagicFrameLen = battle.enermy.magicFrames.length;
				}
				//为释放魔法时，为动画控制器提供魔法的长度
				if (battle.state === "magic") {
					frames.magic.len = Magics[battle.player.magics[battle.magicPointer]].anime_length + playerMagicFrameLen;
				} else if (battle.state === "enermyMagic") {
					frames.enermyMagic.len = Magics[battle.enermy.magics[battle.enermyMagicPt]].anime_length + enermyMagicFrameLen;
				}
				//玩家动画帧数
				var playerFrame = frame >= frames[battle.state]["player"].length ? 0 : frame;
				//敌人动画帧数
				var enermyFrame = frame >= frames[battle.state]["enermy"].length ? 0 : frame;
				//魔法动画帧数
				var magicFrame;
				if (battle.state === "magic") {
					magicFrame = frame >= frames[battle.state].len ? 0 : frame;
					playerFrame = frame >= frames[battle.state]["player"].length ? frames[battle.state]["player"].length - 1 : frame;
				}
				if (battle.state === "enermyMagic") {
					magicFrame = frame >= frames[battle.state].len ? 0 : frame;
					enermyFrame = frame >= frames[battle.state]["enermy"].length ? frames[battle.state]["enermy"].length - 1 : frame;
				}

				//清空画布
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				//涂黑画布
				ctx.fillStyle = "black";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				//玩家信息面板
				PainterHelper.drawPanel(400, 0, 320, 110);
				//敌人信息面板
				PainterHelper.drawPanel(0, 370, 320, 110);
				//HP条底色
				ctx.fillStyle = "red";
				ctx.fillRect(420, 45, 280, 20);
				ctx.fillRect(20, 415, 280, 20);
				//MP条底色
				ctx.fillStyle = "#008500";
				ctx.fillRect(420, 75, 280, 20);
				ctx.fillRect(20, 445, 280, 20);
				//HP条
				ctx.fillStyle = "yellow";
				ctx.fillRect(420, 45, 280 * enermyHp, 20);
				ctx.fillRect(20, 415, 280 * playerHp, 20);
				//MP条
				ctx.fillStyle = "#00CC00";
				ctx.fillRect(420, 75, 280 * enermyMp, 20);
				ctx.fillRect(20, 445, 280 * playerMp, 20);
				//玩家信息文字
				ctx.fillStyle = "white";
				ctx.font = "bolder 20px 'Microsoft YaHei'";
				//玩家名称及敌人名称
				PainterHelper.drawText(battle.enermy.name, 420, 30, 280);
				PainterHelper.drawText(battle.player.name, 20, 400, 200);
				//玩家等级
				PainterHelper.drawText("等级 " + battle.player.level, 220, 400, 60);
				//战斗背景
				ctx.drawImage(Resources.images.maps[game.ground.map.type].battle_back, 0, 0, 320, 100, 0, 112, 720, 225);
				//玩家战斗舞台
				ctx.drawImage(Resources.images.maps[game.ground.map.type].battle_player_stage, 0, 0, 155, 44, 360, 380, 365, 99);
				//玩家攻击或魔法时动画帧绘制, 玩家图层在上，其余时候玩家图层在下
				if (battle.state === "player" || battle.state === "magic") {
					ctx.drawImage(Resources.images.enermies[battle.enermy.type], 0, frames[battle.state]["enermy"][enermyFrame] * 200, 320, 200, 0, 0, 720, 450);
					if (battle.state === "player") {
						ctx.drawImage(Resources.images.player.battle, 0, frames[battle.state]["player"][playerFrame] * 200, 320, 200, 0, 0, 720, 450);
					} else {
						ctx.drawImage(Resources.images.player.magic, 0, frames[battle.state]["player"][playerFrame] * 200, 320, 200, 0, 0, 720, 450);
					}
				} else {
					ctx.drawImage(Resources.images.player.battle, 0, frames[battle.state]["player"][playerFrame] * 200, 320, 200, 0, 0, 720, 450);
					if (battle.state === "beforeEnd") {
						disRadio = 1 - frame / (frames[battle.state].len - 1);
						cacheCtx.clearRect(0, 0, cache.width, cache.height);
						cacheCtx.globalAlpha = disRadio;
						cacheCtx.drawImage(Resources.images.enermies[battle.enermy.type], 0, 0, 320, 200, 0, 0, 720, 450);
						/*cacheImage = new Image();
						cacheImage.crossOrigin = "*";
						cacheImage = cache.toDataURL("image/png");*/
						ctx.drawImage(cache, 0, 0);
						//ctx.drawImage(Resources.images.enermies[battle.enermy.type], 0, frames[battle.state]["enermy"][enermyFrame] * 200, 320, 200 * disRadio, 0, 0, 720, 450 * disRadio);
					} else {
						ctx.drawImage(Resources.images.enermies[battle.enermy.type], 0, frames[battle.state]["enermy"][enermyFrame] * 200, 320, 200, 0, 0, 720, 450);
					}
				}
				//玩家魔法绘制
				if (battle.state === "magic") {
					curMagic = Magics[game.player.magics[battle.magicPointer]];
					for (i = 0, m = curMagic.anime.length; i < m; i++) {
						magicLayer = curMagic.anime[i];
						if (magicFrame >= magicLayer.start + playerMagicFrameLen && magicFrame <= magicLayer.start + magicLayer.frames.length + playerMagicFrameLen) {
							magicLayerFrame = magicFrame - magicLayer.start - playerMagicFrameLen >= 0 ? magicFrame - magicLayer.start - playerMagicFrameLen : 0;
							//玩家魔法，攻击在敌人区域绘制，回复在玩家区域绘制
							if (curMagic.type === "atk") {
								ctx.drawImage(Resources.images.magics[curMagic.rc_index], 0, curMagic.anime[i].frames[magicLayerFrame] * curMagic.rc_height, curMagic.rc_width, curMagic.rc_height, magicLayer.left, magicLayer.top, 150, 335);
							} else if (curMagic.type === "hp") {
								ctx.drawImage(Resources.images.magics[curMagic.rc_index], 0, curMagic.anime[i].frames[magicLayerFrame] * curMagic.rc_height, curMagic.rc_width, curMagic.rc_height, 350 + magicLayer.left, 110 + magicLayer.top, 150, 335);
							}
						}
					}
				}
				//敌人魔法绘制
				if (battle.state === "enermyMagic") {
					curMagic = Magics[battle.enermy.magics[battle.enermyMagicPt]];
					for (i = 0, m = curMagic.anime.length; i < m; i++) {
						magicLayer = curMagic.anime[i];
						if (magicFrame >= magicLayer.start + enermyMagicFrameLen && magicFrame <= magicLayer.start + magicLayer.frames.length + enermyMagicFrameLen) {
							magicLayerFrame = magicFrame - magicLayer.start - enermyMagicFrameLen >= 0 ? magicFrame - magicLayer.start - enermyMagicFrameLen : 0;
							//敌人魔法，攻击在玩家区域绘制，回复在敌人区域绘制
							if (curMagic.type === "atk") {
								ctx.drawImage(Resources.images.magics[curMagic.rc_index], 0, curMagic.anime[i].frames[magicLayerFrame] * curMagic.rc_height, curMagic.rc_width, curMagic.rc_height, 350 + magicLayer.left, 110 + magicLayer.top, 150, 335);
							} else if (curMagic.type === "hp") {
								ctx.drawImage(Resources.images.magics[curMagic.rc_index], 0, curMagic.anime[i].frames[magicLayerFrame] * curMagic.rc_height, curMagic.rc_width, curMagic.rc_height, magicLayer.left, magicLayer.top, 150, 335);
							}

						}
					}
				}
				//用户选择绘制
				if (battle.state === "choose") {
					PainterHelper.drawPanel(0, 225, 100, 145);
					ctx.font = "bolder 20px 'Microsoft YaHei'";
					//主选项绘制
					for (i = 0, m = battle.choose.length; i < m; i++) {
						ctx.fillStyle = i === battle.curChoose ? "yellow" : "white";
						PainterHelper.drawText(choseText[i], 20, i * 25 + 255, 80);
					}
					if (battle.chooseItem) {
						//物品选择绘制
						if (game.player.items.length > 0) {
							items = game.player.items;
							start = 0;
							end = items.length;
							PainterHelper.drawPanel(100, 220, 150, 150);
							if (items.length <= 5) {
								start = 0;
								end = items.length;
							} else if (battle.itemPointer <= 3) {
								end = 5;
							} else if (end - battle.itemPointer <= 2) {
								start = end - 5;
							} else {
								start = battle.itemPointer - 3;
								end = battle.itemPointer + 2;
							}

							for (i = start; i < end; i++) {
								ctx.fillStyle = battle.itemPointer === i ? "yellow" : "white";
								PainterHelper.drawText(Items[items[i].type].name, 110, (i - start) * 25 + 250, 130);
							}
						}

					} else if (battle.chooseMagic) {
						//魔法选择绘制
						if (game.player.magics.length > 0) {
							magics = game.player.magics;
							start = 0;
							end = magics.length;
							PainterHelper.drawPanel(100, 220, 150, 150);
							if (magics.length <= 5) {
								start = 0;
								end = magics.length;
							} else if (battle.magicPointer <= 3) {
								end = 5;
							} else if (end - battle.magicPointer <= 2) {
								start = end - 5;
							} else {
								start = battle.magicPointer - 3;
								end = battle.magicPointer + 2;
							}
							for (i = start; i < end; i++) {
								ctx.fillStyle = battle.magicPointer === i ? "yellow" : "white";
								PainterHelper.drawText(Magics[magics[i]].name, 110, (i - start) * 25 + 250, 130);
							}
						}
					}
				}
				if (battle.state !== "choose") {
					//标明动画已结束
					if (frame === frames[battle.state].len - 1) {
						battle.anime = false;
						battle.frame = 0;
						return;
					}
				}
			}
			battle.frame++;
		}
	};
};
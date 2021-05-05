var canvas, stage, exportRoot, anim_container, dom_overlay_container, fnStartAnimation;
function init() {
	canvas = document.getElementById("canvas");
	anim_container = document.getElementById("animation_container");
	dom_overlay_container = document.getElementById("dom_overlay_container");
	var comp=AdobeAn.getComposition("9DC7A2B3800F4F498C7446F904063B10");
	var lib=comp.getLibrary();
	var loader = new createjs.LoadQueue(false);
	loader.installPlugin(createjs.Sound);
	loader.addEventListener("fileload", function(evt){handleFileLoad(evt,comp)});
	loader.addEventListener("complete", function(evt){handleComplete(evt,comp)});
	var lib=comp.getLibrary();
	loader.loadManifest(lib.properties.manifest);
}
function handleFileLoad(evt, comp) {
	var images=comp.getImages();	
	if (evt && (evt.item.type == "image")) { images[evt.item.id] = evt.result; }	
}

//背景音樂 && 結束音樂 && hit 音效
var musicOpen = false;
var danceMusic = new Audio("sounds/danceMusic.mp3");
var hitMusic = new Audio("sounds/hit.mp3");
var finishMusic = new Audio("sounds/finish.mp3");
var dancePlay = setInterval('readyMusic()', 1000);
function readyMusic() {if(musicOpen) danceMusic.play();}

function handleComplete(evt,comp) {
	var lib=comp.getLibrary();
	var ss=comp.getSpriteSheet();
	var queue = evt.target;
	var ssMetadata = lib.ssMetadata;
	for(i=0; i<ssMetadata.length; i++) {
		ss[ssMetadata[i].name] = new createjs.SpriteSheet( {"images": [queue.getResult(ssMetadata[i].name)], "frames": ssMetadata[i].frames} )
	}
	exportRoot = new lib.monkeyLibrary();
	stage = new lib.Stage(canvas);	

	fnStartAnimation = function() {
		stage.addChild(exportRoot);

		//創出猴子物件
		var monkeys = [
		new lib.monkey_01(),new lib.monkey_02(),new lib.monkey_03(),
		new lib.monkey_04(),new lib.monkey_05(),new lib.monkey_06()]	
		var monkeyX = 52;
		$(monkeys).each(function(){
			this.x = monkeyX; monkeyX += 107; this.y = 115;
			exportRoot.addChild(this);	
		})
		//香蕉X軸位置
		var banaX = [120,230,340,450,560,670]

		// 事件觸發涵式
		// 猴子跳舞
		function monkeyDance(){
			// ========== 測試區域屬性 start ==========
			$('#show1').text('--')
			$('#show2').text('--')
			// ==========  測試區域屬性  end ==========

			$('#result').addClass('hasNone');
			dancePlay = setInterval('readyMusic()', 100);
            createjs.Sound.stop();
			exportRoot.gotoAndStop('onready');
			monkeyX = 52
			$(monkeys).each(function(){
				this.gotoAndStop('dancePlay');
				this.x = monkeyX; monkeyX += 107; this.y = 115;		
			});
		}

		//準備爬樹
		function monkeyReady(){
			$('#result').addClass('hasNone');
			danceMusic.pause()
			danceMusic.load()
            clearInterval(dancePlay);       
            createjs.Sound.stop();
			exportRoot.gotoAndPlay('goClimb');
			monkeyX = 88
			$(monkeys).each(function(){
				this.gotoAndStop('wready');
				this.x = monkeyX; monkeyX += 106; this.y = 120;	
			});
		}

		//猴子爬樹中
		function monkeyClimb(selfWin1,selfWin2){
			var rankTimer = setInterval(function(){
				var ranking = [];
				$(monkeys).each(function(){ ranking.push({id:this,value:this.y})})
				var showRank = ranking.sort(function (a, b) {return a.value - b.value;})
				for(var i=0;i<6;i++){
					var name = 'rankImg_'+($(monkeys).index(showRank[i].id)+1)
					$(`#rank_${i+1}`).removeClass().addClass(`${name}`)
				}

				// ========== 測試區域屬性 start ==========	
				for(var i=0;i<6;i++){
					$(`.ht0${i+1}`).text(`${$(monkeys).index(showRank[i].id)+1}`)}	
				// ==========  測試區域屬性  end ==========
			},100)


			var climbTimer;
			setTimeout(function(){
				climbTimer = setInterval(function(){
				$(monkeys).each(function(){
					var climbRan = parseInt(Math.random()*5) - parseInt(Math.random()*5)
					this.y += (this.y + climbRan > 120 && this.y + climbRan < 250) ? climbRan : 0
				})
				},10)
			},1*1000)
			
			var ranMonkeyHit = []
			for(var i=0;i<3;i++){
				var ran = parseInt(Math.random()*6)
				if(ranMonkeyHit.indexOf(ran) == -1){ranMonkeyHit.push(ran)}else{i--}			
			}
			setTimeout(function(){
				shootDown(ranMonkeyHit[0])	
			},1*1000)
			setTimeout(function(){
				shootDown(ranMonkeyHit[1])	
			},3*1000)
			setTimeout(function(){
				shootDown(ranMonkeyHit[2])	
			},4*1000)

			var winMonkey = []
			if(selfWin1 !== undefined && selfWin2 !== undefined && selfWin1 != selfWin2 && selfWin1 >=1 && selfWin1 <=6 && selfWin2 >=1 && selfWin2 <=6){
				winMonkey[0] = parseInt(selfWin1)-1 ; 
				winMonkey[1] = parseInt(selfWin2)-1 ;
				for(var i=0;i<4;i++){
					var ran = parseInt(Math.random()*6)
					if(winMonkey.indexOf(ran) == -1){winMonkey.push(ran)}else{i--}			
				}
			}else{
				for(var i=0;i<6;i++){
					var ran = parseInt(Math.random()*6)
					if(winMonkey.indexOf(ran) == -1){winMonkey.push(ran)}else{i--}			
				}
			}

			// ========== 測試區域屬性 start ==========
			$('#show1').text(winMonkey[0] + 1)
			$('#show2').text(winMonkey[1] + 1)
			// ==========  測試區域屬性  end ==========

			$('#result_gold').removeClass()
			$('#result_silver').removeClass()
			$('#result_gold').addClass('result_gold').addClass(`result_c${winMonkey[0]+1}`)
			$('#result_silver').addClass('result_silver').addClass(`result_c${winMonkey[1]+1}`)

			var winTimer;
			setTimeout(function(){
				clearInterval(climbTimer);	
				winTimer = setInterval(function(){
					monkeys[winMonkey[0]].y >80 ? monkeys[winMonkey[0]].y-- : ''
					monkeys[winMonkey[1]].y >110 ? monkeys[winMonkey[1]].y-- : ''
				},10)				
			},8*1000)
			setTimeout(function(){
				clearInterval(winTimer);
				clearInterval(rankTimer);
				monkeys[winMonkey[0]].gotoAndPlay('getGold');
				monkeys[winMonkey[1]].gotoAndPlay('getSilver');
				for(var i=2;i<6;i++){
					monkeys[winMonkey[i]].gotoAndPlay('getLose');
				}
				finishGame();
			},10*1000)
		}
	
		function finishGame(){
			if(musicOpen)finishMusic.play();
			$('#result').removeClass('hasNone');
		}

		// 隨機香蕉砸中猴子	
		function shootDown(e){
			var banana = new lib.bana();
			exportRoot.addChild(banana);
			banana.x = banaX[e]
			banana.y = 0
			var t1 = setInterval(function(){
				banana.y++;
				if(banana.y >= monkeys[e].y+40){
					if(musicOpen)hitMusic.play();
					hitMusic.currentTime = 0;
					clearInterval(t1);
					shootDown_2();
					hitMonkey();				
				}
			},2)

			function shootDown_2(){
				var cnt = 0
				var t2 = setInterval(function(){
					cnt++
					banana.x++	
					banana.y-=1.5
					if(cnt > 35){
						clearInterval(t2);
						setTimeout(function(){shootDown_3()},300)								
					}
				},5)
			}

			function shootDown_3(){
				var t3 = setInterval(function(){
					banana.y++;
					if(banana.y >350){
						clearInterval(t3);
						exportRoot.removeChild(banana)
					}
				},2)
			}

			function hitMonkey(){
				var shootDown_t1 = setInterval(function(){
				monkeys[e].y++
				monkeys[e].gotoAndPlay('monkeyHit');
				if(monkeys[e].y >= 400){
					clearInterval(shootDown_t1)
					monkeys[e].gotoAndPlay('wplay');
					var shootDown_t2 = setInterval(function(){
						monkeys[e].y--
						if(monkeys[e].y <= 250){
							clearInterval(shootDown_t2)					
						}
					},5)
				}
			},5)
			}
		}

		// 聲音按鈕控制
		$('#soundBtn').click(function(){
			$(this).toggleClass('soundBtn-on');
			var has = $(this).hasClass('soundBtn-on')
			if(has){
				musicOpen = true
			}else{
				musicOpen = false
				danceMusic.pause();
				hitMusic.pause();
				finishMusic.pause();
			}
		})
		setInterval(function stopMusic(){if(!musicOpen)createjs.Sound.stop()},10);
			
		
		//========== 測試區域 ==========
		//點按鈕觸發動作
		$('#btn1').click(function(){
			monkeyDance()
		})

		$('#btn2').click(function(){
			var getNb1 = $('#nb1').val();
			var getNb2 = $('#nb2').val();
			monkeyReady();

			setTimeout(function(){
				monkeyClimb(getNb1,getNb2)
			},3000)
		})  
		

		createjs.Ticker.framerate = lib.properties.fps;
		createjs.Ticker.addEventListener("tick", stage);
	}	    
	//Code to support hidpi screens and responsive scaling.
	AdobeAn.makeResponsive(false,'both',false,1,[canvas,anim_container,dom_overlay_container]);	
	AdobeAn.compositionLoaded(lib.properties.id);
	fnStartAnimation();
}
function playSound(id, loop) {
	return createjs.Sound.play(id, {'interrupt':createjs.Sound.INTERRUPT_EARLY, 'loop': loop});}


	

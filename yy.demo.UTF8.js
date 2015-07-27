/*jslint browser: true*/
/*global console,yy*/
/*jslint plusplus: true */
(function () {
	/*
	*	2014-11-22 15:19 AJ
	*	默认编码UTF-8,如与HTML编码不一致,请用记事本修改该JS文件编码。
	*	1.在html中添加一个空div元素(div必须有一个position属性,长宽无要求(最佳尺寸250*200))
	*	2.将div->style属性设置为:position:relative;width:250px;height:200px;box-shadow:#333 0 0 5px;
	*	3.将div的id传给yy.initial() 例如:yy.initial('div1');
	*	4.OK^_^
	*/
	"use strict";
	var yy = {};//定义命名空间
	yy.circles = [];//元素->单个ball的属性
	yy.mode = {};	  //生成宋词的模式 1->单字;2->双字;3->逗号;4->句号;
	yy.mode.val = ['llj', 'xjy', 'psm', 'rml'];
	yy.mode.llj = [2, 2, 3, 2, 2, 1, 2, 4, 2, 2, 2, 1, 3, 2, 1, 2, 4, 2, 2, 2, 1, 3, 2, 2, 1, 2, 4, 2, 2, 2, 1, 3, 2, 1, 2, 4];
	yy.mode.psm = [2, 2, 2, 1, 3, 2, 2, 2, 1, 4, 2, 2, 1, 3, 2, 2, 1, 4, 2, 2, 1, 3, 2, 1, 2, 4, 2, 2, 1, 3, 2, 2, 1, 4];
	yy.mode.rml = [2, 2, 2, 3, 2, 2, 2, 4, 2, 1, 2, 3, 2, 2, 2, 4, 2, 3, 2, 3, 2, 2, 2, 4];
	yy.mode.xjy = [2, 2, 2, 3, 2, 2, 2, 4, 2, 2, 2, 1, 4, 2, 2, 2, 3, 2, 2, 2, 3, 2, 2, 2, 3, 2, 2, 1, 2, 4, 2, 2, 2, 4];
	yy.initial = function (id) {		//传入字符型参数id，初始化DIV
		yy.one = yy.cione.split(';');//字 数组
		yy.two = yy.citwo.split(';');//词 数组
		var oDiv = yy.aj(id);
		yy.oDivW = oDiv.offsetWidth;
		yy.oDivH = oDiv.offsetHeight;
		yy.putDomAndGetDom(oDiv);//给目标div添加组件
		yy.descBalls();//默认15个balls,传入整型参数->修改balls数目
		yy.addEvent();//监听yy.btn
		yy.begin();//开始
	};
	yy.begin = function () {//开始
		yy.update();
		yy.draw();
		window.yy_requestNextAnimationFrame(yy.begin);
	};
	yy.putDomAndGetDom = function (oDiv) {
		//PUT DOM--------
		var	canvas = document.createElement('canvas'),
			div,
			div2;
		canvas.setAttribute('id', 'yy_canvas');
		canvas.setAttribute('width', yy.oDivW);
		canvas.setAttribute('height', yy.oDivH);
		canvas.setAttribute('style', 'position:absolute;z-index:1;');
		oDiv.appendChild(canvas);
		div = document.createElement('div');
		div.setAttribute('style', 'position:absolute;z-index:2;width:' + Math.floor(yy.oDivW / 2) + 'px;height:' + yy.oDivH / 3 +
								'px;background:rgba(0,0,0,0.4);box-shadow:#444 0 0 5px;top:50%;left:50%;margin-top:-' +
								yy.oDivH / 6 + 'px;margin-left:-' + yy.oDivW / 4 + 'px;border:1px solid #333;' +
								'text-align:center;color:white;font-size:20px;');
		div.innerHTML = "<select id='yy_cipai' style='background: none;outline: none;border-radius: 4px;'>" +
					"<option value='llj'>念奴娇</option><option value='xjy'>西江月</option>" +
					"<option value='psm'>菩萨蛮</option><option value='rml'>如梦令</option></select>" +
					"<div id='yy_songciyi_btn' style='cursor:pointer;' onmouseover=\"this.style.color='orange'\" onmouseout=\"this.style.color='white'\">宋词一首</div>";
		oDiv.appendChild(div);
		div2 = document.createElement('div');
		div2.setAttribute('id', 'yy_songci_show');
		div2.setAttribute('style', 'width:100%;height:100%;position:absolute;z-index:3;color:white;background:rgba(0,0,0,0.4);display:none;font-family:楷体;');
		oDiv.appendChild(div2);
		//GET DOM--------------
		yy.canvas = yy.aj('yy_canvas');
		yy.ctx = yy.canvas.getContext('2d');
		yy.ctx.fillStyle = 'rgba(0,0,0,0.3)';
		yy.ctx.font = "15px 楷体";
		yy.ctx.fillText("不读宋词三百首", 0, 20);
		yy.ctx.fillText("信手拈来几句词", 0, 40);
		yy.imgData = yy.ctx.getImageData(0, 0, yy.canvas.width, yy.canvas.height);
		yy.btn = yy.aj('yy_songciyi_btn');//onclick to show songci
		yy.show = yy.aj('yy_songci_show');//show when yy.btn onclick; self.onclick to hide.
	};
	yy.addEvent = function () {//监听yy.btn
		yy.btn.onclick = function () {
			yy.cipai = yy.aj('yy_cipai').value;//词牌名(代号)
			var prop = {};
			prop.arr = yy.mode[yy.cipai];
			switch (yy.cipai) {
			case 'llj':
				prop.cipai = "念奴娇";
				break;
			case 'psm':
				prop.cipai = "菩萨蛮";
				break;
			case 'rml':
				prop.cipai = "如梦令";
				break;
			case 'xjy':
				prop.cipai = "西江月";
				break;
			}
			yy.create(prop);
		};
	};
	yy.create = function (prop) {//prop.arr->模式;prop.cipai->词牌名(NOT 代号)
		var arr = prop.arr,
			str = "";
		arr.forEach(function (obj) {
			switch (obj) {
			case 1:
				str += yy.one[yy.random(0, 300)];
				break;
			case 2:
				str += yy.two[yy.random(0, 300)];
				break;
			case 3:
				str += ',';
				break;
			case 4:
				str += '。';
				break;
			}
		});
		yy.show.innerHTML = "<span style='position:absolute;top:0;right:0;cursor:pointer;font-size:20px;' title='Hide' " +
							"onclick=\"this.parentNode.style.display='none';\" onmouseover=\"this.style.color='orange'\">X</span>" +
							"<div style='margin:10% 5px;'><div style='line-height:25px;font-weight:bold;'>" + prop.cipai +
							"</div><div style='line-height:20px;'>" + str + "</div></div>";
		yy.show.style.display = 'block';
	};
	yy.circle = function (prop) {//balls类
		this.x = (prop.x !== undefined) ? prop.x : 100;
		this.y = (prop.y !== undefined) ? prop.y : 100;
		//this.r=(Math.random()*20);
		this.r = (Math.random() * 10) + 20;
		this.vx = Math.random() + 0.2;
		this.vy = Math.random() + 0.2;
		this.color = "rgba(" + Math.floor(255 * Math.random()) + "," + Math.floor(255 * Math.random()) + "," +
					Math.floor(255 * Math.random()) + "," + Math.random().toFixed(1) + ")";
		this.val = yy.two[yy.random(0, 200)];
	};
	yy.descBalls = function (num) {//初始化balls
		var circle, i;
		num = (num !== undefined) ? parseInt(num, 10) : 15;
		for (i = 0; i < num; i++) {
			circle = new yy.circle('');
			yy.circles.push(circle);
		}
	};
	yy.update = function () {//更新每个ball的属性
		var i, x, y;
		for (i = 0; i < yy.circles.length; i++) {
			x = yy.circles[i].x + yy.circles[i].vx;
			y = yy.circles[i].y + yy.circles[i].vy;
			if (x > yy.canvas.width || x < 0) {
				yy.circles[i].vx = -yy.circles[i].vx;
				x += 2 * yy.circles[i].vx;
				yy.circles[i].color = "rgba(" + Math.floor(255 * Math.random()) + "," + Math.floor(255 * Math.random()) + "," +
							Math.floor(255 * Math.random()) + ",0.5)";
				yy.circles[i].val = yy.two[yy.random(0, 200)];
			}
			if (y > yy.canvas.height || y < 0) {
				yy.circles[i].vy = -yy.circles[i].vy;
				y += yy.circles[i].vy;
				yy.circles[i].color = "rgba(" + Math.floor(255 * Math.random()) + "," + Math.floor(255 * Math.random()) + "," +
							Math.floor(255 * Math.random()) + "," + Math.random().toFixed(1) + ")";
				yy.circles[i].val = yy.two[yy.random(0, 200)];
			}
			yy.circles[i].x = x;
			yy.circles[i].y = y;
		}
	};
	yy.draw = function () {//画背景balls
		var i, obj;
		yy.ctx.putImageData(yy.imgData, 0, 0);
		for (i = 0; i < yy.circles.length; i++) {
			obj = yy.circles[i];
			yy.ctx.save();
			yy.ctx.beginPath();
			yy.ctx.fillStyle = obj.color;
			yy.ctx.arc(obj.x, obj.y, obj.r, 0, Math.PI * 2, false);
			yy.ctx.fill();
			yy.ctx.font = obj.r - 3 + "px 楷体";
			yy.ctx.fillText(obj.val, obj.x - this.ctx.measureText(obj.val).width / 2, obj.y + obj.r / 3);
			yy.ctx.closePath();
			yy.ctx.restore();
		}
	};
	yy.random = function (a, b) { //产生a-b之间的一个随机整数
		return Math.floor(Math.random() * Math.abs(b - a) + a);
	};
	yy.aj = function (id) {
		return document.getElementById(id);
	};
	window.yy_requestNextAnimationFrame = (function () {
		var oWRAF, wrapper, callback, geckoVersion = 0,
			userAgent = navigator.userAgent,
			index = 0,
			that = this;
		if (window.webkitRequestAnimationFrame) {
			wrapper = function (time) {
				if (time === undefined) {
					time = +new Date();
				}
				that.callback(time);
			};
			oWRAF = window.webkitRequestAnimationFrame;
			window.webkitRequestAnimationFrame = function (callback, element) {
				that.callback = callback;
				oWRAF(wrapper, element);
			};
		}
		if (window.mozRequestAnimationFrame) {
			index = userAgent.indexOf('rv:');
			if (userAgent.indexOf('Gecko') !== -1) {
				geckoVersion = userAgent.substr(index + 3, 3);
				if (geckoVersion === '2.0') {
					window.mozRequestAnimationFrame = undefined;
				}
			}
		}
		return window.requestAnimationFrame   ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function (callback, element) {
				var start,
					finish;
				window.setTimeout(function () {
					start = +new Date();
					callback(start);
					finish = +new Date();
					that.timeout = 1000 / 60 - (finish - start);
				}, that.timeout);
			};
	}());
	//词库-------
	yy.cione = "人;花;风;一;不;春;无;天;月;时;来;云;山;江;水;有;年;香;处;是;相;如;去;雨;何;红;归;情;玉;中;上;愁;清;长;日;千;楼;秋;梦;夜;酒;子;金;寒;谁;里;生;新;南;尽;更;西;烟;空;满;今;前;小;声;歌;飞;得;心;似;明;东;醉;事;重;流;断;行;多;落;恨;见;为;头;深;此;未;与;三;万;自;柳;青;作;轻;旧;下;在;知;又;几;思;好;回;别;高;黄;看;笑;还;成;芳;间;难;老;光;闲;少;残;意;翠;阳;画;远;路;平;雪;到;过;梅;词;帘;语;游;家;君;初;绿;欲;道;向;晚;望;后;离;泪;十;仙;波;双;溪;枝;草;色;只;起;华;影;字;却;当;开;我;莫;书;对;数;应;问;碧;客;暮;城;燕;沙;分;正;和;欢;窗;吹;门;斜;兰;犹;已;白;倚;古;两;地;衣;朝;叶;尘;留;也;同;堪;台;临;乐;点;外;诗;共;须;半;了;庭;卷;边;独;暗;依;休;细;故;孤;湖;曲;娇;舟;凉;罗;疏;晓;将;树;景;冷;垂;入;郎;二;岁;记;霜;阴;眼;信;渐;阑;第;灯;舞;其;之;露;章;都;忆;横;度;幽;魂;惊;照;儿;眉;送;尊;肠;把;海;可;听;手;乱;马;说;气;想;珠;妆;首;淡;随;的;微;桃;佳;寻;然;念;杨;蝶;-;且;州;近;消;散;从;宫;池;亭;雁;名;枕;争;调;吟;龙;凝;面;院;河;曾;著;木;觉;鬓;怀;萧;五;银;住;约;晴;能;薄;桥;容;粉;林;寄;北;会;便;暖;算;真;凭;凤;带;言;朱;杯;锦;早;许;被;身;管;绣;世;令;苦;解;凄;动;但;！;浅;转;破;盈;四;匆;惜;百;楚;醒;奈;教;浪;浮;待;试;夕;沉;方;往;逢;神;怨;个;出;集;国;元;安;美;余;关;发;丝;睡;寂;浣;遥;期;飘;竹;堂;渔;浓;乡;静;节;鱼;莺;连;鸳;阁;目;兴;闻;催;素;怜;取;絮;啼;星;六;片;那;恋;王;厌;最;伴;干;传;弦;先;绪;使;烛;九;艳;幕;定;收;昏;屋;非;登;永;等;袖;屏;易;隔;吴;秦;爱;漫;琼;园;赋;鹧;以;鸪;荷;音;伤;遍;怕;本;栏;狂;掩;斗;鸿;常;坐;绝;写;英;减;悠;低;涯;迟;频;甚;短;负;汉;蛮;陌;饮;忍;放;悄;翻;因;感;弄;步;隐;瑶;塘;宵;物;浦;于;纤;湘;销;底;宴;携;谢;他;冰;大;羞;限;径;岸;映;丹;户;终;瘦;女;胜;彩;文;雾;缕;任;太;·;船;石;结;引;绕;立;而;久;娥;学;乍;峰;合;公;紫;村;句;唤;采;伊;端;喜;洲;才;绮;病;颜;忘;恁;洞;要;松;系;怅;杳;壶;指;踏;倒;漏;总;霞;征;追;角;萨;移;良;眠;宝;悲;菩;迢;摇;陵;］;卧;桑;零;滴;［;腰;味;扇;量;昨;潮;媚;纵;袅;计;杏;茫;绛;经;鼓;莲;野;锁;举;禁;倾;鸟;韵;况;换;渺;虚;愿;比;恼;奴;鸾;误;载;主;折;力;梢;际;若;唱;士;极;车;蕊;添;怎;恐;识;圆;畔;襟;迷;钗;洗;昼;馆;沈;罢;翁;尚;菊;乘;拟;偏;息;泛;复;叹;番;功;李;蓬;梁;扫;◇;八;柔;鹤;鹊;繁;雕;衾;镜;孙;川;密;蛾;渡;寞;种;痕;迹;梧;遇;衰;巧;索;桐;居;赏;潇;丽;荡;逐;拂;碎;拥;尺;七;团;钩;官;奇;遗;宜;黯;梨;危;付;鸣;骑;认;层;笙;帆;敛;宋;殿;湿;疑;卜;急;态;苏;肯;剪;笛;笼;杜;表;阶;．;妙;秀;扁;牵;鸯;雄;劝;用;棹;图;透;丛;雅;筵;聚;黛;嫩;直;就;慢;抱;忽;荒;观;吾;并;足;墙;化;戏;岂;泉;惟;再;群;冠;宿;炉;脸;题;些;候;叠;整;寿;父;纱;齐;傍;至;韶;壁;憔;恩;扬;悴;宗;鬟;工;床;帐;所;阙;全;背;口;羽;箫;穷;席;辞;占;坠;夫;帝;浑;染;旋;瑞;堤;扶;困;衫;偷;谩;代;旗;篱;钟;交;亦;历;火;乌;泥;轮;除;笺;宇;遣;桂;通;簇;佩;做;稀;虞;市;沧;呼;话;倦;盘;踪;皇;强;房;措;展;鸥;凌;穿;顾;苍;恰;慵;迎;尤;檐;格;萦;淮;京;这;肌;苑;次;趁;张;塞;歇;偶;否;参;幸;惹;皆;蒙;死;修;鸡;唇;般;午;理;驾;诉;纷;钓;蝉;商;暂;属;阔;伫;寸;脉;莎;缘;傲;莱;灵;汀;栖;拍;轩;省;论;洒;聊;鹭;惆;精;帏;赢;称;查;裙;鸦;阻;；;豪;样;遮;梳;顿;料;蜂;切;咽;蟾;借;予;鞍;顷;军;条;挂;冉;报;昔;芙;哀;裳;拚;懒;越;侵;品;槛;涛;辰;号;妨;富;练;绵;蓉;差;着;闭;抛;觞;霄;原;藏;贺;响;漠;失;守;打;巷;武;娟;岩;壮;胡;亲;熏;檀;浩;井;窥;殷;田;勤;骨;巾;髻;堆;持;酬;周;苔;虹;酌;食;笔;竞;簪;魄;侣;压;霁;变;舍;利;斟;皓;损;稳;插;暑;匀;建;净;①;柯;渚;虽;促;旅;寥;读;阵;泊;帽;砌;痴;棠;兼;婉;刘;灭;溶;俱;盏;簟;兵;走;致;封;者;绡;象;进;筝;虎;霏;缺;沾;访;琴;谈;弹;烂;融;偎;缓;陈;街;甘;剑;竟;围;源;丈;软;侧;嗟;鳞;雷;恶;丁;郊;润;健;颦;烦;妒;薰;涨;盖;咏;钱;触;旌;岭;含;奏;仍;翩;土;犯;脂;唐;特;织;彻;缥;吐;续;谷;惨;即;迁;贵;阮;境;萼;严;盟;堕;忧;准;霓;驱;嘉;机;温;政;鼎;庆;衔;阕;志;买;劳;耿;每;由;皋;禽;蛩;熟;闺;钿;嫌;宛;衷;茅;柱;纹;错;铜;存;披;邻;祝;澹;淘;翦;护;觅;场;榭;萋;喧;没;寐;快;缈;卖;袜;始;驻;盛;霭;浸;诸;洛;饶;徊;异;价;怪;腻;瑟;陇;亡;圣;怯;拈;蓑;眸;广;御;板;环;单;各;府;现;鲜;郁;注;徐;剩;社;俯;牛;霎;铁;贤;命;菲;线;侯;检;庐;婵;及;冬;娘;程;齿;枉;宣;冻;镇;绍;啸;夷;案;裘;辇;康;部;尾;求;姿;驿;馀;姑;澄;败;战;继;杆;童;仰;辛;卮;摘;篷;□;冶;纶;貂;滋;徘;俗;岛;民;击;派;赠;矣;鞭;屈;荣;描;惯;徽;苒;潘;师;据;谓;壑;加;受;阿;闹;内;爽;枯;捣;费;颇;体;猜;形;乾;推;倩;宁;宽;琶;排;提;蕙;嘶;裁;琵;妖;栊;驰;忙;歹;泽;运;旁;娉;烧;袂;醺;羁;停;丰;铺;承;吞;掷;翼;拆;史;敲;昭;投;必;苹;榴;悔;萍;芜;痛;攀;樽;蜡;杖;漾;珍;按;栽;坤;恣;妍;业;帷;俊;羡;熙;娱;暝;宦;谐;冲;藕;肥;艇;招;免;延;妃;峭;兮;履;虏;慨;你;瓦;廊;箭;标;退;赤;斋;拾;纸;赵;婷;贪;射;夏;降;妾;邀;法;岳;庵;杪;咫;桡;鹃;砧;铃;扑;实;挥;淅;迥;闪;或;支;闷;避;耳;值;胧;萸;献;枫;沁;晖;猿;坡;弃;嬉;博;冥;胸;珊;曳;藉;曹;赖;列;授;臣;璧;芦;酥;埃;羌;幄;袍;宾;佛;捻;改;朋;欹;敢;俄;犀;德;鹂;弱;役;铅;滩;炎;骤;请;舸;性;掌;骢;靥;造;茱;飒;凋;鳌;编;积;药;活;篆;脱;鲈;皱;竿;刀;呈;腾;狼;沼;抵;尝;略;血;委;奔;鸭;输;印;虫;蒲;则;卿;谒;扰;巫;庙;甲;橘;较;辉;序;筹;牡;废;朦;丘;嫁;唯;衬;茸;弟;杰;选;斑;仗;缀;县;淑;衢;律;蚁;舆;很;郭;左;右;幅;荆;累;鞋;滑;觑;乃;浴;渊;箔;撼;囊;摸;针;段;漂;根;泻;抬;寺;布;祖;麦;荐;监;抹;茶;褪;班;佑;菱;丙;渠;蜀;兽;递;瓯;妓;滟;怒;坚;探;姬;寝;汗;位;装;幺;粟;义;抗;阆;１;障;款;巢;骄;酣;拜;蝴;泣;枢;暇;油;籍;凛;忡;螺;葱;抚;夸;奉;兔;联;绽;淹;鲸;霖;毡;悬;裂;陶;嫋;拨;芝;酹;紧;飕;末;颠;胭;保;网;牙;束;笳;诏;酿;岫;么;蘸;耸;骖;潺;腮;卢;捧;挑;接;益;制;呜;违;蕉;樵;旦;乳;览;喷;麝;敌;伯;陆;飙;丑;浙;蓝;侬;架;萤;戈;弥;篇;途;潜;簌;欺;昌;区;杀;己;权;闽;歧;珑;吉;跳;止;友;蓦;涓;匹;後;诚;设;兄;颗;樱;皎;蓼;瓶;电;刻;托;旆;曰;欣;荔;辔;撩;笋;妇;芰;室;僧;樯;轼;垒;灰;孝;耕;具;逍;翰;骚;荧;搔;众;姮;助;桨;欠;冈;崖;肢;司;甫;弓;朵;果;刚;艺;黑;愤;盼;尧;笠;增;领;校;醁;耐;鹅;睹;议;斛;沟;祠;决;桧;污;施;眷;判;济;疾;湾;晋;揉;界;磨;岑;供;嶂;溜;绀;旷;夭;毫;稼;尖;朔;轧;宠;召;殢;敧;茵;姝;柴;奁;策;屡;夺;麟;廷;豆;激;洁;渭;辈;勒;杵;脚;晏;模;揽;善;窕;窈;凡;赐;秘;孟;殊;适;舒;扉;谋;谪;挽;假;签;藻;质;慷;纨;茧;拘;削;洪;汝;玲;维;暄;涌;醪;芽;麻;既;夹;酝;翘;趣;简;农;晕;祥;叔;衡;婆;酸;雀;乔;璃;戚;懊;嫣;戍;驭;补;险;掠;幢;亏;跃;毛;羊;鬼;龟;靓;酩;酊;曙;巴;蹙;热;优;扃;醑;憀;舜;荫;玳;贫;瓮;戴;掉;驼;舣;晨;幻;震;操;覆;粗;萝;职;仪;津;绳;戎;玩;搅;蚕;沸;娆;劲;烈;吊;仲;梭;瀛;彤;蔌;苕;米;牢;翡;叟;墨;烘;葭;莹;廓;营;埋;麾;娃;峡;潭;钧;乞;槐;侍;迤;治;娑;棋;瞻;毕;恹;勋;座;典;谱;哲;缨;担;嵘;术;遂;讯;讴;柏;超;蒿;饱;偕;忠;餐;坊;仿;隋;彭;鹿;辑;范;仁;瓜;缸;猎;寓;固;缠;姊;凰;榆;嗅;矶;宅;籁;峨;鹦;莼;类;鹉;喉;腊;契;潋;颤;呵;摧;球;威;拖;遭;坞;斝;摩;均;谣;藓;朗;研;陪;昂;仕;溅;肉;i;襄;禊;舫;烬;凫;畅;膏;森;炷;执;哉;抽;脆;揭;鲛;私;窄;沽;琐;亚;升;氛;旖;汤;旎;液;男;寰;薇;濛;拣;葛;宸;陡;傅;饭;铸;逞;遏;弯;廉;悦;仓;翅;母";
	yy.citwo = "何处;东风;相思;人间;千里;江南;浣溪;溪沙;归去;风流;木兰;春风;鹧鸪;兰花;明月;归来;西风;如今;恋花;鸪天;无人;蝶恋;多少;芳草;少年;回首;黄昏;尊前;天涯;万里;一作;梅花;流水;相逢;菩萨;萨蛮;江月;多情;斜阳;--;依旧;不见;水调;凄凉;时间;屋更;歌头;风雨;间-;卷第;书香;新时;香屋;-本;章字;更新;本章;字数;章书;年年;匆匆;去年;美人;往事;当年;阑干;调歌;无限;当时;临江;不知;风吹;深处;平乐;西江;一笑;清平;故人;江仙;玉楼;寂寞;断肠;减字;平生;落花;无情;风月;杨柳;时节;无数;鸳鸯;一枝;思量;词集;为谁;人不;扁舟;字木;采桑;第一;春色;梨花;桑子;一片;憔悴;一点;桃花;黄花;不似;佳人;昨夜;无语;如梦;垂杨;几度;何事;夕阳;相见;厌厌;酒醒;盈盈;算子;清明;卜算;帘幕;念奴;天气;别来;年少;燕子;千古;秋千;满江;奴娇;几时;飞絮;梦里;今日;一声;笙歌;行人;不堪;人在;高楼;南乡;西湖;惆怅;长相;何时;江山;乡子;悠悠;虞美;不如;只有;闲愁;查子;容易;春寒;肠断;别后;满庭;生查;人生;记得;天上;风光;十年;来时;旧时;珠帘;又是;十分;离愁;细雨;无言;惟有;携手;烟雨;不是;消息;十二;江城;时候;梦魂;何人;秋风;不成;绛唇;深深;春归;行云;芙蓉;江红;花开;无奈;长安;梧桐;玉人;知何;今夜;可怜;情绪;庭院;望江;萧萧;尽日;好事;月明;蓬莱;而今;那堪;人归;几许;画堂;梦断;江上;踏莎;莎行;风细;点绛;重阳;独倚;有人;池塘;王孙;南浦;中措;朝中;可惜;登临;花落;独自;今年;渔家;家傲;几回;其中;谁知;功名;青山;烟水;不到;迢迢;小楼;楼春;水龙;依约;荷花;其词;如何;赢得;暮云;花前;佳期;等闲;龙吟;春来;寒食;茫茫;门外;金缕;小窗;不管;其二;明年;分明;桃李;潇湘;西楼;归路;谁家;今宵;沉沉;别离;相对;声声;杨花;罗衣;一番;世间;相忆;风波;神仙;江西;满眼;心事;无端;人去;双燕;城子;殷勤;一曲;繁华;光阴;芳心;十里;风格;不须;杏花;不尽;月下;长亭;花飞;海棠;烟波;一梦;飞来;事近;晚来;旧游;万事;几番;参差;风露;此情;新月;梦中;无处;年华;庭芳;秦楼;轻寒;不住;新愁;使君;清秋;浪淘;无计;画楼;愁无;重重;东流;第五;临水;兰舟;一叶;与君;江天;花下;当日;杳杳;明朝;飞去;白发;年时;全集;朱颜;秋光;三十;人人;渔父;今古;缥缈;隐隐;夜来;销魂;离别;淘沙;秋水;满地;一夜;好景;春光;南北;无穷;残红;目断;梦令;千秋;飘零;悄悄;离恨;中秋;惊起;离人;秋色;雨过;未成;春愁;千万;二十;把酒;春水;阮郎;郎归;风不;不禁;如水;不忍;日暮;重来;帘卷;分付;江梅;瑶台;争奈;深院;去来;泪眼;花无;心情;定风;微雨;黄金;人何;英雄;总是;徘徊;玉壶;月上;如画;自有;醉里;楼台;第二;夜深;清歌;向人;老去;如此;依依;楼上;阳关;正是;婵娟;人心;一杯;梦回;栏杆;年来;云雨;花满;眼前;风前;芳菲;词全;人家;代表;伤心;梦觉;只恐;花深;五卷;新郎;陌上;长忆;望断;春情;又还;试问;扬州;阳台;落魄;江湖;秦娥;当初;月华;处是;何似;银河;数声;枝上;不胜;谁同;不能;鹊桥;回头;落尽;风清;说与;断魂;有意;情怀;远山;枝头;-字;游人;别有;经年;难留;忆秦;洞庭;凌波;终日;须信;琵琶;新声;今夕;一生;风起;太平;双飞;自是;疏雨;何许;歌子;秋声;歌声;落日;人情;凭谁;天长;前事;千金;此时;脉脉;落红;谁与;不道;绮罗;醉落;浮云;朱户;表作;三更;暮雨;诗人;不断;春去;花红;睡起;萧索;还是;应是;衷情;诉衷;千山;故国;一时;轻盈;行乐;霓裳;唤起;柳梢;南柯;残月;流年;前欢;玉案;岁岁;泉子;独立;酒泉;三千;东君;花谢;与谁;踪迹;著名;归鸿;南楼;青春;山中;湖上;清香;浮生;人愁;冉冉;多时;处处;纤手;去也;第四;何妨;淡月;香尘;中有;有情;过了;主人;语言;此生;贺新;明日;金门;第六;东西;等其;是处;行客;夜永;归时;天与;来去;灯火;是人;山色;江水;院落;凝伫;词人;向晚;此恨;离情;西园;犹在;旧日;古今;一半;青玉;倚危;此地;人老;朝云;伫立;花阴;无力;和泪;翠袖;乾坤;难忘;楼月;云飞;时见;百年;巷陌;桃源;花时;在何;碧云;早是;满目;玉树;进士;此际;多病;良辰;歹带;千载;香满;满院;绿阴;伤春;从此;落梅;带］;人知;花枝;新来;冷落;关山;绿杨;零落;楚天;一天;楼高;咫尺;凭栏;犹记;长江;为我;魂梦;愁人;杜鹃;残花;皓月;风景;得人;无绪;人远;花天;双双;夜长;一枕;情难;临风;真个;飞燕;水云;云山;柯子;春梦;天风;南陌;寻常;罗绮;水边;倚阑;心绪;银烛;◇◇;万古;中酒;零乱;波平;天然;犹有;迁莺;花不;襟袖;付与;［歹;何况;今朝;秋岁;富贵;依前;犹未;如雪;喜迁;细看;迟迟;道中;留连;桥仙;觉来;却是;长恨;夜夜;夜月;许多;学士;人世;乱山;起来;旧事;仙子;酒阑;相看;望中;疏影;吹箫;烦恼;绿鬓;人肠;斜日;娉婷;风味;日日;依然;疏狂;夜雨;金杯;孤负;最苦;一帘;先生;看看;红妆;新词;怎生;渺渺;老来;绍兴;笑语;都是;山如;三月;看取;遥山;谈笑;烟树;恨无;灯前;倚楼;情无;牡丹;故园;金尊;怅望;斜月;不语;花春;五湖;茱萸;韶光;年游;相倚;万顷;情不;关河;清夜;南枝;衰草;沧洲;朦胧;过尽;画桥;黄鹂;送春;事不;两两;个人;空有;漠漠;岁华;下水;何日;晚风;今属;纷纷;花间;人同;清风;是春;何如;中原;旧欢;青楼;作有;园春;东篱;日长;小桃;飞花;南歌;教人;其三;特地;十六;钱塘;人如;之作;画屏;青青;断人;不老;高阳;留不;处不;重到;天教;白头;怀抱;来又;旧恨;春不;人千;天一;花秋;何在;春衫;危楼;有谁;不解;刘郎;子长;人未;风轻;仙歌;春意;洞仙;江头;几点;去不;暗香;红尘;照人;无心;花慢;到处;真是;晓来;风一;歌舞;随分;声断;此意;精神;酒杯;难收;无声;情人;溶溶;如许;旧家;卖花;文章;无际;清晓;月满;奈何;两处;永遇;遇乐;梢青;朱门;银蟾;谁共;愁多;南山;光景;窗纱;滋味;人来;园林;到此;帘外;前度;良夜;卷帘;对酒;蝴蝶;恨不;年春;谁念;九日;风来;凉生;为君;作品;爱国;同心;更漏;香罗;云涛;相将;南宋;凭阑;花底;帘栊;人静;栏干;帘垂;俯仰;化作;瑶池;恰似;似当;明珠;碧玉;衰翁;第三;画角;恼人;无寐;楼前;星河;倚栏;风絮;风满;雨后;红楼;尘不;新绿;醉倒;无凭;层楼;袅袅;香雾;自古;词作;庭花;山远;寂寂;东南;如花;向晓;雨一;人语;丹青;寻芳;颜色;日高;难得;只是;红粉;回廊;欢娱;去后;寻处;知道;良宵;无寻;三五;过雨;一尊;几多;也应;谒金;薰风;花一;奇绝;歌罢;粉面;华发;笑我;纵横;幽香;琼枝;为主;不为;已是;窗外;幽人;壶天;山头;归舟;人似;更无;一春;彩云;从前;来一;极目;兴亡;数峰;的词;天地;准拟;不归;旌旗;不用;不负;令人;黄菊;愁肠;人无;时春;处无;水远;无多;如归;雕栏;庭户;貂裘;乘兴;屈指;云间;恨难;人说;蒙蒙;细细;还似;得一;载酒;画船;月夜;疑是;分飞;年人;好梦;小庭;欲去;两行;岁晚;洞房;月到;柳丝;绿水;杜宇;湖好;斜风;残阳;深意;小桥;中人;残照;琼楼;不应;重山;起舞;愁不;归后;知否;寒梅;身世;武陵;三山;整顿;依稀;闻道;来风;横斜;时时;纤纤;人共;渐远;声里;醉乡;汀洲;幽梦;关情;登楼;新恨;言语;花雨;山河;君莫;残春;多谢;山路;洛阳;和气;胭脂;一川;甚处;醒时;归期;黯黯;幽恨;愁绪;似水;新晴;烟花;何曾;佳节;柳絮;马上;从今;谁寄;不肯;事何;似旧;来无;忘了;欢笑;一醉;窗前;草草;处去;欲尽;几日;天外;泪珠;吴山;尽成;雨细;休休;花影;萋萋;浑似;秋夜;有时;聚散;山前;秋月;年今;神州;那更;紫陌;碧桃;清浅;年花;半夜;春山;天如;有个;雨打;二卷;幽怨;居士;箫鼓;情知;华清;来不;新妆;老人;工夫;去无;重叠;莫放;留春;月中;情多;渐老;二月;老尽;处问;烟中;莺声;两三;墙头;衣冠;一十;凤楼;腰肢;花风;未老;人道;万家;怀古;人意;随人;不放;寻思;帝里;晚妆;暗想;翠眉;锦字;春深;白玉;管弦;万缕;相望;征鸿;两鬓;酒一;只在;一场;多愁;是一;愁思;和风;便是;好花;无定;娇红;韶华;踏青;幸有;破阵;催人;雨余;人相;送行;谁似;凭高;与花;罗袜;花为;笑人;影里;耿耿;孤馆;影响;钗头;花如;楼外;山长;可堪;晴空;最是;上西;来几;逍遥;山下;寄与;认得;飞鸿;此事;从容;与人;花香;故山;皇恩;是离;感皇;时月;从教;无聊;尘埃;金波;此去;五更;是无;时人;纱窗;双蛾;天下;金陵;醒来;事一;百尺;闲倚;倚遍;共谁;江边;点点;迢递;孤山;有相;西窗;沉醉;花梢;红叶;何限;游丝;昼永;金钗;流不;归何;红烛;空阔;莺啼;忘却;香云;春心;柳色;金风;柳外;尽道;姮娥;高歌;鸳衾;是相;香径;难寄;何必;枕前;山无;绿树;是梦;无一;新诗;一寸;思无;两眉;风急;一个;燕支;山山;踏枝;鹊踏;千岁;绣帘;一襟;清泪;一霎;山阴;鱼龙;四卷;欲归;十三;尺素;不怕;一望;千年;一日;长是;月照;不曾;榴花;吟诗;斜照;如故;六卷;人初;欹枕;图画;无事;莫教;岁寒;已无;赤壁;爽气;吹尽;桥边;留得;次第;也无;潇潇;夜寒;春到;絮飞;不与;皓齿;人非;小小;白首;难禁;倾杯;薄幸;闲情;欢声;翠蛾;花面;时同;罗幕;又争;云散;栖鸦;秋江;玉钩;忆王;湖光;子双;应念;好天;人自;小池;春又;春已;离魂;孤城;池上;香风;飞不;红日;云来;也有;似玉;画阁;月如;遥想;慷慨;一去;阵子;上人;风情;赏心;眼儿;解语;昭阳;年不;题诗;安排;天不;垂泪;马嘶;嬉游;音信;台榭;时休;易散;来人;秋波;思忆;十四;池阁;宫春;是何;向尊;儿童;更何;满城;相伴;消得;一轮;柳下;清尊;萧疏;孤舟;又何;三年;儿女;西北;君恩;鸥鹭;人到;与春;枕上;伴人;清昼;况有;佳丽;到头;时不;重门;清宵;春恨;来还;宋玉;云愁;杯盘;春将;似春";
	//--------END

	window.yy = yy;
}());

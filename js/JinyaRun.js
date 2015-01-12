function jumpForum(fname){
		var call_native = "";
		if (/android/i.test(navigator.userAgent)){
    // todo : android
			call_native = "http://127.0.0.1:6257/sendintent?intent=%23Intent%3Baction%3Dcom.baidu.tieba.VIEW%3BlaunchFlags%3D0x10000000%3Bcomponent%3Dcom.baidu.tieba%2F.service.WebNativeReceiver%3BS.fname%3D"+fname+"%3BS.type%3Dfrs%3BS.from%3D%3Bend&t=1398839995246&callback=__jsonp2955"
		}

		else if (/ipad|iphone|mac/i.test(navigator.userAgent)){
		// todo : ios
			//call_native = "com.baidu.tieba://jumptoforum?tname="+fname;
			call_native = "http://tieba.baidu.com/f?kw="+fname;
			
		}else{
		
			call_native = "http://tieba.baidu.com/f?kw="+fname;
		}
		window.location.href = call_native;
	}
(function(){
    // for apple touchmove window
    document.addEventListener("touchmove",function(e){
       // e.preventDefault();  
    })
	var call_native = ""
	
	
    window.requestAnimationFrame = (function(){
        return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(/* function */ callback, /* DOMElement */ element){
          window.setTimeout(callback, 1000 / 60);
        };
      })();
    imgUrl = "http://chenjinya.cn/wumai/img/avatar.png";
    lineLink = "http://chenjinya.cn/wumai/index.html";
    descContent = '万能贴吧防霾指数';
    shareTitle = '万能贴吧-防霾指数小测试';
    appid = '';
    var JinyaRun = function(){
        this.constuctor();
    };
    JinyaRun.prototype={
        x:0,
        y:0,
        timeLimit:300,//计时30秒
        resources:[],
		numCount:0,
		inject:[],
        process:[],
        restTime:0,
        runTime:0,
        startFlag:false,
        canTouch:true,
        backgroundColorIndex:0,
        canDeal:false,
        constuctor:function(){
            this.stage = $("#gameStage");
			this.canvas = $("#gameCanvas");
            this.timeCounter = $("#leftCounter");
            this.rightCounter = $("#rightCounter")
            this.dialog = $("#dialog");
            this.ctx = this.canvas[0].getContext("2d");
            this.init();
        },
        init:function(){
            this.fullWindow([this.canvas]);
            this.initResources();
            this.bindEvent();
        },
        fullWindow:function(canvas){
            this.windowWidth = $(document).width();
            this.windowHeight = $(window).height();
            $("#container").width(this.windowWidth);
            //不能用.width.height，否则比例拉伸
            this.stage.css({width : this.windowWidth, height: this.windowHeight});
			for( var i=0; i<canvas.length; i++){
                canvas[i][0].width = this.windowWidth;
                canvas[i][0].height = this.windowHeight;
            }

        },
		adjustPsotion:function(){
				var self = this;
				var main  = $("#resultWrap");
				
				/*if(this.windowHeight > self.resources['index'].image.height )
				{
					 height = self.resources['index'].image.height;
				}*/
				var s = self.resources['index'].image.height/self.resources['index'].image.width;// h/w正确比例
				//var R =  self.windowWidth*(162/320)/2;
				if( self.resources['index'].image.height >this.windowHeight )
					this.windowHeight = self.resources['index'].image.height;
				 main.height(this.windowHeight);
				 this.canvas[0].height = this.windowHeight;
				var Y = self.windowWidth*s*(178/505);
				var X =  self.windowWidth/2;
				var ws = self.windowHeight/self.windowWidth
				var H = self.windowWidth*s;
				var pureH = self.resources['index'].image.height;
				main.find(".result_title").css({top:0.21*pureH}); //20% //正确的高度百分比 * 真实舞台的高度
				main.find(".title_tip").css({top:0.3*pureH}); //30
				main.find(".result_desc").css({top:0.6*pureH}); //60
				main.find(".focus_btn").css({top:0.7*pureH}); //70
				main.find(".forum_list").css({top:0.81*pureH}); //81
				main.find("#buttonWrap").css({top:0.88*pureH}); //88
				
		},
        bindEvent:function(){
            var self = this;
            $("#resultWrap").on("click",".j_restart",function(){
					self.restart();
            }).on("click",".j_share",function(){
					$("#shareimg").show();
						setTimeout(function(){
							$("#shareimg").hide();
						},2000)
                    shareTimeline()
            }).on("click",".focus_btn",function(){
				$("#dialog").show();
				setTimeout(function(){
					$("#dialog").hide();
				},2000)
			});
            this.canvas.on("click",function(e){
                self.processControl(e);
            }).on("touchstart",function(e){
                //self.pointer.x = e.touches[0].pageX;
                self.processControl(e);
            }).on("touchmove",function(e){
                //self.pointer._x = e.touches[0].pageX;
                self.processControl(e);
            }).on("touchend",function(e){
                self.processControl(e);
            });

        },

        initResources:function(){

            var l =  new JinyaLoading();
            var self = this;
            l.loadImage("img/index.png","index");
            l.loadImage("img/cloud.png","cloud");

            l.loadImage("img/before.png","before");
            l.loadImage("img/btnclick.png","btnclick");
            l.loadImage("img/ready.png","testing");
            l.loadImage("img/fenxi.png","fenxi");
            l.loadImage("img/result.png","result");
            l.loadImage("img/result1.png","result1");
            l.loadImage("img/result2.png","result2");
            l.loadImage("img/result3.png","result3");
            l.loadImage("img/result4.png","result4");

            l.loadProcess(function(i,c){
                $("#Jinya_loading_process_body").css("width",100*(i/c).toFixed(1)+"%");
                $("#Jinya_loading_process_body").html(100*(i/c).toFixed(1)+"%");
            });
            l.loadDone (function(s){
                self.resources = s;
                for(var i in s){
                    self.resources[i].img = self.resizeImage(self.resources[i].image);

                }
                $("#Jinya_loading_process_wrap").hide();
				self.adjustPsotion();
				self.initData();
                self.start();
               
				

            })


        },
        processControl:function(e){
            
            if(e.type =="click" && this.process.index==false && this.process.info==false){
                this.process.index = true;
                delete this.inject["index"];
				this.process.info = false;
                this.initInfo();
                
            }else if(e.type =="touchstart" && this.process.index == true &&  this.process.info == false){
                this.process.info = true;
				console.log("start");
                delete this.inject["info"];
				this.process.testing = false;
                this.initTesting();
            }else if(e.type =="touchend" &&  this.process.info== true &&this.process.testing==false &&this.process.analysis== false){
                this.process.info = true;
				this.process.testing= true;
                delete this.inject["testing"];
				delete this.inject["drawCircle"];
                this.initAnalysis();
            }

        },
		initData:function(){
			var self = this;
			self.canTouch = true;
			this.resultArray= [];
			this.resultArray.push({title:"35.2",tip:'77.5%',des:'中国特色社会主义体魄就是这么「吹」出来的，人类防霾基因就靠你延续了！',forum:'<a href="http://tieba.baidu.com/f?kw=牛逼吧">牛逼</a><a  href="http://tieba.baidu.com/f?kw=生物" >生物吧</a><a  href="http://tieba.baidu.com/f?kw=宇宙">宇宙吧</a>'});
			this.resultArray.push({title:"59.6",tip:'50.2%',des:'一直都从「良」，练练就升「优」，防霾还得心肺好，出门记得戴口罩！',forum:'<a href="http://tieba.baidu.com/f?kw=健身">健身吧</a><a href="http://tieba.baidu.com/f?kw=跑步">跑步吧</a><a href="http://tieba.baidu.com/f?kw=口罩">口罩吧</a>'});
			this.resultArray.push({title:"78.3",tip:'13.8%',des:'「差一点儿及格」说的就是你，抗冻靠属性，防霾靠装备，钱还够吗？',forum:'<a href="http://tieba.baidu.com/f?kw=雾霾">雾霾吧</a><a href="http://tieba.baidu.com/f?kw=绿植">绿植吧</a><a href="http://tieba.baidu.com/f?kw=兼职">兼职吧</a>'});
			this.resultArray.push({title:"91.5",tip:'0.9%',des:'间接性蓝天的环境已经不适合你了，学好外语攒好钱以后再作打算吧！',forum:'<a href="http://tieba.baidu.com/f?kw=移民">移民吧</a><a href="http://tieba.baidu.com/f?kw=旅行">旅行吧</a><a href="http://tieba.baidu.com/f?kw=空气">空气吧  </a>'});
		},
        initIndex:function(){
            var start=[0,0];
            var direction = 0;
            this.inject["index"] = [function(self){
                var image = self.resources["index"].img;
                var cloudImage = self.resources["cloud"].img;
                self.ctx.drawImage(image,0,0,image.width,image.height);
                if(start[0] >20 ){
                    direction = -0.1;
                }else if(start[0] <=0 ){
                    direction = 0.1;
                }
                start[0] = start[0]+direction;
                self.ctx.drawImage(cloudImage, -start[0], start[1],cloudImage.width*1.4,cloudImage.height);
            },this];
			
            
        },
        initInfo:function(){

            this.inject["info"] = [function(self){
                var image = self.resources["before"].img;
                self.ctx.drawImage(image,0,0,image.width,image.height);

            },this];


        },
        initCircle:function(){
            var ctx = this.ctx;
            var self = this;
            this.Angle = -Math.PI/2;
            var ctx2 = this.canvas[0].getContext("2d");
            ctx.lineWidth =self.windowWidth*(15/320); // 设置线宽
            ctx.strokeStyle = "#0099FF"; // 设置线的颜色
            var myGradient = ctx.createLinearGradient(0, 0, 0, 160);
            myGradient.addColorStop(0, "#BABABA");

            myGradient.addColorStop(1, "#0099FF");
            ctx.strokeStyle = myGradient;
            ctx.font = "Bold 50px Arial";
            // 设置对齐方式
            ctx.textAlign = "center";
            // 设置填充颜色
            ctx.fillStyle = "#AAA";
            var s = self.resources['index'].image.height/self.resources['index'].image.width;
           var R =  self.windowWidth*(162/320)/2;
            var Y = self.windowWidth*s*(178/505);
            var X =  self.windowWidth/2;
			var speed = Math.PI*2/60/10;
            this.inject["drawCircle"]=[function(self,ctx){
                if(self.Angle > Math.PI*2-Math.PI/2){

                    delete self.inject["drawCircle"];
                    delete self.inject["testing"];
					self.process.testing = false;
                    self.initAnalysis();

                }else{
				// Math.PI/2/ 3600
                    self.Angle +=speed;
                }
                ctx.font = "Bold 50px Arial";
                ctx.fillText(""+Math.round((self.Angle+Math.PI/2)/(Math.PI*2)*10)+"", X ,Y);
                ctx.font = "Bold 20px Arial";
                ctx.fillText("sec", X ,Y+40);
                ctx.beginPath();
                //(self.windowWidth - self.windowWidth*(180/320))/2
                ctx.arc(X,Y,R,-Math.PI/2,self.Angle,false); // 外圈
                ctx.stroke();//使用ctx.fill();就是填充色；
            },this,ctx,R,X,Y];
        },
        initTesting:function(){
            var self = this;

            this.inject["testing"] = [function(self){
                var image =self.resources["testing"].img;
                self.ctx.drawImage(image,0,0,image.width,image.height);
                var button = self.resources["btnclick"].img;
                self.ctx.drawImage(button,0,0,button.width,button.height);

            },this];
            self.initCircle();



        },
        initCircle2:function(){
            var ctx = this.ctx;
            var self = this;
            this.Angle = -Math.PI/2;

            ctx.lineWidth =self.windowWidth*(15/320); // 设置线宽
            ctx.strokeStyle = "#0099FF"; // 设置线的颜色
            var myGradient = ctx.createLinearGradient(0, 0, 0, 160);
            myGradient.addColorStop(0, "#BABABA");

            myGradient.addColorStop(1, "#0099FF");
            ctx.strokeStyle = myGradient;
            ctx.font = "Bold 50px Arial";
            // 设置对齐方式
            ctx.textAlign = "center";
            // 设置填充颜色
            ctx.fillStyle = "#AAA";
            var s = self.resources['index'].image.height/self.resources['index'].image.width;
            var R =  self.windowWidth*(162/320)/2;
            var Y = self.windowWidth*s*(178/505);
            var X =  self.windowWidth/2;
			var speed = 3600/(60*60*60);
            this.inject["drawCircle"]=[function(self,ctx){
                if(self.Angle > Math.PI*2-Math.PI/2){

                    delete self.inject["drawCircle"];
                    delete self.inject["analysis"];
					
                    self.initResult();

                }else{
                    self.Angle +=speed;
                }
                ctx.font = "Bold 60px Arial";
                ctx.fillText(""+Math.round((self.Angle+Math.PI/2)/(Math.PI*2)*100)+"", X ,Y);
				 ctx.font = "Bold 20px Arial";
                ctx.fillText("%", X ,Y+40);
                ctx.beginPath();
                //(self.windowWidth - self.windowWidth*(180/320))/2
                ctx.arc(X,Y,R,-Math.PI/2,self.Angle,false); // 外圈
                ctx.stroke();//使用ctx.fill();就是填充色；
            },this,ctx,R,X,Y];
        },
        initAnalysis:function(){

            var self = this;
			this.process.analysis = true;
            this.inject["analysis"] = [function(self){
                var image =self.resources["fenxi"].img;
                self.ctx.drawImage(image,0,0,image.width,image.height);
               // var button = self.resources["btnclick"].img;
                //self.ctx.drawImage(button,0,0,button.width,button.height);

            },this];
            self.initCircle2();
        },
        initResult:function(){
            var self = this;

            this.inject["result"] = [function(self){
                var image =self.resources["result"].img;
                self.ctx.drawImage(image,0,0,image.width,image.height);
				var  i = Math.floor(Math.random()*4)+1;
                 var res = self.resources["result"+i].img;
                self.ctx.drawImage(res,0,0,res.width,res.height);
			
                self.startFlag = false;
                self.showResult(i);
            },this];

         },
        showResult:function(i){
				delete this.inject["result"];
				var main  = $("#resultWrap");
				var res = this.resultArray[i-1];
				 descContent = "万能贴吧-防霾指数小测试";
				
				shareTitle = '我的雾霾中毒指数是'+res["title"];
				main.find(".result_title").html(res["title"]);
				main.find(".title_tip").html('已经打败了全国<span class="red">'+res["tip"]+'</span>的人坚持活下来');
				main.find(".result_desc").html(res["des"])
				main.find(".forum_list").html(res["forum"]);
                $("#resultWrap").show();


        },
        resizeImage:function(image,scale){
                if(!image){
                    return;
                }
                if(!scale) scale=1
                var _scale = image.width/image.height;
				 image.width = this.windowWidth;
				 image.height =image.width/_scale;
           /* if(this.windowWidth / this.windowHeight > _scale){
                image.height =this.windowHeight*scale;
                image.width =image.height*_scale;

            }else{
                image.width =this.windowWidth*scale;
                image.height =image.width/_scale;
            }*/
            return image



        },

        start:function(){
			var self = this;
			this.initEnv();
			
			$("#resultWrap").hide();
			
			this.initIndex();
			
			this.animate();
           

        },
		restart:function(){
			var self = this;
			this.initEnv();
			this.process.index = true;
			this.process.info = false;
			$("#resultWrap").hide();
			this.initInfo();
			this.animate();
		},
        initEnv:function(){
            this.startFlag = true;
            this.runTime =0;
            this.restTime=0;
            this.canDeal = false;
            this.canTouch = true;
			
			this.process.index=false;
			this.process.info = false;
			this.process.testing =false;
			this.process.analysis =false;

        },

        end:function(){
            var self = this;
           
        },
        /**
        *  清画布
        */
        clearCanvas:function(canvas){
            for ( var i =0 ; i < canvas.length; i++){
                var context = canvas[i][0].getContext('2d');
               // console.log("clear",0, 0,this.windowWidth, this.windowHeight)
                context.clearRect( 0, 0,this.windowWidth, this.windowHeight);
            
            }
            
        },
        animate:function(){
            if(! this.startFlag) return;
            this.clearCanvas([this.canvas]);
            for (var i in this.inject ){
                //console.log("animate:",i)
                /*
                * [function(argv1,argv2){},argv1,argv2...]
                */
                this.inject[i][0].apply(this,this.inject[i].slice(1));//帧移动
            }
			FPS ++;
            var self = this;
            requestAnimationFrame(function(){ self.animate() });
        }


    };
	var showFPS=function(){
			FPS=0;
			setTimeout(function(){
				//console.log("FPS:"+FPS);
				FPS =0;
				showFPS();
			},1000);
		}
	window.FPS = 0;

    window.Game =new JinyaRun();
    showFPS();
})();
//=============weixin
    
"use strict";
class RaffleWheel{
  constructor(oDiv,aPrize){
    this.oDiv=oDiv;     // 容器
    this.oWheel=null;   // 转盘
    this.oDraw=this.oDiv.getElementsByClassName("draw")[0];    // 抽奖按钮
    this.aPrize=aPrize; // 奖项
    this.award=0;       // 抽奖几等奖
    this.oStyleSheets=null;  // 页面上样式表（添加旋转角度用）
    // 几项计算数据
    this.prizeLen=this.aPrize.length;                               // 奖项个数
    this.singleWidth=this.oDiv.clientWidth*Math.sin((180/this.prizeLen)*(Math.PI/180));  // 单个奖项·宽度
    this.prozeAngle=360/this.prizeLen;                              // 单个奖项·角度
    // 抽奖记录
    this.aRaffleRecord=localStorage.getItem("raffleRecord")?JSON.parse(localStorage.getItem("raffleRecord")):[];
    // 初使化
    this.init();
  }

  // 初使
  init(){
    let that=this;
    // 创建转盘
    let oWheel=document.createElement("ul");
    oWheel.className="runGo";
    // 创建样式表·为了后期添加旋转角度
    if(!this.oStyleSheets){
      let oStyleSheet=document.createElement('style');
      oStyleSheet.type='text/css';
      document.head.appendChild(oStyleSheet);
      this.oStyleSheets=document.styleSheets[document.styleSheets.length-1];
    }
    // 创建转盘奖项·[STAR]
    this.aPrize.map((item,idx)=>{
      // 角度计算，从180度为开始（默认第一项在上，指针所指方向）
      let prozeAngleCount=this.prozeAngle*idx>=180?(this.prozeAngle*idx-180):(this.prozeAngle*idx+180);
      // 奖项数组对象·写进相应角度
      item.prozeAngle=prozeAngleCount;
      // 元素对象·创建抽奖项
      let oLi=document.createElement('li');
      // 奖项图标
      if(item.prizePic){
        let prizeImgArea=document.createElement('span');
        prizeImgArea.className="prizePic";
        prizeImgArea.innerHTML="<img src='"+item.prizePic+"' />"
        oLi.appendChild(prizeImgArea); // 图标对象
      }
      // 奖项文字
      if(item.prizeName){
        var prizeName=document.createElement('span');
        prizeName.className="prizeTitle"
        prizeName.innerHTML="<em>"+item.prizeBrief+"</em><strong>"+item.prizeName+"</strong>";
        oLi.appendChild(prizeName); // 图标对象
      }
      // 奖项计算（位置、角度）
      oLi.style.transform="rotate("+prozeAngleCount+"deg)"; // 旋转角度
      oLi.style.width=this.singleWidth+"px"; // 单个宽度
      oLi.style.left=(this.oDiv.clientWidth/2-this.singleWidth/2)+"px"; // 位置（半径-单个宽度的一半）
      // 样式表·元素对象划分线（奖项角度的一半）
      this.oStyleSheets.addRule('.wheel li::before','transform:rotate('+this.prozeAngle/2+'deg)')
      // 元素对象·写入转盘
      oWheel.appendChild(oLi);
    });
    // 创建转盘奖项·[END]
    this.oDiv.appendChild(oWheel);
    // 读出转盘
    this.oWheel=this.oDiv.getElementsByTagName("ul")[0];
    
    // 默认转到竖线，哪也不是
    this.oWheel.style.transform="rotate(-"+(this.prozeAngle/2)+"deg)";
    // 页面加载时的转动,转完了就清除
    this.oWheel.addEventListener("webkitAnimationEnd",function(ev){that.cleanDraw(ev,that)},false);
  } // - init -

  // 转完复位
  cleanDraw(ev,that){
    // 保存中奖角度
      that.oWheel.style.transform="rotate("+(-that.prozeAngle*that.award)+"deg)";
    // 转盘复位！
    that.oDraw.classList.remove('drawMov');
    // 指针停摆
    that.oWheel.classList.remove('runGo');
    console.log("转盘复位！");
  }

  // 抽奖
  drawHandle(award=0){
    let cssRules=this.oStyleSheets.cssRules;

    if(this.oWheel.classList.contains('runGo')){
      // oWheel.addEventListener("webkitAnimationEnd",cleanDraw,false);
      console.log("抽奖中，别闹~！");
      return false;
    }else{
      // 找出动作,先删除
      for(let key in cssRules){
        if(cssRules[key].name&&cssRules[key].name=="run"){
          this.oStyleSheets.deleteRule(key);
        }
      }
      this.award=award;
      // 写入转动角度
      this.oStyleSheets.insertRule(`@keyframes run{
        from{transform:rotate(0)}
        to{transform:rotate(${1440-this.prozeAngle*this.award}deg)}
      }`);
      // 添加转动效果
      this.oWheel.classList.add('runGo');
      this.oDraw.classList.add('drawMov');
      // ********** localStorage ********** /
      // 抽奖时间\抽中奖别\抽中奖项\+\转盘编号\转盘名称
      let drawResult={
        drawTime:dateTimeFormat(new Date),
        drawPrize:this.aPrize[this.award]['prizeName'],
        prizeName:this.aPrize[this.award]['prizeBrief']
      }
      this.aRaffleRecord.unshift(drawResult);
      this.aRaffleRecord.length=this.aRaffleRecord.length>10?10:this.aRaffleRecord.length;
      localStorage.setItem("raffleRecord",JSON.stringify(this.aRaffleRecord));
      // ********** localStorage ********** /
    }
  }
}
// 时间格式化
function dateTimeFormat(date){
  var y=date.getFullYear();
  var m=date.getMonth()+1;
      m=m<10?('0'+m):m;
  var d=date.getDate();
      d=d<10?('0'+d):d;
  var h=date.getHours();
      h=h<10?('0'+h):h;
  var minute=date.getMinutes();
      minute=minute<10?('0'+minute):minute;
  var second=date.getSeconds();
      second=second<10?('0'+second):second;
  return y+'-'+m+'-'+d+' '+h+':'+minute+':'+second;
};
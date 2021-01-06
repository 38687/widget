
window.onload=function(){
  // 转盘·元素
  var oWheel=document.getElementsByClassName("wheel")[0].getElementsByTagName("ul")[0];
  // 抽奖按钮
  var oDraw=document.getElementsByClassName("wheel")[0].getElementsByTagName("a")[0];
  // 奖项个数
  let prizeLen=prizeArr.length;
  // 单个奖项·宽度
  var singleWidth=oWheel.offsetWidth*3.1416/prizeLen;
  // 单个奖项·角度
  var prozeAngle=360/prizeLen;
  // 样式表
  var oStyleSheets=document.styleSheets[document.styleSheets.length-1];
  // 抽中了几等奖
  var award=0;

  // 抽奖记录
  var raffleRecord=localStorage.getItem("raffleRecord")?JSON.parse(localStorage.getItem("raffleRecord")):[];
  console.log("抽奖记录：");
  console.log(raffleRecord);

  // 奖项数组对象·遍历
  prizeArr.forEach((item,idx)=>{
    // 角度计算，从180度为开始（默认第一项在上，指针所指方向）
    var prozeAngleCount=prozeAngle*idx>=180?(prozeAngle*idx-180):(prozeAngle*idx+180);
    // 奖项数组对象·写进相应角度
    item.prozeAngle=prozeAngleCount;
    // 元素对象·创建抽奖项
    var oLi=document.createElement('li');
    // 奖项图标
    if(item.prizePic){
      var prizeImgArea=document.createElement('span');
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
    oLi.style.width=singleWidth+"px"; // 单个宽度
    oLi.style.left=(oWheel.offsetWidth/2-singleWidth/2)+"px"; // 位置（半径-单个宽度的一半）
    // 样式表·元素对象划分线（奖项角度的一半）
    oStyleSheets.addRule('.wheel li::before','transform:rotate('+prozeAngle/2+'deg)')
    // 元素对象·写入转盘
    oWheel.appendChild(oLi);
  });
  // 打印奖品对象
  // console.log(prizeArr);

  // 页面加载时的转动,转完了就清除
  oWheel.addEventListener("webkitAnimationEnd",cleanDraw,false);
  // 点击抽奖
  oDraw.addEventListener("click",drawHandle,false);

  function drawHandle(){
    var cssRules=oStyleSheets.cssRules;
    if(oWheel.classList.contains('runGo')){
      console.log("抽奖中，别闹~！");
      return false;
    }else{
      // 找出动作,先删除
      for(let key in cssRules){
        if(cssRules[key].name&&cssRules[key].name=="run"){
          oStyleSheets.deleteRule(key);
        }
      }
      // 几等奖（测试/随机数）
      award=Math.floor(Math.random()*prizeLen);
      console.log(award);
      // 写入转动角度
      oStyleSheets.insertRule(`@keyframes run{
        from{transform:rotate(0)}
        to{transform:rotate(${1440-prozeAngle*award}deg)}
      }`,oStyleSheets.length-2);
      // 添加转动效果
      oWheel.classList.add('runGo');
      // 指针动摆
      oDraw.classList.add('drawMov');
      // ********** localStorage ********** /
      // 抽奖时间\抽中奖别\抽中奖项\+\转盘编号\转盘名称
      var drawResult={
        drawTime:dateTimeFormat(new Date),
        drawPrize:prizeArr[award]['prizeName'],
        prizeName:prizeArr[award]['prizeBrief']
      }
      raffleRecord.unshift(drawResult);
      raffleRecord.length=raffleRecord.length>10?10:raffleRecord.length;
      localStorage.setItem("raffleRecord",JSON.stringify(raffleRecord));
      // ********** localStorage ********** /
    }
  }
  function cleanDraw(){
    // 保存中奖角度
    oWheel.style.transform="rotate("+(-prozeAngle*award)+"deg)";
    // 转盘复位！
    oDraw.classList.remove('drawMov');
    // 指针停摆
    oWheel.classList.remove('runGo');
    console.log("转盘复位！");
  }
};

// 抽奖记录
function getRaffleRecord(){
  var raffleRecord=localStorage.getItem("raffleRecord");
  if(!raffleRecord){
    raffleRecord=[];
    localStorage.setItem("raffleRecord",raffleRecord);
  }
  console.log(dateTimeFormat(new Date));
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
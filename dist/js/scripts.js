!function(t){var e,o=t.ProjectileMotion=t.ProjectileMotion||{},i=o.Game=function(t,i,r,s,n,a,c){e=this,this.ctx=t,this.auth=i,this.flows=r,this.flowId=r.shot,this.flowsArray=[],this.projectileNumber=0,this.hit,this.timeoutId,this.dimX=s,this.dimY=n,this.shooting=!1,this.projectileArray=[],this.currentScore,this.score,this.notifications=new o.Notifications,this.target=new o.Target(c,this.dimY),this.guess=a?this.setupGuess(a):[],_.each(r,function(t,o){e.flowsArray.push(t)})};i.prototype.start=function(){this.ws=new o.Websockets(this.auth,this.flowsArray,this.msgCallback),this.ws.connect(),this.draw()},i.prototype.draw=function(){var t=e.ctx.getContext("2d");t.fillStyle="#002a3b",t.fillRect(0,0,e.dimX,e.dimY),e.hit&&e.shot?e.target.hit(t):e.target.draw(t),e.shooting||e.shot?e.drawProjectiles(t):e.drawGuess(t)},i.prototype.fire=function(){e.shooting=!0,e.shot=!1,e.draw(),$(".fire").removeClass("hidden")},i.prototype.drawGuess=function(t){for(var o=0;3>o;o++)e.guess[o].draw(t)},i.prototype.drawProjectiles=function(t){if(e.projectileNumber=0,e.drawProjectile(t),e.shooting){for(var o=1;o<e.projectileArray.length;o++)setTimeout(function(){e.drawProjectile(t)},50*o);e.timeoutId=setTimeout(function(){e.shot!==!1&&(e.resetFire(),e.draw())},3e4)}else for(var o=0;o<e.projectileArray.length;o++)e.drawProjectile(t)},i.prototype.drawProjectile=function(t){e.projectileArray[e.projectileNumber]&&(e.projectileArray[e.projectileNumber].draw(t),e.projectileNumber++,e.projectileArray.length==e.projectileNumber&&e.afterProjectiles(t))},i.prototype.afterProjectiles=function(t){this.notifications.add(this.score,this.currentScore),e.hit?(e.target.hit(t),$(".hit-text").removeClass("hidden")):$(".miss-text").removeClass("hidden"),$(".score").text(e.currentScore),e.shot=!0,e.shooting=!1},i.prototype.showScore=function(){$(".score").text(e.currentScore)},i.prototype.msgCallback=function(t){if(t.flowId!==e.flows["current-state"]||(_.each(t.elems,function(t,i){"fire"!=i&&$("."+i).text(t.value),"target_distance"==i&&(e.target=new o.Target(t.value,e.dimY))}),!e.shooting&&e.shot&&(clearTimeout(e.timeoutId),e.resetFire()),!e.shooting)){if(t.flowId===e.flows["current-guess"]){var i=t.elems.points.value;e.guess=e.setupGuess(i)}return t.flowId===e.flows.result?void e.reportHit(t.elems.score.value):t.flowId===e.flows["shot-fired"]?e.projectileCallback(t):t.flowId===e.flows["current-score"]?t.elems.newGame&&t.elems.newGame.value?e.newGame():e.reportScore(t.elems.score.value):void e.draw()}},i.prototype.reportScore=function(t){e.currentScore=t},i.prototype.reportHit=function(t){e.hit=t>0?!0:!1,e.score=t},i.prototype.setupGuess=function(t){for(var i=[],r=0;r<t.length;r++){var s=[Math.round(t[r].value[0].value),e.dimY-Math.round(t[r].value[1].value)],n=new o.ParabolicPoint(s,"white",3);i.push(n)}return i},i.prototype.projectileCallback=function(t){if(!e.shooting){var i=t.elems.points.value;e.projectileArray=[];for(var r=0;r<i.length;r++){var s=[Math.round(i[r].value[0].value),e.dimY-Math.round(i[r].value[1].value)],n=new o.ParabolicPoint(s,"white",3,!0);e.projectileArray.push(n)}e.fire()}},i.prototype.updateCallback=function(t){e.draw()},i.prototype.resetFire=function(){e.shooting=!1,e.hit=!1,e.shot=!1,$(".fire").addClass("hidden"),$(".hit-text").addClass("hidden"),$(".miss-text").addClass("hidden")},i.prototype.newGameButton=function(){e.ws.newGame(e.flows["current-score"])},i.prototype.newGame=function(){e.notifications.removeAll(),e.resetFire(),e.draw(),$(".score").text(0)},$(".reset-btn").click(function(){clearTimeout(e.timeoutId),e.resetFire(),e.draw()}),$(".new-game-btn").click(function(){e.newGameButton()})}(this),function(t){var e,o=t.ProjectileMotion=t.ProjectileMotion||{},i=o.Notifications=function(){this.notifications=[],this.id=0,e=this,this.newGameCheck};i.prototype.remove=function(t,e){$("#"+t).fadeOut("fast",function(){$("#"+t).remove(),e&&e()})},i.prototype.removeAll=function(){for(var t=0;t<this.notifications.length;t++){var e=this.notifications[t];t==this.notifications.length-1?this.remove(e,this.newGame):this.remove(e)}0!==this.notifications.length||this.newGameCheck||(this.newGameCheck=!0,this.newGame())},i.prototype.newGame=function(){e.notifications=[],console.log(e.newGameCheck),console.log(e.notifications),e.add(0,0,!0,function(){e.newGameCheck=!1,console.log(e.notifications)})},i.prototype.add=function(t,o,i,r){var s=this.mkId();this.notifications.push(s);var n=this.makeNotification(t,o,i,r);if($(".events").prepend(n),this.notifications.length>5){var a=this.notifications.shift();this.remove(a,function(){e.showNew(s,r)})}else this.showNew(s,r)},i.prototype.showNew=function(t,e){$("#"+t).fadeIn("fast",e)},i.prototype.makeNotification=function(t,e,o){e=e||0;var i='<li class="event jquery-hidden alert ';return 0==t?i+="alert-info":0>t?i+="alert-danger":t>0&&(i+="alert-success"),i+='" role="alert"',i+='id="'+this.id+'">',o&&(i+="<strong>New Game<strong><br>"),i+="Score: "+t,i+="<br>",i+="Total Score: "+e,i+="</li>"},i.prototype.mkId=function(){return this.id++,this.id}}(this),function(t){var e=t.ProjectileMotion=t.ProjectileMotion||{},o=e.ParabolicPoint=function(t,e,o,i){this.pos=t,this.color=e||"white",this.radius=o||4,this.fill=i};o.prototype.draw=function(t){t.strokeStyle=this.color,t.beginPath(),t.arc(this.pos[0],this.pos[1],this.radius,0,2*Math.PI,!1),this.fill&&(t.fillStyle=this.color,t.fill()),t.stroke()}}(this),function(t){var e,o=t.ProjectileMotion=t.ProjectileMotion||{},i=o.Websockets=function(t,o,i){this.auth=t,this.subscriptions=o,this.msgCallback=i,this.connection,e=this};i.prototype.newGame=function(t){this.connection.send(this.newGameMsg(t))},i.prototype.newGameMsg=function(t){return JSON.stringify({msgId:"newGame",object:"drop",type:"create",flowId:t,value:{elems:{score:0,newGame:!0}}})},i.prototype.heartbeatWS=function(){e.connection.send(e.heartbeatMessage()),console.log("WS Heartbeat")},i.prototype.heartbeatMessage=function(){return JSON.stringify({type:"heartbeat"})},i.prototype.subscribeFlow=function(t){return JSON.stringify({msgId:"subscribe_device",object:"drop",type:"subscribe",flowId:e.subscriptions[t]})},i.prototype.subscribeFlows=function(){for(var t=0;t<e.subscriptions.length;t++)e.connection.send(e.subscribeFlow(t))},i.prototype.onConnect=function(){setInterval(e.heartbeatWS,1e4);e.subscribeFlows()},i.prototype.onMessage=function(t){var o,i=JSON.parse(t.data);if(i.value)o=i.value;else{if(!i.body)return;o=i.body}_.isEmpty(o)||e.msgCallback(o)},i.prototype.connect=function(t){var e=this;request=$.ajax({url:"https://ws.flowthings.io/session",beforeSend:function(t){t.setRequestHeader("X-Auth-Token",e.auth.token),t.setRequestHeader("X-Auth-Account",e.auth.account),t.withCredentials=!0},type:"post",dataType:"json",success:function(t){var o=t.body.id,i="wss://ws.flowthings.io/session/"+o+"/ws",r=e.connection=new WebSocket(i);r.onopen=e.onConnect,r.onmessage=e.onMessage,r.onerror=function(t){console.log("WebSocket Error "+t)}},error:function(t,e,o){console.log(t),console.log(e),console.log(o)}})}}(this),function(t){var e=t.ProjectileMotion=t.ProjectileMotion||{},o=e.Target=function(t,e,o,i){this.pos=[t,e],o=[].concat(o),i=[].concat(i),this.color=[o[0]||"green",o[1]||"yellow",o[3]||"red"],this.colorHit=[i[0]||"yellow",i[1]||"red"],this.radius=24};o.prototype.draw=function(t,e){e=e||this.color;for(var o=1,i=0;i<e.length;i++)this.drawPart(t,e[i],this.radius/o),o*=2},o.prototype.drawPart=function(t,e,o){t.strokeStyle=e,t.beginPath(),t.arc(this.pos[0],this.pos[1],o,0,2*Math.PI,!1),t.fillStyle=e,t.fill(),t.stroke()},o.prototype.hit=function(t){this.draw(t,this.colorHit)}}(this);
// Titles stay concise on the map; the same full memory is shown on pickup and in the album.
chapters[6].memoryDetails=[
 '在 UNIQLO 的日子，魚魚練成了折衣服高手：攤平、對齊、摺好，一件件衣服整整齊齊地歸位。比起摺出漂亮的衣服，更開心的是替顧客提供建議後，收到一句真心的「謝謝」。原來幫上別人的忙，會讓一天的疲累都輕一點。',
 '在 inooknit 賣鞋的回憶，除了陪顧客挑到合腳的鞋，也少不了好吃的補給。員工餐的鐵板燒、中午的繼光香香雞，還有 31 冰淇淋，都是工作日裡值得期待的小確幸。認真上班，也要認真吃飯、好好犒賞自己。',
 '在 BigByte 當小老師，每天都像帶著一群精力用不完的小蘿蔔闖關。不聽話、愛分心的時候，還是得拿出老師的氣勢：「先坐好，聽我說！」該提醒就提醒、該立規矩就立規矩，教英文之外，也練出了讓小蘿蔔們收心的本事。'
];
chapters[7].memoryDetails=[
 '「怎麼有人把內褲掛在我的曬衣架上？也太噁心了吧！」原本只是要曬衣服，卻碰上讓人滿頭問號的宿舍插曲。共用生活空間，也要尊重別人的物品與界線啊！這一幕，實在讓人很難忘記。',
 '和一群朋友一起夜唱，恍惚間像又回到大學時代。輪流點歌、一起合唱，原來到了這個階段，還能遇見這樣新鮮又熱鬧的夜晚。果然，社交也有它的快樂；不必勉強自己每場都到，但也不用把所有邀約都推開。',
 '感冒的時候，才發現身邊有這麼多人惦記著自己。一句「還好嗎？」、一句「多休息」，都讓不舒服的日子暖了一點。原來在新的環境裡，也已經有人把魚魚放在心上。被大家關心著，真的好感動。',
 '怪阿姨老師彬彬姊，是學院生活裡很有存在感的一號人物。至於上課的生存守則？魚魚默默記下一句：「別讓彬彬姊不開心。」光是提起這個名字，就很有畫面；這份獨特的課堂回憶，也一起收進收藏冊。'
];
// Completed chapters reconstruct collections from old saves; partial collections stay current.
function memoryEntries(ch){const c=chapters[ch];return c.type==='collect'?c.items:[c.result]}
function memoryUnlocked(ch,i){return ch<state.done||(ch===state.chapter&&chapters[ch].type==='collect'&&collected().has(i))}
function panelElement(tag,cls,text){const el=document.createElement(tag);el.className=cls;if(text!==undefined)el.textContent=text;return el}
function panelButton(label,action,cls='choice'){const b=panelElement('button',cls,label);b.type='button';b.onclick=action;return b}
const showBeforeCards=show;
show=function(...args){$('.dialogue').classList.remove('status-panel');showBeforeCards(...args)};
function returnToCollection(){openStatus('collection')}
function readMemory(ch,i){
 if(!memoryUnlocked(ch,i))return;
 if(ch===0&&i===2){showIceMemory();$('#next').textContent='返回收藏冊';$('#next').onclick=returnToCollection;return}
 show(chapters[ch].icon+' '+chapters[ch].title,memoryEntries(ch)[i]+(chapters[ch].memoryDetails?.[i]?'\n\n'+chapters[ch].memoryDetails[i]:''),[{text:'返回收藏冊',run:returnToCollection}]);
 $('#taskInfo').textContent='已收藏 · 可隨時重看';
}
openStatus=function(section='status'){
 if(section==='badges'||section==='journal')section='collection';update();
 show('冒險手帳','');$('.dialogue').classList.add('status-panel');$('#story').textContent='';
 const area=$('#activity');area.className='status-content';
 const nav=panelElement('nav','status-nav');nav.setAttribute('aria-label','狀態選單');
 for(const [key,title] of [['status','冒險狀態'],['quest','目前任務'],['collection','回憶收藏冊']]){const b=panelButton(title,()=>openStatus(key),'status-tab');b.setAttribute('aria-pressed',String(key===section));nav.append(b)}area.append(nav);
 if(section==='status'){
  const hero=panelElement('div','status-hero');hero.append(panelElement('small','','FISH’S ADVENTURE'),panelElement('h2','','魚魚的冒險'),panelElement('p','',state.chapter===chapters.length?'三十歲 · 冒險仍在繼續':$('#role').textContent));area.append(hero);
  const grid=panelElement('div','status-grid');
  for(const [name,value,sub] of [['♥ 生命','100 / 100','今天也照顧好自己'],['💰 金錢',(state.money||0).toLocaleString('zh-TW'),'林狗狗銀行隨時支援'],['♡ 幸福度',(state.happiness??50).toLocaleString('zh-TW'),state.metCompanion?'幸福爆表 · 學長陪伴中':'等待旅途中的相遇'],['✦ 成長','LV. '+Math.round(state.done/chapters.length*30),state.done*100+' EXP']]){const card=panelElement('div','stat-card');card.append(panelElement('span','',name),panelElement('strong','',value),panelElement('small','',sub));grid.append(card)}area.append(grid);
  const progress=panelElement('div','journey-progress');progress.append(panelElement('p','',`旅程進度 · ${state.done} / ${chapters.length} 章`));const meter=document.createElement('progress');meter.max=chapters.length;meter.value=state.done;meter.setAttribute('aria-label','章節完成進度');progress.append(meter,panelElement('small','',$('#location').textContent));area.append(progress);
  area.append(panelButton('♫ 音樂與音效',audioSettings),panelButton('重新開始冒險',confirmRestart,'choice restart-adventure'));
 }else if(section==='quest'){
  area.append(panelElement('h2','panel-heading',state.chapter===chapters.length?'生日慶典':current().title),panelElement('p','quest-card',$('#quest').textContent.replaceAll('按 E','按「互動」')));
  if(state.chapter<chapters.length)area.append(panelElement('p','panel-note',state.chapter===3?'依照任務提示，和故事中的人物聊聊，慢慢做出自己的決定。':state.chapter===4||state.chapter===5?'這一站沒有標準答案。選一句現在最想送給自己的話，慢慢聊就好。':'挑戰採情境題與知識題；答錯可看提示再試，離開對話後可重新挑戰。'));
 }else{
  area.append(panelElement('h2','panel-heading','那些走過的日子'),panelElement('p','panel-note','回憶拾起後即可重看；完成章節後收藏稱號與旅程紀念。'));
  for(let ch=0;ch<=Math.min(state.chapter,chapters.length-1);ch++){
   const c=chapters[ch],entries=memoryEntries(ch),unlocked=entries.filter((_,i)=>memoryUnlocked(ch,i)).length;
   const chapter=panelElement('section','album-chapter');chapter.append(panelElement('h3','',`${c.icon} ${c.title}`),panelElement('small','',`${c.age} · 收藏 ${unlocked} / ${entries.length}`));
   if(ch<state.done)chapter.append(panelElement('p','title-ribbon','✦ '+(c.awardedTitle||c.badge)));
   const cards=panelElement('div','memory-grid');entries.forEach((entry,i)=>{
    const available=memoryUnlocked(ch,i);const b=panelButton(available?entry:'✧ 尚未找到的回憶',()=>readMemory(ch,i),'memory-card');b.disabled=!available;
    if(available&&ch===0&&i===2){const photo=document.createElement('img');photo.src='images/xinfating.webp';photo.alt='辛發亭店面';photo.loading='lazy';b.prepend(photo)}cards.append(b);
   });chapter.append(cards);if(ch<state.done){const questions=ch===2?[...universityQuestions.law,...universityQuestions.accounting]:challengeBank[ch];if(questions)chapter.append(panelButton(ch===4||ch===5?'重溫暖心對話':'重溫挑戰',()=>challenge(questions,c.title,returnToCollection),'choice replay-challenge'))}area.append(chapter);
  }
  if(state.chapter<chapters.length-1)area.append(panelElement('p','album-locked','✧ 下一段故事，等妳親自探索。'));
  if(state.wishCompleted)area.append(panelElement('div','title-ribbon','🎂 三十歲生日願望 · 已收藏祝福'));
 }
 $('#taskInfo').textContent='冒險進度自動保存';$('.dialogue').scrollTop=0;
};
// Questions use plausible alternatives, shuffled choices and explanatory feedback.
const challengeBank={
0:[['社子島位於哪兩條河流交會一帶？',['淡水河與基隆河','新店溪與景美溪','大漢溪與景美溪'],0,'社子島位於淡水河與基隆河交會一帶。'],['哪一組最符合這段童年回憶？',['家庭代工造型筆、辛發亭巧克力醬冰','校園社團、豪小小雞排','會計報表、便利商店咖啡'],0,'童年回憶包含造型筆代工與士林夜市辛發亭的巧克力醬冰。'],['魚魚的法官夢，是從什麼開始萌芽？',['電視上關於法官的新聞、報導與節目','一部固定叫作《正義法官》的影集','大學會計課的報表練習'],0,'是多種法官相關新聞與節目，並不是某部名為《正義法官》的影集。']],
1:[['臺北市立中正高中位在哪個行政區？',['北投區','士林區','中正區'],0,'校名不等於行政區；臺北市立中正高中位於北投區。'],['哪一個才是中正高中的學校網域？',['ccsh.tp.edu.tw','ck.tp.edu.tw','nccu.edu.tw'],0,'中正高中使用 ccsh.tp.edu.tw；NCCU 是政治大學。'],['依剛才的校園地圖，哪一組建築都出現過？',['至聖樓、格致樓、迎曦樓','四維堂、果夫樓、志希樓','至聖樓、果夫樓、四維堂'],0,'本章校園呈現至聖樓、格致樓與迎曦樓；另一組是政大的場景。']],
4:[['今天讀得有點累了，想怎麼照顧自己？',['先休息一下，吃點喜歡的東西','把目標縮小，慢慢完成今天的一小步'],0,'休息不是偷懶，慢一點也沒有關係。盡力就好，開心讀書最重要。'],['當進度沒有跟上計畫，想對自己說什麼？',['今天已經很努力了，明天再調整','不用和別人比，我有自己的步調'],0,'備考不是每天都要滿分。願意調整、願意再試一次，就已經是在往前走。'],['睡前，想送給今天的自己哪一句話？',['謝謝妳，今天也沒有放棄自己','先好好睡一覺，明天再一起努力'],0,'這一年半，是許多小小的努力累積起來的。妳不用獨自撐著，學長會陪妳走這段路。']],
5:[['看到考上的消息，最想先對自己說什麼？',['我做到了，真的做到了！','謝謝那個一直努力的自己'],0,'那些翻過的書、走過的低潮，都有了回音。這一刻，妳可以大方地為自己驕傲。'],['終於可以鬆一口氣，想怎麼慶祝？',['吃一頓喜歡的，和重要的人分享喜悅','好好睡到飽，讓自己安心休息'],0,'怎麼慶祝都好，今天不必急著安排下一個目標。先把這份開心，好好留給自己。'],['面對接下來的新旅程，想帶上哪一句祝福？',['願我記得，自己比想像中更有力量','願我繼續努力，也記得溫柔對待自己'],0,'我就知道妳可以考上！林狗狗銀行的眼光可是很準的。往後的路，不管遇到什麼，我都會陪著妳。']],
6:[['UNIQLO：定價 1,200 元，打八折後再折 100 元，應付多少？',['860 元','880 元','960 元'],0,'先算 1,200×0.8＝960，再減 100，得到 860。'],['inooknit：客人說鞋長合適，但前掌擠壓，應先怎麼做？',['確認腳寬與壓迫位置，再找合適鞋楦或尺寸','一律加大兩號，不必再試穿','告訴客人所有鞋都會越穿越寬'],0,'尺寸不只看長度，也要考慮腳寬、鞋楦與實際舒適度。'],['BigByte：孩子能跟讀卻無法自行回答，下一步怎麼引導？',['提供圖片與句型提示，再逐步減少協助','直接要求背完整篇文章','持續替他回答以避免挫折'],0,'先提供適量提示，再逐步撤除，幫助孩子建立獨立表達能力。']],
7:[['案例討論中，兩個案件結論不同，應先比較？',['關鍵事實、爭點與適用規範','哪個結論較受歡迎','哪份判決篇幅比較長'],0,'事實差異與法律爭點可能導致不同結論，不能只看結果。'],['收到一份支持原判斷的新資料，最穩健的作法是？',['檢查來源可信度，也尋找相反證據','因為支持自己就直接採用','只問同意自己的人'],0,'避免確認偏誤，要同時檢驗來源及相反證據。'],['訓練討論涉及個案資訊，分享筆記時應如何處理？',['依保密規範處理，移除不必要的識別資訊','換個群組就可以完整轉貼','只刪姓名，其他內容一律公開'],0,'匿名不只刪姓名，其他資訊也可能識別當事人，仍須遵守保密規範。']]
};
universityQuestions.law=[['依臺灣民法，自然人的權利能力何時開始？',['出生','滿十八歲','完成戶籍登記'],0,'民法第六條：人的權利能力始於出生，終於死亡。'],['甲乙對商品與價金意思一致，一般而言契約成立的核心是？',['雙方意思表示一致','一定先完成付款','一定由法院核准'],0,'一般契約以意思表示一致為核心；特定契約另有要式等規定。'],['依現行臺灣民法，幾歲為成年？',['十八歲','二十歲','十六歲'],0,'自 2023 年起，民法成年年齡為十八歲。']];
universityQuestions.accounting=[['資產 120,000、負債 45,000，權益是多少？',['75,000','165,000','45,000'],0,'資產＝負債＋權益，所以權益＝120,000－45,000。'],['以現金收回先前的應收帳款，對總資產有何影響？',['總額不變','增加','減少'],0,'現金增加、應收帳款減少，資產內部轉換，總額不變。'],['預付未來三個月租金時，尚未耗用部分通常應列為？',['資產','當期全部費用','負債'],0,'尚未耗用的預付租金代表未來經濟效益，先列資產，再隨期間轉列費用。']];
function challenge(questions,speaker,onComplete,index=0,correct=0){
 if(questions===challengeBank[4]||questions===challengeBank[5]){warmConversation(questions,speaker,onComplete,index);return}
 if(index>=questions.length){show(speaker,`挑戰完成！首次作答答對 ${correct} / ${questions.length} 題。\n每次釐清觀念，都是一次成長。`,[{text:'收下成果',run:onComplete}]);return}
 const [question,answers,right,explanation]=questions[index];
 const options=answers.map((label,i)=>({label,i}));for(let i=options.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[options[i],options[j]]=[options[j],options[i]]}
 let attempted=false;
 const render=()=>{show(speaker,`挑戰 ${index+1} / ${questions.length}\n${question}`,options.map(({label,i})=>({text:label,run:()=>{
  const isCorrect=i===right;const score=correct+(isCorrect&&!attempted?1:0);attempted=true;
  show(speaker,(isCorrect?'✓ 答對了！':'再想一想：')+'\n'+explanation,[{text:isCorrect?'下一題':'重新作答',run:()=>isCorrect?challenge(questions,speaker,onComplete,index+1,score):render()}]);if(isCorrect)tone(780);
 }})));$('#taskInfo').textContent='情境挑戰 · 選項順序隨機 · 可重試'};render();
}
encounter=function(){challenge(challengeBank[state.chapter]||encounters[sceneChapter()].questions,npcNames[state.chapter],complete)};
universityTalk=function(subject){
 const name=subject==='law'?'法律系老師':'會計系老師';
 if(finished()){show(name,'雙主修的實力，已經留在收藏冊裡了。');return}
 if(collected().size<current().items.length){show(name,'先找回兩份校園回憶，再來挑戰大一基礎應用題。');return}
 if(passedSubjects().has(subject)){show(name,'這科已通過，去找另一位老師吧。');return}
 challenge(universityQuestions[subject],name,()=>{state.universityPassed=[...passedSubjects(),subject];save();update();if(passedSubjects().size===2)complete();else show(name,'這一科通過了！去找另一位老師繼續挑戰。')});
};
const questTalk=talkNPC;talkNPC=function(){if(state.chapter===5&&!finished()){encounter();return}questTalk()};
// These two chapters celebrate care and growth: every choice is valid, with no score.
function warmConversation(questions,speaker,onComplete,index=0){
 if(index>=questions.length){show(speaker,'把這份溫暖收進回憶，帶著自己的步調繼續前進。',[{text:'收下這份鼓勵',run:onComplete}]);return}
 const [question,answers,,message]=questions[index];
 show(speaker,question,answers.map(answer=>({text:answer,run:()=>show(speaker,message,[{text:index===questions.length-1?'收下祝福':'繼續聊聊',run:()=>warmConversation(questions,speaker,onComplete,index+1)}])})));
 $('#taskInfo').textContent='暖心對話 '+(index+1)+' / '+questions.length+' · 每個選擇都值得被接住';
}
// NTT story: discover CMB → meet → date → rejection → encouragement → resignation.
const cmbSpot={x:7,y:12};
try{
 const saved=JSON.parse(localStorage.getItem('fish-rpg-v3'));
 if(Number.isInteger(saved?.nttStory)&&saved.nttStory>=0&&saved.nttStory<=5)state.nttStory=saved.nttStory;
 else state.nttStory=state.done>3?5:state.nttStage===2?4:state.nttStage===1?3:state.metCompanion?2:0;
}catch{state.nttStory=0}
function nttStep(){return state.nttStory||0}
function advanceNTT(stage){state.nttStory=Math.max(nttStep(),stage);save();update()}
companionVisible=function(){return state.chapter>=3&&state.chapter<chapters.length&&(state.chapter!==3||nttStep()>=1)};
chapters[3].story='辦公室裡，主管的挑剔讓日常多了些疲憊。下班路上，一個 CMB 的小小入口，將帶來意想不到的相遇。';
chapters[3].hint='發現 CMB → 與學長交往 → 被主管否定 → 得到鼓勵 → 勇敢辭職';
const beforeCMBArt=sceneArt;
sceneArt=function(t){beforeCMBArt(t);if(state.chapter!==3||nttStep()>0)return;const x=cmbSpot.x*T,y=cmbSpot.y*T;rr(x+5,y-8,24,38,'#345b52',4);rect(x+8,y-3,18,26,'#e6dfc2');text('♡',x+17,y+16,'#b76d78',15);text('CMB · 一段新的相遇',x+17,y-24,'#fff0c4',12)};
const beforeCMBInteract=interact;
interact=function(){if(!dialog&&state.chapter===3&&nttStep()===0&&near(cmbSpot)){show('☕ CMB','下班路上，打開 CMB 交友軟體。也許，一段新的緣分就從這裡開始。',[
 {text:'打開 CMB，認識學長',run:()=>{advanceNTT(1);show('♡ 新的相遇','配對成功！學長出現在街角，去和他打聲招呼吧。')}},
 {text:'晚點再看看',run:close}
]);return}beforeCMBInteract()};
$('#talk').onclick=interact;
const beforeCMBUpdate=update;
update=function(){beforeCMBUpdate();$('.companion').style.display=state.chapter<3||(state.chapter===3&&nttStep()<2)?'none':'';if(state.chapter===3&&!finished())$('#quest').textContent=[
 '✦ 任務：在下班路上找到 CMB，開啟一段新的相遇。',
 '♡ 任務：學長出現了，去和他聊聊。',
 '♡ 任務：有了學長的陪伴，向主管說說離職備考的想法。',
 '✦ 任務：被主管否定了，去找學長聊聊心情。',
 '✦ 任務：收下學長的鼓勵，回去向主管說出辭職的決定。'
 ][Math.min(4,nttStep())]};
const beforeCMBHint=draw;
draw=function(t){beforeCMBHint(t);if(state.chapter===3&&nttStep()===0&&near(cmbSpot))$('#hint').textContent=mobileView.matches?'按「互動」・打開 CMB':'[ E / 空白鍵 ] 打開 CMB'};
talkSupervisor=function(){
 if(finished()){show('機車主管','……既然決定了，就把交接做好。');return}
 if(nttStep()<2){show('機車主管',nttStep()===0?'這點事情還要我提醒？動作快一點，別讓我一直盯著。':'不要以為下班了就能鬆懈，明天的工作還是要準時完成。');return}
 if(nttStep()===2){show('機車主管','有什麼事？',[
 {text:'魚魚：我想離職，專心準備考試。',run:()=>{advanceNTT(3);show('機車主管','考試哪有那麼容易？別想太多了，快點找個有錢人嫁掉比較實在。',[{text:'先去找學長聊聊',run:close}])}}
 ]);return}
 if(nttStep()===3){show('機車主管','還在想考試？我不是說了，別把事情想得太簡單。');return}
 show('機車主管','怎麼，又有什麼事？',[
 {text:'魚魚：老子不幹了，要離職備考！',run:()=>{advanceNTT(5);state.nttStage=3;complete()}}
 ]);
};
const companionBeforeCMB=talkCompanion;
talkCompanion=function(){
 if(state.chapter!==3){companionBeforeCMB();return}
 if(nttStep()===0)return;
 if(nttStep()===1){show('♡ 魚魚的心意','從 CMB 的第一句招呼，到越聊越投緣，魚魚發現自己越來越期待和學長聊天。\n這一次，要不要鼓起勇氣，主動跟學長告白？',[
 {text:'跟學長告白：我喜歡你 ♡',run:()=>{advanceNTT(2);meetCompanion();show('♡ 告白成功','魚魚鼓起勇氣：「學長，我喜歡你。」\n學長笑著回應：「我也喜歡妳。接下來的日子，讓我們一起走吧。」\n魚魚與學長正式交往，幸福度滿點！')}},
 {text:'再聊聊，晚點決定',run:close}
 ]);return}
 if(nttStep()===3){show('✦ 守護神・學長','想為自己的夢想努力，一點也不可笑。別讓別人的否定，替妳決定未來。\n「不管結果如何，我都會陪著妳。」',[
 {text:'收下鼓勵，回去說出辭職的決定',run:()=>{advanceNTT(4);close()}}
 ]);return}
 show('✦ 守護神・學長',nttStep()===2?'能遇見妳，真好。工作也好、未來的打算也好，都可以慢慢和我說。':nttStep()===4?'不用害怕，妳已經想清楚了。去說出自己的決定，我會在這裡等妳。':'接下來的備考日子，也讓我陪著妳。盡力就好，開心讀書最重要！');
};
update();

// Birthday conversations are personal preferences expressed as mutual care.
const companionTopics={
  "whispers": {
    "title": "給妳的悄悄話",
    "intro": "有些心裡話，想慢慢說給妳聽。妳不用急著回應，照自己安心的步調讀就好。",
    "items": [
      [
        "在我面前，可以柔軟",
        "我知道，成長過程裡，妳並不總能得到需要的理解與肯定。面對質疑或不被認同時，也許妳會下意識地豎起防備，用強硬的語氣回應，急著反駁、不願退讓。那可能是妳一路學會保護自己的方式：先把自己撐住，才有力氣繼續努力。這一路，妳辛苦了。\n\n謝謝妳願意讓我走近妳的生活。我想慢慢理解那份強硬底下，可能藏著的受傷與委屈。在學長面前，妳可以不用每次都把自己撐得那麼硬。想哭就哭，想撒嬌就撒嬌；難過時，可以說「這句話讓我受傷了」，也可以只是說「我想要你抱抱我」。\n\n妳不用裝作沒有受傷，也不用擺出毫不在乎的樣子，來藏住其實很在意的心情。看見妳的眼淚、委屈，或沒有把握的那一面，不會讓我覺得妳比較不好。如果妳願意讓我知道，我會珍惜這份信任；還沒準備好說，也沒有關係。\n\n如果讓妳受傷的人是我，妳也可以告訴我。我會練習先聽懂，而不是急著辯解。妳不用一下子卸下所有防備，我也會用相處中的行動，慢慢讓妳相信：在這裡，妳可以安心做自己。"
      ],
      [
        "把休息也排進計畫",
        "我喜歡妳認真生活的樣子。讀書、運動、和朋友相處，妳有好多想投入、想做好的事情。謝謝妳也願意在忙碌的日子裡留時間給我，讓我們一起分享生活。\n\n只是，有時候讀書、運動、社交和其他安排全擠在一起，生活幾乎沒有喘息的空間。看著妳累了還想撐住，身體不舒服、甚至又生病，我真的會心疼。比起每件事都有做到，我更希望妳有精神、有餘裕，能舒服地過日子。\n\n我希望休息不是所有事情做完後，有剩下時間才輪得到的事，而是原本就值得排進生活的一部分。今天少做一點、少赴一個約，或把運動改得輕鬆一些，都沒有關係。妳不需要把每一天塞得很滿，才能算是認真生活。\n\n我也會留意自己的安排，和妳一起把步調調整得舒服一點。謝謝妳願意讓我關心妳；如果累了，可以放心告訴我，不用怕掃興。我想陪妳走很長的路，所以更希望我們都能好好照顧自己，留著力氣慢慢享受生活。"
      ],
      [
        "小小的失誤，多一點體諒",
        "謝謝妳願意和我一起經營這段感情。我知道，我也有說錯話、沒想周全，或做得不夠好的時候。妳願意告訴我感受，讓我有機會理解與調整，這對我很重要。\n\n對我來說，親密關係裡除了道理，也需要心疼與體諒。我們是在談感情，所以在急著釐清誰對誰錯之前，我更希望先記得：眼前是自己喜歡、想長久相伴的人。有些小失誤，從道理上看確實做得不妥，但相愛的兩個人，也可以多留一點理解，不必每次都用嚴厲的批評，才能讓對方知道哪裡需要改變。\n\n做錯的地方，仍然需要承認、道歉和修補；但如果不是嚴重的傷害，或一再忽視說好的界線，我希望我們不急著把一次失誤，變成對整個人的否定。先關心彼此的感受，再一起把事情說清楚，道理會比較容易被聽見，心也不必因此離得更遠。\n\n受傷、失望時會生氣，是很自然的，不用勉強自己立刻笑著說沒事。只是提高音量責難，或一直帶著怒氣相對，常會讓人更緊繃、更想防備，反而聽不懂對方真正難受的是什麼。情緒太滿時，我們可以先緩一緩，約好再回來聊，把力氣用在「接下來怎麼改善」。\n\n我也會提醒自己，妳的委屈不能被一句「要體諒我」帶過。謝謝妳願意和我一起磨合；我想回應這份心意，讓妳能安心說出受傷，也能放心承認失誤。往後一起生活，我們不一定每次都做得漂亮，但可以一次次把彼此好好放回心上。"
      ]
    ]
  },
  "likes": {
    "title": "學長喜歡的相處時光",
    "intro": "和妳相處時，有些小小的溫柔，會讓我覺得特別安心，也想好好珍惜。",
    "items": [
      [
        "好好說話的溫柔",
        "我很喜歡我們能安心說話的感覺。可以分享開心，也可以坦白說出不舒服，不必先猜對方會不會生氣。謝謝妳願意讓我知道妳的想法，也讓我有機會更懂妳。\n\n我對大聲責備、訓話的語氣比較容易緊繃，有時越急著回應，反而越說不清楚。如果我們能放慢一點、輕聲一點，我會比較能把真正想說的話告訴妳。\n\n有情緒不用藏著，說不下去時也可以先休息。我也會記得，溫柔不是只在開心時才有，而是在有分歧的時候，仍願意顧著妳的感受。希望我們都能喜歡和對方聊天，不只是因為聊得來，也因為知道自己會被好好對待。"
      ],
      [
        "像百變怪一樣，一起靈活調整",
        "我很珍惜遇到分歧時，我們還願意回來找彼此，把話慢慢說清楚。謝謝妳願意告訴我心裡的感受，也願意留一點空間，聽聽我的想法。\n\n我喜歡我們能像百變怪一樣，有一點靈活調整的本事。原本的方法不適合，就換個方式試試；發現彼此的需要不同，也願意重新找一個都舒服的做法。不必把自己變成另一個人，而是保有自己的樣子，也留一些彈性給我們的關係。\n\n兩個人的習慣不同，本來就需要時間磨合。我不想讓改變總是落在妳身上，我也會練習調整，分清楚哪些地方可以改、哪些差異可以接納。\n\n妳為我們付出的心意，我想多看見、多說謝謝；我答應妳的小改變，也會努力做到。我很喜歡「我們一起想辦法」的感覺，因為那讓我知道，遇到事情時，我們可以一起變通、一起往前走。"
      ],
      [
        "有來有回，聊得舒服",
        "我喜歡聽妳分享感興趣的事情，也喜歡妳帶我接觸新的想法和體驗。謝謝妳願意把那些讓妳開心、好奇或在意的小世界帶給我，讓我有機會看見妳眼中的生活。\n\n對我來說，舒服的交流，是我們都能參與，也都能調整步調。有時候話題持續往前，或相處的節奏一直由一個人帶著走，我會有點跟不上，卻不知道該在哪裡插話、怎麼提出暫停。即使累了或不太舒服，也可能因為怕打斷妳、讓妳掃興，而沒有及時說出來。\n\n這也和我不太擅長表達自己的狀態有關，我正在努力改進。我會練習早一點說「讓我消化一下」「我想休息一會兒」，或「我也有個想法想說」，不讓妳只能靠猜的來了解我。\n\n也謝謝寶貝，很多時候妳會注意到我有點不一樣，主動問我是不是累了、哪裡不舒服。那些被妳發現、被妳關心的時刻，我有放在心上，會覺得自己是被照顧著的。\n\n我們都可以偶爾停一下，留點空間讓對方回應，看看彼此有沒有跟上、現在的步調舒不舒服。我也會同樣留意妳。妳不用收起分享的開心，我們一起找個有來有回、都能自在參與的節奏，慢慢聊、慢慢走就好。"
      ],
      [
        "可以不同意，仍然尊重",
        "我很珍惜妳有自己的想法，也謝謝妳願意讓我知道妳怎麼看事情。能聽見和自己不同的觀點，有時會讓我看見原本沒注意到的地方。\n\n我們不一定每件事都想得一樣。我想先理解妳，也希望自己的想法能被聽見，不必爭到其中一個人認輸，才能結束對話。有時多問一句「你為什麼這樣想？」就可能發現，彼此其實在意的是不同的事情。\n\n需要一起決定的事，我們慢慢找共識；不影響彼此的差異，也可以保留。我也會提醒自己，不把妳的不同意當成不支持。能坦白表達，又仍然感受到被尊重，是我很想和妳一起擁有的自在。"
      ]
    ]
  },
  "values": {
    "title": "學長在意的小細節",
    "intro": "有幾件事，我比較放在心上，想讓妳多了解我一點。這些是我的感受與期待，也想聽聽妳怎麼想。謝謝妳願意認識這些有點彆扭、但也是我的一部分。",
    "items": [
      [
        "私密的事，先問過彼此",
        "妳願意把心事告訴我，我很珍惜。我也希望我們之間有些話、有些親密的小故事，可以安心地留在兩個人之間，不必擔心哪天突然成為別人的話題。\n\n我對隱私比較在意，尤其在第三人或不熟的人面前，被提起私事時會不太自在。當著別人的面放閃、做比較親密的互動，我也會有點彆扭，不太知道怎麼自然地回應。那不是不喜歡妳，也不是不願意讓別人知道我們在一起，而是有些甜蜜，我更喜歡留在兩個人的時候，安心地慢慢享受。\n\n如果想分享和對方有關的私事，可以先問一聲；拿不準時，就先留著。親密互動也可以一起找個彼此都舒服的程度，讓妳感受到我的喜歡，也讓我能自在地回應妳。\n\n謝謝妳願意理解我這份有點害羞、有點彆扭的心情。我也會好好保護妳交給我的信任，尊重妳的界線，並用妳能感受到的方式表達在乎。"
      ],
      [
        "在外留尊重，私下說真話",
        "我很珍惜和妳站在一起的感覺。一起見朋友、認識新的人時，我希望我們都能感受到：身邊這個人知道自己的不完美，也仍然願意好好對待自己。\n\n學長其實也有一點偶包，會在意妳在別人面前怎麼對待我。有時一句想說得痛快的反駁、想顯得自己更懂的玩笑，或當著別人數落我哪裡做得不好，若讓我覺得被嗆、被貶低，甚至下不了台，我會難受。即使原本只是隨口一說，也可能讓我不知道怎麼接話，心裡留下不舒服。\n\n我希望我們都能替彼此留一點餘地，不用靠數落另一半來炒熱氣氛、贏得笑聲，或證明自己比較厲害。有不同意見，當然可以平和地表達，不必勉強附和；比較私密、容易讓人難堪的批評，就留到兩個人能好好說話時再談。\n\n我在意面子，不代表妳不能說真話。私下妳可以坦白告訴我哪裡讓妳不舒服，我會認真聽，也願意改。謝謝妳願意理解我這份有點彆扭的在意，我也會同樣顧著妳的感受與尊嚴，讓我們在外面有安心相伴的感覺，回到私下，也有坦白說話的空間。"
      ],
      [
        "有立場，也留一點餘地",
        "我欣賞妳有自己的原則，也在意事情公不公平。謝謝妳願意分享那些觀察，有時妳看見的細節，也會提醒我重新想一想。\n\n面對外界的人與事情，我希望我們都能保留一點好奇：會不會還有不知道的背景？是不是也有其他理解方式？先多了解一點，不急著替一個人下定論，或許能讓我們看得更完整。\n\n表達立場時，可以堅定，也可以讓對方有說話的餘地。我想和妳一起練習，把注意力放在「希望改善什麼」和「怎麼說比較能被理解」，而不只是誰的話比較有力。\n\n我也會提醒自己，承認不知道、發現原本想錯了，都沒有關係。我很珍惜能和妳交換想法的機會，也希望我們都能在對方面前自在地學習，不必每一次都證明自己是對的。"
      ]
    ]
  }
};
companionExtras=function(category){
 if(!state.wishCompleted)return;
 const topic=companionTopics[category];
 if(!topic){show('✦ 守護神・學長','還想多了解學長一點嗎？慢慢聊，我也想聽聽妳的想法。',[
  ...Object.entries(companionTopics).map(([key,topic])=>({text:topic.title,run:()=>companionExtras(key)})),
  {text:'回到生日祝福',run:finale}
 ]);return}
 show(topic.title,topic.intro,[...topic.items.map(([title,body])=>({text:title,run:()=>show('✦ 學長 · '+title,body,[
  {text:'返回'+topic.title.replace('？',''),run:()=>companionExtras(category)},
  {text:'其他話題',run:()=>companionExtras()}
 ])})),{text:'返回其他話題',run:()=>companionExtras()}]);
};

// Optional finale treasure hunt. IDs are saved separately from chapter memories.
const birthdayGifts=[
 {id:'teddy',name:'泰迪熊玩偶',icon:'🧸',x:4,y:15,clue:'西邊的小屋往南走，樹影裡好像藏著一位毛茸茸的朋友。',story:'找到泰迪熊玩偶！把柔軟的擁抱帶回家，累了的時候，就讓它陪妳休息。'},
 {id:'dachshund',name:'臘腸狗抱枕',icon:'🐕',x:21,y:16,clue:'往花園東南邊找找，樹叢旁有個長長的小傢伙。',story:'找到臘腸狗抱枕！長長的身體、短短的腿，是陪妳窩著放鬆的好夥伴。'},
 {id:'box',name:'禮物盒',icon:'🎁',x:27,y:6,clue:'沿著花園東邊往北探索，別漏掉靠近邊緣的樹蔭。',story:'找到禮物盒！把這份藏在角落的心意收好，願往後的日子也有值得期待的小驚喜。'},
 {id:'cake',name:'生日蛋糕',icon:'🎂',x:23,y:12,clue:'未來的小屋旁，屋簷外好像留著一份甜甜的驚喜。',story:'找到生日蛋糕！三十歲生日快樂，願妳每一年都能做喜歡的事，也被好好愛著。'}
];
try{const saved=JSON.parse(localStorage.getItem('fish-rpg-v3'));state.birthdayGifts=Array.isArray(saved?.birthdayGifts)?[...new Set(saved.birthdayGifts.filter(id=>birthdayGifts.some(g=>g.id===id)))]:[]}catch{state.birthdayGifts=[]}
function foundBirthdayGifts(){return new Set(state.birthdayGifts||[])}
function nearbyBirthdayGift(){return state.chapter===chapters.length?birthdayGifts.find(g=>!foundBirthdayGifts().has(g.id)&&near(g)):null}
function paintBirthdayGift(g,highlight=false){
 const x=g.x*T+8,y=g.y*T+12;
 if(highlight){ctx.fillStyle='#f7dda755';ctx.beginPath();ctx.ellipse(x+9,y+13,17,7,0,0,Math.PI*2);ctx.fill()}
 if(g.id==='teddy'){
  rect(x+3,y+5,13,14,'#ac805b');rect(x+2,y,15,11,'#c79d72');rect(x,y-2,5,6,'#ac805b');rect(x+14,y-2,5,6,'#ac805b');rect(x+5,y+4,2,2,'#403f35');rect(x+12,y+4,2,2,'#403f35');rect(x+7,y+7,5,3,'#e0c09a');rect(x,y+16,7,5,'#b48a65');rect(x+12,y+16,7,5,'#b48a65');
 }else if(g.id==='dachshund'){
  rect(x-4,y+7,25,9,'#b19068');rect(x+18,y+1,9,12,'#c7a87b');rect(x+18,y+2,4,10,'#846349');rect(x+25,y+5,2,2,'#403c33');rect(x,y+15,4,4,'#977452');rect(x+15,y+15,4,4,'#977452');
 }else if(g.id==='box'){
  rect(x,y+2,19,17,'#a87776');rect(x-1,y,21,5,'#bd9490');rect(x+8,y,4,19,'#d9c393');rect(x+3,y-4,6,4,'#d9c393');rect(x+12,y-4,6,4,'#d9c393');
 }else{
  rect(x-2,y+17,25,3,'#c8c5ad');rect(x,y+6,21,11,'#d9c4a5');rect(x,y+6,21,4,'#f2e1bd');rect(x+4,y+12,13,2,'#b8827d');rect(x+9,y,2,6,'#a38076');rect(x+9,y-3,2,3,'#e1bf7d');
 }
}
const sceneBeforeGifts=sceneArt;
sceneArt=function(t){sceneBeforeGifts(t);if(state.chapter===chapters.length)birthdayGifts.forEach(g=>{if(!foundBirthdayGifts().has(g.id))paintBirthdayGift(g)})};
const drawBeforeGifts=draw;
draw=function(t){drawBeforeGifts(t);const gift=nearbyBirthdayGift();if(gift){paintBirthdayGift(gift,true);text('✦ 發現 '+gift.name,gift.x*T+16,gift.y*T-8,'#ffe6a6',12);renderMapLabels();$('#hint').textContent=mobileView.matches?'按「互動」・收下'+gift.name:'[ E / 空白鍵 ] 收下'+gift.name}};
const interactBeforeGifts=interact;
interact=function(){const gift=!dialog&&nearbyBirthdayGift();if(!gift){interactBeforeGifts();return}state.birthdayGifts=[...foundBirthdayGifts(),gift.id];save();update();playEffect('happy');show(gift.icon+' '+gift.name,gift.story+'\n\n'+(foundBirthdayGifts().size===birthdayGifts.length?'四份生日禮物都找到了！這些心意，都可以從收藏冊隨時重看。':`已找到 ${foundBirthdayGifts().size} / ${birthdayGifts.length} 份禮物，其餘驚喜還藏在花園裡。`),[{text:'繼續探索',run:close},{text:'查看禮物收藏',run:()=>openStatus('collection')}])};
$('#talk').onclick=interact;
const updateBeforeGifts=update;
update=function(){updateBeforeGifts();if(state.chapter===chapters.length)$('#quest').textContent=`♡ 到廣場中央與學長對話，許下生日願望。\n🎁 自由尋寶：已找到 ${foundBirthdayGifts().size} / ${birthdayGifts.length} 份生日禮物。禮物藏在樹影與屋旁，靠近後按「互動」收下；不影響許願。`};
function giftClue(){const next=birthdayGifts.find(g=>!foundBirthdayGifts().has(g.id));show('✦ 花園尋寶線索',next?next.clue:'四份禮物都收好了，生日快樂！',[{text:'回到任務',run:()=>openStatus('quest')}])}
const statusBeforeGifts=openStatus;
openStatus=function(section='status'){
 statusBeforeGifts(section);if(state.chapter!==chapters.length)return;
 if(section==='quest')$('#activity').append(panelButton('需要一點尋寶線索',giftClue));
 if(['collection','journal','badges'].includes(section)){
  const album=panelElement('section','album-chapter');album.append(panelElement('h3','','🎁 生日花園的驚喜'),panelElement('small','',`已找到 ${foundBirthdayGifts().size} / ${birthdayGifts.length} 份禮物`));
  const grid=panelElement('div','memory-grid');for(const g of birthdayGifts){const found=foundBirthdayGifts().has(g.id),button=panelButton(found?g.icon+' '+g.name:'✧ 尚未找到的生日禮物',()=>show(g.icon+' '+g.name,g.story,[{text:'返回收藏冊',run:returnToCollection}]),'memory-card');button.disabled=!found;grid.append(button)}album.append(grid);$('#activity').append(album);
 }
};
update();

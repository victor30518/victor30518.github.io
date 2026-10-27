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
 likes:{title:'學長喜歡什麼？',intro:'讓我覺得安心的，是我們相處時那些小小的溫柔。妳想先聽哪一個？',items:[
  ["溫柔", "我很喜歡我們能輕聲說話、安心聊天的時候。被大聲責備，或用訓話的方式說話時，我會緊繃，也比較難把心裡的話說出來。\n\n有不開心可以告訴我，不用悶著。我希望我們都能照顧彼此的感受；情緒太滿時，先緩一緩，再回來好好聊。我也會提醒自己，溫柔地說、認真地聽。"],
  ['願意溝通改進','我喜歡的是，遇到問題時，我們還願意靠近彼此，把話說清楚。妳可以告訴我哪裡讓妳難受，我也會坦白說出自己的感受。\n不用一次就做得完美，但希望我們都願意聽、願意調整，把說好的小改變慢慢做到。兩個人一起努力，我會覺得這段關係很踏實。'],
  ['聽話乖乖守信用','我說的「乖乖」，是希望我們把彼此的話放在心上，認真對待一起說好的事情。妳有不同想法，當然可以告訴我，我也要好好聽。\n答應的事盡量做到；真的做不到，就早一點說，我們再一起調整。妳能放心相信我，我也能放心相信妳，這種安心對我很重要。']
 ]},
 values:{title:'學長注重什麼？',intro:'有幾件事，我想和妳一起好好照顧。這些期待，也同樣適用在我身上。',items:[
  ['注重隱私','我對自己的隱私比較在意，尤其在第三人或不熟的人面前，不太自在被提起私事。我們之間親密的故事，我也希望先留給我們自己。\n如果想和別人分享，可以先問問對方願不願意；拿不準時，就先不說。我也會一樣尊重妳，讓我們都能安心地把心事交給彼此。'],
  ['量力而為','我知道妳想做很多事，也期待把每一天過得精彩。但排行程時，記得把自己的體力和休息也排進去，好嗎？\n累了就少跑一站，不舒服就換一天。看到妳硬撐到生病、累倒，我真的會擔心。我更想要的是妳舒服、開心，我們有精神再一起慢慢玩。'],
  ['外挺內誠','我希望我們在外面，特別是在不熟的人面前，都能替彼此留一份尊重。有不同意見，可以先平和地說；容易讓人難堪的批評或兩人的矛盾，留到私下再好好談。\n私下妳可以坦白告訴我哪裡做得不好，我會認真聽，也願意改。維護彼此的尊嚴，和誠實面對問題，可以一起做到；我也會這樣對妳。'],
  ["可以不同意，仍然尊重", "我們不一定每件事都想得一樣。我想先理解妳，也希望自己的想法能被聽見，不必爭到其中一個人認輸才結束。\n\n遇到不同意見，可以多問一句「你為什麼這樣想？」有些事情需要一起找共識，有些差異則可以保留。即使看法不同，我們還是可以站在彼此身邊。"],
  ["有立場，也留一點餘地", "我欣賞妳有自己的原則，也在意事情公不公平。不過，當我們對人或事情很生氣時，我希望能先留一點空間，看看有沒有還不了解的背景，不急著替一個人下定論。\n\n表達立場時，可以堅定，也可以讓對方有說話的餘地。遇到不認同的事，我們可以想想：這次最希望改善的是什麼？怎麼說，才比較有機會讓對方聽進去？\n\n我也會練習承認自己可能沒看完整。妳不需要每次都證明自己是對的，才能被我重視；我們都可以有不知道、需要調整的時候。"]
 ]}
};
companionExtras=function(category){
 if(!state.wishCompleted)return;
 const topic=companionTopics[category];
 if(!topic){show('✦ 守護神・學長','還想多了解學長一點嗎？慢慢聊，我也想聽聽妳的想法。',[
  {text:'學長喜歡什麼？',run:()=>companionExtras('likes')},
  {text:'學長注重什麼？',run:()=>companionExtras('values')},
  {text:'回到生日祝福',run:finale}
 ]);return}
 show(topic.title,topic.intro,[...topic.items.map(([title,body])=>({text:title,run:()=>show('✦ 學長 · '+title,body,[
  {text:'返回'+topic.title.replace('？',''),run:()=>companionExtras(category)},
  {text:'其他話題',run:()=>companionExtras()}
 ])})),{text:'返回其他話題',run:()=>companionExtras()}]);
};

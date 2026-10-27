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
  if(state.chapter<chapters.length)area.append(panelElement('p','panel-note','挑戰採情境題與知識題；答錯可看提示再試，離開對話後可重新挑戰。'));
 }else{
  area.append(panelElement('h2','panel-heading','那些走過的日子'),panelElement('p','panel-note','回憶拾起後即可重看；完成章節後收藏稱號與旅程紀念。'));
  for(let ch=0;ch<=Math.min(state.chapter,chapters.length-1);ch++){
   const c=chapters[ch],entries=memoryEntries(ch),unlocked=entries.filter((_,i)=>memoryUnlocked(ch,i)).length;
   const chapter=panelElement('section','album-chapter');chapter.append(panelElement('h3','',`${c.icon} ${c.title}`),panelElement('small','',`${c.age} · 收藏 ${unlocked} / ${entries.length}`));
   if(ch<state.done)chapter.append(panelElement('p','title-ribbon','✦ '+(c.awardedTitle||c.badge)));
   const cards=panelElement('div','memory-grid');entries.forEach((entry,i)=>{
    const available=memoryUnlocked(ch,i);const b=panelButton(available?entry:'✧ 尚未找到的回憶',()=>readMemory(ch,i),'memory-card');b.disabled=!available;
    if(available&&ch===0&&i===2){const photo=document.createElement('img');photo.src='images/xinfating.webp';photo.alt='辛發亭店面';photo.loading='lazy';b.prepend(photo)}cards.append(b);
   });chapter.append(cards);if(ch<state.done){const questions=ch===2?[...universityQuestions.law,...universityQuestions.accounting]:challengeBank[ch];if(questions)chapter.append(panelButton('重溫挑戰',()=>challenge(questions,c.title,returnToCollection),'choice replay-challenge'))}area.append(chapter);
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
3:[['月初現金 8,000，收回應收款 3,000，支付租金 2,000；月底現金是多少？',['9,000','6,000','11,000'],0,'8,000＋3,000－2,000＝9,000；收回應收款會增加現金。'],['帳上支出 1,800，原始憑證為 1,080，最適當的處理是？',['核對交易與憑證後更正，保留調整依據','直接補一筆收入 720 讓餘額相符','刪除原紀錄，避免留下錯誤'],0,'更正需有依據與紀錄，不能用沒有實際交易的收入補差額。'],['交接未結事項時，哪份紀錄最完整？',['事項、金額、憑證、目前進度與接手人','只列總金額，細節口頭說明','只留下已完成的工作'],0,'完整交接包含未結事項與證據，也要讓接手者知道下一步。']],
4:[['讀書計畫有 6 小時，安排 4 段各 75 分鐘，還剩多少時間可休息與檢討？',['60 分鐘','45 分鐘','90 分鐘'],0,'6 小時是 360 分鐘；360－4×75＝60。'],['熟讀後闔書仍答不出題目，下一步最有效的是？',['闔書回想、作答，再針對錯誤查漏補缺','反覆看同一頁直到覺得熟悉','先換新教材，暫時跳過錯題'],0,'主動提取與錯題回饋，比單靠熟悉感更能檢查理解。'],['複習 3 科，每科需 50 分鐘，科目間各休息 10 分鐘；總共需要？',['170 分鐘','180 分鐘','160 分鐘'],0,'3×50＋2×10＝170；最後一科後的休息未計入。']],
5:[['刑事案件仍有合理懷疑，應如何對待被告？',['依無罪推定，不因懷疑就認定有罪','因案情重大，先推定有罪','以多數網友意見決定'],0,'不能證明犯罪時應依無罪推定處理，輿論不能取代證據。'],['面對熟識者牽涉的案件，應優先做什麼？',['揭露關係並依規定處理迴避問題','私下保證自己公正就繼續辦理','請熟識者自行選擇結果'],0,'需依具體關係檢視法定迴避規範，避免利益衝突。'],['裁判理由最重要的功能是？',['交代證據、事實認定與法律適用的連結','讓結論看起來更有權威','只列法條，不必說明如何適用'],0,'理由使判斷可以被理解、檢驗，也有助於保障救濟權利。']],
6:[['UNIQLO：定價 1,200 元，打八折後再折 100 元，應付多少？',['860 元','880 元','960 元'],0,'先算 1,200×0.8＝960，再減 100，得到 860。'],['inooknit：客人說鞋長合適，但前掌擠壓，應先怎麼做？',['確認腳寬與壓迫位置，再找合適鞋楦或尺寸','一律加大兩號，不必再試穿','告訴客人所有鞋都會越穿越寬'],0,'尺寸不只看長度，也要考慮腳寬、鞋楦與實際舒適度。'],['BigByte：孩子能跟讀卻無法自行回答，下一步怎麼引導？',['提供圖片與句型提示，再逐步減少協助','直接要求背完整篇文章','持續替他回答以避免挫折'],0,'先提供適量提示，再逐步撤除，幫助孩子建立獨立表達能力。']],
7:[['案例討論中，兩個案件結論不同，應先比較？',['關鍵事實、爭點與適用規範','哪個結論較受歡迎','哪份判決篇幅比較長'],0,'事實差異與法律爭點可能導致不同結論，不能只看結果。'],['收到一份支持原判斷的新資料，最穩健的作法是？',['檢查來源可信度，也尋找相反證據','因為支持自己就直接採用','只問同意自己的人'],0,'避免確認偏誤，要同時檢驗來源及相反證據。'],['訓練討論涉及個案資訊，分享筆記時應如何處理？',['依保密規範處理，移除不必要的識別資訊','換個群組就可以完整轉貼','只刪姓名，其他內容一律公開'],0,'匿名不只刪姓名，其他資訊也可能識別當事人，仍須遵守保密規範。']]
};
universityQuestions.law=[['依臺灣民法，自然人的權利能力何時開始？',['出生','滿十八歲','完成戶籍登記'],0,'民法第六條：人的權利能力始於出生，終於死亡。'],['甲乙對商品與價金意思一致，一般而言契約成立的核心是？',['雙方意思表示一致','一定先完成付款','一定由法院核准'],0,'一般契約以意思表示一致為核心；特定契約另有要式等規定。'],['依現行臺灣民法，幾歲為成年？',['十八歲','二十歲','十六歲'],0,'自 2023 年起，民法成年年齡為十八歲。']];
universityQuestions.accounting=[['資產 120,000、負債 45,000，權益是多少？',['75,000','165,000','45,000'],0,'資產＝負債＋權益，所以權益＝120,000－45,000。'],['以現金收回先前的應收帳款，對總資產有何影響？',['總額不變','增加','減少'],0,'現金增加、應收帳款減少，資產內部轉換，總額不變。'],['預付未來三個月租金時，尚未耗用部分通常應列為？',['資產','當期全部費用','負債'],0,'尚未耗用的預付租金代表未來經濟效益，先列資產，再隨期間轉列費用。']];
function challenge(questions,speaker,onComplete,index=0,correct=0){
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
const supervisorTalk=talkSupervisor;talkSupervisor=function(){
 if(!finished()&&(state.nttStage||0)===2){show('機車主管','決定好了？先把最後的帳目與交接核對清楚。',[{text:'核對交接，準備辭職',run:()=>challenge(challengeBank[3],'機車主管',()=>show('魚魚','交接完成。這一次，我要為自己做決定。',[{text:'老子不幹了，要去備考了！',run:()=>{state.nttStage=3;save();complete()}}]))}]);return}supervisorTalk();
};

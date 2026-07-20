const rounds = [
  { type:'connections', title:'Connections', kicker:'Round 01', questions:[
    {clues:['Sphynx','Ragdoll','Bengal','Maine Coon'],answer:'They are all cat breeds.'},
    {clues:['Tom','Garfield','Sylvester','Felix'],answer:'Famous fictional male cats.'},
    {clues:['Pride','Clowder','Kindle','Litter'],answer:'Collective nouns connected with cats.'},
    {clues:['Nine lives','Curiosity','Catnap','Got your tongue?'],answer:'Common phrases and idioms involving cats.'}
  ]},
  { type:'sequence', title:'Sequences', kicker:'Round 02', questions:[
    {clues:['Kitten','Junior','Prime','?'],answer:'Senior — age-based cat food life stages.'},
    {clues:['Lion','Tiger','Leopard','?'],answer:'Jaguar — the four largest cats by typical body size.'},
    {clues:['Cat','Cats','Cats & Dogs','?'],answer:'Cats & Dogs: The Revenge of Kitty Galore — successive film titles in the series.'},
    {clues:['C','A','T','?'],answer:'S — spelling CATS, the Andrew Lloyd Webber musical.'}
  ]},
  { type:'wall', title:'Connecting Wall', kicker:'Round 03', questions:[
    {groups:[
      {link:'Big cats',items:['Lion','Tiger','Jaguar','Leopard']},
      {link:'Cats in animation',items:['Simba','Tom','Garfield','Duchess']},
      {link:'Cat coat patterns',items:['Tabby','Tortoiseshell','Calico','Tuxedo']},
      {link:'Words after “copy”',items:['Cat','Right','Writer','Paste']}
    ],answer:'Four groups: big cats; animated cats; coat patterns; and words following “copy”.'}
  ]}
];

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let state={round:0,question:0,scores:[0,0],activeTeam:0,sound:true,wallSelected:[],wallSolved:[]};
const screens={home:$('#homeScreen'),setup:$('#setupScreen'),game:$('#gameScreen'),results:$('#resultsScreen')};
function show(name){Object.values(screens).forEach(s=>s.classList.remove('active'));screens[name].classList.add('active');window.scrollTo(0,0)}
function beep(freq=440){if(!state.sound)return;const a=new (window.AudioContext||window.webkitAudioContext)(),o=a.createOscillator(),g=a.createGain();o.frequency.value=freq;g.gain.setValueAtTime(.035,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.12);o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+.12)}
function render(){
  const r=rounds[state.round],q=r.questions[state.question];
  $('#roundKicker').textContent=r.kicker;$('#roundTitle').textContent=r.title;$('#questionCount').textContent=`Question ${state.question+1} / ${r.questions.length}`;$('#progressBar').style.width=`${((state.question+1)/r.questions.length)*100}%`;
  $('#revealButton').textContent='Reveal answer';$('#revealButton').disabled=false;$('#nextButton').disabled=true;
  let html='<p class="question-prompt">';
  if(r.type==='connections') html+='What connects these four clues?</p><div class="clue-grid">'+q.clues.map(x=>`<div class="clue">${x}</div>`).join('')+'</div>';
  if(r.type==='sequence') html+='What comes fourth?</p><div class="clue-grid sequence">'+q.clues.map(x=>`<div class="clue">${x}</div>`).join('')+'</div>';
  if(r.type==='wall'){const items=q.groups.flatMap((g,gi)=>g.items.map(item=>({item,gi}))).sort(()=>Math.random()-.5);state.wallItems=items;state.wallSelected=[];state.wallSolved=[];html+='Select four clues that share a connection.</p><div class="wall-grid">'+items.map((x,i)=>`<button class="wall-tile" data-index="${i}">${x.item}</button>`).join('')+'</div><p class="wall-status" id="wallStatus">0 of 4 groups solved</p>'}
  html+=`<div class="answer-panel" id="answerPanel"><span>The connection</span><strong>${q.answer}</strong></div>`;$('#questionArea').innerHTML=html;
  $$('.wall-tile').forEach(b=>b.addEventListener('click',()=>wallClick(Number(b.dataset.index),b)));
}
function wallClick(i,button){if(state.wallSolved.includes(i))return;const pos=state.wallSelected.indexOf(i);if(pos>=0){state.wallSelected.splice(pos,1);button.classList.remove('selected')}else if(state.wallSelected.length<4){state.wallSelected.push(i);button.classList.add('selected')}
  if(state.wallSelected.length===4){const groups=state.wallSelected.map(x=>state.wallItems[x].gi);if(groups.every(g=>g===groups[0])){state.wallSelected.forEach(x=>{$(`[data-index="${x}"]`).classList.remove('selected');$(`[data-index="${x}"]`).classList.add('solved');state.wallSolved.push(x)});state.wallSelected=[];beep(660);$('#wallStatus').textContent=`${state.wallSolved.length/4} of 4 groups solved`;if(state.wallSolved.length===16){$('#nextButton').disabled=false}}else{beep(180);setTimeout(()=>{state.wallSelected.forEach(x=>$(`[data-index="${x}"]`).classList.remove('selected'));state.wallSelected=[]},420)}}}
function reveal(){const p=$('#answerPanel');p.classList.add('show');$('#revealButton').disabled=true;$('#revealButton').textContent='Answer revealed';$('#nextButton').disabled=false;beep(550)}
function next(){const r=rounds[state.round];if(state.question<r.questions.length-1)state.question++;else if(state.round<rounds.length-1){state.round++;state.question=0}else{return results()}render();beep(480)}
function updateScores(){['One','Two'].forEach((n,i)=>$('#score'+n).textContent=state.scores[i]);$$('.team-score').forEach((x,i)=>x.classList.toggle('active-team',i===state.activeTeam))}
function results(){show('results');$('#scoreDock').hidden=true;const names=[$('#teamOneName').textContent,$('#teamTwoName').textContent],max=Math.max(...state.scores);$('#podium').innerHTML=names.map((n,i)=>`<div class="result-card ${state.scores[i]===max?'winner':''}"><span>${state.scores[i]===max?(state.scores[0]===state.scores[1]?'JOINT WINNER':'TOP CAT'):'RUNNER-UP'}</span><h3>${n}</h3><strong>${state.scores[i]}</strong></div>`).join('')+'<p class="result-note">Award points as host judgment allows. No cats were cross-examined in the making of this quiz.</p>'}
$('#startButton').onclick=()=>show('setup');$('#beginButton').onclick=()=>{const names=[$('#teamOneInput').value.trim()||'The Tabbies',$('#teamTwoInput').value.trim()||'The Tuxedos'];$('#teamOneName').textContent=names[0];$('#teamTwoName').textContent=names[1];show('game');$('#scoreDock').hidden=false;render()};$('#revealButton').onclick=reveal;$('#nextButton').onclick=next;$('#switchTeam').onclick=()=>{state.activeTeam=1-state.activeTeam;updateScores();beep(350)};$$('[data-score]').forEach(b=>b.onclick=()=>{const team=Number(b.closest('.team-score').dataset.team);state.scores[team]=Math.max(0,state.scores[team]+Number(b.dataset.score));updateScores();beep(600)});$('#soundButton').onclick=()=>{state.sound=!state.sound;$('#soundButton').textContent=state.sound?'♪':'×'};function reset(){state={round:0,question:0,scores:[0,0],activeTeam:0,sound:state.sound,wallSelected:[],wallSolved:[]};updateScores();$('#scoreDock').hidden=true;show('home')}$('#resetButton').onclick=reset;$('#playAgainButton').onclick=reset;

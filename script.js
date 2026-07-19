const questions = [
  ['After a difficult day, what would mean the most?', ['Hearing “I’m proud of you.”','Someone taking a task off my plate.'], ['words','acts']],
  ['Your perfect quiet evening looks like…', ['Uninterrupted time together.','Curling up close on the sofa.'], ['time','touch']],
  ['Which surprise stays with you longer?', ['A tiny gift that shows they remembered.','A heartfelt note left for me.'], ['gifts','words']],
  ['I feel most supported when someone…', ['Steps in and helps without being asked.','Puts everything down and really listens.'], ['acts','time']],
  ['When greeting someone I love, I prefer…', ['A long, warm hug.','A small “saw this and thought of you” surprise.'], ['touch','gifts']],
  ['What makes an ordinary day feel special?', ['A sincere compliment.','Doing something side by side.'], ['words','time']],
  ['Which feels more caring?', ['They handle something I’ve been dreading.','They hold my hand when I’m nervous.'], ['acts','touch']],
  ['What would you treasure most from a trip?', ['A thoughtful keepsake chosen for me.','A whole afternoon with no distractions.'], ['gifts','time']],
  ['When you achieve something, you want…', ['Someone to tell me exactly what they admire.','A celebratory hug or kiss.'], ['words','touch']],
  ['Which gesture makes you feel truly known?', ['They remember my favorite little thing.','They make my day easier in a practical way.'], ['gifts','acts']],
  ['On a busy week, connection means…', ['Protecting an hour just for us.','Checking in with an encouraging message.'], ['time','words']],
  ['When life feels overwhelming, I value…', ['A reassuring arm around me.','Someone quietly taking care of the details.'], ['touch','acts']]
];
const languageInfo = {
  words:{name:'Words of affirmation',icon:'“ ”',desc:'You feel deeply cared for when love is put into words. Specific encouragement, appreciation, and honest reassurance help you feel seen.',ideas:['Send a specific “I appreciate you because…” text','Leave a note somewhere unexpected','Say the good thing out loud—don’t assume they know']},
  time:{name:'Quality time',icon:'◷',desc:'Presence is precious to you. Unhurried attention and shared experiences make you feel chosen, connected, and close.',ideas:['Plan a phone-free walk together','Turn an errand into a tiny date','Ask one real question over dinner']},
  acts:{name:'Acts of service',icon:'✦',desc:'For you, care becomes real through thoughtful action. Help, follow-through, and small efforts say, “We’re a team.”',ideas:['Take one thing off their to-do list','Make their morning a little easier','Notice what needs doing—and do it']},
  touch:{name:'Physical touch',icon:'⌁',desc:'Warm, welcome touch helps you feel safe and connected. Closeness often communicates more than words ever could.',ideas:['Offer a lingering hello hug','Hold hands on your next walk','Sit close during an ordinary moment']},
  gifts:{name:'Receiving gifts',icon:'◇',desc:'You value the thought captured inside a tangible reminder. It is never about price—it is about being remembered.',ideas:['Bring home their favorite snack','Save a small memento from a shared day','Choose something tied to an inside joke']}
};
let index=0, scores={words:0,time:0,acts:0,touch:0,gifts:0};
const modal=document.getElementById('quiz'), content=document.getElementById('quizContent');
document.querySelectorAll('[data-start]').forEach(b=>b.addEventListener('click',startQuiz));
document.getElementById('closeQuiz').addEventListener('click',closeQuiz);
modal.addEventListener('click',e=>{if(e.target===modal)closeQuiz()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeQuiz()});
function startQuiz(){index=0;scores={words:0,time:0,acts:0,touch:0,gifts:0};modal.hidden=false;document.body.style.overflow='hidden';renderQuestion()}
function closeQuiz(){modal.hidden=true;document.body.style.overflow=''}
function renderQuestion(){
  const q=questions[index];
  document.getElementById('questionCount').textContent=`Question ${index+1} of ${questions.length}`;
  document.getElementById('progressBar').style.width=`${((index+1)/questions.length)*100}%`;
  content.innerHTML=`<div class="question"><h2>${q[0]}</h2><div class="choices"><button class="choice" data-choice="0"><span>A</span>${q[1][0]}</button><button class="choice" data-choice="1"><span>B</span>${q[1][1]}</button></div></div>`;
  content.querySelectorAll('.choice').forEach(b=>b.addEventListener('click',()=>choose(+b.dataset.choice)));
}
function choose(choice){scores[questions[index][2][choice]]++;index++;index<questions.length?renderQuestion():showResult()}
function showResult(){
  const winner=Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0], r=languageInfo[winner];
  document.getElementById('questionCount').textContent='Your result';document.getElementById('progressBar').style.width='100%';
  content.innerHTML=`<div class="result"><div class="result-badge">${r.icon}</div><h2>Your love language is<br><span class="result-name">${r.name}</span></h2><p>${r.desc}</p><div class="result-ideas">${r.ideas.map(x=>`<div>${x}</div>`).join('')}</div><button class="button button-primary" id="doneQuiz">Keep this close <span>♥</span></button><br><button class="retake" id="retakeQuiz">Retake the quiz</button></div>`;
  document.getElementById('doneQuiz').onclick=closeQuiz;document.getElementById('retakeQuiz').onclick=startQuiz;
}

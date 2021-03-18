let money = document.getElementById("money");
let display = document.getElementById("display");
let bill_acc = document.getElementById("bill_acc");
let displayInfo = document.getElementById("displayInfo");
let displayBalance = document.getElementById("displayBalance");
let progressBar = document.getElementsByClassName("progress-bar")[0];//у прогресс бара есть класс (это много разных элементов), и он нулевой (и единственный) элемент этого класса-массива
let change_box = document.getElementById("change_box");
let lock = document.getElementById("lock");
let cup = document.getElementById("cup");
let progress = 0;//вспомогательная переменная для заполнения прогресс-бара

function getCoffee(coffeName,price){
if(+money.value>=price){
money.value = +money.value-price;
displayBalance.innerText = money.value;//тут он будет выводить сколько денег положили (если их больше, чем цена кофе)
let timerId = setInterval(()=>{//вот эта вся здоровая шляпа это чисто для работы прогресс-бара, интервал задан в скобочках после
lock.hidden = false;//пока заполняется прогресс-бар никуда нельзя нажать (экран заблокирован)
if(progress>110){//пушто если прятать, он не успевает прорисоваться полностью
  clearInterval(timerId);// когда прогресс достигнет 100 надо удалить интервал (для этого сначала сохраняем его в переменную timerId)
  progressBar.hidden = true;//а прогресс бар прячется
  //progressBar.style.width = 0+'%'; - это чтобы прогресс бар обнулился
  displayInfo.innerHTML = `<i class="fas fa-mug-hot"></i> Кофе ${coffeName} готов`;//в дисплей выводится информация о готовности кофе
  progress = 0;//прогресс обнуляется
  lock.hidden = true;// экран разблокируется
  cup.style.opacity=1;
  return;
}
else if(progress<40) displayInfo.innerHTML = `<i class="fas fa-hourglass-start"></i> Приготовление...`;//финтифлюшки
else if(progress<80) displayInfo.innerHTML = `<i class="fas fa-hourglass-half"></i> Приготовление...`;
else displayInfo.innerHTML = `<i class="fas fa-hourglass-end"></i> Приготовление...`;
progressBar.hidden = false;//когда надо запустить, он включается
progressBar.style.width = ++progress+'%';
},70);
}else{
displayInfo.innerHTML = `<i class="far fa-frown"></i> Недостаточно средств`;
}
}


let banknotes = document.querySelectorAll("[src$='rub.jpg']"); // коллекция эл-в по заданному условию
let zIndex = 1;
for(let i=0; i<banknotes.length; i++){ // перебираем коллекцию
let banknote = banknotes[i]; // записываем очередной элемент коллекции в переменную
banknote.onmousedown = function(e){//произошел маусдаун - сразу сгенерировалось событие, сразу вызвалась функция просчета координат (строка 182)
this.ondragstart = function(){return false;}
this.style.position = 'absolute';
this.style.zIndex = ++zIndex;//при клике повышается з-индекс
this.style.transform = 'rotate(90deg)';//поворот на 90 градусов после клика
moveAt(e);//чтоб избежать прилипания купюр, надо сразу же когда происходит клик ЛКМ
function moveAt(event){//координаты начинают просчитываться, когда началось движение мыши
banknote.style.top = (event.clientY-banknote.offsetHeight/2)+'px';
banknote.style.left = (event.clientX-banknote.offsetWidth/2)+'px';
}
document.addEventListener('mousemove',moveAt);
this.onmouseup = function(){//все дальнейшее происходит по отжатии ЛКМ от купюры
document.removeEventListener('mousemove',moveAt);
let bill_acc_top = bill_acc.getBoundingClientRect().top; // параметры купюроприёмника
let bill_acc_bottom = bill_acc.getBoundingClientRect().bottom - (bill_acc.getBoundingClientRect().height*2/3);
let bill_acc_left = bill_acc.getBoundingClientRect().left;
let bill_acc_right = bill_acc.getBoundingClientRect().right;
let banknote_top = this.getBoundingClientRect().top; // параметры купюры
let banknote_left = this.getBoundingClientRect().left;
let banknote_right = this.getBoundingClientRect().right;
if(bill_acc_top<banknote_top && bill_acc_bottom>banknote_top && bill_acc_left<banknote_left && bill_acc_right>banknote_right){//как только купюра попадает в заданную область И кнопка отжимается, купюра исчезает
  money.value = (+money.value)+(+this.dataset.value);//перед тем, как купюра исчезает, записываем в money value стоимость купюры (которую задавали выше по data-value 128-130)
  displayBalance.innerText = money.value;//когда исчезает купюра в купюроприемнике выдается ее номинал
  this.hidden = true;//вот тут она исчезает
}
}
}
}

function getChange(num){//получить сдачу
let change_box_h = change_box.getBoundingClientRect().height-60;
let change_box_w = change_box.getBoundingClientRect().width-60;
let change = 0;
let top = Math.random()*change_box_h;
let left = Math.random()*change_box_w;
if(num>=10) change = 10;
else if(num>=5) change = 5;
else if(num>=2) change = 2;
else if(num>=1) change = 1;
/*else{
let audio = new Audio("/audio/getChange.mp3");
audio.play();
}*/

if(change>0){
let img = document.createElement('img');//создаем картинку, задаем ей свойства
img.src = `img/${change}rub.png`;
img.style.top = top + 'px';
img.style.left = left + 'px';
change_box.append(img);//вот так перезаписи нет, есть запись нового в changebox - лучше с т зр производительности - разница append и innerHTML
img.onclick = function () {
  this.hidden = true;
}
//change_box.innerHTML += `<img src="/img/${change}rub.png" onclick = 'this.style.display = "none"'; style="top:${top}px;left:${left}px;">`;
// console.log(change);
getChange(num-change);
money.value = 0;
displayBalance.innerText = money.value;//обнуление баланса после выдачи сдачи

}
}
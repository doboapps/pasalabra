var answerTrue;
var userName="user",ranking="",answerUser,titleScore;
var time,totalQuestions=questions.length,score=0,roundNumber=0,errors=0,random,numberLetter=0,numberOfmenssages=0;
var users=[];
var children=document.getElementById("rosco").children;
var TIME=240;   
            
document.body.addEventListener( 'keyup', function(e){//evento que escucha cuando pulso una tecla            

            if ( e.keyCode == 13 ) {//si puso intro
                console.log("intro pulsados");

                switch (numberOfmenssages) {

                    case 0: FromWelcomeToName();  // acepto mensaje inicial                      
                        break;                
                    case 1: NewGameAndRanking(); // he añadido un nombre y comienzo el nuevo  
                            focusAndClearInput();                                        
                        break;
                    case -1: showRanking(); // muestro lista de ranking                                         
                        break;
                    default: CheckAnswer(false); //chequeo respuesta
                             focusAndClearInput();
                }
            }            
            if ( e.keyCode == 32 && numberOfmenssages>1 ) {// si pulso space y he pasado los dos mensajes iniciales
                CheckAnswer(true);
                focusAndClearInput();                
            }
});


 function focusAndClearInput(){ // pone el focus y en blanco el input
     document.getElementById("answer").focus();
     document.getElementById("answer").value="";
 }



function FromWelcomeToName (){
    
    numberOfmenssages=1;
    document.getElementById("welcome").style.display="none";
    document.getElementById("ranking").style.display="none";
    document.getElementById("name").style.display="inline-block";
    document.getElementById("text-name").focus();    
}

function ResetbackgroundColorLetter(){//reinicia los colores de fondo para un nuevo juego

    for (var i = 0; i < children.length; i++) {
        children[i].className="blue";
        children[i].style.border="2px solid white";
    }
}

function NewGameAndRanking(){
    ResetbackgroundColorLetter();
    focusAndClearInput();

    time=TIME;//reinicio el tiempo
    titleScore="Se acabo el tiempo!<br><br> TU PUNTUACIÓN:"//reinicio titulo score
    document.getElementById("answer-value").innerHTML="";
    numberOfmenssages++;
    

    document.getElementById("name").style.display="none";
    document.getElementById("messages").style.display="none";
    userName= document.getElementById("text-name").value.toUpperCase();

    score=errors=roundNumber=0;//reinicio de recuento de rondas y marcadores
    
    questionsForPlay = JSON.parse(JSON.stringify(questions));//clono el objeto
    Game();
    timeGo();
}

function timeGo(){//comienza cuenta atrás
    
    var concatenateZero="";
    var intervalSeconds =  setInterval(function(){

            time--;
            document.getElementById("time").parentNode.className="time"; 
            if(time<100){
                concatenateZero="0";                   
            }
            if(time<10){
                concatenateZero="00";
                document.getElementById("time").parentNode.className+=" red";                    
            }

            document.getElementById("time").innerHTML=concatenateZero+time;

            if(time==0){
                console.log("SE ACABÓ EL TIEMPO");
                
                rankingGo(); 
                clearInterval(intervalSeconds);  //detengo cuenta atrás;
            }
    }, 1000);
}

function transitionColorLetter(){//comienza cuenta atrás
    document.getElementById("letter").className="letter"; 

    setTimeout(function() {
        document.getElementById("letter").className+=" change-letter"; 
    }, 100);
}


function findIndex(number){//devuelveme el indice que coincida

    return questionsForPlay.findIndex(function(element,index){
                                
                return element.status === number; 
           });    
}

function Game(){ 

    transitionColorLetter();
    //DAME EL INDICE DEL ARRAY DONDE EL STATUS = ROUNDNOMBER
    numberLetter= findIndex(roundNumber);                                                                       
    
    if(numberLetter==-1){ //si acabo una ronda
        roundNumber++;

        numberLetter= findIndex(roundNumber);
        
        if(numberLetter==-1){//rosco terminado
            time=1;//saltará el ranking al ser el timpo 0
            titleScore="TU PUNTUACIÓN:";          
        }
    }

    if(numberLetter>-1){
        if(roundNumber==0){//preguntas aleatorias solo en la primera ronda
            random =Math.floor((Math.random() * 3));//numero aleatorio del 0 al 2
            questionsForPlay[numberLetter].actualPositionGame=random;
        }        
    
        var questionPositionInObject=questionsForPlay[numberLetter].actualPositionGame;//poscion pregunta actual para este juego
        answerTrue=questionsForPlay[numberLetter].answer[questionPositionInObject];//busca la pregunta correcta actual en le json
        changesHtml(); 
    }   
}

function changesHtml(){ //cambios textuales y visuales en los mensajes y en el rosco
    document.getElementById("question").innerHTML=questionsForPlay[numberLetter].question[questionsForPlay[numberLetter].actualPositionGame];
    document.getElementById("letter").innerHTML=questionsForPlay[numberLetter].letter;
    if(numberLetter>0){
        children[numberLetter-1].style.border="2px double white";
    }    
    children[numberLetter].style.border="2px solid #f8b560";
}

function CheckAnswer(pasapalabra){//comprueba si las respuestas son validas (boton:pasalabra o tecla:space)
    
    document.getElementById("answer-value").innerHTML="";
    
    if(!pasapalabra){//si no se ha pulsado pasalabra
            answerUser=document.getElementById("answer").value.toLowerCase;

        if(answerUser==answerTrue){
            score+=1;
            //alert("Correcto!\nPuntuación: "+score+" puntos.");
            answer= true;
            children[numberLetter].className = "green";
            document.getElementById("correct").innerHTML=score;
            changeCorrectOrFalse("font-true","Si!<br>Correcto");
        }else{
            errors+=1;
            //alert("No! La respuesta correcta es: "+answerTrue);
            answer= false;
            children[numberLetter].className = "red";
            changeCorrectOrFalse("font-false","no!<br>&nbsp"+answerTrue);
            document.getElementById("answer-value").innerHTML="No!<br>"+answerTrue;
            
        }
        questionsForPlay[numberLetter].status=answer;
       
        //console.log("respondidas: "+answerS);
        
    }else{
        questionsForPlay[numberLetter].status=roundNumber+1; //pasalabra para buscar en la siguiente ronda  
    } 
  focusAndClearInput();    
  Game();
}

function changeCorrectOrFalse(addClass,answerValue){//funcion que canbio mensaje de correcto o no
    document.getElementById("answer-value").innerHTML=answerValue;
    document.getElementById("answer-value").className=addClass;
}

function rankingGo(){
    time=0;
    showScore();

      users.push({"name":userName,"points":score});        

    users.sort(function(a,b){//ordena los usuarios
      return  b.points - a.points ;    
    });   
}

function showScore(){//puntuacion

    document.getElementById("messages").style.display="inherit";
    document.getElementById("score").style.display="inline-block";
    document.getElementById("title-score").innerHTML=titleScore;
    document.getElementById("score-list").innerHTML=userName+" has acertado "+score+" palabras.<br>Has fallado "+errors+" palabras.";
    numberOfmenssages=-1;   
}

function showRanking(){
    
    document.getElementById("ranking").style.display="inline-block";
    document.getElementById("score").style.display="none";
   
    ranking=""; 
    for(obj of users){// lista de ranking
      ranking+=obj.name+" ha acertado "+obj.points+" letras.<br>";   
    }   
    document.getElementById("ranking-list").innerHTML=ranking;

}





        
        
    







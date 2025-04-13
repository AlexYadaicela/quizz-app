const formElement = document.querySelector('form'); 
let randNum = getRandomNumber(); 


function getRadioValues(e){
    e.preventDefault(); 
    const categoryRadioValue = formElement.elements['category'].value; 
    const difficultyRadioValue = formElement.elements['difficulty'].value; 

    console.log(categoryRadioValue); 
    console.log(difficultyRadioValue);

    getQuestions(categoryRadioValue, difficultyRadioValue); 
}

formElement.addEventListener('submit', getRadioValues, false);


async function getQuestions(category, difficulty){
    const url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;
    try{
        const response = await fetch(url); 
        if(!response.ok){
            throw new Error(`Response status: ${response.status}`); 
        }

        const json = await response.json();
        data = json.results; 
        generateQuestionCards(json.results); 
    }catch(error){
        console.error(error.message); 
    }
}


const nextQuestion = document.querySelector('.next_question'); 
const displayChoices = document.querySelectorAll('.answer'); 

nextQuestion.addEventListener('click', getNextQuestion, false); 

let data; 
let currQuestion = 0; 

function getNextQuestion(){
    currQuestion += 1;
    if(currQuestion < 10){
        randNum = getRandomNumber(); 
        generateQuestionCards(data);
        nextQuestion.disabled = true; 
        console.log(data[currQuestion]); 
        console.log(randNum); 
    }else{
        console.log('end of questions');
    } 

    displayChoices.forEach((choice) => {
        choice.style.backgroundColor = '#ffd60a'; 
    });
}


nextQuestion.disabled = true; 

function generateQuestionCards(questions){
    try{
        const displayQuestion = document.querySelector('.question'); 
        const incorrectAnswers = questions[currQuestion].incorrect_answers; 

        displayQuestion.textContent = questions[currQuestion].question; 

        incorrectAnswers.forEach((answer, index) => {
            if(index === randNum){

                displayChoices[index].textContent = questions[currQuestion].correct_answer; 
                displayChoices[index].addEventListener('click', () => {
                    displayChoices[index].style.backgroundColor = 'green'; 
                    nextQuestion.disabled = false; 
                });
                
                displayChoices[displayChoices.length - 1].textContent = answer;
                displayChoices[displayChoices.length - 1].addEventListener('click', () =>{
                    displayChoices[displayChoices.length - 1].style.backgroundColor = 'red'; 
                    displayChoices[randNum].style.backgroundColor = 'green'; 
                    nextQuestion.disabled = false; 
                })
            }else{
                displayChoices[index].textContent = answer; 
                displayChoices[index].addEventListener('click', () => {
                    displayChoices[randNum].style.backgroundColor = 'green'; 
                    displayChoices[index].style.backgroundColor = 'red'; 
                    nextQuestion.disabled = false; 
                });
            }
        });

    }catch(error){
        console.error(error.message); 
    }
}

function getRandomNumber(){
    return Math.floor(Math.random() * 3); 
}


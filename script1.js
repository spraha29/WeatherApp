const wrapper= document.querySelector(".wrapper"),
inputPart= wrapper.querySelector(".input-part"),
infoTxt= inputPart.querySelector(".info-text"),
inputField= inputPart.querySelector("input"),
locationBtn= inputPart.querySelector("button"),
wicon= document.querySelector(".weatherpart img");
arrowback=wrapper.querySelector("header .arrow");

let api

inputField.addEventListener("keyup",e=>{
    if(e.key=="Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", ()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess,onError)
    }
    else{
        alert("your browser does not support geolocation api");
    }
});

function onSuccess(position){
    const{latitude,longitude}=position.coords;
    api=`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=02af4f647cd3d1fbe5a9b13ed206f706`
    fetchData(api);
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function requestApi(city){
api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=02af4f647cd3d1fbe5a9b13ed206f706`;
fetchData();
}

function fetchData(){
    infoTxt.innerText = "Getting weather details......";
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json()).then(result=> weatherDetails(result));   
}

function weatherDetails(info){
    infoTxt.classList.replace("pending","error");
    if(info.cod=="404"){
           infoTxt.innerText=`${inputField.value} is'nt a valid city name`;
    }
    else{
        const city= info.name;
        const country=info.sys.country;
        const {description,id}=info.weather[0];
        const {feels_like,humidity,temp}= info.main;
        const windSpeed=info.wind.speed;
        const Sunrise=info.sys.sunrise;
        
        // converting unix time stamp
        date = new Date(Sunrise* 1000);
        hours = date.getHours();
        minutes = "0" + date.getMinutes();
        formatTime = hours + ':' + minutes.substr(-2) + 'am'

        if(id ==800){
                  wicon.src="/images_app/clear.svg";         
        }
        else if(id>=200 && id<=232){
                  wicon.src="/images_app/storm.svg";     
        } 
        else if(id>=600 && id<=622){
                  wicon.src="/images_app/snow.svg";         
        }
        else if(id>=700 && id<=781){
                  wicon.src="/images_app/haze.svg";         
        }
        else if(id>=801&& id<=804){
                  wicon.src="/images_app/cloud.svg";         
        }
        else if(id>=300 && id<=321 || id>=500 && id<=531 ){
                  wicon.src="/images_app/rain.svg";        
        }
        

        wrapper.querySelector(".temp .numb").innerText= Math.floor(temp);
        wrapper.querySelector(".weather").innerText= description;
        wrapper.querySelector(".temp .numb").innerText= temp;
        wrapper.querySelector(".location span").innerText= `${city},${country}`;
        wrapper.querySelector(".temp .numb-2").innerText= Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText= `${humidity}%`;
        wrapper.querySelector(".windspeed .numb").innerText= windSpeed;
        wrapper.querySelector(".sunrise span").innerText= formatTime;
        infoTxt.classList.remove("pending","error");
        wrapper.classList.add("active");
        console.log(info)
    }
}

arrowback.addEventListener("click",()=>{
    wrapper.classList.remove("active");
});
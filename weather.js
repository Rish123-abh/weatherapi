// // H.HPjajse3tDC6Y open weather password
const userweather=document.querySelector('#user-weather');
const searchweather=document.querySelector('#search-weather');
const grantlocation=document.querySelector('.grant-location');
const searchweathertab=document.querySelector('.form-container');
const showweathertab=document.querySelector('.user-info-container');
const loadingcontainer=document.querySelector('.loading');
const alluicontainer=document.querySelector('.weather-container');
const notFound=document.querySelector(".errorContainer");
const errorText=document.querySelector("[ data-errorText]");
const errorBtn=document.querySelector("#button");

let current_tab=userweather;
const API_KEY='f4afe06828e8a524e59165476b7a2ffa';
current_tab.classList.add("current-tab")
getfromSessionStorage();
// writing function and adding event listener for switching of tabs 
function switchtab(clickedtab){
    if(clickedtab!=current_tab){
        current_tab.classList.remove("current-tab");
        current_tab=clickedtab;
        current_tab.classList.add("current-tab");
    }
    // check karnge search tab invisible hai to visible karenge usko aur sabko hide karenge  
    if(!searchweathertab.classList.contains("active")){
        showweathertab.classList.remove("active");
        grantlocation.classList.remove("active");
        searchweathertab.classList.add("active");
    }
    // already search tab par hu aur weather wala tab dikhana hai
    else{
        searchweathertab.classList.remove("active");
        // already weather show ho rha hoga to usko remove karenge 
        showweathertab.classList.remove("active");
        // below function your weather nikalega uss specified jagega jiske coordinates store honge 
        getfromSessionStorage();
    }
}
userweather.addEventListener("click",()=>{
    // passing the clicked tab as a input parameter 
    switchtab(userweather);
});
searchweather.addEventListener("click",()=>{
    // passing the clicked tab as a input parameter 
    switchtab(searchweather);
});

// check weather location is present in session storage or not 
function getfromSessionStorage(){
    const localcoordinates=sessionStorage.getItem("user-coordinates");
    if(!localcoordinates){
            grantlocation.classList.add("active");
        }
    else{
        const coordinate=JSON.parse(localcoordinates);
        fetchUserWeatherInfo(coordinate);
    }
}
async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    // Remove Active Class from the Grant access Container
    grantlocation.classList.remove('active');

    // loading ko visible karna 
    loadingcontainer.classList.add('active');

    // try - catch Block
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        if (!data.sys) {
            throw data;
        }
        // data aa chuka hai api se to loading ko invisible karenge 
        loadingcontainer.classList.remove('active');
        notFound.classList.remove('active');
        showweathertab.classList.add('active');
        renderWeatherInfo(data);
    }
    catch (err) {
        loadingcontainer.classList.remove('active');
        notFound.classList.add('active');
        errorImage.style.display = 'none';
        errorText.innerText = `Error: ${err?.message}`;
        errorBtn.style.display = 'block';s
        errorBtn.addEventListener("click", fetchUserWeatherInfo);
    }
}
// ab ek baar data fetch ho gya to usko display karana hai 

function renderWeatherInfo(data){
const cityName=document.querySelector("[data-cityname]");
const country=document.querySelector("[data-countryicon]");
const weatherdesc=document.querySelector("[data-weatherdesc]");
const weathericon=document.querySelector("[data-weathericon]");
const weathertemp=document.querySelector("[data-temp]");
const windspeed=document.querySelector("[data-windspeed]");
const humidity=document.querySelector("[data-humidity]");
const cloudy=document.querySelector("[data-cloudy]");
// fetch value from data and put value in above elements  
// below is the example of chaining ?-> shows hume nhi pata value hai ya nhi vallue nhi hogi to error nhi dega undefined value aayegi 

cityName.innerText=data?.name;
country.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
weatherdesc.innerText=data?.weather?.[0]?.description;
weathericon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
weathertemp.innerText=`${data?.main?.temp} °C`;
windspeed.innerText=`${data?.wind?.speed} m/s`;
humidity.innerText=`${data?.main?.humidity} %`;
cloudy.innerText=`${data?.clouds?.all} %`;
}
function showPosition(position) {
    // finding coordinates using geolocation api 
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
function getlocation(){
    // check karenge geolocation supported hai ya nhi 
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("No geolocation support");
    }
}
// adding event listener on grant access button 
const grantaccessbutton=document.querySelector("[grant-button]");
grantaccessbutton.addEventListener("click",getlocation);


async function fetchSearchWeatherInfo(city){
    loadingcontainer.classList.add("active");
   showweathertab.classList.remove("active");
   grantlocation.classList.remove("active");

   try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

    const data = await response.json();
    if (!data.sys) {
        throw data;
    }
    notFound.classList.remove('active');
    loadingcontainer.classList.remove('active');
    showweathertab.classList.add('active');
    renderWeatherInfo(data);
}
catch (err) {
    loadingcontainer.classList.remove('active');
    showweathertab.classList.remove('active');
    notFound.classList.add('active');
    errorText.innerText = `${err?.message}`;
    errorBtn.style.display = "none";
}

}

const searchinput=document.querySelector('.search');

searchweathertab.addEventListener('submit', (e) => {
    e.preventDefault();
    if (searchinput.value === "") {
        return;
    }
    // console.log(searchInput.value);
    fetchSearchWeatherInfo(searchinput.value);
    searchinput.value = "";
});

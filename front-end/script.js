let token = 'JOWX4WXIPMBE9IYU';
let loggedIn = false;


export const renderSite = function(){
    $(document).ready(function() {
        // Button Handling
        $(document).on("click", "#submitButton", handleSubmitButton);
        $(document).on("click", "#newMember", changeNewMember);
        $(document).on("click", "#returnMember", changeReturningMember);
        $(document).on("click", "#cancelButton", newButtons);
        $(document).on("click", "#createAccount", postNewUser);
        $(document).on("click", "#logoutButton", handleLogoutButton);
        $(document).on("click", "#loginButton", loginUser);
        $(document).on("click", "#deleteChart", handleDeleteChart);
        $(document).on("click", "#companyNameAuto", handleAutoClick);

    }
)};

$(function () {
    renderSite();
});
 
export async function renderCharts(symbol){
    let quoteName = await changeName(symbol);
    const $root = $('#root');
    const quoteResult = await axios({
        method: 'get',
        url: 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol='+ quoteName +'&apikey=' + token + '&datatype=json',

    });
   
    let stockName = await getName(symbol);
    let chart = `<div id="chart">`
    let resultData= quoteResult.data["Global Quote"];
    // Look into how to get all the available names from the above API call 
    let percentChange = resultData["10. change percent"];
    if(!(percentChange.startsWith("-"))){
        percentChange = "+" + percentChange;
    };
    //Do an array using resultData with ["number. value"]
    let stockSym = resultData["01. symbol"];

    let currentPrice = resultData["05. price"];
    currentPrice = currentPrice.substring(0, currentPrice.length - 2);
    let openPrice = resultData["02. open"];
    openPrice = openPrice.substring(0, openPrice.length - 2);
    let lowPrice = resultData["04. low"];
    lowPrice = lowPrice.substring(0, lowPrice.length - 2);
    let highPrice = resultData["03. high"];
    highPrice = highPrice.substring(0, highPrice.length - 2);
    let closePrice = resultData["08. previous close"];
    closePrice = closePrice.substring(0, closePrice.length - 2);
   
    chart += `<div id="singleChart" class="box">
                 <h1 class="has-text-centered">${stockName} (${stockSym}) ${percentChange}</h1>
                 <p>Current Price: $${currentPrice}</p>
                 <p>Open: $${openPrice}</p>
                 <p>Today's Low: $${lowPrice}</p>
                 <p>Today's High: $${highPrice}</p>
                 <p>Previous Close: $${closePrice}</p> 
                 <button class="button is-danger is-centered" id="deleteChart">Delete Chart</button>
            </div>`;
    
    chart += `</div>`
    $root.append(chart);
}
// Buttons
export const handleSubmitButton = function(event) {
    event.preventDefault();
    let submitValue = document.getElementById('quoteName').value;
    renderCharts(submitValue);
    document.getElementById('quoteName').value='';
}

export const handleLogoutButton = function(event){
    event.preventDefault();
    let JWT = localStorage.setItem
    loggedIn = false;
    $('#chart').remove();
    console.log('1234');
    newButtons();
    localStorage.clear();
}

export const handleDeleteChart = function(event){
    event.preventDefault();
    $('#singleChart').remove();
}

// changing from name to symbol
export async function changeName(symbol){
  const name = await axios({
       method: 'get',
       url:'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords='+ symbol +'&apikey=' + token,
   });
   let newSymbol = name.data["bestMatches"][0]["1. symbol"];
   
   return newSymbol;
   
}
export async function getName(symbol){
    const name = await axios({
         method: 'get',
         url:'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords='+ symbol +'&apikey=' + token,
     });
     let newSymbol = name.data["bestMatches"][0]["2. name"];
     return newSymbol;
    }
// Member Button handling functions
export const changeNewMember = function(event){
    event.preventDefault();
    let $memberButton = $('#memberButtons');
    $memberButton.replaceWith(`
                        <div id="memberButton">
                            <div class="field">
                                <div class="control">
                                    <input class="input" id="newUsername" type="text" placeholder="Create a username">
                                    <input class="input" id="newPassword" type="password" placeholder="Create a password">
                                    <button id="createAccount" class="button is-black is-fullwidth">Create Account</button>
                                    <button class="button is-danger is-fullwidth" id="cancelButton">Cancel</button> 
                                </div>
                            </div>
                        </div>`);
    console.log("change")
}



export const changeReturningMember = function(event){
    event.preventDefault();
    let $memberButton = $('#memberButtons');
    $memberButton.replaceWith(`
                        <div id="memberButton">
                            <div class="field">
                                <div class="control">
                                    <input class="input" id="returnUser" type="text" placeholder="Enter your username">
                                    <input class="input" id="returnPass" type="password" placeholder="Enter your password">
                                    <button class="button is-black is-fullwidth" id="loginButton">Login</button>
                                    <button class="button is-danger is-fullwidth" id="cancelButton">Cancel</button> 
                                </div>
                            </div>
                        </div>`);
}

export const newButtons = function(event){
    
    let $memberButton = $('#memberButton');
    $memberButton.replaceWith(`<div id="memberButtons">
                                    <button class="button is-small is-dark is-rounded" id="newMember">
                                    New Member
                                    </button>
                                    <button class="button is-small is-dark is-rounded" id="returnMember">
                                    Returning Member
                                    </button>
                                </div>`);
    console.log("here");
}

export async function postNewUser(){
    let userNameEntry = document.getElementById('newUsername').value;
    let userPassEntry = document.getElementById('newPassword').value;
    const postUser = await axios({
        method: 'post',
        url:'http://localhost:3000/account/create',
        data: {
            name: userNameEntry,
            pass: userPassEntry,
        }
    });
    let $memberButton = $('#memberButton');
    $memberButton.replaceWith(` <div id="memberButton">
                                    <div class="has-text-centered is-size-6">
                                        <p>Logged in as: ${userNameEntry}</p>
                                        <button id="logoutButton" class="button is-small is-danger is-light">Logout</button>    
                                    </div>
                                </div>`);
    loggedIn = true;
    console.log(postUser);
}

export async function loginUser(){
    let userNameEntry = document.getElementById('returnUser').value;
    let userPassEntry = document.getElementById('returnPass').value;
    const loginUser = await axios({
        method: 'post',
        url:'http://localhost:3000/account/login',
        data: {
            name: userNameEntry,
            pass: userPassEntry,
        }
    });
    localStorage.setItem('JWT', loginUser.data.jwt);
    loggedIn = true;
    let JWT = localStorage.getItem('JWT');
    console.log(JWT + ' in loginUser');
    let $memberButton = $('#memberButton');
    $memberButton.replaceWith(` <div id="memberButton">
                                    <div class="has-text-centered is-size-6">
                                        <p>Logged in as: ${userNameEntry}</p>
                                        <button id="logoutButton" class="button is-small is-danger is-light">Logout</button>    
                                    </div>
                                </div>`);

    console.log(loginUser);   
    return true;          
}
// Autocomplete stuff
// Credit to https://www.youtube.com/watch?v=1iysNUrI3lw&t=595s for this way of doing autocomplete
const $quoteName = document.getElementById('quoteName');
const $matchList = document.getElementById('match-list');

export const searchNames = async searchText => {
    const res = await fetch('companies.json');
    const names = await res.json();
    
    let matches = names.filter(company => {
        const regex = new RegExp(`^${searchText}`, 'gi');
        return company["Company Name"].match(regex) || company["Symbol"].match(regex);
    });
    if(searchText.length === 0){
        matches = [];
        $matchList.innerHTML = '';
    }
    addDropdown(matches);
};
const dropSym = '';
const addDropdown = matches => {
    if(matches.length > 0){
        const html = matches.map(match => `
            <div class="button" id="companyNameAuto">
            
            <h4>${match["Company Name"]} (${match["Symbol"]})</h4>
         
            </div>
        `).join('');
        $matchList.innerHTML = html;
    };
    
};
$quoteName.addEventListener('input', () => searchNames($quoteName.value));
// make input the clicked button value 
export const handleAutoClick = function(event){
    let input = $quoteName.value;
    renderCharts(input);
    document.getElementById('quoteName').value='';
    document.getElementById('match-list').innerHTML = `<div id="match-list">  </div>`;
}

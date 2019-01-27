//Form Html
let popupFormHtml = `
 <div id="modal" class="overlay"> <div class="popup"> <a class="close" href="#">&times;</a> <div class="popup-content"> <form id="surveyForm"> <h2>Dummy Survey</h2> <p class="intro">Welcome to the our dummy survey!</p><p class="message"></p><div class="tabs-container"> <div class="tab"> <div class="form-field"> <label for="userName">Name:</label> <input class="u-full-width user-input" type="text" placeholder="Your name" id="userName" name="Name" required> </div><div class="form-field field-email"> <label for="userEmail">E-mail:</label> <input class="u-full-width user-input" type="email" placeholder="Your e-mail address" id="userEmail" name="Email" required> </div></div><div class="tab"> <div class="form-field"> <label for="userAge">Age:</label> <select class="u-full-width user-input" id="userAge" name="Age" required> <option value="">--Select Age--</option> </select> </div><div class="form-field"> <label for="userAboutMe">About Me:</label> <textarea class="u-full-width user-input" placeholder="About me..." id="userAboutMe" name="AboutMe" required></textarea> </div></div><div class="tab"> <div class="form-field"> <label for="userAddress">Adress:</label> <input class="u-full-width user-input" type="text" placeholder="Address" id="userAddress" name="Address"> </div><div class="form-field"> <label>Gender:</label> <label> <input type="radio" name="Gender" value="male" class="user-input"> <span class="label-body">Male</span> </label> <label> <input type="radio" name="Gender" value="female" class="user-input"> <span class="label-body">Female</span> </label> </div></div><div class="tab"> <div class="form-field"> <label for="userFavouriteBook">Favourite book:</label> <input class="u-full-width user-input" type="text" placeholder="Favourite book" id="userFavouriteBook" name="FavouriteBook"> </div><div class="form-field checkboxex"> <label>Favourite colors:</label> <label> <input type="checkbox" class="user-input" name="FavouriteColor" value="Red"> <span class="label-body">Red</span> </label> <label> <input type="checkbox" class="user-input" name="FavouriteColor" value="Aqua"> <span class="label-body">Aqua</span> </label> <label> <input type="checkbox" class="user-input" name="FavouriteColor" value="Blue"> <span class="label-body">Blue</span> </label> <label> <input type="checkbox" class="user-input" name="FavouriteColor" value="Crimson"> <span class="label-body">Crimson</span> </label> </div></div></div><div class="buttons-section"> <div class="buttons-container"> <button type="button" id="prevBtn">Previous</button> <button type="button" class="button-primary" id="nextBtn">Next</button> </div></div><div class="steps-container"></div></form> </div></div></div>
`;

//Dictionaries
const modalActiveClass = 'modal-active';
const errorBoxClassName = 'message-error';
const thankYouMessage = 'Thank you!';

//app starts
createForm();
populateAgeDropdown();
generateStepsIndicators();
let currentTab = 0; // Current tab is set to be the first tab on init 

//Define UI variables
const modal = document.querySelector('#modal');
const closeBtn = document.querySelector('.close');

//Model (object) to bind the values to
let User = {
  Name: "",
  Email: "",
  Age: "",
  AboutMe: "",
  Address: "",
  Gender: "",
  FavouriteBook: "",
  FavouriteColor: [],
  TheHighestStepNumber: 0
}

document.addEventListener("DOMContentLoaded", function() { 
  loadEventListeners();
  
  readFromLocalStorage();

  if(readFromLocalStorage() != false) {
    setTimeout(() => {

      showTab(currentTab); // Display the current tab
    
        modal.classList.toggle(modalActiveClass);
    
      },2000);
  }

});

function loadEventListeners() {
  closeBtn.addEventListener('click', ()=> {
    modal.classList.toggle(modalActiveClass);
  })

  document.querySelector('#nextBtn').addEventListener('click', function() {
    nextPrev(1);
  });
  document.querySelector('#prevBtn').addEventListener('click', function() {
    nextPrev(-1);
  });
}

function createForm() {
  let body = document.querySelector('body');
  let formContainer = document.createElement('div');
  formContainer.innerHTML = popupFormHtml;
  body.appendChild(formContainer);
}

function populateAgeDropdown() {
  var ageDropdown = document.getElementById('userAge');
  const startAge = 10;

  for (var i = 10; i <= 100; i++) {
      var theOption = new Option;
      theOption.text = i;
      theOption.value = i;
      ageDropdown.options[i - startAge+1] = theOption;
  }

}

function generateStepsIndicators() {
  const steps = document.querySelectorAll('#modal .tab');
  const stepsContainer = document.querySelector('.steps-container');

  for(let i = 0; i < steps.length; i++) {
    let singeStepIndicator = document.createElement('span');
    singeStepIndicator.classList = "step";
    stepsContainer.appendChild(singeStepIndicator)
  }

}

function showTab(n) {
  // Display the specified tab of the form ...
  var allTabs = document.getElementsByClassName("tab");
  allTabs[n].classList.add('tab-active');

  // fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (allTabs.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
  
  fixStepIndicator(n)

}

function fixStepIndicator(n) {
  let steps = document.getElementsByClassName("step");
  for (let i = 0; i < steps.length; i++) {
    steps[i].className = steps[i].className.replace(" active", "");
  }
  steps[n].className += " active";
}

function nextPrev(n) {
  let collectionOfTabs = document.getElementsByClassName("tab");

  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;

  // Hide the current tab:
  if(collectionOfTabs[currentTab].classList.contains('tab-active')) {
    collectionOfTabs[currentTab].classList.remove('tab-active');
  }
  currentTab = currentTab + n;

  //bind the values to the User Object per each step
  saveTheValues();

  // show results if user reaches the last step
  if (currentTab >= collectionOfTabs.length) {
    showResults();
    
    return false;
  }
  
  // Otherwise, display the correct tab
  showTab(currentTab);
  
}

function validateForm() {
  let valid = true;
  
  let collectionOfTabs = document.getElementsByClassName("tab");
  let inputsToValidatePerSteps = collectionOfTabs[currentTab].getElementsByClassName("user-input");

  // A loop that checks every single input in the current tab/step and creates the error messages if needed:
  for (let i = 0; i < inputsToValidatePerSteps.length; i++) {
    
    const errorBox = document.createElement('p');
    errorBox.className = errorBoxClassName;

    const currentElement = inputsToValidatePerSteps[i];
    if (!currentElement.checkValidity()) {
      
      //remove error message if another one is present
      if(currentElement.nextSibling.className === errorBoxClassName) {
        currentElement.nextSibling.remove();
      }
      //and add a new error message
      currentElement.after(errorBox);
      errorBox.innerHTML = currentElement.validationMessage;
      currentElement.classList.add('invalid');
      valid = false;
    } 
    else {
      //if everything is ok delete the error messages
      currentElement.classList.remove('invalid');
      if(currentElement.nextSibling.className === errorBoxClassName) {
        currentElement.nextSibling.remove();
      }
      
    }
    
  }

  return valid; 
}


function showResults() {
  const popupContent = document.querySelector('.popup-content');
  popupContent.innerHTML = "";
  const resultsHeadline = document.createElement('h2');
  resultsHeadline.appendChild(document.createTextNode(thankYouMessage));
  popupContent.appendChild(resultsHeadline);

  const resultsTable = document.createElement('table');
  resultsTable.classList.add('u-full-width');
  const thead = document.createElement('thead');
  thead.innerHTML = "<th>Property</th><th>Details</th>";

  const tbody = document.createElement('tbody');

    Object.keys(User).forEach(function(property) {

      if(property != "TheHighestStepNumber") {
        let resultsTableRowHtml = `
        <tr>
          <td>${property}</td>
          <td>${User[property] != "" ? User[property] : "Not filled"}</td>
        </tr>`;
        tbody.innerHTML += resultsTableRowHtml;
      }

     
  });
  resultsTable.appendChild(thead);
  resultsTable.appendChild(tbody);
  popupContent.appendChild(resultsTable);

  //author
  let authorParagraph = document.createElement('p');
  authorParagraph.className = "about-author";
  authorParagraph.innerHTML = 'Made with &hearts; by <a href="https://www.linkedin.com/in/radoslaw-perczynski" target="_blank">Radoslaw Perczynski</a>';
  popupContent.appendChild(authorParagraph);

}

function saveTheValues() {
  let fields = document.querySelectorAll('.user-input');
  let userProperties = Object.keys(User);
  let arrayOfvalues = [];

  //first bind the values from all the inputs to the UserObject only if the name of the particular input matches the User object property
  for(let i = 0; i < userProperties.length; i++) {
   
    fields.forEach(function(field) {

      let userProperty = userProperties[i];

       if(field.name === userProperty) {
        
          if (field.type === "text" || 
          field.type === "textarea" || 
          field.type === "email" || 
          field.type === "select-one" ||
          field.type === "radio" && field.checked) 
          {
            User[userProperty] = field.value;
          } 
          else if (field.type === "checkbox" && typeof(User
            [userProperty]) === "object") {

              if(field.checked) {
                arrayOfvalues.push(field.value);
                
              }
              User[userProperty] = arrayOfvalues;
          } 
      }
    })
  }

  //save the whole object to the localstorage
  localStorage.setItem('userObject', JSON.stringify(User));

  //save the step only if the user made a progress in the form
  let userFromLocalStorage = JSON.parse(localStorage.getItem('userObject'))

  if(userFromLocalStorage.TheHighestStepNumber < currentTab) {
    User.TheHighestStepNumber = currentTab;
    localStorage.setItem('userObject', JSON.stringify(User));

  }

}

function readFromLocalStorage() {

  let userFromLocalStorage = JSON.parse(localStorage.getItem('userObject'))

  if(userFromLocalStorage === null) {
    return;
  } 

  // load the correct tab
  currentTab = userFromLocalStorage.TheHighestStepNumber;

  //pass the information to other function to not display the popup if the user submitted the survey last time
  let collectionOfTabs = document.getElementsByClassName("tab");
  if(currentTab === collectionOfTabs.length) {
    return false;
  }

  let fields = document.querySelectorAll('.user-input');

  let userProperties = Object.keys(userFromLocalStorage);
  
  //set correct values to the fields
  for(let i = 0; i < userProperties.length; i++) {
   
    fields.forEach(function(field) {
      let userProperty = userProperties[i];
       if(field.name === userProperty) {
        
          if(field.type === "text" || 
          field.type === "textarea" || 
          field.type === "email" || 
          field.type === "select-one") 
          {
            field.value = userFromLocalStorage[userProperty];
            
          }
          else if (field.type === "radio" && field.value === userFromLocalStorage[userProperty].toLowerCase()) {

            field.checked = true;
          } 
          else if (field.type === "checkbox" && typeof(userFromLocalStorage[userProperty]) === "object") {
            
            userFromLocalStorage[userProperty].forEach(function(c) {
              c === field.value ? field.checked = true : null;
            })
            
          }
      }

    })
  
  }
  saveTheValues();
};
let popupFormHtml = `
 <div id="modal" class="overlay"> <div class="popup"> <a class="close" href="#">&times;</a> <div class="popup-content"> <form id="surveyForm"> <h2>Dummy Survey</h2> <p class="intro">Welcome to the our dummy survey!</p><p class="message"></p><div class="tabs-container"> <div class="tab"> <div class="form-field"> <label for="userName">Name:</label> <input class="u-full-width user-input" type="text" placeholder="Your name" id="userName" name="Name" required> </div><div class="form-field"> <label for="userEmail">E-mail:</label> <input class="u-full-width user-input" type="email" placeholder="Your e-mail address" id="userEmail" name="Email" required> </div></div><div class="tab"> <div class="form-field"> <label for="userAge">Age:</label> <select class="u-full-width user-input" id="userAge" name="Age" required> <option value="">--Select Age--</option> </select> </div><div class="form-field"> <label for="userAboutMe">About Me:</label> <textarea class="u-full-width user-input" placeholder="About me..." id="userAboutMe" name="AboutMe" required></textarea> </div></div><div class="tab"> <div class="form-field"> <label for="userAddress">Adress:</label> <input class="u-full-width user-input" type="text" placeholder="Address" id="userAddress" name="Address"> </div><div class="form-field"> <label>Gender:</label> <label> <input type="radio" name="Gender" value="male" class="user-input"> <span class="label-body">Male</span> </label> <label> <input type="radio" name="Gender" value="female" class="user-input"> <span class="label-body">Female</span> </label> </div></div><div class="tab"> <div class="form-field"> <label for="userFavouriteBook">Favourite book:</label> <input class="u-full-width user-input" type="text" placeholder="Favourite book" id="userFavouriteBook" name="FavouriteBook"> </div><div class="form-field checkboxex"> <label>Favourite colors:</label> <label> <input type="checkbox" class="user-input" name="FavouriteColor" value="Red"> <span class="label-body">Red</span> </label> <label> <input type="checkbox" class="user-input" name="FavouriteColor" value="Aqua"> <span class="label-body">Aqua</span> </label> <label> <input type="checkbox" class="user-input" name="FavouriteColor" value="Blue"> <span class="label-body">Blue</span> </label> <label> <input type="checkbox" class="user-input" name="FavouriteColor" value="Crimson"> <span class="label-body">Crimson</span> </label> </div></div></div><div class="buttons-section"> <div class="buttons-container"> <button type="button" id="prevBtn" onclick="nextPrev(-1)">Previous</button> <button type="button" class="button-primary" id="nextBtn" onclick="nextPrev(1)">Next</button> </div></div><div class="steps-container"></div></form> </div></div></div>
`;

createForm();
populateAgeDropdown();
generateStepsIndicators();
let currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

//Define UI variables
const modal = document.querySelector('#modal');
const closeBtn = document.querySelector('.close');

document.addEventListener("DOMContentLoaded", function() { 
  setTimeout(() => {
    // modal.classList.toggle('modal-active');

    // document.querySelector('#prevBtn').addEventListener('click', nextPrev(-1));
    // document.querySelector('#nextBtn').addEventListener('click', nextPrev(1));


  },2000);

  closeBtn.addEventListener('click', ()=> {
    modal.classList.toggle('modal-active');
  })

  readFromLocalStorage();

 

  
});

const User = {
  Name: "",
  Email: "",
  Age: "",
  AboutMe: "",
  Address: "",
  Gender: "",
  FavouriteBook: "",
  FavouriteColor: [],
  TheHighestStep: 0
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
  var x = document.getElementsByClassName("tab");
  x[n].classList.add('tab-active');

  // fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
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
  var collectionOfTabs = document.getElementsByClassName("tab");

  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;

  // Hide the current tab:
  if(collectionOfTabs[currentTab].classList.contains('tab-active')) {
    collectionOfTabs[currentTab].classList.remove('tab-active');
  }
  currentTab = currentTab + n;

  saveTheValues();

  // if the last step
  if (currentTab >= collectionOfTabs.length) {
    showResults();
    
    return false;
  }
  
  // Otherwise, display the correct tab:
  showTab(currentTab);
  
}

function validateForm() {
  let valid = true;
  
  let collectionOfTabs = document.getElementsByClassName("tab");
  let inputsToValidatePerSteps = collectionOfTabs[currentTab].getElementsByClassName("user-input");

  // A loop that checks every input field in the current tab:
  for (let i = 0; i < inputsToValidatePerSteps.length; i++) {
    
    const errorBox = document.createElement('p');
    errorBox.className = 'message-error'
    const currentElement = inputsToValidatePerSteps[i];
    if (!currentElement.checkValidity()) {
      
      if(currentElement.nextSibling.className === "message-error") {
        currentElement.nextSibling.remove();
      }
      currentElement.after(errorBox);

      errorBox.innerHTML = currentElement.validationMessage;
      currentElement.classList.add('invalid');
      valid = false;
    } 
    else {
      currentElement.classList.remove('invalid');
      currentElement.classList.add('valid');
      if(currentElement.nextSibling.className === "message-error") {
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
  resultsHeadline.appendChild(document.createTextNode('Thank you for completing our survey!'));
  popupContent.appendChild(resultsHeadline);

  const resultsTable = document.createElement('table');
  resultsTable.classList.add('u-full-width');
  const thead = document.createElement('thead');
  thead.innerHTML = "<th>Property</th><th>Details</th>";

  const tbody = document.createElement('tbody');

    Object.keys(User).forEach(function(property) {
      let resultsTableRowHtml = `
      <tr>
        <td>${property}</td>
        <td>${User[property] != "" ? User[property] : "Not filled"}</td>
      </tr>`;
      tbody.innerHTML += resultsTableRowHtml;

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

  //first bind the values from all the inputs to the UserObject
  //if the name of input matches the User object property
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

  if(userFromLocalStorage.TheHighestStep < currentTab) {
    User.TheHighestStep = currentTab;
    localStorage.setItem('userObject', JSON.stringify(User));

  }


}

function readFromLocalStorage() {

  let userFromLocalStorage = JSON.parse(localStorage.getItem('userObject'))

  if(userFromLocalStorage === null) {
    return;
  } 

  // load the correct tab
  currentTab = userFromLocalStorage.TheHighestStep;
  let fields = document.querySelectorAll('.user-input');

  let userProperties = Object.keys(userFromLocalStorage);
  let arrayOfvalues = [];
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
};
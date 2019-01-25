


const modal = document.querySelector('#modal');
const closeBtn = document.querySelector('.close');

closeBtn.addEventListener('click', ()=> {
  modal.classList.toggle('modal-active');
})

setTimeout(() => {
  modal.classList.toggle('modal-active');
}) //dont forget to put 2 secs here


const user = {
  userName: "",
  userEmail: "",
  userAge: "",
  userAboutMe: "",
  userAddress: "",
  userGender: "",
  userFavouriteBook: "",
  userFavouriteColor: []
}


document.addEventListener("DOMContentLoaded", function(event) { 
  populateAgeDropdown();
  // generateStepsIndicators();


});

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
// function generateStepsIndicators() {
//   const steps = document.querySelectorAll('#modal .tab');
//   const stepsContainer = document.querySelector('.steps-container');

//   for(let i = 0; i < steps.length; i++) {
//     let singeStepIndicator = document.createElement('span');
//     singeStepIndicator.classList = "step";

//     stepsContainer.appendChild(singeStepIndicator)
//     console.log('step')
//   }

// }
 



//from w3s
var currentTab = 3; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
  // This function will display the specified tab of the form ...
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  // ... and fix the Previous/Next buttons:
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
  // ... and run a function that displays the correct step indicator:
  fixStepIndicator(n)
  //saveTheValues();
}

function saveTheValues() {
  let fields = document.querySelectorAll('.user-input');
  let userProperties = Object.keys(user);
  let arrayOfvalues = [];
  for(let i = 0; i < userProperties.length; i++) {
   
    fields.forEach(function(field) {

       if(field.name === userProperties[i]) {
        
          if(field.type === "text" || 
          field.type === "textarea" || 
          field.type === "email" || 
          field.type === "select-one" ||
          field.type === "radio" && field.checked) 
          {
            user[userProperties[i]] = field.value;
            //console.log(typeof  user[userProperties[i]]);
          } 
          else if (field.type === "checkbox" && field.checked && typeof(user[userProperties[i]]) === "object") {
            arrayOfvalues.push(field.value);
            user[userProperties[i]] = arrayOfvalues;
          }
          

      }


    })

  }


}



function nextPrev(n) {
  // This function will figure out which tab to display
  var collectionOfTabs = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  collectionOfTabs[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form... :
  if (currentTab >= collectionOfTabs.length) {
    //...the form gets submitted:
    //document.getElementById("surveyForm").submit();

    //instead of submitting the submit we will show another screen with all the detaial of the user.

    alert('submission the form.Show results.')
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
      if(currentElement.nextSibling.className === "message-error") {
        currentElement.nextSibling.remove();
      }
      
    }
    
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class to the current step:
  x[n].className += " active";
}
document.addEventListener('DOMContentLoaded', function() {
  retrieveFromStorage();
});

function retrieveFromStorage() {
  var websiteOptions = document.getElementsByClassName('websiteOptions');
  chrome.storage.local.get(function(response) {
    functionLoader(websiteOptions, response);
  });
};

function functionLoader(websiteOptions, response) {
  var date = new Date();
  trackCurrentWebsite(response);
  displayCalendar(date);
  displayCounters(response, date);
  displaySettings(websiteOptions, response);
  saveOnChange(websiteOptions, response);
};

function trackCurrentWebsite(response) {
  document.getElementById('track-website').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
      var currentTabURL = tab[0].url.match(/\/{2}(.*\.*\w+\.{1}\w+)\//)[1];
      var alreadyTracking = Object.keys(response).some(function(websiteURL) {
        return websiteURL == currentTabURL;
      });
      if (!alreadyTracking) {
        saveToStorage(response, currentTabURL, true);
      } else {
        displayFeedback('Already tracking');
      };
    });
  });
};

function saveOnChange(websiteOptions, response) {
  if (Object.keys(response).length == 0) {
    saveDefault(websiteOptions, response);
  };
  for (var i = 0; i < websiteOptions.length; i++) {
    websiteOptions[i].addEventListener('change', function(event) {
      saveToStorage(response, event.target.name, event.target.checked);
    });
  };
};

function saveDefault(websiteOptions, response) {
  for (var i = 0; i < websiteOptions.length; i++) {
    saveToStorage(response, websiteOptions[i].name, false);
  };
};

function saveToStorage(response, websiteURL, activeTracking) {
  var date = new Date();
  response[websiteURL] = {
    'tracking': activeTracking,
    'openTime': 0,
    'totalTime': 0,
    'trackDate': date.getDate()
  };
  chrome.storage.local.set(response, function(response) {
    displayFeedback('Saved!');
  });
};

function displayCalendar(date) {
  var monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];
  var dayHeader = document.getElementById('day');
  var dateHeader = document.getElementById('month-name');
  dateHeader.innerText = monthNames[date.getMonth()];
  dayHeader.innerText = date.getDate();
};

function displayCounters(response, date) {
  var websiteCounters = document.getElementsByClassName('websiteCounters');
  for (var i = 0; i < websiteCounters.length; i++) {
    var counter = websiteCounters[i].getAttribute('name');
    if (Object.keys(response).length > 0) {
      if (response[counter]['trackDate'] == date.getDate()) {
        var totalTime = response[counter]['totalTime'];
        websiteCounters[i].innerText = Math.floor(totalTime / 60) + " min.";
      } else {
        websiteCounters[i].innerText = "0 min.";
      };
    };
  };
};

function displaySettings(websiteOptions, response) {
  var registeredWebsites = Object.keys(response);
  var optionsDiv = document.getElementById('options');
  for (var web in registeredWebsites) {
    var newDiv = document.createElement('div');
    newDiv.setAttribute('id', registeredWebsites[web]);
    var newLabel = document.createElement('label');
    var newInput = document.createElement('input');
    newInput.setAttribute('type', 'checkbox');
    newInput.setAttribute('checked', response[registeredWebsites[web]]['tracking']);
    newInput.setAttribute('name', registeredWebsites[web]);
    newInput.setAttribute('class', 'websiteOptions');
    newLabel.innerText = registeredWebsites[web];
    optionsDiv.appendChild(newDiv);
    newDiv.appendChild(newInput);
    newDiv.appendChild(newLabel);
  };
};

function displayFeedback(feedback) {
  var feedbackField = document.getElementById('feedback');
  feedbackField.className = 'show';
  feedbackField.innerText = feedback;
  setTimeout(function() {
    feedbackField.className = 'hide';
  }, 2000);
};

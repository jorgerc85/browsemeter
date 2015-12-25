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
  displaySettings(websiteOptions, response);
  displayCounters(response, date);
  saveDefaultValues(websiteOptions, response);
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
  for (var i = 0; i < websiteOptions.length; i++) {
    websiteOptions[i].addEventListener('change', function(event) {
      saveToStorage(response, event.target.name, event.target.checked);
    });
  };
};

function saveDefaultValues(websiteOptions, response) {
  if (Object.keys(response).length == 0) {
    for (var i = 0; i < websiteOptions.length; i++) {
      saveToStorage(response, websiteOptions[i].name, false);
    };
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
  var websiteCounters = document.getElementsByClassName('counterSpan');
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
    optionsDiv.appendChild(newDiv);
    var newInput = document.createElement('input');
    newInput.setAttribute('type', 'checkbox');
    newInput.setAttribute('checked', response[registeredWebsites[web]]['tracking']);
    newInput.setAttribute('name', registeredWebsites[web]);
    newInput.setAttribute('class', 'websiteOptions');
    newDiv.appendChild(newInput);
    var newLabel = document.createElement('label');
    newLabel.innerText = registeredWebsites[web];
    newDiv.appendChild(newLabel);
    var counterSpan = document.createElement('span');
    counterSpan.setAttribute('name', registeredWebsites[web]);
    counterSpan.setAttribute('class', 'counterSpan');
    newLabel.appendChild(counterSpan);
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

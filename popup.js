document.addEventListener('DOMContentLoaded', function() {
  retrieveFromStorage();
});

function retrieveFromStorage() {
  var trackedWebsites = document.getElementsByClassName('trackedWebsites');
  chrome.storage.local.get(function(response) {
    functionLoader(trackedWebsites, response);
  });
};

function functionLoader(trackedWebsites, response) {
  var date = new Date();
  trackCurrentWebsite(response);
  saveDefaultValues(trackedWebsites, response);
  saveOnChange(trackedWebsites, response);
  displayCalendar(date);
  displayTrackedWebsites(trackedWebsites, response);
  displayCounters(response, date);
};

function trackCurrentWebsite(response) {
  document.getElementById('trackWebsiteButton').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
      var regexpURLMatch = tab[0].url.match(/\/{2}(.*\.*\w+\.{1}\w+)\//);
      if (regexpURLMatch === null) {
        displayFeedback('Invalid URL');
      } else {
        var currentTabURL = regexpURLMatch[1];
        var alreadyTracking = Object.keys(response).some(function(websiteURL) {
          return websiteURL == currentTabURL;
        });
        if (!alreadyTracking) {
          saveToStorage(response, currentTabURL, true);
        } else {
          displayFeedback('Already tracking');
        };
      };
    });
  });
};

function saveOnChange(trackedWebsites, response) {
  for (var i = 0; i < trackedWebsites.length; i++) {
    trackedWebsites[i].addEventListener('change', function(event) {
      saveToStorage(response, event.target.name, event.target.checked);
    });
  };
};

function saveDefaultValues(trackedWebsites, response) {
  if (Object.keys(response).length == 0) {
    for (var i = 0; i < trackedWebsites.length; i++) {
      saveToStorage(response, trackedWebsites[i].name, false);
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
  var dateHeader = document.getElementById('monthName');
  dateHeader.innerText = monthNames[date.getMonth()];
  dayHeader.innerText = date.getDate();
};

function displayTrackedWebsites(trackedWebsites, response) {
  var registeredWebsites = Object.keys(response);
  var trackedWebsitesDiv = document.getElementById('trackedWebsites');
  if (registeredWebsites.length > 0) {
    trackedWebsitesDiv.className = 'show';
    var optionsDiv = document.getElementById('options');
    for (var web in registeredWebsites) {
      var newDiv = document.createElement('div');
      newDiv.setAttribute('id', registeredWebsites[web]);
      optionsDiv.appendChild(newDiv);
      var newInput = document.createElement('input');
      newInput.setAttribute('type', 'checkbox');
      newInput.setAttribute('checked', response[registeredWebsites[web]]['tracking']);
      newInput.setAttribute('name', registeredWebsites[web]);
      newInput.setAttribute('class', 'trackedWebsites');
      newDiv.appendChild(newInput);
      var newLabel = document.createElement('label');
      newLabel.innerText = registeredWebsites[web];
      newDiv.appendChild(newLabel);
      var counterSpan = document.createElement('span');
      counterSpan.setAttribute('name', registeredWebsites[web]);
      counterSpan.setAttribute('class', 'counterSpan');
      newLabel.appendChild(counterSpan);
    };
  } else {
    trackedWebsitesDiv.className = 'hide';
  };
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

function displayFeedback(feedback) {
  var feedbackField = document.getElementById('feedback');
  feedbackField.className = 'show';
  feedbackField.innerText = feedback;
  setTimeout(function() {
    feedbackField.className = 'hide';
  }, 2000);
};

document.addEventListener('DOMContentLoaded', function() {
  retrieveFromStorage().then(function(response) {
    functionLoader(response);
  });
});

function retrieveFromStorage() {
  return new Promise(function(resolve) {
    chrome.storage.local.get(function(response) {
      resolve(response);
    });
  });
};

function functionLoader(response) {
  var trackedWebsites = document.getElementsByClassName('trackedWebsite');
  var date = new Date();
  trackCurrentWebsite(response);
  saveOnChange(response, trackedWebsites);
  displayCalendar(date);
  displayTrackedWebsites(response, date);
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
          retrieveFromStorage().then(function(response) {
            clearTrackedWebsitesDiv();
            var date = new Date();
            displayTrackedWebsites(response, date);
          });
        } else {
          displayFeedback('Already tracking');
        };
      };
    });
  });
};

function saveOnChange(response, trackedWebsites) {
  for (var i = 0; i < trackedWebsites.length; i++) {
    trackedWebsites[i].addEventListener('change', function(event) {
      saveToStorage(response, event.target.name, event.target.checked);
    });
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

function displayTrackedWebsites(response, date) {
  var registeredWebsites = Object.keys(response);
  var trackedWebsitesDiv = document.getElementById('trackedWebsitesDiv');
  if (registeredWebsites.length > 0) {
    trackedWebsitesDiv.className = 'show';
    for (var web in registeredWebsites) {
      constructTrackedWebsiteDiv(response, web, registeredWebsites, trackedWebsitesDiv);
      displayCounters(response, date);
    };
  } else {
    trackedWebsitesDiv.className = 'hide';
  };
};

function clearTrackedWebsitesDiv() {
  var trackedWebsites = document.getElementsByClassName('singleWebsite');
  for (var i = 0; i < trackedWebsites.length; i++) {
    trackedWebsites[i].remove();
  };
};

function constructTrackedWebsiteDiv(response, web, registeredWebsites, trackedWebsitesDiv) {
  var newDiv = document.createElement('div');
  newDiv.setAttribute('class', 'singleWebsite');
  newDiv.setAttribute('id', registeredWebsites[web]);
  trackedWebsitesDiv.appendChild(newDiv);
  var newInput = document.createElement('input');
  newInput.setAttribute('type', 'checkbox');
  newInput.setAttribute('checked', response[registeredWebsites[web]]['tracking']);
  newInput.setAttribute('name', registeredWebsites[web]);
  newInput.setAttribute('class', 'trackedWebsite');
  newDiv.appendChild(newInput);
  var newLabel = document.createElement('label');
  newLabel.innerText = registeredWebsites[web];
  newDiv.appendChild(newLabel);
  var counterSpan = document.createElement('span');
  counterSpan.setAttribute('name', registeredWebsites[web]);
  counterSpan.setAttribute('class', 'counterSpan');
  newLabel.appendChild(counterSpan);
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

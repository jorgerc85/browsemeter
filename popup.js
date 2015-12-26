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
  loadInterface(response);
  loadListeners(response);
};

function loadInterface(response) {
  displayCalendar();
  displayTrackedWebsites(response);
};

function loadListeners(response) {
  trackCurrentWebsite(response);
};

function trackCurrentWebsite(response) {
  document.getElementById('trackWebsiteButton').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
      var regexpURLMatch = tab[0].url.match(/\/{2}(.*\.*\w+\.{1}\w+)\//);
      if (regexpURLMatch === null) {
        displayFeedback('Invalid URL');
      } else {
        var currentTabURL = regexpURLMatch[1];
        var registeredWebsites = Object.keys(response);
        var trackedWebsitesDiv = document.getElementById('trackedWebsitesDiv');
        var alreadyTracking = registeredWebsites.some(function(websiteURL) {
          return websiteURL == currentTabURL;
        });
        if (!alreadyTracking) {
          response = buildTrackingObject(response, currentTabURL, true);
          saveToStorage(response);
          registeredWebsites.push(currentTabURL);
          var newWebsiteIndex = registeredWebsites.length - 1;
          constructSingleWebsiteDiv(response, newWebsiteIndex, registeredWebsites, trackedWebsitesDiv);
        } else {
          displayFeedback('Already tracking');
        };
      };
    });
  });
};

function saveOnChange(response, websiteCheckbox) {
  websiteCheckbox.addEventListener('change', function(event) {
    response = buildTrackingObject(response, event.target.name, event.target.checked);
    saveToStorage(response);
  });
};

function saveToStorage(response) {
  chrome.storage.local.set(response, function(response) {
    displayFeedback('Saved!');
  });
};

function buildTrackingObject(response, websiteURL, activeTracking) {
  var date = new Date();
  response[websiteURL] = {
    'tracking': activeTracking,
    'openTime': 0,
    'totalTime': 0,
    'trackDate': date.getDate()
  };
  return response;
};

function displayCalendar(date) {
  var date = new Date();
  var monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];
  var dayHeader = document.getElementById('day');
  var dateHeader = document.getElementById('monthName');
  dateHeader.innerText = monthNames[date.getMonth()];
  dayHeader.innerText = date.getDate();
};

function displayTrackedWebsites(response) {
  var registeredWebsites = Object.keys(response);
  var trackedWebsitesDiv = document.getElementById('trackedWebsitesDiv');
  if (registeredWebsites.length > 0) {
    trackedWebsitesDiv.className = 'show';
    for (var web in registeredWebsites) {
      constructSingleWebsiteDiv(response, web, registeredWebsites, trackedWebsitesDiv);
    };
  } else {
    trackedWebsitesDiv.className = 'hide';
  };
};

function constructSingleWebsiteDiv(response, web, registeredWebsites, trackedWebsitesDiv) {
  var singleWebsiteDiv = document.createElement('div');
  singleWebsiteDiv.setAttribute('class', 'singleWebsite');
  singleWebsiteDiv.setAttribute('id', registeredWebsites[web]);
  trackedWebsitesDiv.appendChild(singleWebsiteDiv);
  var websiteCheckbox = document.createElement('input');
  websiteCheckbox.setAttribute('type', 'checkbox');
  websiteCheckbox.setAttribute('checked', response[registeredWebsites[web]]['tracking']);
  websiteCheckbox.setAttribute('name', registeredWebsites[web]);
  websiteCheckbox.setAttribute('class', 'websiteCheckbox');
  singleWebsiteDiv.appendChild(websiteCheckbox);
  var websiteLabel = document.createElement('label');
  websiteLabel.innerText = registeredWebsites[web];
  singleWebsiteDiv.appendChild(websiteLabel);
  var counterSpan = document.createElement('span');
  counterSpan.setAttribute('name', registeredWebsites[web]);
  counterSpan.setAttribute('class', 'counterSpan');
  websiteLabel.appendChild(counterSpan);
  saveOnChange(response, websiteCheckbox);
  displayCounter(response, counterSpan);
};

function displayCounter(response, counterSpan) {
  var date = new Date();
  var counter = counterSpan.getAttribute('name');
  if (Object.keys(response).length > 0) {
    if (response[counter]['trackDate'] == date.getDate()) {
      var totalTime = response[counter]['totalTime'];
      counterSpan.innerText = Math.floor(totalTime / 60) + " min.";
    } else {
      counterSpan.innerText = "0 min.";
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

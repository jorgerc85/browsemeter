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
        var alreadyTracking = registeredWebsites.some(function(websiteURL) {
          return websiteURL == currentTabURL;
        });
        if (!alreadyTracking) {
          response = buildTrackingObject(response, currentTabURL, true);
          saveToStorage(response);
          registeredWebsites.push(currentTabURL);
          updateOnNewTrack(response, registeredWebsites);
        } else {
          displayFeedback('Already tracking');
        };
      };
    });
  });
};

function updateOnNewTrack(response, registeredWebsites) {
  var trackedWebsitesDiv = document.getElementById('trackedWebsitesDiv');
  var newWebsiteIndex = registeredWebsites.length - 1;
  if (trackedWebsitesDiv.className == 'hide') {
    trackedWebsitesDiv.className = 'show';
  };
  constructSingleWebsiteDiv(response, newWebsiteIndex, registeredWebsites, trackedWebsitesDiv);
};

function toggleTracking(response, trackToggle) {
  trackToggle.addEventListener('click', function(event) {
    var toggledWebsite = event.target.id;
    response[toggledWebsite]['tracking'] = !response[toggledWebsite]['tracking'];
    saveToStorage(response);
    event.target.classList.toggle('icon-pause2');
    event.target.classList.toggle('icon-play3');
  });
};

// In order to remove an attribute of response, loca storage has to be cleared.
// Otherwise, local storage will only update the attributes that are set for save.
function removeWebsiteFromTracking(response, removeButton) {
  removeButton.addEventListener('click', function(event) {
    chrome.storage.local.clear();
    delete response[event.target.id];
    saveToStorage(response);
    removeSingleWebsiteDiv(event.target.id);
  });
};

function removeSingleWebsiteDiv(singleWebsiteId) {
  var trackedWebsitesDiv = document.getElementById('trackedWebsitesDiv');
  var singleWebsiteDiv = document.getElementById(singleWebsiteId);
  trackedWebsitesDiv.removeChild(singleWebsiteDiv);
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
  var trackingWebsite = response[websiteURL] !== undefined;
  var totalTime = (trackingWebsite) ? response[websiteURL]['totalTime'] : 0;
  var date = new Date();
  response[websiteURL] = {
    'tracking': activeTracking,
    'openTime': 0,
    'totalTime': totalTime,
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

  var websiteURLDiv = document.createElement('div');
  websiteURLDiv.setAttribute('class', 'websiteURLDiv');
  singleWebsiteDiv.appendChild(websiteURLDiv);

  var websiteCheckbox = document.createElement('input');
  websiteCheckbox.setAttribute('type', 'checkbox');
  websiteCheckbox.setAttribute('name', registeredWebsites[web]);
  websiteCheckbox.setAttribute('class', 'websiteCheckbox');
  websiteCheckbox.checked = response[registeredWebsites[web]]['tracking'];
  websiteURLDiv.appendChild(websiteCheckbox);
  var websiteLabel = document.createElement('label');
  websiteLabel.innerText = registeredWebsites[web];
  websiteURLDiv.appendChild(websiteLabel);

  var counterDiv = document.createElement('div');
  counterDiv.setAttribute('class', 'counterDiv');
  singleWebsiteDiv.appendChild(counterDiv);

  var counterSpan = document.createElement('span');
  counterSpan.setAttribute('name', registeredWebsites[web]);
  counterSpan.setAttribute('class', 'counterSpan');
  counterDiv.appendChild(counterSpan);

  var actionDiv = document.createElement('div');
  actionDiv.setAttribute('class', 'actionDiv');
  singleWebsiteDiv.appendChild(actionDiv);

  var trackToggle = document.createElement('div');
  trackToggle.setAttribute('class', 'trackToggle actionButton');
  var trackingWebsite = response[registeredWebsites[web]]['tracking'];
  if (trackingWebsite) {
    trackToggle.classList.add('icon-pause2');
  } else {
    trackToggle.classList.add('icon-play3');
  };
  trackToggle.setAttribute('id', registeredWebsites[web]);
  actionDiv.appendChild(trackToggle);
  var removeButton = document.createElement('div');
  removeButton.setAttribute('class', 'removeButton actionButton icon-cross');
  removeButton.setAttribute('id', registeredWebsites[web]);
  actionDiv.appendChild(removeButton);

  singleWebsiteDivBehaviors(response, websiteCheckbox, counterSpan, trackToggle, removeButton);
};

function singleWebsiteDivBehaviors(response, websiteCheckbox, counterSpan, trackToggle, removeButton) {
  saveOnChange(response, websiteCheckbox);
  displayCounter(response, counterSpan);
  removeWebsiteFromTracking(response, removeButton);
  toggleTracking(response, trackToggle);
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

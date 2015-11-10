document.addEventListener('DOMContentLoaded', function() {
  retrieveFromStorage();
});

function getCurrentTabURL() {
  chrome.tabs.query({active: true, currentWindow: true}, function(response) {
    var currentTabURL = response[0].url.match(/\/{2}(.*\.*\w+\.{1}\w+)\//)[1];
  });
};

function retrieveFromStorage() {
  var websiteOptions = document.getElementsByClassName('websiteOptions');
  chrome.storage.local.get(function(response) {
    counterDisplay(response);
    settingsDisplay(websiteOptions, response);
    saveOnChange(websiteOptions, response);
  });
};

function counterDisplay(response) {
  var monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];
  var date = new Date();
  var websiteCounters = document.getElementsByClassName('websiteCounters');
  var dayHeader = document.getElementById('day');
  var dateHeader = document.getElementById('month-name');
  for (var i = 0; i < websiteCounters.length; i++) {
    var counter = websiteCounters[i].getAttribute('name');
    dateHeader.innerText = monthNames[date.getMonth()];
    dayHeader.innerText = date.getDate();
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

function settingsDisplay(websiteOptions, response) {
  for (var i = 0; i < websiteOptions.length; i++) {
    var checkboxName = websiteOptions[i].getAttribute('name');
    if (Object.keys(response).length > 0) {
      if (response[checkboxName]['tracking'] == true) {
        websiteOptions[i].setAttribute('checked', '');
      };
    };
  };
};

function saveOnChange(websiteOptions, response) {
  if (Object.keys(response).length == 0) {
    saveDefault(websiteOptions, response);
  };
  for (var i = 0; i < websiteOptions.length; i++) {
    websiteOptions[i].addEventListener('change', function(event) {
      var date = new Date();
      response[event.target.name] = {
        'tracking': event.target.checked,
        'openTime': 0,
        'totalTime': 0,
        'trackDate': date.getDate()
      };
      chrome.storage.local.set(response, function(response) {
        console.log("saved");
      });
    });
  };
};

function saveDefault(websiteOptions, response) {
  for (var i = 0; i < websiteOptions.length; i++) {
    var date = new Date();
    response[websiteOptions[i].name] = {
      'tracking': false,
      'openTime': 0,
      'totalTime': 0,
      'trackDate': date.getDate()
    };
    chrome.storage.local.set(response, function(response) {
      console.log("dafault saved");
    });
  };
};
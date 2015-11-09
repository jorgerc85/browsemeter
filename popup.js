document.addEventListener('DOMContentLoaded', function() {
  retrieveFromStorage();
});

function retrieveFromStorage() {
  chrome.storage.local.get(function(response) {
    counterDisplay(response);
    settingsDisplay(response);
    saveOnChange(response)
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

function settingsDisplay(response) {
  var websiteOptions = document.getElementsByClassName('websiteOptions');
  for (var i = 0; i < websiteOptions.length; i++) {
    var checkboxName = websiteOptions[i].getAttribute('name');
    if (response[checkboxName]['tracking'] == true) {
      websiteOptions[i].setAttribute('checked', '');
    };
  };
};

function saveOnChange(response) {
  var websiteOptions = document.getElementsByClassName('websiteOptions');
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
}
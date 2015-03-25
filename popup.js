document.addEventListener('DOMContentLoaded', function() {
  retrieveFromStorage();
  var websiteOptions = document.getElementsByClassName('websiteOptions');
  for (var i = 0; i < websiteOptions.length; i++) {
    websiteOptions[i].addEventListener('change', function(event) {
      chrome.storage.local.get(function(response) {
        response[event.target.name] = {
          'tracking': event.target.checked,
          'totalTime': 0
        };
        chrome.storage.local.set(response, function(response) {
          console.log("saved");
        });
      });
    });
  };
});

function retrieveFromStorage() {
  chrome.storage.local.get(function(response) {
    counterDisplay(response);
    settingsDisplay(response);
  });
};

function counterDisplay(response) {
  var websiteCounters = document.getElementsByClassName('websiteCounters');
  for (var i = 0; i < websiteCounters.length; i++) {
    var counter = websiteCounters[i].getAttribute('name');
    var totalTime = response[counter]['totalTime'];
    websiteCounters[i].innerText = Math.floor(totalTime / 60) + " min.";
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
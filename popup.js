document.addEventListener('DOMContentLoaded', function() {
  counterDisplay();
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

function counterDisplay() {
  chrome.storage.local.get(function(response) {
    var websiteCounters = document.getElementsByClassName('websiteCounters');
    for (var i = 0; i < websiteCounters.length; i++) {
      var counter = websiteCounters[i].getAttribute('name');
      var totalTime = response[counter]['totalTime'];
      websiteCounters[i].innerText = timeFormat(totalTime);
    };
  });
};

function timeFormat(totalTime) {
  minutes = Math.floor(totalTime / 60);
  seconds = Math.floor(((totalTime / 60) - minutes) * 60);
  return minutes + ":" + seconds;
};
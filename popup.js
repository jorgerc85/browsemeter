document.addEventListener('DOMContentLoaded', function() {
  var websiteOptions = document.getElementsByClassName('websiteOptions')
  for (var i = 0; i < websiteOptions.length; i++) {
    websiteOptions[i].addEventListener('change', function(event) {
      chrome.storage.local.get(function(response) {
        response[event.target.name] = {
          'tracking': event.target.checked,
          'totalTime': 0
        };
        chrome.storage.local.set(response, function(response) {
          console.log("saved")
        });
      });
    })
  };
});

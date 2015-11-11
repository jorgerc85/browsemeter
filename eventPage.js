chrome.runtime.onMessage.addListener(function(message, sender) {
  var website = sender.url.match(/\/{2}(.*\.*\w+\.{1}\w+)\//)[1]
  switch (message.tabState) {
    case "opening":
      saveOpeningTime(website, message)
      break;
    case "running":
      switch (message.tabVisibility) {
        case true:
          saveOpeningTime(website, message)
          break;
        case false:
          updateTotalTime(website, message)
          break;
      }
      break;
    case "closing":
      if (message.tabVisibility == "visible") {
        updateTotalTime(website, message)
      }
      break;
  }
});

function saveOpeningTime(website, message) {
  chrome.storage.local.get(website, function(response) {
    if (response[website] !== undefined) {
      if (response[website]['tracking'] == true) {
        response[website]['openTime'] = message.time
        chrome.storage.local.set(response, function(response) {
          console.log("saved")
        });
      };
    };
  });
};

function updateTotalTime(website, message) {
  chrome.storage.local.get(website, function(response) {
    if (response[website] !== undefined) {
      var openTime = response[website]['openTime'];
      if (response[website]['tracking'] == true && openTime != 0) {
        var date = new Date();
        if (response[website]['trackDate'] == date.getDate()) {
          var partialTime = (message.time - openTime) / 1000;
          response[website]['totalTime'] += partialTime;
        } else {
          response[website]['totalTime'] = 0;
        };
        response[website]['trackDate'] = date.getDate();
        chrome.storage.local.set(response, function(response) {
          console.log("saved")
        });
      };
    };
  });
};

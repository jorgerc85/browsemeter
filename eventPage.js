chrome.runtime.onMessage.addListener(function(message, sender) {
  website = sender.url.match(/\/{2}\w+.(\w+.{1}\w+)\//)[1]
  switch (message.tabState) {
    case "opening":
      saveOpeningTime(website, message)
      break;
    case "running":
      switch (message.tabVisibility) {
        case "visible":
          saveOpeningTime(website, message)
          break;
        case "hidden":
          chrome.storage.local.get(website, function(response) {
            totalTime = (message.time - response[website]['openTime']) / 1000
            response[website]['totalTime'] += totalTime
            chrome.storage.local.set(response, function(response) {
              console.log("saved")
            });
          });
          break;
      }
      break;
    case "closing":
      chrome.storage.local.get(website, function(response) {
        totalTime = (message.time - response[website]['openTime']) / 1000
        response[website]['totalTime'] += totalTime
        chrome.storage.local.set(response, function(response) {
          console.log("saved")
        });
      });
      break;
  }
});

function saveOpeningTime(website, message) {
  chrome.storage.local.get(function(info) {
    info[website]['openTime'] = message.time
    chrome.storage.local.set(info, function(info) {
      console.log("saved")
    });
  });
}

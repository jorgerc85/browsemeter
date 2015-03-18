chrome.runtime.onMessage.addListener(function(message, sender) {
  website = sender.url.match(/\/{2}\w+.(\w+.{1}\w+)\//)[1]
  switch (message.tabState) {
    case "opening":
      chrome.storage.local.get(function(info) {
        info[website]['openTime'] = message.time
        chrome.storage.local.set(info, function(info) {
          console.log("saved")
        });
      });
      break;
    case "running":
      switch (message.tabVisibility) {
        case "visible":
          chrome.storage.local.get(function(info) {
            info[website]['openTime'] = message.time
            chrome.storage.local.set(info, function(info) {
              console.log("saved")
            });
          });
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
      chrome.storage.local.get(function(info) {
        console.log(info)
      });
      break;
  }
});

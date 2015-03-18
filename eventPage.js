chrome.runtime.onMessage.addListener(function(message, sender) {
  website = sender.url.match(/\/{2}\w+.(\w+.{1}\w+)\//)[1]
  switch (message.tabState) {
    case "opening":
      savingInfo = { 'openTime': message.time }
      chrome.storage.local.get(function(info) {
        info[website] = savingInfo
        chrome.storage.local.set(info, function(info) {
          console.log("saved")
        });
      });
      break;
    case "running":
      switch (message.tabVisibility) {
        case "visible":
          break;
        case "hidden":
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

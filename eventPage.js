chrome.runtime.onMessage.addListener(function(message, sender) {
  console.log(message)
  website = sender.url.match(/\/\/(\S+)\//)[1]
});

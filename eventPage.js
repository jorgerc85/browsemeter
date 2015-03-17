chrome.runtime.onMessage.addListener(function(message, sender) {
  console.log(message)
  console.log(sender)
});
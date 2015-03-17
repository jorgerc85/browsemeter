window.onload = function(event) {
  var tabVisibility = document.visibilityState;
  var message = { 'tabState': tabState, 'tabVisibility': tabVisibility, 'time': event.timeStamp };
  chrome.runtime.sendMessage(message);

};
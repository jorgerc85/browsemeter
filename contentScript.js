window.onload = function(event) {
  sendMessage("opening", document.visibilityState, event.timeStamp)

};

function sendMessage(tabState, tabVisibility, time) {
  var message = { 'tabState': tabState, 'tabVisibility': tabVisibility, 'time': time };
  chrome.runtime.sendMessage(message);
};
window.onload = function(event) {
  sendMessage("opening", document.visibilityState, event.timeStamp);

  document.addEventListener("visibilitychange", function(event) {
    sendMessage("running", document.visibilityState, event.timeStamp);
  });

  window.addEventListener("beforeunload", function (event) {
    sendMessage("closing", document.visibilityState, event.timeStamp);
  });
};

function sendMessage(tabState, tabVisibility, time) {
  var message = { 'tabState': tabState, 'tabVisibility': tabVisibility, 'time': time };
  chrome.runtime.sendMessage(message);
};
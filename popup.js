document.addEventListener('DOMContentLoaded', function() {
  websiteOptions = document.getElementsByClassName('websiteOptions')
  for (var i = 0; i < websiteOptions.length; i++) {
    websiteOptions[i].addEventListener('change', function() {
      console.log('changed!')
    })
  };
});

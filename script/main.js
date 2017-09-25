;(function () { /* Bind #nav_toggle click event */
  document.addEventListener('DOMContentLoaded', function () {
    var button = document.getElementById('nav_toggle')
    var menu = document.getElementById('nav_menu')

    button.addEventListener('click', function (event) {
      if (button.classList.toggle('is-active')) {
        menu.classList.add('is-active')
      } else {
        menu.classList.remove('is-active')
      }
    })
  })
})();

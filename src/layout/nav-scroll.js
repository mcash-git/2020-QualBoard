export class NavScroll {
  constructor() {
    const docElem = document.documentElement;
    let didScroll = false;
    const changeHeaderOn = 300;

    function getScrollY() {
      return window.pageYOffset || docElem.scrollTop;
    }

    function scrollPage() {
      const header = document.querySelector('.navbar-content');
      const scrollY = getScrollY();
      if (scrollY >= changeHeaderOn) {
        header.classList.add('navbar-shrink');
      } else {
        header.classList.remove('navbar-shrink');
      }
      didScroll = false;
    }

    function init() {
      window.addEventListener('scroll', () => {
        if (!didScroll) {
          didScroll = true;
          scrollPage();
        }
      }, false);
    }
    init();
  }
}

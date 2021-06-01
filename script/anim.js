var header = document.getElementById('header');
var headerH1 = document.getElementById('headerH1');

window.onScroll = () => {
  if (document.body.scrollTop > 60 || document.documentElement.scrollTop > 60) {
    header.style.padding = "5px 10px";
    headerH1.style.fontSize = "20px";
  } else {
    header.style.padding = "10px 20px";
    headerH1.style.fontSize = "30px";
  }
};

$(document).ready(function(){
    $('#slideshow .slick').slick(
      {dots: true,
  prevArrow: false,
  nextArrow: false,
    autoplay: true,
    autoplaySpeed: 2500,}
  );

  });

$('.autoplay').slick({
slidesToShow: 3,
slidesToScroll: 1,
autoplay: true,
autoplaySpeed: 2500,
});
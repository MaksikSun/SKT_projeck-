//скрытие при нажатии на контакт
document.getElementById("select_contact").addEventListener("click", function() {
  var gglmap = document.querySelector('.gglmap');
  var form = document.querySelector('.form');
  gglmap.style.opacity = '0';
  setTimeout(function() {
    gglmap.style.display = 'none';
    form.style.display = 'block';
    setTimeout(function() {
      form.style.opacity = '1';
    }, 50);
  }, 100);
});

//скрытие при нажатии на карту
document.getElementById("select_map").addEventListener("click", function() {
  var gglmap = document.querySelector('.gglmap');
  var form = document.querySelector('.form');
  form.style.opacity = '0';
  setTimeout(function() {
    form.style.display = 'none';
    gglmap.style.display = 'block';
    setTimeout(function() {
      gglmap.style.opacity = '1';
    }, 50);
  }, 100);
});



//aнимация тригер-элементов
function isElementInViewport(element) {
  var rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

var elementsToShow = document.querySelectorAll('.cardT');

function loop() {

  elementsToShow.forEach(function (element) {
    if (isElementInViewport(element)) {
      element.classList.add('show');
    }
  });

  requestAnimationFrame(loop);
}

loop();




//прелоудер

window.addEventListener('load', function() {
  var preloader = document.getElementById('preloader');
  preloader.style.display = 'none';
});



//Обработка галареи

const carousel = document.querySelector(".carousel");
firstImg = carousel.querySelectorAll("img")[0];
arrowIcons = document.querySelectorAll(".wrapper i");

let isDragStart = false, isDragging = false, prevPageX, prevScrollLeft, positionDiff;



const showHideIcons = () => {
  // showing and hiding prev/next icon according to carousel scroll left value
  let scrollWidth = carousel.scrollWidth - carousel.clientWidth; //getting max scrollable width
  arrowIcons[0].style.display = carousel.scrollLeft == 0 ? "none" : "block";
  arrowIcons[1].style.display = carousel.scrollLeft == scrollWidth ? "none" : "block";
}

arrowIcons.forEach(icon => {
  icon.addEventListener("click", () => {
    // if clicked icon is left, reduce width value from the carousel scroll left else add to it
    let firstImgWidth =firstImg.clientWidth + 14; // getting first img width & adding 14 margin value
    carousel.scrollLeft += icon.id == "left" ? -firstImgWidth : firstImgWidth;
    setTimeout(() => showHideIcons(), 60);//calling showHideIcons after 60ms
  });
});

const autoSlide = () =>{
  //if there is no image left to scroll then return from here
  if(carousel.scrollLeft == (carousel.scrollWidth - carousel.clientWidth)) return;
//making positionDiff value to positive
  positionDiff = Math.abs(positionDiff);
  let firstImgWidth = firstImg.clientWidth + 14;
  // getting difference value that needs to add or reduce from carousel left to take middle img center
  let valDifference = firstImgWidth - positionDiff;

  if(carousel.scrollLeft > prevScrollLeft){
    // if user is scrolling to the right
    return carousel.scrollLeft += positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
  }
  //if user is scrolling to the left
  carousel.scrollLeft -= positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
}

const dragStart = (e) =>{
  //updatating global variables value on mouse down event
  isDragStart = true;
  prevPageX = e.pageX || e.touches[0].pageX;
  prevScrollLeft = carousel.scrollLeft;
}

const dragging = (e) =>{
  //scrolling images/carousel to left according to mouse pointer
  if(!isDragStart) return;
  e.preventDefault();
  isDragging = true;
  carousel.classList.add("dragging");
  positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
  carousel.scrollLeft = prevScrollLeft - positionDiff;
  showHideIcons();

}

const dragStop = () => {
  isDragStart = false;
  carousel.classList.remove("dragging");
  if(!isDragging) return;
  isDragging = false;
  autoSlide();
}

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("touchstart", dragStart);

carousel.addEventListener("mousemove", dragging);
carousel.addEventListener("touchmove", dragging);

carousel.addEventListener("mouseup", dragStop);
carousel.addEventListener("mouseleave", dragStop);
carousel.addEventListener("touchend", dragStop);







// ОБРАБОТКА ФОРМЫ

"use strict"

document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('form');
    form.addEventListener('submit', formSend);

    async function formSend(e){
      e.preventDefault();

      let error = formValidate(form);

      let formDate = new FormDate(form);
      formDate.append('image', formImage.files[0]);


      if (error===0){
        form.classList.add('_sending');

        let response = await fetch('sendmail.php',{
          method: 'POST',
          body: formDate
        });
        if(response.ok){
          let result = await response.json();
          alert(result.message);
          formPreview.innerHTML = '';
          form.reset();
          alert("all okey");
          form.classList.remove('_sending');
        }else {
          alert("Error send form");
          form.classList.remove('_sending');
        }

      }else {
          alert('Fil the Fiealds');
      }
    }

    function formValidate(form){
      let error = 0;
      let formReq = document.querySelectorAll('._req');


      for (let index = 0; index < formReq.length; index++){
        const input = formReq[index];
        formRemoveError(input);

        if(input.classList.contains('_email')){
          if (emailTest(input)) {
            formAddError(input);
            error++;
          }
        }else if(input.getAttribute("type") === "checkbox" && input.checked === false){
          formAddError(input);
          error++;
        }else {
          if (input.value === ''){
            formAddError(input);
            error++;
          }
        }


      }
      return error ++;
    }

    function formAddError(input){
      input.parentElement.classList.add('error');
      input.classList.add('_error');
    }
    function formRemoveError(input){
      input.parentElement.classList.remove('_error');
      input.classList.remove('_error');
    }

    //check simbols in Email
    function emailTest(input){
      return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }

    //add input(file) to variables
    const formImage = document.getElementById('formImage');
    const formPreview = document.getElementById('formPreview');

    formImage.addEventListener('change', () =>{
      uploadFile(formImage.files[0]);
    });

    function uploadFile(file) {
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/pdf', 'document/doc',].includes(file.type)) {
        alert('Choose diferent tipe of document');
        formImage.value = '';
        return;
      }
      if (file.size > 2 * 1024 * 1024){
        alert('File shuld be les then 2MB');
        return;
      }

      var reader = new FileReader();
      reader.onload = function(e) {
        formPreview.innerHTML = `<img src="${e.target.result}" alt = "Photo">`;
      };
      reader.onerror = function (e){
        alert('Error Load');
      };
      reader.readAsDataURL(file);
    }
});








///скрол по якорям
const anchors = document.querySelectorAll('a[href*="#"]');

for (let anchor of anchors) {
  anchor.addEventListener("click", function(event) {
    event.preventDefault();
    const blockID = anchor.getAttribute('href');
    const targetBlock = document.querySelector('' + blockID);
    if (targetBlock) {
      targetBlock.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
}




//скролл выпадающей кнопки

function backToTop() {
  let button = $('.back-to-top');
  let screenHeight = $(window).height();

  $(window).on('scroll', () => {
    if ($(this).scrollTop() > screenHeight) {
      button.fadeIn('slow');
    } else {
      button.fadeOut('slow');
    }
  });

  button.on('click', (e) => {
    e.preventDefault();
    $('html').animate({scrollTop: 0}, 0);
  })
}

$(document).ready(() => {
  $('.back-to-top').hide();
  backToTop();
});




const mapLink = document.querySelector('.select_form .sel_item[href="#"]');
const overlay = document.createElement('div');
overlay.classList.add('overlay');
document.body.appendChild(overlay);

function showMap() {
  overlay.style.display = 'block';
  document.body.classList.add('no-scroll');
}

function hideMap() {
  overlay.style.display = 'none';
  document.body.classList.remove('no-scroll');
}

mapLink.addEventListener('click', showMap);

overlay.addEventListener('click', hideMap);




///Добавление карты
// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init);

function init() {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    let mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 13,

        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng(51.749981,19.4507282,14.27), // New York

        // How you would like to style the map.
        // This is where you would paste any style found on Snazzy Maps.
        styles: [{"featureType":"all","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"administrative.country","elementType":"labels.text.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#c4c4c4"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#f3db2e"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21},{"visibility":"on"}]},{"featureType":"poi.business","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#c31b67"},{"saturation":"12"},{"visibility":"on"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#cb7432"},{"lightness":"0"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"},{"visibility":"on"}]},{"featureType":"road.highway","elementType":"labels.text.stroke","stylers":[{"color":"#cb7432"},{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#575757"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"labels.text.stroke","stylers":[{"color":"#2c2c2c"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#999999"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}]
    };

    // Get the HTML DOM element that will contain your map
    // We are using a div with id="map" seen below in the <body>
    let mapElement = document.querySelector('.real_map');

    // Create the Google Map using our element and options defined above
    let map = new google.maps.Map(mapElement, mapOptions);

    // Let's also add a marker while we're at it
    let marker = new google.maps.Marker({
        position: new google.maps.LatLng(51.7510331,19.4508261,16.27),
        map: map,
        title: 'Snazzy!'
    });
}
//document.querySelectorAll('.galery_sec img').forEach(img =>(
//  img.onclick = () => {
//    document.querySelector('.pop-up').style.display = 'block';
//    document.querySelector('.pop-up img'). src = img.getAttribute('src');
//}
//});

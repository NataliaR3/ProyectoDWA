locateMe();
function comprar(value) {
  console.log(value);
  Swal.fire({
    title: "Confimar compra",
    showDenyButton: true,
    confirmButtonText: `Si, por supuesto!`,
    denyButtonText: `Cancelar`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      Swal.fire({
        title: "Tu compra esta casi lista!",
        html: '<div id="paypal-button-container"></div>',
        showConfirmButton: false,
      });
      paypal
        .Buttons({
          createOrder: function (data, actions) {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: value,
                  },
                },
              ],
            });
          },
          onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
              swal.close();
              Swal.fire({
                title: "Gracias por tu Compra!",
                showConfirmButton: false,
                timer: 2500,
                icon: "success",
              });

              // Call your server to save the transaction
              return fetch("/paypal-transaction-complete", {
                method: "post",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify({
                  orderID: data.orderID,
                }),
              });
            });
          },
        })
        .render("#paypal-button-container");
    }
  });
}
document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".fixed-action-btn");
  var instances = M.FloatingActionButton.init(elems, {
    direction: "top",
  });
});
function locateMe() {
  //inicializador de funciones
  var output = document.getElementById("out");

  if (!navigator.geolocation) {
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }
  //configuracion de coordenadas para mostrar el mapa
  function success(position) {
    //obtener valores de datos
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    //direcitons de dato del negocio
    var miLugar = new google.maps.LatLng(13.705261, -89.21054);
    var coord = { lat: latitude, lng: longitude };
    var map = new google.maps.Map(document.getElementById("custom-places"), {
      zoom: 10,
      center: coord,
    });
    var marker = new google.maps.Marker({
      position: coord,
      map: map,
      // seteado de labes del mapa
      title: "Tu Ubicacion",
      label: "Aca Estas",
    });
    //
    var marker1 = new google.maps.Marker({
      position: miLugar,
      map: map,
      // seteado de labes del mapa
      title: "IoT Department",
      label: "Nosotros",
    });
  }
  // errores
  function error() {
    output.innerHTML = "Unable to retrieve your location";
  }

  navigator.geolocation.getCurrentPosition(success, error);
}
$(document).ready(function () {});
var apiKey = "563492ad6f917000010000016dca24562a124f6f891e943140f7d14c";
var image = "";
function buscar() {
  var search = $("#search").val();

  cleanDiv();
  imageSearch(search);
}
function cleanDiv() {
  var div = document.getElementById("images");
  div.innerHTML = "";
}
function imageSearch(search) {
  $.ajax({
    method: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", apiKey);
    },
    url:
      "https://api.pexels.com/v1/search?query=" +
      search +
      "&page=2&per_page=8",
    success: function (data) {
      console.log(data);
      data.photos.forEach((photo) => {
        image = `         
        <img alt="picture" src="${photo.src.medium}" class="img-fluid" />
        `;
        $("#images").append(image);
      });
    },
    error: function (error) {
      console.log(error);
    },
  });
}

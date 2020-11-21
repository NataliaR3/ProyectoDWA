function comprar(value) {
  Swal.fire({
    title: "Comprarias un peluche para apoyarnos?",
    showDenyButton: true,
    confirmButtonText: `Si, por supuesto!`,
    denyButtonText: `Cancelar`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      Swal.fire({
        title: "Gracias por apoyarnos!",
        html: '<div id="paypal-button-container"></div>',
        showConfirmButton: false,
      });
      paypal
        .Buttons({
          Donate: function (data, actions) {
            return actions.order.create({
              purchase_units: [
                {
                  item: "Peluche",
                  amount: {
                    value: "1.00",
                  },
                },
              ],
            });
          },
          onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
              swal.close();
              Swal.fire({
                title: "Gracias por apoyarnos!",
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

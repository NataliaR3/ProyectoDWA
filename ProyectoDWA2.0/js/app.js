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

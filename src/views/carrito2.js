
/*productosLS = obtenerProductosLocalStorage();
console.log(productosLS);
console.log();
if (productosLS.length === 0) {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'No hay productos, selecciona alguno',
    showConfirmButton: false,
    timer: 3000
  }).then(function () {
    window.location = "./";
  })
}
$(document).ready(function () {

  let total = 0;
  const listaCompra = document.querySelector("#lista_compra tbody");
 
  const productos = document.querySelector("#trproductos");
  let productosLS;
  productosLS = obtenerProductosLocalStorage();
  productosLS.forEach(function (producto) {

    const row = document.createElement('tr');

    row.innerHTML = `
              <td>
                  <img height=50px width=50px src="../../img/${producto.img}">
              </td>
               
              <td class="text-right" >
                <input type="text" value="${producto.cant}" name="cant" hidden=true> </input>${producto.cant}</td>
              <td style="font-size:24px">
                <input type="text" value="${producto.desc}" name="desc" hidden=true></input>${producto.desc}</td>
              <td class="text-right" >
                <input type="text" value="${producto.precio}" name="prec" hidden=true></input>${producto.precio}</td>
              <td class="text-right" id='subtotales' >
                <input type="text" name="sttl" hidden=true></input>${producto.precio * producto.cant}</td>
              <td class="text-center">
                 <input onclick=eliminarProductoLocalStorage(${producto.id}) type="button" value="X"
                  style="font-size:24px;color:white; background-color:red;" data-id="${producto.id}"></input>
              </td>
              
          `;

    listaCompra.appendChild(row);

  });


    
 

 
  
  for (let i = 0; i < productosLS.length; i++) {
    let element = Number(productosLS[i].precio * productosLS[i].cant);
    total = total + element;
    console.log(productosLS[i].precio);
    console.log(productosLS[i].cantidad);
    console.log(element);

  }
  document.getElementById('total').value = "$ " + total.toFixed(2);
});



//Calcular montos


function vaciarCarrito() {
  localStorage.clear();
  console.log('vaciar carrito');
  Swal.fire({
    title: 'Vaciando Carrito ....',
    text: '',
    showConfirmButton: false,
    timer: 3000
  }).then(function () {
    window.location = "./";
  })

}



function leerCarrito() {
  console.log('leerCarrito');
  console.dir(localStorage);
}

function obtenerProductosLocalStorage() {
  console.log('obtenerProductosLocalStorage')
  let productoLS;

  //Comprobar si hay algo en LS
  if (localStorage.getItem('productos') === null) {
    console.log('no tiene');
    productoLS = [];
  }
  else {
    console.log('tiene');
    console.dir(localStorage.getItem('productos'));
    productoLS = JSON.parse(localStorage.getItem('productos'));
  }
  return productoLS;
}


function eliminarProductoLocalStorage(productoID) {
  console.log('eliminar producto');
  console.log(productoID);
  let productosLS;
  //Obtenemos el arreglo de productos
  productosLS = obtenerProductosLocalStorage();
  //Comparar el id del producto borrado con LS
  productosLS.forEach(function (productoLS, index) {
    console.log(productoLS.id);
    if (productoLS.id == productoID) {
      console.log('encontrado');
      productosLS.splice(index, 1);
        Swal.fire({
          icon: 'error',
          title: 'Producto Eliminado',
          text: '',
          showConfirmButton: false,
          timer: 2000
         })

    }
   location.reload();
  });

  //Añadimos el arreglo actual al LS
  localStorage.setItem('productos', JSON.stringify(productosLS));
}





function procesarPedido() {
  productosLS = obtenerProductosLocalStorage();
  datosCorreo = {
    pro: (productosLS),
    cli: (cliente.value),
    cor: (correo.value),
    cel: (cel.value),
    nota: (nota.value),
  }

  console.log(datosCorreo);

  if (productosLS.length === 0) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'No hay productos, selecciona alguno',
      showConfirmButton: false,
      timer: 2000
    }).then(function () {
      window.location = "index.html";
    })
  }
  else if (cliente.value === '' || correo.value === '' || cel.value === '') {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Ingrese todos los campos requeridos',
      showConfirmButton: false,
      timer: 2000
    })
  }
  else {

    console.dir("mailOptions");
    console.dir(mailOptions);

    // paso 3 mandar el mail
    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log('error :', err);
      } else {
        console.log("Email enviado");
        res.status(200).jsonp(req.body);


      }
    });

  }
}*/


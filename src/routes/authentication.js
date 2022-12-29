const express = require('express');
const multer = require('multer');
const path = require('path');
const nodemailer = require("nodemailer");
//const { google } = require("googleapis");
//const nodemailer = require('nodemailer');
//var time = require('time');

/*const transporter = nodemailer.createTransport({
  host: 'smtp.googlemail.com', // Gmail Host
  port: 587, // Port
  //secure: true, // this is true as port is 465
  auth: {
    user: 'losrosalesituzaingo', //Gmail username
    pass: 'adentro496758' // Gmail password
  }
});
console.log(transporter);
*/

/*const transporter = nodemailer.createTransport({
  host: 'smtp.mail.yahoo.com', // Gmail Host
  port: 587, // Port
  //secure: true, // this is true as port is 465
  auth: {
    user: 'rivadavia21500@yahoo.com', //Gmail username
    pass: 'adentro496758' // Gmail password
  }
});
*/



const AWS = require('aws-sdk');
AWS.config.region = 'sa-east-1';
//const multerS3 = require ('multer-s3');


const storage = multer.diskStorage({
  //destination: path.join(__dirname, '../public/img'),
  destination: path.join(__dirname, '../public/img'),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
})




const fs = require('fs');

const router = express.Router();

const pool = require('../database');

const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');
const { CostExplorer } = require('aws-sdk');
const { Console } = require('console');

// SIGNUP
router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));

// ingreso
router.get('/signin', (req, res) => {
  res.render('auth/signin');
});

router.post('/signin', (req, res, next) => {
  console.log('pulso');
  req.check('username', 'Username is Required').notEmpty();
  req.check('password', 'Password is Required').notEmpty();
  const errors = req.validationErrors();
  if (errors.length > 0) {
    req.flash('message', errors[0].msg);
    res.redirect('/signin');
  }
  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

router.get('/productocambia', async (req, res) => {
  console.log('authentication listado producto');
  const data = await pool.query('SELECT id_producto,orden,id_categoria,id_subcategoria,des,costo,precio2,precio1,tipoventa,foto2,visible,vermayor FROM producto ORDER BY id_categoria,id_subcategoria,orden');
  res.render('productocambia', { data });
});

router.get('/productomayor', async (req, res) => {
  console.log('authentication listado producto');
  const data = await pool.query('SELECT id_producto,orden,id_categoria,id_subcategoria,des,costo,precio2,precio1,tipoventa,foto2,visible,vermayor FROM producto WHERE visible=1 and vermayor=1 ORDER BY id_categoria,id_subcategoria,orden');
  res.render('productomayor', { data });
});

router.get('/detallecompra/:id', async (req, res) => {
  console.log('detalle de compra');
  console.log("req", req);
  //const id = req.user.id;
  //console.log("req",req);
  //console.log("res",res);
  const data = await pool.query("SELECT id, id_compra, DATE_FORMAT(fecha,'%y/%m/%d') as fecha, id_producto, des, cant, costo, mayor, final, ref FROM compradetalle WHERE id_producto = ? order by fecha desc", [req.params.id]);
  res.render('detallecomprapantalla', { data });
});

router.get('/imprime_autentication', async (req, res) => {
  const { combo_prov, fecha, condicion, articulos, total, largo, cliente } = req.body;
  console.log("procesar venta");
  console.log("vendedor :", combo_prov,
    "fecha :  ", fecha,
    "total :", total,
    "largo :", largo,
    "cliente : ", cliente)
  console.log("articulos :", articulos);
  //console.log(ee)

  console.log('imprime_autentication');
  console.log("req", req);

  const data = await pool.query("SELECT id, id_venta, DATE_FORMAT(fecha,'%y/%m/%d') as fecha, id_producto, des, cant, precio_unit, venta FROM ventadetalle WHERE id_producto = ? order by fecha desc", [req.params.id]);
  console.log("data", data)
  res.render('ticket', { data, req });
});


router.get('/productocompra', async (req, res) => {
  console.log('authentication /productocompra');
  const produ = await pool.query("SELECT id_producto,orden,id_categoria,id_subcategoria,des,precio1,tipoventa,foto2,visible,costo,DATE_FORMAT(fecha,'%d/%m/%y') as fecha,precio2,porcprecio1,porcprecio2 FROM producto ORDER BY id_categoria,id_subcategoria,orden");
  const prov = await pool.query("SELECT * FROM proveedor ");
  res.render('productocompra', { produ, prov });
});

/*router.get('/productoventa', async (req, res) => {
  console.log('authentication /productoventa');
  const comercio=null;
  const produ = await pool.query("SELECT id_producto,orden,id_categoria,id_subcategoria,des,precio1,tipoventa,foto2,visible,costo,DATE_FORMAT(fecha,'%d/%m/%y') as fecha,precio2,porcprecio1,porcprecio2 FROM producto  WHERE visible=1 ORDER BY id_categoria,id_subcategoria,orden");
  const prov = await pool.query("SELECT * FROM vendedores");
  res.render('productoventa', { produ, prov, comercio });
});

router.get('/productoventamayor', async (req, res) => {
  console.log('authentication /productoventamayor');
  const comercio=true;
  const produ = await pool.query("SELECT id_producto,orden,id_categoria,id_subcategoria,des,precio1,precio2,tipoventa,foto2,visible,costo,DATE_FORMAT(fecha,'%d/%m/%y') as fecha,porcprecio1,porcprecio2 FROM producto  WHERE visible=1 ORDER BY id_categoria,id_subcategoria,orden");
  const prov = await pool.query("SELECT * FROM vendedores");
  res.render('productoventa', { produ, prov, comercio});
});
*/
/*
router.get('/sube_archivo', async (req, res) => {
  console.log('sube archivo');
  //const data = await pool.query('SELECT id_producto,orden,id_categoria,id_subcategoria,des,precio1,tipoventa,foto2 FROM producto ORDER BY id_categoria,id_subcategoria,orden');  
  res.render('sube_archivo');
});
*/
router.get('/pedidos', async (req, res) => {
  console.log('autentication /pedidos');
  //le mando id_users de req
  const id_users = req.user.id_users;
  console.dir(req.user.id_users);
  console.log(id_users);
  const ped = await pool.query('SELECT * FROM pedido WHERE id_users = ?', id_users);
  console.log('despues del listado')
  console.log(ped);
  res.render('pedidos', { ped });
  //res.redirect('/pedidos/list');
});



//    listado decarrito de compras
router.get('/carritobarra', async (req, res) => {


  console.log(res.lis);


  res.render('carrito2');   // pasar pro a carritoadd

});

/*function obtenerProductosLocalStorage() {
  console.log('obtenerProductosLocalStorage')
  let productoLS;

    //Comprobar si hay algo en LS
  /*  if (localStorage.getItem('productos') === null) {
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
*/




router.get('/verproducto/:id', async (req, res) => {
  console.log('verproducto');

  //const id_users = req.user.id_users;  


  const pro = await pool.query('SELECT id_producto,des,precio1,tipoventa,foto2,nota FROM producto WHERE id_producto = ? ', [req.params.id]);

  console.log(pro)
  res.render('verproducto', { pro });   // pasar pro a carritoadd
});


/*
router.get('/productoedit/:id', async (req, res) => {

  console.log('productoedit');
  const pro = await pool.query('SELECT * FROM producto WHERE id_producto = ?', [req.params.id]);


  const cat = await pool.query("SELECT c.id_categoria, c.des, IF(p.id_categoria=c.id_categoria, 'S', '') id_categoria_producto FROM categoria c, producto p where p.id_producto=?", [req.params.id]);
  //const sub_cat = await pool.query("SELECT c.id_categoria, c.des, IF(p.id_categoria=c.id_categoria, 'S', '') id_categoria_producto FROM categoria subc, producto p where p.id_producto=?", [req.params.id]);
  
  // console.log(pro);
  //console.log(cat);
/*
  const obj = {
    pro,
    cat
  }
  console.log(obj);
  */
// res.render('editar', { pro, cat });
//res.render('productoedit', { pro, cat });
//});




router.get('/modificarproducto/:id', async (req, res) => {

  console.log('modificarproducto');
  const pro = await pool.query('SELECT * FROM producto WHERE id_producto = ?', [req.params.id]);


  const cat = await pool.query("SELECT c.id_categoria, c.des, IF(p.id_categoria=c.id_categoria, 'S', '') id_categoria_producto FROM categoria c, producto p where p.id_producto=?", [req.params.id]);

  //const cat = await pool.query("SELECT c.id_categoria, c.des, IF(p.id_categoria=c.id_categoria, 'S', '') id_categoria_producto  FROM categoria c, producto p ");

  const subcat = await pool.query("SELECT d.id_categoria, d.id_subcategoria, d.des, IF(p.id_subcategoria=d.id_subcategoria, 'S', '')  id_subcategoria_producto FROM subcategoria d, producto p where p.id_producto=?", [req.params.id]);
  console.log('subcategoria ', subcat)
  res.render('modificarproducto', { pro, cat, subcat });
});




router.get('/tildar/:id', async (req, res) => {
  const { id } = req.params;
  console.log('tildar');
  const pro = await pool.query('update producto set visible=1 where id_producto = ?', [id]);
  const data = await pool.query('SELECT id_producto,des,precio1,tipoventa,foto2,id_categoria,id_subcategoria,orden,visible,vermayor FROM producto ORDER BY id_categoria,id_subcategoria,orden');
  res.render('productocambia', { data });
});

router.get('/destildar/:id', async (req, res) => {
  const { id } = req.params;
  console.log('destildar');
  const pro = await pool.query('update producto set visible=0 where id_producto = ?', [id]);
  const data = await pool.query('SELECT id_producto,des,precio1,tipoventa,foto2,id_categoria,id_subcategoria,orden,visible,vermayor FROM producto ORDER BY id_categoria,id_subcategoria,orden');
  res.render('productocambia', { data });
});

router.get('/tildarmayor/:id', async (req, res) => {
  const { id } = req.params;
  console.log('tildar');
  const pro = await pool.query('update producto set vermayor=1 where id_producto = ?', [id]);
  const data = await pool.query('SELECT id_producto,des,precio1,tipoventa,foto2,id_categoria,id_subcategoria,orden,visible,vermayor FROM producto ORDER BY id_categoria,id_subcategoria,orden');
  res.render('productocambia', { data });
});

router.get('/destildarmayor/:id', async (req, res) => {
  const { id } = req.params;
  console.log('destildar');
  const pro = await pool.query('update producto set vermayor=0 where id_producto = ?', [id]);
  const data = await pool.query('SELECT id_producto,des,precio1,tipoventa,foto2,id_categoria,id_subcategoria,orden,visible,vermayor FROM producto ORDER BY id_categoria,id_subcategoria,orden');
  res.render('productocambia', { data });
});


router.post('/productomodi/:id', async (req, res) => {
  const { id } = req.params;
  const { id_categoria } = req.body;
  console.log(req.params);
  console.log("post producto modi");
  console.log(id);
  console.log("id_categoria :", id_categoria);
  if (id_categoria > "1") {

    const newProducto = req.body;

    const des = newProducto.des    // newProducto lo tomo del body
    console.log("new producto :");
    console.dir(newProducto);
    //req.getConnection((err, conn) => {
    const pro = await pool.query('UPDATE producto set ? WHERE id_producto = ?', [newProducto, id]);
    //console.log(pro);

    //UPDATE `producto` SET `des` = 'Queso Mar Del Plata' WHERE `producto`.`id_producto` = 1;
    console.log("grabo");
  }
  else {
    console.log("no grabo");
  }
  const data = await pool.query('SELECT * FROM producto ORDER BY id_categoria,id_subcategoria,orden');
  res.render('productocambia', { data });
}
);






router.get('/agregaCarrito/:id', async (req, res) => {
  console.log('agrega carrito');

  const id_users = req.user.id_users;


  const pro = await pool.query('SELECT * FROM producto WHERE id_producto = ?', [req.params.id]);

  console.log(pro)
  res.render('carritoAdd', { pro });   // pasar pro a carritoadd


  /*
  var sql = 'INSERT into carrito (id_users,id_producto,cant) VALUES (12,1,500)';
  pool.query(pro, function (err, result) { 
    if (err) throw err;
  //  console.log("agrego 1 registro");
  }); 
  var sql = "INSERT Into pedido (id_pedido,nro_pedido,id_users,fecha,total,entregado) VALUES (NULL,'','12','12/12/2020','100','20/12/2020')";
  pool.query(sql, function (err, result) { 
  if (err) throw err;
    console.log("agrego 1 registro pedido");
  }); 
 /* var sql = "INSERT Into detallepedido (id,nro_pedido,user,fecha,total) VALUES (NULL,'0001','12','12/12/2020',105)";
  pool.query(sql, function (err, result) { 
    if (err) throw err;
    console.log("agrego 1 registro");
  }); 
*/
});

router.get('/productonuevo', async (req, res) => {

  console.log('prouctonuevo');


  const cat = await pool.query("SELECT c.id_categoria, c.des FROM categoria c", [req.params.id]);

  const subcat = await pool.query("SELECT sc.id_categoria, sc.id_subcategoria, sc.des FROM subcategoria sc");
  console.log('subcategoria ', subcat)
  res.render('productonuevo', { cat, subcat });
});

router.post('/producto_nuevo_graba', async (req, res) => {
  const { orden, id_categoria, tipoventa, unidad, id_subcategoria, des, nota, precio1, visible } = req.body;
  //const { id } = req.params;
  console.dir(req.body);
  console.log('producto_nuevo_graba');
  // console.dir(id);
  const newProducto = req.body;
  const result = await pool.query('INSERT INTO producto SET ? ', newProducto);
  console.dir('resultado', result.insertId);
  // console.log('errores',err);
  if (result.insertId < 1) {
    console.log('error :');
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'No se pudo agregar el producto',
      showConfirmButton: false,
      timer: 5000
    })

    res.render('productocambia');
  } else {

    console.log("prioducto creado");
    //res.status(200).jsonp(req.body);
    //const data = await pool.query('SELECT id_producto,des,precio1,tipoventa,foto2,id_categoria,id_subcategoria,orden,visible FROM producto ORDER BY id_categoria,id_subcategoria,orden');
    //console.dir({ data });
    //window.location = "/productocambia";
    res.render('productocambia');
  }

});

router.get('/productodel/:id', async (req, res) => {
  const { id } = req.params;
  console.log('delete', id);
  await pool.query('DELETE FROM producto WHERE id_producto = ?', [id]);
  req.flash('success', 'Link Removed Successfully');
  const data = await pool.query('SELECT id_producto,des,precio1,tipoventa,foto2,id_categoria,id_subcategoria,orden,visible FROM producto ORDER BY id_categoria,id_subcategoria,orden');
  res.render('productocambia', { data });
});



// listado de productos
router.get('/producto/:id', async (req, res) => {
  console.dir(req.params.id);
  console.log('authentication listado producto');
  if ([req.params.id] == 'todos') {
    const cat = 'Todos los productos';
    const pro = await pool.query("SELECT id_categoria,id_subcategoria,orden,id_producto,unidad,des,precio1,tipoventa,foto2,nota FROM producto WHERE visible=1 ORDER BY id_categoria,id_subcategoria,orden", [req.params.id]);
    res.render('producto_dos', { pro, cat });
  }
  else {
    const pro = await pool.query("SELECT id_categoria,id_subcategoria,orden,id_producto,unidad,des,precio1,tipoventa,foto2,nota FROM producto WHERE id_categoria = ? and visible=1 ORDER BY id_categoria,id_subcategoria,orden", [req.params.id]);
    res.render('producto_dos', { pro });   // pasar pro a carritoadd
  }
});


router.get('/listatarjeta/:id', async (req, res) => {
  console.log('prodxcat');
  console.dir(req.params.id);

  if ([req.params.id] == 'todos') {
    const cat = 'Todos los productos';
    const pro = await pool.query("SELECT id_categoria,id_subcategoria,orden,id_producto,unidad,des,precio1,tipoventa,foto2,nota FROM producto WHERE visible=1 ORDER BY id_categoria,id_subcategoria,orden", [req.params.id]);
    res.render('listatarjeta', { pro, cat });
    /*const data = await pool.query('SELECT id_categoria,id_subcategoria,orden,id_producto,des,precio1,tipoventa,foto2 FROM producto WHERE visible=1 ORDER BY id_categoria,id_subcategoria,orden');   
    res.render('producto', {data}); 
    */
  }
  else {
    const cat = await pool.query("SELECT id_categoria,des FROM categoria WHERE id_categoria = ?", [req.params.id]);
    console.log({ cat });
    const pro = await pool.query("SELECT id_categoria,id_subcategoria,orden,id_producto,unidad,des,precio1,tipoventa,foto2,nota FROM producto WHERE id_categoria = ? and visible=1 ORDER BY id_categoria,id_subcategoria,orden", [req.params.id]);
    res.render('listatarjeta', { pro, cat });   // pasar pro a carritoadd
    // const data = await pool.query('SELECT id_producto,des,precio1,tipoventa,foto2 FROM producto WHERE id_categoria = ?', [req.params.id]);
    // res.render('producto', {data}); 
  }

});

//    subir archivos

const uploadImage = multer({
  storage,
  limits: { fileSize: 1000000 }
}).single('image');

router.get('/images', (req, res) => { });

/*
router.post('/images/upload', multer({
  dest: path.join(__dirname, 'https://losrosales-fileserver.s3-sa-east-1.amazonaws.com/img/'),
}).single('image'), (req, res, next) => {
  console.log(req.file);
  const ext = path.extname(req.file.originalname).toLocaleLowerCase();
  fs.rename(req.file.path, `https://losrosales-fileserver.s3-sa-east-1.amazonaws.com/img/${req.file.originalname}`, () => {
    res.send('subido');
  });
});

*/
router.post('/images/upload', async (req, res) => {
  const { image } = req.body;
  console.log('jesus');
  //console.dir(image);
  s3.listBuckets({}, (err, data) => {
    if (err) throw err;
    console.log(data);
  });
  //res.send('uploaded');
  var image2 = "C:/sistema_carrito/" + image;
  console.log(image2);
  fs.readFile(image2, (err, data) => {
    if (err) throw err;
    var parametrosPutObject = {
      Bucket: 'losrosales-fileserver/img',
      Key: image,
      Body: data,
      ACL: 'public-read'
    }
    s3.putObject(parametrosPutObject, (err, data) => {
      if (err) throw err;
      console.log(data);
    })
  });
  res.render('sube_archivo');
});

router.get('/images', (req, res) => { });









router.post('/send-email', async (req, res) => {
  const { cliente, correo, cel, direccion, localidad, message, cant, desc, prec, prod_id, tipo, unid, sttl, enviostr, total, totalgralstr, nota, articulos, fecha, horalocal, } = req.body;
  console.log("clinte : ", cliente)
  var mfecha = fecha;
  console.log('/send-email');
  console.log("localidad :", localidad);
  var cliente_des = cliente
  var cliente_tel = cel
  var cliente_dir = direccion
  var cliente_saldoAnt = 0
  var cliente_cod = await Actuali_Cliente(cel, cliente, direccion, localidad, correo)
  console.log("codigo de cliente:", cliente_cod);




  console.log("total: ", total);
  total2 = total * 100 / 100;
  console.log("total2: ", total2);
  enviostr2 = enviostr * 100 / 100;
  totalgralstr2 = totalgralstr * 100 / 100;
  console.log(prod_id);
  console.log(cant);
  console.log(desc);
  console.log(prec);
  console.log("sttl: ", sttl);
  console.log("enviostr: ", enviostr2);

  console.log("totagralstr: ", totalgralstr2);

  hoy = fecha + "  " + horalocal

  console.log(hoy);
  // cargo el pedido en base de datos


  var producto = [];



  var encabezado = ``,
    cuerpo = ``,
    pie = ``;
  encabezado = `
  <ul>
  <a>Hola ${cliente}, </a>
  <a>hemos recibido tu pedido, generado a traves de nuestra pagina web</a><br>
  <a>Nos estaremos comunicando con vos al numero : ${cel}  dentro de las 48 hs habliles </a><br>
  <a>Tu pedido del dia ${hoy}, ha sido enviado con el siguiente detalle.</a><br><br>
  <a>Muchas Gracias</a><br>
  </ul>

  <br>
  <style type="text/css">
    table {width: 100%; border-collapse: collapse;}
    td, th {border: solid 1px black;}
    h1 {text-align: center;}
    span {float: right;}
  </style>
  
  <hr/>
  <hr/>
  <b> Cliente : </b>${cliente} <b><br>
  <b> Email : </b>${correo}</b><br>
  <b> Telefono : </b>${cel}<br>
  <b> Direccion : </b>${direccion} , </b>${localidad} <br>
  <hr/>
  <p></p>
  <table>
    <thead>
      <tr>
        <th>Cantidad</th>
        <th style="text-align:left">Descripcion</th>
        <th>Precio Unitario</th>
        <th>Subtotal</th>
      </tr>
    </thead>
    <tbody>`;
  console.log("length cant: ", cant.length);
  if (articulos > 1) {
    for (let i = 0; i < cant.length; i++) {
      console.log(desc[i]);
      producto.push([cant[i], desc[i], prec[i], sttl[i], prod_id[i]])
    }
    for (let i = 0; i < producto.length; i++) {
      cuerpo = cuerpo + `<tr>
            <td class="text-right" style="text-align:right" ;>
              <a type="text"  name="cant" hidden=true>${producto[i][0]}&#09;</a></td>
            <td>
              <a type="text" name="desc" hidden=true>${producto[i][1]}&#09;</a></td>
            <td class="text-right" style="text-align:right">
              <a type="text" name="precio" hidden=true>${producto[i][2]}&#09;</a></td>
            <td class="text-right" id='subtotales' style="text-align:right">
              <a type="text" name="sttl" style="text-align:right" text hidden=true>${producto[i][3]}&#09;</a></td>
        </tr>`;

    }
  }
  else {
    cuerpo = cuerpo + `<tr>
        <td class="text-right" style="text-align:right" ;>
          <a type="text"  name="cant" hidden=true>${cant} </a></td>
        <td>
          <a type="text" name="desc" hidden=true>${desc}</a></td>
        <td class="text-right" style="text-align:right">
          <a type="text"  name="precio" hidden=true>${prec}</a></td>
        <td class="text-right" id='subtotales' style="text-align:right">
          <a type="text" name="sttl" style="text-align:right" text hidden=true>${sttl}</a></td>
        </tr>`;

  }




  pie = `

  <tr> 
    <td></td>
    <td></td> 
    <td>Sub Total</td>
    <td style="text-align:right" >${total2}</td>
  </tr>  
  <tr> 
    <td></td>
    <td></td>  
    <td>Envio</td>
    <td style="text-align:right" >${enviostr2}</td> 
  </tr>  
  <tr>  
    <td></td>
    <td></td>   
    <td>Total Pedido</td>
    <td style="text-align:right" >${totalgralstr2}
  </td> 
  
  </tr>   
    
  </tbody>
  </table> 
  <b>Nota: </b> ${nota}<br>
  <hr/> <hr/>
  <p><b> Importante:</b>  Todos los productos estan sujetos a disponobilidad.</p>
  <p>El peso y el monto de los produtos que son vendidos por peso es <b>aproximado,</b> el peso y el valor definitivo sera fijado al momento de 
    pesar su producto.</p>
  <p>El envio no tiene costo para compras superiores a <b>$ 3500</b>.</p>
  <p>Muchas Gracias</p>`;

  contentHTML = encabezado + cuerpo + pie;

  // console.log(contentHTML);
  /* transporter viejo
      const transporter = nodemailer.createTransport({
        host: 'smtp.googlemail.com', // Gmail Host
        //port: 587, // Port
        //secure: true, // this is true as port is 465
        port: 465,
        auth: {
          user: 'losrosalesituzaingo', //Gmail username
          pass: 'adentro496758' // Gmail password
        }
      });
    */
  // nuevo auth2
  // auth2
  /*
  console.log("antes de oauth2")
  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  */
  const mailOptions = {
    from: "losrosalesituzaingo@gmail.com",
    cc: "losrosalesonline@gmail.com",
    to: correo,
    subject: "Pedido de Los Rosales",
    text: cel,
    html: contentHTML,
  };

  //console.log(mailOptions);
  ///genero pedido

  const pedido_nro = await Genera_Pedido(fecha, horalocal, cliente_cod,
    cliente_des, cliente_tel, cliente_dir, total, nota, cliente_saldoAnt,
    producto, prod_id, desc, cant, prec, sttl)



  // envio el mail 


  var result = await transporter.sendMail(mailOptions); // le doy laorden para que lo mande
  if (!result) {
    console.log('error :', result);
    res.render('carrito2');
  } 
  else {
    console.log("Email enviado");
    res.render('mailok');
  };
})

//res.render('mailok');   //aca tambien vacio el localstorage

router.post('/graba_cliente', async (req, res) => {
  const { cliente, correo, cel, direccion } = req.body;
  const { orden, id_categoria, tipoventa, unidad, id_subcategoria, des, nota, precio1, visible } = req.body;
  //const { id } = req.params;
  console.dir(req.body);
  console.log('graba cliente');
  // console.dir(id);
  const newProducto = req.body;
  const result = await pool.query('INSERT INTO producto SET ? ', newProducto);
  console.dir('result', result.insertId);
  // console.log('errores',err);
  if (result.insertId < 1) {
    console.log('error :');
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'No se pudo agregar el producto',
      showConfirmButton: false,
      timer: 5000
    })

    res.render('productocambia');
  } else {

    console.log("prioducto creado");
    //res.status(200).jsonp(req.body);
    //const data = await pool.query('SELECT id_producto,des,precio1,tipoventa,foto2,id_categoria,id_subcategoria,orden,visible FROM producto ORDER BY id_categoria,id_subcategoria,orden');
    //console.dir({ data });
    //window.location = "/productocambia";
    res.render('productocambia');
  }

});






router.get('/mailok', async (req, res) => {
  window.location = "mailok";
});











/*
 
const multer = require('multer');
const path = require('path');
 
if (process.env.NODE_ENV === 'production') {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, 'build'))
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname)
    }
  })
} else {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, 'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname)
    }
  })
}
 
const uploads = multer({ storage: storage });
 
app.use(uploads.any());
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'build')));
} else {
  app.use(express.static('./public'));
}
 
//if you need to download (after upload) files in cloudinary 
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dwlhz5bo8',
    api_key: '332248961248749',
    api_secret: 'T-ppnYv71vNGnkbFOr9FAh-qQB4'
});
//if you need to del files after upload
const fs = require('fs');
 
router.post('/admin/create-product-images', (req, res, next) => {
 
    let urls = [];    
 
    async function sendImagesToCloudinary() {
        for (let file of req.files) {
            await cloudinary.uploader.upload(
                file.path,
                {
                    public_id: `${Date.now()}`,
                    resource_type: 'auto'
                }
            ).then(result => {
                //del files after upload on cloudinary
                fs.unlink(file.path, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
                urls.push(result.url);
            })
            .catch(err => {
                console.log(err);
            });
        }
        res.json(urls);
    }
 
    sendImagesToCloudinary();
});
*/


router.post('/procesar-compra', async (req, res) => {
  const { combo_prov, fecha, condicion, articulos, total, largo } = req.body;
  console.log("procesar compra");
  console.log("proveedor :", combo_prov, "feha :  ", fecha, "total", total, "largo", largo)
  console.log("articulos :", articulos);
  const newProducto = req.body;
  console.dir(newProducto);
  console.log(newProducto);
  console.log("cant", newProducto.cant);
  console.log("antes");
  const newCompra = req.body;
  var lineadesql = "INSERT INTO compra values (NULL,'" + combo_prov + "', '" + fecha + "', '" + total + "')";
  console.log("linea de compra", lineadesql);
  const result = await pool.query(lineadesql);
  var compra_nro = result.insertId;
  console.log("Compra cargada", compra_nro);
  lineadesqldetalle = "INSERT INTO compradetalle values (NULL,'" + compra_nro + "','" + fecha + "', '";
  if (largo == 1) {
    console.log("una linea");
    linea = lineadesqldetalle + newProducto.cod + "', '" +
      newProducto.desc + "', '" +
      newProducto.cant + "', '" +
      newProducto.costo + "', '" +
      newProducto.mayorista + "', '" +
      newProducto.final + "', '" +
      condicion + "')";
    console.log("linea de detalle", linea);
    const result = await pool.query(linea);
    lineadesqlproducto = "UPDATE producto SET costo='" + newProducto.costo +
      "', precio2='" + newProducto.mayorista +
      "', porcprecio2='" + newProducto.porcMayorista +
      "', precio1='" + newProducto.final +
      "', porcprecio1='" + newProducto.porcFinal +
      "', visible='1" +
      "', fecha='" + fecha + "' " +
      "WHERE id_producto = " + newProducto.cod;
    console.log("linea sql de producto", lineadesqlproducto);
    const resultado = await pool.query(lineadesqlproducto);
  }
  else {
    console.log("multiples linea");
    for (let i = 0; i < newProducto.cant.length; i++) {
      linea = lineadesqldetalle + newProducto.cod[i] + "', '" +
        newProducto.desc[i] + "', '" +
        newProducto.cant[i] + "', '" +
        newProducto.costo[i] + "', '" +
        newProducto.mayorista[i] + "', '" +
        newProducto.final[i] + "', '" +
        condicion + "')";
      console.log("linea :", linea)
      const resultadodetalle = await pool.query(linea);
      console.dir("result: ", resultadodetalle)
      lineadesqlproducto = "UPDATE producto SET costo='" + newProducto.costo[i] +
        "', precio2='" + newProducto.mayorista[i] +
        "', porcprecio2='" + newProducto.porcMayorista[i] +
        "', precio1='" + newProducto.final[i] +
        "', porcprecio1='" + newProducto.porcFinal[i] +
        "', visible='1" +
        "', fecha='" + fecha + "' " +
        "WHERE id_producto = " + newProducto.cod[i];
      console.log("linea sql de producto", lineadesqlproducto);
      const resultadoproducto = await pool.query(lineadesqlproducto);
    }
  }
  // res.render('mailok');

  res.render('compra_ok');
});

router.post('/procesar-venta', async (req, res) => {
  const { combo_prov, fecha, horalocal, articulos, total, largo, cliente, condicion, pago, vuelto } = req.body;
  console.log("procesar venta");
  console.log("vendedor :", combo_prov,
    "fecha :  ", fecha,
    "hora : ", horalocal,
    "total :", total,
    "largo :", largo,
    "cliente : ", cliente,
    "pago :", pago,
    "vuelto :", vuelto,
    "condicon :", condicion)
  console.log("articulos :", articulos);
  const newProducto = req.body;
  console.dir(newProducto);
  console.log(newProducto);
  console.log("cant", newProducto.cant);
  console.log("antes");
  const newCompra = req.body;
  console.log(newCompra)
  const mfecha = fecha.substring(8, 10) + "-" + fecha.substring(5, 7) + "-" + fecha.substring(0, 4);
  console.log("mfecha :", mfecha)
  /*
  today=new Date();
  h = ("00" + today.getHours()).substr(-2);
  m = ("00" + today.getMinutes()).substr(-2);
  */
  const mhora = horalocal;
  console.log("hora:", mhora);

  var lineadesql = "INSERT INTO venta values (NULL,'" + combo_prov + "', '" + fecha + "', '" + cliente + "', '" + total + "')";
  console.log("linea de venta", lineadesql);
  const result = await pool.query(lineadesql);
  var compra_nro = result.insertId;
  console.log("venta cargada", compra_nro);
  lineadesqldetalle = "INSERT INTO ventadetalle values (NULL,'" + compra_nro + "','" + fecha + "', '";
  if (largo == 1) {
    console.log("una linea");
    linea = lineadesqldetalle + newProducto.cod + "', '" +
      newProducto.desc + "', '" +
      newProducto.cant + "', '" +
      newProducto.costo + "', '" +
      newProducto.subttl + "')";
    console.log("linea de detalle", linea);
    const result = await pool.query(linea);
  }
  else {
    console.log("multiples linea");
    for (let i = 0; i < newProducto.cant.length; i++) {

      linea = lineadesqldetalle + newProducto.cod[i] + "', '" +
        newProducto.desc[i] + "', '" +
        newProducto.cant[i] + "', '" +
        newProducto.costo[i] + "', '" +
        newProducto.subttl[i] + "')";
      console.log("linea de detalle de venta:", linea);
      console.log("codigo :", newProducto.cod[i]);
      console.log("desc :", newProducto.desc[i]);
      console.log("cant :", newProducto.cant[i]);
      console.log("costo :", newProducto.costo[i]);
      console.log("linea :", linea)
      const resultadodetalle = await pool.query(linea);
      console.dir("result: ", resultadodetalle)
    }

  }
  console.log("compra nro : ", compra_nro)
  linea = "SELECT * FROM ventadetalle WHERE id_venta = " + compra_nro
  console.log("linea :", linea)
  const data = await pool.query(linea);
  console.log("data dos", data)
  //console.log("req",req.body)
  //console.log("articulos ", articulos)
  res.render('ticket', { combo_prov, mfecha, mhora, total, largo, condicion, cliente, vuelto, pago, compra_nro, data });
});

async function Actuali_Cliente(telefono, cliente, direccion, localidad, correo) {
  console.log("Actuali_Cliente busco :", telefono)
  try {
    console.log("busco el telefono :", telefono)
    var cli_busqueda = await busca_cliente(telefono);

    console.log('cliente encontrado: ', cli_busqueda);
    if (cli_busqueda == 0) {
      var cli_busqueda = await nuevo_cliente(telefono, cliente, direccion, localidad, correo);
      console.log('nuevo cliente: ', cli_busqueda);
    }
    if (cli_busqueda > 0) {

      console.log('saldo anterir: ', cliente_saldoAnt);
    }
    return cli_busqueda
  }
  catch (e) {
    console.log("error jesus :", e);
  }
}

async function busca_cliente(telefono) {
  linealsql = "SELECT * FROM cliente WHERE telefono = '" + telefono + "'";
  console.log("linea de sql : ", linealsql)
  var result = await pool.query(linealsql)
  console.log("encontro  : ", result.length);
  if (result.length > 0) {
    rows = JSON.parse(JSON.stringify(result[0]));
    cliente_cod = rows.id
    cliente_saldoAnt = rows.saldo
    clienteNuevo = false
    console.log("codigo del encontrado: ", cliente_cod);
    console.log("saldo en funcion:", cliente_saldoAnt);
  }
  if (result == 0) {
    console.log("cliente nuevo")
    clienteNuevo = true
    cliente_cod = 0
  }
  return cliente_cod
}


async function nuevo_cliente(cel, cliente_des, direccion, localidad, correo) {
  console.log("entro en nuevo")
  var lineadesql = "INSERT INTO cliente values (NULL,'" + cliente_des + "', '" + direccion + "', '" + localidad + "', '" + cel + "', '" + " " + "', '" + " " + "', '" + correo + "', '" + 1 + "', '" + 0 + "', '" + 0 + "')";
  console.log("linea de cliente nuevo", lineadesql);
  var result = await pool.query(lineadesql);
  console.log("despues que creo :", result.insertId)
  return result.insertId;
}

async function Genera_Pedido(fecha, horalocal, cliente_cod, cliente_des, cliente_tel,
  cliente_dir, total, nota, cliente_saldoAnt, producto, prod_id, desc, cant, prec, sttl) {
  pedido_nro = 0
  console.log("entro en la funcion Genero el Pedido ")
  lineadesql = "INSERT INTO pedido values (NULL,'" + "llega" + "', '" + "0" + "', '" + "particular" + "', '" +
    fecha + "', '" + horalocal + "', '" + cliente_cod + "', '" + cliente_des + "', '" + cliente_tel +
    "', '" + cliente_dir + "', '" + 1 + "', '" + total + "', '" + " " + "', '" + nota + "', '" + cliente_saldoAnt + "')";
  console.log("lineasql  ", lineadesql)
  var result = await pool.query(lineadesql);
  console.log("despues que creo Pedido :", result.insertId)
  pedido_nro = result.insertId;

  //////////////    Pedido detalle

  console.log("cantidad de articulos", producto.length)
  lineadesqldetalle = "INSERT INTO pedidodetalle values (NULL,'" + pedido_nro + "','" + fecha + "', '" + cliente_cod + "', '";
  console.log("linea base de detallepedido  lineadesqldetalle :", lineadesqldetalle)
  if (producto.length > 1) {
    for (let i = 0; i < producto.length; i++) {
      /* console.log("codigo",producto[i][4])
       console.log("descripcion",producto[i][1])
       console.log("cantidad",producto[i][0])
       console.log("precio uni",producto[i][2])
       console.log("sttl",producto[i][3]) */
      lineadesql2 = lineadesqldetalle + producto[i][4] + "','" + producto[i][1] +
        "','" + producto[i][0] + "','" + "0" + "','" +
        producto[i][2] + "','" + producto[i][3] + "')"
      console.log("lineadesql2 :  ", lineadesql2)
      resultpedidodetalle = await pool.query(lineadesql2);
      console.log("Numero de pedido detalle nuevo:", resultpedidodetalle.insertId)
    }
  }
  else {
    console.log("si es un solo producto")
    lineadesql2 = lineadesqldetalle + prod_id + "','" + desc + "','" + cant + "','" + "0" + "','" +
      prec + "','" + sttl + "')"
    console.log("lineadesql2 :  ", lineadesql2)
    resultpedido = await pool.query(lineadesql2);
    console.log("despues que creo Detalle Pedido :", resultpedido.insertId)
  }

}




router.get('/compra_ok', async (req, res) => {
  window.location = "compraok";
});


module.exports = router;

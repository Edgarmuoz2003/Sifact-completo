import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import '../css/estilos-home.css';

function Home({ nombre }) {
  return (
    <div className="Home">
      <section className="opciones-menu d-flex flex-column">
        <div className="container menu-contenedor">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="menu">
                <a href="/facturacion"><img src="facturacion.png" alt="logo facturacion" /></a> 
                <div className="overlay">
                  <p>Facturacion</p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="menu">
              <a href="/clientes"><img src="cliente.png" alt="logo clientes" /></a>
              <div className="overlay">
                <p>Clientes</p>
              </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="menu">
              <a href="/productos"><img src="productos.png" alt="logo productos" /></a>
              <div className="overlay">
                <p>Productos</p>
              </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="menu">
              <a href="/empleados"><img src="empleado.png" alt="logo empleados" /></a>
              <div className="overlay">
                <p>Empleados</p>
              </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="menu">
              <a href="/configuraciones"><img src="configuraciones.png" alt="logo configuraciones" /></a>
              <div className="overlay">
                <p>Configurciones</p>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;



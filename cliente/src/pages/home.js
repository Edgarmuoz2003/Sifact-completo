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
                <a href="/"><img src="facturacion.png" alt="logo facturacion" /></a> 
              </div>
              <div className="overlay">
                <p>Facturacion</p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="menu">
              <a href="/clientes"><img src="cliente.png" alt="logo facturacion" /></a>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="menu">
              <a href="/"><img src="productos.png" alt="logo facturacion" /></a>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="menu">
              <a href="/"><img src="configuraciones.png" alt="logo facturacion" /></a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;



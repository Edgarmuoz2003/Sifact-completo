import React from "react";


function Home({ nombre }) {


    return (
      <div className="Home">
        <div>
          <h1>Bienvenido {nombre}</h1>
        </div>
        
      </div>
    );
  }
  
  export default Home;
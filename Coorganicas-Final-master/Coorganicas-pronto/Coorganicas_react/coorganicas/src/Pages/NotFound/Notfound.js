import React, { Component } from 'react';
import '../../Assets/css/index.css';
import Robo from '../../Assets/images/notfaund.png'
import Footer from '../../Componentes/Footer/Footer';
import Header from '../../Componentes/Header/Header';

class NaoEncontrada extends Component {
    render(){
        return <div className="App">
            <Header/>
            <div className="Container_not">
            <div className="nao_encontrada">
            <h1> Erro 404</h1>
            <img src={Robo} alt="robo de página não encontrada"/>
            <p>Página não encontrada!</p>
            </div>
            </div>
            <Footer/>
           
            </div>
    }
}

export default NaoEncontrada;
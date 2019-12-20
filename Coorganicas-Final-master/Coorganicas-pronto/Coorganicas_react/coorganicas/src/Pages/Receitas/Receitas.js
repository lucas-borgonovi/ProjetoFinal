import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';


import '../../Assets/css/receitas.css'
import img_receitas from '../../Assets/images/receita11.jpg';
// import img_receitas2 from '../../Assets/images/receita3.jpg';
// import img_receitas3 from '../../Assets/images/receita9.jpg';
// import img_receitas4 from '../../Assets/images/receita7.jpg';
// import img_receitas5 from '../../Assets/images/receita10.jpg';
// import img_receitas6 from '../../Assets/images/receita14.jpg';
// import img_receitas7 from '../../Assets/images/receita2.jpg';
// import img_receitas8 from '../../Assets/images/receita19.jpg';
// import img_receitas9 from '../../Assets/images/receita5.jpg';
// import img_receitas10 from '../../Assets/images/receita6.jpg';
// import img_receitas11 from '../../Assets/images/receita12.jpg';
// import img_receitas12 from '../../Assets/images/receita13.jpg';

import Header from '../../Componentes/Header/Header';
import Footer from '../../Componentes/Footer/Footer';
class Receitas extends Component {

    constructor() {
        super();
        this.state = {
            lista: [],
            receita_titulo: "",
            conteudo_receita: "",
            modal: false,
            modalReceita: {
                receita_titulo: "",
                conteudo_receita: "",

            }

        }
    }


    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }





    //#region GETs
    mostrarReceita = () => {


        fetch("http://localhost:5000/api/Receita")
            .then(response => response.json())
            .then(data => {
                this.setState({ lista: data })
                console.log(data)
            })

        //desabilita o icone apos dois segundos



    }

    modalDaReceita = (titulo, conteudo) => {
        console.log("algo"+titulo+conteudo)
        this.setState({
            modalReceita: {
                titulo:titulo,
                conteudo:conteudo
            }

        });
        console.log(this.state.modalReceita.titulo)
        this.toggle(4);

    }



    componentDidMount() {
        //console.log('Did');
        this.mostrarReceita();
    }

    receitaEstado = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }



    render() {
        return (


            
                
                <div>
                <Header />
                <div className="postscontainer">
                <h1 className="tituloposts1">Receitas</h1>
                <div className="flexposts">
                
                {
                    //varrer a lista de evento
                    this.state.lista.map(function (receita) {
                        console.log(receita);
                        return (
                            
                            
                            <div className="cardcestas posts" onClick={() => this.modalDaReceita(receita.titulo, receita.conteudo)} key={receita.receitaId}>

                                
                                    <img src={receita.imagemReceita && require(`../../Assets/images/receitas/${receita.imagemReceita}`)} 
                                        className="imgcestas" />
                                    <h3 className="titulocestas"><p> {receita.titulo}</p></h3>
                                    
                                
                            </div>
                           
                           
                            

                            //colocamos uma key pois cada linha em jsx precisa de um id unico

                        )
                        //usamos para vincular todo o contesto do map

                    }.bind(this))
                }
              


                
                    
                    {/* <div className="espacamento_pag">

                        <ul className="paginacao">
                            <a href="#">
                                <li>Anterior</li>
                            </a>
                            <a href="#">
                                <li>1</li>
                            </a>
                            <a href="#">
                                <li>2</li>
                            </a>
                            <a href="#">
                                <li>Próxima</li>
                            </a>
                        </ul>
                    </div> */}
                </div>

                <div>

                </div>



                <MDBContainer>

                    <form method="get" id="modalreceitas" onSubmit={this.exporReceitas}>

                        <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
                            <MDBModalHeader toggle={this.toggle}></MDBModalHeader>
                            <MDBModalBody>
                                <div>
                                        <h3>{this.state.modalReceita.titulo}</h3>
                                        <br/>
                                        <br/>
                                        <textarea readOnly className = "text">{this.state.modalReceita.conteudo}</textarea>
                                </div>
                            </MDBModalBody>
                            <MDBModalFooter>
                                <MDBBtn class="btn_" color="secondary" onClick={this.toggle}>Fechar</MDBBtn>

                            </MDBModalFooter>
                        </MDBModal>
                    </form>
                </MDBContainer>

                <Footer />
                </div>
                </div>
                
            






        );

    }
}

export default Receitas;
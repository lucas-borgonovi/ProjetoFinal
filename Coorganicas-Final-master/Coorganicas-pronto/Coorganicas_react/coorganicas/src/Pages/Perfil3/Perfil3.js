import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import img_perfil3 from '../../Assets/images/cartao.png'
import '../../Assets/css/perfil.css'
import '../../Assets/css/estilo.css'
import '../../Assets/css/menuPerfil.css'
import MenuPerfilC from '../../Componentes/MenuPerfilC/MenuPerfilc';
import Axios from 'axios';
import toastr from 'toastr';


toastr.options = {
    "closeButton": true,
    "debug": false,
    "latestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "6000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}




class Perfil3 extends Component {
    constructor() {
        super();
        this.state = {
            lista: [],
            modal: false,
            modalReserva: {
                dataDaReserva: "",
                quantidadeReserva: "",
                dataDaEspera: "",
                statusDaReserva: "",
                idReserva: ""
            }

        }
    }


    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    mostrarReserva = () => {


        fetch("http://localhost:5000/api/Reserva", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + localStorage.getItem("user-coorganicas")
            }
        })
            .then(response => response.json())
            .then(response => {
                this.setState({ lista: response })
                console.log(response + "alglo")
                // console.log(reserva)
            })

        //desabilita o icone apos dois segundos



    }
    BuscarMinhasReservas (){

        // var id=parseJwt().Id
        // console.log(id)
        console.log("Tok " + localStorage.getItem("user-coorganicas"))
        
        let config = {
            headers: {
                "Content-Type":"application/json",
                // "Access-Control-Allow-Origin":"*",
                "Authorization" : "Bearer " + localStorage.getItem("user-coorganicas") 
            }
        }


        Axios.get('http://localhost:5000/api/Reserva/minhasReservas',config)
        .then(response=> {
            if(response.status === 200){
                    
                    this.setState({lista : response.data});
                
                
               // console.log(this.state.listaProdutos);

            };
        })

        

    }

    //delete

    // deletarReserva = (reserva) => {
    //     let id_Reserva = this.state.modalReserva.idReserva
    //     this.setState({ erroMsg: "" })

    //     console.log("Excluindo");

    //     fetch("http://localhost:5000/api/Reserva/" + id_Reserva, {
    //         method: "DELETE",
    //         headers: {
    //             "Content-Type": "application/json",
    //             'Authorization': 'Bearer ' + localStorage.getItem("user-coorganicas")
    //         }
    //     })
    //         .then(response => response.json())
    //         .then(response => {
    //             // console.log(response);
    //             this.mostrarReserva();
    //             this.setState(() => ({ lista: this.state.lista }));
    //             this.toggle();
    //         })

    // }
    deletarReserva(reserva){

        let config = {
            headers: {
                "Content-Type":"application/json",
                // "Access-Control-Allow-Origin":"*",
                "Authorization" : "Bearer " + localStorage.getItem("user-coorganicas") 
            }
        }

        let id_Reserva = this.state.modalReserva.idReserva

        Axios.delete('http://localhost:5000/api/Reserva/'+id_Reserva, config)
        .then(response => {
            if(response.status===200){
                if(response.erro !== true){
                    toastr.success("Oferta deletada com sucesso"); //error warning
                    // this.toggle();
                }
            }
        }).catch(error => {
            toastr.error("Falha em deletar a oferta pois ja está reservada")
        })
        
    }


    //delete
    modalPerfil3 = (dataReserva, quantidade, dataEspera, statusReserva, ReservaId) => {
        // console.log("algo"+titulo+conteudo)

        this.setState({
            modalReserva: {
                dataDaReserva: dataReserva,
                quantidade: quantidade,
                dataDaEspera: dataEspera,
                statusReserva: statusReserva,
                idReserva: ReservaId

            }

        });

        this.toggle();
        //console.log(this.state.modalReserva.idReserva)

    }



    componentDidMount() {
        //console.log('Did');
        this.BuscarMinhasReservas();
    }

    receitaEstado = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }



    render() {

        return (


            <main>

                <div className="container_perfil">
                    <MenuPerfilC />




                    <div className="direito2">
                        <h1 className="t_perfil">Minhas Reservas</h1>
                        {/* <form method="get" id="form_busca" className="formdi_busca">
                        <label>
                            <input type="text" placeholder="Digite o produto..." className="form_buscai"
                                aria-label="buscar produto"/>
                        </label>
                    </form> */}
                        <form method="GET" id="form_meusprodutos" className="products">
                            {
                                //varrer a lista de evento
                                this.state.lista.map(function (reserva) {
                                    // console.log(reserva);
                                    console.log("rES", reserva)
                                    return (

                                        <div className="products2_" onClick={() => this.modalPerfil3(reserva.dataReserva, reserva.quantidade, reserva.dataEspera, reserva.statusReserva, reserva.reservaId)} key={reserva.reservaId}>



                                            <img src={img_perfil3} className="imgpro" alt="produto" />
                                            <p className="t_products">Produto reservado</p>


                                        </div>


                                        //colocamos uma key pois cada linha em jsx precisa de um id unico

                                    )
                                    //usamos para vincular todo o contesto do map

                                }.bind(this))
                            }

                        </form>







                        <MDBContainer>

                            <form method="get" id="modalreceitas" >

                                <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
                                    <MDBModalHeader toggle={this.toggle}></MDBModalHeader>
                                    <MDBModalBody>

                                        <div>

                                            <p>Data da reserva: {this.state.modalReserva.dataDaReserva}</p>

                                            <p>Quantidade : {this.state.modalReserva.quantidade}</p>

                                            <p>Data de espera: {this.state.modalReserva.dataDaEspera}</p>

                                            <p>Status da reserva: {this.state.modalReserva.statusReserva}</p>
                                        </div>
                                    </MDBModalBody>
                                    <MDBModalFooter>
                                        <button className="btn_" color="secondary" onClick={() => this.deletarReserva(this.state.modalReserva)} >Deletar</button>
                                        <button className="btn_" color="secondary" onClick={this.toggle}>Fechar</button>

                                    </MDBModalFooter>
                                </MDBModal>
                            </form>
                        </MDBContainer>
                    </div>
                </div>
            </main>

        );
    }
}

export default Perfil3;
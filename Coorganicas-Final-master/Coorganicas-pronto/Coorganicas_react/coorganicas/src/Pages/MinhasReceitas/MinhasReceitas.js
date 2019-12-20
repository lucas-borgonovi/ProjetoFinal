import React,{Component, createRef} from 'react';
// import MenuPerfil from '../../Componentes/Menu_Perfil/Menu_Perfil';
import Axios from 'axios';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import toastr from 'toastr';
import MenuPerfilA from '../../Componentes/MenuPerfilA/MenuPerfilA';
import { parseJwt } from '../../Services/auth';
import MenuPerfilC from '../../Componentes/MenuPerfilC/MenuPerfilc';


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






class MinhasReceitas extends Component{

    constructor(){
        super();
        this.state = {
            lista : [],
            modal : false,
            InformacoesReceita : {
                receitaid:"",
                conteudo :"",
                titulo :"",
                imagemReceita: React.createRef()
            }

        }
    }

    toggle = () => {
        this.setState({
          modal: !this.state.modal
        });
        this.BuscarMinhasreceitas()
      }
      


    BuscarMinhasreceitas (){

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


        Axios.get('http://localhost:5000/api/Receita/minhasreceitas',config)
        .then(response=> {
            if(response.status === 200){
                    
                    this.setState({lista : response.data});
                
                
               // console.log(this.state.listaProdutos);

            };
        })

        

    }


    componentDidMount(){
        this.BuscarMinhasreceitas();
    }

    MaisInformacoes=(receita)=>{
        this.toggle()
        
        
        this.setState({InformacoesReceita :{
            receitaid : receita.receitaId,
            titulo : receita.titulo,
            conteudo : receita.conteudo,
        }})

        

        console.log(receita)
    }

    putSetState=(input)=>{
        this.setState({
            InformacoesReceita :{
                ...this.state.InformacoesReceita, [input.target.name] : input.target.value
            }
        })
    }

    // AtulizaQuantidade = (input) => {
    //     this.setState({
    //         InformacoesOferta :{
    //             ...this.state.InformacoesOferta, [input.target.name] : parseFloat(input.target.value)
    //         }
    //     })
        
    // }

    putSetStateFile = (input) =>{
        this.setState({
            InformacoesReceita : {
                ...this.state.InformacoesReceita, [input.target.name] : input.target.files[0]
            }   
        })

        // console.log("Atulizou ", this.state.putUsuario.imagemUsuario )
    }



    
    AlteraInfo=(event)=>{
        event.preventDefault();
        let receita_id = this.state.InformacoesReceita.receitaid;
        let usuario = new FormData();
        usuario.set("titulo", this.state.InformacoesReceita.titulo)
        usuario.set("conteudo", this.state.InformacoesReceita.conteudo)
        usuario.set("imagemReceita",this.state.InformacoesReceita.imagemReceita)
        usuario.set("receitaId",this.state.InformacoesReceita.receitaid)

        // console.log(this.state.InformacoesOferta.preco)
        // console.log(this.state.InformacoesOferta.quantidade)
        // console.log(this.state.InformacoesOferta.produto)
        console.log(localStorage.getItem("user-coorganicas"))

        fetch('http://localhost:5000/api/Receita/'+receita_id,{
            method:"PUT",           
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("user-coorganicas")                
            },
            body: usuario          

        })
        .then(response=>response.json())
        .then((response) => {
            if(response.erro !== true){
                toastr.success(response.mensagem); //error warning
            }
        })
        .catch(error => {
            console.log("Cath ",error);
            this.setState({erroMsg : "Falha ao alterar as informações"});
        })  
        
    }

    DeletarOferta(receita){

        let config = {
            headers: {
                "Content-Type":"application/json",
                // "Access-Control-Allow-Origin":"*",
                "Authorization" : "Bearer " + localStorage.getItem("user-coorganicas") 
            }
        }

        let receita_id = this.state.InformacoesReceita.receitaid

        Axios.delete('http://localhost:5000/api/Receita/'+receita_id, config)
        .then(response => {
            if(response.status===200){
                if(response.erro !== true){
                    toastr.success("Oferta deletada com sucesso"); //error warning
                    this.toggle();
                }
            }
        }).catch(error => {
            toastr.error("Falha em deletar a oferta pois ja está reservada")
        })
        
    }


    render(){
        return( 
            
            <main className="mobile">
                <div className="container_perfil">
                    <MenuPerfilC/>
                
                    <div className="direito2">
                        <h1 className="t_perfil">Minhas Receitas</h1>
                        <form method="GET" id="form_meusprodutos" className="products" >
                            
                        {
                            this.state.lista.map(function(receita) { 
                               
                                return(
                                    <div className="products2" onClick={()=>this.MaisInformacoes(receita)}>
                                        <img src={receita.imagemReceita && require(`../../Assets/images/receitas/${receita.imagemReceita}`)} alt="teste"/>
                                        <div className="espaco_inputi">
                                            <label>
                                                <p>{receita.titulo}</p>
                                            </label>
                                        </div>
                                    </div>
                                )
                            }.bind(this))
                        }
                                
                            
                            

                        </form>

                        
                     
                
                
                
            
            <MDBContainer>
            <form onSubmit={this.AlteraInfo}>
            <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
              <MDBModalHeader toggle={this.toggle}> Informações da sua Receita:</MDBModalHeader>
              <MDBModalBody>
                <label> <span>Receita: </span>
                        <input type="text" aria-label="Digite sua Região" name= "titulo" value= {this.state.InformacoesReceita.titulo} onChange={this.putSetState}></input>
                    </label> 
                
                    <label> <span>Descrição: </span>
                        <input type="text" aria-label="Digite a descrição do produto" name="conteudo"  value={this.state.InformacoesReceita.conteudo} onChange={this.putSetState} ></input>
                    </label>
                    <label><span>Imagem: </span>
                        <input type="file" aria-label="Digite o seu nome" name="imagemReceita" onChange={this.putSetStateFile} ref={this.state.InformacoesReceita.imagemReceita}  placeholder="Enviar arquivo..." className="img__inputt"/>
                    </label>>
               
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn color="secondary" Class= "btn1" onClick={this.toggle} >Fechar</MDBBtn>
                <MDBBtn color="primary" Class= "btn2" type="submit">Alterar</MDBBtn>
                <MDBBtn color="primary"  Class= "btn_" onClick={()=>this.DeletarOferta(this.state.InformacoesReceita)}>Deletar</MDBBtn>
              </MDBModalFooter>
            </MDBModal>
            </form>
          </MDBContainer>
          </div> 
          </div>
          </main>
         
          
            
        

        )
    }
}
export default MinhasReceitas;

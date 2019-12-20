import React,{Component} from 'react';
// import MenuPerfil from '../../Componentes/Menu_Perfil/Menu_Perfil';
import Axios from 'axios';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import toastr from 'toastr';
import MenuPerfilA from '../../Componentes/MenuPerfilA/MenuPerfilA';
import { parseJwt } from '../../Services/auth';


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






class Perfil2 extends Component{

    constructor(){
        super();
        this.state = {
            listaProdutos : [],
            modal: false,

            InformacoesOferta : {
                preco : "",
                ofertaid:"",
                cidade :"",
                validade :"",
                quantidade :"",
                regiao :"",
                descricao:"",
                produto :""
            }

        }
    }

    toggle = () => {
        this.setState({
          modal: !this.state.modal
        });
        this.BuscarMeusProdutos()
      }
      


    BuscarMeusProdutos (){

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


        Axios.get('http://localhost:5000/api/Oferta/meusprodutos',config)
        .then(response=> {
            if(response.status === 200){
                    
                    this.setState({listaProdutos : response.data});
                
                
               // console.log(this.state.listaProdutos);

            };
        })

        

    }


    componentDidMount(){
        this.BuscarMeusProdutos();
        
    }

    MaisInformacoes=(oferta)=>{
        this.toggle()
        
        
        this.setState({InformacoesOferta :{
            preco : oferta.preco,
            cidade : oferta.cidade,
            validade : oferta.validade,
            quantidade : oferta.quantidade,
            regiao : oferta.regiao,
            descricao : oferta.descricao,
            produto : oferta.produto.nome, 
            ofertaid : oferta.ofertaId
        }})

        

        console.log(oferta)
    }

    putSetState=(input)=>{
        this.setState({
            InformacoesOferta :{
                ...this.state.InformacoesOferta, [input.target.name] : input.target.value
            }
        })
    }

    AtulizaQuantidade = (input) => {
        this.setState({
            InformacoesOferta :{
                ...this.state.InformacoesOferta, [input.target.name] : parseFloat(input.target.value)
            }
        })
        
    }
    
    AlteraInfo=(event)=>{
        event.preventDefault();
        let oferta_id = this.state.InformacoesOferta.ofertaid;
        let usuario = new FormData();
        usuario.set("preco", this.state.InformacoesOferta.preco)
        usuario.set("quantidade", this.state.InformacoesOferta.quantidade)
        usuario.set("descricao", this.state.InformacoesOferta.descricao)

        console.log(this.state.InformacoesOferta.preco)
        console.log(this.state.InformacoesOferta.quantidade)
        console.log(this.state.InformacoesOferta.produto)
        console.log(localStorage.getItem("user-coorganicas"))

        fetch('http://localhost:5000/api/Oferta/'+oferta_id,{
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

    DeletarOferta(oferta){

        let config = {
            headers: {
                "Content-Type":"application/json",
                // "Access-Control-Allow-Origin":"*",
                "Authorization" : "Bearer " + localStorage.getItem("user-coorganicas") 
            }
        }

        let oferta_id = this.state.InformacoesOferta.ofertaid

        Axios.delete('http://localhost:5000/api/Oferta/'+oferta_id, config)
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
                    <MenuPerfilA/>
                
                    <div className="direito2">
                        <h1 className="t_perfil">Minhas Ofertas</h1>
                        <form method="GET" id="form_meusprodutos" className="products" >
                            
                        {
                            this.state.listaProdutos.map(function(oferta) { 
                               
                                return(
                                    <div className="products2" onClick={()=>this.MaisInformacoes(oferta)}>
                                        <img src={oferta.produto.imagemProduto && require(`../../Assets/images/produtos/${oferta.produto.imagemProduto}`)} alt="teste"/>
                                        <div className="espaco_inputi">
                                            <label>
                                                <p>{oferta.descricao.toUpperCase()}</p>
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
              <MDBModalHeader toggle={this.toggle}> Informações da sua Oferta:</MDBModalHeader>
              <MDBModalBody>
                  <div className="mdb_perfil2">
                <label> <span>Produto: </span>
                        <input type="text" aria-label="Digite sua Região" name= "produto" readOnly value= {this.state.InformacoesOferta.produto} ></input>
                    </label> 
                <label> <span>Cidade: </span>
                        <input type="text"  aria-label="Digite sua Cidade" name="cidade" readOnly value= {this.state.InformacoesOferta.cidade} ></input>
                    </label> 

                    <label> <span>Região: </span>
                        <input type="e-mail" aria-label="Digite sua Região" name= "regiao" readOnly value= {this.state.InformacoesOferta.regiao} ></input>
                    </label> 

                    <label> <span>Validade: </span>
                        <input type="text" aria-label="Digite a sua Validade" name="validade" readOnly value={this.state.InformacoesOferta.validade} ></input>
                    </label> 

                    <label> <span>Descrição: </span>
                        <input type="text" aria-label="Digite a descrição do produto" name="descricao"  value={this.state.InformacoesOferta.descricao} onChange={this.putSetState} ></input>
                    </label>

                    <label> <span>Quantidade: </span>
                        <input type="number"aria-label="Digite a Quantidade"name="quantidade" value={this.state.InformacoesOferta.quantidade} onChange={this.AtulizaQuantidade}></input>
                    </label> 

                    <label> <span>Preço por Kg: </span>
                        <input type="number" aria-label="Digite o Preco"name="preco"  value={this.state.InformacoesOferta.preco} onChange={this.putSetState} ></input>
                    </label>
                    </div>
               
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn color="secondary" Class= "btn1" onClick={this.toggle} >Fechar</MDBBtn>
                <MDBBtn color="primary" Class= "btn2" type="submit">Alterar</MDBBtn>
                <MDBBtn color="primary"  Class= "btn_" onClick={()=>this.DeletarOferta(this.state.InformacoesOferta)}>Deletar</MDBBtn>
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
export default Perfil2;

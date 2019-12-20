import React,{Component} from 'react';
// import MenuPerfil from '../../Componentes/Menu_Perfil/Menu_Perfil';
import Axios from 'axios';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import toastr from 'toastr';
import { parseJwt } from '../../Services/auth';
import PerfilAdm from '../../Componentes/PerfilAdm/PerfilAdm';


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






class Perfil6 extends Component{

    constructor(){
        super();
        this.state = {
            listaProdutos : [],
            modal: false,
            produto : {
                nome : "",
                produtoid : "",
                imagemProduto : React.createRef()  
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


        Axios.get('http://localhost:5000/api/Produto',config)
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

    MaisInformacoes=(produto)=>{
        this.toggle()
        
        
        this.setState({produto :{
            nome : produto.nome, 
            produtoid : produto.produtoId,
            imagemProduto: React.createRef()
        }})

        

        console.log(produto)
    }

    putSetState=(input)=>{
        this.setState({
            produto :{
                ...this.state.produto, [input.target.name] : input.target.value
            }
        })
    }

    putSetStateFile = (input) =>{
        this.setState({
            produto : {
                ...this.state.produto, [input.target.name] : input.target.files[0]
            }   
        })

        console.log("Atualizou ", this.state.produto.imagemProduto )
    }
    
    AlteraInfo=(event)=>{
        event.preventDefault();
        let produto_id=this.state.produto.produtoid;
        let usuario = new FormData();
        usuario.set("nome",this.state.produto.nome)
        usuario.set("produtoId",this.state.produto.produtoid)
        usuario.set('imagemProduto', this.state.produto.imagemProduto.current.files[0])
        console.log(this.state.produto.nome)
        console.log(this.state.produto.imagemProduto)
        console.log(localStorage.getItem("user-coorganicas"))
        console.log(produto_id)
        console.log(usuario)

        fetch('http://localhost:5000/api/Produto/'+produto_id,{
            method:"PUT",           
            headers: {
                // "Content-Type":"application/json",
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

    DeletarOferta(produto){

        let config = {
            headers: {
                "Content-Type":"application/json",
                // "Access-Control-Allow-Origin":"*",
                "Authorization" : "Bearer " + localStorage.getItem("user-coorganicas") 
            }
        }

        let produto_id=this.state.produto.produtoid;


        Axios.delete('http://localhost:5000/api/Produto/'+produto_id, config)
        .then(response => {
            if(response.status===200){
                if(response.erro !== true){
                    toastr.success("Oferta deletada com sucesso"); //error warning
                    this.toggle();
                }
            }
        }).catch(error => {
            toastr.error("Falha em deletar o produto pois ja está reservada")
        })
        
    }







    render(){
        return( 
            
            <main className="mobile">
                
                <div className="container_perfil">
                <PerfilAdm/>
                
                    <div className="direito2">
                        <h1 className="t_perfil">Meus Produtos</h1>
                        <form method="GET" id="form_meusprodutos" className="products" >
                            
                        {
                            
                            this.state.listaProdutos.map(function(produto) { 
                               
                                return(
                                   
                                    <div className="products2" onClick={()=>this.MaisInformacoes(produto)}>
                                        <img src={produto.imagemProduto && require(`../../Assets/images/produtos/${produto.imagemProduto}`)} alt="teste"/>
                                        <div className="espaco_inputi">
                                            <label>
                                                <p>{produto.nome}</p>
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
                  <div className = "mdb_perfl6">
                  <label>
              <input type="file" aria-label="Escolha sua imagem" name="imagemProduto" onChange={this.putSetStateFile} ref={this.state.produto.imagemProduto}  placeholder="Enviar arquivo..." className="img__inputt"/>
                  </label>
                <label> <span>Produto: </span>
                        <input type="text" aria-label="Nome do produto" name = "nome"  value= {this.state.produto.nome} onChange={this.putSetState} ></input>
                    </label> 
                    </div> 
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn color="secondary" Class= "btn1" onClick={this.toggle} >Fechar</MDBBtn>
                <MDBBtn color="primary" Class= "btn2" type="submit">Alterar</MDBBtn>
                <MDBBtn color="primary"  Class= "btn_" onClick={()=>this.DeletarOferta(this.state.produto)}>Deletar</MDBBtn>
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
export default Perfil6

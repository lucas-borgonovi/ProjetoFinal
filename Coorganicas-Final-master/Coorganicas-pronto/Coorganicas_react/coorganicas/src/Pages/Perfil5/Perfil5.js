import React, {Component} from 'react';
import ImgCadastroProduto from '../../Assets/images/photo.svg';
import toastr from 'toastr';
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
    "timeOut": "12000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}



class Perfil5 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nome: "",
            imagemProduto : React.createRef(),

            loading: false,
            erroMsg: "",
            MsgSuccess: ""
        }
    }

    limpaForm = () =>{
        this.setState({
            nome: "",
            imagemProduto: ""
        })
    }

    atualizaStateCampo=(event)=> {
      this.setState({[event.target.name] : event.target.value});  
    };

    CadastrarProduto = (event)=> {

        event.preventDefault();
        console.log("Cadastrando");

        let produto = new FormData();
        
        produto.set("nome", this.state.nome)
        produto.set('imagemProduto', this.state.imagemProduto.current.files[0]);
        
        console.log(this.state.nome)
        console.log(this.state.imagemProduto)

        // let config = {
        //     headers: {
        //         "Content-Type":"application/json",
        //         "Access-Control-Allow-Origin":"*",
        //         'Authorization': 'Bearer ' + localStorage.getItem("user-coorganicas")        // Cors
        //     }
        // }
        
        fetch('http://localhost:5000/api/Produto', {
            method: "POST",
            headers:{
                // "Content-Type":"application/json",
                "Access-Control-Allow-Origin":"*",
                'Authorization': 'Bearer ' + localStorage.getItem("user-coorganicas") 
            },
            body: produto
        })        
        .then(Response => Response.json())
        .then((Response) => {
            console.log("resp", Response)

            if(Response.erro !== true) {
                
                toastr.success("Imagem cadastrada com sucesso!!");
               
                this.setState({
                    nome: "",
                    imagemProduto: ""
                })
            }
        })
        .catch(error => {
            console.log("Cath ",error);
            this.setState({erroMsg : "Falha ao cadastrar as informações"});
        })
    }

    render() {
        return (
            <div className="container_perfil">
                <PerfilAdm/>
                
                <div className="direito3">
                    <h1 className="t_perfil">Cadastrar Produtos</h1>
                    <form  id="form_receita" onSubmit={this.CadastrarProduto} onReset={this.limpaForm}>
                        <div className="carde_receita">
                            <div className="tracado"><img src={ImgCadastroProduto} alt="Campo para inserir uma imagem"/></div>
                            <div className="btn_file_espaco">
                                <label>
                                    <input type="file" aria-label="Digite o seu nome" name="imagemReceita" ref={this.state.imagemProduto} required placeholder="Enviar arquivo..."></input>
                                </label>
                            </div>
                        </div>
                        <div className="cadas_receita">
                            <label className="label_receita2"><span>Produto:</span>
                                <input type="text" aria-label="Digite o seu nome" name="nome" value= {this.state.nome} required onChange={this.atualizaStateCampo}></input>
                            </label>
                        </div>
                        <div className="espaco_perfils">
                            <div className="btns_cadastroreceita">
                                <button type="submit" className="btn_">Adicionar</button>
                                <button type="reset" className="btn_">Cancelar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Perfil5;
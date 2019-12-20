import React, {Component} from 'react';
import Axios from 'axios';
import toastr from 'toastr';

import '../../Assets/css/estilo.css'
import MenuPerfilA from '../../Componentes/MenuPerfilA/MenuPerfilA';

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

class Perfil extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lista: [],
            descricao: "",
            validade: "",

            produto: "Selecione o Produto",
            listaProduto : [],

            cidade: "",
            regiao: "",
            quantidade: "",
            preco: "",
            loading: false,
            erroMsg: "",
            MsgSuccess: ""
        }
    }

    limpaForm = () =>{
        this.setState({
            descricao: "",
            validade: "",
            produto: "Selecione o Produto",
            cidade: "",
            regiao: "",
            quantidade: "",
            preco: ""            
            
        })
    }

    // POST
    atualizaStateCampo(event) {
        this.setState({[event.target.name]: event.target.value});
    };

    cadastrarProduto(event) {
        
        event.preventDefault();
        console.log("Cadastrando");

        this.setState({ loading: true });

        let produto = {
            produtoId: this.state.produto,
            validade: this.state.validade,
            descricao: this.state.descricao,
            cidade: this.state.cidade,
            regiao: this.state.regiao,
            quantidade: this.state.quantidade,
            preco: this.state.preco,

        };

        let config = {
            headers: {
                "Content-Type":"application/json",
                // "Access-Control-Allow-Origin":"*",
                "Authorization" : "Bearer " + localStorage.getItem("user-coorganicas") 
            }
        }

        Axios.post('http://localhost:5000/api/Oferta', produto, config)
            .then(Response => {

                if (Response.status === 200) {
                    toastr.success("Cadastrado com sucesso!");
                    this.setState({
                        cidade: "",
                        regiao: "",
                        validade: "",
                        descricao: "",
                        quantidade: "",
                        preco: "",
                        produto: ""
                    })
                }
            })
            .catch(erro => {
                toastr.error("Falha ao cadastrar a Oferta")
                
            });
    }

    // Após renderizar o componente
    async componentDidMount() {
        console.log("Carregado...");
        this.ListarProdutos();
        
    }

    async ListarProdutos() {
    
        fetch("http://localhost:5000/api/produto")
            .then(response => response.json())
            .then(data => {
                this.setState({ listaProduto : data });
                console.log("Produtos: ", data);
             })
            .catch(error => console.log(error));       
    }
    
    AtulizaProdutoId = (input) => {
        this.setState({produto : input.target.value});
    }

    // POST

    render(){
        return(
            <main>
                <div className="container_perfil">
                    <MenuPerfilA/>
                       <div className="direito_oferta">
                    
                    <form method="POST" id="form_cadastro_produtos" onSubmit={this.cadastrarProduto.bind(this)} onReset={this.limpaForm}>
                        <h1 className="t_perfil">Cadastrar Oferta</h1>

                        <select name="produto" class="select_cadastro" aria-label="Digite o Produto" onChange={this.AtulizaProdutoId} value={this.state.produto} className="select_oferta">
                            <option value="Selecione o Produto" disabled>Selecione o Produto</option>
                            {
                                this.state.listaProduto.map(function(produto){
                                    return (
                                        <option key={produto.produtoId} value={produto.produtoId}>{produto.nome}</option>
                                    );
                                })   
                            }
                        </select><br/>
                       
                        <label> <span>Cidade</span>
                            <input type="text" aria-label="Digite sua Cidade" name="cidade" value={this.state.cidade} required onChange={this.atualizaStateCampo.bind(this)}></input>
                        </label>
                        <label> <span>Região</span>
                            <input type="e-mail" aria-label="Digite sua Região" name="regiao" value={this.state.regiao} required onChange={this.atualizaStateCampo.bind(this)}></input>
                        </label>
                        <label> <span>Validade </span>
                            <input type="text" aria-label="Digite a sua Validade" name="validade" value={this.state.validade} required onChange={this.atualizaStateCampo.bind(this)}></input>
                        </label>
                        <label> <span>Descrição</span>
                            <input type="text" aria-label="Digite a descrição do produto" name="descricao" value={this.state.descricao} required onChange={this.atualizaStateCampo.bind(this)}></input>
                        </label>
                        <label> <span>Quantidade</span>
                            <input type="text" aria-label="Digite a Quantidade" name="quantidade" value={this.state.quantidade} required onChange={this.atualizaStateCampo.bind(this)}></input>
                        </label>
                        <label> <span>Preço por Kg</span>
                            <input type="text" aria-label="Digite o Preco" name="preco" value={this.state.preco} required onChange={this.atualizaStateCampo.bind(this)}></input>
                        </label>
                        <div className="btns">
                            <button type="submit" class="btn_">Adicionar</button>
                            <button type="reset" class="btn_">Cancelar</button>
                        </div>
                    </form>
                    </div>
                </div>
            </main>            
        );
    }
}

export default Perfil;

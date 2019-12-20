import React, { Component } from 'react';
import '../../Assets/css/estilo.css';
import '../../Assets/css/login.css';
import Header from '../../Componentes/Header/Header';
import Footer from '../../Componentes/Footer/Footer';
// import Axios from 'axios';
import { parseJwt } from '../../Services/auth';
import api from '../../Services/api';
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


////fazendo a componentização da página Login- Julia
// import '../../css/login.css'

class Login extends Component {
    
    
    constructor(){
        super();
        this.state = {
            RazaoSocial: '',
            Email: '',
            Senha: '',
            ConfirmarSenha : "",
            Cidade: '',
            Endereco: '',  
            Numero: '',
            Telefone: '',
            Cep:"",
            Cnpj: '',
            perfil : "",
            user:'',
            code:'',
            erro : false,
            mensagemErro : "",
        };
    };

    // POST !
    CadastrarCooperativa = (event) => {
        event.preventDefault();
        //this.setState({ isLoading: true});

         // Declara um objeto do tipo FormData, já que o Backend recebe este tipo.
         let usuario = new FormData();

        //  alert(
        //     `Selected file - ${
        //     this.state.fileInput.current.files[0].name
        //     }`
        // );

         // Define um evento que recebe os dados do state
        // É necessário converter o acessoLivre para int, para que o back-end consiga converter para bool ao cadastrar
        // Como o navegador envia o dado como string, não é possível converter para bool implicitamente

       
            usuario.set("nome",this.state.RazaoSocial);
            usuario.set("email", this.state.Email);
            usuario.set("senha", this.state.Senha);
            usuario.set("cidade", this.state.Cidade);
            usuario.set("endereco", this.state.Endereco); 
            usuario.set("numero", this.state.Numero);
            usuario.set("telefone",this.state.Telefone);
            usuario.set("cnpj",this.state.Cnpj);
            usuario.set("confirmarSenha", this.state.ConfirmarSenha); // Incluir na view do back confirmarsenha
            usuario.set("cep", this.state.Cep);
            usuario.set("tipoUsuarioId", this.state.perfil);
        

       try {
           
           // Define a URL e o corpo da requisição
           fetch('http://localhost:5000/api/usuario', {
               method: "POST", 
               headers: {
                   // "Content-Type":"application/json",// Cors,
                   'Authorization': 'Bearer ' + localStorage.getItem("user-coorganicas"),
                   "Access-Control-Allow-Origin":"*"
            },
            body: usuario,
        })
        .then(response => {
            response.json();
            if (response.status === 200) {
                        toastr.success("Cadastro efetuado com Sucesso!!");
                        // exibe no console do navegador a mensagem 'Evento cadastrado!'
                        console.log('Evento cadastrado!');
                        // e define que a requisição terminou
                        //this.setState({ isLoading : false });
                    }else{
                        toastr.error("Erro ao cadastrar!!!!");
                        this.setState({erro : true})
                        this.setState({mensagemErro : response.data.mensagem})
                    }
        })
        // .then(response => {
            //     // Caso retorne status code 200,
            //     if (response.status === 200) {
                //         toastr.success("Cadastro efetuado com Sucesso!!");
                //         // exibe no console do navegador a mensagem 'Evento cadastrado!'
                //         console.log('Evento cadastrado!');
                //         // e define que a requisição terminou
                //         this.setState({ isLoading : false });
                //     }
                // })
                .catch(error => console.log('Não foi possível cadastrar:' + error))
                
            } catch (error) {
                alert(error);
            }

    };

    fazerLogin=(event)=>{
        event.preventDefault();
        
        let user=new FormData();
        user.set("email",this.state.user)
        user.set("senha",this.state.code)
        // console.log(this.state.login.email)
        // console.log(this.state.login.senha)
        

        api.post('/login',user)
        .then(response=>{

            console.log("Meu token é: " + response.data.token)
            console.log(response)

        //caso a requisição retorne um status code 200
        //sarvar o token no localstorage
        //e define que a requiseição terminou
        if (response.data.erro !== true) { 

            localStorage.setItem('user-coorganicas', response.data.token);
          
            // this.setState({ isLoading: false })
            // //define base 64 recebendo o payload do token
            // var base64 = localStorage.getItem('user-coorganicas').split('.')[1]
            // console.log(base64)

            // //exibe valor convertido para string
            // console.log(window.atob(base64))

            // //exibe valor convertido pra json
            // console.log(JSON.parse(window.atob(base64)))

            // //exibe no console o tipo de usuario logado
            // console.log(parseJwt().Role)

            // console.log(parseJwt().Id)

            if(parseJwt().Role === 'Administrador') {
                this.props.history.push('/Perfil6')
            }
            else if(parseJwt().Role === 'Comunidade') {
                this.props.history.push('/produtos');
            }
            else {
                this.props.history.push('/Perfil2');
            }

        } else {
            toastr.info("E-mail ou senha incorreto!"); 
        }

        })
        .catch(erro => {
            console.log("Erro: ", erro)
            //this.setState({ erroMensagem: 'E-mail ou senha inválidos!' })
            //this.setState({ isLoading: false })
            toastr.error("Erro ao efetuar o login!");
          })
   
    }

          
      
    AtualizaEstado = (input) => {
        // console.log("Atualizando: ", [input.target.name])

        this.setState({ [input.target.name] : input.target.value})
         //mostrando as atualizções 
        console.log(this.state.Cnpj)
        console.log(this.state.perfil) 
        console.log(this.state.RazaoSocial)
        console.log(this.state.user)
        console.log(this.state.code)
        console.log(this.state.Cep)  
        console.log(this.state.Cidade)
        console.log(this.state.Endereco)
        console.log(this.state.Numero)
        console.log(this.state.Email)
        console.log(this.state.Senha)
    }
     
      
 

 
    render() {
        return (
              
          <div>
              <Header/>
            <main className="banner_login">
                
        {this.state.erro == false? null : <p>Erro : {this.state.mensagemErro}</p>}

                <div className="cotaniner_login">
                    <div className="espaco_entrar">
                        <form method="GET" id="form_usuario" className="entrar_login" onSubmit={this.fazerLogin}>
                            <label>
                                <input type="text" placeholder="Email:" aria-label="Digitar o E-mail" name="user"
                                    required value={this.state.user} onChange={this.AtualizaEstado}></input>
                                <input type="password" placeholder="Senha:" aria-label="Digitar a Senha" name="code" required value={this.state.code} onChange={this.AtualizaEstado} className="input_senha"></input>
                                <div className="espaco_btn_login"><button type="submit" className="btn_" ><p>Entrar</p></button> </div>
                                <p className="t_login">Não possui cadastro? Inscreva-se</p>

                            </label>

                        </form>

                    </div>
                    <form  onSubmit= {this.CadastrarCooperativa}method="GET" id="form_cadastro" className="cadastro_login">
                       
                       

                        <label> <span>Razão Social</span>
                            <input type="text" placeholder="Digite o seu nome" aria-label="Digitar o  seu nome " name="RazaoSocial" 
                                 className="in_login" value={this.state.RazaoSocial} onChange={this.AtualizaEstado}></input> {/*precisa colocar o " onChange={this.AtualizaEstado} {/*os names precisam estar iguais as declarações do constructor*/}
                        </label>

                    
                        <label> <span>E-mail:</span>
                            <input type="text" placeholder="Digite o seu e-mail" aria-label="Digitar o seu e-mail" name="Email"
                                required className="in_login" value={this.state.Email} onChange={this.AtualizaEstado}></input>
                        </label>
                        <label> <span>Confirmar e-mail:</span>
                            <input type="text" placeholder="Confirme o seu e-mail" aria-label="Digitar o seu e-mail"
                                name="Email" required  className="in_login" value={this.state.Email} onChange={this.AtualizaEstado}></input>

                        </label>
                        <label> <span>Senha:</span>
                            <input type="text" placeholder=" Digite a senha" aria-label="Digitar a senha" name="Senha" required
                                className="in_login" value={this.state.Senha} onChange={this.AtualizaEstado}></input>
                        </label>

                        <label> <span>Confirmar senha:</span>

                            <input type="text" placeholder="Confirmar senha" aria-label="Confirmar a senha"
                                name="ConfirmarSenha" required className="in_login" value={this.state.ConfirmarSenha} onChange={this.AtualizaEstado}></input>
                        </label>
                        <label> <span>Cidade:</span>
                            <input type="text" placeholder="Digite a cidade" aria-label="Digitar a cidade" name="Cidade"
                                required className="in_login" value={this.state.Cidade} onChange={this.AtualizaEstado}></input>

                        </label>
                        <label> <span>Endereço:</span>
                            <input type="text" placeholder="Digite o endereço" aria-label="Digite o endereço" name="Endereco"
                                required className="in_logine" value={this.state.Endereco} onChange={this.AtualizaEstado}></input>

                            <label> <span className="c">Nº:</span>

                                <input type="text" placeholder="" aria-label="Digite o numero" name="Numero"
                                    required className="in_loginn" value={this.state.Numero} onChange={this.AtualizaEstado}></input>

                            </label>

                        </label>
                        <label> <span>CEP:</span>
                            <input type="text" placeholder="Digite o cep" aria-label="Digite o Cep" name="Cep"
                                required className="in_login" value={this.state.Cep} onChange={this.AtualizaEstado}></input>
                        </label>
                        <label> <span>Telefone:</span>
                            <input type="text" placeholder="Digite o telefone" aria-label="Digite o telefone" name="Telefone"
                                required className="in_login" value={this.state.Telefone} onChange={this.AtualizaEstado}></input>
                        </label>
                        <label className="espaco_span"> <span>CNPJ:</span>

                            <input type="text" placeholder="Digite o CNPJ" aria-label="Digitar CNPJ" name="Cnpj" required
                                className="in_login" value={this.state.Cnpj}  onChange={this.AtualizaEstado}></input>
                        </label>
                        <div className="espaco">
                            <div className="radius">
                                {/*os values estão com valores determinados pelo banco de dados */ }
                                <input type="radio" name="perfil" className="btn_cadastro" value={3} onChange={this.AtualizaEstado}/>Agricultor
                                <input type="radio" name="perfil" className="btn_cadastro" value={2} onChange={this.AtualizaEstado}/>Comunidade
                            </div>
                        </div>
                        <div className="espaco_btn_login">
                        <button type="submit" className="btn_"><p>Cadastrar</p></button>
                        </div>


                    </form>
                </div>
                <Footer/>
            </main>
            </div>
           

        )
    }
}

export default Login;
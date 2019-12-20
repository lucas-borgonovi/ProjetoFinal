import React,{Component} from 'react';
import Axios from 'axios';
// import { bindExpression } from '@babel/types';
import toastr from 'toastr';

import img_perfil3 from '../../Assets/images/photo.svg'
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



 class PerfilConfig2 extends Component{

    constructor(){
        super()
        this.state={
            putUsuario:{
                usuarioId:"",
                nome:"",
                email:"",
                senha:"",
                ConfirmaSenha : "",
                telefone:"",
                endereco:"",
                cidade: "",
                cep: "",
                numero:"",
                imagemUsuario: React.createRef()
            },

            erroMsg : "",
            successMsg : ""
        }
    }

    componentDidMount(){
        this.PegarUsuario();
    }

    PegarUsuario = () => {
        let config = {
          headers: {
            //   "Content-Type":"application/json",
              "Access-Control-Allow-Origin":"*" // Cors
          }
        }
        var id=parseJwt().Id
        console.log(id)
        
       Axios.get(`http://localhost:5000/api/Usuario/` + id, config)
        .then(response => {
          console.log(response.data)        
          this.setState({putUsuario : {
            ...this.state.putUsuario, 
            nome : response.data.nome,
            email : response.data.email,
            // senha : response.data.senha,
            // ConfirmaSenha : response.data.senha,
            telefone : response.data.telefone[0].telefone1,
            endereco : response.data.endereco[0].endereco1,
            cidade:  response.data.endereco[0].cidade,
            cep:  response.data.endereco[0].cep,
            numero: response.data.endereco[0].numero
          }});
          
        //   console.log("Nome: ", this.state.putUsuario.usuarioId);
        })
        .catch(error => {
          console.log(error);
        });     
    }

    limpaForm = () => {
        // this.setState({
        //     putUsuario:{
        //     usuarioId:4,
        //     nome:"",
        //     email:"",
        //     senha:"",
        //     ConfirmaSenha : ""
        // },
        // })
        this.PegarUsuario();
    }

    putSetState=(input)=>{
        this.setState({
            putUsuario : {
                ...this.state.putUsuario, [input.target.name] : input.target.value
            }
        })
        // console.log(this.state.putUsuario.nome)
        // console.log(this.state.putUsuario.email)
        // console.log(this.state.putUsuario.senha)
        // console.log(this.state.putUsuario.ConfirmaSenha)
        
    }
    // alteraUsuario(event){
    //     event.preventDefault();
    // }


    putSetStateFile = (input) =>{
        this.setState({
            putUsuario : {
                ...this.state.putUsuario, [input.target.name] : input.target.files[0]
            }   
        })

        console.log("Atulizou ", this.state.putUsuario.imagemUsuario )
    }


    putUsuario=(event)=>{
        event.preventDefault();
        var id=parseJwt().Id
        console.log(id)
        
        // let usuario_id = 3;
        // let usuario_alterado = this.state.putUsuario
        let usuario = new FormData();

        // Arrumar os states para poder mandar corretamente os dados e ver o que está acontecendo com a view
        usuario.set("usuarioId",this.state.putUsuario.usuarioId)
        usuario.set("nome",this.state.putUsuario.nome)
        usuario.set("email",this.state.putUsuario.email)
        usuario.set("senha",this.state.putUsuario.senha)
        usuario.set("confirmarSenha",this.state.putUsuario.ConfirmaSenha)
        usuario.set('imagemUsuario', this.state.putUsuario.imagemUsuario.current.files[0])
        usuario.set("cidade",this.state.putUsuario.cidade)
        usuario.set("endereco",this.state.putUsuario.endereco)
        usuario.set("cep",this.state.putUsuario.cep)
        usuario.set("numero",this.state.putUsuario.numero)

        console.log(this.state.putUsuario.nome)
        console.log(this.state.putUsuario.email)
        console.log(this.state.putUsuario.senha)
        console.log(this.state.putUsuario.ConfirmaSenha)
        console.log(this.state.putUsuario.imagemUsuario.current.files[0])

        let config = {
            headers: {                        
                "Access-Control-Allow-Origin":"*", // Cors,
                "Authorization" : "Bearer " + localStorage.getItem("user-coorganicas") 
            }
        }

        fetch('http://localhost:5000/api/Usuario/'+id,{
            method :"PUT",
            body: usuario
        },config)
        .then(response=> response.json())
        .then((response) => {
            if(response.erro !== true){
                toastr.success(response.mensagem); //error warning
                
            }
        })
        .catch(error => {
            console.log("Cath ",error);
            this.setState({erroMsg : "Falha ao alterar o Evento"});
        })

        setTimeout(() => {
            this.setState({successMsg : "Informações alteradas com sucesso"});
            this.setState({erroMsg : "Erro na alteração"});
        }, 3500);
    }

    //post da imagem

   

    render(){
        return(
            <div className="container_perfil">
               <MenuPerfilA/>
                <form  id="form_cadastro_conf" onSubmit={this.putUsuario} onReset={this.limpaForm}>
                                             
                            
                                    
                            <h1 className="t_perfil">Editar minhas informações</h1>


                                <div className="carde_receita">
                            <div className="tracado"><img src={img_perfil3} alt="Campo para inserir uma imagem"/></div>
                            <div className="btn_file_espaco">
                                <label>
                                    <input type="file" aria-label="Digite o seu nome" name="imagemUsuario" onChange={this.putSetStateFile} ref={this.state.putUsuario.imagemUsuario}  placeholder="Enviar arquivo..." className="img__inputt"/>
                                </label>
                            </div>
                        </div>


                                <label> <span>Nome:</span>
                                    <input type="text" placeholder="Digite o seu nome..." aria-label="Digite o seu nome" name="nome"  value ={this.state.putUsuario.nome } onChange={this.putSetState} className="input_configuracao"></input>
                                </label><br></br>
                                <label> <span>E-mail:</span>
                                    <input type="text" placeholder="Digite o seu e-mail..." aria-label="Digite o seu e-mail" name="email"  value={this.state.putUsuario.email} onChange={this.putSetState} className="input_configuracao"></input>
                                </label><br></br>
                                <label> <span>Senha:</span>
                                    <input type="password" placeholder="Digite a sua senha..." aria-label="Digite a sua senha" name="senha"  value={this.state.putUsuario.senha} onChange={this.putSetState} className="input_configuracao"></input>
                                </label><br></br>
                                <label> <span>Confirmar senha:</span>
                                    <input type="password" placeholder="Confirme a sua senha..." aria-label="Confirme a sua senha" name="ConfirmaSenha"  value={this.state.putUsuario.ConfirmaSenha} onChange={this.putSetState} className="input_configuracao"></input>
                                </label> <br></br>
                                <label> <span>Cidade:</span>
                                    <input type="text" placeholder="Digite sua cidade..." aria-label="Digite sua cidade" name="cidade"  value ={this.state.putUsuario.cidade} onChange={this.putSetState} className="input_configuracao"></input>
                                </label><br></br>
                                <label> <span>Cep:</span>
                                    <input type="text" placeholder="Digite o seu cep..." aria-label="Digite o seu cep" name="cep"  value ={this.state.putUsuario.cep} onChange={this.putSetState} className="input_configuracao"></input>
                                </label><br></br>
                                <label> <span>Endereço:</span>
                                    <input type="text" placeholder="Digite o seu endereço..." aria-label="Digite o seu endereço" name="endereco"  value ={this.state.putUsuario.endereco} onChange={this.putSetState} className="input_configuracao"></input>
                                </label><br></br>
                                <label> <span>Numero:</span>
                                    <input type="text" placeholder="Digite o seu numero..." aria-label="Digite o seu numero" name="numero"  value ={this.state.putUsuario.numero} onChange={this.putSetState} className="input_configuracao"></input>
                                </label><br></br>
                                <label> <span>Telefone:</span>
                                    <input type="text" placeholder="Digite o seu telefone..." aria-label="Digite o seu telefone" name="telefone"  value ={this.state.putUsuario.telefone} onChange={this.putSetState} className="input_configuracao"></input>
                                </label><br></br>
                                <div className="btns">
                                    <button type="submit" className="btn_">Salvar</button>
                                    <button type="reset" className="btn_">Cancelar</button>
                                </div>
                        
                           
                </form>

            </div>
        )
    }
}
export default PerfilConfig2;
import React, {Component} from 'react';
import ImgCadastroReceitas from '../../Assets/images/photo.svg';
import toastr from 'toastr';
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
    "timeOut": "12000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

class CadastrarReceitas extends Component {

    constructor(props) {
        super(props);
        this.state = {
            titulo: "",
            conteudo:"",
            imagemReceita: React.createRef(),

            loading: false,
            erroMsg: "",
            MsgSuccess: ""
        }
    }

    atualizaStateCampo=(event)=> {
      this.setState({[event.target.name] : event.target.value});  
    };

    CadastrarReceitas = (event)=> {

        event.preventDefault();
        console.log("Cadastrando");

        let receita = new FormData();
        
        receita.set("titulo", this.state.titulo)
        receita.set("conteudo", this.state.conteudo)
        receita.set('imagemReceita', this.state.imagemReceita.current.files[0]);
        
        console.log(this.state.titulo)
        console.log(this.state.conteudo)
        console.log(this.state.imagemReceita)

        // let config = {
        //     headers: {
        //         method:"PUT",           
        //         headers: {
        //             'Authorization': 'Bearer ' + localStorage.getItem("user-coorganicas")                
        //         },
        //     }
        // }
        
        fetch('http://localhost:5000/api/Receita', {
            method:"POST",           
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("user-coorganicas")                
            },
            body: receita
        })        
        .then(Response => Response.json())
        .then((Response) => {
            console.log("resp", Response)

            if(Response.erro !== true) {
                
                toastr.success(Response.mensagem);
               
                this.setState({
                    titulo: "",
                    conteudo: "",
                    imagemReceita: React.createRef()
                })
            }
        })
        .catch(error => {
            console.log("Cath ",error);
            this.setState({erroMsg : "Falha ao cadastrar as informações"});
        })
    }

    putSetStateFile = (input) =>{
        this.setState({
                ...this.state.imagemReceita, [input.target.name] : input.target.files[0]
              
        })

        console.log("Atualizou ", this.state.imagemReceita )
    }

    render() {
        return (
            <div className="container_perfil">
               <MenuPerfilC/>
                <div className="direito3">
                    <h1 className="t_perfil">Cadastrar Receitas</h1>
                    <form method="get" id="form_receita" onSubmit={this.CadastrarReceitas.bind(this)}>
                        <div className="carde_receita">
                            <div className="tracado"><img src={ImgCadastroReceitas} alt="Campo para inserir uma imagem"/></div>
                            <div className="btn_file_espaco">
                                <label>
                                    <input type="file" aria-label="Digite o seu nome" name="imagemReceita" ref={this.state.imagemReceita} required placeholder="Enviar arquivo..." className="input_enviar" onChange={this.putSetStateFile}></input>
                                </label>
                            </div>
                        </div>
                        <div className="cadas_receita">
                            <label className="label_receita2"><span>Receita:</span>
                                <input type="text" aria-label="Digite o seu nome" name="titulo" value= {this.state.titulo} required onChange={this.atualizaStateCampo} className="input_da_receita"></input>
                            </label>
                            <label className="label_receita2"><span>Descrição da receita:</span>
                                <textarea name="conteudo" cols="54" rows="10"   value= {this.state.conteudo} required onChange={this.atualizaStateCampo} className="input_da_text"></textarea>
                            </label>
                        </div>
                        <div className="espaco_perfils">
                            <div className="btns_cadastroreceita">
                                <button type="submit" class="btn_">Adicionar</button>
                                <button type="reset" class="btn_">Cancelar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default CadastrarReceitas;

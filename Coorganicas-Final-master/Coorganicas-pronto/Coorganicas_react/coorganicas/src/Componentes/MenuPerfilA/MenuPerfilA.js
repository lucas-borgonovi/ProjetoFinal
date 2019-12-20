import React,{Component} from 'react';
// import ImgPerfil2 from '../../Img/celeiro (1).svg';
import {Link} from 'react-router-dom';
import img_usuario from '../../Assets/images/celeiro (1).svg'
import { parseJwt } from '../../Services/auth';
import { slide as Menu } from 'react-burger-menu'



class MenuPerfilA extends Component{

    showSettings ( event ) {
        event . preventDefault ();
       
     }

    constructor() {
        super();
        this.state = {
            lista: [],
            menuOpen: false,
            user:{

                Nome_Usuario: "",
                imagemUsuario:""
            }
            
            }

        }
         

        handleStateChange (state) {
            this.setState({menuOpen: state.isOpen})  
          }

        closeMenu () {
            this.setState({menuOpen: false})
          }

          toggleMenu () {
            this.setState(state => ({menuOpen: !state.menuOpen}))
          }
        

        mostrarNome = () => {
            let config = {
                headers: {
                    "Content-Type":"application/json",
                    "Access-Control-Allow-Origin":"*" // Cors
                }
              }

            var id=parseJwt().Id
            console.log(id)

            fetch("http://localhost:5000/api/Usuario/"+id,config)
                .then(response => response.json())
                .then(data => {
                    this.setState({user:{
                        ...this.state.user,
                        Nome_Usuario : data.nome,
                        imagemUsuario : data.imagemUsuario
                    }})
                    console.log(this.state.user.Nome_Usuario)
                    console.log(this.state.user.imagemUsuario)
                })
    
            //desabilita o icone apos dois segundos
    
        }

        componentDidMount() {
            //console.log('Did');
            this.mostrarNome();
            
        }
    
        NomeEstado = (event) => {
            this.setState({ [event.target.name]: event.target.value })
        }
    
    render(){
        return(
            // <div className="container_perfil">

            <div>
                <Menu
                isOpen={this.state.menuOpen}
                onStateChange={(state) => this.handleStateChange(state)}
                >
            <div className="esquerdo"  onClick={() => this.closeMenu()}>
            <nav className="menu_perfil">
                <div>

                {
                    //varrer a lista de evento
                         <>
                            <Link to='#' title="Perfil de configuração do site Coorgânicas" ><img src={this.state.user.imagemUsuario && require(`../../Assets/images/Perfil/${this.state.user.imagemUsuario}`)}/></Link>  
                            <Link to='#' title="Perfil de configuração do site Coorgânicas" ><p>{this.state.user.Nome_Usuario}</p></Link>  
                        </>
                }
                <>
                
                            <Link  to='/Perfil2'  title="Meus produtos do site Coorgânicas" ><p>Minhas Ofertas</p></Link>
                            <Link to = '/Perfil'title="Cadastrar produtos do site Coorgânicas" ><p>Cadastrar Oferta</p></Link> 
                            <Link to='/Perfilconfig2' title="Minhas informações do site Coorgânicas" ><p>Minhas Informações</p></Link>
                            <Link to='/' title="Sair do site Coorgânicas" ><p>Home</p></Link>
                            </>
                            </div>
                
                
                
                
            </nav>
            </div>
            </Menu>
            <i class="fas fa-bars fa-3x"   onClick={() => this.toggleMenu()}  id="icon_font" > </i>
            <i class="fas fa-bars fa-2x" onClick={() => this.toggleMenu()} id="icon_font_mobile" ></i>
            </div>
        )
    }
}
export default MenuPerfilA;
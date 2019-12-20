import React, { Component } from 'react';
import logo from '../../Assets/images/logooriginal.png';
import '../../Assets/css/header.css'
// import '../../Assets/js/MenuMobile'

import {Link,withRouter} from 'react-router-dom';
import { usuarioAutenticado, parseJwt } from '../../Services/auth';

class Header extends Component{
    logout =() => {
        localStorage.removeItem("user-coorganicas");
        this.props.history.push("/");
    }
    render(){
        return(
            <header>
            <div className="container_">
                <div className="loog">
                    <Link to='/'><img src={logo} alt="Logo Coorgânicas"
                            className="logooriginal"/>
                </Link>
                </div>

                

                <div className="menu">

                
                    <nav>

                    <div class="dropdown">
                    <i class="fas fa-bars fa-2x"  id="icone_menu_home" > </i>
                    <div class="dropdown-content">
                    <Link to='/' title="Home do site Coorganicas">Home</Link>
                    <Link to='/quemsomos' title="Quem Somos do site Coorganicas" >Quem Somos</Link>
                    <Link to='/produtos' title="Produtos do site Coorganicas" >Produtos</Link>
                    <Link to='/receitas' title="Receitas do site Coorganicas" >Receitas</Link>


                    {usuarioAutenticado() && parseJwt().Role === "Administrador" ?(
                                    <>
                                    <Link to='/Perfil6' title="Perfil do Administrador" >Perfil
                                     </Link>
                                    
                                     <Link onClick={this.logout}>Sair</Link>
                                     </>
                                ) : (
                                    usuarioAutenticado() && parseJwt().Role === "Agricultor" ?(
                                        <>
                                        <Link to='/Perfil2' title="Perfil do agricultor" >Perfil </Link>
                                       
                                        <Link onClick={this.logout}>Sair</Link>
                                        </>
                                    ) : (
                                    usuarioAutenticado() && parseJwt().Role === "Comunidade" ?(
                                        <>
                                        <Link to='/Perfil3' title="Perfil de comunidade" >Perfil </Link>
                                        
                                        <Link onClick={this.logout}>Sair</Link>
                                        </>
                                    ):(
                                        <>
                                        <Link to='/login' title="Login/Cadastre-se do site Coorganicas" >Login /
                                        Cadastre-se </Link>
                                        </>
                                    )
                                    
                                    )
                                
                            )} 
                    </div>
                    </div>
                        
                            
                       

                        <ul>
                            <React.Fragment>
                                <Link to='/' title="Home do site Coorganicas">Home</Link>
                            </React.Fragment>
                            <React.Fragment>
                                <Link to='/quemsomos' title="Quem Somos do site Coorganicas" >Quem
                                        Somos</Link>
                            </React.Fragment>
                            <React.Fragment>
                                <Link to='/produtos' title="Produtos do site Coorganicas" >Produtos</Link>
                            </React.Fragment>
                            <React.Fragment>
                                <Link to='/receitas' title="Receitas do site Coorganicas" >Receitas</Link>
                            </React.Fragment>
                            
                            {usuarioAutenticado() && parseJwt().Role === "Administrador" ?(
                                    <>
                                    <Link to='/Perfil6' title="Perfil do Administrador" >Perfil
                                     </Link>
                                    
                                     <Link onClick={this.logout}>Sair</Link>
                                     </>
                                ) : (
                                    usuarioAutenticado() && parseJwt().Role === "Agricultor" ?(
                                        <>
                                        <Link to='/Perfil2' title="Perfil do agricultor" >Perfil </Link>
                                       
                                        <Link onClick={this.logout}>Sair</Link>
                                        </>
                                    ) : (
                                    usuarioAutenticado() && parseJwt().Role === "Comunidade" ?(
                                        <>
                                        <Link to='/Perfil4' title="Perfil de comunidade" >Perfil </Link>
                                        
                                        <Link onClick={this.logout}>Sair</Link>
                                        </>
                                    ):(
                                        <>
                                        <Link to='/login' title="Login/Cadastre-se do site Coorganicas" >Login /
                                        Cadastre-se </Link>
                                        </>
                                    )
                                    
                                    )
                                
                            )}    
                                
                            
                            
                        </ul>
                    </nav>
                </div>
                
            
            </div>
           
        </header>
           
        );
    }

}

export default withRouter(Header);
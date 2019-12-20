import React,{Component} from 'react';
import '../../Assets/css/footer.css'
import Img_Footer1 from '../../Assets/images/Grupodemascara2.png'
import Img_Footer2 from '../../Assets/images/Grupodemascara3.png'
import Img_Footer3 from '../../Assets/images/Grupodemascara4.png'
import Img_Footer4 from '../../Assets/images/facebook.png'
import Img_Footer5 from '../../Assets/images/instagram.png'
import Img_Footer6 from '../../Assets/images/twitter.png'


class Footer extends Component{
    render(){
        return(
            <footer>
            <div className="container_rodape">
                <div className="projeto">
                    <h3>Projeto</h3>
                    <p>
                        Um projeto que visa a geração de renda através da junção de mulheres e produtos agrícolas.
                    </p>
                </div>
                <div className="contatos">
                    <h3>Contatos</h3>
                    <div className="telefone">
                        <img src={Img_Footer1} alt="icone de telefone" className="svg"/>
                        <p>(11) 5794 - 5560</p>
                    </div>
                    <div className="telefone">
                        <img src={Img_Footer2} alt="icone de localização" className="svg"/>
                        <p>Av. Paulista</p>
                    </div>
                    <div className="telefone">
                        <img src={Img_Footer3} alt="icone de e-mail" className="svg"/>
                        <p>co.organicas@outlook.com.br</p>
                    </div>
                </div>
                <div className="redes_sociais">
                    <h3>Redes Sociais</h3>
                    <div className="redesImg">

                        <img src={Img_Footer4} alt="icone do facebook" className="svg"/>
                        <img src={Img_Footer5} alt="icone do instagram" className="svg" />
                        <img src={Img_Footer6} alt="icone do twitter" className="svg"/>
                    </div>
                </div>
            </div>
            
            <div className="copyy">
                <p className="copy">Coorgânicas - copyright © 2019</p>
            </div>
        </footer>

        );
    }
}

export default Footer;

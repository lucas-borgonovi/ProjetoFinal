//fazendo a componentização da página quem somos - Julia
import React  from 'react';
import '../../Assets/css/estilo.css';
import '../../Assets/css/quemsomos.css';
import img_quem from '../../Assets/images/img-quem-somos.jpg';
import Header from '../../Componentes/Header/Header';
import Footer from '../../Componentes/Footer/Footer';
import CardC from '../CardC/CardC';





function App(){
    return(
        <main>  
            
            <Header/>
        <section>
            <div className="titulo_quemsomos">
                <h1> Nossa História</h1>
                <h2>Prove o sabor de ser orgânico</h2>
            </div>
        </section>
        <section className="visao_valores">
            <div className="container_">               
                <div className="sobre">
                    <div className="imagemsobre">
                        <img src={img_quem} alt="imagem de uma mulher segurando frutas" className="img_quemsomos"/>
                    </div>
                    <div className="texto_sobre">
                        <h3>Nosso Objetivo</h3>
                        <p>
                            A Coorgânicas chegou para ajudar a todos que desejam ter uma alimentação saudável e prática para o seu dia a dia em casa e no trabalho. Mais do que isso, queremos mostrar para as pessoas que comer bem é apenas uma questão de hábito e que trazer esse hábito para sua rotina te trará uma qualidade de vida incrível.
                        </p>
                        <h4>Missão</h4>
                        <p>
                            Proporcionar uma alimentação mais nutritiva, saborosa e prática aos nossos clientes, fazendo parte da história de cada um na construção de uma vida mais saudável.
                        </p>
                        <h4>Visão</h4>
                        <p>
                            Proporcionar uma alimentação mais nutritiva, saborosa e prática aos nossos clientes, fazendo parte da história de cada um na construção de uma vida mais saudável.
                        </p>
                    </div>
                </div>
            </div>
        </section>
        <section className="comunidade">
            <div className="cotaniner column">
               
               
                </div> 
                    
               
                           
        </section> 
        <div className="TESTE">
            <CardC>     
                </CardC>   
        </div>
        <Footer/>
    
    </main>

    );
}

export default App;
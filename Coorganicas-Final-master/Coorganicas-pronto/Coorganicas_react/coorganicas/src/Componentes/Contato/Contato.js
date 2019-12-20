import React from "react";
import { MDBRow, MDBCol, MDBIcon, MDBBtn } from "mdbreact";

const ContactPage = (props) => {
  return (
    <section className="my-4">
      {/* <h2 className="h1-responsive font-weight-bold text-center my-5">
        Contact us
      </h2>
      <p className="text-center w-responsive mx-auto pb-5">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit,
        error amet numquam iure provident voluptate esse quasi, veritatis
        totam voluptas nostrum quisquam eum porro a pariatur veniam.
      </p> */}
      
      <MDBRow className="text-center">
        {/* <MDBCol lg="5" className="lg-0 mb-4">
          <MDBCard>
            <MDBCardBody>
              <div className="form-header blue accent-1">
                <h3 className="mt-2">
                  <MDBIcon icon="envelope" /> Write to us:
                </h3>
              </div>
              <p className="dark-grey-text">
                We'll write rarely, but only the best content.
              </p>
              <div className="md-form">
                <MDBInput
                  icon="user"
                  label="Your name"
                  iconClass="grey-text"
                  type="text"
                  id="form-name"
                />
              </div>
              <div className="md-form">
                <MDBInput
                  icon="envelope"
                  label="Your email"
                  iconClass="grey-text"
                  type="text"
                  id="form-email"
                />
              </div>
              <div className="md-form">
                <MDBInput
                  icon="tag"
                  label="Subject"
                  iconClass="grey-text"
                  type="text"
                  id="form-subject"
                />
              </div>
              <div className="md-form">
                <MDBInput
                  icon="pencil-alt"
                  label="Icon Prefix"
                  iconClass="grey-text"
                  type="textarea"
                  id="form-text"
                />
              </div>
              <div className="text-center">
                <MDBBtn color="light-blue">Submit</MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol> */}
        <MDBCol lg="11">
          {/* <div
            id="map-container"
            className="rounded z-depth-1-half map-container"
            style={{ height: "200px" }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d76765.98321148289!2d-73.96694563267306!3d40.751663750099084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spl!2spl!4v1525939514494"
              title="This is a unique title"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
            />
          </div> */}
            {/* <br /> */}
          <h5 className="title_ text-center">Após fazer a sua reserva entre em contato com a cooperativa!</h5>
          
          <MDBRow className="text-center">
            <MDBCol md="4">
              <MDBBtn tag="a" floating color="dark" className="accent-1">
                <MDBIcon icon="map-marker-alt" />
              </MDBBtn>
              <p>{props.dados.cidade}</p>
              <p className="mb-md-0">Região: {props.dados.regiao}</p>
            </MDBCol>
            <MDBCol md="5">
              <MDBBtn tag="a" floating color="dark" className="accent-1">
                <MDBIcon icon="phone" />
              </MDBBtn>
              <p>{props.telefone}</p>
              <p className="mb-md-0">Seg - Sex, 8:00-22:00</p>
            </MDBCol>
            <MDBCol md="3">
              <MDBBtn tag="a" floating color="dark" className="accent-1">
                <MDBIcon icon="envelope" />
              </MDBBtn>
              <p>{props.dados.usuario.email}</p>
              {console.log(props.dados)}
              <p className="mb-md-0">info@gmail.com</p>
            </MDBCol>
          </MDBRow>
        </MDBCol>
      </MDBRow>
    </section>
  );
}

export default ContactPage;
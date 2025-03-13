import React from 'react';

// Import post images
import post1 from '../../assets/images/posts/1.jpg';
import post2 from '../../assets/images/posts/2.jpg';
import post3 from '../../assets/images/posts/3.jpg';
import post4 from '../../assets/images/posts/4.jpg';

const Services = () => (
    <section className="padding-bottom">
        <header className="section-heading heading-line">
            <h4 className="title-section text-uppercase">Trade services</h4>
        </header>

        <div className="row">
            <div className="col-md-3 col-sm-6">
                <article className="card card-post">
                    <img src={post1} className="card-img-top" alt="Trade Assurance" />
                    <div className="card-body">
                        <h6 className="title">Trade Assurance</h6>
                        <p className="small text-uppercase text-muted">Order protection</p>
                    </div>
                </article>
            </div>
            <div className="col-md-3 col-sm-6">
                <article className="card card-post">
                    <img src={post2} className="card-img-top" alt="Pay anytime" />
                    <div className="card-body">
                        <h6 className="title">Pay anytime</h6>
                        <p className="small text-uppercase text-muted">Finance solution</p>
                    </div>
                </article>
            </div>
            <div className="col-md-3 col-sm-6">
                <article className="card card-post">
                    <img src={post3} className="card-img-top" alt="Inspection solution" />
                    <div className="card-body">
                        <h6 className="title">Inspection solution</h6>
                        <p className="small text-uppercase text-muted">Easy Inspection</p>
                    </div>
                </article>
            </div>
            <div className="col-md-3 col-sm-6">
                <article className="card card-post">
                    <img src={post4} className="card-img-top" alt="Ocean and Air Shipping" />
                    <div className="card-body">
                        <h6 className="title">Ocean and Air Shipping</h6>
                        <p className="small text-uppercase text-muted">Logistic services</p>
                    </div>
                </article>
            </div>
        </div>
    </section>
);

export default Services;

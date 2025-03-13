import React from 'react';

const Subscribe = () => (
    <section className="section-subscribe padding-y-lg">
        <div className="container">
            <p className="pb-2 text-center text-white">Delivering the latest product trends and industry news straight to your inbox</p>

            <div className="row justify-content-md-center">
                <div className="col-lg-5 col-md-6">
                    <form className="form-row">
                        <div className="col-md-8 col-7">
                            <input className="form-control border-0" placeholder="Your Email" type="email" />
                        </div>
                        <div className="col-md-4 col-5">
                            <button type="submit" className="btn btn-block btn-warning">
                                <i className="fa fa-envelope"></i> Subscribe
                            </button>
                        </div>
                    </form>
                    <small className="form-text text-white-50">We'll never share your email address with a third-party.</small>
                </div>
            </div>
        </div>
    </section>
);

export default Subscribe;

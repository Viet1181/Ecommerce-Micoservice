import React from 'react';

// Import flag images
import flagCN from '../../assets/images/icons/flags/CN.png';
import flagDE from '../../assets/images/icons/flags/DE.png';
import flagAU from '../../assets/images/icons/flags/AU.png';
import flagRU from '../../assets/images/icons/flags/RU.png';
import flagIN from '../../assets/images/icons/flags/IN.png';
import flagGB from '../../assets/images/icons/flags/GB.png';
import flagTR from '../../assets/images/icons/flags/TR.png';
import flagUZ from '../../assets/images/icons/flags/UZ.png';

const Region = () => (
    <section className="padding-bottom">
        <header className="section-heading heading-line">
            <h4 className="title-section text-uppercase">Choose region</h4>
        </header>

        <ul className="row mt-4">
            <li className="col-md col-6">
                <a href="#" className="icontext">
                    <img className="icon-flag-sm" src={flagCN} alt="China" />
                    <span>China</span>
                </a>
            </li>
            <li className="col-md col-6">
                <a href="#" className="icontext">
                    <img className="icon-flag-sm" src={flagDE} alt="Germany" />
                    <span>Germany</span>
                </a>
            </li>
            <li className="col-md col-6">
                <a href="#" className="icontext">
                    <img className="icon-flag-sm" src={flagAU} alt="Australia" />
                    <span>Australia</span>
                </a>
            </li>
            <li className="col-md col-6">
                <a href="#" className="icontext">
                    <img className="icon-flag-sm" src={flagRU} alt="Russia" />
                    <span>Russia</span>
                </a>
            </li>
            <li className="col-md col-6">
                <a href="#" className="icontext">
                    <img className="icon-flag-sm" src={flagIN} alt="India" />
                    <span>India</span>
                </a>
            </li>
            <li className="col-md col-6">
                <a href="#" className="icontext">
                    <img className="icon-flag-sm" src={flagGB} alt="England" />
                    <span>England</span>
                </a>
            </li>
            <li className="col-md col-6">
                <a href="#" className="icontext">
                    <img className="icon-flag-sm" src={flagTR} alt="Turkey" />
                    <span>Turkey</span>
                </a>
            </li>
            <li className="col-md col-6">
                <a href="#" className="icontext">
                    <img className="icon-flag-sm" src={flagUZ} alt="Uzbekistan" />
                    <span>Uzbekistan</span>
                </a>
            </li>
            <li className="col-md col-6">
                <a href="#" className="icontext">
                    <i className="mr-3 fa fa-ellipsis-h"></i>
                    <span>More regions</span>
                </a>
            </li>
        </ul>
    </section>
);

export default Region;

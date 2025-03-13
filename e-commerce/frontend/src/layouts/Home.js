import React from "react";
import Slider from "../pages/home/Slider";
import Deal from "../pages/home/Deal";
import Apparel from "../pages/home/Apparel";
import Electronics from "../pages/home/Electronics";
import Items from "../pages/home/Items";
import Request from "../pages/home/Request";
import Services from "../pages/home/Services";
import Region from "../pages/home/Region";
import Subscribe from "../pages/home/Subscribe";
import Section1 from "../pages/home/Section1";

function Home() {
    return (
        <div className="container">
            <Slider/>
            {/* <Section1 categoryId={1} categoryName="Winter special"/> */}
            <Section1 categoryName="Điện thoại"/>
            <Section1 categoryName="Laptop"/>
            <Section1 categoryName="Bàn phím"/>
            {/* <Deal/> */}
            {/* <Apparel/> */}
            {/* <Electronics/> */}
            <Items/>
            <Request/>
            <Services/>
            <Region/>
            <Subscribe/> 
        </div>
    );
}

export default Home;
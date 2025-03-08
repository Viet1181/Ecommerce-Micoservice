import { BlobProvider } from "@react-pdf/renderer";
import React, { useEffect, useState } from "react"
import {HiOutlinePrinter} from 'react-icons/hi';
import MyDocument from "./MyDocument";

const PDFButton = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const cartId = localStorage.getItem("cartId");
            const token = localStorage.getItem('jwt-token');

            if (!cartId) {
                setError(new Error('No cart ID found in localStorage'));
                setLoading(false);
                return;
            }

            if (!token) {
                setError(new Error('No token found in localStorage'));
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/api/public/user/${localStorage.getItem('username')}/carts/${cartId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Include token in the Authorization header 
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    const styles = {
        btn: {
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 10px',
            fontSize: '12px',
            color: '#ffd700',
            fontWeight: 700,
            cursor: 'pointer',
            userSelect: 'none',
            backgroundColor: '#ffd70000',
            textDecoration: 'none',
            transition: 'background-color 0.3s, color 0.3s',
        },
        hover: {
            backgroundColor: '#ffd70010'
        }
    }
    const handleMouseEnter = (e) => {
        e.currentTarget.style.backgroundColor = styles.hover.backgroundColor;
        e.currentTarget.style.color = styles.hover.color;
    };
    const handleMouseLeave = (e) => {
        e.currentTarget.style.backgroundColor = styles.btn.backgroundColor;
        e.currentTarget.style.color = styles.btn.color;
    };
    return (
        <BlobProvider document={<MyDocument data ={data} />}>
            {({ url, blob }) => (
                <a
                    href = {url}
                    target = "_blank"
                    style = {styles.btn}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave} >
                    <HiOutlinePrinter size={17} />
                    <span style={{ textDecoration: 'none' }}>PRINT</span>
                </a>
            )}
        </BlobProvider >
    )
}
export default PDFButton;
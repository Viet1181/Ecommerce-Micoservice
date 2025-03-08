import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNotify, useRedirect } from 'react-admin';
import axios from 'axios';
import './css/ProductImageUpdate.css'; 

const ProductImageUpdate = () => {
    const { id } = useParams<{ id: string }>();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const notify = useNotify();
    const redirect = useRedirect();
    const token = localStorage.getItem('jwt-token');
    console.log('Product ID:', id); // Ghi log ID sản phẩm
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {
        if (!file) {
            notify('Please select a file.');
            return;
        }
    
        if (!id || id === 'undefined') {
            notify('Invalid product ID.');
            return;
        }
    
        const formData = new FormData();
        formData.append('image', file);
    
        try {
            await axios.put(`http://localhost:8080/api/admin/products/${id}/image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            notify('Image updated successfully!', { type: 'success' });
            redirect('/products');
        } catch (error) {
            notify('Error updating image.', { type: 'error' });
            console.error(error);
            
        }
    };

    return (
        <div className="container">
            <h1>Cập nhật hình ảnh mới cho sản phẩm</h1>
            <div className="image-preview">
                {preview ? (
                    <img src={preview} alt="Image Preview" className="preview-img" />
                ) : (
                    <p>Chưa có hình ảnh</p>
                )}
            </div>
            <input type="file" accept='image/*' className="file-input" onChange={handleFileChange} />
            <button className="upload-button" onClick={handleUpload}>Cập nhật</button>
        </div>
    );
}
export default ProductImageUpdate;
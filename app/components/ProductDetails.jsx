'use client'
import React, {useEffect} from 'react';
import {useGlobalContext} from "@/app/GlobalContext";
import {useSearchParams} from "next/navigation";

const ProductDetails = () => {
    const {selectedProduct, products, setSelectedProduct} = useGlobalContext();
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');

    useEffect(() => {
        console.log('Selected product in ProductDetails', selectedProduct);
        console.log('Selected product id in ProductDetails', productId);
        if (!selectedProduct && productId) {
            const product = products.find((p) => p.id === parseInt(productId, 10));
            if (product) {
                setSelectedProduct(product);
            }
        }
    }, [productId, selectedProduct,products,setSelectedProduct]);

    if (!selectedProduct) {
        return <p>Loading product details...</p>; // Fallback UI
    }
    return (
        <>
        <h2>{selectedProduct.name}</h2>
        <p>Cena: ${selectedProduct.unitPrice}</p>
        <p>Kategoria: {selectedProduct.category}</p>
        <p>Ilość: {selectedProduct.amount}</p>
        <p>Data dodania: {selectedProduct.dateAdded}</p>
        </>
    )
}
export default ProductDetails;
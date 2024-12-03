'use client';
import {useEffect} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {useGlobalContext} from "@/app/GlobalContext";

const ProductDetails = () => {
    const router = useRouter();
    const {id} = useParams(); // Extract the product ID from the URL
    const {selectedProduct, setSelectedProduct, products} = useGlobalContext();

    useEffect(() => {
        // If no selectedProduct is set, fetch it from the product list
        if (!selectedProduct) {
            const product = products.find((prod) => prod.id === parseInt(id, 10));
            if (product) {
                setSelectedProduct(product);
            }
        }
    }, [id, selectedProduct, products, setSelectedProduct]);

    if (!selectedProduct) {
        return <p>Loading product details...</p>;
    }
    const handleReturn = ()=>{
        setSelectedProduct(null)
        router.push('/');
    }

    return (
        <div>
            <h2>{selectedProduct.name}</h2>
            <p>Category: {selectedProduct.category}</p>
            <p>Amount: {selectedProduct.amount}</p>
            <p>Price: ${selectedProduct.unitPrice}</p>
            <p>Supplier: {selectedProduct.supplier}</p>
            <button onClick={handleReturn}>
                Go back
            </button>
        </div>
    );
};

export default ProductDetails;

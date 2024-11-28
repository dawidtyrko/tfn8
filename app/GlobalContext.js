'use client';
import React, {createContext, useContext, useEffect, useState} from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState('all'); // Category filter
    const [amountFilter, setAmountFilter] = useState(''); // Minimum amount filter
    const [minPrice, setMinPrice] = useState(0); // Minimum price filter
    const [maxPrice, setMaxPrice] = useState(1000);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productToEdit, setProductToEdit] = useState(null);
    const categories = ['all',...new Set(products.map((product) => product.category))];

    useEffect(() => {
        const fetchProducts = async () => {
            try{
                setLoading(true);
                const response = await fetch(`/api/products`);
                const data = await response.json();
                setProducts(data);
            }catch(err){
                console.log(err);
                return err;
            }finally{
                setLoading(false);
            }
        }
        fetchProducts();
    },[])

    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };
    const handleEdition = (product) => {
        setProductToEdit(product);
    }

    const addProduct = async (product) => {
        try{
            const response = await fetch('/api/products', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            })
            if(response.status === 200){
                const newProduct = await response.json();
                setProducts((prevProducts) => [...prevProducts, newProduct]);
            }else{
                console.error('Something went wrong', await response.json());
            }
        }catch(err){
            console.error('Something went wrong', err);
        }
    }
    const editProduct = async (id,editedProduct) => {
        try{
            const response = await fetch(`/api/products?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editedProduct),
            });

            if (response.status === 200) {
                const updatedProductFromApi = await response.json();
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product.id === id ? updatedProductFromApi : product
                    )
                );
            } else {
                console.error('Error editing product:', await response.json());
            }
        }catch(err){
            console.error('Something went wrong', err);
        }
    }
    const deleteProduct = async (id) => {
        try {
            const response = await fetch(`/api/products?id=${id}`,
                { method: 'DELETE' });

            if (response.status === 200) {
                setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
            } else {
                console.error('Error deleting product:', await response.json());
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const filteredProducts = products.filter((product) => {
        const matchesName = product.name.toLowerCase().includes(filter.toLowerCase());
        const matchesCategory =
            categoryFilter === 'all' || product.category.toLowerCase() === categoryFilter.toLowerCase();
        const matchesAmount = amountFilter ? product.amount >= parseInt(amountFilter, 10) : true;
        const matchesPrice =
            product.unitPrice >= parseFloat(minPrice) && product.unitPrice <= parseFloat(maxPrice);

        return matchesName && matchesCategory && matchesAmount && matchesPrice;
    });
    return (
        <GlobalContext.Provider
            value={{
                products,
                filteredProducts,
                addProduct,
                editProduct,
                deleteProduct,
                setSelectedProduct,
                setFilter,
                setCategoryFilter,
                setAmountFilter,
                setMinPrice,
                setMaxPrice,
                categories,
                minPrice,
                maxPrice,
                handleProductClick,
                selectedProduct,
                handleEdition,
                productToEdit,
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}
export const useGlobalContext = () => {return useContext(GlobalContext)};
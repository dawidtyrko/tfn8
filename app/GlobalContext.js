'use client';
import React, {createContext, useContext, useEffect, useState} from "react";
import {useNotificationsContext} from "@/app/NotificationContext";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState('all'); // Category filter
    const [amountFilter, setAmountFilter] = useState(''); // Minimum amount filter
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productToEdit, setProductToEdit] = useState(null);
    const categories = ['all',...new Set(products.map((product) => product.category))];
    //const [notifications, setNotifications] = useState('');
    const [previousProducts, setPreviousProducts] = useState([]);
    const {addNotifications,notifications} = useNotificationsContext();

    useEffect(() => {
        const fetchProducts = async () => {
            try{
                setLoading(true);
                const response = await fetch(`/api/products`);
                const data = await response.json();
                setProducts(data);
                setPreviousProducts(data);
            }catch(err){
                console.log(err);
                return err;
            }finally{
                setLoading(false);
            }
        }
        fetchProducts();
    },[])


    useEffect(() => {
        if (previousProducts.length === 0) return; // Skip initial load

        const addedProduct = products.find(
            (product) => !previousProducts.some((prev) => prev.id === product.id)
        );
        const editedProduct = products.find((product) =>
            previousProducts.some(
                (prev) => prev.id === product.id && JSON.stringify(prev) !== JSON.stringify(product)
            )
        );

        if (addedProduct) {
            addNotifications(`Product "${addedProduct.name}" has been added.`);
            // alert(`Product "${addedProduct.name}" has been added.`);
        } else if (editedProduct) {
            addNotifications(`Product "${editedProduct.name}" has been edited.`);
            // alert(`Product "${editedProduct.name}" has been edited.`);
        }

        setPreviousProducts(products);
    }, [products, previousProducts]);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };
    const handleEdition = (product) => {
        setProductToEdit(product);
    }

    // const addProduct = async (product) => {
    //     try{
    //         const response = await fetch('/api/products', {
    //             method: 'POST',
    //             headers:{
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(product)
    //         })
    //         if(response.status === 200){
    //             const newProduct = await response.json();
    //             setProducts((prevProducts) => [...prevProducts, newProduct]);
    //             addNotifications(`Product "${newProduct.name}" added successfully!`);
    //         }else{
    //             console.error('Something went wrong', await response.json());
    //         }
    //     }catch(err){
    //         console.error('Something went wrong', err);
    //     }
    // }
    // const editProduct = async (id, editedProduct) => {
    //     console.log("Editing product with ID:", id, "and data:", editedProduct);
    //     try {
    //         const response = await fetch(`/api/products?id=${id}`, {
    //             method: 'PUT',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(editedProduct),
    //         });
    //
    //         if (response.status === 200) {
    //             const updatedProductFromApi = await response.json();
    //             setProducts((prevProducts) =>
    //                 prevProducts.map((product) =>
    //                     product.id === id ? updatedProductFromApi : product
    //                 )
    //             );
    //             addNotifications(`Product "${updatedProductFromApi.name}" updated successfully!`); // Notify
    //             console.log(notifications)
    //             console.log("Product updated successfully");
    //         } else {
    //             console.error('Error editing product:', await response.json());
    //         }
    //     } catch (err) {
    //         console.error('Something went wrong while editing the product:', err);
    //     }
    // };
    const addProduct = async (product) => {
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product),
            });
            if (!response.ok) {
                console.error('Error adding product:', await response.text());
                return;
            }
            const newProduct = await response.json();
            setProducts((prev) => [...prev, newProduct]);
            addNotifications(`Product "${newProduct.name}" added successfully!`);
        } catch (err) {
            console.error('Error adding product:', err);
        }
    };

    const editProduct = async (id, editedProduct) => {
        try {
            const response = await fetch(`/api/products?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editedProduct),
            });
            if (!response.ok) {
                console.error('Error editing product:', await response.text());
                return;
            }
            const updatedProduct = await response.json();
            setProducts((prev) =>
                prev.map((product) => (product.id === id ? updatedProduct : product))
            );
            addNotifications(`Product "${updatedProduct.name}" updated successfully!`);
        } catch (err) {
            console.error('Error editing product:', err);
        }
    };

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

    return (
        <GlobalContext.Provider
            value={{
                filter,
                amountFilter,
                categoryFilter,
                products,
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
                notifications,
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}
export const useGlobalContext = () => {return useContext(GlobalContext)};
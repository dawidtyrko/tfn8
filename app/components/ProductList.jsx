'use client';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useGlobalContext} from "@/app/GlobalContext";
import ProductItem from "@/app/components/ProductItem";
import Link from "next/link";
import {useNotificationsContext} from "@/app/NotificationContext";

const ProductList = () => {
    const {
        products,
        setFilter,
        setCategoryFilter,
        setAmountFilter,
        setMinPrice,
        setMaxPrice,
        categories,
        minPrice,
        maxPrice,
        categoryFilter,
        amountFilter,
        filter,
        setSelectedProduct,
    } = useGlobalContext();
    const {addNotifications,notifications,removeNotification} = useNotificationsContext();
    const [prevProductCount, setPrevProductCount] = useState(products.length);
    const productRef = useRef({});
    const isNewProductAdded = products.length > prevProductCount;
    const [currentNotification, setCurrentNotifications] = useState('');

    useEffect(() => {
        setPrevProductCount(products.length);
    }, [products.length]);



    useLayoutEffect(() => {
        if (isNewProductAdded && products.length > 0) {
            const lastProduct = products[products.length - 1];
            const lastProductRef = productRef.current[lastProduct.id];

            if (lastProductRef) {
                lastProductRef.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }
        }
    }, [isNewProductAdded, products]);
    useLayoutEffect(() => {
        setCurrentNotifications(notifications);
    }, [notifications]);
    const handleAddProductClick = () => {
        setSelectedProduct(null);
    };
    const handleCLearNotifications = ()=>{

    }
    const filteredProducts = products.filter((product) => {
        const filterString = filter || ''; // Ensure filter is a valid string (defaults to an empty string)

        // Name filter logic
        const matchesName = product.name && product.name.toLowerCase().includes(filterString.toLowerCase());

        // Category filter logic
        const matchesCategory = categoryFilter === 'all' || (product.category && product.category.toLowerCase() === categoryFilter.toLowerCase());

        // Amount filter logic
        const matchesAmount = amountFilter ? product.amount >= parseInt(amountFilter) : true;

        // Price range filter logic
        const matchesPrice = product.unitPrice >= minPrice && product.unitPrice <= maxPrice;

        return matchesName && matchesCategory && matchesAmount && matchesPrice;
    });

    return (
        <div style={{textAlign: "center"}}>
            {currentNotification && (
                <div style={{
                    backgroundColor: '#4caf50',
                    color: 'white',
                    padding: '10px',
                    margin: '10px 0',
                    borderRadius: '5px'
                }}>
                    {currentNotification}
                </div>
            )}
            <Link href='/product' onClick={handleAddProductClick}>Add product</Link>
            <div>
                <div style={{padding: '5px'}}>
                    <input
                        style={{color: 'black', backgroundColor: '#ffffff'}}
                        type="text"
                        placeholder="Filter by name..."
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>

                <div style={{padding: '5px'}}>
                    <select style={{width: '200px', color: 'black'}}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        {categories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{padding: '5px'}}>
                    <input
                        style={{color: 'black'}}
                        min="0"
                        type="number"
                        placeholder="Filter by amount (min)..."
                        onChange={(e) => setAmountFilter(e.target.value)}
                    />
                </div>

                <div>
                    <label>Price Range: ${minPrice} - ${maxPrice}</label>
                    <br />
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        onChange={(e) => setMinPrice(parseInt(e.target.value))}
                    />
                    <input
                        type="range"
                        min="0"
                        max="3000"
                        onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    />
                </div>
            </div>
            {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                    <div key={product.id} ref={(el) => (productRef.current[product.id] = el)}>
                        <ProductItem product={product} />
                    </div>
                ))
            ) : (
                <p>No products found</p>
            )}
        </div>
    );
};

export default ProductList;

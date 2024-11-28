'use client'
import React from 'react';
import {useGlobalContext} from "@/app/GlobalContext";
import ProductItem from "@/app/components/ProductItem";
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
    } = useGlobalContext();
    console.log(products);
    console.log(categoryFilter)
    const filteredProducts = products.filter((product) => {
        const filterString = filter || '';  // Ensure filter is a valid string (defaults to an empty string)

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
        <div>
            <div style={{textAlign: "center"}}>
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
                    <br/>
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        onChange={(e) => setMinPrice(parseInt(e.target.value))}
                    />
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    />
                </div>

            </div>
            {
                filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                        <ProductItem key={index} product={product}/>
                    ))
                ) : (
                    <p>No products found</p>
                )
            }

        </div>
    )
}
export default ProductList;
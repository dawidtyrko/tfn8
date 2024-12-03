'use client'
import ProductDetails from "@/app/components/ProductDetails";
import {useGlobalContext} from "@/app/GlobalContext";
import ProductForm from "@/app/components/ProductForm";

export default function ProductPage() {
    const {selectedProduct} = useGlobalContext();


        if(selectedProduct == null) {
            return <ProductForm/>
        }
        return <ProductDetails/>

}
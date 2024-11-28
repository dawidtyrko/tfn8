'use client'
import {useGlobalContext} from "@/app/GlobalContext";
import {useRouter} from "next/router";

const ProductItem = ({product}) => {
    //const router = useRouter();
    const {deleteProduct,handleProductClick, handleEdition,setSelectedProduct} = useGlobalContext()

    const handleRedirect = () => {
        //handleProductClick(product);
        // router.push('/product');
        console.log(product)
        setSelectedProduct(product)
        window.location.href="/product/?id=" + product.id
    }
    const handleEdit = ()=>{
        handleEdition(product);
        window.location.href="/product/form?id=" + product.id
        //router.push('/product/form')
    }
    return (
        <div>
            <h2>{product.name}</h2>
            <p>Cena: ${product.unitPrice}</p>
            <button onClick={() => deleteProduct(product.id)}>Delete</button>
            <button onClick={handleRedirect}>See details</button>
            <button onClick={handleEdit}>Edit product</button>
        </div>
    )
}
export default ProductItem
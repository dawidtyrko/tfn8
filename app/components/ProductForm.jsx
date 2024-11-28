'use client'
import React, {useEffect} from 'react';
import {useGlobalContext} from "@/app/GlobalContext";
import {Formik,Form,Field, ErrorMessage} from "formik"
import * as Yup from 'yup'
import {useSearchParams} from "next/navigation";

const productSchema = Yup.object().shape({
    name: Yup.string().min(3,"Minimum 3 characters").required(),
    category: Yup.string().required(),
    amount: Yup.number().positive().required(),
    unitPrice: Yup.number().positive().required(),
    supplier: Yup.string().min(3,"Minimum 3 characters").required()
})


const ProductForm = () => {
    const {editProduct, categories,products,handleEdition,productToEdit} = useGlobalContext()


    const searchParams = useSearchParams();
    const productId = searchParams.get("id")
    useEffect(()=>{
        const productToEdit = products.find((product) => product.id === parseInt(productId));
        if(productToEdit){
            handleEdition(productToEdit);
        }else{
            console.log("product not found")
        }
    },[productId,products,handleEdition])

    const handleSubmit = (values) => {
        if(productToEdit){
            const updatedProduct = {id:editProduct.id,...values};
            editProduct(editProduct.id,updatedProduct);
            window.location.href = '/'
        }

    }
    console.log(productToEdit)
    let initialValues = productToEdit || {
        name: "",
        category: "",
        amount: 0,
        unitPrice: 0,
        supplier: "",
    }
    console.log(initialValues)
    return (
        <Formik
        initialValues={initialValues}
        validationSchema={productSchema}
        enableReinitialize={true}
        onSubmit={handleSubmit}
        >
            {()=>(
                <Form>
                    <div>
                        <label htmlFor="name">Name:</label>
                        <Field name="name" type="text"/>
                        <ErrorMessage name="name" component="div"/>
                    </div>
                    <div>
                        <label htmlFor="category">Category:</label>
                        <Field name="category" as="select">
                            <option value="">Select a category</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </Field>
                        <ErrorMessage name="category" component="div"/>
                    </div>
                    <div>
                        <label htmlFor="amount">Amount:</label>
                        <Field name="amount" type="number"/>
                        <ErrorMessage name="amount" component="div" style={{color: "red"}}/>
                    </div>
                    <div>
                        <label htmlFor="unitPrice">Unit Price:</label>
                        <Field name="unitPrice" type="number" step="0.01"/>
                        <ErrorMessage name="unitPrice" component="div" style={{color: "red"}}/>
                    </div>
                    <div>
                        <label htmlFor="supplier">Supplier:</label>
                        <Field name="supplier" type="text"/>
                        <ErrorMessage name="supplier" component="div" style={{color: "red"}}/>
                    </div>
                    <button type="submit" style={{marginTop: "10px", width: "100px"}}>
                        Submit
                    </button>

                </Form>
            )}
        </Formik>
    )

}
export default ProductForm
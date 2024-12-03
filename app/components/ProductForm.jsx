'use client';
import React, {useEffect, useState} from 'react';
import {useGlobalContext} from "@/app/GlobalContext";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from 'yup';
import {useRouter, useSearchParams} from "next/navigation";
import {router} from 'next/navigation'
import {useNotificationsContext} from "@/app/NotificationContext";
const productSchema = Yup.object().shape({
    name: Yup.string().min(3, "Minimum 3 characters").required("Name is required"),
    category: Yup.string().required("Category is required"),
    amount: Yup.number().positive("Amount must be positive").required("Amount is required"),
    unitPrice: Yup.number().positive("Price must be positive").required("Unit price is required"),
    supplier: Yup.string().min(3, "Minimum 3 characters").required("Supplier is required"),
});

const ProductForm = () => {
    const router = useRouter();
    const {
        editProduct,
        addProduct, // Add this if you have a function for adding products
        categories,
        products,
        handleEdition,
        productToEdit,
    } = useGlobalContext();
    const {addNotifications} = useNotificationsContext()
    const [isEditMode, setIsEditMode] = useState(false); // Track if we're in "edit" mode
    const searchParams = useSearchParams();
    const productId = searchParams.get("id");

    useEffect(() => {
        if (productId) {
            const productToEdit = products.find((product) => product.id === parseInt(productId));
            handleEdition(productToEdit || null);
            setIsEditMode(!!productToEdit);
        } else {
            handleEdition(null);
            setIsEditMode(false);
        }
    }, [productId, products]);

    const handleSubmit = async (values) => {
        try {
            if (isEditMode && productToEdit) {
                await editProduct(productToEdit.id, { ...values });
            } else {
                await addProduct(values);
            }
            addNotifications(isEditMode ? "Product updated successfully!" : "Product added successfully!");
            router.push('/');
        } catch (error) {
            console.error("Error in form submission:", error);
        }
    };

    const initialValues = productToEdit || {
        name: "",
        category: "",
        amount: 0,
        unitPrice: 0,
        supplier: "",
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={productSchema}
            enableReinitialize={true}
            onSubmit={handleSubmit}
        >
            {() => (
                <Form>
                    <div>
                        <label htmlFor="name">Name:</label>
                        <Field name="name" type="text"/>
                        <ErrorMessage name="name" component="div" style={{color: "red"}}/>
                    </div>
                    <div>
                        <label htmlFor="category">Category:</label>
                        <Field name="category" as="select">
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </Field>
                        <ErrorMessage name="category" component="div" style={{color: "red"}}/>
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
                        {isEditMode ? "Update" : "Add"} Product
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default ProductForm;

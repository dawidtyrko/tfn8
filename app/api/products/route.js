import productsData from '../../../public/data/products.json';
import {NextResponse} from "next/server";
import fs from 'fs';
import path from 'path';
const filePath = path.join(process.cwd(),  'public', 'data','products.json');
// let products = [...productsData]

const saveProducts = (products) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error saving products:', error);
    }
};
const loadProducts = () => {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
};
export async function GET(req){
    const {searchParams} = new URL(req.url);
    const id = searchParams.get("id");
    const products = loadProducts();
    if(id){
            const product = products.find((product) => product.id === parseInt(id,10));
            if(product){
                return NextResponse.json(product,{status:200}, );
            }else{
                return NextResponse.json({status:404,message:'Not found'});
            }
    }
    return NextResponse.json(products,{status:200});
}

export async function POST(req){
    console.log('Resolved file path:', filePath);
    const products = loadProducts();
    console.log(products);

    let newProduct = await req.json();
    if (!newProduct.name || !newProduct.unitPrice || !newProduct.category || !newProduct.amount) {
        return NextResponse.json({ message: 'Missing required product fields' }, { status: 400 });
    }
    const id = products.length ? products[products.length - 1].id + 1 : 1;

    newProduct = { id, ...newProduct};

   products.push(newProduct);
   saveProducts(products);

    return NextResponse.json(newProduct);
}

export async function PUT(req) {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id"));
    const products = loadProducts();
    const updatedProduct = await req.json();

    // Find the product index
    const productIndex = products.findIndex((product) => product.id === id);

    // If product not found, return 404
    if (productIndex === -1) {
        return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Update the product and save changes
    products[productIndex] = { ...products[productIndex], ...updatedProduct };
    saveProducts(products);

    // Return the updated product
    return NextResponse.json(products[productIndex], { status: 200 });
}
export async function DELETE(req){
    const {searchParams} = new URL(req.url);
    const id = parseInt(searchParams.get("id"));
    const products = loadProducts();
    const newProducts = products.filter((product) => product.id !== id);
    if(newProducts.length === products.length){
        return NextResponse.json({message: 'No product found with id ' + id},{status:404});
    }
    saveProducts(newProducts);
    return NextResponse.json({message: 'Product deleted successfully'});
}
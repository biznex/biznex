"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from '../../components/dashboardlayout';
import axios from 'axios'; // Make sure axios is installed (npm install axios)

const EcomProducts = () => {
    // State for storing products, loading status, and errors
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    // Fetch data from the backend when the component mounts
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get("https://biznex.onrender.com/inventory/ecomproducts", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                // Map the API response to the component's data structure
                const mappedData = response.data.map(product => ({
                    id: product.id, 
                    productId: product.barcode,
                    name: product.name,
                    imageUrl: product.imageurl,
                    category: product.category,
                    stock: product.quantity,
                    price: product.price
                }));

                setProducts(mappedData);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError("Could not load product data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []); // Empty dependency array ensures this runs only once on mount

    // --- Pagination Logic ---
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // --- UI Rendering ---
    if (isLoading) {
        return <DashboardLayout><div className="p-6 text-center">Loading products...</div></DashboardLayout>;
    }

    if (error) {
        return <DashboardLayout><div className="p-6 text-center text-red-500">{error}</div></DashboardLayout>;
    }

    return (
        <DashboardLayout>
            <div className="p-4 text-[#2F2F2F]">
                <h1 className="text-xl font-semibold mb-4">Ecommerce Products</h1>
                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white border border-black rounded-xl shadow-md overflow-x-auto">
                        <h2 className="text-lg font-semibold p-4 border-b border-black">Product List</h2>
                        <table className="min-w-full bg-white text-left">
                            <thead className="bg-white">
                                <tr>
                                    {/* 1. ADDED: Header for Serial Number */}
                                    <th className="py-2 px-4 border-r border-b border-black">Sl. No.</th>
                                    <th className="py-2 px-4 border-r border-b border-black">Image</th>
                                    <th className="py-2 px-4 border-r border-b border-black">Product Name</th>
                                    <th className="py-2 px-4 border-r border-b border-black">SKU</th>
                                    <th className="py-2 px-4 border-r border-b border-black">Category</th>
                                    <th className="py-2 px-4 border-r border-b border-black">Price</th>
                                    <th className="py-2 px-4 border-b border-black">Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentProducts.map((product, index) => (
                                    <tr key={product.id} className="bg-white">
                                        {/* 2. ADDED: Cell for Serial Number */}
                                        <td className="py-2 px-4 border-r border-b border-black">{indexOfFirstProduct + index + 1}</td>
                                        <td className="py-2 px-4 border-r border-b border-black">
                                            <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                                        </td>
                                        <td className="py-2 px-4 border-r border-b border-black font-medium">{product.name}</td>
                                        <td className="py-2 px-4 border-r border-b border-black font-mono text-sm">{product.productId}</td>
                                        <td className="py-2 px-4 border-r border-b border-black">{product.category}</td>
                                        <td className="py-2 px-4 border-r border-b border-black">
                                            {product.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                        </td>
                                        <td className="py-2 px-4 border-b border-black font-semibold">
                                            {product.stock === 0 ? (
                                                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                                    Out of Stock
                                                </span>
                                            ) : product.stock < 20 ? (
                                                <span className="text-orange-600">{product.stock} (Low)</span>
                                            ) : (
                                                <span className="text-green-700">{product.stock}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="bg-white border border-black rounded-xl shadow-md p-4 flex justify-center items-center">
                            <h2 className="text-lg font-semibold mr-4">Pages:</h2>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={`mx-1 px-3 py-1 rounded ${
                                        currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {number}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EcomProducts;
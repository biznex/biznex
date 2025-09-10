"use client";

import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from '../../components/dashboardlayout';
import JsBarcode from 'jsbarcode';
import jsPDF from 'jspdf';
import { Canvg } from 'canvg';
import axios from "axios";
import { useRouter } from "next/navigation";

const PrintBarcodePage = () => {
    const router = useRouter();
    const [allProducts, setAllProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const barcodeRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [printQuantity, setPrintQuantity] = useState(4);

    useEffect(() => {
        const fetchProductsData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get("https://biznex.onrender.com/inventory/products", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true,
                });

                console.log("API Response:", response.data);

                if (response.status >= 200 && response.status < 300) {
                    const mappedProducts = response.data.products.map((item) => ({
                        id: item.id,
                        productName: item.name,
                        sku: item.barcode,
                    }));

                    setAllProducts(mappedProducts);
                    setFilteredProducts(mappedProducts);
                }
                console.log("Products:", allProducts);
            } catch (error) {
                console.error("Error fetching data:", error);
                if (error.response && error.response.status === 401) {
                    alert("Unauthorized access, Failed to load dashboard data.. Please log in again.");
                    router.push("/login");
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchProductsData();
    }, [router]);

    useEffect(() => {
        if (selectedProduct && barcodeRef.current) {
            JsBarcode(barcodeRef.current, selectedProduct.sku, { height: 50, displayValue: true });
        }
    }, [selectedProduct]);

    useEffect(() => {
        const results = allProducts.filter((product) =>
            product.productName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(results);
    }, [searchTerm, allProducts]);

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setSearchTerm(product.productName);
        setShowDropdown(false);
    };

    const downloadBarcodePDF = async () => {
        if (selectedProduct) {
            const pdf = new jsPDF();
            const pageWidth = pdf.internal.pageSize.getWidth();
            const barcodeWidth = (pageWidth - 40) / 4;
            const barcodeHeight = 20;

            let x = 10;
            let y = 10;
            let barcodeCounter = 0;

            for (let i = 0; i < printQuantity; i++) {
                const tempSvg = document.createElement('svg');
                JsBarcode(tempSvg, selectedProduct.sku, { height: 30, displayValue: true });

                const canvas = document.createElement('canvas');
                canvas.width = barcodeWidth * 2;
                canvas.height = barcodeHeight;

                const ctx = canvas.getContext('2d');

                const v = await Canvg.fromString(ctx, tempSvg.outerHTML);
                await v.render();

                const imgData = canvas.toDataURL('image/png');
                pdf.addImage(imgData, 'PNG', x, y, barcodeWidth, barcodeHeight);

                x += barcodeWidth + 10;
                barcodeCounter++;

                if (barcodeCounter % 4 === 0) {
                    x = 10;
                    y += barcodeHeight + 10;
                }

                if (y > pdf.internal.pageSize.getHeight() - barcodeHeight - 10) {
                    pdf.addPage();
                    x = 10;
                    y = 10;
                    barcodeCounter = 0;
                }
            }
            pdf.save(`barcodes-${selectedProduct.sku}.pdf`);
        }
    };

    return (
        <DashboardLayout>
            <div className="p-4 text-[#2F2F2F] flex h-full">
                <div className="w-3/4 p-4 border border-[#2F2F2F] rounded-xl mr-4 flex flex-col">
                    <h2 className="text-lg font-semibold mb-4">Print Barcode Preview</h2>
                    {selectedProduct && (
                        <div className="flex-grow flex items-center justify-center">
                            <svg ref={barcodeRef} />
                        </div>
                    )}
                </div>
                <div className="w-1/4 p-4 border border-[#2F2F2F] rounded-xl">
                    <h2 className="text-lg font-semibold mb-4">Select Product</h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Select Product..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setShowDropdown(true);
                            }}
                            className="w-full p-2 border border-gray-300 rounded mb-2"
                            onClick={() => setShowDropdown(!showDropdown)}
                        />
                        {showDropdown && (
                            <ul className="absolute w-full bg-white border border-gray-300 rounded overflow-y-auto max-h-40 z-10">
                                {filteredProducts.map((product) => (
                                    <li
                                        key={product.id}
                                        onClick={() => handleProductSelect(product)}
                                        className={`p-2 border-b border-gray-200 cursor-pointer ${selectedProduct?.id === product.id ? 'bg-gray-100' : ''}`}
                                    >
                                        {product.productName}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="mt-4">
                        <label className="block mb-2">Print Quantity (multiples of 4):</label>
                        <select
                            value={printQuantity}
                            onChange={(e) => setPrintQuantity(parseInt(e.target.value, 10))}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            {[4, 8, 12, 16, 20, 24, 28, 32, 36].map((qty) => (
                                <option key={qty} value={qty}>
                                    {qty}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedProduct && (
                        <div className="mt-4">
                            <button onClick={downloadBarcodePDF} className="bg-green-500 text-white px-4 py-2 rounded">Download PDF</button>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PrintBarcodePage;
"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from '../../components/dashboardlayout';
import JsBarcode from 'jsbarcode';

const ProductsPage = () => {
    const allProducts = [
        { id: 1, productName: 'Laptop', status: 'Active', sales: 'Online', stock: 50, category: 'Electronics', sku: 'LAP-001', unitPrice: 1200, images: [] },
        { id: 2, productName: 'T-shirt', status: 'Inactive', sales: 'Offline', stock: 0, category: 'Clothing', sku: 'TSH-002', unitPrice: 25, images: [] },
        { id: 3, productName: 'Book', status: 'Active', sales: 'Hybrid', stock: 10, category: 'Books', sku: 'BOK-003', unitPrice: 15, images: [] },
        { id: 4, productName: 'Headphones', status: 'Active', sales: 'Online', stock: 100, category: 'Electronics', sku: 'HDP-004', unitPrice: 80, images: [] },
        { id: 5, productName: 'Jeans', status: 'Active', sales: 'Offline', stock: 75, category: 'Clothing', sku: 'JNS-005', unitPrice: 50, images: [] },
        { id: 6, productName: 'Novel', status: 'Active', sales: 'Hybrid', stock: 200, category: 'Books', sku: 'NVL-006', unitPrice: 20, images: [] },
        { id: 7, productName: 'Mouse', status: 'Active', sales: 'Online', stock: 60, category: 'Electronics', sku: 'MOU-007', unitPrice: 30, images: [] },
        { id: 8, productName: 'Dress', status: 'Inactive', sales: 'Offline', stock: 20, category: 'Clothing', sku: 'DRS-008', unitPrice: 70, images: [] },
        { id: 9, productName: 'Textbook', status: 'Active', sales: 'Hybrid', stock: 150, category: 'Books', sku: 'TBK-009', unitPrice: 35, images: [] },
        { id: 10, productName: 'Keyboard', status: 'Active', sales: 'Online', stock: 80, category: 'Electronics', sku: 'KEY-010', unitPrice: 60, images: [] },
        { id: 11, productName: 'Socks', status: 'Active', sales: 'Offline', stock: 120, category: 'Clothing', sku: 'SCK-011', unitPrice: 10, images: [] },
        { id: 12, productName: 'Cookbook', status: 'Active', sales: 'Hybrid', stock: 90, category: 'Books', sku: 'CBK-012', unitPrice: 25, images: [] },
        { id: 13, productName: 'Monitor', status: 'Active', sales: 'Online', stock: 40, category: 'Electronics', sku: 'MON-013', unitPrice: 250, images: [] },
        { id: 14, productName: 'Jacket', status: 'Active', sales: 'Offline', stock: 55, category: 'Clothing', sku: 'JCK-014', unitPrice: 90, images: [] },
        { id: 15, productName: 'Dictionary', status: 'Active', sales: 'Hybrid', stock: 110, category: 'Books', sku: 'DCT-015', unitPrice: 30, images: [] },
        { id: 16, productName: 'USB Drive', status: 'Active', sales: 'Online', stock: 100, category: 'Electronics', sku: 'USB-016', unitPrice: 15, images: [] },
        { id: 17, productName: 'Skirt', status: 'Active', sales: 'Offline', stock: 65, category: 'Clothing', sku: 'SKT-017', unitPrice: 45, images: [] },
        { id: 18, productName: 'Encyclopedia', status: 'Active', sales: 'Hybrid', stock: 80, category: 'Books', sku: 'ENC-018', unitPrice: 50, images: [] },
        { id: 19, productName: 'Printer', status: 'Active', sales: 'Online', stock: 30, category: 'Electronics', sku: 'PRT-019', unitPrice: 180, images: [] },
        { id: 20, productName: 'Sweater', status: 'Active', sales: 'Offline', stock: 70, category: 'Clothing', sku: 'SWT-020', unitPrice: 60, images: [] },
        { id: 21, productName: 'Atlas', status: 'Active', sales: 'Hybrid', stock: 120, category: 'Books', sku: 'ATL-021', unitPrice: 40, images: [] },
        { id: 22, productName: 'Tablet', status: 'Active', sales: 'Online', stock: 45, category: 'Electronics', sku: 'TAB-022', unitPrice: 300, images: [] },
        { id: 23, productName: 'Shorts', status: 'Active', sales: 'Offline', stock: 80, category: 'Clothing', sku: 'SHR-023', unitPrice: 35, images: [] },
        { id: 24, productName: 'Biography', status: 'Active', sales: 'Hybrid', stock: 95, category: 'Books', sku: 'BIO-024', unitPrice: 28, images: [] },
        { id: 25, productName: 'Router', status: 'Active', sales: 'Online', stock: 25, category: 'Electronics', sku: 'RTR-025', unitPrice: 120, images: [] },
        { id: 26, productName: 'Blouse', status: 'Active', sales: 'Offline', stock: 60, category: 'Clothing', sku: 'BLS-026', unitPrice: 55, images: [] },
        { id: 27, productName: 'Comic Book', status: 'Active', sales: 'Hybrid', stock: 100, category: 'Books', sku: 'CMB-027', unitPrice: 18, images: [] },
        { id: 28, productName: 'Camera', status: 'Active', sales: 'Online', stock: 35, category: 'Electronics', sku: 'CAM-028', unitPrice: 400, images: [] },
        { id: 29, productName: 'Pants', status: 'Active', sales: 'Offline', stock: 70, category: 'Clothing', sku: 'PNT-029', unitPrice: 65, images: [] },
        { id: 30, productName: 'Science Book', status: 'Active', sales: 'Hybrid', stock: 110, category: 'Books', sku: 'SCB-030', unitPrice: 32, images: [] },
    ];

    const [products, setProducts] = useState(allProducts);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 20;
    const [filters, setFilters] = useState({
        status: [],
        sales: [],
        lowStock: false,
    });
    const [editingProductId, setEditingProductId] = useState(null);
    const [editedProductData, setEditedProductData] = useState({});

    const filteredProducts = products.filter((product) => {
        let statusMatch = filters.status.length === 0 || filters.status.includes(product.status);
        let salesMatch = filters.sales.length === 0 || filters.sales.includes(product.sales);
        let lowStockMatch = !filters.lowStock || product.stock < 50;

        return statusMatch && salesMatch && lowStockMatch;
    });

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const [productFormData, setProductFormData] = useState({
        productName: '',
        status: 'Active',
        sales: 'Online',
        stock: '',
        category: 'Category',
        sku: '',
        unitPrice: '',
        images: [],
    });

    const handleProductChange = (e) => {
        let value = e.target.value;
        let name = e.target.name;

        if (name === 'stock') {
            value = Math.max(0, parseInt(value, 10) || 0);
        } else if (name === 'unitPrice') {
            if (parseFloat(value) < 0) {
                alert("Negative values not possible");
                value = '0';
            }
        }

        setProductFormData({ ...productFormData, [name]: value });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const imagePromises = files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target.result);
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(imagePromises).then(images => {
            setProductFormData({ ...productFormData, images: [...productFormData.images, ...images] });
        });
    };

    const handleAddProduct = () => {
      const newProduct = { id: Date.now(), ...productFormData };
      setProducts([...products, newProduct]);
  
      setProductFormData({
          productName: '',
          status: 'Active',
          sales: 'Online',
          stock: '', // Remove the default '0'
          category: 'Category',
          sku: '',
          unitPrice: '',
          images: [],
      });
  
      if (document.querySelector('input[name="productName"]')) {
          document.querySelector('input[name="productName"]').placeholder = "Product Name";
      }
      if (document.querySelector('input[name="stock"]')) {
          document.querySelector('input[name="stock"]').placeholder = "Stock"; // Change placeholder to "Stock"
      }
      if (document.querySelector('input[name="sku"]')) {
          document.querySelector('input[name="sku"]').placeholder = "SKU";
      }
      if (document.querySelector('input[name="unitPrice"]')) {
          document.querySelector('input[name="unitPrice"]').placeholder = "0";
      }
  };

    const handleDeleteProduct = (id) => {
        const updatedProducts = products.filter((product) => product.id !== id);
        setProducts(updatedProducts);
        if (editingProductId === id) {
            setEditingProductId(null);
        }
    };

    const handleEditProduct = (product) => {
        setEditingProductId(product.id);
        setEditedProductData({ ...product });
    };

    const handleSaveProduct = (id) => {
        const updatedProducts = products.map((product) =>
            product.id === id ? { ...product, ...editedProductData } : product
        );
        setProducts(updatedProducts);
        setEditingProductId(null);
    };

    const handleEditedProductChange = (e, id) => {
        let value = e.target.value;
        let name = e.target.name;

        if (name === 'stock') {
            value = Math.max(0, parseInt(value, 10) || 0);
        } else if (name === 'unitPrice') {
            if (parseFloat(value) < 0) {
                alert("Negative values not possible");
                value = '0';
            }
        }

        setEditedProductData({ ...editedProductData, [name]: value });
    };

    const capitalizeSales = (sales) => {
        return sales;
    };

    const handleFilterChange = (type, value) => {
        setFilters((prevFilters) => {
            if (type === 'lowStock') {
                return { ...prevFilters, lowStock: !prevFilters.lowStock };
            }

            let currentFilters = prevFilters[type] || [];
            if (currentFilters.includes(value)) {
                currentFilters = currentFilters.filter((item) => item !== value);
            } else {
                currentFilters = [...currentFilters, value];
            }
            return { ...prevFilters, [type]: currentFilters };
        });
    };

    const clearFilters = () => {
        setFilters({ status: [], sales: [], lowStock: false });
    };

    const totalProductsCount = products.length;
    const activeProductsCount = products.filter((p) => p.status === 'Active').length;
    const inactiveProductsCount = products.filter((p) => p.status === 'Inactive').length;
    const totalQuantity = products.reduce((acc, p) => acc + p.stock, 0);
    const lowStockProductsCount = products.filter((p) => p.stock < 50).length;

    return (
        <DashboardLayout>
            <div className="p-4 text-[#2F2F2F]">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    <div className="bg-white border border-[#2F2F2F] rounded-xl p-4">
                        <h2 className="text-lg font-semibold mb-2">Total Products</h2>
                        <p>{totalProductsCount}</p>
                    </div>
                    <div className="bg-white border border-[#2F2F2F] rounded-xl p-4">
                        <h2 className="text-lg font-semibold mb-2">Active Products</h2>
                        <p>{activeProductsCount}</p>
                    </div>
                    <div className="bg-white border border-[#2F2F2F] rounded-xl p-4">
                        <h2 className="text-lg font-semibold mb-2">Inactive Products</h2>
                        <p>{inactiveProductsCount}</p>
                    </div>
                    <div className="bg-white border border-[#2F2F2F] rounded-xl p-4">
                        <h2 className="text-lg font-semibold mb-2">Total Quantity</h2>
                        <p>{totalQuantity}</p>
                    </div>
                    <div className="bg-white border border-[#2F2F2F] rounded-xl p-4">
                        <h2 className="text-lg font-semibold mb-2">Low Stock Products</h2>
                        <p>{lowStockProductsCount}</p>
                    </div>
                </div>
                <h1 className="text-lg font-semibold mb-4">Products</h1>
                <div className="flex flex-col w-full">
                    <div className="w-full mb-4 p-4 border border-[#2F2F2F] rounded-xl flex flex-col">
                        <h2 className="text-lg font-semibold mb-4">Add Product</h2>
                        <div className="flex flex-col gap-2">
                            <input type="text" name="productName" value={productFormData.productName} onChange={handleProductChange} placeholder="Product Name" className="p-2 border rounded text-[#2F2F2F]" />
                            <select name="status" value={productFormData.status} onChange={handleProductChange} className="p-2 border rounded text-[#2F2F2F]">
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                            <select name="sales" value={productFormData.sales} onChange={handleProductChange} className="p-2 border rounded text-[#2F2F2F]">
                                <option>Online</option>
                                <option>Offline</option>
                                <option>Hybrid</option>
                            </select>
                            <input type="number" name="stock" value={productFormData.stock} onChange={handleProductChange} placeholder="0" className="p-2 border rounded text-[#2F2F2F]" />
                            <select name="category" value={productFormData.category} onChange={handleProductChange} className="p-2 border rounded text-[#2F2F2F]">
                                <option>Category</option>
                                <option>Electronics</option>
                                <option>Clothing</option>
                                <option>Books</option>
                            </select>
                            <input type="text" name="sku" value={productFormData.sku} onChange={handleProductChange} placeholder="SKU" className="p-2 border rounded text-[#2F2F2F]" />
                            <input type="number" name="unitPrice" value={productFormData.unitPrice} onChange={handleProductChange} placeholder="0" className="p-2 border rounded text-[#2F2F2F]" />
                            <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Choose Files
                                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                            {productFormData.images.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {productFormData.images.map((image, index) => (
                                        <img key={index} src={image} alt={`Product ${index}`} className="w-20 h-20 object-cover border rounded" />
                                    ))}
                                </div>
                            )}
                            <button onClick={handleAddProduct} className="mt-2 p-2 bg-blue-500 text-white rounded">
                                Add
                            </button>
                        </div>
                    </div>

                    <div className="w-full p-4 border border-[#2F2F2F] rounded-xl flex flex-col">
                        <div className="flex flex-wrap justify-start mb-4">
                            <button onClick={() => handleFilterChange('status', 'Active')} className={`mx-1 px-3 py-1 rounded ${filters.status.includes('Active') ? 'bg-blue-500 text-white' : 'border border-gray-300'}`}>Active</button>
                            <button onClick={() => handleFilterChange('status', 'Inactive')} className={`mx-1 px-3 py-1 rounded ${filters.status.includes('Inactive') ? 'bg-blue-500 text-white' : 'border border-gray-300'}`}>Inactive</button>
                            <button onClick={() => handleFilterChange('lowStock')} className={`mx-1 px-3 py-1 rounded ${filters.lowStock ? 'bg-blue-500 text-white' : 'border border-gray-300'}`}>Low Stock</button>
                            <button onClick={() => handleFilterChange('sales', 'Online')} className={`mx-1 px-3 py-1 rounded ${filters.sales.includes('Online') ? 'bg-blue-500 text-white' : 'border border-gray-300'}`}>Online</button>
                            <button onClick={() => handleFilterChange('sales', 'Offline')} className={`mx-1 px-3 py-1 rounded ${filters.sales.includes('Offline') ? 'bg-blue-500 text-white' : 'border border-gray-300'}`}>Offline</button>
                            <button onClick={() => handleFilterChange('sales', 'Hybrid')} className={`mx-1 px-3 py-1 rounded ${filters.sales.includes('Hybrid') ? 'bg-blue-500 text-white' : 'border border-gray-300'}`}>Hybrid</button>
                            <button onClick={clearFilters} className="mx-1 px-3 py-1 rounded border border-red-500 text-red-500">Clear Filters</button>
                        </div>
                        <h2 className="text-lg font-semibold mb-4">Product List</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 p-2" style={{ width: '50px', minWidth: '50px' }}>Sl. No</th>
                                        <th className="border border-gray-300 p-2" style={{ minWidth: '150px' }}>Product Name</th>
                                        <th className="border border-gray-300 p-2" style={{ minWidth: '80px' }}>Product Status</th>
                                        <th className="border border-gray-300 p-2" style={{ minWidth: '80px' }}>Mode of Sale</th>
                                        <th className="border border-gray-300 p-2" style={{ width: '60px', minWidth: '60px' }}>Stock</th>
                                        <th className="border border-gray-300 p-2" style={{ minWidth: '100px' }}>Category</th>
                                        <th className="border border-gray-300 p-2" style={{ minWidth: '100px' }}>SKU</th>
                                        <th className="border border-gray-300 p-2" style={{ width: '80px', minWidth: '80px' }}>Unit Price</th>
                                        <th className="border border-gray-300 p-2" style={{ minWidth: '100px' }}>Barcode</th>
                                        <th className="border border-gray-300 p-2" style={{ minWidth: '120px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentProducts.map((product) => (
                                        <tr key={product.id}>
                                            <td className="border border-gray-300 p-2">
                                                {editingProductId === product.id ? <input type="number" name="id" value={editedProductData.id} onChange={(e) => handleEditedProductChange(e, product.id)} style={{ width: '100%' }} /> : product.id}
                                            </td>
                                            <td className="border border-gray-300 p-2 flex items-center">
                                                {product.images && product.images.length > 0 && (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={`Thumbnail ${product.productName}`}
                                                        className="w-8 h-8 object-cover rounded mr-2"
                                                    />
                                                )}
                                                {editingProductId === product.id ? (
                                                    <input
                                                        type="text"
                                                        name="productName"
                                                        value={editedProductData.productName}
                                                        onChange={(e) => handleEditedProductChange(e, product.id)}
                                                        style={{ width: '100%' }}
                                                    />
                                                ) : (
                                                    product.productName
                                                )}
                                            </td>
                                            <td className="border border-gray-300 p-2" style={{ color: editingProductId === product.id ? (editedProductData.status === 'Active' ? 'green' : 'red') : (product.status === 'Active' ? 'green' : 'red') }}>
                                                {editingProductId === product.id ? <select name="status" value={editedProductData.status} onChange={(e) => handleEditedProductChange(e, product.id)} style={{ width: '100%' }}><option>Active</option><option>Inactive</option></select> : product.status}
                                            </td>
                                            <td className="border border-gray-300 p-2" style={{ color: editingProductId === product.id ? (editedProductData.sales === 'Online' ? 'blue' : editedProductData.sales === 'Offline' ? 'orange' : 'purple') : (product.sales === 'Online' ? 'blue' : product.sales === 'Offline' ? 'orange' : 'purple') }}>
                                                {editingProductId === product.id ? <select name="sales" value={editedProductData.sales} onChange={(e) => handleEditedProductChange(e, product.id)} style={{ width: '100%' }}><option>Online</option><option>Offline</option><option>Hybrid</option></select> : capitalizeSales(product.sales)}
                                            </td>
                                            <td className="border border-gray-300 p-2">
                                                {editingProductId === product.id ? <input type="number" name="stock" value={editedProductData.stock} onChange={(e) => handleEditedProductChange(e, product.id)} style={{ width: '100%' }} /> : product.stock}
                                            </td>
                                            <td className="border border-gray-300 p-2">
                                                {editingProductId === product.id ? <select name="category" value={editedProductData.category} onChange={(e) => handleEditedProductChange(e, product.id)} style={{ width: '100%' }}><option>Electronics</option><option>Clothing</option><option>Books</option></select> : product.category}
                                            </td>
                                            <td className="border border-gray-300 p-2">
                                                {editingProductId === product.id ? <input type="text" name="sku" value={editedProductData.sku} onChange={(e) => handleEditedProductChange(e, product.id)} style={{ width: '100%' }} /> : product.sku}
                                            </td>
                                            <td className="border border-gray-300 p-2">
                                                {editingProductId === product.id ? <input type="number" name="unitPrice" value={editedProductData.unitPrice} onChange={(e) => handleEditedProductChange(e, product.id)} style={{ width: '100%' }} /> : product.unitPrice}
                                            </td>
                                            <td className="border border-gray-300 p-2">
                                                <svg ref={(svg) => {
                                                    if (svg) {
                                                        JsBarcode(svg, product.sku, { height: 20, displayValue: false });
                                                    }
                                                }} />
                                            </td>
                                            <td className="border border-gray-300 p-2">
                                                {editingProductId === product.id ? (
                                                    <button onClick={() => handleSaveProduct(product.id)} className="text-green-500">Save</button>
                                                ) : (
                                                    <>
                                                        <button onClick={() => handleEditProduct(product)} className="text-blue-500 mr-2">Edit</button>
                                                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500">Delete</button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-center mt-4">
                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                                <button
                                    key={pageNumber}
                                    onClick={() => paginate(pageNumber)}
                                    className={`mx-1 px-3 py-1 rounded ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'border border-gray-300'}`}
                                >
                                    {pageNumber}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProductsPage;
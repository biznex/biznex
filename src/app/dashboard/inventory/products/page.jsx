"use client";

import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../components/dashboardlayout';
import Barcode from 'react-barcode';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/browser';

function InventoryPage() {
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [showUpdateStockForm, setShowUpdateStockForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([
    { id: 1, name: 'Laptop', status: 'active', stock: 100, category: 'Electronics', sku: '12345678', unitPrice: 25.00 },
    { id: 2, name: 'Product B', status: 'inactive', stock: 0, category: 'Clothing', sku: '87654321', unitPrice: 15.00 },
    { id: 3, name: 'Product C', status: 'active', stock: 5, category: 'Books', sku: '11223344', unitPrice: 10.00 },
    { id: 4, name: 'Product D', status: 'active', stock: 200, category: 'Electronics', sku: '55667788', unitPrice: 30.00 },
    { id: 5, name: 'Product E', status: 'inactive', stock: 0, category: 'Home', sku: '99001122', unitPrice: 20.00 },
  ]);
  const itemsPerPage = 20;

  const filteredProducts = products.filter((product) => {
    if (filter === 'all') return true;
    if (filter === 'active') return product.status === 'active';
    if (filter === 'non-active') return product.status === 'inactive';
    if (filter === 'low-stock') return product.stock <= 10;
    return true;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredProducts.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const categories = [...new Set(products.map(product => product.category))];

  const handleAddProduct = (newProduct) => {
    setProducts([...products, { ...newProduct, id: products.length + 1 }]);
    setShowAddProductForm(false);
  };

  const handleUpdateStock = (updatedProduct) => {
    const updatedProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setProducts(updatedProducts);
    setShowUpdateStockForm(false);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      const options = products.filter(product => product.name.toLowerCase().includes(value.toLowerCase()));
      setFilteredOptions(options);
    } else {
      setFilteredOptions([]);
    }
  };

  const handleSelectProduct = (product) => {
    setSearchTerm(product.name);
    setFilteredOptions([]);
  };

  const [isScanning, setIsScanning] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState('');
  const videoRef = useRef(null);
  const codeReader = useRef(null);

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  useEffect(() => {
    if (isScanning && videoRef.current && isMobile()) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const initReader = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            codeReader.current = new BrowserMultiFormatReader();
            codeReader.current.decodeFromInputVideoDevice(undefined, videoRef.current, (result, err) => {
              if (result) {
                setScannedBarcode(result.text);
                setIsScanning(false);
              }
              if (err && !(err instanceof NotFoundException)) {
                console.error(err);
              }
            });
          } catch (error) {
            console.error('Camera access error:', error);
            setIsScanning(false);
          }
        };
        initReader();
      } else {
        console.error('Camera not supported');
        setIsScanning(false);
      }
    } else if (codeReader.current) {
      codeReader.current.reset();
      codeReader.current = null;
    }
  }, [isScanning]);

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-black rounded-xl p-4">
            <div className="text-left">
              <h2 className="text-lg font-semibold mb-4 text-black">Product Types</h2>
              <p>{categories.length}</p>
            </div>
          </div>
          <div className="bg-white border border-black rounded-xl p-4">
            <div className="text-left">
              <h2 className="text-lg font-semibold mb-4 text-black">Total Products</h2>
              <p>{products.length}</p>
            </div>
          </div>
          <div className="bg-white border border-black rounded-xl p-4">
            <div className="text-left">
              <h2 className="text-lg font-semibold mb-4 text-black">Low Stock Products</h2>
              <p>{products.filter(p => p.stock <= 10).length}</p>
            </div>
          </div>
          <div className="bg-white border border-black rounded-xl p-4">
            <div className="text-left">
              <h2 className="text-lg font-semibold mb-4 text-black">Total Inventory Value</h2>
              <p>₹ {products.reduce((acc, p) => acc + (p.stock * p.unitPrice), 0).toFixed(2)}</p>
            </div>
          </div>
          <div className="bg-blue-500 text-white border border-black rounded-xl p-4 cursor-pointer" onClick={() => setShowAddProductForm(!showAddProductForm)}>Add Product</div>
          <div className="bg-blue-500 text-white border border-black rounded-xl p-4 cursor-pointer" onClick={() => setShowUpdateStockForm(!showUpdateStockForm)}>Update Stock/Product Details</div>
          <div className="bg-blue-500 text-white border border-black rounded-xl p-4">Export PDF</div>
          <div className="bg-blue-500 text-white border border-black rounded-xl p-4">Export Low Stock PDF</div>
          {showAddProductForm && (
            <div className="bg-white border border-black rounded-xl p-4 col-span-1">
              <h2 className="text-lg font-semibold mb-4 text-center">Add Product</h2>
              <div className="flex justify-around mb-4">
                <button className={`p-2 border rounded ${!isScanning ? 'bg-blue-500 text-white' : 'bg-gray-300'}`} onClick={() => setIsScanning(false)}>Manual</button>
                {isMobile() && <button className={`p-2 border rounded ${isScanning ? 'bg-blue-500 text-white' : 'bg-gray-300'}`} onClick={() => setIsScanning(true)}>Scan Barcode</button>}
              </div>
              {isScanning && isMobile() ? (
                <div className="text-center">
                  <video ref={videoRef} className="w-full" />
                  {scannedBarcode && <p>Scanned Barcode: {scannedBarcode}</p>}
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleAddProduct({
                      name: e.target.productName.value,
                      category: e.target.category.value,
                      stock: parseInt(e.target.stockQuantity.value),
                      unitPrice: parseFloat(e.target.unitPrice.value),
                      status: 'active',
                      sku: scannedBarcode,
                    });
                  }}>
                    <input type="text" name="productName" placeholder="Product Name" className="w-full mx-auto p-2 border rounded mb-2 text-center" style={{ width: 'calc(100%)' }} />
                    <select name="category" className="w-full mx-auto p-2 border rounded mb-2 text-center" style={{ width: 'calc(100%)' }}>
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <input type="number" name="stockQuantity" placeholder="Stock Quantity" className="w-full mx-auto p-2 border rounded mb-2 text-center" style={{ width: 'calc(100%)' }} />
                    <input type="number" name="unitPrice" placeholder="Unit Price" className="w-full mx-auto p-2 border rounded mb-2 text-center" style={{ width: 'calc(100%)' }} />
                    <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Submit</button>
                    <button type="button" className="w-full p-2 bg-gray-300 text-black rounded mt-2" onClick={() => setShowAddProductForm(false)}>Cancel</button>
                  </form>
                </div>
              ) : (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleAddProduct({
                    name: e.target.productName.value,
                    category: e.target.category.value,
                    stock: parseInt(e.target.stockQuantity.value),
                    unitPrice: parseFloat(e.target.unitPrice.value),
                    status: 'active',
                    sku: e.target.sku.value,
                  });
                }}>
                  <input type="text" name="productName" placeholder="Product Name" className="w-full mx-auto p-2 border rounded mb-2 text-center" style={{ width: 'calc(100%)' }} />
                  <select name="category" className="w-full mx-auto p-2 border rounded mb-2 text-center" style={{ width: 'calc(100%)' }}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <input type="number" name="stockQuantity" placeholder="Stock Quantity" className="w-full mx-auto p-2 border rounded mb-2 text-center" style={{ width: 'calc(100%)' }} />
                  <input type="text" name="sku" placeholder="SKU" className="w-full mx-auto p-2 border rounded mb-2 text-center" style={{ width: 'calc(100%)' }} />
                  <input type="number" name="unitPrice" placeholder="Unit Price" className="w-full mx-auto p-2 border rounded mb-2 text-center" style={{ width: 'calc(100%)' }} />
                  <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Submit</button>
                  <button type="button" className="w-full p-2 bg-gray-300 text-black rounded mt-2" onClick={() => setShowAddProductForm(false)}>Cancel</button>
                </form>
              )}
            </div>
          )}
          {showUpdateStockForm && (
            <div className="bg-white border border-black rounded-xl p-4 col-span-1">
              <h2 className="text-lg font-semibold mb-4 text-center">Update Stock/Product Details</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const productId = products.find(p => p.name === searchTerm || p.id === parseInt(searchTerm))?.id;
                if (productId) {
                  handleUpdateStock({
                    id: productId,
                    name: searchTerm,
                    stock: parseInt(e.target.newStockQuantity.value),
                    category: e.target.category.value,
                  });
                }
              }}>
                <input
                  type="text"
                  name="productName"
                  placeholder="Product ID/Name"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full mx-auto p-2 border rounded mb-2 text-center"
                  style={{ width: 'calc(100%)' }}
                />
                {filteredOptions.length > 0 && (
                  <ul className="border border-gray-300 rounded bg-white absolute z-10">
                    {filteredOptions.map(product => (
                      <li
                        key={product.id}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleSelectProduct(product)}
                      >
                        {product.name}
                      </li>
                    ))}
                  </ul>
                )}
                <input type="number" name="newStockQuantity" placeholder="New Stock Quantity" className="w-full mx-auto p-2 border rounded mb-2 text-center" style={{ width: 'calc(100%)' }} />
                <input type="text" name="reasonForUpdate" placeholder="Reason for Update" className="w-full mx-auto p-2 border rounded mb-2 text-center" style={{ width: 'calc(100%)' }} />
                <input type="date" name="updateDate" placeholder="Update Date" className="w-full mx-auto p-2 border rounded mb-2 text-center" style={{ width: 'calc(100%)' }} />
                <select name="category" className="w-full mx-auto p-2 border rounded mb-2 text-center" style={{ width: 'calc(100%)' }}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Submit</button>
                <button type="button" className="w-full p-2 bg-gray-300 text-black rounded mt-2" onClick={() => setShowUpdateStockForm(false)}>Cancel</button>
              </form>
            </div>
          )}
        </div>
        <div className="mt-4 bg-white border border-black rounded-xl p-4">
          <div className="flex space-x-2 mb-4 justify-around">
            <button className={`p-2 border rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-white'}`} style={{ width: '20%' }} onClick={() => setFilter('all')}>All</button>
            <button className={`p-2 border rounded ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-white'}`} style={{ width: '20%' }} onClick={() => setFilter('active')}>Active</button>
            <button className={`p-2 border rounded ${filter === 'non-active' ? 'bg-blue-500 text-white' : 'bg-white'}`} style={{ width: '20%' }} onClick={() => setFilter('non-active')}>Inactive</button>
            <button className={`p-2 border rounded ${filter === 'low-stock' ? 'bg-blue-500 text-white' : 'bg-white'}`} style={{ width: '20%' }} onClick={() => setFilter('low-stock')}>Low Stock</button>
            <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="p-2 border rounded" style={{ width: '10%' }}>
              &lt;
            </button>
            <button disabled={currentPage === pageNumbers[pageNumbers.length - 1]} onClick={() => handlePageChange(currentPage + 1)} className="p-2 border rounded" style={{ width: '10%' }}>
              &gt;
            </button>
          </div>
          <h2 className="text-lg font-semibold mb-4 text-center">Products</h2>
          <table className="w-full border-collapse border border-slate-800">
            <thead>
              <tr>
                <th className="text-center border border-slate-800 p-2">Product</th>
                <th className="text-center border border-slate-800 p-2">Status</th>
                <th className="text-center border border-slate-800 p-2">Stock</th>
                <th className="text-center border border-slate-800 p-2">Category</th>
                <th className="text-center border border-slate-800 p-2">SKU</th>
                <th className="text-center border border-slate-800 p-2">Unit Price</th>
                <th className="text-center border border-slate-800 p-2">Barcode</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((product) => (
                <tr key={product.id}>
                  <td className="py-2 border border-slate-800 p-2 text-left">{product.name}</td>
                  <td className="py-2 border border-slate-800 p-2 text-left">
                    {product.status === 'active' ? (
                      <span className="bg-green-500 text-white rounded-md p-1">Active</span>
                    ) : (
                      <span className="bg-red-500 text-white rounded-md p-1">Inactive</span>
                    )}
                  </td>
                  <td className="py-2 border border-slate-800 p-2 text-left">
                    {product.stock <= 10 ? (
                      <span className="bg-red-500 text-white rounded-md p-1">{product.stock}</span>
                    ) : (
                      product.stock
                    )}
                  </td>
                  <td className="py-2 border border-slate-800 p-2 text-left">{product.category}</td>
                  <td className="py-2 border border-slate-800 p-2 text-left">{product.sku}</td>
                  <td className="py-2 border border-slate-800 p-2 text-left">₹ {product.unitPrice.toFixed(2)}</td>
                  <td className="py-2 border border-slate-800 p-2 text-left">
                    <Barcode value={product.sku} height={30} />
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
            <div className="flex justify-center mt-4">
              <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="p-2 border rounded">
                &lt;
              </button>
              <div className="flex space-x-2">
                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    onClick={() => handlePageChange(number)}
                    className={`p-2 border rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-white'}`}
                  >
                    {number}
                  </button>
                ))}
              </div>
              <button disabled={currentPage === pageNumbers[pageNumbers.length - 1]} onClick={() => handlePageChange(currentPage + 1)} className="p-2 border rounded">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  export default InventoryPage;
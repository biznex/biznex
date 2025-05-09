"use client";

import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from '../../components/dashboardlayout';
import { BrowserBarcodeReader } from '@zxing/library';

const CreateBill = () => {
  const [billItems, setBillItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const billRef = useRef();
  const [productSearch, setProductSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [skuSearch, setSkuSearch] = useState('');
  const videoRef = useRef(null);
  const [productSearchFocused, setProductSearchFocused] = useState(false);
  const [skuSearchFocused, setSkuSearchFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const productList = [
    { id: 1, name: 'Laptop', price: 1200.00, sku: 'LAP-001', stock: 10 },
    { id: 2, name: 'Mouse', price: 25.00, sku: 'MOU-007', stock: 50 },
    { id: 3, name: 'Keyboard', price: 50.00, sku: 'TBK-009', stock: 30 },
    { id: 4, name: 'Monitor', price: 300.00, sku: 'MON-004', stock: 20 },
    { id: 5, name: 'Headphones', price: 80.00, sku: 'HDP-004', stock: 40 },
    { id: 6, name: 'Laptop Charger', price: 60.00, sku: 'LCH-006', stock: 25 },
    { id: 7, name: 'Wireless Mouse', price: 35.00, sku: 'WMOU-008', stock: 35 },
    { id: 8, name: 'Mechanical Keyboard', price: 100.00, sku: 'MKB-010', stock: 15 },
    { id: 9, name: 'Curved Monitor', price: 450.00, sku: 'CMON-011', stock: 10 },
    { id: 10, name: 'Noise-Cancelling Headphones', price: 150.00, sku: 'NCH-012', stock: 20 },
    { id: 11, name: 'T-Shirt', price: 20.00, sku: 'TSH-002', stock: 60 },
    { id: 12, name: 'Book', price: 15.00, sku: 'BOK-003', stock: 100 },
    { id: 13, name: 'Jeans', price: 60.00, sku: 'JNS-005', stock: 30 },
    { id: 14, name: 'Novel', price: 12.00, sku: 'NVL-006', stock: 80 },
    { id: 15, name: 'Dress', price: 80.00, sku: 'DRS-008', stock: 40 },
  ];

  useEffect(() => {
    if (videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((error) => {
          console.error("Error accessing camera:", error);
        });
    }
  }, []);

  const handleScanButtonClick = () => {
    const reader = new BrowserBarcodeReader();
    reader
      .decodeFromInputVideoDevice(undefined, videoRef.current)
      .then((result) => {
        handleBarcodeScan(result.text);
        if ("vibrate" in navigator) {
          navigator.vibrate(500);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleBarcodeScan = (barcode) => {
    const product = productList.find((p) => p.sku === barcode);
    if (product) {
      setSelectedProduct(product);
      setProductSearch(product.name);
      setSkuSearch(product.sku);
    } else {
      alert("Product not found.");
    }
  };

  const handleAddProduct = () => {
    if (selectedProduct) {
      if (quantity > selectedProduct.stock) {
        setErrorMessage(`Cannot add. Stock of ${selectedProduct.name} is ${selectedProduct.stock}.`);
        return;
      }
      setBillItems([
        ...billItems,
        {
          product: selectedProduct,
          quantity: quantity,
        },
      ]);
      setSelectedProduct(null);
      setQuantity(1);
      setProductSearch('');
      setSkuSearch('');
      setFilteredProducts([]);
      setProductSearchFocused(false);
      setSkuSearchFocused(false);
      setErrorMessage('');
    }
  };

  const calculateTotal = () => {
    return billItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Print Bill</title>
          <style>
            body { font-family: monospace; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border-bottom: 1px solid black; padding: 5px; text-align: left; }
            th { text-align: left; }
            .underline { border-bottom: 1px solid black; margin-bottom: 5px; }
          </style>
        </head>
        <body>
          <div style="text-align: center;">
            <h2>Your Store Name</h2>
            <div class="underline"></div>
            <p>${new Date().toLocaleString()}</p>
            <div class="underline"></div>
          </div>
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${billItems.map(item => `
                <tr>
                  <td>${item.product.sku}</td>
                  <td>${item.product.name}</td>
                  <td>$${item.product.price.toFixed(2)}</td>
                  <td>${item.quantity}</td>
                  <td>$${(item.product.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" style="text-align: right;"><strong>Total:</strong></td>
                <td><strong>$${calculateTotal().toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  const handleProductSearchChange = (e) => {
    const searchTerm = e.target.value;
    setProductSearch(searchTerm);

    if (searchTerm) {
      const filtered = productList.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  const handleSkuSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSkuSearch(searchTerm);

    if (searchTerm) {
      const filtered = productList.filter(product =>
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setProductSearch(product.name);
    setSkuSearch(product.sku);
    setFilteredProducts([]);
    setProductSearchFocused(false);
    setSkuSearchFocused(false);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = [...billItems];
    updatedItems.splice(index, 1);
    setBillItems(updatedItems);
  };

  const handleNewBill = () => {
    setBillItems([]);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row-reverse w-full h-full">
        <div className="w-full md:w-1/4 p-4">
          <h2 className="text-xl font-semibold mb-4">Add Products</h2>

          <div style={{ position: 'relative', width: '100%', height: '200px', marginBottom: '10px' }}>
            <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay playsInline/>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '5%',
                width: '90%',
                height: '2px',
                backgroundColor: 'red',
                transform: 'translateY(-50%)',
              }}
            />
          </div>

          <button
            onClick={handleScanButtonClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Click to Scan
          </button>

          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {errorMessage}</span>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Search Product:</label>
            <input
              type="text"
              value={productSearch}
              onChange={handleProductSearchChange}
              onFocus={() => setProductSearchFocused(true)}
              onBlur={() => setTimeout(() => setProductSearchFocused(false), 200)}
              className="w-full p-2 border rounded"
              placeholder="Enter product name"
            />
            {productSearchFocused && filteredProducts.length > 0 && (
              <ul className="border rounded mt-1 bg-white">
                {filteredProducts.map(product => (
                  <li
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {product.name} ({product.sku})
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Search SKU:</label>
            <input
              type="text"
              value={skuSearch}
              onChange={handleSkuSearchChange}
              onFocus={() => setSkuSearchFocused(true)}
              onBlur={() => setTimeout(() => setSkuSearchFocused(false), 200)}
              className="w-full p-2 border rounded"
              placeholder="Enter SKU"
            />
            {skuSearchFocused && filteredProducts.length > 0 && (
              <ul className="border rounded mt-1 bg-white">
                {filteredProducts.map(product => (
                  <li
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {product.name} ({product.sku})
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                const parsedValue = parseInt(e.target.value, 10);
                setQuantity(isNaN(parsedValue) ? 1 : parsedValue);
              }}
              min="1"
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={handleAddProduct}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Product
          </button>
        </div>

        <div className="w-full md:w-3/4 p-4 md:border-r">
          <div ref={billRef}>
            <h2 className="text-2xl font-semibold mb-4">Bill Preview</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th>SKU</th>
                  <th className="text-left p-2">Product</th>
                  <th className="text-left p-2">Quantity</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {billItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td>{item.product.sku}</td>
                    <td className="p-2">{item.product.name}</td>
                    <td className="p-2">{item.quantity}</td>
                    <td className="p-2">${item.product.price.toFixed(2)}</td>
                    <td className="p-2">${(item.product.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteItem(index)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-semibold">
                  <td colSpan="5" className="p-2 text-right">Total:</td>
                  <td className="p-2">${calculateTotal().toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="flex justify-start mt-4">
            <button onClick={handlePrint} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
              Confirm & Print Bill
            </button>
            <button onClick={handleNewBill} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              New Bill
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateBill;
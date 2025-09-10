"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from '../../components/dashboardlayout';
import JsBarcode from 'jsbarcode';
import axios from "axios";
import { useRouter } from "next/navigation";
import { uploadToS3 } from '../../../s3upload/uploads3'

const ProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;
  const [fileUrl, setFileUrl] = useState("");
  const [filters, setFilters] = useState({ status: [], sales: [], lowStock: false });
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProductData, setEditedProductData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  // A new state to handle the preview URL for the "Add Product" form
  const [previewUrl, setPreviewUrl] = useState('');

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
    category: '', 
    sku: '', unitPrice: '', 
    images: [],
  });

  const handleProductChange = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    if (name === 'stock') value = Math.max(0, parseInt(value, 10) || 0);
    if (name === 'unitPrice' && parseFloat(value) < 0) { alert("Negative values not possible"); value = '0'; }
    setProductFormData({ ...productFormData, [name]: value });
  };

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
            status: item.status,
            sales: item.type,
            stock: item.quantity,
            category: item.category,
            sku: item.barcode,
            unitPrice: parseFloat(item.price),
            images: item.imageurl ? [item.imageurl] : [],
          }));

          setProducts(mappedProducts);
        }
        console.log("Products:", products);
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

    const fetchCategoriesData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("https://biznex.onrender.com/category/categories", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log("Category API Response:", response.data);

        if (response.status >= 200 && response.status < 300) {
          const categoryData = response.data.categories.map((item) => ({
            id: item.category_id,
            categoryName: item.category,
            productCount: item.product_count,
          }));

          setCategories(categoryData);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        if (error.response && error.response.status === 401) {
          alert("Unauthorized access, Failed to load categories. Please log in again.");
          router.push("/login");
        } else {
          console.error("Error fetching categories:", error);
        }
      }
    };

    fetchProductsData();
    fetchCategoriesData();
  }, [router]);
  
  // MODIFIED: This function now creates a temporary URL for image preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setProductFormData({ ...productFormData, images: [] });
      setPreviewUrl('');
      return;
    }
    setProductFormData({ ...productFormData, images: [file] });
    
    // Clean up previous preview URL if it exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
  };
  
  const handleThumbnailClick = (imageUrl) => setSelectedImage(imageUrl);
  const closeModal = () => setSelectedImage(null);

  const handleAddProduct = async () => {
    try {
      let uploadedImageUrl = null;
      if (productFormData.images && productFormData.images.length > 0) {
        uploadedImageUrl = await handleSingleFileUpload(productFormData.images[0]);
      }

      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://biznex.onrender.com/inventory/add-product',
        {
          name: productFormData.productName,
          category: productFormData.category,
          quantity: productFormData.stock,
          barcode: productFormData.sku,
          price: productFormData.unitPrice,
          type: productFormData.sales,
          status: productFormData.status,
          imageUrl: uploadedImageUrl,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status >= 200 && response.status < 300) {
        alert('Product added successfully');
        const newProduct = {
          id: response.data.product.id,
          productName: productFormData.productName,
          status: productFormData.status,
          sales: productFormData.sales,
          stock: productFormData.stock,
          category: productFormData.category,
          sku: productFormData.sku,
          unitPrice: parseFloat(productFormData.unitPrice),
          images: uploadedImageUrl ? [uploadedImageUrl] : [],
        };
        setProducts((prevProducts) => [...prevProducts, newProduct]);

        // Reset form and the new preview URL
        setProductFormData({
          productName: '',
          status: 'Active',
          sales: 'Online',
          stock: '',
          category: '',
          sku: '',
          unitPrice: '',
          images: [],
        });
        setPreviewUrl('');
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

      } else {
        alert(`Failed to add product. Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  const handleSingleFileUpload = async (file) => {
    if (!file) return null;

    try {
      const response = await fetch(
        `https://biznex.onrender.com/s3up/generate-upload-url?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`,
        { method: 'GET', mode: 'cors' }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error('Backend response:', text);
        throw new Error('Failed to get upload URL from backend');
      }

      const { uploadURL, key } = await response.json();

      const uploadResponse = await fetch(uploadURL, {
        method: 'PUT',
        body: file,
      });

      if (!uploadResponse.ok) {
        const text = await uploadResponse.text();
        console.error('S3 upload error response:', text);
        throw new Error(`Failed to upload to S3 (status ${uploadResponse.status})`);
      }

      const fileURL = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
      console.log('✅ Upload successful:', fileURL);
      return fileURL;
    } catch (error) {
      console.error('❌ Error uploading file:', error);
      alert('File upload failed. Please try again.');
      return null;
    }
  };

  const handleUpdateProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `https://biznex.onrender.com/inventory/update-products`,
        {
          id: id,
          name: editedProductData.productName,
          category: editedProductData.category,
          quantity: editedProductData.stock,
          barcode: editedProductData.sku,
          price: editedProductData.unitPrice,
          type: editedProductData.sales,
          status: editedProductData.status,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const data = response.data;
      console.log('Update API Response:', data);

      if (response.status >= 200 && response.status < 300) {
        console.log('Product updated successfully', data);
        setProducts(products.map((item) =>
          item.id === id ? { ...item, ...editedProductData } : item
        ));
        setEditingProductId(null);
        handleCancelEdit();
        alert('Product updated successfully');
      } else {
        console.error('Failed to update product with status:', response.status, response.statusText);
        alert(`Failed to update product. Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error during product update:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Failed to update product. Server responded with status: ${error.response.status}. ${error.response.data?.message || 'Please try again.'}`);
      } else {
        alert('Failed to update product. An unexpected error occurred.');
      }
    }
  };

  // MODIFIED: This function now updates state instead of reloading the page
  const handleDeleteProduct = async (id) => {
    if (!id) {
      alert('Error: Product ID is missing.');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://biznex.onrender.com/inventory/delete-product`, {
        id: id
      },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status >= 200 && response.status < 300) {
        alert('Product deleted successfully');
        // Update the products state to remove the deleted item
        setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      } else {
        console.error('Failed to delete product with status:', response.status, response.statusText);
        alert(`Failed to delete product. Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error during product deletion:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Failed to delete product. Server responded with status: ${error.response.status}. ${error.response.data?.message || 'Please try again.'}`);
      } else {
        alert('Failed to delete product. An unexpected error occurred.');
      }
    }
  };


  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setEditedProductData({ ...product });
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setEditedProductData({});
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
              <input type="number" name="stock" value={productFormData.stock} onChange={handleProductChange} placeholder="Stock" className="p-2 border rounded text-[#2F2F2F]" />
              <select
                name="category"
                value={productFormData.category}
                onChange={handleProductChange}
                className="p-2 border rounded text-[#2F2F2F]"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.categoryName}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              <input type="text" name="sku" value={productFormData.sku} onChange={handleProductChange} placeholder="SKU" className="p-2 border rounded text-[#2F2F2F]" />
              <input type="number" name="unitPrice" value={productFormData.unitPrice} onChange={handleProductChange} placeholder="Unit Price" className="p-2 border rounded text-[#2F2F2F]" />
              <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Choose File
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {/* MODIFIED: This JSX now uses the previewUrl state to show the selected image */}
              {previewUrl && (
                <div className="mt-2">
                  <img src={previewUrl} alt="Product Preview" className="w-24 h-24 object-cover border rounded" />
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
                  {currentProducts.map((product, index) => (
                    <tr key={product.id}>
                      <td className="border border-gray-300 p-2">
                        {(currentPage - 1) * productsPerPage + index + 1}
                      </td>
                      {/* === MODIFIED SECTION START === */}
                      <td className="border border-gray-300 p-2">
                        <div className="flex items-center gap-3">
                          {editingProductId === product.id ? (
                            <input
                              type="text"
                              name="productName"
                              value={editedProductData.productName}
                              onChange={(e) => handleEditedProductChange(e, product.id)}
                              className="p-1 border rounded w-full"
                            />
                          ) : (
                            <>
                              {product.images && product.images.length > 0 && (
                                <img
                                  src={product.images[0]}
                                  alt={`Thumbnail of ${product.productName}`}
                                  className="w-10 h-10 object-cover rounded cursor-pointer"
                                  onClick={() => handleThumbnailClick(product.images[0])}
                                />
                              )}
                              <span>{product.productName}</span>
                            </>
                          )}
                        </div>
                      </td>
                      {/* === MODIFIED SECTION END === */}
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
                          <div>
                            <button onClick={() => handleUpdateProduct(product.id)} className="text-green-500 mr-2">Save</button>
                            <button onClick={handleCancelEdit} className="text-red-500">Cancel</button>
                          </div>
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
              {currentPage > 1 && (
                <button onClick={() => paginate(currentPage - 1)} className="mx-1 px-3 py-1 rounded border border-gray-300">Previous</button>
              )}
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  className={`mx-1 px-3 py-1 rounded ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'border border-gray-300'}`}
                >
                  {pageNumber}
                </button>
              ))}
              {currentPage < totalPages && (
                <button onClick={() => paginate(currentPage + 1)} className="mx-1 px-3 py-1 rounded border border-gray-300">Next</button>
              )}
            </div>
            {/* Image Modal */}
            {selectedImage && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={closeModal}>
                <img src={selectedImage} alt="Full size product" className="max-h-[80%] max-w-[80%] object-contain" />
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductsPage;
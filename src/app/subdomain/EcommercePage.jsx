"use client"; // ✅ Mark it as a Client Component

import React, { useState } from "react";
import { useRouter } from 'next/navigation';



import { FaUserCircle, FaBars, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";

export default function EcommercePage({ store, products }) {
  const router = useRouter();
  
    const [showLogout, setShowLogout] = useState(false);
      const [showFilters, setShowFilters] = useState(false);
      const [selectedCategories, setSelectedCategories] = useState([]);
      const [priceFilters, setPriceFilters] = useState({
        under100: false,
        _100to500: false,
        _500to1000: false,
        _1000plus: false,
      });
    
      
    
      const [cart, setCart] = useState([]);
      const [showCart, setShowCart] = useState(false);
      const [selectedProduct, setSelectedProduct] = useState(null);
    
      const categories = [...new Set(products.map((product) => product.category))];
    
      const handleCategoryChange = (category) => {
        if (selectedCategories.includes(category)) {
          setSelectedCategories(selectedCategories.filter((c) => c !== category));
        } else {
          setSelectedCategories([...selectedCategories, category]);
        }
      };
    
      const handlePriceFilterChange = (filter) => {
        setPriceFilters({ ...priceFilters, [filter]: !priceFilters[filter] });
      };
    
      const filteredProducts = products.filter((product) => {
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    
        let priceMatch = true;
        if (priceFilters.under100 && product.price >= 100) priceMatch = false;
        if (priceFilters._100to500 && (product.price < 100 || product.price > 500)) priceMatch = false;
        if (priceFilters._500to1000 && (product.price < 500 || product.price > 1000)) priceMatch = false;
        if (priceFilters._1000plus && product.price < 1000) priceMatch = false;
    
        const anyPriceSelected = Object.values(priceFilters).some(value => value);
        if (anyPriceSelected && !priceMatch) return false;
    
        return categoryMatch && priceMatch;
      });
    
      const bestsellers = filteredProducts.filter((product) => product.bestseller);
    
      const addToCart = (product) => {
        const existingItem = cart.find((item) => item.id === product.id);
        if (existingItem) {
          setCart(cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
          setCart([...cart, { ...product, quantity: 1 }]);
        }
      };
    
      const removeFromCart = (productId) => {
        setCart(cart.filter((item) => item.id !== productId));
      };
    
      const increaseQuantity = (productId) => {
        setCart(cart.map((item) => item.id === productId ? { ...item, quantity: item.quantity + 1 } : item));
      };
    
      const decreaseQuantity = (productId) => {
        setCart(cart.map((item) => item.id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item));
      };
    
      const showProductPopup = (product) => {
        setSelectedProduct(product);
      };
    
      const closeProductPopup = () => {
        setSelectedProduct(null);
      };
  
  return (
    <div className="flex flex-col min-h-screen bg-white text-black w-full">
      <header className="p-4 border-b border-gray-300 flex justify-between items-center">
        <div className="flex items-center">
          <button className="md:hidden" onClick={() => setShowFilters(!showFilters)}>
            <FaBars className="text-2xl cursor-pointer" />
          </button>
        </div>
        <div className="flex items-center">
          <h1 className="mr-2">Hi User!</h1>
          <div className="relative mr-4">
            <FaShoppingCart className="text-2xl cursor-pointer" onClick={() => setShowCart(!showCart)} />
            {showCart && (
              <div className="absolute right-0 mt-2 bg-white text-black p-4 rounded shadow-md border border-gray-300 z-10 w-80">
                <h3 className="font-semibold mb-2">Cart</h3>
                {cart.length === 0 ? (
                  <p>Your cart is empty.</p>
                ) : (
                  <ul>
                    {cart.map((item) => (
                      <li key={item.id} className="flex justify-between items-center mb-2">
                        <span>{item.name} ({item.quantity})</span>
                        <div className="flex items-center">
                          <button onClick={() => decreaseQuantity(item.id)} className="text-gray-600 p-1"><FaMinus/></button>
                          <button onClick={() => increaseQuantity(item.id)} className="text-gray-600 p-1"><FaPlus/></button>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-600 p-1">Remove</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <button
  onClick={() => {
    // Simulate order processing (replace with your actual order logic)
    console.log("Order processing...");

    // Simulate a 3-second delay
    setTimeout(() => {
      console.log("Order processed!");
      alert("Order placed!!");
      window.location.reload(); // Reload immediately after the alert
    }, 3000);
  }}
  className="mt-2 bg-green-500 text-white p-2 rounded w-full"
>
  Complete purchase
</button>
                <button onClick={() => setShowCart(false)} className="mt-2 bg-gray-200 p-2 rounded w-full">Close</button>
              </div>
            )}
          </div>
          <div className="relative">
            <FaUserCircle className="text-2xl cursor-pointer" onClick={() => setShowLogout(!showLogout)} />
            {showLogout && (
              <button
                className="absolute right-0 mt-2 bg-white text-black px-4 py-2 rounded shadow-md border border-gray-300"
                onClick={() => {
                  console.log('Logging out...');
                  router.push('/subdomain-login');
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>
      <div className="flex flex-row w-full">
      <aside
  className={`fixed left-0 h-screen w-full md:w-64 p-4 border-r border-gray-300 ₹{
    showFilters ? 'block' : 'hidden md:block'
  } overflow-y-auto`}
>
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="mb-4">
            <h3 className="font-semibold">Categories</h3>
            <div className="flex flex-col">
              {categories.map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="mr-2"
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold">Price</h3>
            <div className="flex flex-col">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={priceFilters.under100}
                  onChange={() => handlePriceFilterChange('under100')}
                  className="mr-2"
                />
                Under ₹100
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={priceFilters._100to500}
                  onChange={() => handlePriceFilterChange('_100to500')}
                  className="mr-2"
                />
                ₹100 - ₹500
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={priceFilters._500to1000}
                  onChange={() => handlePriceFilterChange('_500to1000')}
                  className="mr-2"
                />
                ₹500 - ₹1000
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={priceFilters._1000plus}
                  onChange={() => handlePriceFilterChange('_1000plus')}
                  className="mr-2"
                />
                ₹1000+
              </label>
            </div>
          </div>
        </aside>
        <main className="flex-1 p-4 md:ml-64">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Bestsellers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {bestsellers.map((product) => (
                <div key={product.id} className="border border-gray-300 p-4 rounded-md">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover mb-2" />
                  <h3 className="font-semibold">{product.name}</h3>
                  <p>₹{product.price}</p>
                  {cart.find((item) => item.id === product.id) ? (
                    <div className="flex items-center justify-center mt-2">
                      <button onClick={() => decreaseQuantity(product.id)} className="text-gray-600 p-1"><FaMinus /></button>
                      <span>{cart.find((item) => item.id === product.id).quantity}</span>
                      <button onClick={() => increaseQuantity(product.id)} className="text-gray-600 p-1"><FaPlus /></button>
                    </div>
                  ) : (
                    <button onClick={() => {addToCart(product);}} className="mt-2 bg-blue-500 text-white p-2 rounded w-full">Add to Cart</button>
                  )}
                  <button onClick={() => showProductPopup(product)} className="mt-2 bg-gray-200 text-black p-2 rounded w-full">View Details</button>
                </div>
              ))}
            </div>
          </section>
          {categories.map((category) => {
            const categoryProducts = filteredProducts.filter((product) => product.category === category);
            if (categoryProducts.length === 0) return null;

            return (
              <section key={category} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{category}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {categoryProducts.map((product) => (
                    <div key={product.id} className="border border-gray-300 p-4 rounded-md">
                      <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover mb-2" />
                      <h3 className="font-semibold">{product.name}</h3>
                      <p>₹{product.price}</p>
                      {cart.find((item) => item.id === product.id) ? (
                        <div className="flex items-center justify-center mt-2">
                          <button onClick={() => decreaseQuantity(product.id)} className="text-gray-600 p-1"><FaMinus /></button>
                          <span>{cart.find((item) => item.id === product.id).quantity}</span>
                          <button onClick={() => increaseQuantity(product.id)} className="text-gray-600 p-1"><FaPlus /></button>
                        </div>
                      ) : (
                        <button onClick={() => {addToCart(product);}} className="mt-2 bg-blue-500 text-white p-2 rounded w-full">Add to Cart</button>
                      )}
                      <button onClick={() => showProductPopup(product)} className="mt-2 bg-gray-200 text-black p-2 rounded w-full">View Details</button>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </main>
      </div>
      {selectedProduct && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-md w-96">
            <h2 className="text-xl font-semibold mb-4">{selectedProduct.name}</h2>
            <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-48 object-cover mb-4" />
            <p>{selectedProduct.description || "No description available."}</p>
            {cart.find((item) => item.id === selectedProduct.id) ? (
              <div className="flex items-center justify-center mt-2">
                <button onClick={() => decreaseQuantity(selectedProduct.id)} className="text-gray-600 p-1"><FaMinus /></button>
                <span>{cart.find((item) => item.id === selectedProduct.id).quantity}</span>
                <button onClick={() => increaseQuantity(selectedProduct.id)} className="text-gray-600 p-1"><FaPlus /></button>
              </div>
            ) : (
              <button onClick={() => {addToCart(selectedProduct); closeProductPopup();}} className="mt-4 bg-blue-500 text-white p-2 rounded w-full">Add to Cart</button>
            )}
            <button onClick={closeProductPopup} className="mt-2 bg-gray-200 text-black p-2 rounded w-full">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

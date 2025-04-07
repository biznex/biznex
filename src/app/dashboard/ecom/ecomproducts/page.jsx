"use client";

import React, { useState } from "react";
import DashboardLayout from '../../components/dashboardlayout'; // Assuming this exists

const EcomProducts = () => {
  const [products] = useState([
    { id: 1, name: "Smart Television" },
    { id: 2, name: "Wireless Headphones" },
    { id: 3, name: "Gaming Laptop" },
    { id: 4, name: "Bluetooth Speaker" },
    { id: 5, name: "Digital Camera" },
    { id: 6, name: "Smartwatch" },
    { id: 7, name: "Tablet" },
    { id: 8, name: "Fitness Tracker" },
    { id: 9, name: "E-reader" },
    { id: 10, name: "Soundbar" },
    { id: 11, name: "Portable Projector" },
    { id: 12, name: "VR Headset" },
    { id: 13, name: "Drone" },
    { id: 14, name: "Action Camera" },
    { id: 15, name: "Noise-Cancelling Earbuds" },
    { id: 16, name: "Home Security Camera" },
    { id: 17, name: "Robot Vacuum" },
    { id: 18, name: "Smart Lighting Kit" },
    { id: 19, name: "External SSD" },
    { id: 20, name: "Mechanical Keyboard" },
    { id: 21, name: "Ultrawide Monitor" },
    { id: 22, name: "Graphics Card" },
    { id: 23, name: "CPU" },
    { id: 24, name: "Motherboard" },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(products.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <DashboardLayout>
      <div className="p-4 text-[#2F2F2F]">
        <h1 className="text-xl font-semibold mb-4">Ecommerce Products</h1>
        <div className="grid grid-cols-1 gap-4">
          {/* Bento Box for the Product Table */}
          <div className="bg-white border border-black rounded-xl shadow-md overflow-x-auto">
            <h2 className="text-lg font-semibold p-4 border-b border-black">Product List</h2>
            <table className="min-w-full bg-white"> {/* Ensure white background for the table */}
              <thead className="bg-white"> {/* Ensure white background for thead */}
                <tr>
                  <th className="py-2 px-4 border-r border-b border-black">Sl.No</th> {/* Right and bottom border for the header */}
                  <th className="py-2 px-4 border-b border-black">Product Name</th> {/* Bottom border for the header */}
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product, index) => (
                  <tr key={product.id} className="bg-white"> {/* Ensure white background for each row */}
                    <td className="py-2 px-4 border-r border-b border-black">{indexOfFirstProduct + index + 1}</td> {/* Right and bottom border for the cell */}
                    <td className="py-2 px-4 border-b border-black">{product.name}</td> {/* Bottom border for the cell */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bento Box for Pagination */}
          {pageNumbers.length > 1 && (
            <div className="bg-white border border-black rounded-xl shadow-md p-4 flex justify-center items-center">
              <h2 className="text-lg font-semibold mr-4">Pages:</h2>
              {pageNumbers.map((number) => (
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
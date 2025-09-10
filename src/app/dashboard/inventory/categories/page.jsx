// src/app/dashboard/inventory/categories/page.jsx

"use client";

import React, { useState , useEffect } from "react";
import DashboardLayout from '../../components/dashboardlayout';
import axios from "axios";
import { useRouter } from "next/navigation";



const InventoryCategories = () => {
  const [categories, setCategories] = useState([]);

  const [categoryFormData, setCategoryFormData] = useState({
    categoryName: '',
  });

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  

  const handleCategoryChange = (e) => {
    setCategoryFormData({ ...categoryFormData, [e.target.name]: e.target.value });
  };

  const handleAddCategory = async () => {
    try {
        if (editingCategoryId) {
            setCategories(categories.map((item) =>
                item.id === editingCategoryId ? { ...item, ...categoryFormData } : item
            ));
            setEditingCategoryId(null);
        } else {
            const token = localStorage.getItem("token");

            const response = await axios.post(
                'https://biznex.onrender.com/category/add-category',
                {
                    
                    category: categoryFormData.categoryName,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            const data = response.data; // Access data from response.data for axios
            console.log(data);

            if (response.status >= 200 && response.status < 300 ) { // Check for successful status codes
                console.log('Category added successfully', data);
                alert('Category added successfully');
                window.location.reload();
            } else {
                console.error('Failed to add Category:', response.statusText);
            }
        }

        setCategoryFormData({
            categoryName: '',

         });
    } catch (error) {
        console.error('Error adding payable:', error);
    }
};

 {/* Fetching data for summary_all */}
 useEffect(() => {
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("https://biznex.onrender.com/category/categories", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("API Response:", response.data);
            

            if (response.status >= 200 && response.status < 300) {
              const categoryData = response.data.categories.map((item) => ({
                id: item.category_id,
                categoryName: item.category,
                productCount: item.product_count,
              }));
            
            
              setCategories(categoryData);
              
            }
            console.log(categories);
        } catch (error) {
            console.error("Error fetching data:", error);
            if (error.response && error.response.status === 401) {
                alert("Unauthorized access,Failed to load dashboard data.. Please log in again.");
                router.push("/login");
            } else {
                console.error("Error fetching data:", error);
            }
        }
    };

    fetchData();
}, []);

  const handleDeleteCategory = async (id) => {
  if (!id) return alert('ID not provided');

  const confirm = window.confirm('Are you sure you want to delete this category?');
  if (!confirm) return;

  try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
          'https://biznex.onrender.com/category/delete-category',
          { id: id },
          {
              headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
              },
              withCredentials: true, // Add this if needed
          }
      );

      console.log('API Response:', response.data); // Log response data

      if (response.status >= 200 && response.status < 300) {
          setCategories((prev) => prev.filter((item) => item.id !== id));
          alert('Category deleted successfully');
      }else if (response.status === 409) { 
            alert('Category cannot be deleted as it is linked to products.Retry after relinking products to another category.');
      }
      else if (response.status === 404) {
          alert('Category not found.');
      } else if (response.status >= 500) {
          alert('Server error. Please try again later.');
      } else {
          alert('Failed to delete category.');
      }

  } catch (err) {
      console.error('Delete Category Error:', err);
      if (err.response) {
          console.error('API Error Response:', err.response);
          alert(err.response.data.error || `Failed to delete vategory. Status: ${err.response.status}`);
      } else {
          alert('Failed to delete category. Please try again.');
      }
  }
};



 /* const handleCancelEditPayable = () => {
    setEditingPayableId(null);
    setPayableFormData({
      accountName: '',
      amount: '',
      date: '', //changed back to date, to match the form data
      paymentMethod: 'Payment Method',
      status: 'Payment Status',
    });
  };

  const handleEditCategory = (category) => {
    setEditingCategoryId(category.id);
    setCategoryFormData({
      categoryName: category.categoryName,
    });
  };
*/
  return (
    <DashboardLayout>
      <div className="p-4 text-[#2F2F2F]">
        <h1 className="text-lg font-semibold mb-4">Categories</h1>
        <div className="flex flex-col lg:flex-row gap-4 w-full">
          <div className="w-full lg:w-3/4 p-4 border border-[#2F2F2F] rounded-xl flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Available Categories</h2>
            <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Sl. No</th>
                    <th className="border border-gray-300 p-2">Category Name</th>
                    <th className="border border-gray-300 p-2">Number of Products</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>

                
                  {categories.map((category , index) => (
                    <tr key={category.id}>
                       
                        <td className="border border-gray-300 p-2">{index+1}</td>
                      <td className="border border-gray-300 p-2">{category.categoryName}</td>
                      <td className="border border-gray-300 p-2">{category.productCount}</td>
                      <td className="border border-gray-300 p-2">
                        <button onClick={() => handleDeleteCategory(category.id)} className="text-red-500">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-full lg:w-1/4 p-4 border border-[#2F2F2F] rounded-xl flex flex-col">
            <h2 className="text-lg font-semibold mb-4">
              {editingCategoryId ? 'Update Category' : 'Add Category'}
            </h2>
            <div className="flex flex-col gap-2">
              <input type="text" name="categoryName" value={categoryFormData.categoryName} onChange={handleCategoryChange} placeholder="Category Name" className="p-2 border rounded text-[#2F2F2F]" />
              <button onClick={handleAddCategory} className="mt-2 p-2 bg-blue-500 text-white rounded">
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InventoryCategories;
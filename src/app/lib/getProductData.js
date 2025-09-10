// lib/getProductData.js

export async function getProductData(subdomain, token) {
 try {
  if (!subdomain) {
      throw new Error("Subdomain is required to fetch product data.");
    }
  
  const response = await fetch(
   `https://biznex.onrender.com/sub/products?subdomain=${encodeURIComponent(subdomain)}`,
   {
    cache: "no-store",
    headers: { 
     Authorization: `Bearer ${token}` 
    }
   }
  );

  if (!response.ok) {
   const errorText = await response.text();
   throw new Error(`Failed to fetch product data: ${response.status} ${response.statusText} - ${errorText}`);
  }

    // FIX: Only call .json() once
  const data = await response.json();

  // The API response might be an object like { products: [] }, adjust if needed
  const productsArray = data.products || data;

  if (!Array.isArray(productsArray)) {
   throw new Error("Invalid data format received. Expected an array of products.");
  }

  console.log("✅ Fetched product data:", productsArray);
  return productsArray;

 } catch (error) {
  console.error("❌ Error in getProductData:", error.message);
  return null; // Return null on error
 }
}
// ServerWrapper.jsx

import { headers, cookies } from "next/headers";
import { getStoreData } from "../lib/getStoreData";
import { getProductData } from "../lib/getProductData";
import EcommercePage from "./EcommercePage";

export default async function ServerWrapper() {
 try {
    // Get headers and cookies on the server
  const headersList = headers();
    const cookieStore = cookies();

    // Extract subdomain from the 'host' header
    const host = headersList.get("host");
    // This logic assumes a URL like 'mysubdomain.localhost:3000' or 'mysubdomain.biznex.site'
    const subdomain = host.split('.')[0]; 
    
    // Get the auth token from cookies (not localStorage)
    const token = cookieStore.get("utoken")?.value || null;

  // Pass subdomain and token as arguments
  const storeData = await getStoreData(subdomain, token);
  const productData = await getProductData(subdomain, token);

  if (!storeData || !productData) {
   return <div>Error: Could not retrieve store or product data for this subdomain.</div>;
  }

  return <EcommercePage store={storeData} products={productData} />;
 } catch (error) {
  console.error("Error in ServerWrapper:", error);
  return <div>Error loading store data. Please try again later.</div>;
 }
}
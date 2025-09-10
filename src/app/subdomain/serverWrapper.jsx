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
    const host = headersList.get("host"); // e.g., 'mysubdomain.biznex.site'
    let subdomain = host.split('.')[0];

    // Handle main domain (no subdomain)
    if (subdomain === "www" || subdomain === "biznex") {
      return (
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold mb-4">Welcome to Biznex</h1>
          <p>Please choose a store or log in to continue.</p>
        </div>
      );
    }

    // Get the auth token from cookies (server-side)
    const token = cookieStore.get("utoken")?.value || null;

    // Fetch store and product data
    const storeData = await getStoreData(subdomain, token);
    const productData = await getProductData(subdomain, token);

    // Handle missing data
    if (!storeData || !productData) {
      return (
        <div className="text-center p-8">
          <h1 className="text-xl font-bold mb-2">Store not found</h1>
          <p>Could not retrieve store or product data for this subdomain.</p>
        </div>
      );
    }

    // Render the store page
    return <EcommercePage store={storeData} products={productData} />;

  } catch (error) {
    console.error("Error in ServerWrapper:", error);
    return (
      <div className="text-center p-8">
        <h1 className="text-xl font-bold mb-2">Error</h1>
        <p>Error loading store data. Please try again later.</p>
      </div>
    );
  }
}

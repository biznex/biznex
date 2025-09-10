// lib/getStoreData.js

export async function getStoreData(subdomain, token) {
 try {
  if (!subdomain) {
      throw new Error("Subdomain is required to fetch store data.");
    }

  console.log("Fetching store data for subdomain:", subdomain);

  const response = await fetch(
   `https://biznex.onrender.com/sub/api/store?subdomain=${encodeURIComponent(subdomain)}`,
   {
    cache: "no-store",
    headers: { 
     Authorization: `Bearer ${token}` 
    }
   }
  );

  if (!response.ok) {
   const errorText = await response.text();
   throw new Error(`Failed to fetch store data: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  console.log("✅ Fetched store data:", data);
  return data;

 } catch (error) {
  console.error("❌ Error in getStoreData:", error.message);
  return null; // Return null on error to be handled by the server component
 }
}
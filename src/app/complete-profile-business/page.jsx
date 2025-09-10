import { Suspense } from "react";
import CompleteProfileBusinessClient from "./CompleteProfileBusinessClient";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <CompleteProfileBusinessClient />
    </Suspense>
  );
}

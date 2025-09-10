import { Suspense } from "react";
import CompleteProfileJobClient from "./CompleteProfileJobClient";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <CompleteProfileJobClient />
    </Suspense>
  );
}

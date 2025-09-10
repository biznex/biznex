import { Suspense } from "react";
import JobCallback from "./JobCallback";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <JobCallback />
    </Suspense>
  );
}

"use client";
import OwnerActions from "../components/OwnerActions";

export default function AdminPage() {
  return (
    <div className="p-6 rounded-lg border bg-white dark:bg-gray-900">
      <h2 className="font-semibold text-lg mb-4">Owner Actions</h2>
      <OwnerActions/>
    </div>
  );
}
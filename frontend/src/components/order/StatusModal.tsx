"use client";
import { useState } from "react";
import { OrderStatus, ORDER_STATUS_TRANSITIONS } from "@/services/types";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: OrderStatus;
  onChangeStatus: (status: OrderStatus) => void;
}

export default function StatusModal({
  isOpen,
  onClose,
  currentStatus,
  onChangeStatus,
}: StatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");

  if (!isOpen) return null;

  // Get allowed transitions from ORDER_STATUS_TRANSITIONS
  const allowedStatuses: OrderStatus[] =
    ORDER_STATUS_TRANSITIONS[currentStatus].filter(
      (status) => status !== currentStatus
    );

  const handleSubmit = () => {
    if (!selectedStatus) {
      alert("Please select a status");
      return;
    }
    onChangeStatus(selectedStatus);
    setSelectedStatus(""); // reset after submission
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-80">
        <h2 className="text-xl font-bold mb-4">Change Status</h2>

        <div className="mb-4">
          <label className="block mb-2 font-medium" htmlFor="status-select">
            Select new status
          </label>
          <select
            id="status-select"
            className="w-full border rounded p-2"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
          >
            <option value="">-- Choose status --</option>
            {allowedStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <button
          className="w-full p-2 rounded bg-blue-500 text-white mb-2 hover:bg-blue-600"
          onClick={handleSubmit}
        >
          Save
        </button>

        <button
          className="w-full p-2 rounded bg-red-500 text-white hover:bg-red-600"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}




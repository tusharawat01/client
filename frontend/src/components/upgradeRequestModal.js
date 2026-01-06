"use client";

import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";

const UpgradeRequestModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  if (!isOpen) return null;

  const sendUpgradeRequest = async () => {
    try {
      setLoading(true);
      await axios.post("/api/upgrade-request", {
        plan: "basic",
        requestedPlan: "premium",
      });

      setRequestSent(true);
      toast.success("Upgrade request sent to admin");
    } catch (error) {
      toast.error("Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-black"
        >
          <IoMdClose size={22} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800">
          Upgrade Required
        </h2>

        {/* Message */}
        <p className="mt-3 text-sm text-gray-600">
          You are currently on the{" "}
          <span className="font-semibold">Basic Plan</span>. This feature is not
          available for your plan.
          <br />
          To access this feature, please send an upgrade request to the admin.
        </p>

        {/* Action Button */}
        <div className="mt-6">
          {requestSent ? (
            <button
              disabled
              className="w-full cursor-not-allowed rounded-md bg-green-500 px-4 py-2 text-white"
            >
              Request Sent ✔
            </button>
          ) : (
            <button
              onClick={sendUpgradeRequest}
              disabled={loading}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Sending Request..." : "Send Upgrade Request"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpgradeRequestModal;

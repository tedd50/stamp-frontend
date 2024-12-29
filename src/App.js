import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";

const StampCard = () => {
  const [stampData, setStampData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user number from URL (e.g., /1, /2, etc.)
  const userNo = window.location.pathname.split("/").pop();

  useEffect(() => {
    const fetchStampData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/stamps/${userNo}`
        );
        if (!response.ok) {
          throw new Error("User not found");
        }
        const data = await response.json();
        setStampData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStampData();
  }, [userNo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  const completedStamps = stampData.stamps.filter(Boolean).length;
  const totalStamps = stampData.stamps.length;
  const progress = (completedStamps / totalStamps) * 100;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 bg-white shadow-lg">
          {/* Period and Header */}
          <div className="text-center mb-6">
            <div className="text-sm text-gray-600 mb-2">
              Year {stampData.period.year} - Quarter {stampData.period.quarter}
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              {stampData.name}
            </h1>
            <p className="text-gray-600">Card No: {stampData.no}</p>
          </div>

          {/* Stamps Grid */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {stampData.stamps.map((isCompleted, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                ) : (
                  <Circle className="w-8 h-8 text-gray-300" />
                )}
                <span className="mt-2 text-sm text-gray-600">
                  Stamp {index + 1}
                </span>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="text-center">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {completedStamps} of {totalStamps} stamps collected (
              {progress.toFixed(1)}%)
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StampCard;

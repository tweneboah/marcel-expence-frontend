import React from "react";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiCheck,
  FiTarget,
  FiCrosshair,
  FiNavigation,
  FiDollarSign,
} from "react-icons/fi";

const steps = [
  {
    id: 1,
    name: "Start Location",
    description: "Enter starting point",
    icon: <FiMapPin className="h-5 w-5" />,
  },
  {
    id: 2,
    name: "Start Details",
    description: "Confirm start location",
    icon: <FiCheck className="h-5 w-5" />,
  },
  {
    id: 3,
    name: "End Location",
    description: "Enter destination",
    icon: <FiTarget className="h-5 w-5" />,
  },
  {
    id: 4,
    name: "End Details",
    description: "Confirm end location",
    icon: <FiCrosshair className="h-5 w-5" />,
  },
  {
    id: 5,
    name: "Distance",
    description: "Calculate route",
    icon: <FiNavigation className="h-5 w-5" />,
  },
  {
    id: 6,
    name: "Expense",
    description: "Enter expense details",
    icon: <FiDollarSign className="h-5 w-5" />,
  },
];

const Stepper = ({ currentStep }) => {
  return (
    <div className="py-4">
      <div className="max-w-7xl mx-auto">
        <nav aria-label="Progress">
          <ol role="list" className="overflow-x-auto flex md:space-x-6 pb-4">
            {steps.map((step) => (
              <motion.li
                key={step.name}
                className="md:flex-1 min-w-[140px] relative"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: step.id * 0.1,
                }}
              >
                <div
                  className={`flex flex-col border-l-0 border-t-4 pb-0 pt-4 ${
                    step.id < currentStep
                      ? "border-[#FCA311]"
                      : step.id === currentStep
                      ? "border-[#14213D]"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center h-8 w-8 rounded-full mr-2 ${
                        step.id < currentStep
                          ? "bg-[#FCA311] text-white"
                          : step.id === currentStep
                          ? "bg-[#14213D] text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step.id < currentStep ? (
                        <FiCheck className="h-5 w-5" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        step.id < currentStep
                          ? "text-[#FCA311]"
                          : step.id === currentStep
                          ? "text-[#14213D]"
                          : "text-gray-500"
                      }`}
                    >
                      Step {step.id}
                    </span>
                  </div>
                  <div className="ml-10">
                    <span
                      className={`text-sm font-medium ${
                        step.id <= currentStep
                          ? "text-[#14213D]"
                          : "text-gray-500"
                      }`}
                    >
                      {step.name}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {step.description}
                    </span>
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default Stepper;

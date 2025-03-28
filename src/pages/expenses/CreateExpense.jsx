import ExpenseForm from "../../components/forms/ExpenseForm";
import Card from "../../components/ui/Card";
import { motion } from "framer-motion";
import { FiPlusCircle, FiDollarSign } from "react-icons/fi";

const CreateExpense = () => {
  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#FCA311]/10 p-3 rounded-full">
            <FiPlusCircle className="h-8 w-8 text-[#FCA311]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#14213D]">
              Create New Expense
            </h1>
            <p className="text-gray-600 mt-1">
              Record your travel expenses with ease
            </p>
          </div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="border border-[#14213D]/10 shadow-lg">
            <ExpenseForm />
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CreateExpense;

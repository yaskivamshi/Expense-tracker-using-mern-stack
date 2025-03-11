
import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaTimes,FaRupeeSign } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import FloatingWelcomeCard from "../components/FloatingWelcomeCard"; 


const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [expenseData, setExpenseData] = useState({
    title: "",
    amount: "",
    category: "Rent",
    transactionType: "Expense",
    date: "",
  });
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        navigate("/login");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err.response?.data || err.message);
      setError("Failed to fetch expenses.");
    }
    setLoading(false);
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setExpenseData(expense);
    setEditMode(true);
    setShowModal(true);
  };

  const handleUpdateExpense = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized. Please log in again.");
        navigate("/login");
        return;
      }

      await axios.put(`http://localhost:5000/api/expenses/edit/${selectedExpense._id}`, expenseData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpenses(expenses.map((exp) => (exp._id === selectedExpense._id ? expenseData : exp)));
      setShowModal(false);
      setEditMode(false);
    } catch (err) {
      console.error("Error updating expense:", err.response?.data || err.message);
      setError("Failed to update expense.");
    }
  };

  const handleAddExpense = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized. Please log in.");
        return;
      }

      const res = await axios.post("http://localhost:5000/api/expenses/add", expenseData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpenses([...expenses, res.data]);
      setShowModal(false);
      setExpenseData({ title: "", amount: "", category: "Rent", transactionType: "Expense", date: "" });
    } catch (err) {
      console.error("Error adding expense:", err.response?.data || err.message);
      alert("Failed to add Transaction Details.");
    }
  };

  // === DELETE FUNCTION ===
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized. Please log in.");
        return;
      }

      await axios.delete(`http://localhost:5000/api/expenses/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpenses(expenses.filter((expense) => expense._id !== id));
    } catch (err) {
      console.error("Error deleting expense:", err.response?.data || err.message);
      alert("Failed to delete expense.");
    }
  };
  // === Filter Expenses Based on Selection ===
  const getFilteredExpenses = () => {
    if (filter === "All") return expenses;
    return expenses.filter((expense) => expense.transactionType === filter);
  };

  // === Calculate Total Based on Filter ===
  const getTotalAmount = () => {
    return getFilteredExpenses().reduce((total, expense) => total + Number(expense.amount), 0);
  };

  return (
    <div className="container mx-auto p-16 relative">
      <h2 className="text-2xl font-bold mb-4">Expense Dashboard</h2>
      {error && <p className="text-red-500">{error}</p>}
            <div className="mb-4 flex justify-between items-center">
        <div>
          <label className="mr-2 font-semibold">Filter by:</label>
          <select
            className="p-2 border rounded"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Expense">Expenses</option>
            <option value="Credit">Income</option>
          </select>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-3 border border-gray-300" style={{ height: "70px" }}>
          <FaRupeeSign className="text-green-600 text-2xl" />
          <div>
            <p className="text-gray-500 text-sm">Total Expenses</p>
            <h2 className="text-2xl font-semibold text-gray-800">₹{getTotalAmount()}</h2>
          </div>
        </div>
      </div>
      <button
        className="fixed bottom-10 right-10 bg-blue-500 text-white p-4 rounded-full shadow-md hover:bg-green-600 transition duration-200"
        onClick={() => { setEditMode(false); setShowModal(true); }}
      >
        <FaPlus  className="text-xl"/> Add Expense
      </button>

      <table className="w-full border-collapse border border-gray-200 shadow-sm rounded-lg">
        <thead className="sticky top-0 bg-gray-300">
          <tr className="text-left">
            <th className="p-3 w-24 border-b text-center">Date</th>
            <th className="p-3 w-24 border-b text-center">Title</th>
            <th className="p-3 w-20 border-b text-center ">Amount</th>
            <th className="p-3 w-20 border-b text-center">Category</th>
            <th className="p-3 w-20 border-b text-center">Type</th>
            <th className="p-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {getFilteredExpenses().map((expense) => (
            <tr key={expense._id} className="text-center hover:bg-gray-100 transition duration-200">
              <td className="p-5 w-23 border ">{new Date(expense.date).toLocaleDateString()}</td>
              <td className="p-5 w-3 border">{expense.title}</td>
              <td className="p-5 w-3 border">₹{expense.amount}</td>
              <td className="p-5 w-3 border">{expense.category}</td>
              <td className="p-5 w-3 border">{expense.transactionType}</td>
              <td className="p-5 border">
                <button className="p-2 text-black bg-transparent !bg-transparent rounded hover:bg-gray-200" onClick={() => handleEdit(expense)}>
                <FaEdit />
                </button>
                <button className="p-2 text-red-500 bg-transparent rounded hover:bg-red-200 ml-2" onClick={() => handleDelete(expense._id)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{editMode ? "Edit Transaction Details" : "Add Transaction Details"}</h3>
              <button onClick={() => setShowModal(false)} className="text-red-500">
                <FaTimes />
              </button>
            </div>
            <label>Title</label>
            <input type="text" className="w-full p-2 border mb-2" placeholder="Title" value={expenseData.title} onChange={(e) => setExpenseData({ ...expenseData, title: e.target.value })} />
            <label>Amount</label>
            <input type="number" className="w-full p-2 border mb-2" placeholder="Amount" value={expenseData.amount} onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })} />
            <label>Category</label>
            <select type="text"className="w-full p-2 border mb-2" value={expenseData.category} onChange={(e) => setExpenseData({ ...expenseData, category: e.target.value })}>
              <option>Rent</option>
              <option>Food</option>
              <option>Entertainment</option>
              <option>Utilities</option>
              <option>Other</option>
            </select>
            <label>Type</label>
            <select className="w-full p-2 border mb-2" value={expenseData.transactionType} onChange={(e) => setExpenseData({ ...expenseData, transactionType: e.target.value })}>
              <option>Expense</option>
              <option>Credit</option>
            </select>
            <label>Date</label>
            <input type="date" className="w-full p-2 border mb-2" value={expenseData.date} onChange={(e) => setExpenseData({ ...expenseData, date: e.target.value })} />
            <button onClick={editMode ? handleUpdateExpense : handleAddExpense} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">{editMode ? "Update" : "Add"}</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard






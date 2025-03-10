
const express = require("express");
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Add Expense
router.post("/add", authMiddleware, async (req, res) => {
  const { title, amount, category, description, transactionType, date } = req.body;
  try {
    const expense = new Expense({
      user: req.user.id,
      title,
      amount,
      category,
      description,
      transactionType,
      date,
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error("Error adding expense:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get All Expenses for a User
router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Edit Expense
router.put("/edit/:id", authMiddleware, async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: "Expense not found" });

    if (expense.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Unauthorized" });

    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(expense);
  } catch (err) {
    console.error("Error updating expense:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete Expense
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: "Expense not found" });

    if (expense.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Unauthorized" });

    await Expense.findByIdAndDelete(req.params.id); // Fix delete issue
    res.json({ msg: "Expense removed successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;


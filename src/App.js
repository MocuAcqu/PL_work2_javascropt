import React, { useState } from 'react';
import { CSVLink } from "react-csv";
import './BudgetApp.css'; // 引入 CSS 檔案

function BudgetApp() {
    const [transactionType, setTransactionType] = useState(''); 
    const [category, setCategory] = useState('');
    const [customCategory, setCustomCategory] = useState('');
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [records, setRecords] = useState([]);
    const [categories, setCategories] = useState(['飲食', '交通', '娛樂']);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]); 
    const [isAdding, setIsAdding] = useState(false); 
    const [warning, setWarning] = useState(''); 

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!category || !name || !amount) {
            setWarning('輸入內容不能有空白！');
            return;
        }

        const finalAmount = transactionType === '支出' ? -Math.abs(amount) : amount;
        const finalCategory = category === '自訂類別' ? customCategory : category;
        const newRecord = { 
            type: transactionType, 
            category: finalCategory, 
            name, 
            amount: finalAmount, 
            date 
        };
        setRecords([...records, newRecord]);

        if (category === '自訂類別' && customCategory && !categories.includes(customCategory)) {
            setCategories([...categories, customCategory]);
        }

        setTransactionType('');
        setCategory('');
        setCustomCategory('');
        setName('');
        setAmount('');
        setDate(new Date().toISOString().split("T")[0]); 
        setIsAdding(false);
        setWarning(''); 
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        if (e.target.value !== '自訂類別') {
            setCustomCategory(''); 
        }
    };

    // 刪除記錄的函數
    const handleDelete = (index) => {
        const updatedRecords = records.filter((_, i) => i !== index);
        setRecords(updatedRecords);
    };

    const totalIncome = records.filter(record => record.type === '收入').reduce((total, record) => total + parseFloat(record.amount), 0);
    const totalExpense = records.filter(record => record.type === '支出').reduce((total, record) => total + parseFloat(record.amount), 0);
    const balance = totalIncome + totalExpense; 

    const sortedRecords = records.sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="container">
            <div className="total-section">
                <h2>總收入: {totalIncome}</h2>
                <h2>總支出: {totalExpense}</h2>
                <h2>結算金額: {balance}</h2>
                <div className="csv-link">
                    <CSVLink data={records} filename="budget_records.csv" className="csv-button">
                        下載CSV
                    </CSVLink>
                </div>
            </div>

            {warning && <div className="warning">{warning}</div>}

            <h1>記帳系統</h1>

            <button className="add-button" onClick={() => setIsAdding(true)}>+</button>

            {isAdding && (
                <div className="input-section">
                    <div>
                        <label>
                            <input 
                                type="radio" 
                                value="收入" 
                                checked={transactionType === '收入'} 
                                onChange={(e) => setTransactionType(e.target.value)} 
                            />
                            收入
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                value="支出" 
                                checked={transactionType === '支出'} 
                                onChange={(e) => setTransactionType(e.target.value)} 
                            />
                            支出
                        </label>
                    </div>

                    {transactionType && (
                        <form onSubmit={handleSubmit} className="form">
                            <select className="category-select" value={category} onChange={handleCategoryChange}>
                                <option value="">選擇類別</option>
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                                <option value="自訂類別">自訂類別</option>
                            </select>

                            {category === '自訂類別' && (
                                <input 
                                    type="text" 
                                    placeholder="自訂類別名稱" 
                                    value={customCategory} 
                                    onChange={(e) => setCustomCategory(e.target.value)} 
                                    className="input-field"
                                />
                            )}

                            <input 
                                type="text" 
                                placeholder="名稱" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                className="input-field"
                            />
                            <input 
                                type="number" 
                                placeholder="金額" 
                                value={amount} 
                                onChange={(e) => setAmount(e.target.value)} 
                                className="input-field"
                            />
                            <input 
                                type="date" 
                                value={date} 
                                onChange={(e) => setDate(e.target.value)} 
                                className="input-field"
                            />
                            <button type="submit" className="submit-button">新增記錄</button>
                        </form>
                    )}
                </div>
            )}

            <div className="records">
                {sortedRecords.map((record, index) => (
                    <div key={index} className={`record-item ${record.type === '收入' ? 'income' : 'expense'}`}>
                        <div className="record-content">
                            <span className="record-date">{record.date}</span>
                            <span className="record-category">{record.category}</span>
                            <span className="record-name">{record.name}</span>
                            <span className="record-amount">{record.amount}</span>
                        </div>
                        <span className="delete-button" onClick={() => handleDelete(index)}>X</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BudgetApp;

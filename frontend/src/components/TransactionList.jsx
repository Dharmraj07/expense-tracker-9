import { useDispatch, useSelector } from "react-redux";
import { getTransactions, deleteTransaction, editTransaction } from "../features/transactionSlice";
import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import AddTransaction from "./AddTransaction";

const TransactionList = () => {
    const dispatch = useDispatch();
    const { transactions, loading, error } = useSelector((state) => state.transactions);

    // State for the edit modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState(null);

    // Fetch transactions when the component mounts
    useEffect(() => {
        dispatch(getTransactions());
    }, [dispatch]);

    // Handle delete transaction
    const handleDelete = (transactionId) => {
        dispatch(deleteTransaction(transactionId));
    };

    // Open edit modal with transaction details
    const handleEdit = (transaction) => {
        setCurrentTransaction(transaction);
        setShowEditModal(true);
    };

    // Close edit modal
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setCurrentTransaction(null);
    };

    // Handle form submission for editing
    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (currentTransaction) {
            dispatch(editTransaction({ transactionId: currentTransaction._id, transactionData: currentTransaction }));
            handleCloseEditModal();
        }
    };

    // Update transaction data in state while typing
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentTransaction({ ...currentTransaction, [name]: value });
    };

    return (
        <div>
            <AddTransaction />
            <h1>Transaction List</h1>
            {loading && <p>Loading transactions...</p>}
            {error && <p>{error}</p>}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Amount</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions && transactions.length > 0 ? (
                        transactions.map((transaction) => (
                            <tr key={transaction._id}>
                                <td>{transaction.title}</td>
                                <td>{transaction.amount}</td>
                                <td>{transaction.type}</td>
                                <td>{transaction.category}</td>
                                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                <td>
                                    <Button variant="warning" onClick={() => handleEdit(transaction)}>
                                        Edit
                                    </Button>
                                    {' '}
                                    <Button variant="danger" onClick={() => handleDelete(transaction._id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">
                                No transactions available
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Edit Modal */}
            {currentTransaction && (
                <Modal show={showEditModal} onHide={handleCloseEditModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Transaction</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleEditSubmit}>
                            <Form.Group className="mb-3" controlId="formTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={currentTransaction.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formAmount">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="amount"
                                    value={currentTransaction.amount}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formType">
                                <Form.Label>Type</Form.Label>
                                <Form.Select
                                    name="type"
                                    value={currentTransaction.type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Income">Income</option>
                                    <option value="Expense">Expense</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formCategory">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="category"
                                    value={currentTransaction.category}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formDate">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="date"
                                    value={new Date(currentTransaction.date).toISOString().split('T')[0]}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Save Changes
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
};

export default TransactionList;

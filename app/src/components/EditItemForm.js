import React, { useState, useEffect, useContext } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { AppContext, update } from '../AppContext';

const EditItemForm = ({ current }) => {
    const [name, setName] = useState('');
    const { dispatch } = useContext(AppContext);

    useEffect(() => {
        setName(current.name);
    }, [current]);

    return (
        <Form
            onSubmit={e => {
                e.preventDefault();
                update({ id: current.id, name }, dispatch);
            }}
        >
            <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter name"
                />
            </Form.Group>
            <Button variant="primary" type="submit">
                Save
            </Button>
        </Form>
    );
};

export default EditItemForm;

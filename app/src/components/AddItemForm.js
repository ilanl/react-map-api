import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const AddItemForm = ({ marker, onAdd }) => {
    const [name, setName] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(null);

    useEffect(() => {
        setButtonDisabled(!marker ? { disabled: true } : null);
    }, [marker]);

    return (
        <Form
            onSubmit={e => {
                e.preventDefault();
                onAdd({ lat: marker.lat, lng: marker.lng, name });
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
            <Button variant="primary" type="submit" {...buttonDisabled}>
                Add
            </Button>
        </Form>
    );
};

export default AddItemForm;

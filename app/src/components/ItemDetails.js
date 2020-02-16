import React from 'react';
import Button from 'react-bootstrap/Button';

export default function ItemDetails({ item, onSelected, onDelete }) {
    return (
        <tr
            className="row-item"
            onClick={() => {
                console.log('click item', item.name);
                onSelected(item);
            }}
            id={item.id}
        >
            <td>{item.name}</td>
            <td>
                {item.latitude}, {item.longitude}
            </td>
            <td>
                <Button
                    onClick={e => {
                        console.log('click to remove', item.id);
                        onDelete(item);
                        e.stopPropagation();
                    }}
                >
                    Remove
                </Button>
            </td>
        </tr>
    );
}

import React from 'react';
import ItemDetails from './ItemDetails';
import Table from 'react-bootstrap/Table';

export default function ItemList({ items, onSelected, onDelete }) {
    return items.length ? (
        <Table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Coordinates</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {items.map(i => (
                    <ItemDetails key={i.id} item={i} onSelected={onSelected} onDelete={onDelete} />
                ))}
            </tbody>
        </Table>
    ) : (
        <div className="empty-list">Nothing to show</div>
    );
}

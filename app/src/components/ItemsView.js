import React, { useContext, useState } from 'react';

import { AppContext, remove, add } from '../AppContext';
import ItemList from './ItemList';
import ItemsMap from './ItemsMap';
import EditItemForm from './EditItemForm';
import AddItemForm from './AddItemForm';

// Bootstap
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function ItemsView() {
    const { items, dispatch } = useContext(AppContext);
    const [selected, setSelected] = useState(null);
    const [tempMarker, setTempMarker] = useState(null);

    const onAdd = ({ name, lat, lng }) => {
        add({ name, latitude: lat, longitude: lng }, dispatch).then(() => {
            setTempMarker(null);
        });
    };

    const onMapClick = marker => {
        const { lat, lng } = marker;
        console.log('received map click', lat, lng);
        setSelected(null);
        setTempMarker({ lat, lng });
    };

    return (
        <Container style={{ paddingTop: '60px' }}>
            <Row style={{ marginTop: '50px' }}>
                <Col xs={4}>
                    <ItemList
                        items={items}
                        onSelected={item => setSelected(item)}
                        onDelete={({ id }) => {
                            remove(id, dispatch).then(() => {
                                if (selected && selected.id === id) {
                                    setSelected(null);
                                }
                            });
                        }}
                    />
                </Col>
                <Col xs={1}></Col>
                <Col xs={7}>
                    <Row>
                        {selected ? (
                            <EditItemForm current={selected} />
                        ) : (
                            <AddItemForm marker={tempMarker} onAdd={onAdd} />
                        )}
                    </Row>
                    <Row>
                        <ItemsMap onMapClick={onMapClick} items={items} />
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

import React from 'react'
import Room from './Room'

export default function RoomList(props) {
    return (
        props.rooms.map(room => {
            return <Room id={room.id} handle={props.handle} key={room.name} airport={room.location} time={room.time} name={room.name} joined={4}/>;
        })
    )
}

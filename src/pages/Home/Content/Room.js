import React from 'react'

export default function Room(props) {
    return (
        <button onClick={(e) => props.handle(e, props.id)} className="room">
            <div className="airport" >
                {props.airport}
            </div>
            <div className="time" >
                {new Date(props.time).toLocaleDateString()}
            </div>
            <div className="name" >
            {props.name}
            </div>
            <div className="joined" >
            {props.joined}/4
            </div>
        </button>
    )
}

import React from 'react'

export default function User(props) {
    return (
        <div className="userBlock">
            <div>
                {props.name}
            </div>
            <div>
                {props.email}
            </div>
        </div>
    )
}

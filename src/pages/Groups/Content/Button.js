import React from 'react'

export default function Button(props) {
    return (
        <>
            <button onClick={() => props.handle()} id="btn">{props.text}</button>
        </>
    )
}

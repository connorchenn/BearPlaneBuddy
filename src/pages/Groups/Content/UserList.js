import React from 'react'
import User from './User'

export default function UserList(props) {
    return (
        props.users.map(user => {
            return <User name={user.displayName} email={user.email}/>;
        })
    )
}

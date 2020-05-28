import React from 'react';
import Navbar from 'react-bootstrap/Navbar';

const NavB = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">
                <img
                    src="https://static.thenounproject.com/png/1853615-200.png"
                    width="40"
                    height="40"
                    className="d-inline-block align-top"
                    alt="icon"
                />
            </Navbar.Brand>
            <Navbar.Brand href="#home">Thomas Jefferson Elementary School</Navbar.Brand>
        </Navbar>
    )
};

export default NavB
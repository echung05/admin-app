import React from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Container';

const Login = () => {
    return (

        <Container>
            <Card bg="light" style={{ margin: "0 auto", width: "20vw", marginTop: "2vh", float: "none" }}>{
                user
                    ? <Card.Header>Hello, {user.displayName}</Card.Header>
                    : <Card.Header>Please sign in.</Card.Header>
            }
                {
                    user
                        ? <Card.Body><Button variant="info" onClick={signOut}>Sign out</Button></Card.Body>
                        : <Card.Body><Button variant="info" onClick={signInWithGoogle}>Sign in with Google</Button></Card.Body>
                }</Card>
        </Container>
    );
}

export default Login
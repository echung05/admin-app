import withFirebaseAuth from 'react-with-firebase-auth'
import Firebase from "firebase";
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';
import Navbar from "react-bootstrap/Navbar"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Accordion from "react-bootstrap/Accordion"

import 'bootswatch/dist/litera/bootstrap.min.css';

import React, { Component } from 'react';
import './App.css';

const firebaseApp = firebase.initializeApp(firebaseConfig);

class App extends Component {
  constructor(props) {
    // Firebase.initializeApp(firebaseConfig);
    super(props);
    this.state = ({
      currStudent: '',
      stuTeacher: '',
      stuClass: '',
      stuDesc: '',
      students: []
    });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const studentsRef = firebase.database().ref('students');
    const student = {
      student: this.state.currStudent,
      teacher: this.state.stuTeacher,
      class: this.state.stuClass,
      desc: this.state.stuDesc
    }
    studentsRef.push(student);
    this.setState({
      currStudent: '',
      stuTeacher: '',
      stuClass: '',
      stuDesc: ''
    });
  }

  componentDidMount() {
    const studentsRef = firebase.database().ref('students');
    studentsRef.on('value', (snapshot) => {
      let students = snapshot.val();
      let newState = [];
      for (let stu in students) {
        newState.push({
          id: stu,
          student: students[stu].student,
          teacher: students[stu].teacher,
          class: students[stu].class,
          desc: students[stu].desc
        });
      }
      this.setState({
        students: newState
      });
    });
  }
  removeStudent(studentId) {
    const stuRef = firebase.database().ref(`/students/${studentId}`);
    stuRef.remove();
  }

  render() {
    const {
      user,
      signOut,
      signInWithGoogle,
    } = this.props;

    return (
      <div className="App">
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
        <Card bg="light" style={{ margin: "0 auto", marginTop: "5vh", width: "30vw", float: "none" }}>
          <Card.Body style={{ marginTop: "3vh", marginBottom: "3vh" }}>
            <section className='add-item'>
              <form onSubmit={this.handleSubmit}>
                <div style={{ marginTop: "1vh" }}>
                  <input type="text" name="currStudent" placeholder="Full Name" onChange={this.handleChange} value={this.state.currStudent} />
                </div>
                <div style={{ marginTop: "1vh" }}>
                  <input type="text" name="stuTeacher" placeholder="Teacher" onChange={this.handleChange} value={this.state.stuTeacher} />
                </div>
                <div style={{ marginTop: "1vh" }}>
                  <input type="text" name="stuClass" placeholder="Class" onChange={this.handleChange} value={this.state.stuClass} />
                </div>
                <div style={{ marginTop: "1vh" }}>
                  <input type="text" name="stuDesc" placeholder="Basic Info" onChange={this.handleChange} value={this.state.stuDesc} />
                </div>
                <div style={{ marginTop: "1vh" }}>
                  <button>Add Student</button>
                </div>
              </form>
            </section>
          </Card.Body>
        </Card>

        <Accordion style={{ margin: "0 auto", marginTop: "5vh", marginBottom: "10vh", width: "30vw", float: "none" }}>
          {this.state.students.map((s) => {
            return (
              <Card key={s.id}>
                <Card.Header text="dark">
                  <Accordion.Toggle as={Button} variant="light" eventKey="0">
                    Name: {s.student}
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body text="dark">
                    <div>Teacher: {s.teacher}</div>
                    <div>Class: {s.class}</div>
                    <div>Information: {s.desc}</div>
                    <Button
                      variant="outline-info"
                    >
                      Edit
                </Button> {' '}
                    <Button
                      variant="outline-danger"
                      onClick={() => this.removeStudent(s.id)}>
                      Delete
                </Button>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            );
          })}
        </Accordion>

      </div>
    );
  }
}

const firebaseAppAuth = firebaseApp.auth();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);
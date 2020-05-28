import withFirebaseAuth from 'react-with-firebase-auth'
import Firebase from "firebase";
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';
import NavB from './NavB'
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
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
      idval: '',
      students: [],
      isSignedIn: false,
      isEditing: false
    });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.isEditing) {
      const studentsRef = firebase.database().ref('students');
      const student = {
        student: this.state.currStudent,
        teacher: this.state.stuTeacher,
        class: this.state.stuClass,
        desc: this.state.stuDesc,
      }
      studentsRef.push(student);
      this.setState({
        currStudent: '',
        stuTeacher: '',
        stuClass: '',
        stuDesc: '',

      });
    } else {
      console.log("update")
      firebase.database().ref().child(`/students/${this.state.idval}`)
        .update({
          student: this.state.currStudent,
          teacher: this.state.stuTeacher,
          class: this.state.stuClass,
          desc: this.state.stuDesc,
        });
      this.setState({
        currStudent: '',
        stuTeacher: '',
        stuClass: '',
        stuDesc: '',
        isEditing: false
      });
    }
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
          desc: students[stu].desc,
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

  updateStudent(s) {
    console.log(s.id);
    this.setState({
      isEditing: true,
      currStudent: s.student,
      stuTeacher: s.teacher,
      stuClass: s.class,
      stuDesc: s.desc,
      idval: s.id
    });
  }

  render() {
    const {
      user,
      signOut,
      signInWithGoogle,
    } = this.props;

    const editing = this.state.isEditing;
    let button;
    if (editing) {
      button = <button>Update Student</button>
    } else {
      button = <button>Add Student</button>
    }

    return (
      <div className="App">
        <NavB />
        <Row style={{ marginTop: "10vh" }}>
          <Col>
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

            <Card bg="light" style={{ margin: "0 auto", marginTop: "5vh", width: "20vw", float: "none" }}>
              {user ?
                (<Card.Body style={{ marginTop: "3vh", marginBottom: "3vh" }}>
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
                        {button}
                      </div>
                    </form>
                  </section>
                </Card.Body>)
                : <Card.Body> Sign in to add, edit, and delete students from the roster. </Card.Body>
              }
            </Card>
          </Col>
          <Col>
            <Accordion style={{ margin: "0 auto", marginBottom: "10vh", width: "20vw", float: "none" }}>
              <Card.Header className="bg-secondary">TJES Roster </Card.Header>
              {this.state.students.map((s) => {
                return (
                  <Card key={s.id}>
                    <Card.Header text="dark">
                      <Accordion.Toggle as={Button} variant="light" eventKey={s.id}>
                        Name: {s.student}
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={s.id}>
                      <Card.Body text="dark">
                        <div>Teacher: {s.teacher}</div>
                        <div>Class: {s.class}</div>
                        <div>Information: {s.desc}</div>
                        <Button
                          variant="outline-info"
                          onClick={() => this.updateStudent(s)}
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
          </Col>
        </Row>
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
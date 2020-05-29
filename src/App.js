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
import ButtonGroup from "react-bootstrap/ButtonGroup"
import React, { Component } from 'react';
import './App.css';

const firebaseApp = firebase.initializeApp(firebaseConfig);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      currStudent: '',
      stuDesc: '',
      stuClass: '',
      idval: '',
      students: [],

      currTeacher: '',
      tClass: '',
      teachers: [],

      isSignedIn: false,
      isEditingS: false,
      isEditingT: false,

      dispClass: "2",
    });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.isEditingS) {
      const studentsRef = firebase.database().ref('students');
      const student = {
        student: this.state.currStudent,
        class: this.state.stuClass,
        desc: this.state.stuDesc,
      }
      studentsRef.push(student);
      this.setState({
        currStudent: '',
        stuClass: '',
        stuDesc: '',

      });
    } else {
      console.log("update")
      firebase.database().ref().child(`/students/${this.state.idval}`)
        .update({
          student: this.state.currStudent,
          class: this.state.stuClass,
          desc: this.state.stuDesc,
        });
      this.setState({
        currStudent: '',
        stuDesc: '',
        isEditingS: false
      });
    }
  }

  handleSave = (e) => {
    e.preventDefault();
    if (!this.state.isEditingT) {
      const teacherRef = firebase.database().ref('teachers');
      const teacher = {
        teacher: this.state.currTeacher,
        class: this.state.tClass,
      }
      teacherRef.push(teacher);
      this.setState({
        currTeacher: '',
        tClass: '',
      });
    } else {
      console.log("update")
      firebase.database().ref().child(`/teachers/${this.state.idval}`)
        .update({
          teacher: this.state.currTeacher,
          class: this.state.tClass,
        });
      this.setState({
        currTeacher: '',
        tClass: '',
        isEditingT: false
      });
    }
  }

  componentDidMount() {
    const studentsRef = firebase.database().ref('students');
    const teachersRef = firebase.database().ref('teachers');
    studentsRef.on('value', (snapshot) => {
      let students = snapshot.val();
      let newState = [];
      for (let stu in students) {
        newState.push({
          id: stu,
          student: students[stu].student,
          class: students[stu].class,
          desc: students[stu].desc,
        });
      }
      this.setState({
        students: newState
      });
    });
    teachersRef.on('value', (snapshot) => {
      let teachers = snapshot.val();
      let newTState = [];
      for (let t in teachers) {
        newTState.push({
          id: t,
          teacher: teachers[t].teacher,
          class: teachers[t].class,
        });
      }
      this.setState({
        teachers: newTState
      });
    });
  }
  removeStudent(studentId) {
    const stuRef = firebase.database().ref(`/students/${studentId}`);
    stuRef.remove();
  }

  updateStudent(s) {
    this.setState({
      isEditingS: true,
      currStudent: s.student,
      stuClass: s.class,
      stuDesc: s.desc,
      idval: s.id
    });
  }

  updateTeacher(t) {
    this.setState({
      isEditingT: true,
      currTeacher: t.teacher,
      tClass: t.class,
      idval: t.id
    });
  }

  render() {
    const {
      user,
      signOut,
      signInWithGoogle,
    } = this.props;

    const editingS = this.state.isEditingS;
    let button;
    if (editingS) {
      button = <button>Update Student</button>
    } else {
      button = <button>Add Student</button>
    }

    return (
      <div className="App">
        <NavB />
        <Row style={{ marginTop: "3vh" }}>
          <Col>
            <Container>
              <Card bg="light" style={{ margin: "0 auto", width: "20vw", float: "none" }}>{
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
            <Card bg="light" style={{ margin: "0 auto", marginTop: "3vh", width: "20vw", float: "none" }}>
              <Card.Header>Student</Card.Header>
              {user ?
                (<Card.Body style={{ marginTop: "1vh", marginBottom: "3vh" }}>
                  <section className='add-item'>
                    <form onSubmit={this.handleSubmit}>
                      <div style={{ marginTop: "1vh" }}>
                        <input type="text" name="currStudent" placeholder="Student Name" onChange={this.handleChange} value={this.state.currStudent} />
                      </div>
                      <div style={{ marginTop: "1vh" }}>
                        <label> Class Number: {' '}
                          <select name="stuClass" onChange={this.handleChange} value={this.state.stuClass} >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                          </select>
                        </label>
                      </div>
                      <div style={{ marginTop: "1vh" }}>
                        <input type="text" name="stuDesc" placeholder="Basic Info" onChange={this.handleChange} value={this.state.stuDesc} style={{ marginTop: "1vh" }} />
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
            <Card bg="light" style={{ margin: "0 auto", marginTop: "3vh", marginBottom: "3vh", width: "20vw", float: "none" }}>
              <Card.Header>Teacher</Card.Header>
              {user ?
                (<Card.Body style={{ marginTop: "1vh", marginBottom: "3vh" }}>
                  <section className='add-item'>
                    <form onSubmit={this.handleSave}>
                      <div style={{ marginTop: "1vh" }}>
                        <div style={{ marginTop: "1vh" }}>
                          <input type="text" name="currTeacher" placeholder="Teacher Last Name" onChange={this.handleChange} value={this.state.currTeacher} />
                        </div>
                      </div>
                      <div>
                        <label> Class Number: {' '}
                          <select name="tClass" onChange={this.handleChange} value={this.state.tClass} style={{ marginTop: "1vh" }} >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                          </select>
                        </label>
                      </div>
                      <div style={{ marginTop: "1vh" }}>
                        <button>Save</button>
                      </div>
                    </form>
                  </section>
                </Card.Body>)
                : <Card.Body>Sign in to reassign classes to teachers.</Card.Body>
              }
            </Card>
          </Col>
          <Col>
            {user ?
              (<Accordion style={{ margin: "0 auto", marginBottom: "10vh", width: "20vw", float: "none" }}>
                <Card.Header className="bg-secondary">Student Roster </Card.Header>
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
                          <div>About: {s.desc}</div>
                          <div>Class: {s.class}</div>
                          <Button
                            variant="outline-info"
                            onClick={() => this.updateStudent(s)}>
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
              </Accordion>)
              : <Card style={{ margin: "0 auto", height: "10vh", width: "20vw", float: "none" }}>
                <Card.Body>Log in to view student roster.</Card.Body>
              </Card>}
          </Col>
          <Col>
            {user ?
              (<Accordion style={{ margin: "0 auto", marginBottom: "10vh", width: "20vw", float: "none" }}>
                <Card.Header className="bg-secondary">Teacher List </Card.Header>
                {this.state.teachers.map((t) => {
                  return (
                    <Card key={t.id}>
                      <Card.Header text="dark">
                        <Accordion.Toggle as={Button} variant="light" eventKey={t.id}>
                          Name: {t.teacher}
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey={t.id}>
                        <Card.Body text="dark">
                          <div>Class: {t.class}</div>
                          <Button
                            variant="outline-info"
                            onClick={() => this.updateTeacher(t)}>
                            Edit
                          </Button>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  );
                })}
              </Accordion>)
              : <Card style={{ margin: "0 auto", height: "10vh", width: "20vw", float: "none" }}>
                <Card.Body>Log in to view teachers.</Card.Body>
              </Card>}
          </Col>
          <Col>
            {user ?
              (<Card style={{ width: "20vw" }}>
                <Card.Header className="bg-secondary"> Select a class:
                    <div>
                    <Button variant="light" onClick={() => this.setState({ dispClass: "1" })}>1</Button> {' '}
                    <Button variant="light" onClick={() => this.setState({ dispClass: "2" })}>2</Button> {' '}
                    <Button variant="light" onClick={() => this.setState({ dispClass: "3" })}>3</Button>
                  </div>
                </Card.Header>
                {this.state.teachers.map((t) => {
                  return (
                    <div>
                      {t.class === this.state.dispClass ?
                        <Card bg="info" text="light"> Teacher: {t.teacher}</Card>
                        : ""
                      }
                    </div>
                  );
                })}
                {this.state.students.map((s) => {
                  return (
                    <div>
                      {s.class === this.state.dispClass ?
                        <Card> {s.student}</Card>
                        : ""
                      }
                    </div>
                  );
                })}
              </Card>)
              : <Card style={{ margin: "0 auto", height: "10vh", width: "20vw", float: "none" }}>
                <Card.Body>Log in to view classes.</Card.Body>
              </Card>}
          </Col>
        </Row>

      </div >
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
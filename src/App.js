import React, { Component } from "react";
import MIDISounds from "midi-sounds-react";
import "./styles.css";
// import Note from "./components/note";
import {
  Button,
  Content,
  TextInput,
  Form,
  Grid,
  Row,
  Column,
  ComposedModal,
  ModalHeader,
  ModalBody
} from "carbon-components-react";
import MusicHeader from "./components/MusicHeader";
import "./App.scss";

class App extends Component {
  timeHolder = [];
  intervalId = 0;
  defaultset = "bdbdc   edced   dfdfedc fedcb b ";
  numberset = [];
  container = "";
  counter = 0;
  noteMap = {
    a1: "W",
    b1: "X",
    c1: "Y",
    d1: "Z",
    e1: "[",
    f1: "\\",
    g1: "]",
    a2: "g",
    b2: "h",
    c2: "i",
    d2: "j",
    e2: "k",
    f2: "l",
    g2: "m",
    a4: "w",
    b4: "x",
    c4: "y",
    d4: "z",
    e4: "{",
    f4: "|",
    g4: "}"
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  componentDidMount() {
    this.container = document.getElementById("container");
    this.initApp();
  }

  initApp() {
    this.createPositions();
    this.createChordOpening();
    [...this.defaultset].forEach(this.createElements, this);
    this.createCholdClosing();
  }

  createCholdClosing() {
    let closing = document.createElement("span");
    closing.className = "notes";
    closing.innerHTML = ":=.<div></div>";
    this.container.appendChild(closing);
  }
  createChordOpening() {
    let opening = document.createElement("span");
    opening.innerHTML = "'&=©=4=";
    opening.className = "notes";
    this.container.appendChild(opening);
  }

  createPositions() {
    let positionflagged = 0;
    for (let i = 0; i < this.defaultset.length; i++) {
      if (this.defaultset[i] !== " ") {
        this.numberset[i] = 1;
      } else {
        this.numberset[i] = 0;
      }

      if (this.defaultset[i] !== " " && this.defaultset[i + 1] === " ") {
        positionflagged = i;
        this.numberset[positionflagged] = 1;
      }
      if (this.defaultset[i] === " ") {
        this.numberset[positionflagged]++;
      }
    }
  }

  createElements(item, index) {
    let divider = document.createElement("span");
    let replacer = "=";
    divider.className = "notes";

    if (index % 4 === 0 && index !== 0) {
      let divider = document.createElement("span");
      divider.className = "notes";
      divider.innerHTML = "!=";
      this.container.appendChild(divider);
    }
    if (item !== " ") {
      replacer = this.noteMap[item + this.numberset[index]];
      divider.id = "item" + this.counter;
      divider.innerHTML = replacer;
    } else {
      divider.id = "item" + this.counter;
      divider.innerHTML = replacer;
    }
    this.counter++;
    this.container.appendChild(divider);
  }

  processGroup(item, index, sets_length) {
    let when = this.midiSounds.contextTime();
    const instrument = 773;
    const pitch = 2;
    let b = 0.12;
    let notes = {
      a: [56 + pitch],
      as: [57 + pitch],
      b: [58 + pitch],
      bs: [59 + pitch],
      c: [60 + pitch],
      cs: [61 + pitch],
      d: [62 + pitch],
      ds: [63 + pitch],
      e: [64 + pitch],
      es: [65 + pitch],
      f: [66 + pitch],
      fs: [67 + pitch],
      g: [68 + pitch],
      gs: [69 + pitch]
    };

    if (item !== " ") {
      this.midiSounds.playChordAt(
        when + b * (5 * index),
        instrument,
        notes[item],
        0.5 * sets_length
      );
    }
  }
  playTestInstrument() {
    this.stopTestInstrument();

    let counter = 1;
    let sets = this.defaultset.split("");

    sets.forEach(function (item, index) {
      this.processGroup(item, index, this.numberset[index]);
    }, this);

    document.getElementById("item0").className += " noteFlash";
    this.intervalId = setInterval(function () {
      if (document.getElementById("item" + counter) == null) {
        clearInterval(this);
      } else {
        document.getElementById("item" + counter).className += " noteFlash";
        counter++;
      }
    }, 600);
  }

  stopTestInstrument() {
    this.midiSounds.stopPlayLoop();
    clearInterval(this.intervalId);
    let noteFlashItems = [...document.getElementsByClassName("noteFlash")];
    noteFlashItems.forEach(function (item) {
      item.classList.remove("noteFlash");
    });
  }

  resetDefault() {
    this.resetApp();
    this.defaultset = "bdbdc   edced   dfdfedc fedcb b ";
    document.getElementsByClassName("landing-page__heading")[0].innerHTML =
      "#23 March Steps";
    this.initApp();
  }
  resetApp() {
    this.stopTestInstrument();
    this.container.innerHTML = "";
    this.counter = 0;
    document.getElementsByClassName("landing-page__heading")[0].innerHTML = "";
  }

  updateCords() {
    console.log("Requested to update cords");
    if (document.getElementById("fullNotes").validity.patternMismatch) {
      document.getElementById("fullNotes").setAttribute("data-invalid", "true");
    }
    this.stopTestInstrument();
    this.resetApp();
    let newNotes = document.getElementById("fullNotes").value;
    this.defaultset = newNotes;
    this.initApp();
  }
  render() {
    return (
      <div className="App">
        <MusicHeader />
        <Content>
          <ComposedModal
            size="md"
            open={this.state.open}
            onClose={() => this.setState({ open: false })}
          >
            <ModalHeader>Create a new songs</ModalHeader>
            <ModalBody>
              <Form>
                <div class="bx--row">
                  <div class="bx--col-lg-13 bx--col-md-6 bx--col-sm-2">
                    <div class="outside">
                      <div class="inside">
                        <TextInput
                          helperText="Letters a to g and spaces allowed"
                          id="fullNotes"
                          invalidText="only a to g and spaces allowed."
                          placeholder="bdbdc   edced   dfdfedc fedcb b "
                          pattern="[a-g ]+"
                          light
                        />
                      </div>
                    </div>
                  </div>
                  <div class="bx--col-lg-3 bx--col-md-2 bx--col-sm-2">
                    <div class="outside">
                      <div class="inside">
                        <Button
                          onClick={this.updateCords.bind(this)}
                          bg="brand800"
                          rounded="brandRadius"
                          shadow="4"
                          kind="secondary"
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            </ModalBody>
          </ComposedModal>

          <Grid>
            <Row>
              <Column sm={4} md={8} lg={16}>
                <h1 className="landing-page__heading">#23 March Steps</h1>
              </Column>
              <Column sm={4} md={8} lg={16}>
                <h3 className="landing-page__subheading">Flute</h3>
              </Column>
              <Column sm={4} md={8} lg={16}>
                <div id="container"></div>
              </Column>
            </Row>

            <Row>
              <Column>
                <Button
                  onClick={this.playTestInstrument.bind(this)}
                  bg="brand800"
                  rounded="brandRadius"
                  shadow="4"
                  className="landing-page__controler"
                >
                  Play
                </Button>

                <Button
                  onClick={this.stopTestInstrument.bind(this)}
                  bg="brand800"
                  rounded="brandRadius"
                  shadow="4"
                  kind="danger"
                >
                  Stop
                </Button>

                <Button
                  onClick={this.resetDefault.bind(this)}
                  bg="brand800"
                  rounded="brandRadius"
                  shadow="4"
                  className="landing-page__controler"
                  kind="tertiary"
                >
                  Reset
                </Button>

                <Button
                  kind="primary"
                  onClick={() => this.setState({ open: true })}
                >
                  New
                </Button>
              </Column>
            </Row>
          </Grid>
        </Content>

        <MIDISounds
          style={{ display: "none" }}
          ref={(ref) => (this.midiSounds = ref)}
          appElementName="root"
          instruments={[773]}
        />
      </div>
    );
  }
}

export default App;

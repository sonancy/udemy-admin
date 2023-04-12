import React, { Component } from "react";
import api from "../../apis/api";
import base from "../../apis/points";
import * as _ from "lodash";
import ReactPlayer from 'react-player';
import { Layout,Collapse, List } from 'antd';
import Aside from "../../components/Aside";
const { Sider, Content } = Layout;
const { Panel } = Collapse;

function callback(key) {
  console.log(key);
}

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

class SectionsT extends Component {
  state = {
    lectures: [],
    currentLecture: '',
    loading: false,
  };

  onLectureClick = currentLecture => {
    this.setState({currentLecture})
  }

  async componentDidMount() {
    this.fetchLectures();
  }

  fetchLectures = async () => {
    try {
      this.setState({ loading: true });
      const response = await api.get(base.lectures);
      const lectures = _.get(response, "data.data.lectures").map((lecture) => ({
        ...lecture,
        key: lecture.id,
      }));
      this.setState({ loading: false, lectures });
    } catch (error) {}
  };

  render() {
    return (
      <div className="course-lesson">
            <div className="course-lesson__body">
                <div className="course-lesson__body--video-container">
                  <ReactPlayer
                    url={this.state.currentLecture}
                    controls="true"
                  />
                </div>
            </div>
            <Aside lectures={this.state.lectures} onLectureClick={this.onLectureClick}/>
        </div>
    );
  }
}

export default SectionsT;

import React, { Component } from "react";
import api from "../../api/axios";
import ReactPlayer from "react-player";
import Aside from "../../components/Aside";
import { Button as Btn, Modal, Form, Input } from "antd";
import { Button } from "reactstrap";
import { toast } from "react-toastify";
import decoder from "decode-html";
import { DownloadOutlined } from "@ant-design/icons";
import * as _ from "lodash";
import history from "../../utils/history";

class CourseView extends Component {
  state = {
    courseId: this.props.match.params.id,
    loading: false,
    course: {},
    sections: [],
    currentLecture: "",
    currentLecutreId: null,
    noLectures: false,
    currentLectureObj: {},
    isVideo: false,
    isDocument: false,
    resources: [],
    visible: false,
    reason: "",
  };

  onLectureClick = (
    currentLecture,
    currentLecutreId,
    lecture,
    lectureType,
    resources
  ) => {
    if (lectureType === "video") {
      this.setState({
        currentLecture,
        currentLecutreId,
        currentLectureObj: lecture,
        isVideo: true,
        isDocument: false,
        resources: resources,
      });
    } else {
      this.setState({
        currentLecture,
        currentLecutreId,
        currentLectureObj: lecture,
        isVideo: false,
        isDocument: true,
        resources: resources,
      });
    }
  };

  async componentDidMount() {
    this._isMounted = true;
    this.setState({ loading: true });
    const response = await api.get(`/admin/courses/${this.state.courseId}`);

    if (response) {
      if (response.status === 200) {
        const course = await response.data.data.course;
        const sections = await response.data.data.course.sections;
        const lectures = await response.data.data.course.sections.map(
          (section) => section.lectures
        );
        if (lectures.length > 0) {
          if (lectures[0][0].lecutreType === "video") {
            const currentLecture = lectures[0][0].source[0].url;
            const currentLecutreId = lectures[0][0].id;
            const currentLectureObj = lectures[0][0];
            if (this._isMounted) {
              this.setState({
                course,
                sections,
                lectures,
                currentLecture,
                currentLecutreId,
                currentLectureObj,
                isDocument: false,
                isVideo: true,
                resources: lectures[0][0].resources,
              });
            }
          } else {
            const currentLecture = lectures[0][0].documentContent;
            const currentLecutreId = lectures[0][0].id;
            const currentLectureObj = lectures[0][0];
            if (this._isMounted) {
              this.setState({
                course,
                sections,
                lectures,
                currentLecture,
                currentLecutreId,
                currentLectureObj,
                isDocument: true,
                isVideo: false,
                resources: lectures[0][0].resources,
              });
            }
          }
        } else {
          this.setState({ noLectures: true });
        }
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onClickApprove = async () => {
    try {
      const response = await api.put(
        `/admin/courses/${_.get(this.state, "courseId", "")}`,
        {
          status: "published",
        }
      );
      if (response.data.status === "success") {
        toast.success("course published success!");
      } else {
        console.log("Failed to publish the course!");
      }
      history.push(`/courses/${this.state.courseId}`);
    } catch (err) {
      console.log("err===", err);
    }
  };

  onClickReject = async (reason) => {
    try {
      const response = await api.put(
        `/admin/courses/${_.get(this.state, "courseId", "")}`,
        {
          status: "rejected",
          rejectReason: reason,
        }
      );
      if (response.data.status === "success") {
        toast.success("course rejected success!");
      } else {
        console.log("Failed to publish the course!");
      }
      this.toggleModal();
      history.push(`/courses/${this.state.courseId}`);
    } catch (err) {
      console.log("err===", err);
    }
  };

  onPublish = async (id) => {
    const response = await api.put(`/admin/lectures/${id}`, {
      status: "published",
    });
    toast.success("lecture published successfully!");
  };

  onApprove = async (id) => {
    const response = await api.put(`/admin/lectures/${id}`, {
      status: "approved",
    });
    toast.success("lecture approved successfully!");
  };

  onDraft = async (id) => {
    const response = await api.put(`/admin/lectures/${id}`, {
      status: "draft",
    });
    toast.success("lecture drafted successfully!");
  };
  onReject = async (id) => {
    const response = await api.put(`/admin/lectures/${id}`, {
      status: "rejected",
    });
    toast.success("lecture rejected successfully!");
  };

  toggleModal = () => {
    this.setState({ visible: !this.state.visible });
  };

  render() {
    const { isPlaying, volume } = this.state;
    return (
      <div className="course-lesson">
        {this.state.course.title && (
          <div
            className="card"
            style={{
              width: "70%",
              padding: "40px",
              boxShadow: "0px 2px 4px rgba(0,0,0,0.4)",
            }}
          >
            <h3>Course Action ~ {this.state.course.title}</h3>
            <hr />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button
                color="primary"
                onClick={this.onClickApprove}
                disabled={this.state.course.status === "published"}
              >
                Publish
              </Button>
              <Button
                color="danger"
                onClick={this.toggleModal}
                disabled={this.state.course.status === "rejected"}
              >
                Reject
              </Button>
            </div>
          </div>
        )}

        {this.state.visible && (
          <Modal
            title="Reject Reason"
            visible={this.state.visible}
            onCancel={this.toggleModal}
            footer={[]}
          >
            <Form
              name="basic"
              onFinish={() => {
                this.onClickReject(this.state.reason);
              }}
            >
              <Form.Item
                label="Reject Reason"
                name="rejectReason"
                rules={[{ required: true, message: "Please input reason!" }]}
              >
                <Input
                  onChange={(e) => this.setState({ reason: e.target.value })}
                />
              </Form.Item>

              <Form.Item>
                <Btn type="primary" htmlType="submit">
                  Submit
                </Btn>
              </Form.Item>
            </Form>
          </Modal>
        )}

        <div className="course-lesson__body">
          <div className="course-lesson__body--video-container">
            {this.state.noLectures && (
              <h1 className="text-center">
                No Lectures Created In This course
              </h1>
            )}
            {this.state.currentLecture &&
              this.state.isVideo &&
              !this.state.isDocument && (
                <>
                  <ReactPlayer
                    url={this.state.currentLecture}
                    controls="true"
                  />
                </>
              )}

            {this.state.currentLecture &&
              this.state.isDocument &&
              !this.state.isVideo && (
                <>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: decoder(this.state.currentLecture),
                    }}
                  ></div>
                </>
              )}
          </div>
          <div className="text-center">
            {this.state.currentLectureObj && !this.state.noLectures && (
              <div className="lecture-controller-cst">
                <h1>{this.state.currentLectureObj.title}</h1>
                <p>Lecture Status: {this.state.currentLectureObj.status}</p>
                <ul className="lectures-controll">
                  <li>
                    <Button
                      color="success"
                      onClick={() => {
                        this.onPublish(this.state.currentLectureObj.id);
                        const currentLecture = this.state.currentLectureObj;
                        currentLecture.status = "published";

                        this.setState({ currentLectureObj: currentLecture });
                      }}
                      disabled={
                        this.state.currentLectureObj.status === "published"
                      }
                    >
                      Publish
                    </Button>
                  </li>

                  <li>
                    <Button
                      color="danger"
                      onClick={() => {
                        this.onReject(this.state.currentLectureObj.id);
                        const currentLecture = this.state.currentLectureObj;
                        currentLecture.status = "rejected";
                        this.setState({ currentLectureObj: currentLecture });
                      }}
                      disabled={
                        this.state.currentLectureObj.status === "rejected"
                      }
                    >
                      Reject
                    </Button>
                  </li>
                </ul>
              </div>
            )}

            {this.state.resources.length > 0 && (
              <>
                <h4>Attached Resources</h4>
                {this.state.resources.map((resource) => {
                  return (
                    <Btn
                      href={resource.link}
                      type="primary"
                      icon={<DownloadOutlined />}
                    >
                      {resource.name}
                    </Btn>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {this.state.course && (
          <Aside
            name={this.state.course.title}
            sections={this.state.sections}
            onLectureClick={this.onLectureClick}
            activeLectureId={this.state.currentLecutreId}
          />
        )}
      </div>
    );
  }
}

export default CourseView;

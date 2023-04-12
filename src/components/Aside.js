import React from "react";
import {
  PlaySquareOutlined,
  HomeOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const Aside = ({ name, sections, onLectureClick, activeLectureId }) => {
  return (
    <div className="aside">
      <div className="aside__header">
        <h1>{name}</h1>
      </div>
      <div className="aside__body">
        <ul className="aside__menu">
          {sections.map((section) => (
            <li key={section.id} className="section">
              <div className="section__tile">
                <font>{section.title}</font>
              </div>
              <ul className="aside__submenu">
                {section.lectures.map((lecture) => (
                  <li
                    key={lecture.id}
                    className={`aside__submenu--item ${
                      activeLectureId.toString() === lecture.id.toString()
                        ? "lecture__active"
                        : ""
                    }`}
                  >
                    <div className="aside__submenu--item-title">
                      <PlaySquareOutlined />
                      <a
                        onClick={() => {
                          console.log("lecture===", lecture);
                          onLectureClick(
                            lecture.lecutreType === "video"
                              ? lecture.source.map((s) => s.url)
                              : lecture.documentContent,
                            lecture.id,
                            lecture,
                            lecture.lecutreType === "video"
                              ? "video"
                              : "document",
                            lecture.resources
                          );
                        }}
                      >
                        {lecture.title}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Aside;

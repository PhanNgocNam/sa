import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import React from "react";
import { FaCircleXmark, FaCircleCheck } from "react-icons/fa6";
import { aws } from "../../utils/server.config";

function Curriculum() {
    let location = useLocation();
    const [curriculumData, setCurriculumData] = useState([]);
    useEffect(() => {
        let getCurriculumById = async () => {
            let datas = await axios.get(`${aws.url}/curricular/${1}/${1}`, {
                auth: JSON.parse(localStorage.getItem("crudentials")),
            });
            datas.data.sort((a, b) => a.semester - b.semester);
            console.log(datas.data);
            setCurriculumData(datas.data);
        };
        getCurriculumById();
    }, [location.state]);

    return (
        <div className="curriculum">
            <h3>Thông tin chương trình khung</h3>
            <div className="curriculum-table">
                <table>
                    <thead>
                        <tr>
                            <th>Mã môn học</th>
                            <th>Tên môn học</th>
                            <th>Mã học phần</th>
                            <th>Học phần tiên quyết</th>
                            <th>Số tín chỉ</th>
                            <th>Số tiết LT</th>
                            <th>Số tiết TH</th>
                            <th>Đạt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {curriculumData.map((item, index) => {
                            const isNewSemester =
                                index === 0 ||
                                item.semester !==
                                    curriculumData[index - 1].semester;

                            return (
                                <React.Fragment key={index}>
                                    {isNewSemester && (
                                        <tr>
                                            <td
                                                colSpan="8"
                                                style={{
                                                    textAlign: "center",
                                                    backgroundColor:
                                                        "rgb(37 173 172)",
                                                    color: "#fff",
                                                }}
                                            >
                                                HỌC KÌ {item.semester}
                                            </td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.courseCode}</td>
                                        <td>{item.hasPrerequisite}</td>
                                        <td>{item.credits}</td>
                                        <td>{item.number_of_theory_classes}</td>
                                        <td>
                                            {item.number_of_practice_classes}
                                        </td>
                                        <td>
                                            {item.result !== "null" ? (
                                                item.result === "Đạt" ? (
                                                    <FaCircleCheck
                                                        style={{
                                                            color: "green",
                                                        }}
                                                    />
                                                ) : (
                                                    <FaCircleXmark
                                                        style={{ color: "red" }}
                                                    />
                                                )
                                            ) : (
                                                ""
                                            )}
                                        </td>
                                    </tr>
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Curriculum;

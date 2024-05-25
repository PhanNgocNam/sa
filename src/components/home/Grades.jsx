import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import React from "react";
import { FaCircleXmark, FaCircleCheck } from "react-icons/fa6";
import { aws } from "../../utils/server.config";

function Grades() {
    const crudentials = JSON.parse(localStorage.getItem("crudentials"));
    let location = useLocation();
    console.log(crudentials, "Grades");
    const [gradesData, setGradesData] = useState([]);
    useEffect(() => {
        let getGradesById = async () => {
            let datas = await axios.get(
                `${aws.url}/grades/${location.state.studentId}`,
                {
                    auth: JSON.parse(localStorage.getItem("crudentials")),
                }
            );
            datas.data.sort((a, b) => a.semester - b.semester);
            setGradesData(datas.data);
            console.log(datas.data, "Grades");
        };
        getGradesById();
    }, [location.state]);
    return (
        <div className="grades">
            <h3>KẾT QUẢ HỌC TẬP</h3>
            <div className="curriculum-table">
                <table>
                    <thead>
                        <tr>
                            <th rowspan="2">Mã môn học</th>
                            <th rowspan="2">Tên môn học</th>
                            <th rowspan="2">Số tín chỉ</th>
                            <th colspan="3">Lý thuyết</th>
                            <th colspan="3">Thực hành</th>
                            <th rowspan="2">Giữa kì</th>
                            <th rowspan="2">Cuối kì</th>
                            <th rowspan="2">Điểm tổng kết</th>
                            <th rowspan="2">Thang điểm 4</th>
                            <th rowspan="2">Điểm chữ</th>
                            <th rowspan="2">Xếp loại</th>
                            <th rowspan="2">Đạt</th>
                        </tr>
                        <tr>
                            <th>1</th>
                            <th>2</th>
                            <th>3</th>
                            <th>1</th>
                            <th>2</th>
                            <th>3</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gradesData.map((item, index) => {
                            const isNewSemester =
                                index === 0 ||
                                item.semester !==
                                    gradesData[index - 1].semester;
                            const averageScore = (
                                ((parseInt(item.theoryGrades1) +
                                    parseInt(item.theoryGrades2) +
                                    parseInt(item.theoryGrades3)) /
                                    3 +
                                    ((parseInt(item.practiceGrades1) +
                                        parseInt(item.practiceGrades2) +
                                        parseInt(item.practiceGrades3)) *
                                        20) /
                                        3 +
                                    parseInt(item.midtermGrades) * 30 +
                                    parseInt(item.finalGrades) * 50) /
                                100
                            ).toFixed(2);
                            var letterGrade = "";
                            var fourGrade = 0;
                            var classi = "";
                            if (averageScore >= 9.0) {
                                letterGrade = "A+";
                                fourGrade = 4.0;
                                classi = "Xuất sắc";
                            } else if (averageScore >= 8.5) {
                                letterGrade = "A";
                                classi = "Giỏi";
                                fourGrade = 3.8;
                            } else if (averageScore >= 8.0) {
                                fourGrade = 3.5;
                                classi = "Khá";
                                letterGrade = "B+";
                            } else if (averageScore >= 7.0) {
                                fourGrade = 3.0;
                                classi = "Khá";
                                letterGrade = "B";
                            } else if (averageScore >= 6.0) {
                                classi = "Trung bình";
                                fourGrade = 2.5;
                                letterGrade = "C+";
                            } else if (averageScore >= 5.5) {
                                fourGrade = 2.0;
                                classi = "Trung bình";
                                letterGrade = "C";
                            } else if (averageScore >= 5.0) {
                                classi = "Trung bình yếu";
                                fourGrade = 1.5;
                                letterGrade = "D+";
                            } else if (averageScore >= 4.0) {
                                fourGrade = 1.0;
                                classi = "Trung bình yếu";
                                letterGrade = "D";
                            } else {
                                classi = "Kém";
                                fourGrade = 0.0;
                                letterGrade = "F";
                            }
                            return (
                                <React.Fragment key={index}>
                                    {isNewSemester && (
                                        <tr>
                                            <td
                                                colSpan="16"
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
                                        <td>{item.sectionCode}</td>
                                        <td>{item.name}</td>
                                        <td>{item.credits}</td>
                                        <td>{item.theoryGrades1}</td>
                                        <td>{item.theoryGrades2}</td>
                                        <td>{item.theoryGrades3}</td>
                                        <td>{item.practiceGrades1}</td>
                                        <td>{item.practiceGrades2}</td>
                                        <td>{item.practiceGrades3}</td>
                                        <td>{item.midtermGrades}</td>
                                        <td>{item.finalGrades}</td>
                                        <td>{averageScore}</td>
                                        <td>{fourGrade}</td>
                                        <td>{letterGrade}</td>
                                        <td>{classi}</td>
                                        <td>
                                            {letterGrade === "F" ? (
                                                <FaCircleXmark
                                                    style={{ color: "red" }}
                                                />
                                            ) : (
                                                <FaCircleCheck
                                                    style={{ color: "green" }}
                                                />
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

export default Grades;

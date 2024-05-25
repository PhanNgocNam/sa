import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { FaCircleXmark, FaCircleCheck } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import { aws } from "../../utils/server.config";

function RegisterForCourse() {
    let location = useLocation();
    let { courseYear } = location.state.student;
    const [listCourse, setListCourse] = useState([]);
    const [listCourseSection, setListCourseSection] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [courseSectionDetail, setCourseSectionDetail] = useState([]);
    const [selectedSectionId, setSelectedSectionId] = useState(null);
    const [courseSectionRegistered, setCourseSectionRegistered] = useState([]);
    const [selectedOption, setSelectedOption] = useState("");
    let maxQuantityLT = 60;
    let maxQuantityTH = 30;
    const [registeredQuantity, setRegisteredQuantity] = useState(0);
    const [selectedDetailSectionId, setSelectedDetailSectionId] =
        useState(null);
    const [lectureTheoryId, setLectureTheoryId] = useState(null);
    let studentId = location.state.studentId;
    useEffect(() => {
        let getListCourseById = async () => {
            let datas = await axios.get(
                `${aws.url}/courses/${location.state.studentId}/${location.state.majorId}`,
                {
                    auth: JSON.parse(localStorage.getItem("crudentials")),
                }
            );
            setListCourse(datas.data);
        };
        getListCourseById();
    }, [location.state]);

    useEffect(() => {
        let getCourseSectionRegistered = async () => {
            let datas = await axios.get(
                `${aws.url}/course-sections/registered-course-section/${location.state.studentId}/${selectedOption}`,
                {
                    auth: JSON.parse(localStorage.getItem("crudentials")),
                }
            );
            setCourseSectionRegistered(datas.data);
            console.log(datas.data);
        };
        getCourseSectionRegistered();
    }, [selectedOption]);

    useEffect(() => {
        // Tìm id của bài giảng lý thuyết khi danh sách chi tiết lớp học phần thay đổi
        const theoryLectureId = courseSectionDetail.find(
            (item) => item.type === "LT"
        )?.lectureId;
        setLectureTheoryId(theoryLectureId);
    }, [courseSectionDetail]);

    let handleClickCourse = async (majorId) => {
        let datas = await axios.get(`${aws.url}/course-sections/${majorId}`, {
            auth: JSON.parse(localStorage.getItem("crudentials")),
        });
        setListCourseSection(datas.data);
        setSelectedCourseId(majorId);
        setSelectedSectionId(null);
        setSelectedDetailSectionId(null);
        setCourseSectionDetail([]);
    };

    let handleClickCourseSection = async (sectionId) => {
        let datas = await axios.get(
            `${aws.url}/course-sections/detail-course-section/${sectionId}`,
            {
                auth: JSON.parse(localStorage.getItem("crudentials")),
            }
        );
        setCourseSectionDetail(datas.data);
        console.log(datas.data);
        console.log(sectionId);
        setSelectedSectionId(sectionId);
    };

    let handleClickDetailSection = (lectureId) => {
        setSelectedDetailSectionId(lectureId);
    };

    let handleRegisteredQuantity = async (sectionId) => {
        let datas = await axios.get(
            `${aws.url}/course-sections/student-enrollment-numbers/${sectionId}`,
            {
                auth: JSON.parse(localStorage.getItem("crudentials")),
            }
        );
        setRegisteredQuantity(datas.data);
    };

    const generateOptions = (startYear, numYears) => {
        const options = [];
        const endYear = startYear + numYears - 1; // Tính năm kết thúc
        for (let year = startYear; year <= endYear; year++) {
            const nextYear = year + 1;
            const yearString = `${year}-${nextYear}`;
            options.push(
                <option
                    key={`HK1(${yearString})`}
                    value={`HK1 (${yearString})`}
                >
                    HK1 ({yearString})
                </option>,
                <option
                    key={`HK2(${yearString})`}
                    value={`HK2 (${yearString})`}
                >
                    HK2 ({yearString})
                </option>,
                <option
                    key={`HK3(${yearString})`}
                    value={`HK3 (${yearString})`}
                >
                    HK3 ({yearString})
                </option>
            );
        }
        return options.reverse();
    };

    const handleChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleRegister = async () => {
        if (
            !selectedCourseId ||
            !selectedSectionId ||
            selectedOption == "" ||
            !selectedDetailSectionId
        ) {
            toast.error(
                "Vui lòng chọn học kì, môn học, lớp học phần và nhóm thực hành."
            );
            return;
        }
        try {
            const response = await axios.post(
                // `${aws.url}/grades?studentId=${location.state.studentId}&courseSectionId=${selectedSectionId}&courseId=${selectedCourseId}&lectureTheoryId=${lectureTheoryId}&lecturePracticeId=${selectedDetailSectionId}&semester=${selectedOption}`,
                `${aws.url}/grades?studentId=${location.state.studentId}&courseSectionId=${selectedSectionId}&courseId=${selectedCourseId}&lectureTheoryId=${lectureTheoryId}&lecturePracticeId=${selectedDetailSectionId}&semester=${selectedOption}`,
                {
                    auth: JSON.parse(localStorage.getItem("crudentials")),
                }
            );
            console.log(response);
            if (response.data === "Success") {
                toast.success("Đăng ký thành công!");
                // Cập nhật lại danh sách lớp học phần đã đăng ký sau khi đăng ký thành công
                let datas = await axios.get(
                    `${aws.url}/course-sections/registered-course-section/${location.state.studentId}/${selectedOption}`,
                    {
                        auth: JSON.parse(localStorage.getItem("crudentials")),
                    }
                );
                setCourseSectionRegistered(datas.data);
            } else if (response.data === "Class schedules clash") {
                toast.error("Trùng lịch học!");
            } else if (response.data === "credits cannot be greater than 30") {
                toast.error("Vượt quá 30 tín chỉ!");
            } else if (
                response.data ===
                "You have not completed the prerequisite course"
            ) {
                toast.error(
                    "Bạn chưa vượt qua môn học tiên quyết của môn học này!"
                );
            } else {
                toast.error("Đăng ký thất bại!");
            }
        } catch (error) {
            console.error("Đăng ký thất bại: ", error);
            toast.error("Đăng ký thất bại!");
        }
    };

    const getDay = (dayOfWeek) => {
        const days = [
            "Chủ nhật",
            "Thứ hai",
            "Thứ ba",
            "Thứ tư",
            "Thứ năm",
            "Thứ sáu",
            "Thứ bảy",
        ];
        return days[dayOfWeek];
    };

    return (
        <div className="register">
            <Toaster toastOptions={{ duration: 4000 }} />
            <h3>ĐĂNG KÝ HỌC PHẦN</h3>
            <div className="choose-register">
                <div className="register-period">
                    <label htmlFor="register">Đợt đăng ký:</label>
                    <select
                        name="register-period"
                        id="register"
                        value={selectedOption}
                        onChange={handleChange}
                    >
                        <option value="" disabled>
                            Chọn học kỳ
                        </option>
                        {generateOptions(
                            parseInt(courseYear.split("-")[0], 10),
                            5
                        )}
                    </select>
                </div>
                <div className="learning">
                    <input
                        type="radio"
                        id="new"
                        name="learning"
                        value="learnNew"
                        checked
                    />
                    <label htmlFor="new">HỌC MỚI</label>
                    <input
                        type="radio"
                        id="again"
                        name="learning"
                        value="learnAgain"
                    />
                    <label htmlFor="again">HỌC LẠI</label>
                    <input
                        type="radio"
                        id="improve"
                        name="learning"
                        value="learnImprove"
                    />
                    <label htmlFor="improve">HỌC CẢI THIỆN</label>
                </div>
            </div>
            <div className="list-course">
                <h4>MÔN HỌC PHẦN ĐANG CHỜ ĐĂNG KÝ</h4>
                <div className="curriculum-table">
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã môn học</th>
                                <th>Mã học phần</th>
                                <th>Tên môn học</th>
                                <th>Số tín chỉ</th>
                                <th>Bắt buộc</th>
                                <th>Học phần tiên quyết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedOption === "HK1 (2024-2025)" ? (
                                listCourse.map((item, index) => {
                                    return (
                                        <tr
                                            key={index}
                                            onClick={() =>
                                                handleClickCourse(item.id)
                                            }
                                            style={{
                                                backgroundColor:
                                                    selectedCourseId === item.id
                                                        ? "#fff6b0"
                                                        : "",
                                            }}
                                        >
                                            <td>{index + 1}</td>
                                            <td>{item.id}</td>
                                            <td>{item.courseCode}</td>
                                            <td>{item.name}</td>
                                            <td>{item.credits}</td>
                                            <td>
                                                {item.typeCourse == 1 ? (
                                                    <FaCircleCheck
                                                        style={{
                                                            color: "green",
                                                        }}
                                                    />
                                                ) : (
                                                    <FaCircleXmark
                                                        style={{ color: "red" }}
                                                    />
                                                )}
                                            </td>
                                            <td>{item.hasPrerequisite}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <p style={{ color: "red" }}>
                                    Học kì này chưa được phép đăng ký
                                </p>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="list-course-section">
                <h4>LỚP HỌC PHẦN CHỜ ĐĂNG KÝ</h4>
                <div className="curriculum-table">
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã lớp học phần</th>
                                <th>Tên lớp học phần</th>
                                <th>Lớp dự kiến</th>
                                <th>Sĩ số tối đa</th>
                                <th>Đã đăng ký</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listCourseSection.map((item, index) => {
                                handleRegisteredQuantity(item.id);
                                return (
                                    <tr
                                        key={index}
                                        onClick={() =>
                                            handleClickCourseSection(item.id)
                                        }
                                        style={{
                                            backgroundColor:
                                                selectedSectionId === item.id
                                                    ? "#fff6b0"
                                                    : "",
                                        }}
                                    >
                                        <td>{index + 1}</td>
                                        <td>{item.sectionCode}</td>
                                        <td>{item.name}</td>
                                        <td>{item.className}</td>
                                        <td>{maxQuantityLT}</td>
                                        <td>{registeredQuantity}</td>
                                        <td>
                                            {item.status == true
                                                ? "Đã khóa"
                                                : "Chờ sinh viên đăng ký"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="course-section-detail">
                <h4>CHI TIẾT LỚP HỌC PHẦN</h4>
                <div className="curriculum-table">
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Lịch học</th>
                                <th>Phòng học</th>
                                <th>Giảng viên</th>
                                <th>Đã đăng ký</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseSectionDetail.map((item, index) => {
                                return (
                                    <tr
                                        key={index}
                                        style={{
                                            backgroundColor:
                                                item.type === "LT"
                                                    ? "#fff6b0"
                                                    : selectedDetailSectionId ===
                                                      item.lectureId
                                                    ? "#fff6b0"
                                                    : "",
                                            pointerEvents:
                                                item.type === "LT"
                                                    ? "none"
                                                    : "auto",
                                        }}
                                        onClick={() =>
                                            handleClickDetailSection(
                                                item.lectureId
                                            )
                                        }
                                    >
                                        <td>{index + 1}</td>
                                        <td>{`${getDay(item.dayOfWeek)} (${
                                            item.shift
                                        })`}</td>
                                        <td>{item.buildings}</td>
                                        <td>{`${item.lectures} (${item.type})`}</td>
                                        <td>
                                            {item.type === "TH"
                                                ? `${item.studentEnrollmentNumbers}/30`
                                                : `${item.studentEnrollmentNumbers}`}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <button className="btn-register" onClick={handleRegister}>
                Đăng ký môn học
            </button>

            <div className="course-section-registered">
                <h4>LỚP HỌC PHẦN ĐÃ ĐĂNG KÝ TRONG HỌC KÌ NÀY</h4>
                <div className="curriculum-table">
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã lớp học phần</th>
                                <th>Tên lớp học phần</th>
                                <th>Lớp dự kiến</th>
                                <th>Số tín chỉ</th>
                                <th>Giảng viên lý thuyết</th>
                                <th>Giảng viên thực hành</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseSectionRegistered?.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.sectionCode}</td>
                                        <td>{item.name}</td>
                                        <td>{item.className}</td>
                                        <td>{item.credits}</td>
                                        <td>{item.lecture_theory}</td>
                                        <td>{item.lecture_practice}</td>
                                        <td>
                                            {item.status == true
                                                ? "Đã khóa"
                                                : "Chờ sinh viên đăng ký"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default RegisterForCourse;

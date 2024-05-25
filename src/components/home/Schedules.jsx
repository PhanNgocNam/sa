import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { aws } from "../../utils/server.config";

function Schedules() {
    let location = useLocation();
    const [scheduleData, setScheduleData] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const getScheduleById = async () => {
            const { data } = await axios.get(
                `${aws.url}/schedules/${location.state.studentId}`,
                {
                    auth: JSON.parse(localStorage.getItem("crudentials")),
                }
            );
            setScheduleData(data);
            console.log(data);
        };
        getScheduleById();
    }, [location.state]);

    const getStartOfWeek = (date) => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Adjust to Monday (start of the week)
        return startOfWeek;
    };

    const handlePreviousWeek = () => {
        setCurrentDate(
            new Date(currentDate.setDate(currentDate.getDate() - 7))
        );
    };

    const handleNextWeek = () => {
        setCurrentDate(
            new Date(currentDate.setDate(currentDate.getDate() + 7))
        );
    };

    const handleDateChange = (e) => {
        setCurrentDate(new Date(e.target.value));
    };

    const isWithinRange = (date, startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        return date >= start && date <= end;
    };

    const renderScheduleForShift = (isMorning) => {
        const daysOfWeek = [1, 2, 3, 4, 5, 6, 0];
        return daysOfWeek.map((day) => {
            const currentDay = new Date(startOfWeek);
            currentDay.setDate(currentDay.getDate() + day - 1);
            const daySchedule = scheduleData
                .filter(
                    (item) =>
                        parseInt(item.dayOfWeek) === day &&
                        isWithinRange(
                            currentDay,
                            item.startTime,
                            item.endTime
                        ) &&
                        (isMorning
                            ? Math.max(...item.shift.split("-").map(Number)) <=
                              6
                            : Math.max(...item.shift.split("-").map(Number)) >
                              6)
                )
                .sort((a, b) => {
                    const maxShiftA = Math.max(
                        ...a.shift.split("-").map(Number)
                    );
                    const maxShiftB = Math.max(
                        ...b.shift.split("-").map(Number)
                    );
                    return maxShiftA - maxShiftB;
                });
            return (
                <td key={day} style={{ textAlign: "start", padding: "5px" }}>
                    {daySchedule.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                border: "1px solid #ccc",
                                padding: "5px",
                                margin: "5px 0",
                                backgroundColor:
                                    item.type === "LT" ? "#ccc" : "#fff6b0",
                            }}
                        >
                            <b>{item.name}</b> <br />
                            Tiết: {item.shift} <br />
                            Phòng: {item.buildings} <br />
                            Giảng viên: {item.fullName}
                        </div>
                    ))}
                </td>
            );
        });
    };

    const startOfWeek = getStartOfWeek(currentDate);

    return (
        <div className="schedules">
            <h3>LỊCH HỌC THEO TUẦN</h3>
            <div className="schedules-options">
                <input
                    type="date"
                    onChange={handleDateChange}
                    value={currentDate.toISOString().substr(0, 10)}
                />
                <button onClick={handlePreviousWeek}>Trở về</button>
                <button onClick={handleNextWeek}>Tiếp</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th
                            style={{
                                backgroundColor: "#cbe8ff",
                                color: "#0051a2",
                            }}
                        >
                            Ca học
                        </th>
                        {Array.from({ length: 7 }).map((_, index) => {
                            const day = new Date(startOfWeek);
                            day.setDate(startOfWeek.getDate() + index);
                            return (
                                <th
                                    key={index}
                                    style={{
                                        backgroundColor: "#cbe8ff",
                                        width: "150px",
                                        color: "#0051a2",
                                    }}
                                >
                                    {day.toLocaleDateString("vi-VN", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "numeric",
                                        year: "numeric",
                                    })}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ backgroundColor: "#fff6b0" }}>Sáng</td>
                        {renderScheduleForShift(true)}
                    </tr>
                    <tr>
                        <td style={{ backgroundColor: "#fff6b0" }}>Chiều</td>
                        {renderScheduleForShift(false)}
                    </tr>
                </tbody>
            </table>
            <div>
                Chú thích: <input style={{ backgroundColor: "#ccc" }} />
                Lý thuyết <input style={{ backgroundColor: "#fff6b0" }} />
                Thực hành
            </div>
        </div>
    );
}

export default Schedules;

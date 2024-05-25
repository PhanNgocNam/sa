import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { aws } from "../../utils/server.config";

function Information() {
    const [student, setStudent] = useState({});
    const [major, setMajor] = useState({});
    const [department, setDepartment] = useState({});

    useEffect(() => {
        let getApiStudentById = async () => {
            let datas = await axios.get(
                `${aws.url}/accounts/student-code/${location.state?.studentCode}`,
                {
                    auth: JSON.parse(localStorage.getItem("crudentials")),
                }
            );

            setStudent(datas.data?.userId);
            setMajor(datas.data.userId?.majorId);
            setDepartment(datas.data.userId?.majorId.departmentId);
        };
        getApiStudentById();
    }, [location.state?.studentCode]);
    return (
        <div className="information">
            <h3>THÔNG TIN SINH VIÊN</h3>
            <div className="info-detail">
                <div className="info-detail-left">
                    <div>
                        Khóa: <b>{student?.courseYear}</b>
                    </div>
                    <div>
                        Bậc đào tạo: <b>Đại học</b>
                    </div>
                    <div>
                        Ngành: <b>{major?.name}</b>
                    </div>
                    <div>
                        Khoa: <b>Khoa {department?.name}</b>
                    </div>
                </div>
                <div className="info-detail-right">
                    <div>
                        Lớp: <b>{student?.classCode}</b>
                    </div>
                    <div>
                        Loại hình đào tạo: <b>Chính quy</b>
                    </div>
                    <div>
                        Chuyên ngành: <b>{major?.name}</b>
                    </div>
                    <div>
                        Cơ sở: <b>Cơ sở 1 (Thành phố Hồ Chí Minh)</b>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Information;

import { useState, useContext } from "react";
import "../../sass/Login.scss";
import Header from "../Header";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bcrypt from "bcryptjs";
import toast, { Toaster } from "react-hot-toast";
import { AppContext } from "../../contexts/AppContext";
import { aws } from "../../utils/server.config";

function Login() {
    const { setCrudentials } = useContext(AppContext);
    const [studentCode, setStudentCode] = useState("");
    const [password, setPassword] = useState("");
    let navigate = useNavigate();

    let handleLogin = async () => {
        let datas = await axios.get(
            `${aws.url}/accounts/student-code/${studentCode}`,
            {
                auth: {
                    username: studentCode,
                    password: password,
                },
            }
        );
        if (datas.data?.studentCode === studentCode) {
            if (bcrypt.compareSync(password, datas.data.password)) {
                navigate("/home/info", { state: { studentCode: studentCode } });
                setCrudentials({ mssv: studentCode, password: password });
                localStorage.setItem(
                    "crudentials",
                    JSON.stringify({
                        username: studentCode,
                        password: password,
                    })
                );
            } else {
                toast.error("Mật khẩu không chính xác!");
            }
        } else {
            toast.error("Tài khoản không tồn tại!");
        }
    };
    return (
        <div className="container-login">
            <Toaster toastOptions={{ duration: 4000 }} />
            <Header />
            <div className="body">
                <div className="form-login">
                    <div className="mssv">
                        <label htmlFor="mssv">Mã sinh viên</label>
                        <input
                            id="mssv"
                            type="text"
                            placeholder="Nhập mã sinh viên"
                            value={studentCode}
                            onChange={(e) => setStudentCode(e.target.value)}
                        />
                    </div>
                    <div className="password">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="btn">
                        <button onClick={handleLogin}>ĐĂNG NHẬP</button>
                    </div>
                </div>
            </div>
            <Footer />
            {/* <div className="footer">
            <span>TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP TP.HỒ CHÍ MINH</span>
            <span>Địa chỉ: Số 12 Nguyễn Văn Bảo, Phường 4, Quận Gò Vấp, TP.Hồ Chí Minh</span>
            <span>Điện thoại: 0283 8940 390</span>
            <span>Fax: 0283 9940 954</span>
            <span>Email: dhcn@iuh.edu.vn</span>
        </div> */}
        </div>
    );
}

export default Login;

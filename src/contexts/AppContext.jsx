import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [crudentials, setCrudentials] = useState({
        mssv: "",
        password: "",
    });
    return (
        <AppContext.Provider value={{ crudentials, setCrudentials }}>
            {children}
        </AppContext.Provider>
    );
};

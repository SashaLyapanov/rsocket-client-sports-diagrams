import {createContext, useEffect, useState} from "react";

export const CustomContext = createContext()
// export const CustomerContext = createContext()

export const Context = (props) => {

    const [user, setUser] = useState({
        email: ''
    })

    useEffect(() => {
        if (localStorage.getItem('user') != null) {
            setUser(JSON.parse(localStorage.getItem('user')))
        }
    }, [])

    const value = {
        user,
        setUser
    }

    return <CustomContext.Provider value={value}>
        {props.children}
    </CustomContext.Provider>

    // const [customer, setCustomer] = useState();
    // const customerValue = {
    //     customer,
    //     setCustomer
    // }

    // return <CustomerContext.Provider value={customerValue}>
    //     <CustomContext.Provider value={value}>
    //         {props.children}
    //     </CustomContext.Provider>
    // </CustomerContext.Provider>

}

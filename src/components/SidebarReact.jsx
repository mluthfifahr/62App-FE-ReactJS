import { Button, Sidebar } from 'flowbite-react';
import { Link, useNavigate } from "react-router-dom";
import fetchClient from "../utils/fetchClient";
import { useState } from 'react';
import { BeatLoader } from 'react-spinners';

const Leave = () => {
    return (
        <i className="fa-solid fa-plane text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></i>
    )
}

const Master = () => {
    return (
        <i className="fa-solid fa-folder-closed text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></i>
    )
}

const SidebarReact = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenOnSmallScreen, setIsOpenOnSmallScreen] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await fetchClient.get('/api/auth/logout');
            localStorage.removeItem('token');
            navigate('/login');
        } catch (err) {
            console.error(err);
        }
        setIsLoading(false);
    }

    return (
        <>
            <Button className='absolute top-10 left-10' color='rgba(0, 0, 0, 0)' onClick={() => setIsOpenOnSmallScreen(true)}>
                <svg className="w-6 h-6 text-white" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </Button>

            {isOpenOnSmallScreen && <div className='bg-backdrop absolute w-screen h-screen md:hidden' onClick={() => setIsOpenOnSmallScreen(false)}></div>}

            <Sidebar className={`h-screen fixed z-50 ${!isOpenOnSmallScreen && 'w-0'} overflow-x-hidden md:w-64 transition-all`}>
                <Link to='/' className='block text-black text-center font-bold text-2xl mb-4 dark:text-white'>
                    Employee Absent
                </Link>
                <Sidebar.Items>
                    <Sidebar.ItemGroup>
                        <Sidebar.Item as={Link} to='/leaves' className="group"
                            icon={Leave}
                        >
                            Leave
                        </Sidebar.Item>
                        <Sidebar.Collapse
                            icon={Master}
                            label="Master"
                        >
                            <Sidebar.Item as={Link} to='/roles'>
                                Roles
                            </Sidebar.Item>
                            <Sidebar.Item as={Link} to='/user-roles'>
                                User Roles
                            </Sidebar.Item>
                            <Sidebar.Item as={Link} to='/employees'>
                                <Link to='/employees' className='inline-block w-full'>
                                    Employees
                                </Link>
                            </Sidebar.Item>
                            <Sidebar.Item as={Link} to='/employee-positions'>
                                Employee Positions
                            </Sidebar.Item>
                        </Sidebar.Collapse>

                        <div className='absolute bottom-5 left-5 right-5'>
                            <button className="flex items-center justify-center w-full p-2 border border-black dark:border-white text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group" onClick={handleLogout}>
                                {isLoading
                                    ? <BeatLoader color="white" size={10} className='my-1' />
                                    : <>
                                        <i className="fa-solid fa-right-from-bracket -scale-x-100 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></i>
                                        <span className="ml-2 font-semibold">Logout</span>
                                    </>}
                            </button>
                        </div>
                    </Sidebar.ItemGroup>
                </Sidebar.Items>
            </Sidebar>
        </>
    )
}

export default SidebarReact
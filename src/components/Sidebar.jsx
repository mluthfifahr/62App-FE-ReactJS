import { Avatar, Dropdown, Sidebar } from 'flowbite-react';
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { UserState } from '../context/UserProvider';
import { BeatLoader } from 'react-spinners';
import initialName from '../utils/initialName';
import { logout } from '../api/ApiAuth';

const SidebarReact = ({ isOpenOnSmallScreen, setIsOpenOnSmallScreen }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { user } = UserState();

    const handleLogout = async () => {
        setIsLoading(true);

        const { error } = await logout();
        if (error) {
            console.error(error);
        } else {
            localStorage.removeItem('token');
            navigate('/login');
        }
        setIsLoading(false);
    }

    const sidebarTheme = {
        "root": {
            "inner": "h-full overflow-y-auto overflow-x-hidden bg-gray-50 pt-20 pb-4 px-3 dark:bg-gray-800"
        }
    }

    return (
        <>
            {isOpenOnSmallScreen && <div className='bg-backdrop z-30 w-screen h-screen fixed md:hidden' onClick={() => setIsOpenOnSmallScreen(false)}></div>}

            <Sidebar theme={sidebarTheme} className={`fixed z-40 ${!isOpenOnSmallScreen && 'w-0'} overflow-x-hidden md:w-64 transition-all`}>
                <Sidebar.Items>
                    <Sidebar.ItemGroup>
                        <Sidebar.Item as={Link} to='/' className="group"
                            icon={() => <i className="fa-solid fa-house text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></i>}
                        >
                            Dashboard
                        </Sidebar.Item>
                        <Sidebar.Item as={Link} to='/leaves' className="group"
                            icon={() => <i className="fa-solid fa-plane text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></i>}
                        >
                            Leaves
                        </Sidebar.Item>
                        <Sidebar.Item as={Link} to='/projects' className="group"
                            icon={() => <i className="fa-solid fa-tarp-droplet text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></i>}
                        >
                            Projects
                        </Sidebar.Item>
                        <Sidebar.Item as={Link} to='/project-employees' className="group"
                            icon={() => <i className="fa-solid fa-bars-progress text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></i>}
                        >
                            Project Employees
                        </Sidebar.Item>
                        <Sidebar.Collapse
                            icon={() => <i className="fa-solid fa-folder-closed text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></i>}
                            label="Master"
                        >
                            <Sidebar.Item as={Link} to='/roles'>
                                <i className="fa-solid fa-users-gear mr-3 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></i>
                                <span>Roles</span>
                            </Sidebar.Item>
                            <Sidebar.Item as={Link} to='/user-roles'>
                                <i className="fa-solid fa-user-gear mr-3 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></i>
                                <span>User Roles</span>
                            </Sidebar.Item>
                            <Sidebar.Item as={Link} to='/employees'>
                                <i className="fa-solid fa-briefcase mr-4 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></i>
                                <span>Employees</span>
                            </Sidebar.Item>
                            <Sidebar.Item as={Link} to='/employee-positions'>
                                <i className="fa-solid fa-network-wired mr-3 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></i>
                                <span>Employee Positions</span>
                            </Sidebar.Item>
                        </Sidebar.Collapse>
                    </Sidebar.ItemGroup>

                    <div className='absolute bottom-5 left-4 right-4'>
                        <Dropdown placement='top' className='' renderTrigger={() =>
                            <button className='w-full flex pr-2 items-center justify-between gap-2 z-50 text-left rounded-lg p-1 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700'>
                                <div className='flex gap-2 overflow-hidden'>
                                    {user?.employee.profile_url
                                        ? <img src={user?.employee.profile_url} className='rounded-full w-10 h-10' alt="" />
                                        : <Avatar rounded size='md' className='aspect-square' placeholderInitials={initialName(user?.employee.name)} />}
                                    {isLoading
                                        ? <div className='flex justify-center items-center w-96'>
                                            <BeatLoader color='rgb(8 145 178)' size={12} />

                                        </div>
                                        : <div className='overflow-hidden'>
                                            <h5 className='overflow-ellipsis overflow-hidden whitespace-nowrap text-black dark:text-white'>{user?.employee.name}</h5>
                                            <p className='overflow-ellipsis overflow-hidden whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>{user?.email}</p>
                                        </div>}
                                </div>
                                <i className="fa-solid fa-chevron-up"></i>
                            </button>}
                        >
                            <Dropdown.Item onClick={handleLogout}>
                                Logout
                            </Dropdown.Item>
                        </Dropdown>
                    </div>

                </Sidebar.Items>
            </Sidebar>
        </>
    )
}

export default SidebarReact
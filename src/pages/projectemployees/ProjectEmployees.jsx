import { Table, Dropdown, Button } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading'
import { Link } from 'react-router-dom';
import SearchInput from '../../components/SearchInput';
import fetchClient from '../../utils/fetchClient';
import { UserState } from '../../context/UserProvider';
import moment from 'moment';
import PopUpModal from '../../components/DeleteModal';
import PerPage from '../../components/PerPage';
import Pagination from '../../components/Pagination';

const ProjectEmployees = () => {
  const [projectEmployees, setProjectEmpolyees] = useState([]);
  const [pagination, setPagination] = useState();
  const [openModal, setOpenModal] = useState();
  const [selectedProjectEmployee, setSelectedProjectEmployee] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteIsLoading, setDeleteIsLoading] = useState(false);
  const { setNotif } = UserState();


  // Query params
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('employee_name');
  const [direction, setDirection] = useState('asc');
  const [perPage, setPerPage] = useState(10);


  useEffect(() => {
    getProjectEmployees();
    // eslint-disable-next-line
  }, [search, page, sort, direction, perPage]);

  // Retrieve Leaves data
  const getProjectEmployees = async () => {
    setIsLoading(true);
    try {
      const res = await fetchClient.get(`/api/project-employees?search=${search}&page=${page}&sort=${sort}&direction=${direction}&per_page=${perPage}`);
      setProjectEmpolyees(res.data.data);
      delete res.data.data;
      setPagination(res.data);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  }

  const handleDeleteProject = (projectEmployeeId) => {
    setDeleteIsLoading(true);
    fetchClient.delete(`/api/project-employees/${projectEmployeeId}`)
      .then(res => {
        setOpenModal(null);
        setNotif(prev => [...prev, { type: 'success', message: res.data.message }]);
        getProjectEmployees();
      })
      .catch((err) => {
        console.error('Error deleting project:', err);
        setNotif(prev => [...prev, { type: 'failure', message: err.response?.data.message }]);
      })
      .finally(() => setDeleteIsLoading(false));
  };

  // Sort
  const handleSort = (field) => {
    if (field === sort) {
      setDirection(prev => prev === 'asc' ? 'desc' : 'asc');
      return;
    }

    setSort(field);
    setDirection('asc');
  }

  return (
    <>
      <div className="bg-white rounded-md p-4 dark:bg-gray-800">
        <h1 className="font-bold dark:text-white text-2xl mb-8">Project Employees List</h1>

        <div className="flex justify-between mb-4">
          <div className="flex gap-2">
            <Dropdown label="Sort By">
              <Dropdown.Item className="cursor-pointer gap-2" onClick={() => handleSort('employee_name')}>
                {sort === 'employee_name' && (direction === 'asc' ? <i className="fa-solid fa-fade fa-2xs fa-arrow-up"></i> : <i className="fa-solid fa-fade fa-2xs fa-arrow-down"></i>)}
                Employee Name
              </Dropdown.Item>
              <Dropdown.Item className="cursor-pointer gap-2" onClick={() => handleSort('project_name')}>
                {sort === 'project_name' && (direction === 'asc' ? <i className="fa-solid fa-fade fa-2xs fa-arrow-up"></i> : <i className="fa-solid fa-fade fa-2xs fa-arrow-down"></i>)}
                Project Name
              </Dropdown.Item>
              <Dropdown.Item className="cursor-pointer gap-2" onClick={() => handleSort('start_date')}>
                {sort === 'start_date' && (direction === 'asc' ? <i className="fa-solid fa-fade fa-2xs fa-arrow-up"></i> : <i className="fa-solid fa-fade fa-2xs fa-arrow-down"></i>)}
                Start Date
              </Dropdown.Item>
              <Dropdown.Item className="cursor-pointer gap-2" onClick={() => handleSort('end_date')}>
                {sort === 'end_date' && (direction === 'asc' ? <i className="fa-solid fa-fade fa-2xs fa-arrow-up"></i> : <i className="fa-solid fa-fade fa-2xs fa-arrow-down"></i>)}
                End Date
              </Dropdown.Item>
              <Dropdown.Item className="cursor-pointer gap-2" onClick={() => handleSort('status')}>
                {sort === 'status' && (direction === 'asc' ? <i className="fa-solid fa-fade fa-2xs fa-arrow-up"></i> : <i className="fa-solid fa-fade fa-2xs fa-arrow-down"></i>)}
                Status
              </Dropdown.Item>
            </Dropdown>
            <SearchInput setSearch={setSearch} />
          </div>
          <Button as={Link} to="/project-employees/add">
            Add Project Employee
          </Button>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? <Loading size='xl' /> : <Table striped>
            <Table.Head className="text-center sticky top-0">
              <Table.HeadCell className="w-1">
                No
              </Table.HeadCell>
              <Table.HeadCell>
                Employee Name
              </Table.HeadCell>
              <Table.HeadCell>
                Project Name
              </Table.HeadCell>
              <Table.HeadCell>
                Start Date
              </Table.HeadCell>
              <Table.HeadCell>
                End Date
              </Table.HeadCell>
              <Table.HeadCell>
                Status
              </Table.HeadCell>
              <Table.HeadCell>
                Action
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {projectEmployees.map((projectEmployee, i) => (

                <Table.Row className="text-center" key={projectEmployee.id}>
                  <Table.Cell>
                    {(i + 1) + pagination?.per_page * (page - 1)}
                  </Table.Cell>
                  <Table.Cell className="text-start">
                    {projectEmployee.employee_name}
                  </Table.Cell>
                  <Table.Cell>
                    {projectEmployee.project_name}
                  </Table.Cell>
                  <Table.Cell>
                    {projectEmployee.start_date ? moment(projectEmployee.start_date).format("DD MMMM YYYY") : "-"}
                  </Table.Cell>
                  <Table.Cell>
                    {projectEmployee.start_date ? moment(projectEmployee.end_date).format("DD MMMM YYYY") : "-"}
                  </Table.Cell>
                  <Table.Cell>
                    {projectEmployee.status === 1? 'Planing' : 'Join'}
                  </Table.Cell>
                  <Table.Cell className="text-center">
                    <Link to={`/project-employees/${projectEmployee.id}/edit`}
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 mr-5"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => { setSelectedProjectEmployee(projectEmployee.id); setOpenModal('pop-up') }}
                      className="font-medium text-red-600 hover:underline dark:text-red-500"
                    >
                      Delete
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}

            </Table.Body>
          </Table>}
        </div>
        <PerPage setPerPage={setPerPage} />

        <Pagination pagination={pagination} page={page} setPage={setPage} />
      </div>
      <PopUpModal openModal={openModal} setOpenModal={setOpenModal} action={() => handleDeleteProject(selectedProjectEmployee)} isLoading={deleteIsLoading} />
    </>
  );
}


export default ProjectEmployees 
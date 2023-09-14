import { useState, useEffect } from 'react';
import Loading from '../../components/Loading';
import fetchClient from '../../utils/fetchClient';
import { Button, Table, TextInput } from 'flowbite-react';
import Pagination from '../../components/Pagination';
import PopUpModal from '../../components/DeleteModal';
import { SearchIcon } from '../../components/Icons';
import { Link } from 'react-router-dom';
import { UserState } from '../../context/UserProvider';

function EmployeePositions() {
  const [positions, setPositions] = useState([]);
  const [pagination, setPagination] = useState();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState();
  const { setNotif } = UserState();

  // Loading State
  const [isLoading, setIsLoading] = useState(true);
  const [deleteIsLoading, setDeleteIsLoading] = useState(false);

  // Sort State
  const [sort, setSort] = useState('name')
  const [direction, setDirection] = useState('desc')
  const [nameDirection, setNameDirection] = useState('desc')

  useEffect(() => {
    getEmployeePositions();
    // eslint-disable-next-line
  }, [search, page, sort, direction]);

  // Retrive Employee Positions data
  const getEmployeePositions = () => {
    setIsLoading(true);
    fetchClient.get(`/api/employee-positions?search=${search}&page=${page}&direction=${direction}`)
      .then(res => {
        setPositions(res.data.data);
        delete res.data.data
        setPagination(res.data);
      })
      .catch(error => {
        console.error('Error fetching employee positions:', error);
      })
      .finally(() => setIsLoading(false));
  }

  // Delete Employee Position
  const handleDeletePosition = (positionId) => {
    setDeleteIsLoading(true);
    fetchClient.delete(`/api/employee-positions/${positionId}`)
      .then(res => {
        getEmployeePositions()
        setNotif(prev => [...prev, { type: 'success', message: res.data.message }]);
        setOpenModal(null);
      })
      .catch((error) => {
        console.error('Error deleting employee position:', error);
      })
      .finally(() => setDeleteIsLoading(false));
  };

  // Sort
  const handleSort = (field) => {
    if (field === sort && field === 'name') {
      setDirection(nameDirection === 'asc' ? 'desc' : 'asc')
      setNameDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    }

    setSort(field)
  }

  return (
    <>
      <div className="bg-white rounded-md p-4 dark:bg-gray-800">
        <h1 className="text-2xl font-bold mb-8 dark:text-white">Employee Positions List</h1>
        <div className="flex justify-between mb-4">
          <TextInput className="w-56" icon={SearchIcon} type="search" placeholder="Search..." onChange={(e) => setSearch(e.target.value)} />

          <Button as={Link} to="/employee-positions/add">
            Add Position
          </Button>
        </div>

        <div className="h-96 overflow-y-auto">
          {isLoading ? <Loading size='xl' /> : (
            <Table striped>
              <Table.Head className='text-center sticky top-0'>
                <Table.HeadCell className='w-1'>No</Table.HeadCell>
                <Table.HeadCell className="cursor-pointer" onClick={() => handleSort('name')}>
                  {nameDirection === 'asc' ? <i className="fa-solid fa-sort-up mr-2"></i> : <i className="fa-solid fa-sort-down mr-2"></i>}
                  Name
                </Table.HeadCell>
                <Table.HeadCell>Action</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {positions.map((position, i) => (
                  <Table.Row key={position.id}>
                    <Table.Cell className='text-center'>
                      {(i + 1) + pagination?.per_page * (page - 1)}
                    </Table.Cell>
                    <Table.Cell>
                      {position.name}
                    </Table.Cell>
                    <Table.Cell className='text-center'>
                      <Link
                        to={`/employee-positions/${position.id}/edit`}
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-600 mr-5"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => { setSelectedPosition(position.id); setOpenModal('pop-up') }}
                        className="font-medium text-red-600 hover:underline dark:text-red-600"
                      >
                        Delete
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </div>

        <Pagination pagination={pagination} page={page} setPage={setPage} />
      </div>

      <PopUpModal openModal={openModal} setOpenModal={setOpenModal} action={() => handleDeletePosition(selectedPosition)} isLoading={deleteIsLoading} />
    </>
  );
}

export default EmployeePositions;

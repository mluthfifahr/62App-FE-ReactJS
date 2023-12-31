import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";
import PerPage from "../../components/PerPage";
import SearchInput from "../../components/SearchInput";
import NoData from "../../components/NoData";
import { getUserRoles } from "../../api/ApiUserRole";
import SortBy from "../../components/SortBy";

const UserRoles = () => {
  const [userRoles, setUserRoles] = useState([]);
  const [pagination, setPagination] = useState();
  const [isLoading, setIsLoading] = useState(true);

  // Query Params
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('email');
  const [direction, setDirection] = useState('asc');
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    const _getUserRoles = async () => {
      setIsLoading(true);

      const { data, pagination, error } = await getUserRoles(search, page, sort, direction, perPage);
      if(error) {
        console.error(error);
      } else {
        setUserRoles(data);
        setPagination(pagination);
      }

      setIsLoading(false);
    }

    _getUserRoles();
  }, [search, page, sort, direction, perPage]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const items = [
    {
      field: 'email',
      name: 'Email'
    },
    {
      field: 'name',
      name: 'Name'
    },
  ]

  return (
    <>
      <div className="bg-white rounded-md p-4 dark:bg-gray-800">
        <h1 className="font-bold dark:text-white text-2xl mb-8">User Roles List</h1>

        <div className="mb-4 flex gap-2">
          <SortBy items={items} sort={sort} setSort={setSort} direction={direction} setDirection={setDirection} />

          <SearchInput setSearch={setSearch} />
        </div>

        <div className="overflow-x-auto">
          {isLoading ? <Loading size='xl' /> : <Table striped>
            <Table.Head className="text-center sticky top-0">
              <Table.HeadCell className="w-1">
                No
              </Table.HeadCell>
              <Table.HeadCell>
                Email
              </Table.HeadCell>
              <Table.HeadCell>
                Name
              </Table.HeadCell>
              <Table.HeadCell>
                Roles
              </Table.HeadCell>
              <Table.HeadCell>
                Action
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {userRoles.length > 0 ? userRoles.map((userRole, i) => (
                <Table.Row key={i}>
                  <Table.Cell className="text-center">
                    {(i + 1) + pagination?.per_page * (page - 1)}
                  </Table.Cell>
                  <Table.Cell>
                    {userRole.email}
                  </Table.Cell>
                  <Table.Cell>
                    {userRole.name}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-wrap gap-1">
                      {userRole.roles.map(role => (
                        <span key={role.id} className="border flex gap-2 items-center px-2 py-1 rounded-md">
                          {role.name}
                        </span>
                      ))}
                    </div>
                  </Table.Cell>
                  <Table.Cell className="text-center">
                    <Link
                      to={`/user-roles/${userRole.id}/edit`}
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                      Edit
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))  : (
                <Table.Row >
                <Table.Cell colSpan={10}>
                  <NoData />
                </Table.Cell>
              </Table.Row>)}
            </Table.Body>
          </Table>}
        </div>

        <PerPage setPerPage={setPerPage} />

        <Pagination pagination={pagination} page={page} setPage={setPage} />
      </div>
    </>
  )
}

export default UserRoles
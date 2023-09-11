import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";

function AddEmployees() {

  const [employees, setEmployees] = useState({
    name: '',
    employee_position_id: ''
  });

  const [employeePositions, setEmployeePositions] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    const getEmployeePositions = () => {
      axios.get(`http://127.0.0.1:8000/api/employee-positions`)
      .then(res => setEmployeePositions(res.data.data))
    }

    getEmployeePositions()
  }, [])
  

  const handleInput = (e) => {
    e.persist();
    console.log({[e.target.name]: e.target.value})
    let value = e.target.value;
    setEmployees({ ...employees, [e.target.name]: value });
  }

  const saveEmployees = (e) => {
    e.preventDefault();

    const data = {
      name: employees.name,
      employee_position_id: employees.employee_position_id
    }
    console.log(data)

    axios.post(`http://127.0.0.1:8000/api/employees`, data)
      .then(res => {
        alert(res.data.message);
        navigate('/employees')
      });
  }

  return (
    <Layout>
    <div className="container mt-5 p-3 mb-2">
      <div className="row">
        <div className="col-start-12">
          <div className="card border-0 bg-cyan-400">
            <div className="card-title text-cyan-950 bg-cyan-400 flex justify-between p-3">
              <h4>Add Employee</h4>
              <Link to="/employees" className="btn btn-light float-end">Back</Link>
           </div>
            <div className="card-body">
              <form onSubmit={saveEmployees}>
                <div className="mb-3">
                  <label className="text-cyan-950">Name</label>
                  <input type="text" name="name" value={employees.name} onChange={handleInput} className="form-control border-0 text-info" placeholder="Enter Name" />
                </div>
                <div className="mb-4">
                  <label htmlFor="position" className="block text-cyan-950  mb-2">
                    Positions
                    <select name="employee_position_id" id="position" className='rounded-md py-5 px-3 text-cyan-400 focus:outline-none focus:ring  w-full' onChange={handleInput}>
                     {employeePositions.map(p=>(
                      <option value={p.id}>{p.name}</option>
                     ))}
                    </select>
                  </label>
                </div>
                <div className="mb-3">
                  <button type="submit" className="btn btn-dark text-info">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  )
}

export default AddEmployees;
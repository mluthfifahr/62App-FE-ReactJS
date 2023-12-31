import { Avatar, Button, Select, TextInput, Textarea } from "flowbite-react"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from 'react-spinners';
import { UserState } from "../../context/UserProvider";
import { addProject } from "../../api/ApiProject";

function AddProject() {
  const [addIsLoading, setAddIsLoading] = useState(false);
  const [project, setProject] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    image_url: '',
    total_story_point: 0,
    done_story_point: 0,
    status: 1,
  });
  const { setNotif } = UserState();

  const navigate = useNavigate();

  // Update value input state
  const handleInput = (e) => {
    e.persist();
    setProject({ ...project, [e.target.name]: e.target.value });
  }

  // Add Project
  const saveProject = async (e) => {
    setAddIsLoading(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append('image_url', project.image_url);
    formData.append('name', project.name);
    formData.append('description', project.description);
    formData.append('total_story_point', project.total_story_point);
    formData.append('done_story_point', project.done_story_point);
    formData.append('status', project.status);

    if (project.start_date) {
      formData.append('start_date', project.start_date);
    }
    if (project.end_date) {
      formData.append('end_date', project.end_date);
    }

    const { error, message } = await addProject(formData);
    if (error) {
      console.error(error);
      setNotif(prev => [...prev, { type: 'failure', message: error }]);
    } else {
      setNotif(prev => [...prev, { type: 'success', message }]);
      navigate('/projects');
    }

    setAddIsLoading(false);
  }

  const avatarTheme = {
    "root": {
      "img": {
        "base": "rounded object-cover"
      }
    }
  }

  return (
    <div
      className="max-w-md mx-auto p-4 bg-white dark:bg-gray-800 shadow-md rounded-md"
    >
      <h4 className="text-xl font-semibold text-center dark:text-gray-50 mb-5">Add Project</h4>
      <div className="mb-4">
        <label htmlFor="image" className="block text-gray-700 dark:text-gray-50 font-bold mb-2 mt-5">
          Project Image
        </label>
        <label className="cursor-pointer" htmlFor="image">
            <Avatar theme={avatarTheme} img={project?.image_url && URL.createObjectURL(project?.image_url)} className='mx-auto object-cover' size="lg" rounded />
          <input type="file" id="image" hidden onChange={(e) => setProject({ ...project, image_url: e.target.files[0] })} />
        </label>

        <label htmlFor="name" className="block text-gray-700 dark:text-gray-50 font-bold mb-2">
          Project Name
        </label>
        <TextInput
          value={project?.name}
          id="name"
          name="name"
          className="w-full"
          onChange={(e) => setProject({ ...project, name: e.target.value })}
          placeholder="Enter Name"
        />
        <label htmlFor="description" className="block mt-2 text-gray-700 dark:text-gray-50 font-bold mb-2">
          Description
        </label>
        <Textarea
          value={project?.description}
          id="description"
          name="description"
          className="w-full"
          onChange={(e) => setProject({ ...project, description: e.target.value })}
          placeholder="Enter Description"
          maxLength={500}
        />
        <label htmlFor="start_date" className="block mt-2 text-gray-700 dark:text-gray-50 font-bold mb-2">
          Start Date
        </label>
        <input type="date" id="start_date"
          className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
          value={project?.start_date}
          onChange={e => setProject(prev => ({ ...prev, start_date: e.target.value }))} />
        <label htmlFor="end_date" className="block mt-2 text-gray-700 dark:text-gray-50 font-bold mb-2">
          End Date
        </label>
        <input type="date" id="end_date"
          className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
          value={project?.end_date}
          onChange={e => setProject(prev => ({ ...prev, end_date: e.target.value }))} />
        <div className="flex gap-5">
          <div className="w-full">
            <label htmlFor="total_story_point" className="block mt-2 text-gray-700 dark:text-gray-50 font-bold mb-2">
              Total Story Point
            </label>
            <TextInput type="number" id="total_story_point" className="w-full" value={project.total_story_point} onChange={(e) => setProject({ ...project, total_story_point: e.target.value })} />
          </div>
          <div className="w-full">
            <label htmlFor="done_story_point" className="block mt-2 text-gray-700 dark:text-gray-50 font-bold mb-2">
              Done Story Point
            </label>
            <TextInput type="number" id="done_story_point" className="w-full" value={project.done_story_point} onChange={(e) => setProject({ ...project, done_story_point: e.target.value })} />
          </div>
        </div>
        <label htmlFor="status" className="block text-gray-700 dark:text-gray-50 font-bold mb-2 mt-5">
          Status
        </label>
        <Select name="status" id="status" value={project.status} className='w-full' onChange={handleInput}>
          <option value={1}>
            Proposal
          </option>
          <option value={2}>
            On Going
          </option>
          <option value={3}>
            Done
          </option>
        </Select>


      </div>
      <div className="flex justify-end">
        <Button
          as={Link}
          color="failure"
          to='/projects'
          className="mr-2"
        >
          Cancel
        </Button>
        {addIsLoading
          ? <Button type="button" disabled>
            <BeatLoader color="white" size={6} className='my-1 mx-2' />
          </Button>
          : <Button type="button" onClick={saveProject}>
            Save
          </Button>}
      </div>
    </div>
  )
}

export default AddProject;
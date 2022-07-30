import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import Input from "../components/Input";
import Modal from "../components/Modal";
import Select from "../components/Select";
import useFetchState from "../hooks/useFetchState";
import Client from "../interfaces/Client";
import Group from "../interfaces/Group";
import Instructor from "../interfaces/Instructor";

const clientSchema = yup.object({
  name: yup.string().required("Name is required"),
  startDate: yup.string().required("Start date is required"),
  endDate: yup.string().required("End date is required"),
  instructor: yup.string().required("An instructor must be selected"),
});

const Clients = () => {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Group>({
    resolver: yupResolver(clientSchema),
  });
  const [isOpen, setIsOpen] = useState(false);
  const [groups, setGroups] = useFetchState<Group[]>(
    "http://localhost:4000/groups"
  );
  const [clients, setClients] = useFetchState<Client[]>(
    "http://localhost:4000/clients"
  );

  const [instructors] = useFetchState<Instructor[]>(
    "http://localhost:4000/instructors"
  );

  useEffect(() => {
    setValue("name", selectedGroup?.name!);
    setValue("startDate", selectedGroup?.startDate!);
    setValue("endDate", selectedGroup?.endDate!);
    setValue("instructor", selectedGroup?.instructor!);
    setValue("clients", selectedGroup?.clients!);
  }, [selectedGroup]);

  const onSubmit: SubmitHandler<Group> = async (data) => {
    if (selectedGroup) {
      const res = await fetch(
        `http://localhost:4000/groups/${selectedGroup._id}`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const updatedClient = await res.json();
      setGroups(
        groups?.map((client) =>
          client._id === selectedGroup._id ? updatedClient : client
        )!
      );
      return;
    }

    const res = await fetch("http://localhost:4000/groups", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    setGroups([...groups!, await res.json()]);
    reset();
  };

  const deleteClient = (id: string) => {
    fetch(`http://localhost:4000/groups/${id}`, {
      method: "DELETE",
    });
    setGroups(groups?.filter((client) => client._id !== id)!);
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
        Add a Group
      </button>
      <Modal
        isOpen={isOpen}
        close={() => {
          setIsOpen(false);
          setSelectedGroup(null);
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            register={register}
            error={errors.name?.message}
            label="Name"
            name="name"
            placeholder="Name"
          />
          <Input
            register={register}
            error={errors.startDate?.message}
            label="Start Date"
            name="startDate"
            placeholder="Start Date"
            type="date"
          />
          <Input
            register={register}
            error={errors.endDate?.message}
            label="End Date"
            name="endDate"
            placeholder="End Date"
            type="date"
          />
          <Select
            register={register}
            error={errors.instructor?.message}
            label="Instructor"
            name="instructor"
          >
            {instructors?.map((instructor) => (
              <option value={instructor.name} key={instructor._id}>
                {instructor.name}
              </option>
            ))}
          </Select>
          <Select register={register} label="Clients" name="clients" multiple>
            {clients?.map((client) => (
              <option value={client.name} key={client._id}>
                {client.name}
              </option>
            ))}
          </Select>
          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </form>
      </Modal>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Instructor</th>
              <th>Clients</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups?.map((group, i) => (
              <tr key={group._id}>
                <td>{i}</td>
                <td>{group.name}</td>
                <td>{group.startDate}</td>
                <td>{group.endDate}</td>
                <td>{group.instructor}</td>
                <td>
                  {group.clients.map((client, i) => (
                    <div key={i}>{client}</div>
                  ))}
                </td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-error"
                    onClick={() => deleteClient(group._id!)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => {
                      setIsOpen(true);
                      setSelectedGroup(group);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clients;

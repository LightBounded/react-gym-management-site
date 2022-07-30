import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import Input from "../components/Input";
import Modal from "../components/Modal";
import useFetchState from "../hooks/useFetchState";
import Client from "../interfaces/Client";

const clientSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().required("Email is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  address: yup.string().required("Address is required"),
});

const Clients = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Client>({
    resolver: yupResolver(clientSchema),
  });
  const [isOpen, setIsOpen] = useState(false);
  const [clients, setClients] = useFetchState<Client[]>(
    "http://localhost:4000/clients"
  );

  useEffect(() => {
    setValue("name", selectedClient?.name!);
    setValue("email", selectedClient?.email!);
    setValue("phoneNumber", selectedClient?.phoneNumber!);
    setValue("address", selectedClient?.address!);
  }, [selectedClient]);

  const onSubmit: SubmitHandler<Client> = async (data) => {
    if (selectedClient) {
      const res = await fetch(
        `http://localhost:4000/clients/${selectedClient._id}`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      
      const updatedClient = await res.json();
      setClients(
        clients?.map((client) =>
          client._id === selectedClient._id ? updatedClient : client
        )!
      );
      return;
    }

    const res = await fetch("http://localhost:4000/clients", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    setClients([...clients!, await res.json()]);
    reset();
  };

  const deleteClient = (id: string) => {
    fetch(`http://localhost:4000/clients/${id}`, {
      method: "DELETE",
    });
    setClients(clients?.filter((client) => client._id !== id)!);
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
        Add a Client
      </button>
      <Modal
        isOpen={isOpen}
        close={() => {
          setIsOpen(false);
          setSelectedClient(null);
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            register={register}
            error={errors.name?.message}
            label="Name"
            name="name"
            placeholder="Name"
          />
          <Input
            register={register}
            error={errors.email?.message}
            label="Email"
            name="email"
            placeholder="Email"
          />
          <Input
            register={register}
            error={errors.phoneNumber?.message}
            label="Phone Number"
            name="phoneNumber"
            placeholder="Phone Number"
          />
          <Input
            register={register}
            error={errors.address?.message}
            label="Address"
            name="address"
            placeholder="Address"
          />
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
              <th>Email</th>
              <th>Phone Number</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients?.map((client, i) => (
              <tr key={client._id}>
                <td>{i}</td>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.phoneNumber}</td>
                <td>{client.address}</td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-error"
                    onClick={() => deleteClient(client._id!)}
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
                      setSelectedClient(client);
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

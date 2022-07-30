import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import Input from "../components/Input";
import Modal from "../components/Modal";
import useFetchState from "../hooks/useFetchState";
import Instructor from "../interfaces/Instructor";

const instructorSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().required("Email is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  specialization: yup.string().required("Specialization is required"),
});

const Clients = () => {
  const [selectedInstructor, setSelectedInstructor] =
    useState<Instructor | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Instructor>({
    resolver: yupResolver(instructorSchema),
  });
  const [isOpen, setIsOpen] = useState(false);
  const [instructors, setInstructors] = useFetchState<Instructor[]>(
    "http://localhost:4000/instructors"
  );

  useEffect(() => {
    setValue("name", selectedInstructor?.name!);
    setValue("email", selectedInstructor?.email!);
    setValue("phoneNumber", selectedInstructor?.phoneNumber!);
    setValue("specialization", selectedInstructor?.specialization!);
  }, [selectedInstructor]);

  const onSubmit: SubmitHandler<Instructor> = async (data) => {
    if (selectedInstructor) {
      const res = await fetch(
        `http://localhost:4000/instructors/${selectedInstructor._id}`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const updatedInstructor = await res.json();
      setInstructors(
        instructors?.map((client) =>
          client._id === selectedInstructor._id ? updatedInstructor : client
        )!
      );
      return;
    }

    const res = await fetch("http://localhost:4000/instructors", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    setInstructors([...instructors!, await res.json()]);
    reset();
  };

  const deleteInstructor = (id: string) => {
    fetch(`http://localhost:4000/instructors/${id}`, {
      method: "DELETE",
    });
    setInstructors(instructors?.filter((client) => client._id !== id)!);
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
        Add an Instructor
      </button>
      <Modal
        isOpen={isOpen}
        close={() => {
          setIsOpen(false);
          setSelectedInstructor(null);
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
            error={errors.specialization?.message}
            label="Specialization"
            name="specialization"
            placeholder="Specialization"
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
              <th>Specialization</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {instructors?.map((instructor, i) => (
              <tr key={instructor._id}>
                <td>{i}</td>
                <td>{instructor.name}</td>
                <td>{instructor.email}</td>
                <td>{instructor.phoneNumber}</td>
                <td>{instructor.specialization}</td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-error"
                    onClick={() => deleteInstructor(instructor._id!)}
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
                      setSelectedInstructor(instructor);
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

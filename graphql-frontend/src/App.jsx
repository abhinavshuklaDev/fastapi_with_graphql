import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import "./App.css";

const GET_USERS = gql`
  query {
    getUsers {
      id
      name
      email
    }
  }
`;

const CREATE_USER = gql`
  mutation($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

const UPDATE_USER = gql`
  mutation($id: Int!, $name: String!, $email: String!) {
    updateUser(id: $id, name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

const DELETE_USER = gql`
  mutation($id: Int!) {
    deleteUser(id: $id)
  }
`;

function App() {
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState(null);

  const handleSubmit = async () => {
    if (!name || !email) return;

    if (editId) {
      await updateUser({ variables: { id: editId, name, email } });
      setEditId(null);
    } else {
      await createUser({ variables: { name, email } });
    }

    setName("");
    setEmail("");
    refetch();
  };

  const handleEdit = (user) => {
    setName(user.name);
    setEmail(user.email);
    setEditId(user.id);
  };

  const handleDelete = async (id) => {
    await deleteUser({ variables: { id } });
    refetch();
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error loading users</h2>;

  return (
    <div className="container">
      <h1 width>User Management</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSubmit}>
          {editId ? "Update User" : "Add User"}
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.getUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button className="edit" onClick={() => handleEdit(user)}>
                  Edit
                </button>
                <button className="delete" onClick={() => handleDelete(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
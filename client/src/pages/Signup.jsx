import { useMutation, gql } from '@apollo/client'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
    }
  }
`

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [createUser] = useMutation(CREATE_USER)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(form)
    await createUser({ variables: { input: form } })

    navigate('/login')
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Signup
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        Already have an account?
        <Link to="/login" className="text-blue-600 hover:underline ml-1">
          Login
        </Link>
      </p>
    </div>
  )
}

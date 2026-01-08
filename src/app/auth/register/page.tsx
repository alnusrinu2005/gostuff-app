"use client"

export default function RegisterPage() {
  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Register</h1>

      <form className="space-y-4">
        <div>
          <label>Email</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            placeholder="Enter email"
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            placeholder="Enter password"
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          Register
        </button>
      </form>
    </div>
  )
}

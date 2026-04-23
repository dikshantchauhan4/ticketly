import { useMemo, useState } from "react";
import { LogIn, Ticket } from "lucide-react";
import { roleLabels } from "../lib/constants.js";

export function LoginPage({ employees, onLogin, theme }) {
  const firstEmail = employees[0]?.email ?? "";
  const [email, setEmail] = useState(firstEmail);
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const selectedEmployee = useMemo(
    () => employees.find((employee) => employee.email === email),
    [email, employees]
  );

  function handleSubmit(event) {
    event.preventDefault();
    if (!selectedEmployee || !accessCode.trim()) {
      setError("Enter a valid employee email and access code.");
      return;
    }
    setError("");
    onLogin(selectedEmployee.id);
  }

  return (
    <main className={`${theme} shell grid place-items-center`}>
      <section className="panel w-full max-w-md p-5">
        <div className="flex items-center gap-3">
          <div
            className="grid h-11 w-11 place-items-center bg-brand text-brandInk"
            style={{ borderRadius: 8 }}
          >
            <Ticket className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Ticketly</h1>
            <p className="text-sm text-muted">Sign in to your ticket workspace</p>
          </div>
        </div>
        <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-1">
            <span className="label">Work email</span>
            <select
              className="input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            >
              {employees.map((employee) => (
                <option key={employee.id} value={employee.email}>
                  {employee.email}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1">
            <span className="label">Access code</span>
            <input
              className="input"
              type="password"
              value={accessCode}
              onChange={(event) => setAccessCode(event.target.value)}
              placeholder="Enter access code"
            />
          </label>
          {selectedEmployee && (
            <div className="subtle-panel p-3 text-sm">
              <p className="font-semibold">{selectedEmployee.name}</p>
              <p className="text-muted">{roleLabels[selectedEmployee.role]}</p>
            </div>
          )}
          {error && <p className="text-sm font-semibold text-danger">{error}</p>}
          <button className="btn btn-primary" type="submit">
            <LogIn className="h-4 w-4" />
            Login
          </button>
        </form>
      </section>
    </main>
  );
}

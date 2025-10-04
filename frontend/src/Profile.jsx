import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";
import PageWrapper from "./PageWrapper";

export default function Profile() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    alternateMobile: "",
    age: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gender: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/signin"); return; }

    setLoading(true);
    API.get("/auth/profile")
      .then(res => {
        if (res.data.success) {
          setForm({
            ...res.data.user,
            dob: res.data.user.dob ? res.data.user.dob.split("T")[0] : "",
          });
        }
      })
      .catch(() => {
        setIsError(true);
        setMessage("Error fetching profile ❌");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.patch("/auth/profile", form);
      if (res.data.success) {
        setIsError(false);
        setMessage(res.data.message);
      } else {
        setIsError(true);
        setMessage(res.data.message || "Failed to update profile ❌");
      }
    } catch {
      setIsError(true);
      setMessage("Error updating profile ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper title="Profile">
      {loading && <p className="text-white text-center mb-4">Loading...</p>}
      <form onSubmit={handleSubmit} className="w-full space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-white text-sm">Full Name</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} className="p-2 border rounded w-full"/>
          </div>
          <div>
            <label className="text-white text-sm">Email</label>
            <input name="email" value={form.email} disabled className="p-2 border rounded w-full bg-gray-300"/>
          </div>
          <div>
            <label className="text-white text-sm">Mobile</label>
            <input name="mobile" value={form.mobile} onChange={handleChange} className="p-2 border rounded w-full"/>
          </div>
          <div>
            <label className="text-white text-sm">Alternate Mobile</label>
            <input name="alternateMobile" value={form.alternateMobile} onChange={handleChange} className="p-2 border rounded w-full"/>
          </div>
          <div>
            <label className="text-white text-sm">Age</label>
            <input type="number" name="age" value={form.age} onChange={handleChange} className="p-2 border rounded w-full"/>
          </div>
          <div>
            <label className="text-white text-sm">Date of Birth</label>
            <input type="date" name="dob" value={form.dob} onChange={handleChange} className="p-2 border rounded w-full"/>
          </div>
          <div>
            <label className="text-white text-sm">City</label>
            <input name="city" value={form.city} onChange={handleChange} className="p-2 border rounded w-full"/>
          </div>
          <div>
            <label className="text-white text-sm">State</label>
            <input name="state" value={form.state} onChange={handleChange} className="p-2 border rounded w-full"/>
          </div>
          <div>
            <label className="text-white text-sm">Pincode</label>
            <input name="pincode" value={form.pincode} onChange={handleChange} className="p-2 border rounded w-full"/>
          </div>
        </div>

        <div>
          <label className="text-white text-sm">Address</label>
          <textarea name="address" value={form.address} onChange={handleChange} className="w-full p-2 border rounded" rows="3"/>
        </div>

        <div>
          <label className="text-white text-sm">Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className="w-full mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          {loading ? "Saving..." : "Save"}
        </button>

        {message && <p className={`mt-4 text-center ${isError ? "text-red-500" : "text-green-500"}`}>{message}</p>}
      </form>
    </PageWrapper>
  );
}

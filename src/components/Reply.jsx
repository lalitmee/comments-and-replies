import { useState } from "react";
import PropTypes from "prop-types";

const Reply = ({ id, onReply, onCancel }) => {
  const [form, setForm] = useState({ name: "", comment: "" });

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePost = () => {
    onReply(id, form);
    setForm({ name: "", comment: "" });
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="w-full rounded bg-gray-200 p-4">
      <p>Reply</p>
      <input
        className="my-2 w-full rounded border px-2 py-1"
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={onChange}
      />
      <textarea
        className="my-2 w-full rounded border px-2 py-1"
        name="comment"
        placeholder="Reply"
        value={form.comment}
        onChange={onChange}
      />
      <div className="flex w-full items-center justify-between">
        <button
          className="rounded-md border border-blue-500 text-blue-500 px-6 py-2 text-sm"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          className="rounded-md border bg-blue-500 px-6 py-2 text-sm text-white"
          onClick={handlePost}
        >
          POST
        </button>
      </div>
    </div>
  );
};

Reply.propTypes = {
  id: PropTypes.number,
  onReply: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Reply;

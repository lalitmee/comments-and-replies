import { useState } from "react";
import PropTypes from "prop-types";

const Comment = ({ onPost }) => {
  const [form, setForm] = useState({ name: "", comment: "" });

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePost = () => {
    if (form.name && form.comment) {
      onPost(form);
      setForm({ name: "", comment: "" });
    }
  };

  return (
    <form onSubmit={handlePost}>
      <div className="w-full rounded bg-gray-200 p-4">
        <p>Comment</p>
        <input
          className="my-2 w-full rounded border px-2 py-1"
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={onChange}
          required
        />
        <textarea
          className="my-2 w-full rounded border px-2 py-1"
          name="comment"
          placeholder="Comment"
          value={form.comment}
          onChange={onChange}
          required
        />
        <div className="flex w-full items-end justify-end">
          <button
            className="rounded-md border bg-blue-500 px-6 py-2 text-sm text-white"
            onClick={handlePost}
          >
            POST
          </button>
        </div>
      </div>
    </form>
  );
};

Comment.propTypes = {
  type: PropTypes.string,
  onPost: PropTypes.func,
  comment: PropTypes.objectOf({
    id: PropTypes.number,
    name: PropTypes.string,
    comment: PropTypes.string,
  }),
  editable: PropTypes.bool,
};

export default Comment;

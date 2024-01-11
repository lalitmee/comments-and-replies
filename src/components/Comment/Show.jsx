import { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Reply from "../Reply";

const buttonClass =
  "text-blue-500 py-2 text-sm font-semibold hover:text-blue-700";

function ShowComment({ parentId = 0, comment, onSave, onReply, onDelete }) {
  const {
    id,
    name,
    comment: commentText,
    created,
    comments: replies = [],
  } = comment || {};

  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(commentText);
  const [isReplying, setIsReplying] = useState(false);

  const isReplyEnabled = typeof onReply === "function";

  const onChange = (e) => {
    setEditedComment(e.target.value);
  };

  const onEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(id, parentId, editedComment);
    setIsEditing(false);
  };

  const handleReply = () => {
    setIsReplying(true);
  };

  const handleCancelReply = () => {
    setIsReplying(false);
  };

  const handleDelete = () => {
    onDelete(id, parentId);
  };

  return (
    <>
      <div className="relative w-full rounded bg-gray-200 p-4 my-4">
        <button
          className="absolute flex items-center text-white justify-center w-8 h-8 bg-gray-700 p-2 rounded-full right-[-14px] top-1/2 translate-y-[-50%]"
          onClick={handleDelete}
        >
          <i className="fa fa-trash"></i>
        </button>
        <div className="w-full flex items-center justify-between">
          <p className="font-bold">{name}</p>
          <p>{moment(created).format("Do MMM YYYY")}</p>
        </div>
        {isEditing ? (
          <input
            className="my-2 w-full rounded border px-2 py-1"
            type="text"
            name="name"
            placeholder="Name"
            value={editedComment}
            onChange={onChange}
          />
        ) : (
          <p className="my-2 w-full rounded border py-1">{commentText}</p>
        )}
        <div className="flex w-full items-center justify-start gap-4">
          {isReplyEnabled && (
            <button className={buttonClass} onClick={handleReply}>
              Reply
            </button>
          )}
          {isEditing ? (
            <button className={buttonClass} onClick={handleSave}>
              Save
            </button>
          ) : (
            <button className={buttonClass} onClick={onEdit}>
              Edit
            </button>
          )}
        </div>
      </div>
      <div className="ml-6">
        {isReplying && (
          <Reply id={id} onReply={onReply} onCancel={handleCancelReply} />
        )}
        {replies.map((reply) => (
          <ShowComment
            key={`reply-${reply.id}`}
            parentId={id}
            comment={reply}
            onSave={onSave}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
}

ShowComment.propTypes = {
  parentId: PropTypes.number,
  comment: PropTypes.objectOf({
    id: PropTypes.number,
    name: PropTypes.string,
    comment: PropTypes.string,
    created: PropTypes.string,
  }),
  onSave: PropTypes.func,
  onReply: PropTypes.func,
  onDelete: PropTypes.func,
};

export default ShowComment;

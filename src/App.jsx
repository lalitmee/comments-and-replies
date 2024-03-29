import { useEffect, useState } from "react";
import moment from "moment";

import Comment from "./components/Comment";
import ShowComment from "./components/Comment/Show";
import { findChildCommentIndex } from "./utils";

const commentsFromStore = JSON.parse(localStorage.getItem("comments"));

function App() {
  const [comments, setComments] = useState(commentsFromStore || []);
  const [sortType, setSortType] = useState("asc");

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    if (comments.length) {
      const sortedComments = comments.sort((a, b) => {
        const dateA = moment(a.created);
        const dateB = moment(b.created);
        return sortType === "asc" ? dateA - dateB : dateB - dateA;
      });
      const sortedCommentsWithSortedReplies = sortedComments.map((comment) => ({
        ...comment,
        comments: comment?.comments?.sort((a, b) => {
          const dateA = moment(a.created);
          const dateB = moment(b.created);
          return sortType === "asc" ? dateA - dateB : dateB - dateA;
        }),
      }));
      setComments(sortedCommentsWithSortedReplies);
    }
  }, [sortType]);

  const onPost = (comment) => {
    setComments((prev) => [
      { id: comments.length + 1, ...comment, created: moment() },
      ...prev,
    ]);
  };

  const onSave = (id, parentCommentId, text) => {
    if (!parentCommentId) {
      setComments(
        comments.map((comment) => {
          if (comment.id === id) {
            return {
              ...comment,
              updated: moment(),
              comment: text,
            };
          }
          return comment;
        }),
      );
    } else {
      const { index: indexOfComment } = findChildCommentIndex(
        id,
        parentCommentId,
        comments,
      );
      if (indexOfComment !== -1) {
        setComments(
          comments.map((comment) => {
            if (comment.id === parentCommentId) {
              const childComment = comment.comments[indexOfComment];
              const modifiedComment = { ...childComment, comment: text };
              return {
                ...comment,
                updated: moment(),
                comments: comment.comments.map((childComment) => {
                  if (childComment.id === id) {
                    return modifiedComment;
                  }
                  return childComment;
                }),
              };
            }
            return comment;
          }),
        );
      }
    }
  };

  const onReply = (id, reply) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === id) {
          return {
            ...comment,
            comments: [
              { id: (comment?.comments?.length || 0) + 1, ...reply },
              ...(comment.comments || []),
            ],
          };
        }
        return comment;
      }),
    );
  };

  const onDelete = (id, parentCommentId) => {
    if (!parentCommentId) {
      const indexOfComment = comments.findIndex((comment) => comment.id === id);
      comments.splice(indexOfComment, 1);
      setComments([...comments]);
    } else {
      const { index: indexOfComment, parent: parentComment } =
        findChildCommentIndex(id, parentCommentId, comments);
      if (indexOfComment !== -1) {
        parentComment.comments.splice(indexOfComment, 1);
        setComments(
          comments.map((comment) => {
            if (comment.id === parentCommentId) {
              return {
                ...comment,
                comments: [...parentComment.comments],
              };
            }
            return comment;
          }),
        );
      }
    }
  };

  return (
    <div className="mx-auto md:w-full lg:w-8/12 xl:w-8/12 2xl:w-6/12 bg-white p-8">
      <Comment onPost={onPost} />
      <div className="mt-4">
        {comments.length > 0 && (
          <div className="flex justify-end">
            <label>Sort By:&nbsp;</label>
            <button
              onClick={() =>
                setSortType((prev) => (prev === "asc" ? "desc" : "asc"))
              }
            >
              Date and Time{" "}
              {sortType === "asc" ? (
                <i className="fa fa-arrow-down"></i>
              ) : (
                <i className="fa fa-arrow-up"></i>
              )}
            </button>
          </div>
        )}
        {comments.map((comment) => (
          <ShowComment
            key={comment.id}
            comment={comment}
            onSave={onSave}
            onReply={onReply}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
